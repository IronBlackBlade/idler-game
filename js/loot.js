function rollLoot(enemyData) {
    if (!enemyData.loot) {
        return;
    }

    const derived = getDerivedStats();

    const luckBonus = derived.lootBonus || 0;

    const skillLootBonus =
        typeof getLootChanceSkillBonus === "function"
            ? getLootChanceSkillBonus()
            : 0;

    enemyData.loot.forEach(drop => {
        const roll = Math.random() * 100;

        const totalLootBonus =
            luckBonus + skillLootBonus;

        const finalChance = Math.min(
            100,
            drop.chance * (1 + totalLootBonus / 100)
        );

        if (roll <= finalChance) {
            addItemToInventory(drop.item);

            const item = items[drop.item];

            if (
                item &&
                typeof addCombatLog === "function"
            ) {
                addCombatLog(
                    "🎒 Zdobyto przedmiot: " +
                    item.name +
                    "."
                );
            }
        }
    });
}

function addItemToInventory(
    itemId,
    amount = 1
) {
    const item = items[itemId];

    if (!item) {
        console.warn(
            "Nie znaleziono przedmiotu:",
            itemId
        );

        return false;
    }

    const safeAmount =
        Math.max(
            1,
            Math.floor(
                Number(amount) || 1
            )
        );

    const existingItem =
        player.inventory.find(
            inventoryItem => {
                return (
                    inventoryItem.itemId ===
                    itemId
                );
            }
        );

    if (existingItem) {
        existingItem.quantity +=
            safeAmount;
    } else {
        player.inventory.push({
            itemId: itemId,
            quantity: safeAmount
        });
    }

    console.log(
        "🎒 Dodano do plecaka:",
        item.name,
        "x" + safeAmount
    );

    return true;
}