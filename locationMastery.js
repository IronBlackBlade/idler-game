function createDefaultLocationProgress() {
    return {
        /*
         * Zabójstwa od ostatniego bossa.
         * To pole obsługuje obecny
         * system pojawiania się bossa.
         */
        bossKillsCounter: 0,

        /*
         * Aktualna szansa na bossa.
         */
        bossChance: 0,

        /*
         * Stałe statystyki lokacji.
         * Nie zerują się po bossie.
         */
        totalKills: 0,
        eliteKills: 0,
        bossKills: 0,
        firstBossRewardClaimed: false,
        chestsFound: 0,
        commonChestsFound: 0,
        rareChestsFound: 0,
        eliteChestsFound: 0,

        /*
         * Lista osiągniętych progów:
         * 25, 50, 75 i 100.
         */
        masteryUnlockedMilestones: []
    };
}

function ensureLocationProgress(
    locationId
) {
    const safeLocationId =
        locationId ||
        player.location;

    if (
        !player.locationProgress ||
        typeof player.locationProgress !==
        "object"
    ) {
        player.locationProgress = {};
    }

    if (
        !player.locationProgress[
        safeLocationId
        ] ||
        typeof player.locationProgress[
        safeLocationId
        ] !== "object"
    ) {
        player.locationProgress[
            safeLocationId
        ] =
            createDefaultLocationProgress();
    }

    const progress =
        player.locationProgress[
        safeLocationId
        ];

    /*
     * Poniższa część uzupełnia stare
     * zapisy gry o brakujące pola.
     */

    progress.bossKillsCounter =
        Math.max(
            0,
            Math.floor(
                Number(
                    progress.bossKillsCounter
                ) || 0
            )
        );

    progress.bossChance =
        Math.max(
            0,
            Number(
                progress.bossChance
            ) || 0
        );

    progress.totalKills =
        Math.max(
            0,
            Math.floor(
                Number(
                    progress.totalKills
                ) || 0
            )
        );

    progress.firstBossRewardClaimed =
        progress
            .firstBossRewardClaimed ===
        true;

    progress.eliteKills =
        Math.max(
            0,
            Math.floor(
                Number(
                    progress.eliteKills
                ) || 0
            )
        );

    progress.bossKills =
        Math.max(
            0,
            Math.floor(
                Number(
                    progress.bossKills
                ) || 0
            )
        );
    [
        "chestsFound",
        "commonChestsFound",
        "rareChestsFound",
        "eliteChestsFound"
    ].forEach(counterName => {
        progress[counterName] =
            Math.max(
                0,
                Math.floor(
                    Number(
                        progress[counterName]
                    ) || 0
                )
            );
    });


    if (
        !Array.isArray(
            progress
                .masteryUnlockedMilestones
        )
    ) {
        progress
            .masteryUnlockedMilestones =
            [];
    }

    progress
        .masteryUnlockedMilestones =
        [
            ...new Set(
                progress
                    .masteryUnlockedMilestones
                    .map(value => {
                        return Number(value);
                    })
                    .filter(value => {
                        return (
                            LOCATION_MASTERY_THRESHOLDS
                                .includes(
                                    value
                                )
                        );
                    })
            )
        ].sort(
            (
                firstValue,
                secondValue
            ) => {
                return (
                    firstValue -
                    secondValue
                );
            }
        );

    return progress;
}

function getLocationMasteryPercent(
    locationId = player.location
) {
    const progress =
        ensureLocationProgress(
            locationId
        );

    return Math.min(
        100,
        (
            progress.totalKills /
            LOCATION_MASTERY_REQUIRED_KILLS
        ) *
        100
    );
}



function getLocationMasteryBonuses(
    locationId = player.location
) {
    const masteryPercent =
        getLocationMasteryPercent(
            locationId
        );

    const bonuses = {
        goldBonus: 0,
        experienceBonus: 0,
        chestChanceBonus: 0,
        lootChanceBonus: 0
    };

    LOCATION_MASTERY_REWARDS
        .filter(reward => {
            return (
                masteryPercent >=
                reward.threshold
            );
        })
        .forEach(reward => {
            Object.entries(
                reward.bonuses
            ).forEach(
                ([
                    bonusName,
                    value
                ]) => {
                    bonuses[bonusName] +=
                        Number(value) || 0;
                }
            );
        });

    return bonuses;
}

function getCurrentLocationProgress() {
    return ensureLocationProgress(
        player.location
    );
}

function updateLocationMasteryAfterKill(
    defeatedEnemyWasBoss = false,
    defeatedEnemyType = "normal"
) {
    const progress =
        getCurrentLocationProgress();

    progress.totalKills += 1;

    if (
        !defeatedEnemyWasBoss &&
        defeatedEnemyType === "elite"
    ) {
        progress.eliteKills += 1;
    }

    if (defeatedEnemyWasBoss) {
        progress.bossKills += 1;
    }

    const masteryPercent =
        getLocationMasteryPercent(
            player.location
        );

    const newlyUnlockedMilestones =
        LOCATION_MASTERY_THRESHOLDS
            .filter(threshold => {
                return (
                    masteryPercent >=
                    threshold &&
                    !progress
                        .masteryUnlockedMilestones
                        .includes(
                            threshold
                        )
                );
            });

    if (
        newlyUnlockedMilestones
            .length === 0
    ) {
        return;
    }

    const location =
        typeof locations !==
            "undefined"
            ? locations[
            player.location
            ]
            : null;

    const locationName =
        location?.name ||
        "lokacji";

    newlyUnlockedMilestones
        .forEach(threshold => {
            progress
                .masteryUnlockedMilestones
                .push(
                    threshold
                );
            const masteryReward =
                LOCATION_MASTERY_REWARDS
                    .find(reward => {
                        return (
                            reward.threshold ===
                            threshold
                        );
                    });
            const message =
                "Osiągnięto " +
                threshold +
                "% opanowania: " +
                locationName +
                ". Odblokowano: " +
                (
                    masteryReward?.label ||
                    "nową premię"
                ) +
                ".";

            if (
                typeof addCombatLog ===
                "function"
            ) {
                addCombatLog(
                    "🏹 " +
                    message
                );
            }

            if (
                typeof addSystemLog ===
                "function"
            ) {
                addSystemLog(
                    "🏹 " +
                    message,
                    "location"
                );
            }

            if (
                typeof showNotification ===
                "function"
            ) {
                showNotification(
                    message,
                    "success"
                );
            }
        });

    progress
        .masteryUnlockedMilestones
        .sort(
            (
                firstValue,
                secondValue
            ) => {
                return (
                    firstValue -
                    secondValue
                );
            }
        );
}