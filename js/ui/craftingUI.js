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

function formatCraftingTime(
  seconds,
) {
  const safeSeconds =
    Math.max(
      0,
      Math.ceil(
        Number(seconds) || 0,
      ),
    );

  const hours =
    Math.floor(
      safeSeconds / 3600,
    );

  const minutes =
    Math.floor(
      (
        safeSeconds % 3600
      ) / 60,
    );

  const remainingSeconds =
    safeSeconds % 60;

  if (hours > 0) {
    return (
      hours +
      " godz. " +
      minutes +
      " min " +
      remainingSeconds +
      " s"
    );
  }

  if (minutes > 0) {
    return (
      minutes +
      " min " +
      remainingSeconds +
      " s"
    );
  }

  return (
    remainingSeconds +
    " s"
  );
}

function getEquipmentUpgradeIcon(item) {
  const iconsByType = {
    weapon: item?.weaponType === "ranged"
      ? "🏹"
      : item?.weaponType === "magic"
        ? "🪄"
        : "⚔️",
    shield: "🛡️",
    helmet: "🪖",
    armor: "🥋",
    pants: "👖",
    boots: "🥾",
    gloves: "🧤",
    ring: "💍",
    amulet: "📿",
    talisman: "🪬",
  };

  return iconsByType[item?.type] || "⚒️";
}

function getEquipmentUpgradePathHtml(
  recipe,
  sourceItem,
  resultItem,
) {
  if (!sourceItem || !resultItem) {
    return "";
  }

  const icon = getEquipmentUpgradeIcon(resultItem);
  const sourceLevel = Math.max(
    1,
    Number(sourceItem.requiredLevel) || 1,
  );
  const resultLevel = Math.max(
    1,
    Number(resultItem.requiredLevel) || 1,
  );
  const rankLabel =
    recipe.equipmentUpgradeRankLabel ||
    "Ulepszenie ekwipunku";

  return `
    <div class="equipment-upgrade-path">
      <div class="equipment-upgrade-path-item is-source">
        <span class="equipment-upgrade-path-icon">${icon}</span>
        <div>
          <small>PRZEDMIOT BAZOWY</small>
          <strong>${sourceItem.name}</strong>
          <span>Poziom ${sourceLevel}</span>
        </div>
      </div>

      <span class="equipment-upgrade-path-arrow" aria-hidden="true">→</span>

      <div class="equipment-upgrade-path-item is-result">
        <span class="equipment-upgrade-path-icon">${icon}</span>
        <div>
          <small>${rankLabel}</small>
          <strong>${resultItem.name}</strong>
          <span>Poziom ${resultLevel}</span>
        </div>
      </div>
    </div>
  `;
}

function getCraftingEquipmentSetContextModel(
  definition,
  resultItem,
) {
  if (
    !definition ||
    !resultItem ||
    typeof getEquipmentSetProgress !== "function"
  ) {
    return null;
  }

  const progress =
    getEquipmentSetProgress(definition);
  const inventoryQuantity =
    typeof getInventoryItemQuantity === "function"
      ? getInventoryItemQuantity(resultItem.id)
      : 0;
  const isEquipped =
    progress.equippedItemIds.includes(
      resultItem.id,
    );
  const nextThreshold =
    progress.thresholds.find(
      (threshold) => !threshold.active,
    ) || null;
  const missingToNextThreshold =
    nextThreshold
      ? Math.max(
        0,
        nextThreshold.pieces -
        progress.equippedPieces,
      )
      : 0;

  let ownershipStatus = "missing";
  let ownershipLabel = "Nieposiadana";

  if (isEquipped) {
    ownershipStatus = "equipped";
    ownershipLabel = inventoryQuantity > 0
      ? "Założona · plecak x" + inventoryQuantity
      : "Założona";
  } else if (inventoryQuantity > 0) {
    ownershipStatus = "owned";
    ownershipLabel =
      "W plecaku · x" + inventoryQuantity;
  }

  let duplicateWarning = "";

  if (isEquipped && inventoryQuantity > 0) {
    duplicateWarning =
      "Ten element jest już założony, a dodatkowo masz x" +
      inventoryQuantity +
      " w plecaku.";
  } else if (isEquipped) {
    duplicateWarning =
      "Ten element jest już założony. Wytworzenie doda kolejny egzemplarz.";
  } else if (inventoryQuantity > 0) {
    duplicateWarning =
      "Masz już ten element w plecaku (x" +
      inventoryQuantity +
      "). Wytworzenie doda kolejny egzemplarz.";
  }

  return {
    definition,
    progress,
    ownershipStatus,
    ownershipLabel,
    inventoryQuantity,
    isEquipped,
    nextThreshold,
    missingToNextThreshold,
    duplicateWarning,
  };
}

function getCraftingEquipmentSetContextHtml(
  definition,
  resultItem,
) {
  const model =
    getCraftingEquipmentSetContextModel(
      definition,
      resultItem,
    );

  if (!model) {
    return "";
  }

  const nextBonusHtml =
    model.nextThreshold
      ? `
        <div class="crafting-set-next-bonus">
          <small>NAJBLIŻSZA PREMIA</small>
          <strong>
            ${model.nextThreshold.pieces}/
            ${model.progress.totalPieces}
            · ${model.nextThreshold.name}
          </strong>
          <span>
            ${model.nextThreshold.description}
            · ${model.missingToNextThreshold === 1
        ? "Brakuje 1 elementu"
        : "Brakuje " +
        model.missingToNextThreshold +
        " elementów"
      }
          </span>
          ${model.nextThreshold.uniqueEffect ? `
            <em class="crafting-set-unique-effect">
              🔥 ${model.nextThreshold.uniqueEffect.name}:
              ${model.nextThreshold.uniqueEffect.description}
            </em>
          ` : ""}
        </div>
      `
      : `
        <div class="crafting-set-next-bonus is-complete">
          <small>PEŁNY ZESTAW</small>
          <strong>Wszystkie premie są aktywne</strong>
          <span>
            Założono ${model.progress.equippedPieces}/
            ${model.progress.totalPieces} części
          </span>
        </div>
      `;

  return `
    <section class="crafting-set-context crafting-set-context-${model.definition.theme}">
      <div class="crafting-set-context-summary">
        <span class="crafting-set-progress-label">
          ${model.definition.icon}
          Postęp zestawu
          <strong>
            ${model.progress.equippedPieces}/
            ${model.progress.totalPieces}
          </strong>
        </span>

        <span class="crafting-set-ownership is-${model.ownershipStatus}">
          ${model.ownershipStatus === "equipped"
      ? "✓"
      : model.ownershipStatus === "owned"
        ? "🎒"
        : "○"
    }
          ${model.ownershipLabel}
        </span>
      </div>

      ${nextBonusHtml}

      ${model.duplicateWarning ? `
        <div class="crafting-set-duplicate-warning">
          ⚠ ${model.duplicateWarning}
        </div>
      ` : ""}
    </section>
  `;
}

function getProfessionToolUpgradeBonusRows(
  sourceItem,
  resultItem,
) {
  const sourceBonuses = sourceItem?.bonuses || {};
  const resultBonuses = resultItem?.bonuses || {};

  return Object.entries(resultBonuses)
    .map(([bonusName, resultValue]) => {
      const sourceValue =
        Number(sourceBonuses[bonusName]) || 0;
      const safeResultValue =
        Number(resultValue) || 0;
      const difference =
        safeResultValue - sourceValue;
      const label =
        typeof professionToolsBonusLabels !== "undefined"
          ? professionToolsBonusLabels[bonusName] || bonusName
          : bonusName;

      return `
        <div class="profession-tool-upgrade-bonus-row">
          <span>${label}</span>
          <div>
            <del>+${sourceValue}%</del>
            <span aria-hidden="true">→</span>
            <strong>+${safeResultValue}%</strong>
            <em>+${difference}%</em>
          </div>
        </div>
      `;
    })
    .join("");
}

function getProfessionToolUpgradeButtonText(
  recipe,
  sourceItem,
) {
  if (!hasRequiredCraftingLevel(recipe)) {
    return (
      "Wymaga rzemiosła Lv. " +
      getRecipeRequiredCraftingLevel(recipe)
    );
  }

  const professionRequirement =
    typeof getRecipeProfessionRequirement === "function"
      ? getRecipeProfessionRequirement(recipe)
      : null;

  if (
    professionRequirement &&
    !professionRequirement.met
  ) {
    return (
      "Wymaga: " +
      professionRequirement.professionName +
      " Lv. " +
      professionRequirement.requiredLevel
    );
  }

  if (
    getInventoryItemQuantity(
      recipe.upgradeFromItemId,
    ) <= 0
  ) {
    return "Brak: " + sourceItem.name;
  }

  if (
    player.gold <
    getRecipeTotalGoldCost(recipe, 1)
  ) {
    return "Brakuje złota";
  }

  const missingMaterial = recipe.materials
    .filter((material) => {
      return (
        material.itemId !==
        recipe.upgradeFromItemId
      );
    })
    .some((material) => {
      return (
        getCraftingItemQuantity(
          material.itemId,
        ) < material.quantity
      );
    });

  return missingMaterial
    ? "Brakuje materiałów"
    : "Ulepsz narzędzie";
}

function createProfessionToolUpgradeCard(
  recipe,
) {
  const resultItem = items[recipe.resultItemId];
  const sourceItem = items[recipe.upgradeFromItemId];

  if (!resultItem || !sourceItem) {
    return null;
  }

  const definition =
    typeof professionToolDefinitions !== "undefined"
      ? professionToolDefinitions.find((entry) => {
        return entry.toolType === resultItem.toolType;
      })
      : null;
  const professionName =
    definition?.professionName || "Profesja";
  const icon =
    resultItem.icon || definition?.icon || "🧰";
  const requiredCraftingLevel =
    getRecipeRequiredCraftingLevel(recipe);
  const hasCraftingLevel =
    hasRequiredCraftingLevel(recipe);
  const requiredProfessionLevel =
    Math.max(
      1,
      Number(resultItem.requiredProfessionLevel) || 1,
    );
  const professionLevel =
    typeof getProfessionLevelForTool === "function"
      ? getProfessionLevelForTool(resultItem.toolType)
      : 1;
  const hasProfessionLevel =
    professionLevel >= requiredProfessionLevel;
  const sourceOwned =
    getInventoryItemQuantity(recipe.upgradeFromItemId);
  const sourceIsActive =
    player.professionTools?.[resultItem.toolType] ===
    recipe.upgradeFromItemId;
  const canUpgrade =
    canCraftRecipe(recipe, 1);
  const craftingExp =
    getRecipeCraftingExp(recipe);
  const craftingDurationSeconds =
    Math.ceil(
      getRecipeCraftingDurationMs(recipe) / 1000,
    );
  const finalGoldCost =
    getRecipeTotalGoldCost(recipe, 1);
  const baseGoldCost =
    Math.max(0, Number(recipe.goldCost) || 0);
  const goldCostHtml =
    finalGoldCost < baseGoldCost
      ? `<s>${baseGoldCost}</s> ${finalGoldCost}`
      : finalGoldCost;
  const sourceTier =
    Math.max(1, Number(sourceItem.toolTier) || 1);
  const targetTier =
    Math.max(2, Number(resultItem.toolTier) || 2);
  const progressHtml = Array.from(
    { length: PROFESSION_TOOL_MAX_TIER },
    (_, index) => index + 1,
  )
    .map((tier) => {
      let statusClass = "";

      if (tier <= sourceTier) {
        statusClass = "is-complete";
      }

      if (tier === targetTier) {
        statusClass = "is-target";
      }

      return `
        <span class="${statusClass}">
          ${tier}
        </span>
      `;
    })
    .join("");
  const materialsHtml = recipe.materials
    .filter((material) => {
      return (
        material.itemId !==
        recipe.upgradeFromItemId
      );
    })
    .map((material) => {
      const materialItem = items[material.itemId];
      const owned =
        getCraftingItemQuantity(material.itemId);
      const hasEnough =
        owned >= material.quantity;

      return `
        <span class="${hasEnough ? "material-ok" : "material-missing"}">
          ${hasEnough ? "✓" : "✕"}
          ${materialItem?.name || material.itemId}
          <strong>${owned}/${material.quantity}</strong>
        </span>
      `;
    })
    .join("");
  const card = document.createElement("article");

  card.className =
    "crafting-item profession-tool-upgrade-card " +
    "rarity-" + resultItem.rarity;

  if (
    !hasCraftingLevel ||
    !hasProfessionLevel
  ) {
    card.classList.add(
      "crafting-level-locked",
    );
  }

  card.dataset.requiredCraftingLevel =
    String(requiredCraftingLevel);
  card.dataset.requiredProfessionLevel =
    String(requiredProfessionLevel);
  card.dataset.craftingRecipeId = recipe.id;
  card.innerHTML = `
    ${hasCraftingLevel ? "" : `
      <div class="crafting-level-lock-message">
        🔒 Odblokuje się na ${requiredCraftingLevel}. poziomie rzemiosła
      </div>
    `}
    ${hasProfessionLevel ? "" : `
      <div class="crafting-level-lock-message profession-level-lock-message">
        🔒 Wymaga: ${professionName} Lv. ${requiredProfessionLevel}
        · obecnie ${professionLevel}
      </div>
    `}

    <header class="profession-tool-upgrade-header">
      <span class="profession-tool-upgrade-kicker">
        ${icon} ULEPSZENIE · ${professionName}
      </span>
      <strong>${sourceItem.name} → ${resultItem.name}</strong>
      <div class="crafting-item-meta">
        <span class="crafting-meta-badge rarity-${resultItem.rarity}">
          ${getCraftingRarityLabel(resultItem.rarity)}
        </span>
        <span class="crafting-meta-badge crafting-requirement-badge ${hasCraftingLevel ? "" : "crafting-level-missing"}">
          ⚒️ Rzemiosło Lv. ${requiredCraftingLevel}
        </span>
        <span class="crafting-meta-badge ${hasProfessionLevel ? "" : "crafting-level-missing"}">
          ${professionName} Lv. ${requiredProfessionLevel}
        </span>
        <span class="crafting-meta-badge crafting-time-badge">
          ⏱️ ${formatCraftingTime(craftingDurationSeconds)}
        </span>
      </div>
    </header>

    <div class="profession-tool-upgrade-progress" aria-label="Postęp rang">
      ${progressHtml}
    </div>

    <div class="profession-tool-upgrade-transform">
      <div class="profession-tool-upgrade-stage is-source">
        <small>OBECNA RANGA</small>
        <span class="profession-tool-upgrade-icon">${icon}</span>
        <strong>${sourceItem.name}</strong>
        <span>${getProfessionToolTierLabel(sourceItem)}</span>
      </div>
      <div class="profession-tool-upgrade-arrow" aria-hidden="true">➜</div>
      <div class="profession-tool-upgrade-stage is-result">
        <small>NOWA RANGA</small>
        <span class="profession-tool-upgrade-icon">${icon}</span>
        <strong>${resultItem.name}</strong>
        <span>${getProfessionToolTierLabel(resultItem)}</span>
      </div>
    </div>

    <section class="profession-tool-upgrade-bonuses">
      <h4>Przyrost parametrów</h4>
      ${getProfessionToolUpgradeBonusRows(sourceItem, resultItem)}
    </section>

    <section class="profession-tool-upgrade-source ${sourceOwned > 0 ? "material-ok" : "material-missing"}">
      <div>
        <small>ULEPSZANY PRZEDMIOT</small>
        <strong>${icon} ${sourceItem.name}</strong>
      </div>
      <span>
        ${sourceOwned > 0 ? "✓ Posiadasz" : "✕ Brak"}
        ${sourceIsActive ? " · aktywnie używane" : ""}
      </span>
    </section>

    <section class="profession-tool-upgrade-materials">
      <h4>Materiały do ulepszenia</h4>
      <div>${materialsHtml}</div>
    </section>

    <footer class="profession-tool-upgrade-action">
      <div>
        <span>💰 <strong>${goldCostHtml}</strong></span>
        <span>⭐ <strong>+${craftingExp} EXP</strong></span>
      </div>
      <button
        type="button"
        class="crafting-main-btn profession-tool-upgrade-button ${canUpgrade ? "" : "crafting-button-unavailable"}"
        ${canUpgrade ? "" : "disabled"}
      >
        ${getProfessionToolUpgradeButtonText(recipe, sourceItem)}
      </button>
    </footer>
  `;

  const upgradeButton = card.querySelector(
    ".profession-tool-upgrade-button",
  );

  upgradeButton.addEventListener("click", () => {
    const addedJob =
      addCraftingQueueJob(recipe, 1);

    if (addedJob) {
      renderCrafting();
    }
  });

  return card;
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

    <div
        class="profession-tool-context-slot crafting-tool-context-slot"
        data-profession-tool-panel="craftingHammer"
    ></div>

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

  const toolPanel = overview.querySelector(
    "[data-profession-tool-panel='craftingHammer']",
  );

  if (
    toolPanel &&
    typeof renderProfessionToolContextPanel === "function"
  ) {
    renderProfessionToolContextPanel(
      toolPanel,
      "craftingHammer",
    );
  }

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

    if (category.id === "profession_tools") {
      const workshopIntro = document.createElement("div");
      workshopIntro.className = "profession-tool-upgrade-intro";
      workshopIntro.innerHTML = `
        <span>🧰</span>
        <div>
          <strong>Warsztat ulepszania narzędzi</strong>
          <p>
            Wybierz posiadane narzędzie i podnieś je do następnej rangi.
            Stara wersja zostanie wykorzystana jako baza ulepszenia.
          </p>
        </div>
      `;
      details.appendChild(workshopIntro);
    }

    const recipesContainer = document.createElement("div");
    recipesContainer.className = "crafting-category-items";

    if (category.id === "profession_tools") {
      recipesContainer.classList.add(
        "profession-tool-upgrade-grid",
      );
    }

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

      const resultEquipmentSet =
        typeof getEquipmentSetForItemId === "function"
          ? getEquipmentSetForItemId(
            recipe.resultItemId,
          )
          : null;
      const equipmentSetBadgeHtml =
        resultEquipmentSet
          ? `
            <span
              class="crafting-equipment-set-badge crafting-equipment-set-${resultEquipmentSet.theme}"
              title="${resultEquipmentSet.name}"
            >
              ${resultEquipmentSet.icon} Element zestawu · ${resultEquipmentSet.name}
            </span>
          `
          : "";
      const equipmentSetContextHtml =
        resultEquipmentSet
          ? getCraftingEquipmentSetContextHtml(
            resultEquipmentSet,
            resultItem,
          )
          : "";
      const equipmentItemTypes = [
        "weapon",
        "shield",
        "helmet",
        "armor",
        "pants",
        "boots",
        "gloves",
        "ring",
        "amulet",
        "talisman",
      ];
      const isEquipmentResult =
        equipmentItemTypes.includes(
          resultItem.type,
        );
      const equipmentComparisonHtml =
        isEquipmentResult &&
          typeof getEquipmentComparisonPreviewHtml === "function"
          ? getEquipmentComparisonPreviewHtml(
            resultItem,
            {
              title: "PO WYTWORZENIU I ZAŁOŻENIU",
              className: "crafting-equipment-comparison",
            },
          )
          : "";

      if (
        typeof isProfessionToolUpgradeRecipe === "function" &&
        isProfessionToolUpgradeRecipe(recipe)
      ) {
        const upgradeCard =
          createProfessionToolUpgradeCard(recipe);

        if (upgradeCard) {
          recipesContainer.appendChild(upgradeCard);
        }

        return;
      }

      const equipmentUpgradeSource =
        recipe.upgradeFromItemId
          ? items[recipe.upgradeFromItemId]
          : null;
      const isEquipmentUpgrade = Boolean(
        equipmentUpgradeSource &&
        recipe.equipmentUpgradeRank,
      );
      const equipmentUpgradePathHtml =
        isEquipmentUpgrade
          ? getEquipmentUpgradePathHtml(
            recipe,
            equipmentUpgradeSource,
            resultItem,
          )
          : "";

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
      div.dataset.craftingRecipeId = recipe.id;

      if (resultEquipmentSet) {
        div.classList.add(
          "crafting-set-recipe-card",
          "crafting-set-recipe-" +
          resultEquipmentSet.theme,
        );
        div.dataset.equipmentSetId =
          resultEquipmentSet.id;
      }

      if (isEquipmentUpgrade) {
        div.classList.add(
          "equipment-upgrade-card",
          "equipment-upgrade-" +
          recipe.equipmentUpgradeRank,
        );
        div.dataset.equipmentUpgradeRank =
          recipe.equipmentUpgradeRank;
      }

      if (!hasCraftingLevel) {
        div.classList.add(
          "crafting-level-locked",
        );
      }

      div.dataset.requiredCraftingLevel =
        String(requiredCraftingLevel);

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

        const isUpgradeSource =
          isEquipmentUpgrade &&
          material.itemId ===
          recipe.upgradeFromItemId;

        materialsHtml += `
                    <span
    class="${hasEnough ? "material-ok" : "material-missing"} ${isUpgradeSource ? "equipment-upgrade-source-material" : ""}"
    data-crafting-material-id="${material.itemId}"
>
                        ${hasEnough ? "✅" : "❌"}
                        ${isUpgradeSource ? "Baza — " : ""}
                        ${item ? item.name : material.itemId}:
${owned}/${requiredQuantity}
${equippedText}
                    </span>
                `;
      });

      let stats = "";

      if (resultItem.damage)
        stats += `<span>Obrażenia: ${resultItem.damage}</span>`;
      if (resultItem.armor)
        stats += `<span>Pancerz: +${resultItem.armor}</span>`;
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
      if (resultItem.critChance)
        stats += `<span>Szansa na krytyk: +${resultItem.critChance} p.p.</span>`;
      if (resultItem.critDamage)
        stats += `<span>Obrażenia krytyczne: +${resultItem.critDamage} p.p.</span>`;
      if (resultItem.dodgeChance)
        stats += `<span>Szansa na unik: +${resultItem.dodgeChance} p.p.</span>`;
      if (resultItem.lootBonus)
        stats += `<span>Bonus do łupu: +${resultItem.lootBonus} p.p.</span>`;
      getWeaponCombatLabels(
        resultItem
      ).forEach(label => {
        stats += `<span>${label}</span>`;
      });

      if (!recipeUnlocked) {
        div.classList.add("crafting-locked");

        div.innerHTML = `
                    ${hasCraftingLevel ? "" : `
                        <div class="crafting-level-lock-message">
                            🔒 Odblokuje się na ${requiredCraftingLevel}. poziomie rzemiosła
                        </div>
                    `}

                    <div class="crafting-item-header">
                        <div class="crafting-item-title-row">
                            <strong class="crafting-item-name">📜 ${recipe.name}</strong>
                            ${equipmentSetBadgeHtml}
                        </div>
                    </div>

                    <div class="crafting-item-tags">
                        <span>${getCraftingRarityLabel(resultItem.rarity)}</span>
                        <span>Status: Nieodblokowana</span>
                        <span>Zwoje: ${ownedScrolls}</span>
                        <span>Koszt odblokowania: ${recipe.unlockCost} 💰</span>
                    </div>

${equipmentSetContextHtml}

${equipmentUpgradePathHtml}

${equipmentComparisonHtml}

<button
    type="button"
    class="
    crafting-main-btn ${ownedScrolls > 0 && player.gold >= recipe.unlockCost
            ? ""
            : "crafting-button-unavailable"
          }"
    onclick="unlockRecipe('${recipe.id}')"
    ${ownedScrolls > 0 && player.gold >= recipe.unlockCost ? "" : "disabled"}
>
    ${isEquipmentUpgrade ? "Odblokuj ulepszenie" : "Odblokuj recepturę"}
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
        isEquipmentUpgrade
          ? "Wytwórz ulepszenie" +
          (totalResultQuantity > 1
            ? " x" + totalResultQuantity
            : "")
          : "Dodaj x" + totalResultQuantity;

      const totalCostHtml = hasTotalCraftingDiscount
        ? `<s>${baseTotalGoldCost}</s> ` + finalTotalGoldCost
        : finalTotalGoldCost;

      div.innerHTML = `
    ${hasCraftingLevel ? "" : `
        <div class="crafting-level-lock-message">
            🔒 Odblokuje się na ${requiredCraftingLevel}. poziomie rzemiosła
        </div>
    `}
    
<div class="crafting-item-header">
    <div class="crafting-item-title-row">
        <strong class="crafting-item-name">
            ⚒️ ${recipe.name}
        </strong>

        ${equipmentSetBadgeHtml}
    </div>


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

${equipmentSetContextHtml}

${equipmentUpgradePathHtml}

${equipmentComparisonHtml}

<div class="crafting-batch-panel">
    <div class="crafting-batch-row">
        <div class="crafting-batch-main-row">


            <div class="crafting-batch-controls">
                <button
                    type="button"
                    class="crafting-batch-button"
                    data-crafting-action="decrease"
                    ${selectedCraftCount <= 1 || !hasCraftingLevel ? "disabled" : ""}
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
                    ${hasCraftingLevel ? "" : "disabled"}
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

${stats ? `
    <div class="crafting-item-stats">
        ${stats}
    </div>
` : ""}

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
