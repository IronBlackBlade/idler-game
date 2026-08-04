const SAVE_VERSION = 1;

const VALID_ACTIVITY_TYPES = [
    "mining",
    "herbalism",
    "fishing",
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
        playerState.mining?.isMining
            ? "mining"
            : null,

        playerState.herbalism?.isGathering
            ? "herbalism"
            : null,

        playerState.fishing?.isFishing
            ? "fishing"
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

    const isFishing =
        activityType === "fishing";

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

    if (player.fishing) {
        player.fishing.isFishing =
            isFishing;

        if (!isFishing) {
            player.fishing.activeAreaId = null;
            player.fishing.activeBaitId = null;
            player.fishing.cycleStartedAt = 0;
            player.fishing.cycleDurationMs = 0;
        }
    }

    isFighting = isCombat;
    player.isFighting = isCombat;
}

function resumeLoadedActivity(
    activityType
) {
    if (
        typeof resumeAlchemyCrafting ===
        "function"
    ) {
        resumeAlchemyCrafting();
    }

    if (
        activityType === "mining" &&
        typeof resumeMining ===
            "function"
    ) {
        resumeMining();
        return;
    }

    if (
        activityType === "herbalism" &&
        typeof resumeHerbalism ===
            "function"
    ) {
        resumeHerbalism();
        return;
    }

    if (
        activityType === "fishing" &&
        typeof resumeFishing ===
            "function"
    ) {
        resumeFishing();
        return;
    }

    if (
        activityType === "combat" &&
        typeof startFight ===
            "function"
    ) {
        startFight();
    }
}

// pierwsze wyświetlenie
render();
