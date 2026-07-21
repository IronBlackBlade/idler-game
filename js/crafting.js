function getRecipeRequiredCraftingLevel(
    recipe
) {
    return Math.max(
        1,
        Math.floor(
            Number(
                recipe
                    ?.requiredCraftingLevel
            ) || 1
        )
    );
}

function getRecipeCraftingExp(
    recipe
) {
    return Math.max(
        1,
        Math.floor(
            Number(
                recipe?.craftingExp
            ) || 10
        )
    );
}

function hasRequiredCraftingLevel(
    recipe
) {
    ensureCraftingState();

    return (
        player.crafting.level >=
        getRecipeRequiredCraftingLevel(
            recipe
        )
    );
}

function getCraftingExpToNextLevel(
    level
) {
    const safeLevel =
        Math.max(
            1,
            Math.floor(
                Number(level) || 1
            )
        );

    return Math.floor(
        100 +
        (safeLevel - 1) * 50 +
        Math.pow(
            safeLevel - 1,
            1.25
        ) * 25
    );
}

function ensureCraftingState() {
    if (
        !player.crafting ||
        typeof player.crafting !==
            "object"
    ) {
        player.crafting = {
            level: 1,
            exp: 0,
            expToNextLevel:
                getCraftingExpToNextLevel(1)
        };
    }

    player.crafting.level =
        Math.max(
            1,
            Math.floor(
                Number(
                    player.crafting.level
                ) || 1
            )
        );

    player.crafting.exp =
        Math.max(
            0,
            Math.floor(
                Number(
                    player.crafting.exp
                ) || 0
            )
        );

    player.crafting.expToNextLevel =
        getCraftingExpToNextLevel(
            player.crafting.level
        );
}


function addCraftingExp(
    amount
) {
    ensureCraftingState();

    const expGain =
        Math.max(
            0,
            Math.floor(
                Number(amount) || 0
            )
        );

    if (expGain <= 0) {
        return;
    }

    player.crafting.exp +=
        expGain;

    let gainedLevels = 0;

    while (
        player.crafting.exp >=
        player.crafting.expToNextLevel
    ) {
        player.crafting.exp -=
            player.crafting
                .expToNextLevel;

        player.crafting.level++;

        player.crafting.expToNextLevel =
            getCraftingExpToNextLevel(
                player.crafting.level
            );

        gainedLevels++;
    }

    if (
        gainedLevels > 0 &&
        typeof showNotification ===
            "function"
    ) {
        showNotification(
            "Poziom rzemiosła wzrósł do " +
            player.crafting.level +
            "!",
            "success"
        );
    }
}

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

function normalizeCraftCount(
    craftCount
) {
    return Math.max(
        1,
        Math.floor(
            Number(craftCount) || 1
        )
    );
}

function getRecipeResultQuantity(
    recipe
) {
    if (!recipe) {
        return 1;
    }

    return Math.max(
        1,
        Math.floor(
            Number(
                recipe.resultQuantity
            ) || 1
        )
    );
}

function getRecipeTotalGoldCost(
    recipe,
    craftCount = 1
) {
    const safeCraftCount =
        normalizeCraftCount(
            craftCount
        );

    /*
     * Koszt jednego wykonania,
     * już po uwzględnieniu zniżki.
     */
    const singleCraftGoldCost =
        getFinalCraftingGoldCost(
            recipe
        );

    /*
     * Koszt jednego wykonania
     * mnożymy przez liczbę wykonań.
     */
    return (
        singleCraftGoldCost *
        safeCraftCount
    );
}

function getRecipeMaxCraftCountByMaterials(
    recipe
) {
    if (
        !recipe ||
        !Array.isArray(
            recipe.materials
        ) ||
        recipe.materials.length === 0
    ) {
        return Number.MAX_SAFE_INTEGER;
    }

    const materialLimits =
        recipe.materials.map(
            material => {
                const ownedQuantity =
                    getCraftingItemQuantity(
                        material.itemId
                    );

                const requiredQuantity =
                    Math.max(
                        1,
                        Math.floor(
                            Number(
                                material.quantity
                            ) || 1
                        )
                    );

                return Math.floor(
                    ownedQuantity /
                    requiredQuantity
                );
            }
        );

    return Math.min(
        ...materialLimits
    );
}

function getRecipeMaxCraftCountByGold(
    recipe
) {
    const singleCraftGoldCost =
        getFinalCraftingGoldCost(
            recipe
        );

    /*
     * Darmowa receptura nie jest
     * ograniczona przez złoto.
     */
    if (
        singleCraftGoldCost <= 0
    ) {
        return Number.MAX_SAFE_INTEGER;
    }

    const playerGold =
        Math.max(
            0,
            Number(player.gold) || 0
        );

    return Math.floor(
        playerGold /
        singleCraftGoldCost
    );
}

function getMaxRecipeCraftCount(
    recipe
) {
    if (!recipe) {
        return 0;
    }

    if (
    !hasRequiredCraftingLevel(
        recipe
    )
) {
    return 0;
}

    if (
        !isRecipeUnlocked(
            recipe.id
        )
    ) {
        return 0;
    }

    const materialLimit =
        getRecipeMaxCraftCountByMaterials(
            recipe
        );

    const goldLimit =
        getRecipeMaxCraftCountByGold(
            recipe
        );

    const maximumCraftCount =
        Math.min(
            materialLimit,
            goldLimit
        );

    /*
     * Limit bezpieczeństwa.
     * Nie pozwalamy wykonać więcej niż
     * 9999 operacji jednym kliknięciem.
     */
    return Math.max(
        0,
        Math.min(
            9999,
            Math.floor(
                maximumCraftCount
            )
        )
    );
}

function getEquippedCraftingItemSlots(
    itemId
) {
    if (
        !player.equipment ||
        typeof player.equipment !==
            "object"
    ) {
        return [];
    }

    return Object.entries(
        player.equipment
    )
        .filter(
            (
                [
                    slot,
                    equippedItemId
                ]
            ) => {
                return (
                    equippedItemId ===
                    itemId
                );
            }
        )
        .map(
            ([slot]) => slot
        );
}

function getEquippedCraftingItemQuantity(
    itemId
) {
    return getEquippedCraftingItemSlots(
        itemId
    ).length;
}

function getCraftingItemQuantity(
    itemId
) {
    const inventoryQuantity =
        getInventoryItemQuantity(
            itemId
        );

    const equippedQuantity =
        getEquippedCraftingItemQuantity(
            itemId
        );

    return (
        inventoryQuantity +
        equippedQuantity
    );
}

function getRecipeEquippedMaterials(
    recipe,
    craftCount = 1
) {
    if (
        !recipe ||
        !Array.isArray(
            recipe.materials
        )
    ) {
        return [];
    }

    const safeCraftCount =
        normalizeCraftCount(
            craftCount
        );

    return recipe.materials
        .map(material => {
            const inventoryQuantity =
                getInventoryItemQuantity(
                    material.itemId
                );

            const equippedQuantity =
                getEquippedCraftingItemQuantity(
                    material.itemId
                );

            const totalRequiredQuantity =
                material.quantity *
                safeCraftCount;

            /*
             * Najpierw korzystamy
             * z egzemplarzy w plecaku.
             */
            const missingFromInventory =
                Math.max(
                    0,
                    totalRequiredQuantity -
                        inventoryQuantity
                );

            /*
             * Tylko brakującą część
             * bierzemy z wyposażenia.
             */
            const quantityFromEquipment =
                Math.min(
                    equippedQuantity,
                    missingFromInventory
                );

            if (
                quantityFromEquipment <= 0
            ) {
                return null;
            }

            return {
                itemId:
                    material.itemId,

                quantity:
                    quantityFromEquipment
            };
        })
        .filter(Boolean);
}

function removeCraftingItem(
    itemId,
    requestedAmount
) {
    let remainingAmount =
        Math.max(
            0,
            Math.floor(
                Number(
                    requestedAmount
                ) || 0
            )
        );

    if (remainingAmount <= 0) {
        return true;
    }

    /*
     * Najpierw zużywamy egzemplarze
     * znajdujące się w plecaku.
     */
    const inventoryQuantity =
        getInventoryItemQuantity(
            itemId
        );

    const inventoryAmount =
        Math.min(
            inventoryQuantity,
            remainingAmount
        );

    if (inventoryAmount > 0) {
        removeItemFromInventory(
            itemId,
            inventoryAmount
        );

        remainingAmount -=
            inventoryAmount;
    }

    /*
     * Dopiero gdy w plecaku zabrakło
     * przedmiotów, zużywamy wyposażenie.
     */
    if (remainingAmount > 0) {
        const equippedSlots =
            getEquippedCraftingItemSlots(
                itemId
            );

        for (
            const slot of equippedSlots
        ) {
            if (
                remainingAmount <= 0
            ) {
                break;
            }

            player.equipment[slot] =
                null;

            remainingAmount--;
        }
    }

    if (remainingAmount > 0) {
        console.warn(
            "Nie udało się usunąć wszystkich składników:",
            itemId,
            remainingAmount
        );

        return false;
    }

    return true;
}

function normalizePlayerResourcesAfterCrafting() {
    if (
        typeof getDerivedStats !==
            "function"
    ) {
        return;
    }

    const derived =
        getDerivedStats();

    player.hp = Math.min(
        Number(player.hp) || 0,
        derived.maxHp
    );

    player.mana = Math.min(
        Number(player.mana) || 0,
        derived.maxMana
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

function canCraftRecipe(
    recipe,
    craftCount = 1
) {
    if (!recipe) {
        return false;
    }

    if (
    !hasRequiredCraftingLevel(
        recipe
    )
) {
    return false;
}

    if (
        !isRecipeUnlocked(
            recipe.id
        )
    ) {
        return false;
    }

    const safeCraftCount =
        normalizeCraftCount(
            craftCount
        );

    const totalGoldCost =
        getRecipeTotalGoldCost(
            recipe,
            safeCraftCount
        );

    if (
        player.gold <
        totalGoldCost
    ) {
        return false;
    }

    return recipe.materials.every(
        material => {
            const totalRequiredQuantity =
                material.quantity *
                safeCraftCount;

            return (
                getCraftingItemQuantity(
                    material.itemId
                ) >=
                totalRequiredQuantity
            );
        }
    );
}

function craftItem(
    recipeId,
    craftCount = 1
) {
    const recipe =
        recipes.find(
            recipeEntry => {
                return (
                    recipeEntry.id ===
                    recipeId
                );
            }
        );

    if (!recipe) {
        console.warn(
            "Nie znaleziono receptury:",
            recipeId
        );

        return;
    }

    if (
        !isRecipeUnlocked(
            recipe.id
        )
    ) {
        if (
            typeof showNotification ===
                "function"
        ) {
            showNotification(
                "Ta receptura nie została jeszcze odblokowana.",
                "error"
            );
        }

        return;
    }

    const safeCraftCount =
        normalizeCraftCount(
            craftCount
        );

    const maximumCraftCount =
        getMaxRecipeCraftCount(
            recipe
        );

    /*
     * Gdy można wykonać recepturę
     * przynajmniej raz, ale podana
     * liczba jest zbyt duża.
     */
    if (
        maximumCraftCount > 0 &&
        safeCraftCount >
            maximumCraftCount
    ) {
        if (
            typeof showNotification ===
                "function"
        ) {
            showNotification(
                "Możesz wykonać tę recepturę maksymalnie " +
                maximumCraftCount +
                " razy.",
                "error"
            );
        }

        return;
    }


    const totalGoldCost =
        getRecipeTotalGoldCost(
            recipe,
            safeCraftCount
        );

    if (
        player.gold <
        totalGoldCost
    ) {
        if (
            typeof showNotification ===
                "function"
        ) {
            showNotification(
                "Brakuje złota. Potrzebujesz " +
                totalGoldCost +
                " 💰.",
                "error"
            );
        }

        return;
    }

    const missingMaterials =
        recipe.materials.filter(
            material => {
                const totalRequiredQuantity =
                    material.quantity *
                    safeCraftCount;

                return (
                    getCraftingItemQuantity(
                        material.itemId
                    ) <
                    totalRequiredQuantity
                );
            }
        );

    if (
        missingMaterials.length > 0
    ) {
        const missingText =
            missingMaterials.map(
                material => {
                    const materialItem =
                        items[
                            material.itemId
                        ];

                    const ownedQuantity =
                        getCraftingItemQuantity(
                            material.itemId
                        );

                    const totalRequiredQuantity =
                        material.quantity *
                        safeCraftCount;

                    const missingQuantity =
                        totalRequiredQuantity -
                        ownedQuantity;

                    return (
                        (
                            materialItem?.name ||
                            material.itemId
                        ) +
                        " x" +
                        missingQuantity
                    );
                }
            );

        if (
            typeof showNotification ===
                "function"
        ) {
            showNotification(
                "Brakuje materiałów: " +
                missingText.join(", "),
                "error"
            );
        }

        return;
    }

    const equippedMaterials =
        getRecipeEquippedMaterials(
            recipe,
            safeCraftCount
        );

    if (
        equippedMaterials.length > 0
    ) {
        const equippedMaterialsText =
            equippedMaterials
                .map(material => {
                    const item =
                        items[
                            material.itemId
                        ];

                    return (
                        "• " +
                        (
                            item?.name ||
                            material.itemId
                        ) +
                        " x" +
                        material.quantity
                    );
                })
                .join("\n");

        const shouldCraft =
            window.confirm(
                "Ta operacja zużyje aktualnie założone wyposażenie:\n\n" +
                equippedMaterialsText +
                "\n\nLiczba wykonań receptury: " +
                safeCraftCount +
                "\n\nPrzedmioty zostaną zdjęte i bezpowrotnie wykorzystane. Kontynuować?"
            );

        if (!shouldCraft) {
            return;
        }
    }

    /*
     * Wszystkie testy przeszły,
     * więc dopiero teraz odejmujemy
     * złoto i składniki.
     */
    player.gold -=
        totalGoldCost;

    recipe.materials.forEach(
        material => {
            const totalRequiredQuantity =
                material.quantity *
                safeCraftCount;

            removeCraftingItem(
                material.itemId,
                totalRequiredQuantity
            );
        }
    );

    normalizePlayerResourcesAfterCrafting();

    const singleResultQuantity =
        getRecipeResultQuantity(
            recipe
        );

    const totalResultQuantity =
        singleResultQuantity *
        safeCraftCount;

    addItemToInventory(
        recipe.resultItemId,
        totalResultQuantity
    );

const craftingExpPerCraft =
    getRecipeCraftingExp(
        recipe
    );

const totalCraftingExp =
    craftingExpPerCraft *
    safeCraftCount;

console.log(
    "CRAFTING EXP — przed:",
    {
        recipeId: recipe.id,
        craftingExpPerCraft:
            craftingExpPerCraft,
        craftCount:
            safeCraftCount,
        totalCraftingExp:
            totalCraftingExp,
        currentExp:
            player.crafting.exp
    }
);

addCraftingExp(
    totalCraftingExp
);


    const resultItem =
        items[
            recipe.resultItemId
        ];

    const resultName =
        resultItem?.name ||
        recipe.name;

    const executionText =
        safeCraftCount > 1
            ? (
                " (" +
                safeCraftCount +
                " wykonań)"
            )
            : "";

    if (
        typeof showNotification ===
            "function"
    ) {
        showNotification(
            "Wytworzono: " +
            resultName +
            " x" +
            totalResultQuantity,
            "success"
        );
    }

    if (
        typeof addCombatLog ===
            "function"
    ) {
        addCombatLog(
            "⚒️ Wytworzono: " +
            resultName +
            " x" +
            totalResultQuantity +
            executionText +
            "."
        );
    }

    if (
        typeof addSystemLog ===
            "function"
    ) {
        const baseTotalGoldCost =
            (
                Number(
                    recipe.goldCost
                ) || 0
            ) *
            safeCraftCount;

        const savedGold =
            baseTotalGoldCost -
            totalGoldCost;

        let systemMessage =
            "⚒️ Wytworzono: " +
            resultName +
            " x" +
            totalResultQuantity +
            executionText +
            " za " +
            totalGoldCost +
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

    if (
        typeof refreshCraftingView ===
            "function"
    ) {
        refreshCraftingView();
    }
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

    if (
    typeof refreshCraftingView ===
        "function"
) {
    refreshCraftingView();
}

}