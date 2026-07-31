function processOfflineFishingProgress(
    savedAt,
    currentTime = Date.now()
) {
    ensureFishingState();

    if (!player.fishing.isFishing) {
        return null;
    }

    const area = getFishingArea(
        player.fishing.activeAreaId
    );
    if (!area) {
        return null;
    }

    const baseCycleDurationMs = Math.max(
        1000,
        Number(area.durationSeconds) * 1000
    );
    const cycleProgress =
        calculateOfflineCycleProgress({
            savedAt: savedAt,
            currentTime: currentTime,
            cycleStartedAt:
                player.fishing.cycleStartedAt,
            cycleDurationMs:
                player.fishing.cycleDurationMs,
            baseCycleDurationMs:
                baseCycleDurationMs,
            speedEffect: null
        });

    player.fishing.cycleStartedAt =
        cycleProgress.cycleStartedAt;
    player.fishing.cycleDurationMs =
        cycleProgress.cycleDurationMs;

    if (
        cycleProgress.completedCycles <= 0
    ) {
        return null;
    }

    const completedCycles =
        cycleProgress.completedCycles;
    const selectedBait = getFishingBait(
        player.fishing.selectedBaitId ||
        player.fishing.activeBaitId
    );
    const availableBaitQuantity =
        selectedBait
            ? getFishingBaitQuantity(
                selectedBait.itemId
            )
            : 0;
    const baitedCycles = Math.min(
        completedCycles,
        availableBaitQuantity
    );
    const regularCycles =
        completedCycles - baitedCycles;

    function buildFishingRewards(
        cycleCount,
        bait = null
    ) {
        if (cycleCount <= 0) {
            return [];
        }

        const rareDropCount =
            getOfflineOccurrenceCount(
                cycleCount,
                area.rareChance +
                (bait?.rareChanceBonus || 0)
            );
        const treasureDropCount =
            getOfflineOccurrenceCount(
                cycleCount,
                area.treasureChance +
                (bait?.treasureChanceBonus ||
                    0)
            );
        const sizeMultiplier =
            1 +
            (bait?.sizeBonus || 0) /
            100;
        const groupRewards = [
            ...distributeOfflineDrops(
                area.basicDrops,
                cycleCount,
                "basic",
                "fishingExp"
            ),
            ...distributeOfflineDrops(
                area.rareDrops,
                rareDropCount,
                "rare",
                "fishingExp"
            ),
            ...distributeOfflineDrops(
                area.treasureDrops,
                treasureDropCount,
                "treasure",
                "fishingExp"
            )
        ];

        groupRewards.forEach(reward => {
            if (
                reward.rarityGroup ===
                "treasure"
            ) {
                return;
            }

            const dropDefinition =
                getFishingDropDefinition(
                    reward.itemId,
                    area
                );

            if (dropDefinition) {
                reward.recordSizeCm =
                    Math.round(
                        rollFishingSize(
                            dropDefinition,
                            reward.quantity
                        ) *
                        sizeMultiplier *
                        10
                    ) / 10;
            }
        });

        return groupRewards;
    }

    const rewards = [
        ...buildFishingRewards(
            baitedCycles,
            selectedBait
        ),
        ...buildFishingRewards(
            regularCycles,
            null
        )
    ];

    if (
        selectedBait &&
        baitedCycles > 0
    ) {
        if (
            typeof removeItemFromInventory ===
            "function"
        ) {
            removeItemFromInventory(
                selectedBait.itemId,
                baitedCycles
            );
        } else {
            for (
                let index = 0;
                index < baitedCycles;
                index++
            ) {
                consumeFishingBait(
                    selectedBait.itemId
                );
            }
        }
    }

    player.fishing.activeBaitId =
        getUsableSelectedFishingBait()
            ?.itemId || null;

    let totalItems = 0;
    let totalFishingExp = 0;

    rewards.forEach(reward => {
        addItemToInventory(
            reward.itemId,
            reward.quantity
        );
        totalItems += reward.quantity;
        totalFishingExp +=
            reward.experience *
            reward.quantity;
    });

    recordFishingProgress(
        rewards,
        completedCycles,
        area.id
    );

    const newRecords = rewards.filter(
        reward => {
            return (
                reward.isNewRecord === true
            );
        }
    );

    const levelBefore =
        player.fishing.level;
    addFishingExp(totalFishingExp);

    const summaryStats = [
        {
            label: "Zakończone połowy",
            value: completedCycles
        },
        {
            label: "EXP łowienia",
            value: totalFishingExp,
            prefix: "+"
        },
        {
            label: "Zdobyte przedmioty",
            value: totalItems,
            prefix: "+"
        }
    ];

    if (newRecords.length > 0) {
        summaryStats.push({
            label: "Nowe rekordy",
            value: newRecords.length,
            prefix: "+"
        });
    }

    if (
        selectedBait &&
        baitedCycles > 0
    ) {
        summaryStats.push({
            label:
                "Zużyte przynęty — " +
                (
                    items[
                        selectedBait.itemId
                    ]?.name ||
                    selectedBait.itemId
                ),
            value: baitedCycles
        });
    }

    if (
        player.fishing.level >
        levelBefore
    ) {
        summaryStats.push({
            label:
                "Nowy poziom łowienia",
            value: player.fishing.level
        });
    }

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "🌙 Łowienie offline: " +
            completedCycles +
            " połowów, +" +
            totalItems +
            " przedmiotów i +" +
            totalFishingExp +
            " EXP łowienia.",
            "offline"
        );
    }

    const summaryItemsById = {};
    rewards.forEach(reward => {
        summaryItemsById[reward.itemId] =
            (summaryItemsById[
                reward.itemId
            ] || 0) +
            reward.quantity;
    });

    return {
        durationMilliseconds:
            Math.max(
                0,
                currentTime -
                (Number(savedAt) ||
                    currentTime)
            ),
        sections: [
            {
                icon: "🎣",
                title:
                    "Łowienie — " +
                    area.name,
                stats: summaryStats,
                items: Object.entries(
                    summaryItemsById
                ).map(
                    ([itemId, quantity]) => {
                        return {
                            itemId: itemId,
                            quantity: quantity
                        };
                    }
                )
            }
        ]
    };
}
