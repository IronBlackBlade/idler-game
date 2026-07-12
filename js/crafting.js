function getInventoryItemQuantity(itemId) {
    if (!Array.isArray(player.inventory)) {
        player.inventory = [];
    }

    const inventoryItem = player.inventory.find(item => {
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

    return Math.max(
        0,
        Math.ceil(
            baseCost * (1 - reduction / 100)
        )
    );
}

function isRecipeUnlocked(recipeId) {
    const recipe = recipes.find(recipe => {
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
    return Object.values(items).find(item => {
        return (
            item.type === "recipe" &&
            item.recipeId === recipeId
        );
    });
}

function canCraftRecipe(recipe) {
    if (!recipe) {
        return false;
    }

    if (!isRecipeUnlocked(recipe.id)) {
        return false;
    }

    const finalGoldCost =
        getFinalCraftingGoldCost(recipe);

    if (player.gold < finalGoldCost) {
        return false;
    }

    return recipe.materials.every(material => {
        return (
            getInventoryItemQuantity(material.itemId) >=
            material.quantity
        );
    });
}

function craftItem(recipeId) {
    const recipe = recipes.find(recipe => {
        return recipe.id === recipeId;
    });

    if (!recipe) {
        console.warn(
            "Nie znaleziono receptury:",
            recipeId
        );

        return;
    }

    if (!isRecipeUnlocked(recipe.id)) {
        if (typeof showNotification === "function") {
            showNotification(
                "Ta receptura nie została jeszcze odblokowana.",
                "error"
            );
        }

        return;
    }

    const finalGoldCost =
        getFinalCraftingGoldCost(recipe);

    if (player.gold < finalGoldCost) {
        if (typeof showNotification === "function") {
            showNotification(
                `Brakuje złota. Potrzebujesz ${finalGoldCost} 💰.`,
                "error"
            );
        }

        return;
    }

    const missingMaterials =
        recipe.materials.filter(material => {
            const ownedQuantity =
                getInventoryItemQuantity(
                    material.itemId
                );

            return ownedQuantity < material.quantity;
        });

    if (missingMaterials.length > 0) {
        const missingText =
            missingMaterials.map(material => {
                const materialItem =
                    items[material.itemId];

                const ownedQuantity =
                    getInventoryItemQuantity(
                        material.itemId
                    );

                const missingQuantity =
                    material.quantity -
                    ownedQuantity;

                return `${
                    materialItem?.name ||
                    material.itemId
                } x${missingQuantity}`;
            });

        if (typeof showNotification === "function") {
            showNotification(
                `Brakuje materiałów: ${missingText.join(", ")}`,
                "error"
            );
        }

        return;
    }

    player.gold -= finalGoldCost;

    recipe.materials.forEach(material => {
        removeItemFromInventory(
            material.itemId,
            material.quantity
        );
    });

    addItemToInventory(recipe.resultItemId);

    const resultItem =
        items[recipe.resultItemId];

    if (typeof showNotification === "function") {
        showNotification(
            `Wytworzono: ${
                resultItem?.name ||
                recipe.name
            }`,
            "success"
        );
    }

    if (
        typeof addCombatLog === "function" &&
        resultItem
    ) {
        addCombatLog(
            "⚒️ Wytworzono: " +
            resultItem.name +
            "."
        );
    }

    if (
        typeof addSystemLog === "function" &&
        resultItem
    ) {
        const savedGold =
            (recipe.goldCost || 0) -
            finalGoldCost;

        let systemMessage =
            "⚒️ Wytworzono: " +
            resultItem.name +
            " za " +
            finalGoldCost +
            " złota.";

        if (savedGold > 0) {
            systemMessage +=
                " Zaoszczędzono " +
                savedGold +
                " złota dzięki umiejętności.";
        }

        addSystemLog(
            systemMessage,
            "crafting"
        );
    }

    saveGame();
    render();
}

function unlockRecipe(recipeId) {
    const recipe = recipes.find(recipe => {
        return recipe.id === recipeId;
    });

    if (!recipe) {
        console.warn(
            "Nie znaleziono receptury:",
            recipeId
        );

        return;
    }

    if (recipe.requiresScroll === false) {
        console.warn(
            "Ta receptura jest dostępna od razu:",
            recipe.name
        );

        return;
    }

    if (isRecipeUnlocked(recipeId)) {
        if (typeof showNotification === "function") {
            showNotification(
                "Ta receptura jest już odblokowana.",
                "error"
            );
        }

        return;
    }

    const recipeScroll =
        getRecipeScrollItem(recipeId);

    if (!recipeScroll) {
        console.warn(
            "Nie znaleziono zwoju receptury:",
            recipeId
        );

        return;
    }

    const ownedScrolls =
        getInventoryItemQuantity(
            recipeScroll.id
        );

    if (ownedScrolls <= 0) {
        if (typeof showNotification === "function") {
            showNotification(
                "Nie posiadasz tej receptury.",
                "error"
            );
        }

        return;
    }

    const unlockCost =
        recipe.unlockCost || 0;

    if (player.gold < unlockCost) {
        if (typeof showNotification === "function") {
            showNotification(
                `Nie masz wystarczająco złota. Potrzebujesz ${unlockCost} 💰.`,
                "error"
            );
        }

        return;
    }

    if (!Array.isArray(player.unlockedRecipes)) {
        player.unlockedRecipes = [];
    }

    player.gold -= unlockCost;

    removeItemFromInventory(
        recipeScroll.id,
        1
    );

    player.unlockedRecipes.push(recipeId);

    if (typeof showNotification === "function") {
        showNotification(
            `Odblokowano recepturę: ${recipe.name}`,
            "success"
        );
    }

    if (typeof addCombatLog === "function") {
        addCombatLog(
            "📜 Odblokowano recepturę: " +
            recipe.name +
            "."
        );
    }

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "📜 Odblokowano recepturę: " +
            recipe.name +
            " za " +
            unlockCost +
            " złota.",
            "recipe"
        );
    }

    saveGame();
    render();
}