const ACTIVITY_TYPES = Object.freeze({
    COMBAT: "combat",
    MINING: "mining",
    HERBALISM: "herbalism",
    ALCHEMY: "alchemy"
});

/*
 * Zatrzymuje jedną wskazaną czynność.
 * Każdy system nadal sam odpowiada za swoje
 * timery, zapis i dodatkowe zasady zatrzymania.
 */
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

/*
 * Przygotowuje grę do rozpoczęcia nowej czynności.
 * Nie uruchamia jej jeszcze — robi to odpowiedni
 * system, na przykład startMining().
 */
function prepareActivityStart(
    nextActivityType
) {
    if (
        !Object.values(
            ACTIVITY_TYPES
        ).includes(nextActivityType)
    ) {
        console.warn(
            "Nieznany typ czynności:",
            nextActivityType
        );

        return false;
    }

    Object.values(ACTIVITY_TYPES)
        .filter(activityType => {
            return (
                activityType !==
                nextActivityType
            );
        })
        .forEach(activityType => {
            const shouldWriteLog =
                activityType ===
                ACTIVITY_TYPES.ALCHEMY;

            stopActivity(
                activityType,
                shouldWriteLog
            );
        });

    return true;
}
