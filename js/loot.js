const huntingChestTypes = {
    common: {
        id: "common",
        name: "Zwykłą skrzynię",
        icon: "📦",
        minimumGold: 6,
        maximumGold: 14,
        lootRolls: 1
    },

    rare: {
        id: "rare",
        name: "Rzadką skrzynię",
        icon: "🎁",
        minimumGold: 18,
        maximumGold: 35,
        lootRolls: 2
    },

    elite: {
        id: "elite",
        name: "Elitarną skrzynię",
        icon: "👑",
        minimumGold: 50,
        maximumGold: 90,
        lootRolls: 3
    }
};

function getHuntingChestChance(
    encounterType = "normal"
) {
    const baseChances = {
        normal: 0.5,
        strong: 3,
        elite: 12,
        boss: 50
    };

    const baseChance =
        baseChances[
        encounterType
        ] ??
        baseChances.normal;

    const masteryBonuses =
        getLocationMasteryBonuses(
            player.location
        );

    const skillBonus =
        typeof getHuntingChestChanceSkillBonus ===
            "function"
            ? Math.max(
                0,
                Number(
                    getHuntingChestChanceSkillBonus()
                ) || 0
            )
            : 0;

    return Math.min(
        50,
        baseChance *
        (
            1 +
            (
                masteryBonuses
                    .chestChanceBonus +
                skillBonus
            ) /
            100
        )
    );
}

function getHuntingChestTypeChances(
    encounterType = "normal"
) {
    const chancesByEncounter = {
        normal: {
            rare: 18,
            elite: 2
        },

        strong: {
            rare: 25,
            elite: 5
        },

        elite: {
            rare: 35,
            elite: 15
        },

        boss: {
            rare: 70,
            elite: 30
        }
    };

    return (
        chancesByEncounter[
        encounterType
        ] ||
        chancesByEncounter.normal
    );
}

function rollHuntingChestType(
    encounterType = "normal"
) {
    const chances =
        getHuntingChestTypeChances(
            encounterType
        );

    const roll =
        Math.random() * 100;

    if (roll <= chances.elite) {
        return "elite";
    }

    if (
        roll <=
        chances.elite +
        chances.rare
    ) {
        return "rare";
    }

    return "common";
}

function isEnhancedRarityHuntingLoot(
    itemId
) {
    const item =
        typeof items !== "undefined"
            ? items[itemId]
            : null;

    if (!item) {
        return false;
    }

    return [
        "uncommon",
        "rare",
        "epic",
        "legendary"
    ].includes(item.rarity);
}

function getRareHuntingLootChanceBonus(
    itemId
) {
    if (
        !isEnhancedRarityHuntingLoot(
            itemId
        )
    ) {
        return 0;
    }

    return typeof getRareHuntingLootChanceSkillBonus ===
        "function"
        ? Math.max(
            0,
            Number(
                getRareHuntingLootChanceSkillBonus()
            ) || 0
        )
        : 0;
}

function getHuntingChestDropWeight(
    drop
) {
    const baseWeight = Math.max(
        0,
        Number(drop?.chance) || 0
    );

    const rarityBonus =
        getRareHuntingLootChanceBonus(
            drop?.item
        );

    return (
        baseWeight *
        (1 + rarityBonus / 100)
    );
}

function isLuckyFindEligibleHuntingLoot(
    itemId
) {
    const item =
        typeof items !== "undefined"
            ? items[itemId]
            : null;

    if (!item) {
        return false;
    }

    return (
        !item.type ||
        item.type === "material" ||
        item.type ===
        "crafting_material"
    );
}

function rollLuckyFindHuntingLootAmount(
    itemId,
    baseAmount = 1
) {
    const safeBaseAmount = Math.max(
        1,
        Math.floor(
            Number(baseAmount) || 1
        )
    );

    if (
        !isLuckyFindEligibleHuntingLoot(
            itemId
        )
    ) {
        return safeBaseAmount;
    }

    const doubleDropChance =
        typeof getLuckyFindDoubleDropChance ===
            "function"
            ? getLuckyFindDoubleDropChance()
            : 0;

    if (
        Math.random() * 100 >=
        doubleDropChance
    ) {
        return safeBaseAmount;
    }

    return safeBaseAmount * 2;
}

function getRandomHuntingChestDrop(
    lootTable
) {
    const validDrops =
        Array.isArray(lootTable)
            ? lootTable.filter(drop => {
                return (
                    drop &&
                    items[drop.item] &&
                    Number(drop.chance) > 0
                );
            })
            : [];

    if (validDrops.length === 0) {
        return null;
    }

    const totalWeight =
        validDrops.reduce(
            (total, drop) => {
                return (
                    total +
                    getHuntingChestDropWeight(
                        drop
                    )
                );
            },
            0
        );

    let roll =
        Math.random() *
        totalWeight;
    for (const drop of validDrops) {
        roll -=
            getHuntingChestDropWeight(
                drop
            );

        if (roll <= 0) {
            return drop;
        }
    }

    return validDrops[
        validDrops.length - 1
    ];
}

function getHuntingChestLocationGoldMultiplier() {
    const location =
        locations[player.location];

    const recommendedLevel =
        Math.max(
            1,
            Number(
                location
                    ?.recommendedLevel
            ) || 1
        );

    return (
        1 +
        (
            recommendedLevel - 1
        ) * 0.15
    );
}

function tryOpenAutomaticHuntingChest(
    defeatedEnemy,
    encounterType = "normal"
) {
    if (!defeatedEnemy) {
        return null;
    }

    const chestChance =
        getHuntingChestChance(
            encounterType
        );

    if (
        Math.random() * 100 >
        chestChance
    ) {
        return null;
    }

    const chestTypeId =
        rollHuntingChestType(
            encounterType
        );

    const chest =
        huntingChestTypes[
        chestTypeId
        ];

    const locationMultiplier =
        getHuntingChestLocationGoldMultiplier();

    const minimumGold =
        Math.round(
            chest.minimumGold *
            locationMultiplier
        );

    const maximumGold =
        Math.round(
            chest.maximumGold *
            locationMultiplier
        );

    const gold =
        minimumGold +
        Math.floor(
            Math.random() *
            (
                maximumGold -
                minimumGold +
                1
            )
        );

    const rewardMap =
        new Map();

    for (
        let rollIndex = 0;
        rollIndex < chest.lootRolls;
        rollIndex++
    ) {
        const drop =
            getRandomHuntingChestDrop(
                defeatedEnemy.loot
            );

        if (!drop) {
            continue;
        }

        if (
            addItemToInventory(
                drop.item,
                1
            )
        ) {
            rewardMap.set(
                drop.item,
                (
                    rewardMap.get(
                        drop.item
                    ) || 0
                ) + 1
            );
        }
    }

    player.gold += gold;

    const progress =
        ensureLocationProgress(
            player.location
        );

    progress.chestsFound += 1;

    const chestCounterKey =
        chestTypeId +
        "ChestsFound";

    progress[chestCounterKey] += 1;

    const rewards =
        Array.from(
            rewardMap.entries()
        ).map(
            ([
                itemId,
                quantity
            ]) => {
                return {
                    itemId: itemId,
                    quantity: quantity
                };
            }
        );

    const itemSummary =
        rewards.length > 0
            ? rewards
                .map(reward => {
                    return (
                        items[
                            reward.itemId
                        ].name +
                        " x" +
                        reward.quantity
                    );
                })
                .join(", ")
            : "bez przedmiotów";

    const message =
        chest.icon +
        " Automatycznie otwarto " +
        chest.name +
        ": " +
        gold +
        " złota, " +
        itemSummary +
        ".";

    if (
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(message);
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            message,
            "chest"
        );
    }

    return {
        chestType: chestTypeId,
        gold: gold,
        items: rewards
    };
}

function grantFirstBossKillReward(
    locationId = player.location
) {
    const location =
        locations[locationId];

    const boss =
        location?.boss;

    const reward =
        boss?.firstKillReward;

    const progress =
        ensureLocationProgress(
            locationId
        );

    if (
        !boss ||
        !reward ||
        progress
            .firstBossRewardClaimed
    ) {
        return null;
    }

    const gold =
        Math.max(
            0,
            Number(reward.gold) || 0
        );

    const experience =
        Math.max(
            0,
            Number(reward.exp) || 0
        );

    const grantedItems = [];

    const rewardItems =
        Array.isArray(reward.items)
            ? reward.items
            : [];

    rewardItems.forEach(
        rewardItem => {
            const quantity =
                Math.max(
                    1,
                    Math.floor(
                        Number(
                            rewardItem.quantity
                        ) || 1
                    )
                );

            if (
                addItemToInventory(
                    rewardItem.item,
                    quantity
                )
            ) {
                grantedItems.push({
                    itemId:
                        rewardItem.item,

                    quantity:
                        quantity
                });
            }
        }
    );

    player.gold += gold;
    player.exp += experience;

    progress.firstBossRewardClaimed =
        true;

    const itemSummary =
        grantedItems.length > 0
            ? grantedItems
                .map(itemReward => {
                    const item =
                        items[
                        itemReward.itemId
                        ];

                    return (
                        (
                            item?.name ||
                            itemReward.itemId
                        ) +
                        " x" +
                        itemReward.quantity
                    );
                })
                .join(", ")
            : "bez przedmiotów";

    const message =
        "🏆 Pierwsze zwycięstwo nad bossem " +
        boss.name +
        "! Nagroda: " +
        gold +
        " złota, " +
        experience +
        " EXP, " +
        itemSummary +
        ".";

    if (
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(message);
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            message,
            "boss"
        );
    }

    return {
        gold: gold,
        experience: experience,
        items: grantedItems
    };
}

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
    baseChance,
    itemId = null
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

    const rarityLootBonus =
        getRareHuntingLootChanceBonus(
            itemId
        );

    const lootMultiplier =
        1 +
        (
            totalLootBonus +
            rarityLootBonus
        ) /
        100;

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
    const encounterLootMultiplier =
        Math.max(
            1,
            Number(
                enemyData
                    .lootChanceMultiplier
            ) || 1
        );
    enemyData.loot.forEach(drop => {
        const baseChance =
            Number(drop.chance) || 0;
        const finalChance =
            getFinalLootChance(
                baseChance *
                encounterLootMultiplier,

                drop.item
            );

        const roll =
            Math.random() * 100;

        if (roll > finalChance) {
            return;
        }

        const lootAmount =
            typeof rollLuckyFindHuntingLootAmount ===
                "function"
                ? rollLuckyFindHuntingLootAmount(
                    drop.item,
                    1
                )
                : 1;

        const itemAdded =
            addItemToInventory(
                drop.item,
                lootAmount
            );

        if (!itemAdded) {
            return;
        }

        if (
            typeof recordBestiaryLootDiscovery ===
            "function"
        ) {
            recordBestiaryLootDiscovery(
                enemyData,
                drop.item,
                player.location
            );
        }

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
                (
                    lootAmount > 1
                        ? " x" +
                        lootAmount +
                        " 🍀."
                        : "."
                )
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