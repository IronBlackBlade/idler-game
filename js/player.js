const pendingAttributeChanges = {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    endurance: 0,
    luck: 0
};

const player = {
    hp: 100,
    mana: 50,

    gold: 0,
    exp: 0,
    expToNextLevel: 120,
    level: 1,
    attributePoints: 0,
    skillPoints: 0,

    skills: {},
    systemLog: [],

    selectedSpells: {
        offensive: null,
        defensive: null
    },

    spellCooldowns: {},

    activeEffects: {
        arcaneBarrierUntil: 0,

        potionEffects: {}
    },

    timedEffects: [],

    isFighting: false,

    bossKillsCounter: 0,
    bossChance: 0,
    isBossFight: false,

    locationProgress: {
        forest: {
            bossKillsCounter: 0,
            bossChance: 0
        },
        cave: {
            bossKillsCounter: 0,
            bossChance: 0
        }
    },

    location: "forest",

    stats: {
        strength: 5,
        dexterity: 5,
        intelligence: 5,
        endurance: 5,
        luck: 5
    },

    inventory: [],

    lockedInventoryItems: {},

    unlockedRecipes: [],

    crafting: {
        level: 1,
        exp: 0,
        expToNextLevel: 100
    },

    mining: {
        level: 1,
        exp: 0,
        expToNextLevel: 100,
        isMining: false,
        selectedAreaId: "upper_shaft",
        cycleStartedAt: 0,
        cycleDurationMs: 0,
        lastResult: null
    },

    herbalism: {
        level: 1,
        exp: 0,
        expToNextLevel: 100,

        isGathering: false,

        selectedAreaId: "forest_clearing",
        activeAreaId: null,

        cycleStartedAt: 0,
        cycleDurationMs: 0,

        lastResult: null
    },

    alchemy: {
        level: 1,
        exp: 0,
        expToNextLevel: 100,

        isCrafting: false,

        queue: [],
        activeJobId: null,
        activeRecipeId: null,
        craftingQuantity: 1,

        craftingStartedAt: 0,
        craftingDurationMs: 0,
        craftingFinishesAt: 0,

        lastResult: null
    },

    equipment: {
        weapon: null,
        shield: null,
        helmet: null,
        armor: null,
        pants: null,
        boots: null,
        gloves: null,
        ring1: null,
        ring2: null,
        amulet: null,
        talisman: null
    }
};

function resetPlayer() {

    player.gold = 0;
    player.exp = 0;
    player.level = 1;
    player.expToNextLevel =
        getExpToNextLevel(1);
    player.systemLog = [];

    player.mining = {
        level: 1,
        exp: 0,
        expToNextLevel: 100,
        isMining: false,
        selectedAreaId: "upper_shaft",
        cycleStartedAt: 0,
        cycleDurationMs: 0,
        lastResult: null
    };

    player.herbalism = {
        level: 1,
        exp: 0,
        expToNextLevel: 100,

        isGathering: false,

        selectedAreaId: "forest_clearing",
        activeAreaId: null,

        cycleStartedAt: 0,
        cycleDurationMs: 0,

        lastResult: null
    };

    player.alchemy = {
        level: 1,
        exp: 0,
        expToNextLevel: 100,

        isCrafting: false,
        activeRecipeId: null,
        craftingQuantity: 1,

        craftingStartedAt: 0,
        craftingDurationMs: 0,
        craftingFinishesAt: 0,

        lastResult: null
    };

    player.isFighting = false;
    player.unlockedRecipes = [];

    player.crafting = {
        level: 1,
        exp: 0,
        expToNextLevel: 100
    };

    player.bossKillsCounter = 0;
    player.bossChance = 0;
    player.isBossFight = false;

    player.skills = {};

    player.selectedSpells = {
        offensive: null,
        defensive: null
    };

    player.spellCooldowns = {};

    player.activeEffects = {
        arcaneBarrierUntil: 0,

        potionEffects: {}
    };

    player.timedEffects = [];

    player.locationProgress = {
        forest: {
            bossKillsCounter: 0,
            bossChance: 0
        },
        cave: {
            bossKillsCounter: 0,
            bossChance: 0
        }
    };

    player.attributePoints = 0;
    player.skillPoints = 0;

    player.location = "forest";

    player.stats = {
        strength: 5,
        dexterity: 5,
        intelligence: 5,
        endurance: 5,
        luck: 5
    };

    player.inventory = [];

    player.lockedInventoryItems = {};


    player.equipment = {
        weapon: null,
        shield: null,
        helmet: null,
        armor: null,
        pants: null,
        boots: null,
        gloves: null,
        ring1: null,
        ring2: null,
        amulet: null,
        talisman: null
    };

    const derived = getDerivedStats();

    player.hp = derived.maxHp;
    player.mana = derived.maxMana;

    console.log("resetPlayer wykonany:", player);
}


function getExpToNextLevel(level) {
    const normalizedLevel = Math.max(
        1,
        Math.floor(level || 1)
    );

    const levelIndex =
        normalizedLevel - 1;

    const lateGameIndex =
        Math.max(
            0,
            levelIndex - 20
        );

    return Math.floor(
        120 +
        levelIndex * 80 +
        Math.pow(
            levelIndex,
            1.55
        ) * 35 +
        Math.pow(
            lateGameIndex,
            2
        ) * 15
    );
}

function getTotalStats() {
    const stats = {
        strength: player.stats.strength,
        dexterity: player.stats.dexterity,
        intelligence: player.stats.intelligence,
        endurance: player.stats.endurance,
        luck: player.stats.luck
    };

    if (!player.equipment) return stats;

    Object.keys(player.equipment).forEach(slot => {
        const itemId = player.equipment[slot];

        if (!itemId) return;

        const item = items[itemId];

        if (!item) return;

        if (item.strength) stats.strength += item.strength;
        if (item.dexterity) stats.dexterity += item.dexterity;
        if (item.intelligence) stats.intelligence += item.intelligence;
        if (item.endurance) stats.endurance += item.endurance;
        if (item.luck) stats.luck += item.luck;
    });

    return stats;
}

function getDerivedStats() {
    const stats = getTotalStats();

    return {
        maxHp: Math.floor(
            50 + stats.endurance * 10 + (player.level - 1) * 10
        ),

        maxMana: Math.floor(
            20 + stats.intelligence * 10
        ),

        generalDamage: 0,

        meleeDamage: stats.strength * 1.8,
        rangedDamage: stats.dexterity * 1.8,
        magicDamage: stats.intelligence * 1.8,

        defense: stats.endurance * 0.5,

        dodgeChance: Math.min(
            40,
            stats.dexterity * 0.4
        ),

        critChance: Math.min(
            50,
            stats.luck * 0.4
        ),

        critDamage: 150 + stats.luck,

        lootBonus: stats.luck
    };
}

function getAttack() {
    const derived =
        getDerivedStats();

    const weaponId =
        player.equipment.weapon;

    const weapon =
        weaponId
            ? items[weaponId]
            : null;

    let damage = 0;

    if (!weapon) {
        const meleeBonus =
            typeof getMeleeDamageSkillBonus ===
                "function"
                ? getMeleeDamageSkillBonus()
                : 0;

        const baseDamage =
            derived.meleeDamage;

        damage = Math.floor(
            baseDamage *
            (
                1 +
                meleeBonus / 100
            )
        );
    } else if (
        weapon.weaponType === "melee"
    ) {
        const meleeBonus =
            typeof getMeleeDamageSkillBonus ===
                "function"
                ? getMeleeDamageSkillBonus()
                : 0;

        const baseDamage =
            (weapon.damage || 0) +
            derived.meleeDamage;

        damage = Math.floor(
            baseDamage *
            (
                1 +
                meleeBonus / 100
            )
        );
    } else if (
        weapon.weaponType === "ranged"
    ) {
        damage = Math.floor(
            (weapon.damage || 0) +
            derived.rangedDamage
        );
    } else if (
        weapon.weaponType === "magic"
    ) {
        const magicBonus =
            typeof getMagicDamageSkillBonus ===
                "function"
                ? getMagicDamageSkillBonus()
                : 0;

        const baseDamage =
            (weapon.damage || 0) +
            derived.magicDamage;

        damage = Math.floor(
            baseDamage *
            (
                1 +
                magicBonus / 100
            )
        );
    } else {
        damage = Math.floor(
            (weapon.damage || 0) +
            derived.meleeDamage
        );
    }

    return applyWeaponDamagePotionBonus(
        damage,
        weapon
    );
}

function applySpellDamagePotionBonus(
    damage
) {
    const safeDamage =
        Math.max(
            0,
            Number(damage) || 0
        );

    const potionBonus =
        getActivePotionEffectValue(
            "spell_damage"
        );

    const damageMultiplier =
        1 + potionBonus / 100;

    return Math.floor(
        safeDamage *
        damageMultiplier
    );
}

function getActivePotionEffectValue(
    effectId
) {
    const potionEffects =
        player.activeEffects
            ?.potionEffects;

    if (
        !potionEffects ||
        typeof potionEffects !== "object"
    ) {
        return 0;
    }

    const effect =
        potionEffects[effectId];

    if (!effect) {
        return 0;
    }

    const expiresAt =
        Number(effect.expiresAt) || 0;

    if (expiresAt <= Date.now()) {
        return 0;
    }

    return Math.max(
        0,
        Number(effect.value) || 0
    );
}

function applyCombatDefensePotionReduction(
    damage
) {
    const safeDamage =
        Math.max(
            0,
            Number(damage) || 0
        );

    const potionReduction =
        getActivePotionEffectValue(
            "combat_defense"
        );

    const damageMultiplier =
        1 - potionReduction / 100;

    return Math.max(
        1,
        Math.floor(
            safeDamage *
            damageMultiplier
        )
    );
}

function getWeaponPotionEffectId(
    weapon
) {
    if (
        !weapon ||
        weapon.weaponType === "melee"
    ) {
        return "melee_weapon_damage";
    }

    if (
        weapon.weaponType === "ranged"
    ) {
        return "ranged_weapon_damage";
    }

    if (
        weapon.weaponType === "magic"
    ) {
        return "magic_weapon_damage";
    }

    return null;
}

function applyWeaponDamagePotionBonus(
    damage,
    weapon
) {
    const safeDamage =
        Math.max(
            0,
            Number(damage) || 0
        );

    const effectId =
        getWeaponPotionEffectId(
            weapon
        );

    if (!effectId) {
        return Math.floor(
            safeDamage
        );
    }

    const potionBonus =
        getActivePotionEffectValue(
            effectId
        );

    const damageMultiplier =
        1 + potionBonus / 100;

    return Math.floor(
        safeDamage *
        damageMultiplier
    );
}

function calculatePlayerDamage() {
    const derived =
        getDerivedStats();

    let damage =
        getAttack();

    const critRoll =
        Math.random() * 100;

    const isCritical =
        critRoll <=
        derived.critChance;

    if (isCritical) {
        damage = Math.floor(
            damage *
            (
                derived.critDamage /
                100
            )
        );

        return {
            damage: damage,
            isCritical: true
        };
    }

    return {
        damage: damage,
        isCritical: false
    };
}

function checkLevelUp() {
    let didLevelUp = false;

    while (
        player.exp >=
        player.expToNextLevel
    ) {
        player.exp -=
            player.expToNextLevel;

        player.level++;
        player.attributePoints += 5;
        player.skillPoints += 1;

        didLevelUp = true;

        player.expToNextLevel =
            getExpToNextLevel(
                player.level
            );

        const derived =
            getDerivedStats();

        player.hp =
            derived.maxHp;

        player.mana =
            derived.maxMana;

        if (
            typeof addSystemLog ===
            "function"
        ) {
            addSystemLog(
                "⭐ Awansowano na poziom " +
                player.level +
                ". Otrzymano 5 punktów atrybutów i 1 punkt umiejętności.",
                "level"
            );
        }
    }

    if (
        didLevelUp &&
        typeof refreshSkillsView ===
        "function"
    ) {
        refreshSkillsView();
    }
}

function getPendingAttributePointsTotal() {
    return Object.values(
        pendingAttributeChanges
    ).reduce(
        (total, value) => {
            return total + value;
        },
        0
    );
}

function getAvailablePendingAttributePoints() {
    return Math.max(
        0,
        player.attributePoints -
        getPendingAttributePointsTotal()
    );
}

function getPreviewAttributeValue(statName) {
    if (
        !player.stats ||
        player.stats[statName] === undefined
    ) {
        return 0;
    }

    return (
        player.stats[statName] +
        (
            pendingAttributeChanges[
            statName
            ] || 0
        )
    );
}

function addPendingAttributePoint(
    statName,
    requestedAmount = 1
) {
    if (
        !player.stats ||
        player.stats[statName] === undefined
    ) {
        console.warn(
            "Nieznany atrybut:",
            statName
        );

        return;
    }

    const availablePoints =
        getAvailablePendingAttributePoints();

    if (availablePoints <= 0) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Brak dostępnych punktów atrybutów.",
                "error"
            );
        }

        return;
    }

    const amount = Math.min(
        Math.max(
            1,
            Math.floor(
                requestedAmount || 1
            )
        ),
        availablePoints
    );

    pendingAttributeChanges[
        statName
    ] += amount;

    render();
}

function removePendingAttributePoint(
    statName,
    requestedAmount = 1
) {
    if (
        pendingAttributeChanges[
        statName
        ] === undefined
    ) {
        return;
    }

    const amount = Math.min(
        Math.max(
            1,
            Math.floor(
                requestedAmount || 1
            )
        ),
        pendingAttributeChanges[
        statName
        ]
    );

    pendingAttributeChanges[
        statName
    ] -= amount;

    render();
}

function resetPendingAttributeChanges(
    shouldRender = true
) {
    Object.keys(
        pendingAttributeChanges
    ).forEach(statName => {
        pendingAttributeChanges[
            statName
        ] = 0;
    });

    if (shouldRender) {
        render();
    }
}

function confirmPendingAttributeChanges() {
    const spentPoints =
        getPendingAttributePointsTotal();

    if (spentPoints <= 0) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Nie przydzielono żadnych punktów.",
                "error"
            );
        }

        return;
    }

    if (
        spentPoints >
        player.attributePoints
    ) {
        resetPendingAttributeChanges(false);

        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Nie masz wystarczającej liczby punktów.",
                "error"
            );
        }

        return;
    }

    Object.keys(
        pendingAttributeChanges
    ).forEach(statName => {
        player.stats[statName] +=
            pendingAttributeChanges[
            statName
            ];
    });

    player.attributePoints -=
        spentPoints;

    resetPendingAttributeChanges();

    const derived =
        getDerivedStats();

    player.hp = Math.min(
        player.hp,
        derived.maxHp
    );

    player.mana = Math.min(
        player.mana,
        derived.maxMana
    );

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Zatwierdzono punkty atrybutów.",
            "success"
        );
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "📊 Przydzielono " +
            spentPoints +
            " punktów atrybutów.",
            "attributes"
        );
    }

    saveGame();
    render();
}

function getCurrentLocationProgress() {
    if (!player.locationProgress) {
        player.locationProgress = {};
    }

    if (!player.locationProgress[player.location]) {
        player.locationProgress[player.location] = {
            bossKillsCounter: 0,
            bossChance: 0
        };
    }

    return player.locationProgress[player.location];
}

function regenerateMana(amount = 1) {
    const derived = getDerivedStats();

    player.mana = Math.min(
        derived.maxMana,
        player.mana + amount
    );
}