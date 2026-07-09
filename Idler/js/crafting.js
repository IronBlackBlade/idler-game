function getInventoryItemQuantity(itemId) {
    const inventoryItem = player.inventory.find(item => item.itemId === itemId);

    if (!inventoryItem) {
        return 0;
    }

    return inventoryItem.quantity;
}

function canCraftRecipe(recipe) {
    if (!isRecipeUnlocked(recipe.id)) {
        return false;
    }

    if (player.gold < recipe.goldCost) {
        return false;
    }

    return recipe.materials.every(material => {
        return getInventoryItemQuantity(material.itemId) >= material.quantity;
    });
}

function craftItem(recipeId) {
    const recipe = recipes.find(recipe => recipe.id === recipeId);

    if (!recipe) {
        console.warn("Recipe not found:", recipeId);
        return;
    }

    if (!canCraftRecipe(recipe)) {
        if (typeof addCombatLog === "function") {
            addCombatLog("❌ Brakuje materiałów lub złota do wytworzenia przedmiotu.");
        }

        console.warn("Cannot craft recipe:", recipeId);
        return;
    }

    player.gold -= recipe.goldCost;

    recipe.materials.forEach(material => {
        removeItemFromInventory(material.itemId, material.quantity);
    });

    addItemToInventory(recipe.resultItemId);

    const resultItem = items[recipe.resultItemId];

    if (typeof addCombatLog === "function" && resultItem) {
        addCombatLog("⚒️ Wytworzono: " + resultItem.name + ".");
    }

    saveGame();
    render();
}

function isRecipeUnlocked(recipeId) {
    const recipe = recipes.find(recipe => recipe.id === recipeId);

    if (!recipe) {
        return false;
    }

    if (recipe.requiresScroll === false) {
        return true;
    }

    if (!player.unlockedRecipes) {
        player.unlockedRecipes = [];
    }

    return player.unlockedRecipes.includes(recipeId);
}

function getRecipeScrollItem(recipeId) {
    return Object.values(items).find(item => {
        return item.type === "recipe" && item.recipeId === recipeId;
    });
}

function unlockRecipe(recipeId) {
    const recipe = recipes.find(recipe => recipe.id === recipeId);

    if (!recipe) {
        console.warn("Recipe not found:", recipeId);
        return;
    }

    if (recipe.requiresScroll === false) {
    console.warn("Ta receptura jest dostępna od razu:", recipe.name);
    return;
}

    if (isRecipeUnlocked(recipeId)) {
        console.warn("Recipe already unlocked:", recipeId);
        return;
    }

    const recipeScroll = getRecipeScrollItem(recipeId);

    if (!recipeScroll) {
        console.warn("Recipe scroll item not found for:", recipeId);
        return;
    }

    const ownedScrolls = getInventoryItemQuantity(recipeScroll.id);

    if (ownedScrolls <= 0) {
        if (typeof addCombatLog === "function") {
            addCombatLog("❌ Nie posiadasz tej receptury.");
        }

        return;
    }

    if (player.gold < recipe.unlockCost) {
        if (typeof addCombatLog === "function") {
            addCombatLog("❌ Nie masz wystarczająco złota, aby odblokować recepturę.");
        }

        return;
    }

    player.gold -= recipe.unlockCost;

    removeItemFromInventory(recipeScroll.id, 1);

    player.unlockedRecipes.push(recipeId);

    if (typeof addCombatLog === "function") {
        addCombatLog("📜 Odblokowano recepturę: " + recipe.name + ".");
    }

    saveGame();
    render();
}