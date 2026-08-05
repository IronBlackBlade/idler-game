function ensureLockedInventoryItems() {
    if (
        !player.lockedInventoryItems ||
        typeof player.lockedInventoryItems !==
        "object" ||
        Array.isArray(
            player.lockedInventoryItems
        )
    ) {
        player.lockedInventoryItems = {};
    }
}

function getInventoryItemQuantity(
    itemId
) {
    if (
        !Array.isArray(
            player.inventory
        )
    ) {
        return 0;
    }

    const inventoryItem =
        player.inventory.find(entry => {
            return (
                entry.itemId ===
                itemId
            );
        });

    return inventoryItem
        ? Math.max(
            0,
            Number(
                inventoryItem.quantity
            ) || 0
        )
        : 0;
}

function isInventoryItemLocked(
    itemId
) {
    ensureLockedInventoryItems();

    return (
        player.lockedInventoryItems[
        itemId
        ] === true
    );
}

function setInventoryItemLocked(
    itemId,
    shouldLock
) {
    ensureLockedInventoryItems();

    if (shouldLock) {
        player.lockedInventoryItems[
            itemId
        ] = true;
    } else {
        delete player
            .lockedInventoryItems[
            itemId
        ];
    }
}

function toggleInventoryItemLock(
    itemId
) {
    const inventoryEntry =
        player.inventory.find(
            entry => {
                return (
                    entry.itemId ===
                    itemId
                );
            }
        );

    if (!inventoryEntry) {
        return;
    }

    const item =
        items[itemId];

    if (!item) {
        return;
    }

    const shouldLock =
        !isInventoryItemLocked(
            itemId
        );

    setInventoryItemLocked(
        itemId,
        shouldLock
    );

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            shouldLock
                ? (
                    "Zablokowano: " +
                    item.name +
                    "."
                )
                : (
                    "Odblokowano: " +
                    item.name +
                    "."
                ),
            "success"
        );
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            shouldLock
                ? (
                    "🔒 Zablokowano przedmiot: " +
                    item.name +
                    "."
                )
                : (
                    "🔓 Odblokowano przedmiot: " +
                    item.name +
                    "."
                ),
            "inventory"
        );
    }

    saveGame();
    render();

    if (
        typeof refreshHeroInventoryView ===
        "function"
    ) {
        refreshHeroInventoryView();
    }
}

function isEquipmentTradeItem(
    item
) {
    if (!item) {
        return false;
    }

    const equipmentTypes = [
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
        "profession_tool"
    ];

    return equipmentTypes.includes(
        item.type
    );
}

function getFinalSellPrice(
    item
) {
    if (!item) {
        return 0;
    }

    const baseValue =
        Math.max(
            0,
            Number(item.value) || 0
        );

    const regularSellBonus =
        typeof getTradeSellPriceBonus ===
            "function"
            ? getTradeSellPriceBonus()
            : 0;

    const equipmentSellBonus =
        isEquipmentTradeItem(item) &&
            typeof getEquipmentSellPriceBonus ===
            "function"
            ? getEquipmentSellPriceBonus()
            : 0;

    const totalSellBonus =
        regularSellBonus +
        equipmentSellBonus;

    return Math.max(
        0,
        Math.floor(
            baseValue *
            (
                1 +
                totalSellBonus /
                100
            )
        )
    );
}

function getHotMerchandiseSaleResult(
    item,
    sellAmount
) {
    const safeSellAmount =
        Math.max(
            0,
            Math.floor(
                Number(sellAmount) || 0
            )
        );

    const singleItemPrice =
        getFinalSellPrice(
            item
        );

    if (
        safeSellAmount <= 0 ||
        singleItemPrice <= 0
    ) {
        return {
            totalPrice: 0,
            bonusItemCount: 0,
            bonusGold: 0
        };
    }

    const bonusChance =
        typeof getHotMerchandiseChance ===
            "function"
            ? getHotMerchandiseChance()
            : 0;

    let bonusItemCount = 0;

    /*
     * Każda sprzedawana sztuka
     * otrzymuje osobne losowanie.
     */
    for (
        let itemIndex = 0;
        itemIndex < safeSellAmount;
        itemIndex++
    ) {
        const bonusTriggered =
            typeof rollTradeChance ===
                "function"
                ? rollTradeChance(
                    bonusChance
                )
                : false;

        if (bonusTriggered) {
            bonusItemCount++;
        }
    }


    const baseTotalPrice =
        singleItemPrice *
        safeSellAmount;

    const sellingCapstoneActive =
        typeof isTradeCapstoneSelected ===
        "function" &&
        isTradeCapstoneSelected(
            "trade_selling_capstone"
        );

    const bonusPriceMultiplier =
        sellingCapstoneActive
            ? 2
            : 1;

    const bonusGold =
        singleItemPrice *
        bonusItemCount *
        bonusPriceMultiplier;

    return {
        totalPrice:
            baseTotalPrice +
            bonusGold,

        bonusItemCount:
            bonusItemCount,

        bonusGold:
            bonusGold,

        triplePriceActive:
            sellingCapstoneActive
    };
}

function sellItem(itemId, amount) {
    const invItem =
        player.inventory.find(item => {
            return item.itemId === itemId;
        });

    const item = items[itemId];

    if (!invItem) {
        console.warn(
            "Nie ma takiego przedmiotu w plecaku:",
            itemId
        );
        return;
    }

    if (!item) {
        console.warn(
            "Nie znaleziono itemu w items:",
            itemId
        );
        return;
    }

    if (item.canSell === false) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Tego przedmiotu nie można sprzedać.",
                "error"
            );
        }

        if (
            typeof addSystemLog ===
            "function"
        ) {
            addSystemLog(
                "🗝️ Nie można sprzedać przedmiotu: " +
                item.name +
                ".",
                "inventory"
            );
        }

        return;
    }

    if (
        isInventoryItemLocked(
            itemId
        )
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Ten przedmiot jest zablokowany. Najpierw go odblokuj.",
                "error"
            );
        }

        return;
    }

    const sellAmount = Math.min(
        Math.floor(amount),
        invItem.quantity
    );

    if (sellAmount <= 0) {
        return;
    }

    const saleResult =
        getHotMerchandiseSaleResult(
            item,
            sellAmount
        );

    const totalSellPrice =
        saleResult.totalPrice;

    const hotMerchandiseCount =
        saleResult.bonusItemCount;

    const hotMerchandiseGold =
        saleResult.bonusGold;
    const triplePriceActive =
        saleResult.triplePriceActive ===
        true;

    player.gold += totalSellPrice;
    invItem.quantity -= sellAmount;

    if (
        invItem.quantity <= 0 &&
        item.type ===
        "profession_tool" &&
        item.toolType &&
        player.professionTools?.[
        item.toolType
        ] === itemId
    ) {
        player.professionTools[
            item.toolType
        ] = null;

        if (
            typeof addSystemLog ===
            "function"
        ) {
            addSystemLog(
                "🧰 Sprzedano aktywne narzędzie. Zostało automatycznie wyłączone: " +
                item.name +
                ".",
                "profession"
            );
        }
    }

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "💰 Sprzedano: " +
            item.name +
            " x" +
            sellAmount +
            " za " +
            totalSellPrice +
            " złota.",
            "sale"
        );
    }
    if (
        hotMerchandiseCount > 0 &&
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "🔥 Gorący towar: " +
            hotMerchandiseCount +
            (
                hotMerchandiseCount === 1
                    ? " sztuka została"
                    : " sztuki zostały"
            ) +
            " sprzedana po " +
            (
                triplePriceActive
                    ? "potrójnej"
                    : "podwójnej"
            ) +
            " cenie. Bonus: +" +
            hotMerchandiseGold +
            " złota.",
            "sale"
        );
    }
    if (invItem.quantity <= 0) {
        player.inventory =
            player.inventory.filter(
                inventoryItem => {
                    return (
                        inventoryItem.itemId !==
                        itemId
                    );
                }
            );
    }

    if (
        typeof showNotification === "function"
    ) {
        showNotification(
            `Sprzedano: ${item.name} x${sellAmount} za ${totalSellPrice} 💰.`,
            "success"
        );
    }

    if (
        typeof addCombatLog === "function"
    ) {
        addCombatLog(
            "💰 Sprzedano: " +
            item.name +
            " x" +
            sellAmount +
            " za " +
            totalSellPrice +
            " złota."
        );
    }

    saveGame();
    render();

    if (
        typeof refreshHeroInventoryView ===
        "function"
    ) {
        refreshHeroInventoryView();
    }
}


function sellAllItems(itemId) {
    const invItem = player.inventory.find(item => item.itemId === itemId);

    if (!invItem) return;

    sellItem(itemId, invItem.quantity);
}

function isItemNeededForCrafting(
    itemId
) {
    const usedInCrafting =
        typeof recipes !==
        "undefined" &&
        Array.isArray(recipes) &&
        recipes.some(recipe => {
            const materials =
                Array.isArray(
                    recipe.materials
                )
                    ? recipe.materials
                    : [];

            return materials.some(
                material => {
                    return (
                        material.itemId ===
                        itemId
                    );
                }
            );
        });

    const usedInAlchemy =
        typeof alchemyRecipes !==
        "undefined" &&
        Array.isArray(
            alchemyRecipes
        ) &&
        alchemyRecipes.some(recipe => {
            const ingredients =
                Array.isArray(
                    recipe.ingredients
                )
                    ? recipe.ingredients
                    : [];

            return ingredients.some(
                ingredient => {
                    return (
                        ingredient.itemId ===
                        itemId
                    );
                }
            );
        });

    return (
        usedInCrafting ||
        usedInAlchemy
    );
}

function getSellableMonsterTrashSummary() {
    const summary = {
        items: [],
        totalQuantity: 0,
        totalGold: 0
    };

    if (
        !Array.isArray(
            player.inventory
        )
    ) {
        return summary;
    }

    player.inventory.forEach(
        inventoryItem => {
            const itemId =
                inventoryItem.itemId;

            const item =
                items[itemId];

            const quantity =
                Math.max(
                    0,
                    Math.floor(
                        Number(
                            inventoryItem.quantity
                        ) || 0
                    )
                );

            if (
                !item ||
                quantity <= 0
            ) {
                return;
            }

            if (
                typeof isInventoryItemLocked ===
                "function" &&
                isInventoryItemLocked(
                    itemId
                )
            ) {
                return;
            }

            if (
                typeof isMonsterLootInventoryItem !==
                "function" ||
                !isMonsterLootInventoryItem(
                    item,
                    itemId
                )
            ) {
                return;
            }

            if (
                isItemNeededForCrafting(
                    itemId
                )
            ) {
                return;
            }

            const singlePrice =
                getFinalSellPrice(
                    item
                );

            summary.items.push({
                itemId:
                    itemId,
                quantity:
                    quantity
            });

            summary.totalQuantity +=
                quantity;

            summary.totalGold +=
                singlePrice *
                quantity;
        }
    );

    return summary;
}

function sellAllUnusedMonsterLoot() {
    const summary =
        getSellableMonsterTrashSummary();

    if (
        summary.items.length === 0
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Brak niepotrzebnych łupów do sprzedaży.",
                "error"
            );
        }

        return;
    }

    const soldItemIds =
        new Set(
            summary.items.map(
                soldItem => {
                    return (
                        soldItem.itemId
                    );
                }
            )
        );

    player.inventory =
        player.inventory.filter(
            inventoryItem => {
                return (
                    !soldItemIds.has(
                        inventoryItem.itemId
                    )
                );
            }
        );

    let finalTotalGold = 0;
    let totalHotMerchandiseCount = 0;
    let totalHotMerchandiseGold = 0;
    let kingOfMarketActive = false;

    summary.items.forEach(
        soldItem => {
            const item =
                items[
                soldItem.itemId
                ];

            if (!item) {
                return;
            }

            const saleResult =
                getHotMerchandiseSaleResult(
                    item,
                    soldItem.quantity
                );

            finalTotalGold +=
                saleResult.totalPrice;

            totalHotMerchandiseCount +=
                saleResult.bonusItemCount;

            totalHotMerchandiseGold +=
                saleResult.bonusGold;
            if (
                saleResult.triplePriceActive
            ) {
                kingOfMarketActive = true;
            }
        }
    );

    player.gold +=
        finalTotalGold;

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "💰 Sprzedano niepotrzebne łupy: x" +
            summary.totalQuantity +
            " za " +
            finalTotalGold +
            " złota.",
            "sale"
        );
    }

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Sprzedano " +
            summary.totalQuantity +
            " niepotrzebnych łupów za " +
            finalTotalGold +
            " 💰.",
            "success"
        );
    }

    if (
        totalHotMerchandiseCount > 0 &&
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            (
                kingOfMarketActive
                    ? "👑 Król rynku: "
                    : "🔥 Gorący towar: "
            ) +
            totalHotMerchandiseCount +
            (
                totalHotMerchandiseCount === 1
                    ? " sztuka została sprzedana"
                    : " sztuk zostało sprzedanych"
            ) +
            " po " +
            (
                kingOfMarketActive
                    ? "potrójnej"
                    : "podwójnej"
            ) +
            " cenie. Bonus: +" +
            totalHotMerchandiseGold +
            " złota.",
            "sale"
        );
    }

    saveGame();
    render();

    if (
        typeof refreshHeroInventoryView ===
        "function"
    ) {
        refreshHeroInventoryView();
    }
}

function sellCustomAmount(itemId) {
    const input = document.getElementById("sell-" + itemId);
    const amount = Number(input.value);

    if (!amount || amount <= 0) return;

    sellItem(itemId, amount);
}

function getItemTypeForEquipmentSlot(
    slot
) {
    const slotItemTypes = {
        weapon: "weapon",
        shield: "shield",
        helmet: "helmet",
        armor: "armor",
        pants: "pants",
        boots: "boots",
        gloves: "gloves",

        ring1: "ring",
        ring2: "ring",

        amulet: "amulet",
        talisman: "talisman"
    };

    return (
        slotItemTypes[slot] ||
        null
    );
}

function canEquipItemInSlot(
    item,
    slot
) {
    if (!item || !slot) {
        return false;
    }

    const requiredItemType =
        getItemTypeForEquipmentSlot(
            slot
        );

    return (
        requiredItemType ===
        item.type
    );
}

function getOtherRingSlot(
    slot
) {
    if (slot === "ring1") {
        return "ring2";
    }

    if (slot === "ring2") {
        return "ring1";
    }

    return null;
}

function isSameRingEquippedInOtherSlot(
    itemId,
    slot
) {
    const item =
        items[itemId];

    if (
        !item ||
        item.type !== "ring"
    ) {
        return false;
    }

    const otherRingSlot =
        getOtherRingSlot(
            slot
        );

    if (!otherRingSlot) {
        return false;
    }

    return (
        player.equipment?.[
        otherRingSlot
        ] === itemId
    );
}
function normalizeDuplicateEquippedRings() {
    if (!player.equipment) {
        return false;
    }

    const firstRingId =
        player.equipment.ring1;

    const secondRingId =
        player.equipment.ring2;

    if (
        !firstRingId ||
        !secondRingId ||
        firstRingId !== secondRingId
    ) {
        return false;
    }

    /*
     * Pierścień z drugiego slotu
     * wraca do plecaka.
     */
    addItemToInventory(
        secondRingId,
        1
    );

    player.equipment.ring2 =
        null;

    const ringItem =
        items[secondRingId];

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "💍 Zdjęto zduplikowany pierścień" +
            (
                ringItem
                    ? ": " +
                    ringItem.name
                    : ""
            ) +
            ". Przedmiot wrócił do plecaka.",
            "equipment"
        );
    }

    return true;
}


function equipItem(
    itemId,
    requestedSlot = null
) {
    const item = items[itemId];

    if (!item) {
        console.warn("Nie znaleziono przedmiotu:", itemId);
        return;
    }

    if (!item.type) {
        console.warn("Ten przedmiot nie ma typu i nie można go założyć:", item.name);
        return;
    }

    const requiredLevel = Math.max(
        1,
        Number(item.requiredLevel) || 1
    );
    const playerLevel = Math.max(
        1,
        Number(player.level) || 1
    );

    if (playerLevel < requiredLevel) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Ten przedmiot wymaga poziomu " +
                requiredLevel +
                ".",
                "error"
            );
        }

        return false;
    }

    if (!player.equipment) {
        player.equipment = {};
    }

    const equipmentBeforeChange = {
        ...player.equipment
    };

    let slot = null;

    if (requestedSlot) {
        if (
            !canEquipItemInSlot(
                item,
                requestedSlot
            )
        ) {
            console.warn(
                "Przedmiot nie pasuje do wybranego slotu:",
                item.name,
                requestedSlot
            );

            return;
        }

        slot = requestedSlot;
    } else {
        slot =
            getSlotForItem(item);
    }

    if (!slot) {
        console.warn(
            "Nie można założyć tego typu przedmiotu:",
            item.type
        );

        return;
    }

    /*
     * Nie pozwalamy założyć dwóch
     * identycznych pierścieni.
     */
    if (
        item.type === "ring" &&
        isSameRingEquippedInOtherSlot(
            itemId,
            slot
        )
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Nie możesz założyć dwóch takich samych pierścieni.",
                "error"
            );
        }

        if (
            typeof addSystemLog ===
            "function"
        ) {
            addSystemLog(
                "💍 Nie można założyć drugiego egzemplarza pierścienia: " +
                item.name +
                ".",
                "equipment"
            );
        }

        return false;
    }

    const oldItemInSlot =
        player.equipment[slot];

    if (oldItemInSlot) {
        addItemToInventory(oldItemInSlot);
    }

    player.equipment[slot] = itemId;

    removeItemFromInventory(itemId, 1);

    if (typeof addSystemLog === "function") {
        let message =
            "🛡️ Założono: " +
            item.name +
            ".";

        if (oldItemInSlot) {
            const oldItem = items[oldItemInSlot];

            if (oldItem) {
                message +=
                    " Zdjęto: " +
                    oldItem.name +
                    ".";
            }
        }

        addSystemLog(
            message,
            "equipment"
        );
    }

    if (
        typeof notifyEquipmentSetThresholdChanges ===
        "function"
    ) {
        notifyEquipmentSetThresholdChanges(
            equipmentBeforeChange,
            player.equipment
        );
    }

    console.log("Założono:", item.name, "do slotu:", slot);

    saveGame();
    render();

    if (
        typeof refreshHeroEquipmentView ===
        "function"
    ) {
        refreshHeroEquipmentView();
    }

    if (
        typeof refreshHeroInventoryView ===
        "function"
    ) {
        refreshHeroInventoryView();
    }

    return true;
}

function getSlotForItem(item) {
    if (item.type === "weapon") return "weapon";
    if (item.type === "shield") return "shield";
    if (item.type === "helmet") return "helmet";
    if (item.type === "armor") return "armor";
    if (item.type === "pants") return "pants";
    if (item.type === "boots") return "boots";
    if (item.type === "gloves") return "gloves";
    if (item.type === "amulet") return "amulet";
    if (item.type === "talisman") return "talisman";

    if (item.type === "ring") {
        if (!player.equipment.ring1) return "ring1";
        if (!player.equipment.ring2) return "ring2";

        return "ring1";
    }

    return null;
}

function removeItemFromInventory(itemId, amount = 1) {
    const invItem = player.inventory.find(item => item.itemId === itemId);

    if (!invItem) {
        console.warn("Nie znaleziono przedmiotu do usunięcia:", itemId);
        return;
    }

    invItem.quantity -= amount;

    if (invItem.quantity <= 0) {
        player.inventory = player.inventory.filter(item => item.itemId !== itemId);
    }

    console.log("Po usunięciu inventory:", player.inventory);

    if (
        typeof refreshHeroInventoryView ===
        "function"
    ) {
        refreshHeroInventoryView();
    }
}

function unequipItem(slot) {
    if (!player.equipment) {
        console.warn("Brak equipment u gracza");
        return;
    }



    const itemId = player.equipment[slot];

    if (!itemId) {
        console.warn("Ten slot jest pusty:", slot);
        return;
    }

    const equipmentBeforeChange = {
        ...player.equipment
    };

    const item = items[itemId];

    addItemToInventory(itemId);

    player.equipment[slot] = null;

    if (
        typeof addSystemLog === "function" &&
        item
    ) {
        addSystemLog(
            "🎒 Zdjęto wyposażenie: " +
            item.name +
            ".",
            "equipment"
        );
    }

    if (
        typeof notifyEquipmentSetThresholdChanges ===
        "function"
    ) {
        notifyEquipmentSetThresholdChanges(
            equipmentBeforeChange,
            player.equipment
        );
    }

    console.log("Zdjęto przedmiot ze slotu:", slot);

    saveGame();
    render();

    if (
        typeof refreshHeroEquipmentView ===
        "function"
    ) {
        refreshHeroEquipmentView();
    }

    if (
        typeof refreshHeroInventoryView ===
        "function"
    ) {
        refreshHeroInventoryView();
    }
}

function ensureProfessionToolsState() {
    if (
        !player.professionTools ||
        typeof player.professionTools !==
        "object" ||
        Array.isArray(
            player.professionTools
        )
    ) {
        player.professionTools = {};
    }

    const defaultToolSlots = {
        pickaxe: null,
        sickle: null,
        fishingRod: null,
        alchemyKit: null,
        cookingTools: null,
        craftingHammer: null
    };

    Object.keys(
        defaultToolSlots
    ).forEach(toolType => {
        if (
            player.professionTools[
            toolType
            ] === undefined
        ) {
            player.professionTools[
                toolType
            ] = null;
        }
    });
}

function getProfessionLevelForTool(
    toolType
) {
    const professionLevels = {
        pickaxe:
            player.mining?.level,
        sickle:
            player.herbalism?.level,
        fishingRod:
            player.fishing?.level,
        alchemyKit:
            player.alchemy?.level,
        cookingTools:
            player.cooking?.level,
        craftingHammer:
            player.crafting?.level
    };

    return Math.max(
        1,
        Number(
            professionLevels[
            toolType
            ]
        ) || 1
    );
}

function equipProfessionTool(
    itemId
) {
    const item =
        items[itemId];

    if (!item) {
        console.warn(
            "Nie znaleziono narzędzia:",
            itemId
        );

        return;
    }

    if (
        item.type !==
        "profession_tool" ||
        !item.toolType
    ) {
        console.warn(
            "Ten przedmiot nie jest narzędziem profesji:",
            item.name
        );

        return;
    }

    const inventoryQuantity =
        getInventoryItemQuantity(
            itemId
        );

    if (
        inventoryQuantity <= 0
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Nie masz tego narzędzia w plecaku.",
                "error"
            );
        }

        return;
    }

    ensureProfessionToolsState();

    if (
        !Object.prototype
            .hasOwnProperty.call(
                player.professionTools,
                item.toolType
            )
    ) {
        console.warn(
            "Nieznany rodzaj narzędzia:",
            item.toolType
        );

        return;
    }

    const professionLevel =
        getProfessionLevelForTool(
            item.toolType
        );

    const requiredLevel =
        Math.max(
            1,
            Number(
                item.requiredProfessionLevel
            ) || 1
        );

    if (
        professionLevel <
        requiredLevel
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "To narzędzie wymaga " +
                requiredLevel +
                ". poziomu profesji.",
                "error"
            );
        }

        return;
    }

    const oldToolId =
        player.professionTools[
        item.toolType
        ];

    if (
        oldToolId ===
        itemId
    ) {
        return;
    }

    /*
     * Narzędzie pozostaje w plecaku.
     * Zapisujemy tylko jego identyfikator
     * jako aktywne narzędzie profesji.
     */
    player.professionTools[
        item.toolType
    ] = itemId;

    if (
        typeof addSystemLog ===
        "function"
    ) {
        let message =
            "🧰 Wybrano narzędzie: " +
            item.name +
            ".";

        if (oldToolId) {
            const oldTool =
                items[oldToolId];

            if (oldTool) {
                message +=
                    " Zastąpiono: " +
                    oldTool.name +
                    ".";
            }
        }

        addSystemLog(
            message,
            "profession"
        );
    }

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Wybrano: " +
            item.name +
            ".",
            "success"
        );
    }

    saveGame();
    render();

    if (
        typeof refreshHeroInventoryView ===
        "function"
    ) {
        refreshHeroInventoryView();
    }

    if (
        typeof refreshProfessionToolsView ===
        "function"
    ) {
        refreshProfessionToolsView();
    }
}


function unequipProfessionTool(
    toolType
) {
    ensureProfessionToolsState();

    const itemId =
        player.professionTools[
        toolType
        ];

    if (!itemId) {
        return;
    }

    const item =
        items[itemId];

    /*
     * Nie dodajemy przedmiotu do plecaka,
     * ponieważ już się w nim znajduje.
     */
    player.professionTools[
        toolType
    ] = null;

    if (
        typeof addSystemLog ===
        "function" &&
        item
    ) {
        addSystemLog(
            "🧰 Wyłączono narzędzie: " +
            item.name +
            ".",
            "profession"
        );
    }
    if (
        typeof showNotification ===
        "function" &&
        item
    ) {
        showNotification(
            "Wyłączono: " +
            item.name +
            ".",
            "success"
        );
    }

    saveGame();
    render();

    if (
        typeof refreshHeroInventoryView ===
        "function"
    ) {
        refreshHeroInventoryView();
    }

    if (
        typeof refreshProfessionToolsView ===
        "function"
    ) {
        refreshProfessionToolsView();
    }
}

function changeProfessionTool(
    toolType,
    itemId
) {
    ensureProfessionToolsState();

    /*
     * Pusta wartość oznacza wybranie
     * opcji „Brak narzędzia”.
     */
    if (!itemId) {
        unequipProfessionTool(
            toolType
        );

        return;
    }

    const item =
        items[itemId];

    if (
        !item ||
        item.type !==
        "profession_tool" ||
        item.toolType !==
        toolType
    ) {
        console.warn(
            "Narzędzie nie pasuje do wybranej profesji:",
            toolType,
            itemId
        );

        refreshProfessionToolsView();

        return;
    }

    equipProfessionTool(
        itemId
    );
}

function getProfessionToolBonus(
    toolType,
    bonusName
) {
    ensureProfessionToolsState();

    const itemId =
        player.professionTools[
        toolType
        ];

    if (!itemId) {
        return 0;
    }

    if (
        getInventoryItemQuantity(
            itemId
        ) <= 0
    ) {
        player.professionTools[
            toolType
        ] = null;

        return 0;
    }

    const tool =
        items[itemId];

    if (
        !tool ||
        !tool.bonuses
    ) {
        return 0;
    }

    return Math.max(
        0,
        Number(
            tool.bonuses[
            bonusName
            ]
        ) || 0
    );
}
