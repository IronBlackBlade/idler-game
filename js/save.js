function saveGame() {

    if (
        window
            .idlerShouldReloadAfterBackground ===
        true ||
        window
            .idlerIsReloadingAfterBackground ===
        true ||
        (
            document.visibilityState ===
            "hidden" &&
            Number(
                window
                    .idlerBackgroundStartedAt
            ) > 0
        )
    ) {
        return;
    }

    if (
        typeof checkJournalAchievements ===
        "function"
    ) {
        checkJournalAchievements();
    }

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

    const loadedLocation =
        typeof locations !==
            "undefined"
            ? locations[
            player.location
            ]
            : null;

    const loadedPlayerLevel =
        Math.max(
            1,
            Math.floor(
                Number(player.level) ||
                1
            )
        );

    const loadedRequiredLevel =
        Math.max(
            1,
            Number(
                loadedLocation
                    ?.requiredLevel
            ) || 1
        );

    if (
        !loadedLocation ||
        loadedPlayerLevel <
        loadedRequiredLevel
    ) {
        player.location =
            "forest";

        player.isFighting =
            false;

        player.isBossFight =
            false;

        if (saveData.player) {
            saveData.player.location =
                "forest";

            saveData.player.isFighting =
                false;

            saveData.player.isBossFight =
                false;
        }

        saveData.isFighting =
            false;

        if (
            saveData.currentActivity ===
            "combat"
        ) {
            saveData.currentActivity =
                null;
        }
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

    const saveTime =
        saveData.time || Date.now();

    const offlineSeconds = Math.max(
        0,
        Math.floor(
            (Date.now() - saveTime) / 1000
        )
    );

    let offlineSummary = null;

    if (offlineSeconds > 0) {
        offlineSummary =
            simulateOfflineProgress(
                offlineSeconds,
                loadedActivityType,
                saveTime
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

    if (offlineSummary) {
        /*
         * Od razu utrwalamy nagrody,
         * aby odświeżenie strony nie
         * naliczyło ich ponownie.
         */
        saveGame();

        if (
            typeof showOfflineSummary ===
            "function"
        ) {
            showOfflineSummary(
                offlineSummary
            );
        }
    }

}

function startAutoSave() {
    setInterval(() => {
        saveGame();
    }, 5000);
}


function resetGame() {
    if (typeof stopMining === "function") {
        stopMining(false);
    }

    stopFight(false);

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
