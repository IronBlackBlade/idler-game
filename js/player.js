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
    combatCooldownUntil: 0,
    locationChangeCooldownUntil: 0,

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
    player.combatCooldownUntil = 0;
    player.locationChangeCooldownUntil = 0;
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




function regenerateMana(amount = 1) {
    const derived = getDerivedStats();

    player.mana = Math.min(
        derived.maxMana,
        player.mana + amount
    );
}