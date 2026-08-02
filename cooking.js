function getCookingExpToNextLevel(level) {
    const normalizedLevel = Math.max(1, Math.floor(Number(level) || 1));
    const levelIndex = normalizedLevel - 1;

    return Math.floor(
        120 +
        levelIndex * 70 +
        Math.pow(levelIndex, 1.45) * 28
    );
}

function getDefaultCookingStatistics() {
    return {
        totalMealsCooked: 0,
        mealsByItem: {},
        recipesById: {}
    };
}

function getTavernReputationToNextLevel(level) {
    const normalizedLevel = Math.max(1, Math.floor(Number(level) || 1));
    return 5 + (normalizedLevel - 1) * 2;
}

function getDefaultTavernState() {
    return {
        level: 1,
        reputation: 0,
        reputationToNextLevel: getTavernReputationToNextLevel(1),
        completedOrders: 0,
        totalGoldEarned: 0,
        nextOrderSequence: 1,
        activeOrders: []
    };
}

function getDefaultCookingState() {
    return {
        level: 1,
        exp: 0,
        expToNextLevel: getCookingExpToNextLevel(1),
        statistics: getDefaultCookingStatistics(),
        tavern: getDefaultTavernState(),
        lastResult: null
    };
}

function ensureCookingState() {
    if (!player.cooking || typeof player.cooking !== "object") {
        player.cooking = getDefaultCookingState();
    }

    player.cooking.level = Math.max(
        1,
        Math.floor(Number(player.cooking.level) || 1)
    );
    player.cooking.exp = Math.max(0, Number(player.cooking.exp) || 0);
    player.cooking.expToNextLevel = getCookingExpToNextLevel(
        player.cooking.level
    );

    while (
        player.cooking.exp >=
        player.cooking.expToNextLevel
    ) {
        player.cooking.exp -=
            player.cooking.expToNextLevel;
        player.cooking.level += 1;
        player.cooking.expToNextLevel =
            getCookingExpToNextLevel(
                player.cooking.level
            );
    }

    if (
        !player.cooking.statistics ||
        typeof player.cooking.statistics !== "object"
    ) {
        player.cooking.statistics = getDefaultCookingStatistics();
    }

    const statistics = player.cooking.statistics;
    statistics.totalMealsCooked = Math.max(
        0,
        Math.floor(Number(statistics.totalMealsCooked) || 0)
    );

    if (!statistics.mealsByItem || typeof statistics.mealsByItem !== "object") {
        statistics.mealsByItem = {};
    }

    if (!statistics.recipesById || typeof statistics.recipesById !== "object") {
        statistics.recipesById = {};
    }

    ensureTavernState();
}

function getRandomInteger(minimum, maximum) {
    const safeMinimum = Math.floor(Number(minimum) || 0);
    const safeMaximum = Math.max(
        safeMinimum,
        Math.floor(Number(maximum) || safeMinimum)
    );

    return safeMinimum + Math.floor(
        Math.random() * (safeMaximum - safeMinimum + 1)
    );
}

function getAvailableTavernOrderTemplates() {
    const tavern = player.cooking.tavern;

    return tavernOrderTemplates.filter(template => {
        return (
            player.cooking.level >= template.requiredCookingLevel &&
            tavern.level >= template.requiredTavernLevel
        );
    });
}

function generateTavernOrder(excludedTemplateIds = []) {
    const availableTemplates = getAvailableTavernOrderTemplates();

    if (availableTemplates.length === 0) {
        return null;
    }

    const preferredTemplates = availableTemplates.filter(template => {
        return !excludedTemplateIds.includes(template.id);
    });
    const templatePool = preferredTemplates.length > 0
        ? preferredTemplates
        : availableTemplates;
    const template = templatePool[
        getRandomInteger(0, templatePool.length - 1)
    ];
    const requirements = template.requirements.map(requirement => {
        return {
            itemId: requirement.itemId,
            quantity: getRandomInteger(
                requirement.minQuantity,
                requirement.maxQuantity
            )
        };
    });
    const mealValue = requirements.reduce((total, requirement) => {
        const itemValue = Math.max(
            1,
            Number(items[requirement.itemId]?.value) || 1
        );
        return total + itemValue * requirement.quantity;
    }, 0);
    const tavern = player.cooking.tavern;
    const goldReward = Math.max(
        50,
        Math.round(
            (
                mealValue * template.goldMultiplier +
                tavern.level * 20
            ) /
            10
        ) * 10
    );
    const order = {
        id: "tavern_order_" + tavern.nextOrderSequence,
        templateId: template.id,
        name: template.name,
        description: template.description,
        icon: template.icon,
        requirements,
        goldReward,
        reputationReward: template.reputationReward,
        createdAt: Date.now()
    };

    tavern.nextOrderSequence += 1;
    return order;
}

function ensureTavernState() {
    if (
        !player.cooking.tavern ||
        typeof player.cooking.tavern !== "object"
    ) {
        player.cooking.tavern = getDefaultTavernState();
    }

    const tavern = player.cooking.tavern;
    tavern.level = Math.max(1, Math.floor(Number(tavern.level) || 1));
    tavern.reputation = Math.max(0, Math.floor(Number(tavern.reputation) || 0));
    tavern.reputationToNextLevel = getTavernReputationToNextLevel(
        tavern.level
    );
    tavern.completedOrders = Math.max(
        0,
        Math.floor(Number(tavern.completedOrders) || 0)
    );
    tavern.totalGoldEarned = Math.max(
        0,
        Math.floor(Number(tavern.totalGoldEarned) || 0)
    );
    tavern.nextOrderSequence = Math.max(
        1,
        Math.floor(Number(tavern.nextOrderSequence) || 1)
    );

    if (!Array.isArray(tavern.activeOrders)) {
        tavern.activeOrders = [];
    }

    tavern.activeOrders = tavern.activeOrders
        .filter(order => {
            return (
                order &&
                order.id &&
                getTavernOrderTemplate(order.templateId) &&
                Array.isArray(order.requirements)
            );
        })
        .slice(0, 3);

    while (tavern.activeOrders.length < 3) {
        const order = generateTavernOrder(
            tavern.activeOrders.map(activeOrder => activeOrder.templateId)
        );

        if (!order) break;
        tavern.activeOrders.push(order);
    }
}

function getTavernOrderProgress(order) {
    if (!order || !Array.isArray(order.requirements)) {
        return [];
    }

    return order.requirements.map(requirement => {
        const owned = getCookingIngredientQuantity(requirement.itemId);
        const required = Math.max(1, Number(requirement.quantity) || 1);

        return {
            ...requirement,
            owned,
            required,
            hasEnough: owned >= required
        };
    });
}

function canCompleteTavernOrder(orderId) {
    ensureCookingState();

    const order = player.cooking.tavern.activeOrders.find(activeOrder => {
        return activeOrder.id === orderId;
    });

    return Boolean(
        order &&
        getTavernOrderProgress(order).every(requirement => {
            return requirement.hasEnough;
        })
    );
}

function addTavernReputation(amount) {
    const tavern = player.cooking.tavern;
    tavern.reputation += Math.max(0, Math.floor(Number(amount) || 0));
    let levelsGained = 0;

    while (tavern.reputation >= tavern.reputationToNextLevel) {
        tavern.reputation -= tavern.reputationToNextLevel;
        tavern.level += 1;
        tavern.reputationToNextLevel = getTavernReputationToNextLevel(
            tavern.level
        );
        levelsGained += 1;
    }

    return levelsGained;
}

function rollTavernTip() {
    const tavernLevel = player.cooking.tavern.level;
    const tipChance = Math.min(0.3, 0.14 + tavernLevel * 0.02);

    if (Math.random() >= tipChance) {
        return null;
    }

    const availableTips = tavernTipRewards.filter(tip => {
        return tavernLevel >= tip.requiredTavernLevel;
    });
    const totalWeight = availableTips.reduce((total, tip) => {
        return total + Math.max(0, Number(tip.weight) || 0);
    }, 0);
    let roll = Math.random() * totalWeight;
    let selectedTip = availableTips[availableTips.length - 1];

    for (const tip of availableTips) {
        roll -= tip.weight;
        if (roll <= 0) {
            selectedTip = tip;
            break;
        }
    }

    return {
        itemId: selectedTip.itemId,
        quantity: getRandomInteger(
            selectedTip.minQuantity,
            selectedTip.maxQuantity
        )
    };
}

function completeTavernOrder(orderId) {
    ensureCookingState();

    const tavern = player.cooking.tavern;
    const orderIndex = tavern.activeOrders.findIndex(order => {
        return order.id === orderId;
    });
    const order = tavern.activeOrders[orderIndex];

    if (!order || !canCompleteTavernOrder(orderId)) {
        if (typeof showNotification === "function") {
            showNotification("Brakuje gotowych potraw do realizacji zamówienia.", "error");
        }
        return false;
    }

    order.requirements.forEach(requirement => {
        removeItemFromInventory(requirement.itemId, requirement.quantity);
    });

    player.gold += order.goldReward;
    tavern.completedOrders += 1;
    tavern.totalGoldEarned += order.goldReward;

    if (
        typeof updateQuestMenuHighlight ===
        "function"
    ) {
        updateQuestMenuHighlight();
    }

    const levelsGained = addTavernReputation(order.reputationReward);
    const tip = rollTavernTip();

    if (tip) {
        addItemToInventory(tip.itemId, tip.quantity);
    }

    const excludedTemplateIds = tavern.activeOrders
        .filter((activeOrder, index) => index !== orderIndex)
        .map(activeOrder => activeOrder.templateId);
    tavern.activeOrders[orderIndex] = generateTavernOrder(
        excludedTemplateIds
    );

    const tipItem = tip ? items[tip.itemId] : null;
    const tipText = tip
        ? " Napiwek: " + (tipItem?.name || tip.itemId) + " x" + tip.quantity + "."
        : "";

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "🍻 Zrealizowano zamówienie: " + order.name +
            ". +" + order.goldReward + " złota." + tipText,
            "cooking"
        );
    }

    if (typeof showNotification === "function") {
        showNotification(
            levelsGained > 0
                ? "Wzrosła renoma Karczmy! Poziom " + tavern.level + "."
                : "Zamówienie zrealizowane! +" + order.goldReward + " złota.",
            "success"
        );
    }

    saveGame();

    if (typeof renderCooking === "function") {
        renderCooking();
    }
    if (typeof renderInventory === "function") {
        renderInventory();
    }

    return true;
}

function openCookingScreen() {
    ensureCookingState();
    showScreen("screen-cooking");

    if (typeof renderCooking === "function") {
        renderCooking();
    }
}

function isCookingRecipeUnlocked(recipe) {
    ensureCookingState();

    return Boolean(
        recipe &&
        player.cooking.level >=
        Math.max(1, Number(recipe.requiredCookingLevel) || 1)
    );
}

function getCookingIngredientQuantity(itemId) {
    if (typeof getInventoryItemQuantity === "function") {
        return getInventoryItemQuantity(itemId);
    }

    const entry = Array.isArray(player.inventory)
        ? player.inventory.find(item => item.itemId === itemId)
        : null;

    return entry ? Math.max(0, Number(entry.quantity) || 0) : 0;
}

function getMaxCookableQuantity(recipe) {
    if (!recipe || !Array.isArray(recipe.ingredients)) {
        return 0;
    }

    return recipe.ingredients.reduce((maximum, ingredient) => {
        const needed = Math.max(1, Number(ingredient.quantity) || 1);
        const available = getCookingIngredientQuantity(ingredient.itemId);
        return Math.min(maximum, Math.floor(available / needed));
    }, Number.MAX_SAFE_INTEGER);
}

function getCookingRequestedQuantity(recipeId) {
    const input = document.getElementById("cooking-quantity-" + recipeId);

    return Math.min(
        9999,
        Math.max(1, Math.floor(Number(input?.value) || 1))
    );
}

function addCookingExp(amount) {
    ensureCookingState();
    player.cooking.exp += Math.max(0, Number(amount) || 0);

    let levelsGained = 0;

    while (player.cooking.exp >= player.cooking.expToNextLevel) {
        player.cooking.exp -= player.cooking.expToNextLevel;
        player.cooking.level += 1;
        player.cooking.expToNextLevel = getCookingExpToNextLevel(
            player.cooking.level
        );
        levelsGained += 1;
    }

    if (levelsGained > 0 && typeof showNotification === "function") {
        showNotification(
            "Nowy poziom gotowania: " + player.cooking.level + "!",
            "success"
        );
    }
}

function cookRecipe(recipeId, requestedQuantity) {
    ensureCookingState();

    const recipe = getCookingRecipe(recipeId);

    if (!recipe || !isCookingRecipeUnlocked(recipe)) {
        if (typeof showNotification === "function") {
            showNotification("Ten przepis nie jest jeszcze dostępny.", "error");
        }
        return false;
    }

    const quantity = Math.min(
        9999,
        Math.max(
            1,
            Math.floor(
                Number(requestedQuantity) ||
                getCookingRequestedQuantity(recipeId)
            )
        )
    );

    if (getMaxCookableQuantity(recipe) < quantity) {
        if (typeof showNotification === "function") {
            showNotification("Brakuje składników na tyle porcji.", "error");
        }
        return false;
    }

    recipe.ingredients.forEach(ingredient => {
        removeItemFromInventory(
            ingredient.itemId,
            ingredient.quantity * quantity
        );
    });

    /*
     * Premia EXP z aktywnych
     * przyborów kuchennych.
     */
    const cookingExpBonus =
        typeof getProfessionToolBonus ===
            "function"
            ? getProfessionToolBonus(
                "cookingTools",
                "cookingExpPercent"
            )
            : 0;

    const safeCookingExpBonus =
        Math.max(
            0,
            Number(
                cookingExpBonus
            ) || 0
        );

    /*
     * EXP liczymy tylko z podstawowych
     * porcji wybranych przez gracza.
     */
    const baseCookingExp =
        Math.max(
            0,
            Number(
                recipe.cookingExp
            ) || 0
        ) *
        quantity;

    const gainedCookingExp =
        Math.max(
            0,
            Math.floor(
                baseCookingExp *
                (
                    1 +
                    safeCookingExpBonus /
                    100
                )
            )
        );

    /*
     * Szansa na dodatkową potrawę.
     */
    const extraMealChance =
        typeof getProfessionToolBonus ===
            "function"
            ? getProfessionToolBonus(
                "cookingTools",
                "extraMealChancePercent"
            )
            : 0;

    const safeExtraMealChance =
        Math.min(
            100,
            Math.max(
                0,
                Number(
                    extraMealChance
                ) || 0
            )
        );

    /*
     * Każda podstawowa porcja wykonuje
     * osobne losowanie.
     *
     * Dzięki temu gotowanie 10 porcji
     * nie jest gorsze niż gotowanie
     * każdej porcji osobno.
     */
    let extraMealQuantity = 0;

    for (
        let portionIndex = 0;
        portionIndex < quantity;
        portionIndex++
    ) {
        if (
            Math.random() * 100 <
            safeExtraMealChance
        ) {
            extraMealQuantity++;
        }
    }

    const totalResultQuantity =
        quantity +
        extraMealQuantity;

    /*
     * Do plecaka trafiają podstawowe
     * oraz dodatkowe porcje.
     */
    addItemToInventory(
        recipe.resultItemId,
        totalResultQuantity
    );

    addCookingExp(
        gainedCookingExp
    );

    const statistics =
        player.cooking.statistics;

    /*
     * Łączna liczba ugotowanych potraw
     * uwzględnia bonus narzędzia.
     */
    statistics.totalMealsCooked +=
        totalResultQuantity;

    statistics.mealsByItem[
        recipe.resultItemId
    ] =
        (
            statistics.mealsByItem[
            recipe.resultItemId
            ] || 0
        ) +
        totalResultQuantity;

    /*
     * Statystyka receptury zapisuje
     * podstawową liczbę porcji.
     */
    statistics.recipesById[
        recipe.id
    ] =
        (
            statistics.recipesById[
            recipe.id
            ] || 0
        ) +
        quantity;

    if (
        typeof updateQuestMenuHighlight ===
        "function"
    ) {
        updateQuestMenuHighlight();
    }

    player.cooking.lastResult = {
        recipeId:
            recipe.id,

        itemId:
            recipe.resultItemId,

        /*
         * Całkowita liczba potraw
         * dodanych do plecaka.
         */
        quantity:
            totalResultQuantity,

        baseQuantity:
            quantity,

        extraQuantity:
            extraMealQuantity,

        cookingExp:
            gainedCookingExp,

        isToolBonus:
            extraMealQuantity > 0,

        cookedAt:
            Date.now()
    };

    const meal = items[recipe.resultItemId];

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            recipe.icon +
            " Ugotowano: " +
            (
                meal?.name ||
                recipe.name
            ) +
            " x" +
            totalResultQuantity +
            ". +" +
            gainedCookingExp +
            " EXP gotowania." +
            (
                extraMealQuantity > 0
                    ? (
                        " 🍳 Przybory kuchenne dodały " +
                        extraMealQuantity +
                        " dodatkowych porcji!"
                    )
                    : ""
            ),
            "cooking"
        );
    }

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Ugotowano " +
            totalResultQuantity +
            " porcji." +
            (
                extraMealQuantity > 0
                    ? (
                        " Bonus narzędzia: +" +
                        extraMealQuantity +
                        "."
                    )
                    : ""
            ),
            "success"
        );
    }

    saveGame();

    if (typeof renderCooking === "function") {
        renderCooking();
    }
    if (typeof renderInventory === "function") {
        renderInventory();
    }

    return true;
}

function cookMaxRecipe(recipeId) {
    const recipe = getCookingRecipe(recipeId);
    const maximum = getMaxCookableQuantity(recipe);

    if (maximum <= 0) {
        if (typeof showNotification === "function") {
            showNotification("Brakuje składników do ugotowania potrawy.", "error");
        }
        return false;
    }

    return cookRecipe(recipeId, maximum);
}
