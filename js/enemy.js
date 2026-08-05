const enemy = {
    id: "beetle",
    name: "Chrząszcz",
    hp: 20,
    maxHp: 20,
    attack: 3,
    gold: 2,
    exp: 4,
    loot: []
};

const enemyIcons = {
    beetle: "🐞",
    sheep: "🐑",
    rat: "🐀",
    wolf: "🐺",
    goblin: "👺",

    bat: "🦇",
    cave_spider: "🕷️",
    skeleton: "💀",
    kobold: "👹",
    stone_golem: "🪨",

    ruins_scarab: "🪲",
    ruin_scavenger: "🗡️",
    animated_armor: "🛡️",
    ruin_sentinel: "🗿",
    spectral_knight: "👻",

    frost_wisp: "❄️",
    ice_wolf: "🐺",
    frozen_warrior: "💀",
    frost_giant: "🧌",
    ice_elemental: "🧊",

    ash_scorpion: "🦂",
    lava_hound: "🐺",
    charred_skeleton: "💀",
    magma_golem: "🗿",
    fire_elemental: "🔥",

    volcanic_dragon: "🐉",
    frost_queen: "👑",
    goblin_chief: "👺",
    kobold_king: "👑",
    ancient_guardian: "🗿"
};

function getEnemyIcon(enemyId) {
    return (
        enemyIcons[enemyId] ||
        "🐾"
    );
}

/*
 * Centralny balans złota
 * otrzymywanego bezpośrednio
 * za pokonywanie przeciwników.
 */
const COMBAT_GOLD_MULTIPLIERS =
    Object.freeze({
        enemy: 0.4,
        boss: 0.7
    });

function getBalancedEnemyGoldReward(
    baseGold,
    encounterType = "normal"
) {
    const safeBaseGold =
        Math.max(
            0,
            Number(baseGold) || 0
        );

    if (safeBaseGold <= 0) {
        return 0;
    }

    const multiplier =
        encounterType === "boss"
            ? COMBAT_GOLD_MULTIPLIERS
                .boss
            : COMBAT_GOLD_MULTIPLIERS
                .enemy;

    /*
     * Jeżeli potwór pierwotnie dawał
     * złoto, gwarantujemy przynajmniej
     * jedną sztukę złota.
     */
    return Math.max(
        1,
        Math.round(
            safeBaseGold *
            multiplier
        )
    );
}

const enemyEncounterVariants = {
    normal: {
        id: "normal",
        label: "Zwykły przeciwnik",
        hpMultiplier: 1,
        attackMultiplier: 1,
        rewardMultiplier: 1,
        lootChanceMultiplier: 1
    },

    strong: {
        id: "strong",
        label: "⭐ Silny przeciwnik",
        hpMultiplier: 1.5,
        attackMultiplier: 1.3,
        rewardMultiplier: 1.5,
        lootChanceMultiplier: 1.25
    },

    elite: {
        id: "elite",
        label: "💠 Elitarny przeciwnik",
        hpMultiplier: 2,
        attackMultiplier: 1.5,
        rewardMultiplier: 2,
        lootChanceMultiplier: 1.5
    }
};

const eliteEnemyModifiers = {
    enraged: {
        id: "enraged",
        label: "🔥 Wściekły",

        description:
            "+30% ataku i +15% EXP.",

        hpMultiplier: 1,
        attackMultiplier: 1.3,
        goldMultiplier: 1,
        expMultiplier: 1.15,
        lootMultiplier: 1
    },

    armored: {
        id: "armored",
        label: "🛡️ Opancerzony",

        description:
            "+60% HP i +25% EXP.",

        hpMultiplier: 1.6,
        attackMultiplier: 1,
        goldMultiplier: 1,
        expMultiplier: 1.25,
        lootMultiplier: 1
    },

    brutal: {
        id: "brutal",
        label: "💀 Okrutny",

        description:
            "+25% HP, +20% ataku oraz +30% złota i EXP.",

        hpMultiplier: 1.25,
        attackMultiplier: 1.2,
        goldMultiplier: 1.3,
        expMultiplier: 1.3,
        lootMultiplier: 1.1
    },

    treasureKeeper: {
        id: "treasureKeeper",
        label: "💰 Skarbnik",

        description:
            "+100% złota i +50% szansy na łup.",

        hpMultiplier: 1,
        attackMultiplier: 1,
        goldMultiplier: 2,
        expMultiplier: 1,
        lootMultiplier: 1.5
    }
};

function rollEliteEnemyModifierId() {
    const modifierIds =
        Object.keys(
            eliteEnemyModifiers
        );

    return modifierIds[
        Math.floor(
            Math.random() *
            modifierIds.length
        )
    ];
}

function applyEliteEnemyModifierToData(
    enemyData,
    modifierId =
        rollEliteEnemyModifierId()
) {
    const modifier =
        eliteEnemyModifiers[
        modifierId
        ];

    if (!modifier) {
        return {
            ...enemyData,
            eliteModifierId: null,
            eliteModifierLabel: "",
            eliteModifierDescription: ""
        };
    }

    const maximumHp = Math.max(
        1,
        Math.round(
            (
                Number(enemyData.maxHp) ||
                Number(enemyData.hp) ||
                1
            ) *
            modifier.hpMultiplier
        )
    );

    return {
        ...enemyData,

        hp: maximumHp,
        maxHp: maximumHp,

        attack: Math.max(
            1,
            Math.round(
                enemyData.attack *
                modifier.attackMultiplier
            )
        ),

        gold: Math.max(
            0,
            Math.round(
                enemyData.gold *
                modifier.goldMultiplier
            )
        ),

        exp: Math.max(
            0,
            Math.round(
                enemyData.exp *
                modifier.expMultiplier
            )
        ),

        lootChanceMultiplier:
            (
                Number(
                    enemyData
                        .lootChanceMultiplier
                ) || 1
            ) *
            modifier.lootMultiplier,

        eliteModifierId:
            modifier.id,

        eliteModifierLabel:
            modifier.label,

        eliteModifierDescription:
            modifier.description
    };
}

function getEnemyEncounterChances(
    masteryPercent
) {
    if (masteryPercent >= 75) {
        return {
            strong: 25,
            elite: 15
        };
    }

    if (masteryPercent >= 50) {
        return {
            strong: 20,
            elite: 10
        };
    }

    if (masteryPercent >= 25) {
        return {
            strong: 15,
            elite: 5
        };
    }

    return {
        strong: 10,
        elite: 0
    };
}

function rollEnemyEncounterType() {
    const masteryPercent =
        typeof getLocationMasteryPercent ===
            "function"
            ? getLocationMasteryPercent(
                player.location
            )
            : 0;

    const chances =
        getEnemyEncounterChances(
            masteryPercent
        );

    const roll = Math.random() * 100;

    if (roll <= chances.elite) {
        return "elite";
    }

    if (
        roll <=
        chances.elite +
        chances.strong
    ) {
        return "strong";
    }

    return "normal";
}

function applyEnemyEncounterVariant(
    enemyData,
    encounterType
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

    const maximumHp = Math.max(
        1,
        Math.round(
            enemyData.hp *
            variant.hpMultiplier
        )
    );

    enemy.id = enemyData.id;
    enemy.baseName = enemyData.name;
    enemy.name = enemyData.name;

    enemy.hp = maximumHp;
    enemy.maxHp = maximumHp;

    enemy.attack = Math.max(
        1,
        Math.round(
            enemyData.attack *
            variant.attackMultiplier
        )
    );

    enemy.gold = Math.max(
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
    );

    enemy.exp = Math.max(
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
    );

    enemy.loot = enemyData.loot;

    enemy.encounterType =
        variant.id;

    enemy.encounterLabel =
        variant.label;

    enemy.lootChanceMultiplier =
        variant.lootChanceMultiplier *
        (
            1 +
            masteryBonuses
                .lootChanceBonus /
            100
        );

    if (variant.id === "elite") {
        Object.assign(
            enemy,
            applyEliteEnemyModifierToData(
                enemy
            )
        );
    } else {
        enemy.eliteModifierId = null;
        enemy.eliteModifierLabel = "";
        enemy.eliteModifierDescription = "";
    }
    /*
 * Mnożnik ekonomii stosujemy dopiero
 * po wariancie przeciwnika, mistrzostwie
 * lokacji i modyfikatorze elity.
 */
    enemy.gold =
        getBalancedEnemyGoldReward(
            enemy.gold,
            variant.id
        );
}

function spawnEnemy() {
    const currentLocation =
        locations[player.location];

    const enemyList =
        currentLocation.enemies;

    const randomEnemy =
        enemyList[
        Math.floor(
            Math.random() *
            enemyList.length
        )
        ];

    const encounterType =
        rollEnemyEncounterType();

    applyEnemyEncounterVariant(
        randomEnemy,
        encounterType
    );

    if (
        typeof recordBestiaryEncounter ===
        "function"
    ) {
        recordBestiaryEncounter(
            enemy,
            player.location
        );
    }

    player.isBossFight = false;

    if (
        encounterType !== "normal" &&
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(
            enemy.encounterLabel +
            (
                enemy.eliteModifierLabel
                    ? " · " +
                    enemy.eliteModifierLabel
                    : ""
            ) +
            ": " +
            enemy.name +
            "!" +
            (
                enemy.eliteModifierDescription
                    ? " " +
                    enemy.eliteModifierDescription
                    : ""
            )
        );
    }
}

function spawnBoss() {
    const currentLocation = locations[player.location];

    if (!currentLocation.boss) {
        console.warn("This location has no boss:", player.location);
        spawnEnemy();
        return;
    }

    const boss = currentLocation.boss;
    const masteryBonuses =
        getLocationMasteryBonuses(
            player.location
        );
    enemy.id = boss.id;
    enemy.name = boss.name;
    enemy.hp = boss.hp;
    enemy.maxHp = boss.hp;
    enemy.attack = boss.attack;
    enemy.gold =
        getBalancedEnemyGoldReward(
            boss.gold *
            (
                1 +
                masteryBonuses
                    .goldBonus /
                100
            ),
            "boss"
        );

    enemy.exp = Math.round(
        boss.exp *
        (
            1 +
            masteryBonuses
                .experienceBonus /
            100
        )
    );
    enemy.loot = boss.loot;
    enemy.baseName = boss.name;
    enemy.encounterType = "boss";
    enemy.encounterLabel = "👑 BOSS";
    enemy.lootChanceMultiplier =
        1 +
        masteryBonuses
            .lootChanceBonus /
        100;
    enemy.eliteModifierId = null;
    enemy.eliteModifierLabel = "";
    enemy.eliteModifierDescription = "";
    player.isBossFight = true;

    if (
        typeof recordBestiaryEncounter ===
        "function"
    ) {
        recordBestiaryEncounter(
            enemy,
            player.location
        );
    }

    if (typeof addCombatLog === "function") {
        addCombatLog("👑 Pojawił się boss: " + boss.name + "!");
    }

    saveGame();
    render();
}

function resetEnemy() {
    spawnEnemy();
}