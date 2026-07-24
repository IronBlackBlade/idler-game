function getOfflineEffectOverlapDuration(
    effect,
    savedAt,
    currentTime
) {
    if (!effect) {
        return 0;
    }

    const safeSavedAt = Math.min(
        currentTime,
        Number(savedAt) || currentTime
    );

    const effectStartedAt =
        Number(effect.startedAt) ||
        safeSavedAt;

    const effectExpiresAt =
        Number(effect.expiresAt) || 0;

    const overlapStartedAt = Math.max(
        safeSavedAt,
        effectStartedAt
    );

    const overlapFinishedAt = Math.min(
        currentTime,
        effectExpiresAt
    );

    return Math.max(
        0,
        overlapFinishedAt -
        overlapStartedAt
    );
}

function calculateOfflineCombatDamage(
    savedAt,
    currentTime
) {
    const offlineDuration = Math.max(
        0,
        currentTime - savedAt
    );

    const attackInterval = Math.max(
        100,
        Number(
            getPlayerAttackIntervalMs()
        ) || 1000
    );

    const totalAttacks = Math.max(
        0,
        Math.floor(
            offlineDuration /
            attackInterval
        )
    );

    if (totalAttacks <= 0) {
        return {
            damage: 0,
            attackCount: 0
        };
    }

    const weaponId =
        player.equipment?.weapon;

    const weapon =
        weaponId
            ? items[weaponId]
            : null;

    const damageEffectId =
        typeof getWeaponPotionEffectId ===
            "function"
            ? getWeaponPotionEffectId(
                weapon
            )
            : null;

    const damageEffect =
        damageEffectId
            ? player.activeEffects
                ?.potionEffects
            ?.[damageEffectId]
            : null;

    const effectValue = Math.max(
        0,
        Number(
            damageEffect?.value
        ) || 0
    );

    const currentAttackDamage = Math.max(
        0,
        Math.floor(
            Number(getAttack()) || 0
        )
    );

    /*
     * getAttack() zawiera premię aktywnej
     * obecnie mikstury. Cofamy tę premię,
     * aby otrzymać bazowe obrażenia.
     */
    const effectIsActiveNow =
        effectValue > 0 &&
        Number(
            damageEffect?.expiresAt
        ) > Date.now();

    const baseAttackDamage =
        effectIsActiveNow
            ? Math.max(
                0,
                Math.round(
                    currentAttackDamage /
                    (
                        1 +
                        effectValue / 100
                    )
                )
            )
            : currentAttackDamage;

    const boostedAttackDamage = Math.max(
        0,
        Math.floor(
            baseAttackDamage *
            (
                1 +
                effectValue / 100
            )
        )
    );

    const boostedDuration =
        getOfflineEffectOverlapDuration(
            damageEffect,
            savedAt,
            currentTime
        );

    const boostedAttacks = Math.min(
        totalAttacks,
        Math.floor(
            boostedDuration /
            attackInterval
        )
    );

    const normalAttacks =
        totalAttacks -
        boostedAttacks;

    const derived =
        getDerivedStats();

    const criticalChance = Math.max(
        0,
        Math.min(
            100,
            Number(
                derived.critChance
            ) || 0
        )
    );

    const criticalMultiplier = Math.max(
        1,
        (
            Number(
                derived.critDamage
            ) || 100
        ) / 100
    );

    function calculateAttackGroupDamage(
        attackCount,
        attackDamage
    ) {
        if (
            attackCount <= 0 ||
            attackDamage <= 0
        ) {
            return 0;
        }

        const criticalHits =
            getOfflineOccurrenceCount(
                attackCount,
                criticalChance
            );

        const normalHits =
            attackCount -
            criticalHits;

        const criticalDamage =
            Math.floor(
                attackDamage *
                criticalMultiplier
            );

        return (
            normalHits *
            attackDamage +
            criticalHits *
            criticalDamage
        );
    }

    return {
        attackCount: totalAttacks,

        damage:
            calculateAttackGroupDamage(
                normalAttacks,
                baseAttackDamage
            ) +
            calculateAttackGroupDamage(
                boostedAttacks,
                boostedAttackDamage
            )
    };
}

function distributeOfflineEnemyKills(
    enemyList,
    killCount
) {
    const safeKillCount = Math.max(
        0,
        Math.floor(
            Number(killCount) || 0
        )
    );

    if (
        !Array.isArray(enemyList) ||
        enemyList.length === 0 ||
        safeKillCount <= 0
    ) {
        return [];
    }

    /*
     * Rozdzielamy zabójstwa pomiędzy
     * przeciwników z aktualnej lokacji.
     */
    const baseQuantity = Math.floor(
        safeKillCount /
        enemyList.length
    );

    let remainingKills =
        safeKillCount -
        baseQuantity *
        enemyList.length;

    const results =
        enemyList.map(enemyData => {
            return {
                enemy: enemyData,
                quantity: baseQuantity
            };
        });

    /*
     * Pozostałe zabójstwa rozdzielamy
     * losowo bez wykonywania pętli
     * dla każdego pokonanego potwora.
     */
    const availableIndexes =
        enemyList.map(
            (enemyData, index) => {
                return index;
            }
        );

    while (
        remainingKills > 0 &&
        availableIndexes.length > 0
    ) {
        const randomIndex =
            Math.floor(
                Math.random() *
                availableIndexes.length
            );

        const resultIndex =
            availableIndexes.splice(
                randomIndex,
                1
            )[0];

        results[resultIndex]
            .quantity++;

        remainingKills--;
    }

    return results.filter(result => {
        return result.quantity > 0;
    });
}

function createOfflineEncounterEnemyData(
    enemyData,
    encounterType = "normal",
    eliteModifierId = null
) {
    const variant =
        enemyEncounterVariants[
        encounterType
        ] ||
        enemyEncounterVariants.normal;
    const masteryBonuses =
        getLocationMasteryBonuses(
            player.location
        );
    const encounterEnemy = {
        ...enemyData,

        hp: Math.max(
            1,
            Math.round(
                enemyData.hp *
                variant.hpMultiplier
            )
        ),

        attack: Math.max(
            1,
            Math.round(
                enemyData.attack *
                variant.attackMultiplier
            )
        ),

        gold: Math.max(
            0,
            Math.round(
                enemyData.gold *
                variant.rewardMultiplier *
                (
                    1 +
                    masteryBonuses
                        .goldBonus /
                    100
                )
            )
        ),

        exp: Math.max(
            0,
            Math.round(
                enemyData.exp *
                variant.rewardMultiplier *
                (
                    1 +
                    masteryBonuses
                        .experienceBonus /
                    100
                )
            )
        ),

        encounterType:
            variant.id,

        lootChanceMultiplier:
            variant.lootChanceMultiplier *
            (
                1 +
                masteryBonuses
                    .lootChanceBonus /
                100
            )
    };

    if (variant.id === "elite") {
        return applyEliteEnemyModifierToData(
            encounterEnemy,
            eliteModifierId ||
            rollEliteEnemyModifierId()
        );
    }

    return {
        ...encounterEnemy,
        eliteModifierId: null,
        eliteModifierLabel: "",
        eliteModifierDescription: ""
    };
}

function getOfflineEncounterDistribution(
    killCount,
    masteryPercent
) {
    const safeKillCount = Math.max(
        0,
        Math.floor(
            Number(killCount) || 0
        )
    );

    const chances =
        getEnemyEncounterChances(
            masteryPercent
        );

    const eliteKills = Math.min(
        safeKillCount,
        getOfflineOccurrenceCount(
            safeKillCount,
            chances.elite
        )
    );

    const remainingKills =
        safeKillCount -
        eliteKills;

    const nonEliteChance =
        100 -
        chances.elite;

    const strongChanceAmongRemaining =
        nonEliteChance > 0
            ? (
                chances.strong /
                nonEliteChance
            ) * 100
            : 0;

    const strongKills = Math.min(
        remainingKills,
        getOfflineOccurrenceCount(
            remainingKills,
            strongChanceAmongRemaining
        )
    );

    return {
        normal:
            remainingKills -
            strongKills,

        strong:
            strongKills,

        elite:
            eliteKills
    };
}


function applyOfflineEncounterDistribution(
    enemyKills,
    masteryPercent
) {
    const results = [];

    enemyKills.forEach(enemyKill => {
        const distribution =
            getOfflineEncounterDistribution(
                enemyKill.quantity,
                masteryPercent
            );

        Object.entries(
            distribution
        ).forEach(
            ([
                encounterType,
                quantity
            ]) => {
                if (quantity <= 0) {
                    return;
                }
                if (
                    encounterType ===
                    "elite"
                ) {
                    const modifierIds =
                        Object.keys(
                            eliteEnemyModifiers
                        );

                    const baseQuantity =
                        Math.floor(
                            quantity /
                            modifierIds.length
                        );

                    let remainingQuantity =
                        quantity -
                        baseQuantity *
                        modifierIds.length;

                    modifierIds.forEach(
                        modifierId => {
                            const modifierQuantity =
                                baseQuantity +
                                (
                                    remainingQuantity > 0
                                        ? 1
                                        : 0
                                );

                            if (remainingQuantity > 0) {
                                remainingQuantity--;
                            }

                            if (modifierQuantity <= 0) {
                                return;
                            }

                            results.push({
                                enemy:
                                    createOfflineEncounterEnemyData(
                                        enemyKill.enemy,
                                        "elite",
                                        modifierId
                                    ),

                                quantity:
                                    modifierQuantity
                            });
                        }
                    );

                    return;
                }
                results.push({
                    enemy:
                        createOfflineEncounterEnemyData(
                            enemyKill.enemy,
                            encounterType
                        ),

                    quantity: quantity
                });
            }
        );
    });

    return results;
}

function getOfflineAverageEncounterHpMultiplier(
    masteryPercent
) {
    const chances =
        getEnemyEncounterChances(
            masteryPercent
        );

    const normalChance =
        Math.max(
            0,
            100 -
            chances.strong -
            chances.elite
        );

    const eliteModifiers =
        Object.values(
            eliteEnemyModifiers
        );

    const averageEliteModifierHp =
        eliteModifiers.length > 0
            ? eliteModifiers.reduce(
                (
                    total,
                    modifier
                ) => {
                    return (
                        total +
                        (
                            Number(
                                modifier
                                    .hpMultiplier
                            ) || 1
                        )
                    );
                },
                0
            ) /
            eliteModifiers.length
            : 1;

    return (
        normalChance *
        enemyEncounterVariants
            .normal
            .hpMultiplier +

        chances.strong *
        enemyEncounterVariants
            .strong
            .hpMultiplier +

        chances.elite *
        enemyEncounterVariants
            .elite
            .hpMultiplier *
        averageEliteModifierHp
    ) / 100;
}

function getOfflineCombatLootChance(
    baseChance,
    lootBonus
) {
    const safeBaseChance = Math.max(
        0,
        Math.min(
            100,
            Number(baseChance) || 0
        )
    );

    const safeLootBonus = Math.max(
        0,
        Number(lootBonus) || 0
    );

    return Math.min(
        100,
        safeBaseChance *
        (
            1 +
            safeLootBonus / 100
        )
    );
}

function collectOfflineCombatLoot(
    enemyKills,
    savedAt,
    currentTime
) {
    const rewardTotals =
        new Map();

    const derived =
        getDerivedStats();

    const luckBonus = Math.max(
        0,
        Number(
            derived.lootBonus
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

    const baseLootBonus =
        luckBonus +
        skillBonus;

    const hunterEffect =
        player.activeEffects
            ?.potionEffects
            ?.hunter_luck || null;

    const hunterEffectValue = Math.max(
        0,
        Number(
            hunterEffect?.value
        ) || 0
    );

    const offlineDuration = Math.max(
        0,
        currentTime - savedAt
    );

    const hunterDuration =
        getOfflineEffectOverlapDuration(
            hunterEffect,
            savedAt,
            currentTime
        );

    const hunterTimePercent =
        offlineDuration > 0
            ? Math.min(
                100,
                hunterDuration /
                offlineDuration *
                100
            )
            : 0;

    enemyKills.forEach(
        enemyKill => {
            const enemyData =
                enemyKill.enemy;

            const encounterLootMultiplier =
                Math.max(
                    1,
                    Number(
                        enemyData
                            .lootChanceMultiplier
                    ) || 1
                );

            if (
                !Array.isArray(
                    enemyData.loot
                )
            ) {
                return;
            }

            /*
             * Część przeciwników została
             * pokonana podczas działania
             * Mikstury łowcy.
             */
            const boostedKills =
                hunterEffectValue > 0
                    ? getOfflineOccurrenceCount(
                        enemyKill.quantity,
                        hunterTimePercent
                    )
                    : 0;

            const normalKills =
                enemyKill.quantity -
                boostedKills;

            enemyData.loot.forEach(
                drop => {
                    const normalDropCount =
                        getOfflineOccurrenceCount(
                            normalKills,

                            getOfflineCombatLootChance(
                                drop.chance *
                                encounterLootMultiplier,
                                baseLootBonus
                            )
                        );

                    const boostedDropCount =
                        getOfflineOccurrenceCount(
                            boostedKills,

                            getOfflineCombatLootChance(
                                drop.chance *
                                encounterLootMultiplier,

                                baseLootBonus +
                                hunterEffectValue
                            )
                        );

                    const dropCount =
                        normalDropCount +
                        boostedDropCount;

                    if (dropCount <= 0) {
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
                    /*
                     * Identyczne przedmioty
                     * łączymy w jeden wpis.
                     */
                    const existingReward =
                        rewardTotals.get(
                            drop.item
                        ) || {
                            itemId:
                                drop.item,

                            quantity: 0
                        };

                    existingReward.quantity +=
                        dropCount;

                    rewardTotals.set(
                        drop.item,
                        existingReward
                    );
                }
            );
        }
    );

    return Array.from(
        rewardTotals.values()
    );
}

function getOfflineHuntingChestTypeDistribution(
    chestCount,
    encounterType
) {
    const safeChestCount = Math.max(
        0,
        Math.floor(
            Number(chestCount) || 0
        )
    );

    const chances =
        getHuntingChestTypeChances(
            encounterType
        );

    const eliteChests = Math.min(
        safeChestCount,
        getOfflineOccurrenceCount(
            safeChestCount,
            chances.elite
        )
    );

    const remainingChests =
        safeChestCount -
        eliteChests;

    const nonEliteChance =
        100 -
        chances.elite;

    const rareChanceAmongRemaining =
        nonEliteChance > 0
            ? (
                chances.rare /
                nonEliteChance
            ) * 100
            : 0;

    const rareChests = Math.min(
        remainingChests,
        getOfflineOccurrenceCount(
            remainingChests,
            rareChanceAmongRemaining
        )
    );

    return {
        common:
            remainingChests -
            rareChests,

        rare:
            rareChests,

        elite:
            eliteChests
    };
}

function collectOfflineHuntingChestRewards(
    enemyKills
) {
    const chestCounts = {
        common: 0,
        rare: 0,
        elite: 0
    };

    const itemTotals =
        new Map();

    const goldMultiplier =
        getHuntingChestLocationGoldMultiplier();

    let totalGold = 0;

    enemyKills.forEach(enemyKill => {
        const encounterType =
            enemyKill.enemy
                .encounterType ||
            "normal";

        const chestCount =
            getOfflineOccurrenceCount(
                enemyKill.quantity,
                getHuntingChestChance(
                    encounterType
                )
            );

        if (chestCount <= 0) {
            return;
        }

        const distribution =
            getOfflineHuntingChestTypeDistribution(
                chestCount,
                encounterType
            );

        Object.entries(
            distribution
        ).forEach(
            ([
                chestTypeId,
                quantity
            ]) => {
                if (quantity <= 0) {
                    return;
                }

                const chest =
                    huntingChestTypes[
                    chestTypeId
                    ];

                chestCounts[
                    chestTypeId
                ] += quantity;

                const averageGold =
                    (
                        chest.minimumGold +
                        chest.maximumGold
                    ) / 2;

                totalGold += Math.round(
                    averageGold *
                    goldMultiplier *
                    quantity
                );

                const lootRollCount =
                    quantity *
                    chest.lootRolls;

                const enemyLoot =
                    Array.isArray(
                        enemyKill.enemy.loot
                    )
                        ? enemyKill.enemy.loot
                        : [];

                const weightedLoot =
                    enemyLoot
                        .filter(drop => {
                            return (
                                items[drop.item] &&
                                Number(
                                    drop.chance
                                ) > 0
                            );
                        })
                        .map(drop => {
                            return {
                                itemId:
                                    drop.item,

                                weight:
                                    Number(
                                        drop.chance
                                    ),

                                chestExperience: 0
                            };
                        });

                const distributedLoot =
                    distributeOfflineDrops(
                        weightedLoot,
                        lootRollCount,
                        "chest",
                        "chestExperience"
                    );

                distributedLoot.forEach(
                    reward => {
                        itemTotals.set(
                            reward.itemId,
                            (
                                itemTotals.get(
                                    reward.itemId
                                ) || 0
                            ) +
                            reward.quantity
                        );
                    }
                );
            }
        );
    });

    const itemsFound =
        Array.from(
            itemTotals.entries()
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

    return {
        totalChests:
            chestCounts.common +
            chestCounts.rare +
            chestCounts.elite,

        commonChests:
            chestCounts.common,

        rareChests:
            chestCounts.rare,

        eliteChests:
            chestCounts.elite,

        gold: totalGold,
        items: itemsFound
    };
}


function updateOfflineCombatQuests(
    enemyKills
) {
    if (
        typeof quests === "undefined" ||
        !Array.isArray(quests)
    ) {
        return 0;
    }

    /*
     * Łączymy liczbę zabójstw
     * według nazwy przeciwnika.
     */
    const killsByEnemyName =
        new Map();

    enemyKills.forEach(enemyKill => {
        const enemyName =
            enemyKill.enemy?.name;

        if (!enemyName) {
            return;
        }

        const previousKills =
            killsByEnemyName.get(
                enemyName
            ) || 0;

        killsByEnemyName.set(
            enemyName,
            previousKills +
            enemyKill.quantity
        );
    });

    let completedQuestCount = 0;

    quests.forEach(quest => {
        if (
            typeof isQuestUnlocked ===
            "function" &&
            !isQuestUnlocked(
                quest
            )
        ) {
            return;
        }
        if (
            quest.claimed ||
            quest.completed
        ) {
            return;
        }

        const gainedKills =
            killsByEnemyName.get(
                quest.targetEnemyName
            ) || 0;

        if (gainedKills <= 0) {
            return;
        }

        const requiredKills = Math.max(
            1,
            Number(
                quest.requiredKills
            ) || 1
        );

        const currentKills = Math.max(
            0,
            Number(
                quest.currentKills
            ) || 0
        );

        quest.currentKills = Math.min(
            requiredKills,
            currentKills +
            gainedKills
        );

        if (
            quest.currentKills >=
            requiredKills
        ) {
            quest.completed = true;
            completedQuestCount++;
        }
    });

    return completedQuestCount;
}

function setOfflineCombatEnemy(
    enemyData,
    progressFraction = 0
) {
    const safeMaxHp = Math.max(
        1,
        Number(enemyData.hp) || 1
    );

    /*
     * Maksymalnie 99,9999% obrażeń,
     * ponieważ żywy przeciwnik musi
     * mieć przynajmniej 1 HP.
     */
    const safeProgress = Math.max(
        0,
        Math.min(
            0.999999,
            Number(
                progressFraction
            ) || 0
        )
    );

    enemy.id =
        enemyData.id;

    enemy.name =
        enemyData.name;

    enemy.maxHp =
        safeMaxHp;

    enemy.hp = Math.max(
        1,
        Math.ceil(
            safeMaxHp *
            (
                1 -
                safeProgress
            )
        )
    );

    enemy.attack =
        Number(enemyData.attack) || 1;

    enemy.gold =
        Number(enemyData.gold) || 0;

    enemy.exp =
        Number(enemyData.exp) || 0;

    enemy.loot =
        Array.isArray(enemyData.loot)
            ? enemyData.loot
            : [];

    enemy.baseName =
        enemyData.name;

    enemy.encounterType =
        enemyData.encounterType ||
        "normal";

    enemy.encounterLabel =
        enemyEncounterVariants[
            enemy.encounterType
        ]?.label ||
        "Zwykły przeciwnik";

    enemy.lootChanceMultiplier =
        Math.max(
            1,
            Number(
                enemyData
                    .lootChanceMultiplier
            ) || 1
        );
    enemy.eliteModifierId =
        enemyData.eliteModifierId ||
        null;

    enemy.eliteModifierLabel =
        enemyData.eliteModifierLabel ||
        "";

    enemy.eliteModifierDescription =
        enemyData
            .eliteModifierDescription ||
        "";
}

function processOfflineCombatProgress(
    savedAt,
    currentTime = Date.now()
) {
    if (
        !isFighting &&
        !player.isFighting
    ) {
        return null;
    }

    const safeCurrentTime =
        Number(currentTime) ||
        Date.now();

    const safeSavedAt = Math.min(
        safeCurrentTime,
        Number(savedAt) ||
        safeCurrentTime
    );

    const location =
        locations[player.location];

    if (
        !location ||
        !Array.isArray(
            location.enemies
        ) ||
        location.enemies.length === 0
    ) {
        return null;
    }

    const combatDamage =
        calculateOfflineCombatDamage(
            safeSavedAt,
            safeCurrentTime
        );

    if (
        combatDamage.attackCount <= 0 ||
        combatDamage.damage <= 0
    ) {
        return null;
    }

    const currentEnemyHp = Math.max(
        1,
        Number(enemy.hp) ||
        Number(enemy.maxHp) ||
        1
    );

    /*
     * Jeżeli aktualny przeciwnik przeżył,
     * zmniejszamy tylko jego HP.
     */
    if (
        combatDamage.damage <
        currentEnemyHp
    ) {
        enemy.hp =
            currentEnemyHp -
            combatDamage.damage;

        return null;
    }

    /*
     * Zapamiętujemy aktualnego przeciwnika,
     * ponieważ jest pierwszą ofiarą.
     */
    const currentEnemyData = {
        id: enemy.id,
        name: enemy.name,

        hp: Math.max(
            1,
            Number(enemy.maxHp) ||
            currentEnemyHp
        ),

        attack:
            Number(enemy.attack) || 1,

        gold:
            Number(enemy.gold) || 0,

        exp:
            Number(enemy.exp) || 0,

        loot:
            Array.isArray(enemy.loot)
                ? enemy.loot
                : [],

        encounterType:
            player.isBossFight === true
                ? "boss"
                : (
                    enemy.encounterType ||
                    "normal"
                ),

        lootChanceMultiplier:
            Math.max(
                1,
                Number(
                    enemy
                        .lootChanceMultiplier
                ) || 1
            )
        ,
        eliteModifierId:
            enemy.eliteModifierId ||
            null,

        eliteModifierLabel:
            enemy.eliteModifierLabel ||
            "",

        eliteModifierDescription:
            enemy
                .eliteModifierDescription ||
            ""
    };

    const currentEnemyWasBoss =
        player.isBossFight === true;

    let remainingDamage =
        combatDamage.damage -
        currentEnemyHp;

    const masteryPercentBefore =
        getLocationMasteryPercent(
            player.location
        );

    /*
     * Po pierwszym przeciwniku korzystamy
     * ze średniego HP potworów lokacji.
     */
    const averageBaseEnemyHp =
        location.enemies.reduce(
            (total, enemyData) => {
                return (
                    total +
                    Math.max(
                        1,
                        Number(
                            enemyData.hp
                        ) || 1
                    )
                );
            },
            0
        ) /
        location.enemies.length;

    const averageEnemyHp =
        averageBaseEnemyHp *
        getOfflineAverageEncounterHpMultiplier(
            masteryPercentBefore
        );

    const additionalKills = Math.max(
        0,
        Math.floor(
            remainingDamage /
            averageEnemyHp
        )
    );

    remainingDamage -=
        additionalKills *
        averageEnemyHp;

    /*
     * Łączymy zabójstwa tego samego
     * rodzaju przeciwnika.
     */
    const enemyKillTotals =
        new Map();

    function addEnemyKills(
        enemyData,
        quantity
    ) {
        const safeQuantity = Math.max(
            0,
            Math.floor(
                Number(quantity) || 0
            )
        );

        if (safeQuantity <= 0) {
            return;
        }

        const enemyKey =
            (
                enemyData.id ||
                enemyData.name
            ) +
            ":" +
            (
                enemyData.encounterType ||
                "normal"
            ) +
            ":" +
            (
                enemyData.eliteModifierId ||
                "none"
            );
        const existingKills =
            enemyKillTotals.get(
                enemyKey
            ) || {
                enemy: enemyData,
                quantity: 0
            };

        existingKills.quantity +=
            safeQuantity;

        enemyKillTotals.set(
            enemyKey,
            existingKills
        );
    }

    /*
     * Aktualny przeciwnik został
     * pokonany jako pierwszy.
     */
    addEnemyKills(
        currentEnemyData,
        1
    );

    const baseEnemyKills =
        distributeOfflineEnemyKills(
            location.enemies,
            additionalKills
        );

    const variantEnemyKills =
        applyOfflineEncounterDistribution(
            baseEnemyKills,
            masteryPercentBefore
        );

    variantEnemyKills.forEach(
        enemyKill => {
            addEnemyKills(
                enemyKill.enemy,
                enemyKill.quantity
            );
        }
    );

    const enemyKills =
        Array.from(
            enemyKillTotals.values()
        );

    if (
        typeof recordBestiaryKills ===
        "function"
    ) {
        enemyKills.forEach(
            enemyKill => {
                recordBestiaryKills(
                    enemyKill.enemy,

                    enemyKill.enemy
                        .encounterType ||
                    "normal",

                    enemyKill.quantity,

                    player.location
                );
            }
        );
    }

    const totalKills =
        1 + additionalKills;

    const strongKills =
        enemyKills.reduce(
            (total, enemyKill) => {
                return (
                    total +
                    (
                        enemyKill.enemy
                            .encounterType ===
                            "strong"
                            ? enemyKill.quantity
                            : 0
                    )
                );
            },
            0
        );

    const eliteKills =
        enemyKills.reduce(
            (total, enemyKill) => {
                return (
                    total +
                    (
                        enemyKill.enemy
                            .encounterType ===
                            "elite"
                            ? enemyKill.quantity
                            : 0
                    )
                );
            },
            0
        );

    let totalGold = 0;
    let totalExperience = 0;

    enemyKills.forEach(enemyKill => {
        totalGold +=
            Math.max(
                0,
                Number(
                    enemyKill.enemy.gold
                ) || 0
            ) *
            enemyKill.quantity;

        totalExperience +=
            Math.max(
                0,
                Number(
                    enemyKill.enemy.exp
                ) || 0
            ) *
            enemyKill.quantity;
    });

    const lootRewards =
        collectOfflineCombatLoot(
            enemyKills,
            safeSavedAt,
            safeCurrentTime
        );

    const chestRewards =
        collectOfflineHuntingChestRewards(
            enemyKills
        );

    lootRewards.forEach(reward => {
        addItemToInventory(
            reward.itemId,
            reward.quantity
        );
    });


    chestRewards.items.forEach(
        reward => {
            addItemToInventory(
                reward.itemId,
                reward.quantity
            );
        }
    );

    const completedQuestCount =
        updateOfflineCombatQuests(
            enemyKills
        );

    player.gold +=
        totalGold +
        chestRewards.gold;
    player.exp += totalExperience;
    let firstBossReward =
        null;

    if (
        currentEnemyWasBoss &&
        typeof grantFirstBossKillReward ===
        "function"
    ) {
        firstBossReward =
            grantFirstBossKillReward(
                player.location
            );
    }
    const levelBefore =
        player.level;

    if (
        typeof checkLevelUp ===
        "function"
    ) {
        checkLevelUp();
    }

    /*
     * Bossów nie losujemy offline.
     * Jeżeli aktywny boss został pokonany,
     * jego licznik zaczyna się od zera.
     */
    const normalKillCount = Math.max(
        0,
        totalKills -
        (
            currentEnemyWasBoss
                ? 1
                : 0
        )
    );

    const progress =
        getCurrentLocationProgress();
    progress.totalKills +=
        totalKills;

    progress.eliteKills +=
        eliteKills;

    if (currentEnemyWasBoss) {
        progress.bossKills += 1;
    }

    progress.chestsFound +=
        chestRewards.totalChests;

    progress.commonChestsFound +=
        chestRewards.commonChests;

    progress.rareChestsFound +=
        chestRewards.rareChests;

    progress.eliteChestsFound +=
        chestRewards.eliteChests;

    const masteryPercentAfter =
        getLocationMasteryPercent(
            player.location
        );

    LOCATION_MASTERY_THRESHOLDS
        .filter(threshold => {
            return (
                masteryPercentAfter >=
                threshold &&
                !progress
                    .masteryUnlockedMilestones
                    .includes(
                        threshold
                    )
            );
        })
        .forEach(threshold => {
            progress
                .masteryUnlockedMilestones
                .push(
                    threshold
                );
        });

    progress
        .masteryUnlockedMilestones
        .sort(
            (
                firstValue,
                secondValue
            ) => {
                return (
                    firstValue -
                    secondValue
                );
            }
        );
    const previousKillCounter =
        currentEnemyWasBoss
            ? 0
            : Math.max(
                0,
                Number(
                    progress
                        .bossKillsCounter
                ) || 0
            );

    progress.bossKillsCounter =
        previousKillCounter +
        normalKillCount;

    if (
        progress.bossKillsCounter < 26
    ) {
        progress.bossChance = 0;
    } else {
        progress.bossChance =
            Math.min(
                20,
                (
                    progress
                        .bossKillsCounter -
                    26 +
                    1
                ) *
                0.25
            );
    }

    player.bossKillsCounter =
        progress.bossKillsCounter;

    player.bossChance =
        progress.bossChance;

    player.isBossFight = false;

    if (
        typeof clearEnemyCombatEffects ===
        "function"
    ) {
        clearEnemyCombatEffects();
    }

    /*
     * Wybieramy przeciwnika, którego
     * gracz zastanie po powrocie.
     */
    const nextBaseEnemy =
        location.enemies[
        Math.floor(
            Math.random() *
            location.enemies.length
        )
        ];

    const nextEncounterType =
        rollEnemyEncounterType();

    const nextEnemy =
        createOfflineEncounterEnemyData(
            nextBaseEnemy,
            nextEncounterType
        );

    const nextEnemyProgress =
        nextEnemy.hp > 0
            ? remainingDamage /
            nextEnemy.hp
            : 0;

    setOfflineCombatEnemy(
        nextEnemy,
        nextEnemyProgress
    );

    if (
        typeof recordBestiaryEncounter ===
        "function"
    ) {
        recordBestiaryEncounter(
            nextEnemy,
            player.location
        );
    }

    const totalLootItems =
        lootRewards.reduce(
            (total, reward) => {
                return (
                    total +
                    reward.quantity
                );
            },
            0
        );

    const summaryStats = [
        {
            label:
                "Pokonani przeciwnicy",

            value: totalKills
        },

        {
            label:
                "Silni przeciwnicy",

            value: strongKills
        },
        {
            label:
                "Elitarni przeciwnicy",

            value: eliteKills
        },
        {
            label:
                "Opanowanie lokacji",

            value:
                Math.floor(
                    masteryPercentAfter
                ) +
                "%"
        },
        {
            label: "EXP bohatera",
            value: totalExperience,
            prefix: "+"
        },
        {
            label: "Złoto",
            value: totalGold,
            prefix: "+"
        },
        {
            label:
                "Zdobyte przedmioty",

            value: totalLootItems,
            prefix: "+"
        }
    ];

    if (
        player.level >
        levelBefore
    ) {
        summaryStats.push({
            label:
                "Nowy poziom bohatera",

            value: player.level
        });
    }

    if (completedQuestCount > 0) {
        summaryStats.push({
            label:
                "Ukończone zadania",

            value:
                completedQuestCount
        });
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "🌙 Polowanie offline: pokonano " +
            totalKills +
            " przeciwników, zdobyto +" +
            totalExperience +
            " EXP, +" +
            totalGold +
            " złota i +" +
            totalLootItems +
            " przedmiotów.",
            "offline"
        );
        if (
            chestRewards.totalChests > 0
        ) {
            addSystemLog(
                "📦 Polowanie offline: automatycznie otwarto " +
                chestRewards.totalChests +
                " skrzyń i zdobyto z nich " +
                chestRewards.gold +
                " złota.",
                "offline"
            );
        }

    }
    const summarySections = [
        {
            icon: "⚔️",

            title:
                "Polowanie — " +
                location.name,

            stats: summaryStats,
            items: lootRewards
        }
    ];
    if (firstBossReward) {
        summarySections.push({
            icon: "🏆",

            title:
                "Pierwsze zwycięstwo nad bossem",

            stats: [
                {
                    label: "Dodatkowe złoto",

                    value:
                        firstBossReward.gold,

                    prefix: "+"
                },
                {
                    label: "Dodatkowe EXP",

                    value:
                        firstBossReward
                            .experience,

                    prefix: "+"
                }
            ],

            items:
                firstBossReward.items
        });
    }
    if (
        chestRewards.totalChests > 0
    ) {
        summarySections.push({
            icon: "📦",

            title:
                "Automatycznie otwarte skrzynie",

            stats: [
                {
                    label:
                        "Wszystkie skrzynie",

                    value:
                        chestRewards
                            .totalChests
                },
                {
                    label: "Zwykłe",

                    value:
                        chestRewards
                            .commonChests
                },
                {
                    label: "Rzadkie",

                    value:
                        chestRewards
                            .rareChests
                },
                {
                    label: "Elitarne",

                    value:
                        chestRewards
                            .eliteChests
                },
                {
                    label:
                        "Złoto ze skrzyń",

                    value:
                        chestRewards.gold,

                    prefix: "+"
                }
            ],

            items:
                chestRewards.items
        });
    }
    return {
        durationMilliseconds:
            Math.max(
                0,
                safeCurrentTime -
                safeSavedAt
            ),

        sections:
            summarySections
    };
}