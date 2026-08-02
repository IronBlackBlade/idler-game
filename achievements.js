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

function getJournalAchievementCategory(
    achievement
) {
    if (achievement.category) {
        return achievement.category;
    }

    if (
        achievement.id ===
        "complete_bestiary"
    ) {
        return "collection";
    }

    if (
        achievement.id ===
        "character_class"
    ) {
        return "character";
    }

    return "hunting";
}

function getJournalProfessionAchievementData() {
    if (
        typeof ensureFishingState ===
            "function"
    ) {
        ensureFishingState();
    }

    if (
        typeof ensureCookingState ===
            "function"
    ) {
        ensureCookingState();
    }

    const fishing =
        player.fishing || {};

    const cooking =
        player.cooking || {};

    const fishingStatistics =
        fishing.statistics || {};

    const cookingStatistics =
        cooking.statistics || {};

    const tavern =
        cooking.tavern || {};

    const caughtFishIds =
        Object.keys(
            fishingStatistics
                .fishByItem || {}
        ).filter(itemId => {
            return (
                Number(
                    fishingStatistics
                        .fishByItem[itemId]
                ) || 0
            ) > 0;
        });

    const catchableFishIds =
        typeof fishingAreas ===
            "undefined"
            ? []
            : Array.from(
                new Set(
                    fishingAreas.flatMap(
                        area => {
                            return [
                                ...(area.basicDrops || []),
                                ...(area.rareDrops || [])
                            ].map(
                                drop =>
                                    drop.itemId
                            );
                        }
                    )
                )
            );

    const cookedRecipeIds =
        Object.keys(
            cookingStatistics
                .recipesById || {}
        ).filter(recipeId => {
            return (
                Number(
                    cookingStatistics
                        .recipesById[recipeId]
                ) || 0
            ) > 0;
        });

    return {
        fishingLevel:
            Math.max(
                1,
                Math.floor(
                    Number(
                        fishing.level
                    ) || 1
                )
            ),

        totalFish:
            Math.max(
                0,
                Math.floor(
                    Number(
                        fishingStatistics
                            .totalFish
                    ) || 0
                )
            ),

        rareFish:
            Math.max(
                0,
                Math.floor(
                    Number(
                        fishingStatistics
                            .rareFish
                    ) || 0
                )
            ),

        treasures:
            Math.max(
                0,
                Math.floor(
                    Number(
                        fishingStatistics
                            .treasures
                    ) || 0
                )
            ),

        fishingOrders:
            Math.max(
                0,
                Math.floor(
                    Number(
                        fishingStatistics
                            .totalOrdersCompleted
                    ) || 0
                )
            ),

        caughtFish:
            caughtFishIds.filter(
                itemId => {
                    return catchableFishIds
                        .includes(itemId);
                }
            ).length,

        catchableFish:
            Math.max(
                1,
                catchableFishIds.length
            ),

        cookingLevel:
            Math.max(
                1,
                Math.floor(
                    Number(
                        cooking.level
                    ) || 1
                )
            ),

        mealsCooked:
            Math.max(
                0,
                Math.floor(
                    Number(
                        cookingStatistics
                            .totalMealsCooked
                    ) || 0
                )
            ),

        cookedRecipes:
            cookedRecipeIds.length,

        totalRecipes:
            Math.max(
                1,
                typeof cookingRecipes ===
                    "undefined"
                    ? 0
                    : cookingRecipes.length
            ),

        tavernLevel:
            Math.max(
                1,
                Math.floor(
                    Number(
                        tavern.level
                    ) || 1
                )
            ),

        tavernOrders:
            Math.max(
                0,
                Math.floor(
                    Number(
                        tavern.completedOrders
                    ) || 0
                )
            )
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

    const professions =
        getJournalProfessionAchievementData();

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
            id: "character_level_10",
            category: "character",
            points: 5,
            icon: "⭐",
            name: "Początkujący bohater",
            description:
                "Osiągnij 10. poziom postaci.",
            progress:
                Math.max(
                    1,
                    Number(player.level) || 1
                ),
            target: 10
        },
        {
            id: "character_level_50",
            category: "character",
            points: 15,
            icon: "🌟",
            name: "Doświadczony bohater",
            description:
                "Osiągnij 50. poziom postaci.",
            progress:
                Math.max(
                    1,
                    Number(player.level) || 1
                ),
            target: 50
        },
        {
            id: "character_level_100",
            category: "character",
            points: 30,
            icon: "💫",
            name: "Legenda",
            description:
                "Osiągnij 100. poziom postaci.",
            progress:
                Math.max(
                    1,
                    Number(player.level) || 1
                ),
            target: 100
        },
        {
            id: "character_gold_10000",
            category: "character",
            points: 10,
            icon: "💰",
            name: "Pełna sakiewka",
            description:
                "Zgromadź 10 000 złota.",
            progress:
                Math.max(
                    0,
                    Number(player.gold) || 0
                ),
            target: 10000
        },
        {
            id: "character_gold_1000000",
            category: "character",
            points: 30,
            icon: "🤑",
            name: "Magnat",
            description:
                "Zgromadź 1 000 000 złota.",
            progress:
                Math.max(
                    0,
                    Number(player.gold) || 0
                ),
            target: 1000000
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
},
{
    id: "fishing_first_catch",
    category: "professions",
    points: 5,
    icon: "🎣",
    name: "Pierwszy połów",
    description: "Złów swoją pierwszą rybę.",
    progress: professions.totalFish,
    target: 1
},
{
    id: "fishing_angler_100",
    category: "professions",
    points: 10,
    icon: "🐟",
    name: "Doświadczony wędkarz",
    description: "Złów łącznie 100 ryb.",
    progress: professions.totalFish,
    target: 100
},
{
    id: "fishing_angler_500",
    category: "professions",
    points: 25,
    icon: "🌊",
    name: "Pan wód",
    description: "Złów łącznie 500 ryb.",
    progress: professions.totalFish,
    target: 500
},
{
    id: "fishing_rare_10",
    category: "professions",
    points: 15,
    icon: "✨",
    name: "Łowca okazów",
    description: "Złów 10 rzadkich ryb.",
    progress: professions.rareFish,
    target: 10
},
{
    id: "fishing_treasures_10",
    category: "professions",
    points: 20,
    icon: "🧰",
    name: "Skarby z głębin",
    description: "Wyłów 10 skarbów.",
    progress: professions.treasures,
    target: 10
},
{
    id: "fishing_orders_25",
    category: "professions",
    points: 20,
    icon: "📦",
    name: "Dostawca wybrzeża",
    description: "Zrealizuj 25 zleceń wędkarskich.",
    progress: professions.fishingOrders,
    target: 25
},
{
    id: "fishing_level_25",
    category: "professions",
    points: 25,
    icon: "🏅",
    name: "Mistrz wędkarstwa",
    description: "Osiągnij 25. poziom łowienia.",
    progress: professions.fishingLevel,
    target: 25
},
{
    id: "fishing_collection",
    category: "collection",
    points: 30,
    icon: "🐠",
    name: "Atlas ryb",
    description: "Złów każdy dostępny gatunek ryby.",
    progress: professions.caughtFish,
    target: professions.catchableFish
},
{
    id: "cooking_first_meal",
    category: "professions",
    points: 5,
    icon: "🍲",
    name: "Pierwsza potrawa",
    description: "Ugotuj swoją pierwszą porcję jedzenia.",
    progress: professions.mealsCooked,
    target: 1
},
{
    id: "cooking_meals_50",
    category: "professions",
    points: 10,
    icon: "🥘",
    name: "Kuchenny rytm",
    description: "Ugotuj łącznie 50 porcji jedzenia.",
    progress: professions.mealsCooked,
    target: 50
},
{
    id: "cooking_meals_250",
    category: "professions",
    points: 25,
    icon: "👨‍🍳",
    name: "Szef kuchni",
    description: "Ugotuj łącznie 250 porcji jedzenia.",
    progress: professions.mealsCooked,
    target: 250
},
{
    id: "cooking_level_20",
    category: "professions",
    points: 25,
    icon: "🔥",
    name: "Mistrz gotowania",
    description: "Osiągnij 20. poziom gotowania.",
    progress: professions.cookingLevel,
    target: 20
},
{
    id: "cooking_collection",
    category: "collection",
    points: 25,
    icon: "📖",
    name: "Pełna księga kucharska",
    description: "Ugotuj przynajmniej raz każdą potrawę.",
    progress: professions.cookedRecipes,
    target: professions.totalRecipes
},
{
    id: "tavern_first_order",
    category: "professions",
    points: 5,
    icon: "🍺",
    name: "Pierwszy gość",
    description: "Zrealizuj pierwsze zamówienie w karczmie.",
    progress: professions.tavernOrders,
    target: 1
},
{
    id: "tavern_orders_25",
    category: "professions",
    points: 15,
    icon: "🍽️",
    name: "Pełna sala",
    description: "Zrealizuj 25 zamówień w karczmie.",
    progress: professions.tavernOrders,
    target: 25
},
{
    id: "tavern_orders_100",
    category: "professions",
    points: 30,
    icon: "🏰",
    name: "Słynna karczma",
    description: "Zrealizuj 100 zamówień w karczmie.",
    progress: professions.tavernOrders,
    target: 100
},
{
    id: "tavern_level_5",
    category: "professions",
    points: 20,
    icon: "🍻",
    name: "Gwarna gospoda",
    description: "Osiągnij 5. poziom karczmy.",
    progress: professions.tavernLevel,
    target: 5
},
{
    id: "tavern_level_10",
    category: "professions",
    points: 35,
    icon: "👑",
    name: "Karczma królewska",
    description: "Osiągnij 10. poziom karczmy.",
    progress: professions.tavernLevel,
    target: 10
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

        if (
            typeof updateJournalAchievementIndicators ===
                "function"
        ) {
            updateJournalAchievementIndicators();
        }
    }

    return {
        unlockedCount,
        pointsGained
    };
}
