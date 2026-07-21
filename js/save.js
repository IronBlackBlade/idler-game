
const SAVE_VERSION = 1;

const VALID_ACTIVITY_TYPES = [
    "alchemy",
    "mining",
    "herbalism",
    "combat"
];

/*
 * Zwraca wszystkie czynności zapisane jako aktywne.
 * Tablica jest też zabezpieczeniem na wypadek starego
 * lub uszkodzonego zapisu z kilkoma czynnościami naraz.
 */
function getActivityTypesFromState(
    playerState,
    fightingState
) {
    if (
        !playerState ||
        typeof playerState !== "object"
    ) {
        return fightingState === true
            ? ["combat"]
            : [];
    }

    return [
        playerState.alchemy?.isCrafting
            ? "alchemy"
            : null,

        playerState.mining?.isMining
            ? "mining"
            : null,

        playerState.herbalism?.isGathering
            ? "herbalism"
            : null,

        fightingState === true ||
        playerState.isFighting === true
            ? "combat"
            : null
    ].filter(Boolean);
}

function getCurrentActivityTypeForSave() {
    const activeActivities =
        getActivityTypesFromState(
            player,
            typeof isFighting !== "undefined" &&
                isFighting === true
        );

    return activeActivities[0] || null;
}

/*
 * Pierwsza migracja nie zmienia postępu gracza.
 * Dopisuje jedynie brakujące informacje potrzebne
 * nowemu systemowi zapisu.
 */
function migrateSaveData(saveData) {
    const migratedSaveData =
        saveData && typeof saveData === "object"
            ? saveData
            : {};

    const savedVersion = Number.isInteger(
        migratedSaveData.saveVersion
    )
        ? migratedSaveData.saveVersion
        : 0;

    if (savedVersion < 1) {
        const legacyActivities =
            getActivityTypesFromState(
                migratedSaveData.player,
                migratedSaveData.isFighting === true
            );

        migratedSaveData.currentActivity =
            legacyActivities[0] || null;
    }

    migratedSaveData.saveVersion =
        SAVE_VERSION;

    return migratedSaveData;
}

function resolveLoadedActivityType(saveData) {
    const activeActivities =
        getActivityTypesFromState(
            saveData.player,
            saveData.isFighting === true
        );

    const savedActivity =
        VALID_ACTIVITY_TYPES.includes(
            saveData.currentActivity
        ) &&
        activeActivities.includes(
            saveData.currentActivity
        )
            ? saveData.currentActivity
            : activeActivities[0] || null;

    if (activeActivities.length > 1) {
        console.warn(
            "Zapis zawierał kilka aktywnych czynności. Przywrócono tylko:",
            savedActivity
        );
    }

    return savedActivity;
}

/*
 * Po wczytaniu pozostawiamy aktywną tylko jedną czynność.
 * Dzięki temu stary zapis nie uruchomi kilku timerów naraz.
 */
function normalizeLoadedActivityState(
    activityType
) {
    const isMining =
        activityType === "mining";

    const isGathering =
        activityType === "herbalism";

    const isCrafting =
        activityType === "alchemy";

    const isCombat =
        activityType === "combat";

    if (player.mining) {
        player.mining.isMining =
            isMining;

        if (!isMining) {
            player.mining.activeAreaId = null;
            player.mining.cycleStartedAt = 0;
            player.mining.cycleDurationMs = 0;
        }
    }

    if (player.herbalism) {
        player.herbalism.isGathering =
            isGathering;

        if (!isGathering) {
            player.herbalism.activeAreaId = null;
            player.herbalism.cycleStartedAt = 0;
            player.herbalism.cycleDurationMs = 0;
        }
    }

    if (player.alchemy) {
        player.alchemy.isCrafting =
            isCrafting;

        if (!isCrafting) {
            player.alchemy.activeJobId = null;
            player.alchemy.activeRecipeId = null;
            player.alchemy.craftingStartedAt = 0;
            player.alchemy.craftingDurationMs = 0;
            player.alchemy.craftingFinishesAt = 0;
        }
    }

    isFighting = isCombat;
    player.isFighting = isCombat;
}

function resumeLoadedActivity(activityType) {
    if (
        activityType === "mining" &&
        typeof resumeMining === "function"
    ) {
        resumeMining();
        return;
    }

    if (
        activityType === "herbalism" &&
        typeof resumeHerbalism === "function"
    ) {
        resumeHerbalism();
        return;
    }

    if (
        activityType === "alchemy" &&
        typeof resumeAlchemyCrafting === "function"
    ) {
        resumeAlchemyCrafting();
        return;
    }

    if (
        activityType === "combat" &&
        typeof startFight === "function"
    ) {
        startFight();
    }
}

// pierwsze wyświetlenie
render();


function saveGame() {
    
    const questProgress = quests.map(quest => {
        return {
            id: quest.id,
            currentKills: quest.currentKills || 0,
            completed: quest.completed === true,
            claimed: quest.claimed === true
        };
    });

const saveData = {
    saveVersion: SAVE_VERSION,
    currentActivity:
        getCurrentActivityTypeForSave(),

    player: player,
    enemy: enemy,
    quests: questProgress,

    combatLogMessages:
        typeof combatLogMessages !==
            "undefined" &&
        Array.isArray(
            combatLogMessages
        )
            ? combatLogMessages.slice(
                -30
            )
            : [],

    time: Date.now(),
    isFighting: isFighting
};

    localStorage.setItem(
        "idler_save",
        JSON.stringify(saveData)
    );

    console.log("💾 Gra zapisana");
}
function loadGame() {
    const savedJson = localStorage.getItem("idler_save");

    if (!savedJson) {
        return;
    }

    let saveData;

    try {
        saveData = migrateSaveData(
            JSON.parse(savedJson)
        );
    } catch (error) {
        console.error("Nie udało się odczytać zapisu gry:", error);
        return;
    }

    if (saveData.player) {
        Object.assign(player, saveData.player);
    }

    if (saveData.enemy) {
        Object.assign(enemy, saveData.enemy);
    }

    if (
    typeof combatLogMessages !==
        "undefined" &&
    Array.isArray(
        combatLogMessages
    )
) {
    /*
     * Czyścimy obecną tablicę bez
     * tworzenia nowej. Zadziała również,
     * gdy tablica została utworzona
     * przez const.
     */
    combatLogMessages.length = 0;

    if (
        Array.isArray(
            saveData.combatLogMessages
        )
    ) {
        combatLogMessages.push(
            ...saveData
                .combatLogMessages
                .slice(-30)
        );
    }
}

    if (!Array.isArray(player.systemLog)) {
        player.systemLog = [];
    }

    if (!Array.isArray(player.timedEffects)) {
        player.timedEffects = [];
    }

    if (
        typeof removeExpiredTimedEffects ===
        "function"
    ) {
        removeExpiredTimedEffects();
    }

if (
    typeof ensureMiningState ===
        "function"
) {
    ensureMiningState();
}

if (
    typeof ensureHerbalismState ===
        "function"
) {
    ensureHerbalismState();
}

if (
    typeof ensureAlchemyState ===
        "function"
) {
    ensureAlchemyState();
}

if (
    typeof ensureCraftingState ===
        "function"
) {
    ensureCraftingState();
}

const loadedActivityType =
    resolveLoadedActivityType(
        saveData
    );

normalizeLoadedActivityState(
    loadedActivityType
);

    // Przywracanie postępu zadań
    if (Array.isArray(saveData.quests)) {
        saveData.quests.forEach(savedQuest => {
            const currentQuest = quests.find(quest => {
                return quest.id === savedQuest.id;
            });

            if (!currentQuest) {
                return;
            }

            currentQuest.currentKills =
                savedQuest.currentKills || 0;

            currentQuest.completed =
                savedQuest.completed === true;

            currentQuest.claimed =
                savedQuest.claimed === true;

            if (
                currentQuest.currentKills >
                currentQuest.requiredKills
            ) {
                currentQuest.currentKills =
                    currentQuest.requiredKills;
            }
        });
    }

    // Zgodność ze starszymi zapisami
    if (player.skillPoints === undefined) {
        player.skillPoints = 0;
    }

    if (player.attributePoints === undefined) {
        player.attributePoints = 0;
    }

    if (!player.skills) {
        player.skills = {};
    }

    if (!player.selectedSpells) {
        player.selectedSpells = {
            offensive: null,
            defensive: null
        };
    }

    if (!player.spellCooldowns) {
    player.spellCooldowns = {};
}

if (!player.activeEffects) {
    player.activeEffects = {
        arcaneBarrierUntil: 0
    };
}

if (player.activeEffects.arcaneBarrierUntil === undefined) {
    player.activeEffects.arcaneBarrierUntil = 0;
}

if (
    !player.activeEffects.potionEffects ||
    typeof player.activeEffects.potionEffects !==
        "object"
) {
    player.activeEffects.potionEffects = {};
}

const oldCombatDamageEffect =
    player.activeEffects.potionEffects[
        "combat_damage"
    ];

if (
    oldCombatDamageEffect &&
    !player.activeEffects.potionEffects[
        "melee_weapon_damage"
    ]
) {
    player.activeEffects.potionEffects[
        "melee_weapon_damage"
    ] = oldCombatDamageEffect;
}

delete player.activeEffects
    .potionEffects[
        "combat_damage"
    ];

    if (!player.inventory) {
        player.inventory = [];
    }

if (
    !player.lockedInventoryItems ||
    typeof player.lockedInventoryItems !==
        "object" ||
    Array.isArray(
        player.lockedInventoryItems
    )
) {
    player.lockedInventoryItems = {};
}

    if (!player.unlockedRecipes) {
        player.unlockedRecipes = [];
    }

    if (!player.locationProgress) {
        player.locationProgress = {};
    }

player.level = Math.max(
    1,
    Math.floor(
        player.level || 1
    )
);

player.expToNextLevel =
    getExpToNextLevel(
        player.level
    );

    const derived = getDerivedStats();

    if (player.hp === undefined) {
        player.hp = derived.maxHp;
    }

    if (player.hp > derived.maxHp) {
        player.hp = derived.maxHp;
    }

    if (player.mana === undefined) {
        player.mana = derived.maxMana;
    }

    if (player.mana > derived.maxMana) {
        player.mana = derived.maxMana;
    }

    const saveTime = saveData.time || Date.now();

    const offlineSeconds = Math.max(
        0,
        Math.floor(
            (Date.now() - saveTime) / 1000
        )
    );

if (offlineSeconds > 0) {
    symulujOffline(
        offlineSeconds,
        loadedActivityType
    );
}

if (
    typeof checkLevelUp ===
    "function"
) {
    checkLevelUp();
}

render();

if (
    typeof renderCombatLog ===
        "function"
) {
    renderCombatLog();
}

resumeLoadedActivity(
    loadedActivityType
);

}



function startAutoSave() {
    setInterval(() => {
        saveGame();
    }, 5000);
}

function symulujOffline(
    sekundy,
    activityType =
        getCurrentActivityTypeForSave()
) {
    /*
     * Na tym etapie postęp offline walki
     * naliczamy wyłącznie wtedy, gdy gracz
     * naprawdę zapisał aktywną walkę.
     */
    if (activityType !== "combat") {
        return;
    }

    const dmgNaSekunde = getAttack();

    let hp = enemy.hp;
    let gold = 0;
    let exp = 0;

    for (let i = 0; i < sekundy; i++) {
        hp -= dmgNaSekunde;

        if (hp <= 0) {
            gold += enemy.gold;
            exp += enemy.exp;

            spawnEnemy();
            hp = enemy.hp;
        }
    }

    player.gold += gold;
    player.exp += exp;

        if (
        typeof addSystemLog === "function" &&
        (gold > 0 || exp > 0)
    ) {
        const minutesOffline =
            Math.max(
                1,
                Math.floor(sekundy / 60)
            );

        addSystemLog(
            "🌙 Postęp offline za około " +
            minutesOffline +
            " min: +" +
            gold +
            " złota i +" +
            exp +
            " EXP.",
            "offline"
        );
    }

    console.log("💰 Offline: +" + gold + " złota, +" + exp + " EXP");
}

function resetGame() {
    if (typeof stopMining === "function") {
        stopMining(false);
    }

    stopFight();

    localStorage.removeItem("idler_save");
    localStorage.removeItem("idler_current_screen");

    localStorage.removeItem(
    "idler_hero_tab"
);

localStorage.removeItem(
    "idler_inventory_filter"
);

    resetPlayer();

    player.level = 1;
    player.exp = 0;
    player.expToNextLevel =
    getExpToNextLevel(1);
    player.gold = 0;

    if (typeof resetEnemy === "function") {
        resetEnemy();
    }

    if (typeof resetQuests === "function") {
        resetQuests();
    }

    localStorage.setItem("idler_current_screen", "screen-hunting");

    if (
    typeof combatLogMessages !==
        "undefined" &&
    Array.isArray(
        combatLogMessages
    )
) {
    combatLogMessages.length = 0;
}

if (
    typeof renderCombatLog ===
        "function"
) {
    renderCombatLog();
}

    saveGame();

    render();
    showScreen("screen-hunting");

    console.log("RESET:", {
        level: player.level,
        exp: player.exp,
        expToNextLevel: player.expToNextLevel
    });
}

    

function zapiszGre() {
    saveGame();
}

function wczytajGre() {
    loadGame();
}
