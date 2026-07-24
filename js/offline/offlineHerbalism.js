function processOfflineHerbalismProgress(
    savedAt,
    currentTime = Date.now()
) {
    ensureHerbalismState();

    if (!player.herbalism.isGathering) {
        return null;
    }

    const area = getHerbalismArea(
        player.herbalism.activeAreaId
    );

    if (!area) {
        return null;
    }

    const baseCycleDurationMs = Math.max(
        1000,
        Number(area.durationSeconds) * 1000
    );

    const herbalismSpeedEffect =
        player.activeEffects
            ?.potionEffects
            ?.herbalism_speed || null;

    const cycleProgress =
        calculateOfflineCycleProgress({
            savedAt: savedAt,
            currentTime: currentTime,

            cycleStartedAt:
                player.herbalism
                    .cycleStartedAt,

            cycleDurationMs:
                player.herbalism
                    .cycleDurationMs,

            baseCycleDurationMs:
                baseCycleDurationMs,

            speedEffect:
                herbalismSpeedEffect
        });

    player.herbalism.cycleStartedAt =
        cycleProgress.cycleStartedAt;

    player.herbalism.cycleDurationMs =
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
            "herbalismExp"
        ),

        ...distributeOfflineDrops(
            area.rareDrops,
            rareDropCount,
            "rare",
            "herbalismExp"
        ),

        ...distributeOfflineDrops(
            area.exceptionalDrops,
            exceptionalDropCount,
            "exceptional",
            "herbalismExp"
        )
    ];

    let totalItems = 0;
    let totalHerbalismExp = 0;

    rewards.forEach(reward => {
        addItemToInventory(
            reward.itemId,
            reward.quantity
        );

        totalItems +=
            reward.quantity;

        totalHerbalismExp +=
            reward.experience *
            reward.quantity;
    });

    const levelBefore =
        player.herbalism.level;

    addHerbalismExp(
        totalHerbalismExp
    );

    const summaryStats = [
        {
            label: "Ukończone cykle",
            value:
                cycleProgress
                    .completedCycles
        },
        {
            label: "EXP zielarstwa",
            value: totalHerbalismExp,
            prefix: "+"
        },
        {
            label: "Zdobyte składniki",
            value: totalItems,
            prefix: "+"
        }
    ];

    if (
        player.herbalism.level >
        levelBefore
    ) {
        summaryStats.push({
            label:
                "Nowy poziom zielarstwa",

            value:
                player.herbalism.level
        });
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "🌙 Zielarstwo offline: " +
            cycleProgress.completedCycles +
            " cykli, +" +
            totalItems +
            " składników i +" +
            totalHerbalismExp +
            " EXP zielarstwa.",
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
                icon: "🌿",

                title:
                    "Zielarstwo — " +
                    area.name,

                stats: summaryStats,

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
