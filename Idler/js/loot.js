function rollLoot(enemyData) {
    if (!enemyData.loot) return;

    const derived = getDerivedStats();
    const lootMultiplier = 1 + derived.lootBonus / 100;

    enemyData.loot.forEach(drop => {
        const roll = Math.random() * 100;
        const finalChance = drop.chance * lootMultiplier;

        if (roll <= finalChance) {
            addItemToInventory(drop.item);

            const item = items[drop.item];

            if (item && typeof addCombatLog === "function") {
                addCombatLog("🎒 Zdobyto przedmiot: " + item.name + ".");
            }
        }
    });
}

function addItemToInventory(itemId) {
    const item = items[itemId];

    if (!item) {
        console.warn("Nie znaleziono przedmiotu:", itemId);
        return;
    }

    const existingItem = player.inventory.find(invItem => invItem.itemId === itemId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        player.inventory.push({
            itemId: itemId,
            quantity: 1
        });
    }

    console.log("🎒 Zdobyto przedmiot:", item.name);
}