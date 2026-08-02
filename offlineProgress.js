function calculateOfflineCycleProgress({
    savedAt,
    currentTime,
    cycleStartedAt,
    cycleDurationMs,
    baseCycleDurationMs,
    speedEffect,
    persistentSpeedBonus = 0
}) {
    const now =
        Number(currentTime) ||
        Date.now();

    const savedTime =
        Math.min(
            now,
            Number(savedAt) || now
        );

    const baseDuration =
        Math.max(
            1000,
            Number(baseCycleDurationMs) ||
            1000
        );

    const savedCycleDuration =
        Math.max(
            1000,
            Number(cycleDurationMs) ||
            baseDuration
        );

    const savedCycleStartedAt =
        Math.min(
            savedTime,
            Number(cycleStartedAt) ||
            savedTime
        );

    const workBeforeSave =
        Math.max(
            0,
            savedTime -
            savedCycleStartedAt
        ) /
        savedCycleDuration *
        baseDuration;

    const offlineDuration =
        Math.max(
            0,
            now - savedTime
        );

    const effectBonus =
        Math.max(
            0,
            Number(speedEffect?.value) ||
            0
        );

    const safePersistentSpeedBonus =
        Math.max(
            0,
            Number(
                persistentSpeedBonus
            ) || 0
        );

    const effectStartedAt =
        Math.max(
            savedTime,
            Number(speedEffect?.startedAt) ||
            savedTime
        );

    const effectExpiresAt =
        Number(speedEffect?.expiresAt) ||
        0;

    const boostedDuration =
        effectBonus > 0
            ? Math.max(
                0,
                Math.min(
                    now,
                    effectExpiresAt
                ) -
                effectStartedAt
            )
            : 0;

    const totalWork =
        workBeforeSave +
        offlineDuration *
        (
            1 +
            safePersistentSpeedBonus /
            100
        ) +
        boostedDuration *
        effectBonus /
        100;

    const completedCycles =
        Math.max(
            0,
            Math.floor(
                totalWork /
                baseDuration
            )
        );

    const remainingWork =
        totalWork -
        completedCycles *
        baseDuration;

    const currentEffectBonus =
        safePersistentSpeedBonus +
        (
            effectExpiresAt > now
                ? effectBonus
                : 0
        );

    const currentCycleDuration =
        Math.max(
            1000,
            Math.round(
                baseDuration /
                (
                    1 +
                    currentEffectBonus /
                    100
                )
            )
        );

    const remainingProgress =
        Math.max(
            0,
            Math.min(
                1,
                remainingWork /
                baseDuration
            )
        );

    return {
        completedCycles:
            completedCycles,

        cycleDurationMs:
            currentCycleDuration,

        cycleStartedAt:
            now -
            remainingProgress *
            currentCycleDuration
    };
}

function getOfflineOccurrenceCount(
    cycleCount,
    chancePercent = 100
) {
    const safeCycleCount =
        Math.max(
            0,
            Math.floor(
                Number(cycleCount) || 0
            )
        );

    const safeChance =
        Math.max(
            0,
            Math.min(
                100,
                Number(chancePercent) || 0
            )
        );

    const expectedCount =
        safeCycleCount *
        safeChance /
        100;

    const guaranteedCount =
        Math.floor(expectedCount);

    const fractionalChance =
        expectedCount -
        guaranteedCount;

    return (
        guaranteedCount +
        (
            Math.random() <
                fractionalChance
                ? 1
                : 0
        )
    );
}

function distributeOfflineDrops(
    dropList,
    dropCount,
    rarityGroup,
    experienceProperty
) {
    const safeDropCount =
        Math.max(
            0,
            Math.floor(
                Number(dropCount) || 0
            )
        );

    if (
        !Array.isArray(dropList) ||
        dropList.length === 0 ||
        safeDropCount <= 0
    ) {
        return [];
    }

    const totalWeight =
        dropList.reduce(
            (sum, drop) => {
                return (
                    sum +
                    Math.max(
                        0,
                        Number(drop.weight) || 0
                    )
                );
            },
            0
        );

    if (totalWeight <= 0) {
        const firstDrop =
            dropList[0];

        return [
            {
                itemId:
                    firstDrop.itemId,

                rarityGroup:
                    rarityGroup,

                experience:
                    Number(
                        firstDrop[
                        experienceProperty
                        ]
                    ) || 0,

                quantity:
                    safeDropCount
            }
        ];
    }

    const distributedDrops =
        dropList.map(drop => {
            const weight =
                Math.max(
                    0,
                    Number(drop.weight) || 0
                );

            const exactQuantity =
                safeDropCount *
                weight /
                totalWeight;

            const quantity =
                Math.floor(
                    exactQuantity
                );

            return {
                itemId:
                    drop.itemId,

                rarityGroup:
                    rarityGroup,

                experience:
                    Number(
                        drop[
                        experienceProperty
                        ]
                    ) || 0,

                quantity:
                    quantity,

                remainder:
                    exactQuantity -
                    quantity
            };
        });

    let remainingDrops =
        safeDropCount -
        distributedDrops.reduce(
            (sum, drop) => {
                return (
                    sum +
                    drop.quantity
                );
            },
            0
        );

    while (remainingDrops > 0) {
        const totalRemainder =
            distributedDrops.reduce(
                (sum, drop) => {
                    return (
                        sum +
                        drop.remainder
                    );
                },
                0
            );

        let selectedDrop =
            distributedDrops[0];

        if (totalRemainder > 0) {
            let roll =
                Math.random() *
                totalRemainder;

            for (
                const drop of
                distributedDrops
            ) {
                roll -=
                    drop.remainder;

                if (roll <= 0) {
                    selectedDrop = drop;
                    break;
                }
            }
        }

        selectedDrop.quantity++;
        selectedDrop.remainder = 0;

        remainingDrops--;
    }

    return distributedDrops
        .filter(drop => {
            return drop.quantity > 0;
        })
        .map(drop => {
            return {
                itemId:
                    drop.itemId,

                rarityGroup:
                    drop.rarityGroup,

                experience:
                    drop.experience,

                quantity:
                    drop.quantity
            };
        });
}
