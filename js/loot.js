function getTotalLootChanceBonus() {
    const derived =
        typeof getDerivedStats === "function"
            ? getDerivedStats()
            : null;

    const luckBonus =
        Math.max(
            0,
            Number(
                derived?.lootBonus
            ) || 0
        );

    const skillBonus =
        typeof getLootChanceSkillBonus ===
            "function"
            ? Math.max(
                0,
                Number(
                    getLootChanceSkillBonus()
                ) || 0
            )
            : 0;

    const potionBonus =
        typeof getActivePotionEffectValue ===
            "function"
            ? Math.max(
                0,
                Number(
                    getActivePotionEffectValue(
                        "hunter_luck"
                    )
                ) || 0
            )
            : 0;

    return (
        luckBonus +
        skillBonus +
        potionBonus
    );
}

function getFinalLootChance(
    baseChance
) {
    const safeBaseChance =
        Math.max(
            0,
            Math.min(
                100,
                Number(baseChance) || 0
            )
        );

    const totalLootBonus =
        getTotalLootChanceBonus();

    const lootMultiplier =
        1 + totalLootBonus / 100;

    return Math.min(
        100,
        safeBaseChance *
            lootMultiplier
    );
}

function rollLoot(enemyData) {
    if (
        !enemyData ||
        !Array.isArray(enemyData.loot)
    ) {
        return;
    }

    enemyData.loot.forEach(drop => {
        const baseChance =
            Number(drop.chance) || 0;

        const finalChance =
            getFinalLootChance(
                baseChance
            );

        const roll =
            Math.random() * 100;

        if (roll > finalChance) {
            return;
        }

        addItemToInventory(
            drop.item
        );

        const item =
            typeof items !== "undefined"
                ? items[drop.item]
                : null;

        if (
            item &&
            typeof addCombatLog ===
                "function"
        ) {
            addCombatLog(
                "🎒 Zdobyto przedmiot: " +
                item.name +
                "."
            );
        }
    });
}

function addItemToInventory(
    itemId,
    amount = 1
) {
    const item =
        items[itemId];

    if (!item) {
        console.warn(
            "Nie znaleziono przedmiotu:",
            itemId
        );

        return false;
    }

    /*
     * Zabezpieczenie na wypadek,
     * gdy plecak jeszcze nie istnieje.
     */
    if (
        !Array.isArray(
            player.inventory
        )
    ) {
        player.inventory = [];
    }

    /*
     * Zamieniamy przekazaną wartość
     * na bezpieczną liczbę całkowitą.
     */
    const safeAmount =
        Math.max(
            0,
            Math.floor(
                Number(amount) || 0
            )
        );

    if (safeAmount <= 0) {
        return false;
    }

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
        "🎒 Dodano przedmiot:",
        item.name,
        "x" + safeAmount
    );

    return true;
}