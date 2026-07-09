const shopItems = [
    { itemId: "old_sword", price: 100, category: "weapon" },
    { itemId: "iron_sword", price: 280, category: "weapon" },
    { itemId: "steel_sword", price: 850, category: "weapon" },
    { itemId: "knight_sword", price: 3200, category: "weapon" },
    { itemId: "master_sword", price: 12000, category: "weapon" },

    { itemId: "wooden_shield", price: 80, category: "shield" },
    { itemId: "leather_helmet", price: 60, category: "helmet" },
    { itemId: "leather_armor", price: 140, category: "armor" },
    { itemId: "old_boots", price: 60, category: "boots" }
];
const shopCategories = [
    {
        id: "weapon",
        name: "⚔️ Broń"
    },
    {
        id: "shield",
        name: "🛡️ Tarcze"
    },
    {
        id: "helmet",
        name: "⛑️ Hełmy"
    },
    {
        id: "armor",
        name: "🥋 Pancerze"
    },
    {
        id: "pants",
        name: "👖 Spodnie"
    },
    {
        id: "boots",
        name: "🥾 Buty"
    },
    {
        id: "gloves",
        name: "🧤 Rękawice"
    },
    {
        id: "ring",
        name: "💍 Pierścienie"
    },
    {
        id: "amulet",
        name: "📿 Amulety"
    },
    {
        id: "talisman",
        name: "🔮 Talizmany"
    }
];

function buyItem(itemId, price) {
    const item = items[itemId];

    if (!item) {
        console.warn("Item not found:", itemId);
        return;
    }

    const requiredLevel = item.requiredLevel || 1;

    if (player.level < requiredLevel) {
        if (typeof addCombatLog === "function") {
            addCombatLog("❌ Ten przedmiot wymaga poziomu " + requiredLevel + ".");
        }

        return;
    }

    if (player.gold < price) {
        if (typeof addCombatLog === "function") {
            addCombatLog("❌ Nie masz wystarczająco złota.");
        }

        console.warn("Not enough gold");
        return;
    }

    player.gold -= price;
    addItemToInventory(itemId);

    if (typeof addCombatLog === "function") {
        addCombatLog("🛒 Kupiono: " + item.name + ".");
    }

    saveGame();
    render();
}