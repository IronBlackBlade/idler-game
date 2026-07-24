function getJournalTotalLocationCounter(
    counterName
) {
    if (
        typeof locations ===
        "undefined"
    ) {
        return 0;
    }

    return Object.values(locations)
        .reduce(
            (total, location) => {
                const progress =
                    typeof ensureLocationProgress ===
                        "function"
                        ? ensureLocationProgress(
                            location.id
                        )
                        : (
                            player
                                .locationProgress
                            ?.[location.id] ||
                            {}
                        );

                return (
                    total +
                    getJournalBestiaryCounter(
                        progress,
                        counterName
                    )
                );
            },
            0
        );
}

function getJournalEnemyDiscoveryData() {
    if (
        typeof locations ===
        "undefined"
    ) {
        return {
            discovered: 0,
            total: 0
        };
    }

    const bestiary =
        player.journal?.bestiary ||
        {};

    const enemies =
        Object.values(locations)
            .flatMap(location => {
                return (
                    location.enemies ||
                    []
                );
            });

    const discovered =
        enemies.filter(enemyData => {
            return (
                bestiary[
                    enemyData.id
                ]?.encountered ===
                true
            );
        }).length;

    return {
        discovered,
        total: enemies.length
    };
}

function getJournalMasteredLocationData() {
    if (
        typeof locations ===
        "undefined"
    ) {
        return {
            mastered: 0,
            total: 0
        };
    }

    const locationList =
        Object.values(locations);

    const mastered =
        locationList.filter(location => {
            return (
                getLocationMasteryPercent(
                    location.id
                ) >= 100
            );
        }).length;

    return {
        mastered,
        total: locationList.length
    };
}

function getJournalQuestCompletionData(
    locationId
) {
    if (
        typeof quests ===
            "undefined" ||
        typeof getQuestLocationId !==
            "function"
    ) {
        return {
            completed: 0,
            total: 0
        };
    }

    const locationQuests =
        quests.filter(quest => {
            return (
                getQuestLocationId(
                    quest
                ) ===
                locationId
            );
        });

    const completed =
        locationQuests.filter(
            quest => {
                return (
                    quest.claimed ===
                    true
                );
            }
        ).length;

    return {
        completed,
        total:
            locationQuests.length
    };
}

function getJournalAchievementDefinitions() {
    const totalKills =
        getJournalTotalLocationCounter(
            "totalKills"
        );

    const eliteKills =
        getJournalTotalLocationCounter(
            "eliteKills"
        );

    const bossKills =
        getJournalTotalLocationCounter(
            "bossKills"
        );

    const chestsFound =
        getJournalTotalLocationCounter(
            "chestsFound"
        );

    const enemyDiscovery =
        getJournalEnemyDiscoveryData();

    const locationMastery =
        getJournalMasteredLocationData();

        const questCompletionByLocation = {
    forest:
        getJournalQuestCompletionData(
            "forest"
        ),

    cave:
        getJournalQuestCompletionData(
            "cave"
        ),

    ruins:
        getJournalQuestCompletionData(
            "ruins"
        ),

    ice:
        getJournalQuestCompletionData(
            "ice"
        ),

    volcano:
        getJournalQuestCompletionData(
            "volcano"
        )
};

    return [
        {
            id: "first_victory",
            points: 5,
            icon: "⚔️",
            name: "Pierwsze zwycięstwo",
            description:
                "Pokonaj pierwszego przeciwnika.",
            progress: totalKills,
            target: 1
        },
        {
            id: "experienced_hunter",
            points: 10,
            icon: "🏹",
            name: "Doświadczony łowca",
            description:
                "Pokonaj 100 przeciwników.",
            progress: totalKills,
            target: 100
        },
        {
            id: "unstoppable_hunter",
            points: 20,
            icon: "🔥",
            name: "Niepowstrzymany",
            description:
                "Pokonaj 500 przeciwników.",
            progress: totalKills,
            target: 500
        },
        {
            id: "elite_slayer",
            points: 15,
            icon: "⭐",
            name: "Pogromca elit",
            description:
                "Pokonaj 10 elitarnych przeciwników.",
            progress: eliteKills,
            target: 10
        },
        {
            id: "first_boss",
            points: 15,
            icon: "👑",
            name: "Pogromca bossa",
            description:
                "Pokonaj pierwszego bossa.",
            progress: bossKills,
            target: 1
        },
        {
            id: "boss_nightmare",
            points: 25,
            icon: "💀",
            name: "Koszmar bossów",
            description:
                "Pokonaj bossów łącznie 10 razy.",
            progress: bossKills,
            target: 10
        },
        {
            id: "treasure_hunter",
            points: 10,
            icon: "📦",
            name: "Poszukiwacz skarbów",
            description:
                "Znajdź 25 automatycznych skrzyń.",
            progress: chestsFound,
            target: 25
        },
        {
            id: "complete_bestiary",
            points: 20,
            icon: "🐾",
            name: "Badacz potworów",
            description:
                "Odkryj wszystkich zwykłych przeciwników.",
            progress:
                enemyDiscovery.discovered,
            target:
                Math.max(
                    1,
                    enemyDiscovery.total
                )
        },
        {
            id: "location_master",
            points: 20,
            icon: "🗺️",
            name: "Mistrz lokacji",
            description:
                "Osiągnij 100% opanowania jednej lokacji.",
            progress:
                locationMastery.mastered,
            target: 1
        },
        {
            id: "world_master",
            points: 40,
            icon: "🌍",
            name: "Mistrz świata",
            description:
                "Osiągnij 100% opanowania wszystkich lokacji.",
            progress:
                locationMastery.mastered,
            target:
                Math.max(
                    1,
                    locationMastery.total
                )
        },
        {
            id: "character_class",
            points: 5,
            icon: "🏛️",
            name: "Własna droga",
            description:
                "Wybierz klasę postaci.",
            progress:
                player.classId
                    ? 1
                    : 0,
            target: 1
        },


        {
    id:
        "complete_forest_quests",

    points: 5,
    icon: "🌲",

    name:
        "Tropiciel Lasu",

    description:
        "Ukończ wszystkie etapy zadań w Lesie.",

    progress:
        questCompletionByLocation
            .forest.completed,

    target:
        Math.max(
            1,
            questCompletionByLocation
                .forest.total
        )
},
{
    id:
        "complete_cave_quests",

    points: 10,
    icon: "🦇",

    name:
        "Zdobywca Jaskini",

    description:
        "Ukończ wszystkie etapy zadań w Jaskini.",

    progress:
        questCompletionByLocation
            .cave.completed,

    target:
        Math.max(
            1,
            questCompletionByLocation
                .cave.total
        )
},
{
    id:
        "complete_ruins_quests",

    points: 15,
    icon: "🏛️",

    name:
        "Badacz Ruin",

    description:
        "Ukończ wszystkie etapy zadań w Zapomnianych Ruinach.",

    progress:
        questCompletionByLocation
            .ruins.completed,

    target:
        Math.max(
            1,
            questCompletionByLocation
                .ruins.total
        )
},
{
    id:
        "complete_ice_quests",

    points: 20,
    icon: "❄️",

    name:
        "Pogromca Mrozu",

    description:
        "Ukończ wszystkie etapy zadań w Lodowej Krainie.",

    progress:
        questCompletionByLocation
            .ice.completed,

    target:
        Math.max(
            1,
            questCompletionByLocation
                .ice.total
        )
},
{
    id:
        "complete_volcano_quests",

    points: 25,
    icon: "🌋",

    name:
        "Legenda Wulkanu",

    description:
        "Ukończ wszystkie etapy zadań na Wulkanicznym Pustkowiu.",

    progress:
        questCompletionByLocation
            .volcano.completed,

    target:
        Math.max(
            1,
            questCompletionByLocation
                .volcano.total
        )
}
    ];
}

function checkJournalAchievements() {
    const journal =
        typeof ensureJournalState ===
            "function"
            ? ensureJournalState()
            : player.journal;

    if (!journal) {
        return {
            unlockedCount: 0,
            pointsGained: 0
        };
    }

    const achievements =
        getJournalAchievementDefinitions();

    let unlockedCount = 0;
    let pointsGained = 0;

    achievements.forEach(
        achievement => {
            const completed =
                achievement.progress >=
                achievement.target;

            const alreadyUnlocked =
                Boolean(
                    journal
                        .unlockedAchievements[
                    achievement.id
                    ]
                );

            if (
                !completed ||
                alreadyUnlocked
            ) {
                return;
            }

            const points =
                Math.max(
                    0,
                    Math.floor(
                        Number(
                            achievement.points
                        ) || 0
                    )
                );

            journal
                .unlockedAchievements[
                achievement.id
            ] = {
                unlockedAt:
                    Date.now(),

                points: points
            };

            journal.achievementPoints +=
                points;

            journal
                .totalAchievementPoints +=
                points;

            unlockedCount += 1;
            pointsGained += points;
        }
    );

    if (unlockedCount > 0) {
        const message =
            "Odblokowano " +
            unlockedCount +
            (
                unlockedCount === 1
                    ? " osiągnięcie"
                    : " osiągnięcia"
            ) +
            ". Zdobyto +" +
            pointsGained +
            " punktów osiągnięć.";

        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "🏆 " + message,
                "success"
            );
        }

        if (
            typeof addSystemLog ===
            "function"
        ) {
            addSystemLog(
                "🏆 " + message,
                "achievement"
            );
        }
    }

    return {
        unlockedCount,
        pointsGained
    };
}
