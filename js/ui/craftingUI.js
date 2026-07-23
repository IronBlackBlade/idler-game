const savedCraftingCategory =
  localStorage.getItem(
    "idler_crafting_category",
  );

let currentCraftingCategory =
  savedCraftingCategory || null;

const savedArmorerSubcategory =
  localStorage.getItem(
    "idler_armorer_subcategory",
  );

let currentArmorerSubcategory =
  savedArmorerSubcategory || "all";


const savedTannerSubcategory =
  localStorage.getItem(
    "idler_tanner_subcategory",
  );

let currentTannerSubcategory =
  savedTannerSubcategory || "all";

const savedBowyerSubcategory =
  localStorage.getItem(
    "idler_bowyer_subcategory",
  );

let currentBowyerSubcategory =
  savedBowyerSubcategory || "all";

const savedArcanistSubcategory =
  localStorage.getItem(
    "idler_arcanist_subcategory",
  );

let currentArcanistSubcategory =
  savedArcanistSubcategory || "all";

const savedJewelerSubcategory =
  localStorage.getItem(
    "idler_jeweler_subcategory",
  );

let currentJewelerSubcategory =
  savedJewelerSubcategory || "all";


const craftingBatchCounts = {};


function getCraftingRecipeById(recipeId) {
  return (
    recipes.find((recipe) => {
      return recipe.id === recipeId;
    }) || null
  );
}

function getCraftingBatchCount(recipeId) {
  return Math.max(
    1,
    Math.min(9999, Math.floor(Number(craftingBatchCounts[recipeId]) || 1)),
  );
}

function setCraftingBatchCount(recipeId, value) {
  craftingBatchCounts[recipeId] = Math.max(
    1,
    Math.min(9999, Math.floor(Number(value) || 1)),
  );

  updateCraftingBatchPreview(recipeId);
}

function changeCraftingBatchCount(recipeId, change) {
  const recipe = getCraftingRecipeById(recipeId);

  if (!recipe) {
    return;
  }

  const currentCount = getCraftingBatchCount(recipeId);

  const maximumCount = getMaxRecipeCraftCount(recipe);

  let newCount = currentCount + change;

  /*
   * Przycisk plus nie pozwala
   * przekroczyć aktualnego maksimum.
   */
  if (change > 0 && maximumCount > 0) {
    newCount = Math.min(newCount, maximumCount);
  }

  setCraftingBatchCount(recipeId, newCount);
}

function setMaximumCraftingBatchCount(recipeId) {
  const recipe = getCraftingRecipeById(recipeId);

  if (!recipe) {
    return;
  }

  const maximumCount = getMaxRecipeCraftCount(recipe);

  if (maximumCount <= 0) {
    setCraftingBatchCount(recipeId, 1);

    if (typeof showNotification === "function") {
      showNotification(
        "Brakuje materiałów lub złota na wykonanie tej receptury.",
        "error",
      );
    }

    return;
  }

  setCraftingBatchCount(recipeId, maximumCount);
}

function updateCraftingBatchPreview(recipeId, preserveInputValue = false) {
  const recipe = getCraftingRecipeById(recipeId);

  if (!recipe) {
    return;
  }

  const card = document.querySelector(
    `[data-crafting-recipe-id="${recipeId}"]`,
  );

  if (!card) {
    return;
  }

  const craftCount = getCraftingBatchCount(recipeId);

  const maximumCount = getMaxRecipeCraftCount(recipe);

  const singleResultQuantity = getRecipeResultQuantity(recipe);

  const totalResultQuantity = singleResultQuantity * craftCount;

  const totalGoldCost = getRecipeTotalGoldCost(recipe, craftCount);

  const baseTotalGoldCost = (Number(recipe.goldCost) || 0) * craftCount;

  const canCraft =
    canCraftRecipe(recipe, craftCount);

  const countInput = card.querySelector(".crafting-count-input");

  if (countInput && !preserveInputValue) {
    countInput.value = craftCount;
  }

  if (countInput) {
    countInput.classList.toggle("invalid", craftCount > maximumCount);
  }

  const maximumElement = card.querySelector("[data-crafting-max-count]");

  if (maximumElement) {
    maximumElement.textContent = maximumCount;
  }

  const totalResultElement = card.querySelector("[data-crafting-total-result]");

  if (totalResultElement) {
    totalResultElement.textContent = "x" + totalResultQuantity;
  }

  const totalCostElement = card.querySelector("[data-crafting-total-cost]");

  if (totalCostElement) {
    totalCostElement.innerHTML =
      totalGoldCost < baseTotalGoldCost
        ? "<s>" + baseTotalGoldCost + "</s> " + totalGoldCost
        : totalGoldCost;
  }

  const craftButton = card.querySelector('[data-crafting-action="craft"]');

  if (craftButton) {
    craftButton.textContent =
      "Dodaj x" + totalResultQuantity;

    craftButton.disabled = !canCraft;

    craftButton.classList.toggle("crafting-button-unavailable", !canCraft);
  }

  const decreaseButton = card.querySelector(
    '[data-crafting-action="decrease"]',
  );

  if (decreaseButton) {
    decreaseButton.disabled = craftCount <= 1;
  }

  const increaseButton = card.querySelector(
    '[data-crafting-action="increase"]',
  );

  if (increaseButton) {
    increaseButton.disabled = maximumCount <= 0 || craftCount >= maximumCount;
  }

  const maximumButton = card.querySelector('[data-crafting-action="maximum"]');

  if (maximumButton) {
    maximumButton.disabled = maximumCount <= 0;
  }

  /*
   * Aktualizujemy wymagania materiałów.
   */
  recipe.materials.forEach((material) => {
    const materialElement = card.querySelector(
      `[data-crafting-material-id="${material.itemId}"]`,
    );

    if (!materialElement) {
      return;
    }

    const materialItem = items[material.itemId];

    const ownedQuantity = getCraftingItemQuantity(material.itemId);

    const requiredQuantity = material.quantity * craftCount;

    const equippedQuantity = getEquippedCraftingItemQuantity(material.itemId);

    const hasEnough = ownedQuantity >= requiredQuantity;

    const equippedText =
      equippedQuantity > 0 ? " — założone: " + equippedQuantity : "";

    materialElement.classList.toggle("material-ok", hasEnough);

    materialElement.classList.toggle("material-missing", !hasEnough);

    materialElement.innerHTML = `
                ${hasEnough ? "✅" : "❌"}
                ${materialItem?.name || material.itemId}:
                ${ownedQuantity}/${requiredQuantity}
                ${equippedText}
            `;
  });

  card.classList.toggle("crafting-batch-over-limit", craftCount > maximumCount);
}

function setCraftingCategory(categoryId) {
  currentCraftingCategory = categoryId;

  localStorage.setItem("idler_crafting_category", categoryId);

  renderCrafting();
}

const craftingCategories = [
  {
    id: "metallurgy",
    name: "🔥 Metalurg",
  },

  {
    id: "tanner",
    name: "🧵 Garbarz",
  },

  {
    id: "blacksmith",
    name: "⚔️ Kowal",
  },
  {
    id: "bowyer",
    name: "🏹 Łuczarz",
  },
  {
    id: "arcanist",
    name: "🪄 Arkanista",
  },
  {
    id: "armorer",
    name: "🛡️ Płatnerz",
  },

  {
    id: "jeweler",
    name: "💍 Jubiler",
  },
  {
    id: "shaman",
    name: "🪬 Szaman",
  },
];

const armorerSubcategories = [
  {
    id: "all",
    name: "Wszystko",
  },
  {
    id: "materials",
    name: "🧱 Materiały",
  },
  {
    id: "shield",
    name: "🛡️ Tarcze",
  },
  {
    id: "helmet",
    name: "⛑️ Hełmy",
  },
  {
    id: "armor",
    name: "🥋 Pancerze",
  },
  {
    id: "pants",
    name: "👖 Nogawice",
  },
  {
    id: "boots",
    name: "🥾 Buty",
  },
  {
    id: "gloves",
    name: "🧤 Rękawice",
  },
];

const tannerSubcategories = [
  {
    id: "all",
    name: "Wszystko",
  },
  {
    id: "leather",
    name: "🐺 Skóry",
  },
  {
    id: "fabric",
    name: "🧶 Tkaniny",
  },
];

const bowyerSubcategories = [
  {
    id: "all",
    name: "Wszystko",
  },
  {
    id: "bow",
    name: "🏹 Łuki",
  },
  {
    id: "crossbow",
    name: "🎯 Kusze",
  },
];

const arcanistSubcategories = [
  {
    id: "all",
    name: "Wszystko",
  },
  {
    id: "wand",
    name: "🪄 Różdżki",
  },
  {
    id: "staff",
    name: "🔮 Kostury",
  },
];

const jewelerSubcategories = [
  {
    id: "all",
    name: "Wszystko",
  },
  {
    id: "ring",
    name: "💍 Pierścienie",
  },
  {
    id: "amulet",
    name: "📿 Amulety",
  },
];

function getArmorerSubcategory(recipe) {
  const resultItem =
    items[recipe.resultItemId];

  if (!resultItem) {
    return null;
  }

  if (
    recipe.resultItemId ===
    "chitin_plate"
  ) {
    return "materials";
  }

  const supportedItemTypes = [
    "shield",
    "helmet",
    "armor",
    "pants",
    "boots",
    "gloves",
  ];

  if (
    supportedItemTypes.includes(
      resultItem.type,
    )
  ) {
    return resultItem.type;
  }

  return null;
}

function setArmorerSubcategory(
  subcategoryId,
) {
  const subcategoryExists =
    armorerSubcategories.some(
      (subcategory) => {
        return (
          subcategory.id ===
          subcategoryId
        );
      },
    );

  if (!subcategoryExists) {
    return;
  }

  currentArmorerSubcategory =
    subcategoryId;

  localStorage.setItem(
    "idler_armorer_subcategory",
    subcategoryId,
  );

  renderCrafting();
}

function getTannerSubcategory(recipe) {
  if (!recipe) {
    return null;
  }

  return recipe.subcategory || null;
}

function setTannerSubcategory(
  subcategoryId,
) {
  const subcategoryExists =
    tannerSubcategories.some(
      (subcategory) => {
        return (
          subcategory.id ===
          subcategoryId
        );
      },
    );

  if (!subcategoryExists) {
    return;
  }

  currentTannerSubcategory =
    subcategoryId;

  localStorage.setItem(
    "idler_tanner_subcategory",
    subcategoryId,
  );

  renderCrafting();
}

function getBowyerSubcategory(recipe) {
  if (!recipe) {
    return null;
  }

  return recipe.subcategory || null;
}

function setBowyerSubcategory(
  subcategoryId,
) {
  const subcategoryExists =
    bowyerSubcategories.some(
      (subcategory) => {
        return (
          subcategory.id ===
          subcategoryId
        );
      },
    );

  if (!subcategoryExists) {
    return;
  }

  currentBowyerSubcategory =
    subcategoryId;

  localStorage.setItem(
    "idler_bowyer_subcategory",
    subcategoryId,
  );

  renderCrafting();
}

function getArcanistSubcategory(
  recipe,
) {
  if (!recipe) {
    return null;
  }

  return recipe.subcategory || null;
}

function setArcanistSubcategory(
  subcategoryId,
) {
  const subcategoryExists =
    arcanistSubcategories.some(
      (subcategory) => {
        return (
          subcategory.id ===
          subcategoryId
        );
      },
    );

  if (!subcategoryExists) {
    return;
  }

  currentArcanistSubcategory =
    subcategoryId;

  localStorage.setItem(
    "idler_arcanist_subcategory",
    subcategoryId,
  );

  renderCrafting();
}

function getJewelerSubcategory(
  recipe,
) {
  if (!recipe) {
    return null;
  }

  const resultItem =
    items[recipe.resultItemId];

  if (!resultItem) {
    return null;
  }

  if (
    resultItem.type === "ring" ||
    resultItem.type === "amulet"
  ) {
    return resultItem.type;
  }

  return null;
}

function setJewelerSubcategory(
  subcategoryId,
) {
  const subcategoryExists =
    jewelerSubcategories.some(
      (subcategory) => {
        return (
          subcategory.id ===
          subcategoryId
        );
      },
    );

  if (!subcategoryExists) {
    return;
  }

  currentJewelerSubcategory =
    subcategoryId;

  localStorage.setItem(
    "idler_jeweler_subcategory",
    subcategoryId,
  );

  renderCrafting();
}

const craftingSubcategoryConfigs = {
  armorer: {
    subcategories:
      armorerSubcategories,

    getCurrentSubcategory: () =>
      currentArmorerSubcategory,

    getSubcategory:
      getArmorerSubcategory,

    setSubcategory:
      setArmorerSubcategory,
  },

  tanner: {
    subcategories:
      tannerSubcategories,

    getCurrentSubcategory: () =>
      currentTannerSubcategory,

    getSubcategory:
      getTannerSubcategory,

    setSubcategory:
      setTannerSubcategory,
  },

  bowyer: {
    subcategories:
      bowyerSubcategories,

    getCurrentSubcategory: () =>
      currentBowyerSubcategory,

    getSubcategory:
      getBowyerSubcategory,

    setSubcategory:
      setBowyerSubcategory,
  },

  arcanist: {
    subcategories:
      arcanistSubcategories,

    getCurrentSubcategory: () =>
      currentArcanistSubcategory,

    getSubcategory:
      getArcanistSubcategory,

    setSubcategory:
      setArcanistSubcategory,
  },

  jeweler: {
    subcategories:
      jewelerSubcategories,

    getCurrentSubcategory: () =>
      currentJewelerSubcategory,

    getSubcategory:
      getJewelerSubcategory,

    setSubcategory:
      setJewelerSubcategory,
  },
};

function getCraftingCategory(recipe) {
  const resultItem =
    items[recipe.resultItemId];

  if (!resultItem) {
    return null;
  }

  // Materiały mają kategorię wpisaną
  // bezpośrednio w recepturze.
  if (recipe.category) {
    return recipe.category;
  }

  // Rodzaj broni określa jej wykonawcę.
  if (resultItem.type === "weapon") {
    if (resultItem.weaponType === "ranged") {
      return "bowyer";
    }

    if (resultItem.weaponType === "magic") {
      return "arcanist";
    }

    return "blacksmith";
  }

  const categoryByItemType = {
    shield: "armorer",
    helmet: "armorer",
    armor: "armorer",
    pants: "armorer",
    boots: "armorer",
    gloves: "armorer",

    ring: "jeweler",
    amulet: "jeweler",

    talisman: "shaman",
  };

  return (
    categoryByItemType[resultItem.type] ||
    null
  );
}

function getCraftingRarityLabel(rarity) {
  if (typeof getRarityName === "function") {
    return getRarityName(rarity);
  }

  const rarityNames = {
    common: "Zwykły",
    uncommon: "Niepospolity",
    rare: "Rzadki",
    epic: "Epicki",
    legendary: "Legendarny",
  };

  return rarityNames[rarity] || rarity || "Brak";
}

function formatCraftingTime(seconds) {
  const safeSeconds = Math.max(0, Math.ceil(Number(seconds) || 0));

  if (safeSeconds < 60) {
    return safeSeconds + " s";
  }

  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return minutes + " min " + remainingSeconds + " s";
}

function renderCraftingActivity(container) {

  if (
    typeof getActiveCraftingQueueJob !==
    "function"
  ) {
    return;
  }

  const job =
    getActiveCraftingQueueJob();

  if (!job) {
    return;
  }

  const recipe = getCraftingRecipeById(job.recipeId);

  if (!recipe) {
    return;
  }

  const resultItem = items[recipe.resultItemId];
  const resultName = resultItem?.name || recipe.name;
  const currentCraftNumber = Math.min(
    job.totalCraftCount,
    job.completedCraftCount + 1,
  );
  const progress =
    typeof getCraftingQueueProgressPercent ===
      "function"
      ? getCraftingQueueProgressPercent()
      : 0;
  const remainingSeconds =
    typeof getCraftingQueueRemainingSeconds ===
      "function"
      ? getCraftingQueueRemainingSeconds()
      : 0;

  const activity = document.createElement("section");
  activity.className = "crafting-activity";
  activity.dataset.craftingActivity = "true";

  activity.innerHTML = `
    <div class="crafting-activity-header">
      <div>
        <span class="crafting-activity-label">AKTYWNA PRACA</span>
        <strong>⚒️ ${resultName}</strong>
      </div>

      <span class="crafting-activity-count" data-crafting-activity-count>
        ${currentCraftNumber}/${job.totalCraftCount}
      </span>
    </div>

    <div class="crafting-activity-progress">
      <div
        class="crafting-activity-progress-fill"
        data-crafting-progress-fill
        style="width: ${progress}%;"
      ></div>
    </div>

    <div class="crafting-activity-footer">
      <span data-crafting-progress-text>
        Wytwarzanie ${currentCraftNumber} z ${job.totalCraftCount}
      </span>

      <strong data-crafting-time-remaining>
        Do końca partii: ${formatCraftingTime(remainingSeconds)}
      </strong>
    </div>
  `;

  container.appendChild(activity);
}

function enableCraftingQueueDragging(list) {
  let draggedRow = null;
  let dragHandle = null;
  let activePointerId = null;
  let dragStarted = false;

  function resetDragState() {

    if (draggedRow) {
      dragStarted = true;
      draggedRow.classList.add("is-dragging");
    }

    if (
      dragHandle &&
      activePointerId !== null &&
      dragHandle.hasPointerCapture(activePointerId)
    ) {
      dragHandle.releasePointerCapture(activePointerId);
    }

    draggedRow = null;
    dragHandle = null;
    activePointerId = null;
  }

  list.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    const handle = event.target.closest(
      "[data-crafting-drag-handle]",
    );

    if (!handle || !list.contains(handle)) {
      return;
    }

    const row = handle.closest(
      "[data-crafting-job-id]",
    );

    if (!row || row.classList.contains("is-active")) {
      return;
    }

    event.preventDefault();

    draggedRow = row;
    dragHandle = handle;
    activePointerId = event.pointerId;

    dragHandle.setPointerCapture(activePointerId);

    dragStarted = true;
    draggedRow.classList.add("is-dragging");
  });

  list.addEventListener("pointermove", (event) => {
    if (
      !dragStarted ||
      event.pointerId !== activePointerId
    ) {
      return;
    }

    event.preventDefault();

    const listRectangle =
      list.getBoundingClientRect();

    const scrollEdgeSize = 45;
    const scrollStep = 10;

    const pointerNearTop =
      event.clientY <
      listRectangle.top + scrollEdgeSize;

    const pointerNearBottom =
      event.clientY >
      listRectangle.bottom - scrollEdgeSize;

    if (pointerNearTop) {
      list.scrollTop -= scrollStep;
    } else if (pointerNearBottom) {
      list.scrollTop += scrollStep;
    }

    const waitingRows = Array.from(
      list.querySelectorAll(
        ".crafting-queue-item.is-waiting",
      ),
    );

    const targetRow =
      waitingRows.find((row) => {
        if (row === draggedRow) {
          return false;
        }

        const rectangle =
          row.getBoundingClientRect();

        const pointerInsideHorizontally =
          event.clientX >= rectangle.left &&
          event.clientX <= rectangle.right;

        const pointerInsideVertically =
          event.clientY >= rectangle.top &&
          event.clientY <= rectangle.bottom;

        return (
          pointerInsideHorizontally &&
          pointerInsideVertically
        );
      }) || null;


    if (
      !targetRow ||
      targetRow === draggedRow ||
      !list.contains(targetRow)
    ) {

      return;
    }

    const targetMiddle =
      targetRow.getBoundingClientRect().top +
      targetRow.getBoundingClientRect().height / 2;

    const pointerIsBelowMiddle =
      event.clientY > targetMiddle;

    if (pointerIsBelowMiddle) {
      list.insertBefore(
        draggedRow,
        targetRow.nextSibling,
      );
    } else {
      list.insertBefore(
        draggedRow,
        targetRow,
      );
    }


  });

  list.addEventListener("pointerup", (event) => {
    if (event.pointerId !== activePointerId) {
      return;
    }

    let movedJobId = null;

    if (draggedRow) {
      movedJobId =
        draggedRow.dataset.craftingJobId;
    }

    const currentRows = Array.from(
      list.querySelectorAll(
        "[data-crafting-job-id]",
      ),
    );

    const targetIndex =
      currentRows.indexOf(draggedRow);

    const canMove =
      dragStarted &&
      movedJobId !== null &&
      Number.isInteger(targetIndex);

    resetDragState();

    if (!canMove) {
      return;
    }

    const moved = moveCraftingQueueJob(
      movedJobId,
      targetIndex,
    );

    if (moved) {
      renderCrafting();
    }
  });

  list.addEventListener("pointercancel", () => {
    resetDragState();
  });
}

function renderCraftingQueue(container) {
  if (typeof getCraftingQueue !== "function") {
    return;
  }

  const queue = getCraftingQueue();

  if (queue.length === 0) {
    return;
  }

  const panel = document.createElement("section");
  panel.className = "crafting-queue";

  const header = document.createElement("div");
  header.className = "crafting-queue-header";

  header.innerHTML = `
    <strong>📋 Kolejka wytwarzania</strong>
    <span>${queue.length}</span>
  `;

  const list = document.createElement("div");
  list.className = "crafting-queue-list";

  queue.forEach((job, index) => {
    const recipe =
      getCraftingRecipeById(job.recipeId);

    if (!recipe) {
      return;
    }

    const row = document.createElement("div");
    row.className = "crafting-queue-item";
    row.dataset.craftingJobId = job.id;
    row.dataset.craftingQueueIndex = String(index);

    row.classList.add(
      index === 0 ? "is-active" : "is-waiting",
    );

    const information =
      document.createElement("div");

    information.className =
      "crafting-queue-item-info";

    const name = document.createElement("strong");

    name.textContent = recipe.name;

    const status = document.createElement("span");

    status.textContent =
      index === 0
        ? "Aktualnie wytwarzane"
        : "Pozycja w kolejce";

    information.appendChild(status);
    information.appendChild(name);


    const positionBadge =
      document.createElement("div");

    positionBadge.className =
      "crafting-queue-number";

    positionBadge.textContent =
      index === 0 ? "⚒️" : String(index);

    const sideStatus =
      document.createElement("div");

    sideStatus.className =
      "crafting-queue-side-status";

    sideStatus.textContent =
      index === 0
        ? "W trakcie"
        : "x" + job.totalCraftCount;

    const cancelButton =
      document.createElement("button");

    cancelButton.type = "button";
    cancelButton.className =
      "crafting-queue-cancel";

    cancelButton.textContent = "Anuluj";

    cancelButton.addEventListener("click", () => {
      const canceled =
        cancelCraftingQueueJob(job.id);

      if (canceled) {
        renderCrafting();
      }
    });


    row.appendChild(information);

    if (index > 0) {
      const dragHandle = document.createElement("button");

      dragHandle.type = "button";
      dragHandle.className =
        "crafting-queue-drag-handle";

      dragHandle.dataset.craftingDragHandle = "true";
      dragHandle.textContent = "⠿";
      dragHandle.title = "Przytrzymaj i przeciągnij";

      dragHandle.setAttribute(
        "aria-label",
        "Przeciągnij zadanie " + recipe.name,
      );

      row.insertBefore(
        dragHandle,
        information,
      );
    }

    row.insertBefore(
      positionBadge,
      information,
    );

    row.appendChild(sideStatus);
    row.appendChild(cancelButton);
    list.appendChild(row);
  });

  enableCraftingQueueDragging(list);

  panel.appendChild(header);
  panel.appendChild(list);
  container.appendChild(panel);
}

function updateCraftingProgressUI() {
  const activity = document.querySelector("[data-crafting-activity]");

  if (
    !activity ||
    typeof getActiveCraftingQueueJob !==
    "function"
  ) {
    return;
  }

  const job =
    getActiveCraftingQueueJob();

  if (!job) {
    return;
  }

  const currentCraftNumber = Math.min(
    job.totalCraftCount,
    job.completedCraftCount + 1,
  );
  const progress = getCraftingQueueProgressPercent();
  const remainingSeconds = getCraftingQueueRemainingSeconds();
  const progressFill = activity.querySelector("[data-crafting-progress-fill]");
  const progressText = activity.querySelector("[data-crafting-progress-text]");
  const count = activity.querySelector("[data-crafting-activity-count]");
  const timeRemaining = activity.querySelector(
    "[data-crafting-time-remaining]",
  );

  if (progressFill) {
    progressFill.style.width = progress + "%";
  }

  if (progressText) {
    progressText.textContent =
      "Wytwarzanie " + currentCraftNumber + " z " + job.totalCraftCount;
  }

  if (count) {
    count.textContent = currentCraftNumber + "/" + job.totalCraftCount;
  }

  if (timeRemaining) {
    timeRemaining.textContent =
      "Do końca partii: " + formatCraftingTime(remainingSeconds);
  }
}

function refreshCraftingView() {
  const container =
    document.getElementById("crafting-list");

  if (!container) {
    return;
  }

  renderCrafting();
}

function renderCraftingSubcategoryTabs(
  container,
  categoryId,
) {
  const config =
    craftingSubcategoryConfigs[
      categoryId
    ];

  if (!config) {
    return;
  }

  const subcategories =
    config.subcategories;

  const currentSubcategory =
    config.getCurrentSubcategory();

  const getSubcategory =
    config.getSubcategory;

  const setSubcategory =
    config.setSubcategory;
  if (
    currentCraftingCategory !==
    categoryId
  ) {
    return;
  }

  const categoryRecipes =
    recipes.filter((recipe) => {
      return (
        getCraftingCategory(recipe) ===
        categoryId
      );
    });

  const tabs =
    document.createElement("div");

  tabs.className =
    "hero-tabs crafting-subcategory-tabs";

  subcategories.forEach(
    (subcategory) => {
      const recipesCount =
        subcategory.id === "all"
          ? categoryRecipes.length
          : categoryRecipes.filter(
            (recipe) => {
              return (
                getSubcategory(recipe) ===
                subcategory.id
              );
            },
          ).length;

      if (recipesCount === 0) {
        return;
      }

      const button =
        document.createElement("button");

      button.type = "button";

      button.className =
        "hero-tab-button crafting-subcategory-button";

      button.textContent =
        subcategory.name +
        " (" +
        recipesCount +
        ")";

      if (
        subcategory.id ===
        currentSubcategory
      ) {
        button.classList.add("active");
      }

      button.addEventListener(
        "click",
        () => {
          setSubcategory(
            subcategory.id,
          );
        },
      );

      tabs.appendChild(button);
    },
  );

  container.appendChild(tabs);
}

function filterCraftingRecipesBySubcategory(
  categoryId,
  categoryRecipes,
) {
  const config =
    craftingSubcategoryConfigs[
      categoryId
    ];

  /*
   * Ta kategoria nie ma
   * podkategorii.
   */
  if (!config) {
    return categoryRecipes;
  }

  const currentSubcategory =
    config.getCurrentSubcategory();

  /*
   * Przy opcji „Wszystko”
   * niczego nie odrzucamy.
   */
  if (
    currentSubcategory === "all"
  ) {
    return categoryRecipes;
  }

  return categoryRecipes.filter(
    (recipe) => {
      return (
        config.getSubcategory(
          recipe,
        ) === currentSubcategory
      );
    },
  );
}

function renderCrafting() {
  const container = document.getElementById("crafting-list");

  if (!container) return;

  container.innerHTML = "";

  ensureCraftingState();

  const craftingLevel = player.crafting.level;

  const craftingExp = player.crafting.exp;

  const craftingExpToNextLevel = player.crafting.expToNextLevel;

  const craftingProgress = Math.max(
    0,
    Math.min(100, (craftingExp / craftingExpToNextLevel) * 100),
  );

  const overview = document.createElement("div");

  overview.className = "crafting-overview";

  overview.innerHTML = `
    <div class="crafting-overview-level">
        <span>
            ⚒️ Poziom rzemiosła
        </span>

        <strong>
            ${craftingLevel}
        </strong>
    </div>

    <div class="crafting-overview-exp">
        <div class="crafting-overview-exp-label">
            <span>Doświadczenie</span>

            <strong>
                ${craftingExp}/${craftingExpToNextLevel}
            </strong>
        </div>

        <div class="crafting-overview-exp-bar">
            <div
                class="crafting-overview-exp-fill"
                style="width: ${craftingProgress}%;"
            ></div>
        </div>
    </div>
`;

  container.appendChild(overview);

  renderCraftingActivity(container);
  renderCraftingQueue(container);

  /*
   * Pokazujemy tylko kategorie,
   * które rzeczywiście zawierają receptury.
   */
  const visibleCraftingCategories = craftingCategories.filter((category) => {
    return recipes.some((recipe) => {
      return getCraftingCategory(recipe) === category.id;
    });
  });

  const selectedCategoryExists = visibleCraftingCategories.some((category) => {
    return category.id === currentCraftingCategory;
  });

  if (!selectedCategoryExists && visibleCraftingCategories.length > 0) {
    currentCraftingCategory = visibleCraftingCategories[0].id;

    localStorage.setItem("idler_crafting_category", currentCraftingCategory);
  }

  const tabsContainer = document.createElement("div");

  tabsContainer.className = "hero-tabs crafting-tabs";

  visibleCraftingCategories.forEach((category) => {
    const recipesCount = recipes.filter((recipe) => {
      return getCraftingCategory(recipe) === category.id;
    }).length;

    const tabButton = document.createElement("button");

    tabButton.type = "button";

    tabButton.className = "hero-tab-button crafting-tab-button";

    tabButton.textContent = category.name + " (" + recipesCount + ")";

    if (category.id === currentCraftingCategory) {
      tabButton.classList.add("active");
    }

    tabButton.onclick = () => {
      setCraftingCategory(category.id);
    };

    tabsContainer.appendChild(tabButton);
  });

  container.appendChild(tabsContainer);

  renderCraftingSubcategoryTabs(
  container,
  currentCraftingCategory,
);

  visibleCraftingCategories.forEach((category) => {
    let categoryRecipes = recipes.filter((recipe) => {
      return getCraftingCategory(recipe) === category.id;
    });

    categoryRecipes =
  filterCraftingRecipesBySubcategory(
    category.id,
    categoryRecipes,
  );




    const details = document.createElement("details");

    details.className = "crafting-category crafting-category-tab-panel";

    details.open = category.id === currentCraftingCategory;

    details.hidden = category.id !== currentCraftingCategory;
    const summary = document.createElement("summary");
    summary.textContent = category.name + " (" + categoryRecipes.length + ")";
    details.appendChild(summary);

    const recipesContainer = document.createElement("div");
    recipesContainer.className = "crafting-category-items";

    if (categoryRecipes.length === 0) {
      recipesContainer.innerHTML = `<p class="empty-category">Brak receptur w tej kategorii.</p>`;
    }

    categoryRecipes.forEach((recipe) => {
      const resultItem = items[recipe.resultItemId];

      const requiredCraftingLevel = getRecipeRequiredCraftingLevel(recipe);

      const hasCraftingLevel = hasRequiredCraftingLevel(recipe);

      const craftingExpPerCraft = getRecipeCraftingExp(recipe);

      const craftingDurationSeconds = Math.ceil(
        getRecipeCraftingDurationMs(recipe) / 1000,
      );

      const resultQuantity =
        typeof getRecipeResultQuantity === "function"
          ? getRecipeResultQuantity(recipe)
          : 1;

      const selectedCraftCount = getCraftingBatchCount(recipe.id);

      const totalResultQuantity = resultQuantity * selectedCraftCount;

      const maximumCraftCount = getMaxRecipeCraftCount(recipe);

      if (!resultItem) {
        console.warn("Craft result item not found:", recipe.resultItemId);

        return;
      }

      const baseGoldCost = recipe.goldCost || 0;

      const baseTotalGoldCost = baseGoldCost * selectedCraftCount;

      const finalTotalGoldCost =
        typeof getRecipeTotalGoldCost === "function"
          ? getRecipeTotalGoldCost(recipe, selectedCraftCount)
          : getFinalCraftingGoldCost(recipe) * selectedCraftCount;

      const hasTotalCraftingDiscount = finalTotalGoldCost < baseTotalGoldCost;

      const recipeUnlocked = isRecipeUnlocked(recipe.id);
      const recipeScroll = getRecipeScrollItem(recipe.id);
      const ownedScrolls = recipeScroll
        ? getInventoryItemQuantity(recipeScroll.id)
        : 0;

      const div = document.createElement("div");
      div.className = "crafting-item";

      if (resultItem.rarity) {
        div.classList.add("rarity-" + resultItem.rarity);
      }

      let materialsHtml = "";

      recipe.materials.forEach((material) => {
        const item = items[material.itemId];

        const inventoryOwned = getInventoryItemQuantity(material.itemId);

        const equippedOwned =
          typeof getEquippedCraftingItemQuantity === "function"
            ? getEquippedCraftingItemQuantity(material.itemId)
            : 0;

        const owned =
          typeof getCraftingItemQuantity === "function"
            ? getCraftingItemQuantity(material.itemId)
            : inventoryOwned;

        const requiredQuantity = material.quantity * selectedCraftCount;

        const hasEnough = owned >= requiredQuantity;
        const equippedText =
          equippedOwned > 0 ? " — założone: " + equippedOwned : "";

        materialsHtml += `
                    <span
    class="${hasEnough ? "material-ok" : "material-missing"}"
    data-crafting-material-id="${material.itemId}"
>
                        ${hasEnough ? "✅" : "❌"}
                        ${item ? item.name : material.itemId}:
${owned}/${requiredQuantity}
${equippedText}
                    </span>
                `;
      });

      let stats = "";

      if (resultItem.damage)
        stats += `<span>Obrażenia: ${resultItem.damage}</span>`;
      if (resultItem.strength)
        stats += `<span>Siła: +${resultItem.strength}</span>`;
      if (resultItem.dexterity)
        stats += `<span>Zręczność: +${resultItem.dexterity}</span>`;
      if (resultItem.intelligence)
        stats += `<span>Inteligencja: +${resultItem.intelligence}</span>`;
      if (resultItem.endurance)
        stats += `<span>Wytrzymałość: +${resultItem.endurance}</span>`;
      if (resultItem.luck)
        stats += `<span>Szczęście: +${resultItem.luck}</span>`;
      getWeaponCombatLabels(
    resultItem
).forEach(label => {
    stats += `<span>${label}</span>`;
});

      if (!recipeUnlocked) {
        div.classList.add("crafting-locked");

        div.innerHTML = `
                    <div class="crafting-item-header">
                        <strong>📜 ${recipe.name}</strong>
                    </div>

                    <div class="crafting-item-tags">
                        <span>${getCraftingRarityLabel(resultItem.rarity)}</span>
                        <span>Status: Nieodblokowana</span>
                        <span>Zwoje: ${ownedScrolls}</span>
                        <span>Koszt odblokowania: ${recipe.unlockCost} 💰</span>          </div>

<button
    type="button"
    class="
    crafting-main-btn $
    {ownedScrolls > 0 && player.gold >= recipe.unlockCost
            ? ""
            : "crafting-button-unavailable"
          }"
    onclick="unlockRecipe('${recipe.id}')"
    ${ownedScrolls > 0 && player.gold >= recipe.unlockCost ? "" : "disabled"}
>
    Odblokuj recepturę
</button>
                `;

        recipesContainer.appendChild(div);
        return;
      }

      const canCraft =
        canCraftRecipe(
          recipe,
          selectedCraftCount,
        );

      const craftButtonText =
        "Dodaj x" + totalResultQuantity;


      div.dataset.craftingRecipeId = recipe.id;

      const totalCostHtml = hasTotalCraftingDiscount
        ? `<s>${baseTotalGoldCost}</s> ` + finalTotalGoldCost
        : finalTotalGoldCost;

      div.innerHTML = `
    
<div class="crafting-item-header">
    <strong class="crafting-item-name">
        ⚒️ ${recipe.name}
    </strong>


    <div class="crafting-item-meta">
        <span
            class="
                crafting-meta-badge
                crafting-rarity-badge
                rarity-${resultItem.rarity}
            "
        >
            ${getCraftingRarityLabel(resultItem.rarity)}
        </span>


        <span
            class="
                crafting-meta-badge
                crafting-requirement-badge
                ${hasCraftingLevel ? "" : "crafting-level-missing"}
            "
        >
            ⚒️ Lv.
            ${requiredCraftingLevel}
        </span>

        <span
            class="
                crafting-meta-badge
                crafting-exp-badge
            "
        >
            ⭐ +${craftingExpPerCraft} EXP
        </span>

        <span class="crafting-meta-badge crafting-time-badge">
            ⏱️ ${craftingDurationSeconds} s
        </span>
    </div>
</div>


<div class="crafting-batch-panel">
    <div class="crafting-batch-row">
        <div class="crafting-batch-main-row">


            <div class="crafting-batch-controls">
                <button
                    type="button"
                    class="crafting-batch-button"
                    data-crafting-action="decrease"
                    ${selectedCraftCount <= 1 ? "disabled" : ""}
                >
                    −
                </button>

                <input
                    type="number"
                    class="
                        crafting-count-input
                        ${selectedCraftCount > maximumCraftCount
          ? "invalid"
          : ""
        }
                    "
                    value="${selectedCraftCount}"
                    min="1"
                    max="9999"
                    inputmode="numeric"
                >

                <button
                    type="button"
                    class="crafting-batch-button"
                    data-crafting-action="increase"
                    ${maximumCraftCount <= 0 ||
          selectedCraftCount >= maximumCraftCount
          ? "disabled"
          : ""
        }
                >
                    +
                </button>

                <button
                    type="button"
                    class="
                        crafting-batch-button
                        crafting-batch-max-button
                    "
                    data-crafting-action="maximum"
                    ${maximumCraftCount <= 0 ? "disabled" : ""}
                >
                    MAX
                </button>
            </div>
        </div>

        <div class="crafting-batch-details-row">
            <span class="crafting-batch-limit">
                Maks.:
                <strong data-crafting-max-count>
                    ${maximumCraftCount}
                </strong>
            </span>

            <div class="crafting-batch-summary">
                <span title="Łączny wynik">
                    📦
                    <strong data-crafting-total-result>
                        x${totalResultQuantity}
                    </strong>
                </span>

                <span title="Łączny koszt">
                    💰
                    <strong data-crafting-total-cost>

                    
                        ${totalCostHtml}
                    </strong>
                </span>
               <button
        type="button"
        class="
            crafting-main-btn
            ${canCraft ? "" : "crafting-button-unavailable"}
        "
        data-crafting-action="craft"
        ${canCraft ? "" : "disabled"}
    >
        ${craftButtonText}
    </button>
                </div>
          
        </div>
    </div>
</div>

    <div class="crafting-item-stats">
        ${stats}
    </div>

    <div class="crafting-materials">
        ${materialsHtml}
    </div>
`;

      const countInput = div.querySelector(".crafting-count-input");

      const decreaseButton = div.querySelector(
        '[data-crafting-action="decrease"]',
      );

      const increaseButton = div.querySelector(
        '[data-crafting-action="increase"]',
      );

      const maximumButton = div.querySelector(
        '[data-crafting-action="maximum"]',
      );

      const craftButton = div.querySelector('[data-crafting-action="craft"]');

      decreaseButton.addEventListener("click", () => {
        changeCraftingBatchCount(recipe.id, -1);
      });

      increaseButton.addEventListener("click", () => {
        changeCraftingBatchCount(recipe.id, 1);
      });

      maximumButton.addEventListener("click", () => {
        setMaximumCraftingBatchCount(recipe.id);
      });

      countInput.addEventListener("input", () => {
        const enteredValue = Math.floor(Number(countInput.value));

        /*
         * Podczas chwilowo pustego pola
         * nie zmieniamy zapisanej liczby.
         */
        if (!Number.isFinite(enteredValue) || enteredValue < 1) {
          return;
        }

        craftingBatchCounts[recipe.id] = Math.min(9999, enteredValue);

        updateCraftingBatchPreview(recipe.id, true);
      });

      countInput.addEventListener("change", () => {
        setCraftingBatchCount(recipe.id, countInput.value);
      });

      countInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          countInput.blur();
        }
      });

      craftButton.addEventListener("click", () => {
        const selectedCount =
          getCraftingBatchCount(recipe.id);

        const addedJob =
          addCraftingQueueJob(
            recipe,
            selectedCount,
          );

        if (!addedJob) {
          return;
        }

        setCraftingBatchCount(recipe.id, 1);

        renderCrafting();
      });

      recipesContainer.appendChild(div);
    });

    details.appendChild(recipesContainer);
    container.appendChild(details);
  });
}

