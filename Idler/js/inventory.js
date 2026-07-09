function sellItem(itemId, amount) {
    const invItem = player.inventory.find(item => item.itemId === itemId);
    const item = items[itemId];

    if (!invItem) {
        console.warn("Nie ma takiego przedmiotu w plecaku:", itemId);
        return;
    }

    if (!item) {
        console.warn("Nie znaleziono itemu w items:", itemId);
        return;
    }

    const sellAmount = Math.min(amount, invItem.quantity);

    player.gold += item.value * sellAmount;
    invItem.quantity -= sellAmount;

    if (invItem.quantity <= 0) {
        player.inventory = player.inventory.filter(item => item.itemId !== itemId);
    }

    console.log("Po sprzedaży inventory:", player.inventory);

    saveGame();
    render();
}

function sellAllItems(itemId) {
    const invItem = player.inventory.find(item => item.itemId === itemId);

    if (!invItem) return;

    sellItem(itemId, invItem.quantity);
}

function sellCustomAmount(itemId) {
    const input = document.getElementById("sell-" + itemId);
    const amount = Number(input.value);

    if (!amount || amount <= 0) return;

    sellItem(itemId, amount);
}

function equipItem(itemId) {
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

    const slot = getSlotForItem(item);

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

    console.log("Założono:", item.name, "do slotu:", slot);

    saveGame();
    render();
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

    addItemToInventory(itemId);

    player.equipment[slot] = null;

    console.log("Zdjęto przedmiot ze slotu:", slot);

    saveGame();
    render();
}