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

function getFinalSellPrice(item) {
    if (!item) {
        return 0;
    }

    const baseValue = item.value || 0;

    const sellBonus =
        typeof getSellPriceSkillBonus === "function"
            ? getSellPriceSkillBonus()
            : 0;

    return Math.max(
        0,
        Math.floor(
            baseValue * (1 + sellBonus / 100)
        )
    );
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

    const singleItemPrice =
        getFinalSellPrice(item);

    const totalSellPrice =
        singleItemPrice * sellAmount;

    player.gold += totalSellPrice;
    invItem.quantity -= sellAmount;

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

function sellAllVendorTrash() {
    if (
        !Array.isArray(player.inventory)
    ) {
        return;
    }

    const vendorItems =
        player.inventory.filter(
            inventoryItem => {
                const item =
                    items[
                        inventoryItem.itemId
                    ];

return (
    item &&
    item.type ===
        "vendor_trash" &&
    inventoryItem.quantity > 0 &&
    !isInventoryItemLocked(
        inventoryItem.itemId
    )
);
            }
        );

    if (
        vendorItems.length === 0
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Brak przedmiotów na sprzedaż.",
                "error"
            );
        }

        return;
    }

    let totalGold = 0;
    let totalQuantity = 0;

    vendorItems.forEach(
        inventoryItem => {
            const item =
                items[
                    inventoryItem.itemId
                ];

            const quantity =
                inventoryItem.quantity;

            const singlePrice =
                getFinalSellPrice(item);

            totalGold +=
                singlePrice * quantity;

            totalQuantity +=
                quantity;
        }
    );

player.inventory =
    player.inventory.filter(
        inventoryItem => {
            const item =
                items[
                    inventoryItem.itemId
                ];

            if (!item) {
                return true;
            }

            if (
                item.type !==
                "vendor_trash"
            ) {
                return true;
            }

            return isInventoryItemLocked(
                inventoryItem.itemId
            );
        }
    );

    player.gold += totalGold;

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "💰 Sprzedano wszystkie nieprzydatne łupy: x" +
            totalQuantity +
            " za " +
            totalGold +
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
            totalQuantity +
            " przedmiotów za " +
            totalGold +
            " 💰.",
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

    if (!player.equipment) {
        player.equipment = {};
    }

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
        console.warn("Nie można założyć tego typu przedmiotu:", item.type);
        return;
    }

    const oldItemInSlot = player.equipment[slot];

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