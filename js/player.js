const characterClasses = {
    warrior: {
        id: "warrior",
        name: "Wojownik",
        icon: "⚔️",

        description:
            "Mistrz walki w zwarciu, który łączy wysokie obrażenia z większą wytrzymałością.",

        unlockLevel: 10,

        bonuses: {
            strength: 5,
            endurance: 2
        }
    },

    hunter: {
        id: "hunter",
        name: "Łowca",
        icon: "🏹",

        description:
            "Specjalista od łuków i kusz, polegający na zręczności oraz szczęściu.",

        unlockLevel: 10,

        bonuses: {
            dexterity: 5,
            luck: 2
        }
    },

    mage: {
        id: "mage",
        name: "Mag",
        icon: "🪄",

        description:
            "Włada bronią magiczną i czarami, korzystając z wysokiej inteligencji.",

        unlockLevel: 10,

        bonuses: {
            intelligence: 5,
            luck: 2
        }
    },

    guardian: {
        id: "guardian",
        name: "Strażnik",
        icon: "🛡️",

        description:
            "Wytrzymały obrońca z dużą liczbą punktów życia i większą siłą.",

        unlockLevel: 10,

        bonuses: {
            endurance: 5,
            strength: 2
        }
    },

    rogue: {
        id: "rogue",
        name: "Łotrzyk",
        icon: "🗡️",

        description:
            "Szybki wojownik opierający się na unikach, zręczności i trafieniach krytycznych.",

        unlockLevel: 10,

        bonuses: {
            dexterity: 4,
            luck: 3
        }
    }
};

const pendingAttributeChanges = {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    endurance: 0,
    luck: 0
};

const LOCATION_MASTERY_REQUIRED_KILLS =
    200;

const LOCATION_MASTERY_THRESHOLDS = [
    25,
    50,
    75,
    100
];

const LOCATION_MASTERY_REWARDS = [
    {
        threshold: 25,
        label: "Złoto +5%",

        bonuses: {
            goldBonus: 5
        }
    },
    {
        threshold: 50,
        label: "EXP +5%",

        bonuses: {
            experienceBonus: 5
        }
    },
    {
        threshold: 75,
        label: "Skrzynie +15%",

        bonuses: {
            chestChanceBonus: 15
        }
    },
    {
        threshold: 100,
        label: "Łup +10%",

        bonuses: {
            lootChanceBonus: 10
        }
    }
];

const player = {
    hp: 100,
    mana: 50,

    gold: 0,
    exp: 0,
    expToNextLevel: 120,
    level: 1,
    attributePoints: 0,
    skillPoints: 0,
    classId: null,
    skills: {},
    systemLog: [],

    journal: {
        bestiary: {},

        achievementPoints: 0,
        totalAchievementPoints: 0,

        unlockedAchievements: {}
    },

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

    player.journal = {
        bestiary: {},

        achievementPoints: 0,
        totalAchievementPoints: 0,

        unlockedAchievements: {}
    };

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
    player.classId = null;
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

function getPlayerClassDefinition() {
    if (!player.classId) {
        return null;
    }

    return (
        characterClasses[
        player.classId
        ] || null
    );
}

function getPlayerClassBonuses() {
    const emptyBonuses = {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        endurance: 0,
        luck: 0
    };

    const classDefinition =
        getPlayerClassDefinition();

    if (!classDefinition) {
        return emptyBonuses;
    }

    return {
        ...emptyBonuses,
        ...classDefinition.bonuses
    };
}

function getCharacterClassStatName(
    statName
) {
    const statNames = {
        strength: "Siły",
        dexterity: "Zręczności",
        intelligence: "Inteligencji",
        endurance: "Wytrzymałości",
        luck: "Szczęścia"
    };

    return (
        statNames[statName] ||
        statName
    );
}

function getCharacterClassBonusSummary(
    classDefinition
) {
    if (
        !classDefinition ||
        !classDefinition.bonuses
    ) {
        return "";
    }

    return Object.entries(
        classDefinition.bonuses
    )
        .map(([statName, value]) => {
            return (
                "+" +
                value +
                " " +
                getCharacterClassStatName(
                    statName
                )
            );
        })
        .join(", ");
}

function chooseCharacterClass(
    classId
) {
    const classDefinition =
        characterClasses[classId];

    if (!classDefinition) {
        console.warn(
            "Nieznana klasa:",
            classId
        );

        return;
    }

    const currentClass =
        getPlayerClassDefinition();

    if (currentClass) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Klasa postaci została już wybrana.",
                "error"
            );
        }

        return;
    }

    if (
        player.level <
        classDefinition.unlockLevel
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Wybór klasy odblokowuje się na poziomie " +
                classDefinition.unlockLevel +
                ".",
                "error"
            );
        }

        return;
    }

    const bonusSummary =
        getCharacterClassBonusSummary(
            classDefinition
        );

    const shouldChoose =
        window.confirm(
            "Czy na pewno wybierasz klasę " +
            classDefinition.name +
            "?\n\n" +
            "Premie: " +
            bonusSummary +
            "\n\n" +
            "Na tym etapie wybór klasy jest stały."
        );

    if (!shouldChoose) {
        return;
    }

    player.classId =
        classDefinition.id;

    /*
     * Po wybraniu klasy odnawiamy HP
     * i manę do nowych maksymalnych
     * wartości.
     */
    const derived =
        getDerivedStats();

    player.hp =
        derived.maxHp;

    player.mana =
        derived.maxMana;

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Wybrano klasę: " +
            classDefinition.name +
            ".",
            "success"
        );
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            classDefinition.icon +
            " Bohater wybrał klasę " +
            classDefinition.name +
            ". Premie: " +
            bonusSummary +
            ".",
            "class"
        );
    }

    if (
        typeof saveGame ===
        "function"
    ) {
        saveGame();
    }

    if (
        typeof renderHero ===
        "function"
    ) {
        renderHero();
    }

    if (
        typeof renderPlayerHud ===
        "function"
    ) {
        renderPlayerHud();
    }
}

function getTotalStats() {
    const stats = {
        strength: player.stats.strength,
        dexterity: player.stats.dexterity,
        intelligence: player.stats.intelligence,
        endurance: player.stats.endurance,
        luck: player.stats.luck
    };

    const classBonuses =
        getPlayerClassBonuses();

    stats.strength +=
        classBonuses.strength;

    stats.dexterity +=
        classBonuses.dexterity;

    stats.intelligence +=
        classBonuses.intelligence;

    stats.endurance +=
        classBonuses.endurance;

    stats.luck +=
        classBonuses.luck;

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

        meleeDamage:
            stats.strength * 1.8,

        meleeCritDamageBonus:
            Math.min(
                30,
                stats.strength * 0.25
            ),

        rangedDamage:
            stats.dexterity * 1.8,

        magicDamage:
            stats.intelligence * 1.8,

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

const weaponCombatSettings = {
    default: {
        attackIntervalMs: 1000,
        damageMultiplier: 1,
        label: "Standardowa"
    },

    bow: {
        attackIntervalMs: 800,
        damageMultiplier: 1,
        label: "Łuk"
    },

    crossbow: {
        attackIntervalMs: 1400,
        damageMultiplier: 1.75,
        label: "Kusza"
    },

    crossbow: {
        attackIntervalMs: 1400,
        damageMultiplier: 1.75,
        label: "Kusza"
    },

    wand: {
        attackIntervalMs: 850,
        damageMultiplier: 1,
        label: "Różdżka"
    },

    staff: {
        attackIntervalMs: 1300,
        damageMultiplier: 1.5,
        label: "Kostur"
    }
};

function getWeaponCombatSettings(
    weapon
) {
    const weaponClass =
        weapon?.weaponClass ||
        "default";

    return (
        weaponCombatSettings[
        weaponClass
        ] ||
        weaponCombatSettings.default
    );
}

function getWeaponCombatLabels(
    weapon
) {
    if (!weapon?.weaponClass) {
        return [];
    }

    const settings =
        getWeaponCombatSettings(
            weapon
        );

    const attackTime =
        (
            settings.attackIntervalMs /
            1000
        )
            .toFixed(1)
            .replace(".", ",");

    const labels = [
        "Rodzaj: " + settings.label,
        "Atak co: " + attackTime + " s"
    ];

    const damageBonus =
        Math.round(
            (
                settings.damageMultiplier -
                1
            ) *
            100
        );

    if (damageBonus > 0) {
        labels.push(
            "Siła trafienia: +" +
            damageBonus +
            "%"
        );
    }

    return labels;
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
        const baseDamage =
            (weapon.damage || 0) +
            derived.rangedDamage;

        const combatSettings =
            getWeaponCombatSettings(
                weapon
            );

        damage = Math.floor(
            baseDamage *
            combatSettings.damageMultiplier
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
        const combatSettings =
            getWeaponCombatSettings(
                weapon
            );
        damage = Math.floor(
            baseDamage *
            (
                1 +
                magicBonus / 100
            ) *
            combatSettings.damageMultiplier
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

    const weaponId =
        player.equipment
            ?.weapon;

    const weapon =
        weaponId
            ? items[weaponId]
            : null;

    /*
     * Brak broni traktujemy jak
     * podstawowy atak w zwarciu.
     */
    const isMeleeAttack =
        !weapon ||
        weapon.weaponType ===
        "melee";

    const critRoll =
        Math.random() * 100;

    const isCritical =
        critRoll <=
        derived.critChance;

    if (isCritical) {
        const meleeCritBonus =
            isMeleeAttack
                ? derived
                    .meleeCritDamageBonus
                : 0;

        const totalCritDamage =
            derived.critDamage +
            meleeCritBonus;

        damage = Math.floor(
            damage *
            (
                totalCritDamage /
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
        if (
            player.level === 10 &&
            !player.classId
        ) {
            if (
                typeof showNotification ===
                "function"
            ) {
                showNotification(
                    "Odblokowano wybór klasy postaci!",
                    "success"
                );
            }

            if (
                typeof addSystemLog ===
                "function"
            ) {
                addSystemLog(
                    "🏛️ Osiągnięto 10. poziom. Możesz teraz wybrać klasę postaci w zakładce Bohater → Atrybuty.",
                    "class"
                );
            }
        }
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

function createDefaultLocationProgress() {
    return {
        /*
         * Zabójstwa od ostatniego bossa.
         * To pole obsługuje obecny
         * system pojawiania się bossa.
         */
        bossKillsCounter: 0,

        /*
         * Aktualna szansa na bossa.
         */
        bossChance: 0,

        /*
         * Stałe statystyki lokacji.
         * Nie zerują się po bossie.
         */
        totalKills: 0,
        eliteKills: 0,
        bossKills: 0,
        firstBossRewardClaimed: false,
        chestsFound: 0,
        commonChestsFound: 0,
        rareChestsFound: 0,
        eliteChestsFound: 0,

        /*
         * Lista osiągniętych progów:
         * 25, 50, 75 i 100.
         */
        masteryUnlockedMilestones: []
    };
}

function ensureLocationProgress(
    locationId
) {
    const safeLocationId =
        locationId ||
        player.location;

    if (
        !player.locationProgress ||
        typeof player.locationProgress !==
        "object"
    ) {
        player.locationProgress = {};
    }

    if (
        !player.locationProgress[
        safeLocationId
        ] ||
        typeof player.locationProgress[
        safeLocationId
        ] !== "object"
    ) {
        player.locationProgress[
            safeLocationId
        ] =
            createDefaultLocationProgress();
    }

    const progress =
        player.locationProgress[
        safeLocationId
        ];

    /*
     * Poniższa część uzupełnia stare
     * zapisy gry o brakujące pola.
     */

    progress.bossKillsCounter =
        Math.max(
            0,
            Math.floor(
                Number(
                    progress.bossKillsCounter
                ) || 0
            )
        );

    progress.bossChance =
        Math.max(
            0,
            Number(
                progress.bossChance
            ) || 0
        );

    progress.totalKills =
        Math.max(
            0,
            Math.floor(
                Number(
                    progress.totalKills
                ) || 0
            )
        );

    progress.firstBossRewardClaimed =
        progress
            .firstBossRewardClaimed ===
        true;

    progress.eliteKills =
        Math.max(
            0,
            Math.floor(
                Number(
                    progress.eliteKills
                ) || 0
            )
        );

    progress.bossKills =
        Math.max(
            0,
            Math.floor(
                Number(
                    progress.bossKills
                ) || 0
            )
        );
    [
        "chestsFound",
        "commonChestsFound",
        "rareChestsFound",
        "eliteChestsFound"
    ].forEach(counterName => {
        progress[counterName] =
            Math.max(
                0,
                Math.floor(
                    Number(
                        progress[counterName]
                    ) || 0
                )
            );
    });


    if (
        !Array.isArray(
            progress
                .masteryUnlockedMilestones
        )
    ) {
        progress
            .masteryUnlockedMilestones =
            [];
    }

    progress
        .masteryUnlockedMilestones =
        [
            ...new Set(
                progress
                    .masteryUnlockedMilestones
                    .map(value => {
                        return Number(value);
                    })
                    .filter(value => {
                        return (
                            LOCATION_MASTERY_THRESHOLDS
                                .includes(
                                    value
                                )
                        );
                    })
            )
        ].sort(
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

    return progress;
}

function getLocationMasteryPercent(
    locationId = player.location
) {
    const progress =
        ensureLocationProgress(
            locationId
        );

    return Math.min(
        100,
        (
            progress.totalKills /
            LOCATION_MASTERY_REQUIRED_KILLS
        ) *
        100
    );
}

function getLocationMasteryBonuses(
    locationId = player.location
) {
    const masteryPercent =
        getLocationMasteryPercent(
            locationId
        );

    const bonuses = {
        goldBonus: 0,
        experienceBonus: 0,
        lootChanceBonus: 0
    };

    LOCATION_MASTERY_REWARDS
        .filter(reward => {
            return (
                masteryPercent >=
                reward.threshold
            );
        })
        .forEach(reward => {
            Object.entries(
                reward.bonuses
            ).forEach(
                ([
                    bonusName,
                    value
                ]) => {
                    bonuses[bonusName] +=
                        Number(value) || 0;
                }
            );
        });

    return bonuses;
}

function getLocationMasteryBonuses(
    locationId = player.location
) {
    const masteryPercent =
        getLocationMasteryPercent(
            locationId
        );

    const bonuses = {
        goldBonus: 0,
        experienceBonus: 0,
        chestChanceBonus: 0,
        lootChanceBonus: 0
    };

    LOCATION_MASTERY_REWARDS
        .filter(reward => {
            return (
                masteryPercent >=
                reward.threshold
            );
        })
        .forEach(reward => {
            Object.entries(
                reward.bonuses
            ).forEach(
                ([
                    bonusName,
                    value
                ]) => {
                    bonuses[bonusName] +=
                        Number(value) || 0;
                }
            );
        });

    return bonuses;
}

function getCurrentLocationProgress() {
    return ensureLocationProgress(
        player.location
    );
}

function updateLocationMasteryAfterKill(
    defeatedEnemyWasBoss = false,
    defeatedEnemyType = "normal"
) {
    const progress =
        getCurrentLocationProgress();

    progress.totalKills += 1;

    if (
        !defeatedEnemyWasBoss &&
        defeatedEnemyType === "elite"
    ) {
        progress.eliteKills += 1;
    }

    if (defeatedEnemyWasBoss) {
        progress.bossKills += 1;
    }

    const masteryPercent =
        getLocationMasteryPercent(
            player.location
        );

    const newlyUnlockedMilestones =
        LOCATION_MASTERY_THRESHOLDS
            .filter(threshold => {
                return (
                    masteryPercent >=
                    threshold &&
                    !progress
                        .masteryUnlockedMilestones
                        .includes(
                            threshold
                        )
                );
            });

    if (
        newlyUnlockedMilestones
            .length === 0
    ) {
        return;
    }

    const location =
        typeof locations !==
            "undefined"
            ? locations[
            player.location
            ]
            : null;

    const locationName =
        location?.name ||
        "lokacji";

    newlyUnlockedMilestones
        .forEach(threshold => {
            progress
                .masteryUnlockedMilestones
                .push(
                    threshold
                );
            const masteryReward =
                LOCATION_MASTERY_REWARDS
                    .find(reward => {
                        return (
                            reward.threshold ===
                            threshold
                        );
                    });
            const message =
                "Osiągnięto " +
                threshold +
                "% opanowania: " +
                locationName +
                ". Odblokowano: " +
                (
                    masteryReward?.label ||
                    "nową premię"
                ) +
                ".";

            if (
                typeof addCombatLog ===
                "function"
            ) {
                addCombatLog(
                    "🏹 " +
                    message
                );
            }

            if (
                typeof addSystemLog ===
                "function"
            ) {
                addSystemLog(
                    "🏹 " +
                    message,
                    "location"
                );
            }

            if (
                typeof showNotification ===
                "function"
            ) {
                showNotification(
                    message,
                    "success"
                );
            }
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
}
function regenerateMana(amount = 1) {
    const derived = getDerivedStats();

    player.mana = Math.min(
        derived.maxMana,
        player.mana + amount
    );
}