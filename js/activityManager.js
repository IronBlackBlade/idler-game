const ACTIVITY_TYPES = Object.freeze({
    COMBAT: "combat",
    MINING: "mining",
    HERBALISM: "herbalism",
    FISHING: "fishing",
    ALCHEMY: "alchemy"
});

const PRIMARY_ACTIVITY_TYPES =
    Object.freeze([
        ACTIVITY_TYPES.COMBAT,
        ACTIVITY_TYPES.MINING,
        ACTIVITY_TYPES.HERBALISM,
        ACTIVITY_TYPES.FISHING
    ]);


function stopActivity(
    activityType,
    writeLog = false
) {
    if (
        activityType ===
        ACTIVITY_TYPES.COMBAT &&
        typeof stopFight === "function" &&
        typeof isFighting !== "undefined" &&
        isFighting
    ) {
        stopFight();
        return true;
    }

    if (
        activityType ===
        ACTIVITY_TYPES.MINING &&
        typeof stopMining === "function" &&
        player.mining?.isMining
    ) {
        stopMining(writeLog);
        return true;
    }

    if (
        activityType ===
        ACTIVITY_TYPES.HERBALISM &&
        typeof stopHerbalism === "function" &&
        player.herbalism?.isGathering
    ) {
        stopHerbalism(writeLog);
        return true;
    }

    if (
        activityType ===
        ACTIVITY_TYPES.FISHING &&
        typeof stopFishing === "function" &&
        player.fishing?.isFishing
    ) {
        stopFishing(writeLog);
        return true;
    }

    if (
        activityType ===
        ACTIVITY_TYPES.ALCHEMY &&
        typeof cancelAlchemyActivity ===
        "function" &&
        (
            player.alchemy?.isCrafting ||
            player.alchemy?.queue?.length > 0
        )
    ) {
        /*
         * Alchemia ma szczególną zasadę:
         * anulowanie zwraca zużyte składniki.
         */
        cancelAlchemyActivity(
            writeLog
        );

        return true;
    }

    return false;
}

function prepareActivityStart(
    nextActivityType
) {
    if (
        !PRIMARY_ACTIVITY_TYPES.includes(
            nextActivityType
        )
    ) {
        console.warn(
            "Nieznany typ aktywności głównej:",
            nextActivityType
        );

        return false;
    }

    /*
     * Zatrzymujemy tylko inne aktywności
     * główne. Alchemia nadal pracuje w tle.
     */
    PRIMARY_ACTIVITY_TYPES
        .filter(activityType => {
            return (
                activityType !==
                nextActivityType
            );
        })
        .forEach(activityType => {
            stopActivity(
                activityType,
                false
            );
        });

    return true;
}
