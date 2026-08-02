const player = {
    hp: 100,
    mana: 50,

    gold: 0,
    exp: 0,
    expToNextLevel: 120,
    level: 1,
    attributePoints: 0,
    skillPoints: 0,
    skillResetCount: 0,
    classId: null,
    skills: {},
    selectedWarriorCapstone: null,
    selectedHunterCapstone: null,
    selectedMageCapstone: null,
    selectedGuardianCapstone: null,
    selectedRogueCapstone: null,
    systemLog: [],

    journal: {
        bestiary: {},

        achievementPoints: 0,
        totalAchievementPoints: 0,

        lastSeenAchievementAt: 0,

        unlockedAchievements: {}
    },

    selectedSpells: {
        offensive: null,
        defensive: null
    },

    spellCooldowns: {},

    activeEffects: {
        arcaneBarrierUntil: 0,
        manaShieldUntil: 0,
        regenerationUntil: 0,
        regenerationNextTickAt: 0,
        regenerationTickMilliseconds: 1000,
        regenerationHealingPerTick: 0,
        mirrorImageUntil: 0,
        mirrorImageCharges: 0,

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

    fishing: {
        level: 1,
        exp: 0,
        expToNextLevel: 225,
        isFishing: false,
        selectedAreaId: "forest_pond",
        activeAreaId: null,
        selectedBaitId: null,
        activeBaitId: null,
        cycleStartedAt: 0,
        cycleDurationMs: 0,
        lastResult: null
    },

    cooking: {
        level: 1,
        exp: 0,
        expToNextLevel: 100,
        statistics: {
            totalMealsCooked: 0,
            mealsByItem: {},
            recipesById: {}
        },
        tavern: {
            level: 1,
            reputation: 0,
            reputationToNextLevel: 5,
            completedOrders: 0,
            totalGoldEarned: 0,
            nextOrderSequence: 1,
            activeOrders: []
        },
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

    professionTools: {
    pickaxe: null,
    sickle: null,
    fishingRod: null,
    alchemyKit: null,
    cookingTools: null,
    craftingHammer: null
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
    },

    equipmentLoadouts: {
        combat: null,
        mining: null,
        herbalism: null,
        hunting: null
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

        lastSeenAchievementAt: 0,

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

    player.fishing = {
        level: 1,
        exp: 0,
        expToNextLevel: 225,
        isFishing: false,
        selectedAreaId: "forest_pond",
        activeAreaId: null,
        selectedBaitId: null,
        activeBaitId: null,
        cycleStartedAt: 0,
        cycleDurationMs: 0,
        lastResult: null
    };

    player.cooking = {
        level: 1,
        exp: 0,
        expToNextLevel: 100,
        statistics: {
            totalMealsCooked: 0,
            mealsByItem: {},
            recipesById: {}
        },
        tavern: {
            level: 1,
            reputation: 0,
            reputationToNextLevel: 5,
            completedOrders: 0,
            totalGoldEarned: 0,
            nextOrderSequence: 1,
            activeOrders: []
        },
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
    player.selectedWarriorCapstone =
        null;
    player.selectedHunterCapstone =
        null;
    player.selectedMageCapstone =
        null;
    player.selectedGuardianCapstone =
        null;
    player.selectedRogueCapstone =
        null;

    player.selectedSpells = {
        offensive: null,
        defensive: null
    };

    player.spellCooldowns = {};

    player.activeEffects = {
        arcaneBarrierUntil: 0,
        manaShieldUntil: 0,
        regenerationUntil: 0,
        regenerationNextTickAt: 0,
        regenerationTickMilliseconds: 1000,
        regenerationHealingPerTick: 0,
        mirrorImageUntil: 0,
        mirrorImageCharges: 0,

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
    player.skillResetCount = 0;
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

    player.professionTools = {
    pickaxe: null,
    sickle: null,
    fishingRod: null,
    alchemyKit: null,
    cookingTools: null,
    craftingHammer: null
};

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

    player.equipmentLoadouts = {
        combat: null,
        mining: null,
        herbalism: null,
        hunting: null
    };

    const derived = getDerivedStats();

    player.hp = derived.maxHp;
    player.mana = derived.maxMana;

    console.log("resetPlayer wykonany:", player);
}


function getExpToNextLevel(level) {
    const normalizedLevel =
        Math.max(
            1,
            Math.floor(
                Number(level) || 1
            )
        );

    const levelIndex =
        normalizedLevel - 1;

    const lateGameIndex =
        Math.max(
            0,
            levelIndex - 20
        );

    /*
     * Podstawowa krzywa EXP.
     * Do 10. poziomu pozostaje bez zmian.
     */
    const baseRequirement =
        120 +
        levelIndex * 80 +
        Math.pow(
            levelIndex,
            1.55
        ) * 35 +
        Math.pow(
            lateGameIndex,
            2
        ) * 15;

    /*
     * Po odblokowaniu klasy każdy kolejny
     * poziom dodatkowo zwiększa wymagania.
     *
     * Poziom 10: mnożnik x1
     * Poziom 20: mnożnik x10
     * Poziom 50: mnożnik x37
     */
    const progressionMultiplier =
        1 +
        Math.max(
            0,
            normalizedLevel - 10
        ) *
        0.9;

    return Math.floor(
        baseRequirement *
        progressionMultiplier
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
