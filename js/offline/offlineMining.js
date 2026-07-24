function processOfflineMiningProgress(
    savedAt,
    currentTime = Date.now()
) {
    ensureMiningState();

    if (!player.mining.isMining) {
        return null;
    }

    const area =
        getMiningArea(
            player.mining.activeAreaId
        );

    if (!area) {
        return null;
    }

    const baseCycleDurationMs =
        Math.max(
            1000,
            Number(area.durationSeconds) *
            1000
        );

    const miningSpeedEffect =
        player.activeEffects
            ?.potionEffects
            ?.mining_speed ||
        null;

    const cycleProgress =
        calculateOfflineCycleProgress({
            savedAt: savedAt,
            currentTime: currentTime,

            cycleStartedAt:
                player.mining
                    .cycleStartedAt,

            cycleDurationMs:
                player.mining
                    .cycleDurationMs,

            baseCycleDurationMs:
                baseCycleDurationMs,

            speedEffect:
                miningSpeedEffect
        });

    /*
     * Zachowujemy rozpoczętą część
     * następnego cyklu.
     */
    player.mining.cycleStartedAt =
        cycleProgress.cycleStartedAt;

    player.mining.cycleDurationMs =
        cycleProgress.cycleDurationMs;

    if (
        cycleProgress.completedCycles <= 0
    ) {
        return null;
    }

    const basicDropCount =
        cycleProgress.completedCycles;

    const rareDropCount =
        getOfflineOccurrenceCount(
            cycleProgress.completedCycles,
            area.rareChance
        );

    const exceptionalDropCount =
        getOfflineOccurrenceCount(
            cycleProgress.completedCycles,
            area.exceptionalChance
        );

    const rewards = [
        ...distributeOfflineDrops(
            area.basicDrops,
            basicDropCount,
            "basic",
            "miningExp"
        ),

        ...distributeOfflineDrops(
            area.rareDrops,
            rareDropCount,
            "rare",
            "miningExp"
        ),

        ...distributeOfflineDrops(
            area.exceptionalDrops,
            exceptionalDropCount,
            "exceptional",
            "miningExp"
        )
    ];

    let totalItems = 0;
    let totalMiningExp = 0;

    rewards.forEach(reward => {
        addItemToInventory(
            reward.itemId,
            reward.quantity
        );

        totalItems +=
            reward.quantity;

        totalMiningExp +=
            reward.experience *
            reward.quantity;
    });

if (
    typeof recordHerbalismProgress ===
        "function"
) {
    recordHerbalismProgress(
        rewards,
        cycleProgress.completedCycles
    );
}

if (
    typeof updateQuestMenuHighlight ===
        "function"
) {
    updateQuestMenuHighlight();
}

    if (
        typeof recordMiningProgress ===
        "function"
    ) {
        recordMiningProgress(
            rewards,
            cycleProgress.completedCycles
        );
    }

    if (
    typeof updateQuestMenuHighlight ===
        "function"
) {
    updateQuestMenuHighlight();
}

    const levelBefore =
        player.mining.level;

    addMiningExp(totalMiningExp);

    const summaryStats = [
        {
            label: "Ukończone cykle",

            value:
                cycleProgress
                    .completedCycles
        },
        {
            label: "EXP kopania",
            value: totalMiningExp,
            prefix: "+"
        },
        {
            label: "Zdobyte surowce",
            value: totalItems,
            prefix: "+"
        }
    ];

    if (
        player.mining.level >
        levelBefore
    ) {
        summaryStats.push({
            label: "Nowy poziom kopania",
            value:
                player.mining.level
        });
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "🌙 Kopalnia offline: " +
            cycleProgress.completedCycles +
            " cykli, +" +
            totalItems +
            " surowców i +" +
            totalMiningExp +
            " EXP kopania.",
            "offline"
        );
    }

    return {
        durationMilliseconds:
            Math.max(
                0,
                currentTime -
                (
                    Number(savedAt) ||
                    currentTime
                )
            ),

        sections: [
            {
                icon: "⛏️",

                title:
                    "Kopalnia — " +
                    area.name,

                stats:
                    summaryStats,

                items:
                    rewards.map(
                        reward => {
                            return {
                                itemId:
                                    reward.itemId,

                                quantity:
                                    reward.quantity
                            };
                        }
                    )
            }
        ]
    };
}