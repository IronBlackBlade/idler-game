var craftingIntervalId = null;

const DEFAULT_CRAFTING_DURATION_SECONDS = 10;
const MAX_CRAFTING_QUEUE_SIZE = 10;

function getRecipeRequiredCraftingLevel(recipe) {
  return Math.max(1, Math.floor(Number(recipe?.requiredCraftingLevel) || 1));
}

function getRecipeCraftingExp(recipe) {
  return Math.max(1, Math.floor(Number(recipe?.craftingExp) || 10));
}

function hasRequiredCraftingLevel(recipe) {
  ensureCraftingState();

  return player.crafting.level >= getRecipeRequiredCraftingLevel(recipe);
}

function getCraftingExpToNextLevel(level) {
  const safeLevel = Math.max(1, Math.floor(Number(level) || 1));

  return Math.floor(
    100 + (safeLevel - 1) * 50 + Math.pow(safeLevel - 1, 1.25) * 25,
  );
}

function ensureCraftingState() {
  if (!player.crafting || typeof player.crafting !== "object") {
    player.crafting = {
      level: 1,
      exp: 0,
      expToNextLevel: getCraftingExpToNextLevel(1),
      queue: [],
    };
  }

  player.crafting.level = Math.max(
    1,
    Math.floor(Number(player.crafting.level) || 1),
  );

  player.crafting.exp = Math.max(
    0,
    Math.floor(Number(player.crafting.exp) || 0),
  );

  player.crafting.expToNextLevel = getCraftingExpToNextLevel(
    player.crafting.level,
  );


  if (!Array.isArray(player.crafting.queue)) {
    player.crafting.queue = [];
  }
}




function getRecipeCraftingDurationMs(recipe) {
  const durationSeconds = Math.max(
    1,
    Number(recipe?.craftingTimeSeconds) || DEFAULT_CRAFTING_DURATION_SECONDS,
  );

  return Math.round(durationSeconds * 1000);
}

function createCraftingQueueJob(recipe, craftCount) {
  const safeCraftCount = normalizeCraftCount(craftCount);

  return {
    id:
      "crafting_job_" +
      Date.now() +
      "_" +
      Math.random().toString(36).slice(2, 8),

    recipeId: recipe.id,
    totalCraftCount: safeCraftCount,
    completedCraftCount: 0,

    reservedGoldCost: getRecipeTotalGoldCost(
      recipe,
      safeCraftCount,
    ),

    reservedMaterials: recipe.materials.map((material) => {
      return {
        itemId: material.itemId,
        quantity: material.quantity * safeCraftCount,
      };
    }),

    craftingDurationMs: getRecipeCraftingDurationMs(recipe),
    cycleStartedAt: 0,
    cycleFinishesAt: 0,
  };
}

function getCraftingJobRefund(job) {
  const totalCount = Math.max(
    1,
    Number(job.totalCraftCount) || 1,
  );

  const completedCount = Math.max(
    0,
    Math.min(
      totalCount,
      Number(job.completedCraftCount) || 0,
    ),
  );

  const remainingCount = totalCount - completedCount;

  const goldPerCraft =
    job.reservedGoldCost / totalCount;

  const materials = job.reservedMaterials.map((material) => {
    const quantityPerCraft =
      material.quantity / totalCount;

    return {
      itemId: material.itemId,
      quantity: Math.round(
        quantityPerCraft * remainingCount,
      ),
    };
  });

  return {
    remainingCount,
    gold: Math.round(
      goldPerCraft * remainingCount,
    ),
    materials,
  };
}

function reserveCraftingJobResources(job) {
  const hasEnoughGold =
    player.gold >= job.reservedGoldCost;

  const hasEnoughMaterials =
    job.reservedMaterials.every((material) => {
      return (
        getCraftingItemQuantity(material.itemId) >=
        material.quantity
      );
    });

  if (!hasEnoughGold || !hasEnoughMaterials) {
    return false;
  }

  player.gold -= job.reservedGoldCost;

  job.reservedMaterials.forEach((material) => {
    removeCraftingItem(
      material.itemId,
      material.quantity,
    );
  });

  normalizePlayerResourcesAfterCrafting();

  return true;
}

function refundCraftingJobResources(job) {
  const refund = getCraftingJobRefund(job);

  player.gold += refund.gold;

  refund.materials.forEach((material) => {
    if (material.quantity <= 0) {
      return;
    }

    addItemToInventory(
      material.itemId,
      material.quantity,
    );
  });

  return refund;
}

function cancelCraftingQueueJob(jobId) {
  const queue = getCraftingQueue();

  const jobIndex = queue.findIndex((job) => {
    return job.id === jobId;
  });

  if (jobIndex === -1) {
    return false;
  }

  const job = queue[jobIndex];

  const refund =
    refundCraftingJobResources(job);

  queue.splice(jobIndex, 1);

  if (typeof saveGame === "function") {
    saveGame();
  }

  if (typeof render === "function") {
    render();
  }

  if (typeof showNotification === "function") {
    showNotification(
      "Anulowano zadanie. Zwrócono " +
      refund.gold +
      " złota.",
      "success",
    );
  }

  return true;
}

function getCraftingQueue() {
  ensureCraftingState();

  return player.crafting.queue;
}

function getActiveCraftingQueueJob() {
  const queue = getCraftingQueue();

  return queue[0] || null;
}

function moveCraftingQueueJob(jobId, targetIndex) {
  const queue = getCraftingQueue();

  const sourceIndex = queue.findIndex((job) => {
    return job.id === jobId;
  });

  // Nie znaleziono zadania albo próbowano przesunąć aktywne zadanie.
  if (sourceIndex <= 0) {
    return false;
  }

  const normalizedTargetIndex = Math.floor(Number(targetIndex));

  if (!Number.isFinite(normalizedTargetIndex)) {
    return false;
  }

  // Pozycja 0 jest zarezerwowana dla aktywnego zadania.
  const safeTargetIndex = Math.max(
    1,
    Math.min(queue.length - 1, normalizedTargetIndex),
  );

  if (sourceIndex === safeTargetIndex) {
    return false;
  }

  const [movedJob] = queue.splice(sourceIndex, 1);

  queue.splice(safeTargetIndex, 0, movedJob);

  if (typeof saveGame === "function") {
    saveGame();
  }

  return true;
}

function getCraftingQueueProgressPercent() {
  const job = getActiveCraftingQueueJob();

  if (
    !job ||
    job.cycleStartedAt <= 0 ||
    job.craftingDurationMs <= 0
  ) {
    return 0;
  }

  const elapsed =
    Date.now() - job.cycleStartedAt;

  return Math.max(
    0,
    Math.min(
      100,
      elapsed /
      job.craftingDurationMs *
      100,
    ),
  );
}

function getCraftingQueueRemainingSeconds() {
  const job = getActiveCraftingQueueJob();

  if (!job) {
    return 0;
  }

  const currentCycleRemaining =
    Math.max(
      0,
      job.cycleFinishesAt - Date.now(),
    );

  const laterCycles = Math.max(
    0,
    job.totalCraftCount -
    job.completedCraftCount -
    1,
  );

  const totalRemainingMilliseconds =
    currentCycleRemaining +
    laterCycles * job.craftingDurationMs;

  return Math.ceil(
    totalRemainingMilliseconds / 1000,
  );
}

function getDueCraftingCycleCount(
  job,
  currentTime = Date.now(),
) {
  if (
    !job ||
    job.craftingDurationMs <= 0 ||
    job.cycleFinishesAt <= 0
  ) {
    return 0;
  }

  if (currentTime < job.cycleFinishesAt) {
    return 0;
  }

  const remainingCraftCount =
    job.totalCraftCount -
    job.completedCraftCount;

  const overdueTime =
    currentTime - job.cycleFinishesAt;

  const finishedCycles =
    Math.floor(
      overdueTime /
      job.craftingDurationMs,
    ) + 1;

  return Math.min(
    remainingCraftCount,
    finishedCycles,
  );
}

function startNextCraftingQueueJob(
  startTime = Date.now(),
) {
  const job = getActiveCraftingQueueJob();

  if (!job) {
    return null;
  }

  const cycleAlreadyStarted =
    job.cycleStartedAt > 0 &&
    job.cycleFinishesAt > 0;

  if (cycleAlreadyStarted) {
    return job;
  }

  const now = Math.max(
    0,
    Number(startTime) || Date.now(),
  );

  job.cycleStartedAt = now;
  job.cycleFinishesAt =
    now + job.craftingDurationMs;

  if (typeof saveGame === "function") {
    saveGame();
  }

  return job;
}

function addCraftingQueueJob(recipe, craftCount) {
  const safeCraftCount =
    normalizeCraftCount(craftCount);

  const queue = getCraftingQueue();

  if (
    queue.length >=
    MAX_CRAFTING_QUEUE_SIZE
  ) {
    if (typeof showNotification === "function") {
      showNotification(
        "Kolejka jest pełna. Maksymalnie 10 zadań.",
        "error",
      );
    }

    return null;
  }

  if (!canCraftRecipe(recipe, safeCraftCount)) {
    if (typeof showNotification === "function") {
      showNotification(
        "Brakuje materiałów, złota albo wymaganego poziomu.",
        "error",
      );
    }

    return null;
  }

  const equipmentUsageConfirmed =
    confirmCraftingQueueEquipmentUsage(
      recipe,
      safeCraftCount,
    );

  if (!equipmentUsageConfirmed) {
    return null;
  }


  const job = createCraftingQueueJob(
    recipe,
    safeCraftCount,
  );

  const resourcesReserved =
    reserveCraftingJobResources(job);

  if (!resourcesReserved) {
    return null;
  }

  queue.push(job);

  if (queue.length === 1) {
    startNextCraftingQueueJob();
  }

  if (typeof saveGame === "function") {
    saveGame();
  }

  return job;
}



function addCraftingExp(amount) {
  ensureCraftingState();

  const expGain = Math.max(0, Math.floor(Number(amount) || 0));

  if (expGain <= 0) {
    return;
  }

  player.crafting.exp += expGain;

  let gainedLevels = 0;

  while (player.crafting.exp >= player.crafting.expToNextLevel) {
    player.crafting.exp -= player.crafting.expToNextLevel;

    player.crafting.level++;

    player.crafting.expToNextLevel = getCraftingExpToNextLevel(
      player.crafting.level,
    );

    gainedLevels++;
  }

  if (gainedLevels > 0 && typeof showNotification === "function") {
    showNotification(
      "Poziom rzemiosła wzrósł do " + player.crafting.level + "!",
      "success",
    );
  }
}

function getInventoryItemQuantity(itemId) {
  if (!Array.isArray(player.inventory)) {
    player.inventory = [];
  }

  const inventoryItem = player.inventory.find((item) => {
    return item.itemId === itemId;
  });

  return inventoryItem ? inventoryItem.quantity : 0;
}

function getFinalCraftingGoldCost(recipe) {
  if (!recipe) {
    return 0;
  }

  const baseCost = recipe.goldCost || 0;

  const reduction =
    typeof getCraftingGoldReduction === "function"
      ? getCraftingGoldReduction()
      : 0;

  return Math.max(0, Math.ceil(baseCost * (1 - reduction / 100)));
}

function normalizeCraftCount(craftCount) {
  return Math.max(1, Math.floor(Number(craftCount) || 1));
}

function getRecipeResultQuantity(recipe) {
  if (!recipe) {
    return 1;
  }

  return Math.max(1, Math.floor(Number(recipe.resultQuantity) || 1));
}

function getRecipeTotalGoldCost(recipe, craftCount = 1) {
  const safeCraftCount = normalizeCraftCount(craftCount);

  /*
   * Koszt jednego wykonania,
   * już po uwzględnieniu zniżki.
   */
  const singleCraftGoldCost = getFinalCraftingGoldCost(recipe);

  /*
   * Koszt jednego wykonania
   * mnożymy przez liczbę wykonań.
   */
  return singleCraftGoldCost * safeCraftCount;
}

function getRecipeMaxCraftCountByMaterials(recipe) {
  if (
    !recipe ||
    !Array.isArray(recipe.materials) ||
    recipe.materials.length === 0
  ) {
    return Number.MAX_SAFE_INTEGER;
  }

  const materialLimits = recipe.materials.map((material) => {
    const ownedQuantity = getCraftingItemQuantity(material.itemId);

    const requiredQuantity = Math.max(
      1,
      Math.floor(Number(material.quantity) || 1),
    );

    return Math.floor(ownedQuantity / requiredQuantity);
  });

  return Math.min(...materialLimits);
}

function getRecipeMaxCraftCountByGold(recipe) {
  const singleCraftGoldCost = getFinalCraftingGoldCost(recipe);

  /*
   * Darmowa receptura nie jest
   * ograniczona przez złoto.
   */
  if (singleCraftGoldCost <= 0) {
    return Number.MAX_SAFE_INTEGER;
  }

  const playerGold = Math.max(0, Number(player.gold) || 0);

  return Math.floor(playerGold / singleCraftGoldCost);
}

function getMaxRecipeCraftCount(recipe) {
  if (!recipe) {
    return 0;
  }

  if (!hasRequiredCraftingLevel(recipe)) {
    return 0;
  }

  if (!isRecipeUnlocked(recipe.id)) {
    return 0;
  }

  const materialLimit = getRecipeMaxCraftCountByMaterials(recipe);

  const goldLimit = getRecipeMaxCraftCountByGold(recipe);

  const maximumCraftCount = Math.min(materialLimit, goldLimit);

  /*
   * Limit bezpieczeństwa.
   * Nie pozwalamy wykonać więcej niż
   * 9999 operacji jednym kliknięciem.
   */
  return Math.max(0, Math.min(9999, Math.floor(maximumCraftCount)));
}

function getEquippedCraftingItemSlots(itemId) {
  if (!player.equipment || typeof player.equipment !== "object") {
    return [];
  }

  return Object.entries(player.equipment)
    .filter(([slot, equippedItemId]) => {
      return equippedItemId === itemId;
    })
    .map(([slot]) => slot);
}

function getEquippedCraftingItemQuantity(itemId) {
  return getEquippedCraftingItemSlots(itemId).length;
}

function getCraftingItemQuantity(itemId) {
  const inventoryQuantity = getInventoryItemQuantity(itemId);

  const equippedQuantity = getEquippedCraftingItemQuantity(itemId);

  return inventoryQuantity + equippedQuantity;
}

function getRecipeEquippedMaterials(recipe, craftCount = 1) {
  if (!recipe || !Array.isArray(recipe.materials)) {
    return [];
  }

  const safeCraftCount = normalizeCraftCount(craftCount);

  return recipe.materials
    .map((material) => {
      const inventoryQuantity = getInventoryItemQuantity(material.itemId);

      const equippedQuantity = getEquippedCraftingItemQuantity(material.itemId);

      const totalRequiredQuantity = material.quantity * safeCraftCount;

      /*
       * Najpierw korzystamy
       * z egzemplarzy w plecaku.
       */
      const missingFromInventory = Math.max(
        0,
        totalRequiredQuantity - inventoryQuantity,
      );

      /*
       * Tylko brakującą część
       * bierzemy z wyposażenia.
       */
      const quantityFromEquipment = Math.min(
        equippedQuantity,
        missingFromInventory,
      );

      if (quantityFromEquipment <= 0) {
        return null;
      }

      return {
        itemId: material.itemId,

        quantity: quantityFromEquipment,
      };
    })
    .filter(Boolean);
}

function confirmCraftingQueueEquipmentUsage(
  recipe,
  craftCount,
) {
  const equippedMaterials =
    getRecipeEquippedMaterials(
      recipe,
      craftCount,
    );

  if (equippedMaterials.length === 0) {
    return true;
  }

  const materialsText =
    equippedMaterials
      .map((material) => {
        const item = items[material.itemId];

        return (
          "• " +
          (item?.name || material.itemId) +
          " x" +
          material.quantity
        );
      })
      .join("\n");

  return window.confirm(
    "To zadanie zużyje założone wyposażenie:\n\n" +
    materialsText +
    "\n\nKontynuować?",
  );
}

function removeCraftingItem(itemId, requestedAmount) {
  let remainingAmount = Math.max(0, Math.floor(Number(requestedAmount) || 0));

  if (remainingAmount <= 0) {
    return true;
  }

  /*
   * Najpierw zużywamy egzemplarze
   * znajdujące się w plecaku.
   */
  const inventoryQuantity = getInventoryItemQuantity(itemId);

  const inventoryAmount = Math.min(inventoryQuantity, remainingAmount);

  if (inventoryAmount > 0) {
    removeItemFromInventory(itemId, inventoryAmount);

    remainingAmount -= inventoryAmount;
  }

  /*
   * Dopiero gdy w plecaku zabrakło
   * przedmiotów, zużywamy wyposażenie.
   */
  if (remainingAmount > 0) {
    const equippedSlots = getEquippedCraftingItemSlots(itemId);

    for (const slot of equippedSlots) {
      if (remainingAmount <= 0) {
        break;
      }

      player.equipment[slot] = null;

      remainingAmount--;
    }
  }

  if (remainingAmount > 0) {
    console.warn(
      "Nie udało się usunąć wszystkich składników:",
      itemId,
      remainingAmount,
    );

    return false;
  }

  return true;
}

function normalizePlayerResourcesAfterCrafting() {
  if (typeof getDerivedStats !== "function") {
    return;
  }

  const derived = getDerivedStats();

  player.hp = Math.min(Number(player.hp) || 0, derived.maxHp);

  player.mana = Math.min(Number(player.mana) || 0, derived.maxMana);
}

function isRecipeUnlocked(recipeId) {
  const recipe = recipes.find((recipe) => {
    return recipe.id === recipeId;
  });

  if (!recipe) {
    return false;
  }

  if (recipe.requiresScroll === false) {
    return true;
  }

  if (!Array.isArray(player.unlockedRecipes)) {
    player.unlockedRecipes = [];
  }

  return player.unlockedRecipes.includes(recipeId);
}

function getRecipeScrollItem(recipeId) {
  return Object.values(items).find((item) => {
    return item.type === "recipe" && item.recipeId === recipeId;
  });
}

function canCraftRecipe(recipe, craftCount = 1) {
  if (!recipe) {
    return false;
  }

  if (!hasRequiredCraftingLevel(recipe)) {
    return false;
  }

  if (!isRecipeUnlocked(recipe.id)) {
    return false;
  }

  const safeCraftCount = normalizeCraftCount(craftCount);

  const totalGoldCost = getRecipeTotalGoldCost(recipe, safeCraftCount);

  if (player.gold < totalGoldCost) {
    return false;
  }

  return recipe.materials.every((material) => {
    const totalRequiredQuantity = material.quantity * safeCraftCount;

    return getCraftingItemQuantity(material.itemId) >= totalRequiredQuantity;
  });
}


function addCompletedCraftingResults(
  recipe,
  completedCraftCount,
) {
  const resultQuantity =
    getRecipeResultQuantity(recipe) *
    completedCraftCount;

  addItemToInventory(
    recipe.resultItemId,
    resultQuantity,
  );

  const craftingExp =
    getRecipeCraftingExp(recipe) *
    completedCraftCount;

  addCraftingExp(craftingExp);
}

function notifyCraftingQueueJobCompleted(
  recipe,
  job,
) {
  const resultItem =
    items[recipe.resultItemId];

  const resultName =
    resultItem?.name || recipe.name;

  const totalResultQuantity =
    getRecipeResultQuantity(recipe) *
    job.totalCraftCount;

  const message =
    "Wytworzono: " +
    resultName +
    " x" +
    totalResultQuantity;

  if (typeof showNotification === "function") {
    showNotification(
      message,
      "success",
    );
  }

  if (typeof addSystemLog === "function") {
    addSystemLog(
      "⚒️ " + message + ".",
      "crafting",
    );
  }

  if (typeof addCombatLog === "function") {
    addCombatLog(
      "⚒️ " + message + ".",
    );
  }
}

function completeCraftingQueueCycle(
  job,
  completedCycleCount = 1,
) {
  if (!job) {
    return false;
  }

  const remainingCraftCount =
    job.totalCraftCount -
    job.completedCraftCount;

  if (remainingCraftCount <= 0) {
    return false;
  }

  const safeCompletedCycleCount = Math.min(
    remainingCraftCount,
    Math.max(
      1,
      Math.floor(
        Number(completedCycleCount) || 1,
      ),
    ),
  );

  const firstCycleFinishesAt =
    job.cycleFinishesAt;

  const lastCompletedCycleFinishesAt =
    firstCycleFinishesAt +
    (safeCompletedCycleCount - 1) *
    job.craftingDurationMs;

  const recipe = recipes.find((recipeEntry) => {
    return recipeEntry.id === job.recipeId;
  });

  if (!recipe) {
    cancelCraftingQueueJob(job.id);
    return false;
  }

  addCompletedCraftingResults(
    recipe,
    safeCompletedCycleCount,
  );

  job.completedCraftCount +=
    safeCompletedCycleCount;

  const jobFinished =
    job.completedCraftCount >=
    job.totalCraftCount;

  if (jobFinished) {
    notifyCraftingQueueJobCompleted(
      recipe,
      job,
    );

    const queue = getCraftingQueue();

    const jobIndex = queue.findIndex((queueJob) => {
      return queueJob.id === job.id;
    });

    if (jobIndex !== -1) {
      queue.splice(jobIndex, 1);
    }
  }

  if (jobFinished) {
    startNextCraftingQueueJob(
      lastCompletedCycleFinishesAt,
    );
  } else {
    job.cycleStartedAt =
      lastCompletedCycleFinishesAt;

    job.cycleFinishesAt =
      lastCompletedCycleFinishesAt +
      job.craftingDurationMs;
  }

  if (typeof saveGame === "function") {
    saveGame();
  }

  if (typeof render === "function") {
    render();
  }

  if (
    typeof refreshCraftingView ===
    "function"
  ) {
    refreshCraftingView();
  }

  return true;
}



function updateCraftingJob() {

  const queueJob =
    getActiveCraftingQueueJob();

  if (queueJob) {
    const cycleNotStarted =
      queueJob.cycleStartedAt <= 0 ||
      queueJob.cycleFinishesAt <= 0;

    if (cycleNotStarted) {
      startNextCraftingQueueJob();
      return;
    }

    const dueCycleCount =
      getDueCraftingCycleCount(queueJob);

    if (dueCycleCount > 0) {
      completeCraftingQueueCycle(
        queueJob,
        dueCycleCount,
      );

      return;
    }

    if (
      typeof updateCraftingProgressUI ===
      "function"
    ) {
      updateCraftingProgressUI();
    }

    return;
  }

}

function startCraftingTimer() {
  if (craftingIntervalId !== null || typeof setInterval !== "function") {
    return;
  }

  craftingIntervalId = setInterval(
    updateCraftingJob,
    100,
  );
}

function unlockRecipe(recipeId) {
  const recipe = recipes.find((recipe) => {
    return recipe.id === recipeId;
  });

  if (!recipe) {
    console.warn("Nie znaleziono receptury:", recipeId);

    return;
  }

  if (recipe.requiresScroll === false) {
    console.warn("Ta receptura jest dostępna od razu:", recipe.name);

    return;
  }

  if (isRecipeUnlocked(recipeId)) {
    if (typeof showNotification === "function") {
      showNotification("Ta receptura jest już odblokowana.", "error");
    }

    return;
  }

  const recipeScroll = getRecipeScrollItem(recipeId);

  if (!recipeScroll) {
    console.warn("Nie znaleziono zwoju receptury:", recipeId);

    return;
  }

  const ownedScrolls = getInventoryItemQuantity(recipeScroll.id);

  if (ownedScrolls <= 0) {
    if (typeof showNotification === "function") {
      showNotification("Nie posiadasz tej receptury.", "error");
    }

    return;
  }

  const unlockCost = recipe.unlockCost || 0;

  if (player.gold < unlockCost) {
    if (typeof showNotification === "function") {
      showNotification(
        `Nie masz wystarczająco złota. Potrzebujesz ${unlockCost} 💰.`,
        "error",
      );
    }

    return;
  }

  if (!Array.isArray(player.unlockedRecipes)) {
    player.unlockedRecipes = [];
  }

  player.gold -= unlockCost;

  removeItemFromInventory(recipeScroll.id, 1);

  player.unlockedRecipes.push(recipeId);

  if (typeof showNotification === "function") {
    showNotification(`Odblokowano recepturę: ${recipe.name}`, "success");
  }

  if (typeof addCombatLog === "function") {
    addCombatLog("📜 Odblokowano recepturę: " + recipe.name + ".");
  }

  if (typeof addSystemLog === "function") {
    addSystemLog(
      "📜 Odblokowano recepturę: " +
      recipe.name +
      " za " +
      unlockCost +
      " złota.",
      "recipe",
    );
  }

  saveGame();
  render();

  if (typeof refreshCraftingView === "function") {
    refreshCraftingView();
  }
}

startCraftingTimer();
