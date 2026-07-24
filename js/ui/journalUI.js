const allowedJournalTabs = [
    "bestiary",
    "locations",
    "bosses",
    "achievements"
];

const savedJournalTab =
    localStorage.getItem(
        "idler_journal_tab"
    );

let currentJournalTab =
    allowedJournalTabs.includes(
        savedJournalTab
    )
        ? savedJournalTab
        : "bestiary";


function getJournalBestiaryCounter(
    entry,
    counterName
) {
    return Math.max(
        0,
        Math.floor(
            Number(
                entry?.[counterName]
            ) || 0
        )
    );
}

function renderBestiary() {
    const container =
        document.getElementById(
            "journal-bestiary-list"
        );

    if (
        !container ||
        typeof locations ===
        "undefined"
    ) {
        return;
    }

    const bestiary =
        player.journal?.bestiary ||
        {};

    const locationDefinitions =
        Object.values(locations);

    const allEnemies =
        locationDefinitions.flatMap(
            location => {
                return (
                    location.enemies || []
                ).map(enemyData => {
                    return {
                        enemyData,
                        location,
                        entry:
                            bestiary[
                            enemyData.id
                            ] || null
                    };
                });
            }
        );

    const discoveredEnemies =
        allEnemies.filter(data => {
            return (
                data.entry?.encountered ===
                true
            );
        });

    const totalKills =
        discoveredEnemies.reduce(
            (sum, data) => {
                return (
                    sum +
                    getJournalBestiaryCounter(
                        data.entry,
                        "kills"
                    )
                );
            },
            0
        );

    const locationsHtml =
        locationDefinitions
            .map(location => {
                const enemies =
                    allEnemies.filter(
                        data => {
                            return (
                                data.location.id ===
                                location.id
                            );
                        }
                    );

                const enemiesHtml =
                    enemies
                        .map(data => {
                            const {
                                enemyData,
                                entry
                            } = data;

                            const discovered =
                                entry?.encountered ===
                                true;

                            if (!discovered) {
                                return `
                                    <article
                                        class="
                                            journal-bestiary-card
                                            locked
                                        "
                                    >
                                        <div
                                            class="
                                                journal-bestiary-card-header
                                            "
                                        >
                                            <span
                                                class="
                                                    journal-bestiary-icon
                                                "
                                            >
                                                🔒
                                            </span>

                                            <div>
                                                <strong>
                                                    ???
                                                </strong>

                                                <span>
                                                    Nieodkryty przeciwnik
                                                </span>
                                            </div>
                                        </div>

                                        <p>
                                            Napotkaj tego przeciwnika
                                            podczas polowania.
                                        </p>
                                    </article>
                                `;
                            }

                            const total =
                                getJournalBestiaryCounter(
                                    entry,
                                    "kills"
                                );

                            const normal =
                                getJournalBestiaryCounter(
                                    entry,
                                    "normalKills"
                                );

                            const strong =
                                getJournalBestiaryCounter(
                                    entry,
                                    "strongKills"
                                );

                            const elite =
                                getJournalBestiaryCounter(
                                    entry,
                                    "eliteKills"
                                );
                            const lootTable =
                                Array.isArray(
                                    enemyData.loot
                                )
                                    ? enemyData.loot
                                    : [];

                            const discoveredLoot =
                                Array.isArray(
                                    entry.discoveredLoot
                                )
                                    ? entry.discoveredLoot
                                    : [];

                            const discoveredLootCount =
                                lootTable.filter(drop => {
                                    return discoveredLoot.includes(
                                        drop.item
                                    );
                                }).length;

                            const lootHtml =
                                lootTable
                                    .map(drop => {
                                        const discovered =
                                            discoveredLoot.includes(
                                                drop.item
                                            );

                                        const item =
                                            typeof items !==
                                                "undefined"
                                                ? items[drop.item]
                                                : null;

                                        if (
                                            !discovered ||
                                            !item
                                        ) {
                                            return `
                    <span
                        class="
                            journal-bestiary-loot-item
                            locked
                        "
                    >
                        🔒 ???
                    </span>
                `;
                                        }

                                        return `
                <span
                    class="
                        journal-bestiary-loot-item
                        discovered
                    "
                    title="
                        Podstawowa szansa:
                        ${drop.chance}%
                    "
                >
                    🎒 ${item.name}
                </span>
            `;
                                    })
                                    .join("");
                            return `
                                <article
                                    class="
                                        journal-bestiary-card
                                        discovered
                                    "
                                >
                                    <div
                                        class="
                                            journal-bestiary-card-header
                                        "
                                    >
                                        <span
                                            class="
                                                journal-bestiary-icon
                                            "
                                        >
                            getEnemyIcon(
    enemyData.id
)}
                                        </span>

                                        <div>
                                            <strong>
                                                ${enemyData.name}
                                            </strong>

                                            <span>
                                                Pokonano łącznie:
                                                ${total}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        class="
                                            journal-bestiary-counters
                                        "
                                    >
                                        <div>
                                            <span>
                                                Zwykli
                                            </span>

                                            <strong>
                                                ${normal}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Silni
                                            </span>

                                            <strong>
                                                ${strong}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Elitarni
                                            </span>

                                            <strong>
                                                ${elite}
                                            </strong>
                                        </div>
                                    </div>
                                    <div
    class="
        journal-bestiary-loot
    "
>
    <div
        class="
            journal-bestiary-loot-header
        "
    >
        <span>
            Możliwy łup
        </span>

        <strong>
            ${discoveredLootCount}
            /
            ${lootTable.length}
        </strong>
    </div>

    <div
        class="
            journal-bestiary-loot-list
        "
    >
        ${lootHtml}
    </div>
</div>
                                </article>
                            `;
                        })
                        .join("");

                return `
                    <section
                        class="
                            journal-bestiary-location
                        "
                    >
                        <div
                            class="
                                journal-bestiary-location-header
                            "
                        >
                            <strong>
                                ${location.name}
                            </strong>

                            <span>
                                ${enemies.length}
                                przeciwników
                            </span>
                        </div>

                        <div
                            class="
                                journal-bestiary-grid
                            "
                        >
                            ${enemiesHtml}
                        </div>
                    </section>
                `;
            })
            .join("");

    container.className =
        "journal-bestiary-content";

    container.innerHTML = `
        <div
            class="
                journal-bestiary-summary
            "
        >
            <div>
                <span>
                    Odkryci przeciwnicy
                </span>

                <strong>
                    ${discoveredEnemies.length}
                    /
                    ${allEnemies.length}
                </strong>
            </div>

            <div>
                <span>
                    Łącznie pokonani
                </span>

                <strong>
                    ${totalKills}
                </strong>
            </div>
        </div>

        ${locationsHtml}
    `;
}

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

function renderJournalAchievements() {
    const container =
        document.getElementById(
            "journal-achievement-list"
        );

    if (!container) {
        return;
    }


if (
    typeof checkJournalAchievements ===
        "function"
) {
    checkJournalAchievements();
}

const journal =
    typeof ensureJournalState ===
        "function"
        ? ensureJournalState()
        : player.journal;

    const achievements =
        getJournalAchievementDefinitions();

    const completedCount =
        achievements.filter(
            achievement => {
                return Boolean(
                    journal
                        .unlockedAchievements[
                    achievement.id
                    ]
                );
            }
        ).length;

    const cardsHtml =
        achievements
            .map(achievement => {
                const unlocked =
                    Boolean(
                        journal
                            .unlockedAchievements[
                        achievement.id
                        ]
                    );

                const completed =
                    unlocked ||
                    achievement.progress >=
                    achievement.target;

                const progressPercent =
                    completed
                        ? 100
                        : Math.min(
                            100,
                            (
                                achievement.progress /
                                achievement.target
                            ) *
                            100
                        );

                const progressText =
                    completed
                        ? "Odblokowane"
                        : (
                            achievement.progress +
                            " / " +
                            achievement.target
                        );
                return `
                    <article
                        class="
                            journal-achievement-card
                            ${completed
                        ? "completed"
                        : ""
                    }
                        "
                    >
                        <div
                            class="
                                journal-achievement-header
                            "
                        >
                            <span
                                class="
                                    journal-achievement-icon
                                "
                            >
                                ${achievement.icon}
                            </span>

                            <div>
                                <strong>
                                    ${achievement.name}
                                </strong>

                              <span>
    ${completed
                        ? (
                            "Ukończone · +" +
                            achievement.points +
                            " pkt"
                        )
                        : (
                            "Nagroda: " +
                            achievement.points +
                            " pkt"
                        )
                    }
</span>
                            </div>

                            <span
                                class="
                                    journal-achievement-check
                                "
                            >
                                ${completed
                        ? "✓"
                        : "🔒"
                    }
                            </span>
                        </div>

                        <p>
                            ${achievement.description}
                        </p>

                        <div
                            class="
                                journal-achievement-progress-info
                            "
                        >
                            <span>
                                Postęp
                            </span>

<strong>
    ${progressText}
</strong>
                        </div>

                        <div
                            class="
                                journal-achievement-track
                            "
                        >
                            <div
                                class="
                                    journal-achievement-fill
                                "
                                style="
                                    width:
                                    ${progressPercent}%
                                "
                            ></div>
                        </div>
                    </article>
                `;
            })
            .join("");

    container.className =
        "journal-achievement-content";

    container.innerHTML = `
        <div
            class="
                journal-achievement-summary
            "
        >
            <span>
                Ukończone osiągnięcia
            </span>

<strong>
    ${completedCount}
    /
    ${achievements.length}
    ·
    🏅
    ${player.journal
            ?.achievementPoints || 0}
    pkt
</strong>
        </div>

        <div
            class="
                journal-achievement-grid
            "
        >
            ${cardsHtml}
        </div>
    `;
}

function renderLocationJournal() {
    const container =
        document.getElementById(
            "journal-location-list"
        );

    if (
        !container ||
        typeof locations ===
        "undefined"
    ) {
        return;
    }

    const requiredKills =
        typeof LOCATION_MASTERY_REQUIRED_KILLS !==
            "undefined"
            ? LOCATION_MASTERY_REQUIRED_KILLS
            : 200;

    const masteryRewards =
        typeof LOCATION_MASTERY_REWARDS !==
            "undefined"
            ? LOCATION_MASTERY_REWARDS
            : [];

    const locationCardsHtml =
        Object.values(locations)
            .map(location => {
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

                const totalKills =
                    getJournalBestiaryCounter(
                        progress,
                        "totalKills"
                    );

                const eliteKills =
                    getJournalBestiaryCounter(
                        progress,
                        "eliteKills"
                    );

                const bossKills =
                    getJournalBestiaryCounter(
                        progress,
                        "bossKills"
                    );

                const chestsFound =
                    getJournalBestiaryCounter(
                        progress,
                        "chestsFound"
                    );

                const commonChests =
                    getJournalBestiaryCounter(
                        progress,
                        "commonChestsFound"
                    );

                const rareChests =
                    getJournalBestiaryCounter(
                        progress,
                        "rareChestsFound"
                    );

                const eliteChests =
                    getJournalBestiaryCounter(
                        progress,
                        "eliteChestsFound"
                    );

                const masteryPercent =
                    typeof getLocationMasteryPercent ===
                        "function"
                        ? getLocationMasteryPercent(
                            location.id
                        )
                        : 0;

                const masteryRank =
                    typeof getLocationMasteryRank ===
                        "function"
                        ? getLocationMasteryRank(
                            masteryPercent
                        )
                        : "Początkujący";

                const masteryKills =
                    Math.min(
                        totalKills,
                        requiredKills
                    );

                const requiredLevel =
                    Number(
                        location.requiredLevel
                    ) || 1;

                const locationAvailable =
                    player.level >=
                    requiredLevel;

                const isCurrentLocation =
                    player.location ===
                    location.id;

                const rewardsHtml =
                    masteryRewards
                        .map(reward => {
                            const unlocked =
                                masteryPercent >=
                                reward.threshold;

                            return `
                                <div
                                    class="
                                        journal-location-reward
                                        ${unlocked
                                    ? "unlocked"
                                    : ""
                                }
                                    "
                                >
                                    <span>
                                        ${unlocked
                                    ? "✓"
                                    : "🔒"
                                }
                                        ${reward.threshold}%
                                    </span>

                                    <strong>
                                        ${reward.label}
                                    </strong>
                                </div>
                            `;
                        })
                        .join("");

                return `
                    <article
                        class="
                            journal-location-card
                            ${isCurrentLocation
                        ? "current"
                        : ""
                    }
                            ${locationAvailable
                        ? ""
                        : "locked"
                    }
                        "
                    >
                        <div
                            class="
                                journal-location-header
                            "
                        >
                            <div>
                                <strong>
                                    ${location.name}
                                </strong>

                                <span>
                                    Zalecany poziom:
                                    ${location.recommendedLevel ||
                    requiredLevel
                    }
                                </span>
                            </div>

                            <span
                                class="
                                    journal-location-status
                                    ${isCurrentLocation
                        ? "current"
                        : ""
                    }
                                "
                            >
                                ${isCurrentLocation
                        ? "Aktualna"
                        : (
                            locationAvailable
                                ? "Dostępna"
                                : "Poziom " +
                                requiredLevel
                        )
                    }
                            </span>
                        </div>

                        <p>
                            ${location.description || ""}
                        </p>

                        <div
                            class="
                                journal-location-stats
                            "
                        >
                            <div>
                                <span>
                                    Pokonani
                                </span>

                                <strong>
                                    ${totalKills}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Elity
                                </span>

                                <strong>
                                    ${eliteKills}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Bossowie
                                </span>

                                <strong>
                                    ${bossKills}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Skrzynie
                                </span>

                                <strong>
                                    ${chestsFound}
                                </strong>
                            </div>
                        </div>

                        <div
                            class="
                                journal-location-mastery
                            "
                        >
                            <div
                                class="
                                    journal-location-mastery-header
                                "
                            >
                                <div>
                                    <span>
                                        🏹 Opanowanie
                                    </span>

                                    <strong>
                                        ${masteryRank}
                                    </strong>
                                </div>

                                <strong>
                                    ${Math.floor(
                        masteryPercent
                    )}%
                                </strong>
                            </div>

                            <div
                                class="
                                    journal-location-mastery-track
                                "
                            >
                                <div
                                    class="
                                        journal-location-mastery-fill
                                    "
                                    style="
                                        width:
                                        ${masteryPercent}%
                                    "
                                ></div>
                            </div>

                            <div
                                class="
                                    journal-location-mastery-kills
                                "
                            >
                                ${masteryKills}
                                /
                                ${requiredKills}
                                zwycięstw
                            </div>

                            <div
                                class="
                                    journal-location-rewards
                                "
                            >
                                ${rewardsHtml}
                            </div>
                        </div>

                        <div
                            class="
                                journal-location-chests
                            "
                        >
                            <span>
                                📦 Zwykłe:
                                <strong>
                                    ${commonChests}
                                </strong>
                            </span>

                            <span>
                                🎁 Rzadkie:
                                <strong>
                                    ${rareChests}
                                </strong>
                            </span>

                            <span>
                                👑 Elitarne:
                                <strong>
                                    ${eliteChests}
                                </strong>
                            </span>
                        </div>
                    </article>
                `;
            })
            .join("");

    container.className =
        "journal-location-content";

    container.innerHTML = `
        <div
            class="
                journal-location-grid
            "
        >
            ${locationCardsHtml}
        </div>
    `;
}

function refreshJournalLocationInterface() {
    const journalScreen =
        document.getElementById(
            "screen-journal"
        );

    if (
        !journalScreen ||
        journalScreen.style.display ===
        "none"
    ) {
        return;
    }

    if (
        currentJournalTab ===
        "locations"
    ) {
        renderLocationJournal();
    }

    if (
        currentJournalTab ===
        "achievements"
    ) {
        renderJournalAchievements();
    }
}

function renderBossJournal() {
    const container =
        document.getElementById(
            "journal-boss-list"
        );

    if (
        !container ||
        typeof locations ===
        "undefined"
    ) {
        return;
    }

    const bestiary =
        player.journal?.bestiary ||
        {};

    const bossEntries =
        Object.values(locations)
            .filter(location => {
                return Boolean(
                    location.boss
                );
            })
            .map(location => {
                const boss =
                    location.boss;

                const entry =
                    bestiary[boss.id] ||
                    null;

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

                const journalBossKills =
                    getJournalBestiaryCounter(
                        entry,
                        "bossKills"
                    );

                const locationBossKills =
                    Math.max(
                        0,
                        Math.floor(
                            Number(
                                progress.bossKills
                            ) || 0
                        )
                    );

                const bossKills =
                    Math.max(
                        journalBossKills,
                        locationBossKills
                    );

                const rewardClaimed =
                    progress
                        .firstBossRewardClaimed ===
                    true;

                const discovered =
                    entry?.encountered ===
                    true ||
                    bossKills > 0 ||
                    rewardClaimed;

                return {
                    location,
                    boss,
                    entry,
                    bossKills,
                    rewardClaimed,
                    discovered
                };
            });

    const discoveredCount =
        bossEntries.filter(data => {
            return data.discovered;
        }).length;

    const defeatedCount =
        bossEntries.filter(data => {
            return data.bossKills > 0;
        }).length;

    const totalBossKills =
        bossEntries.reduce(
            (sum, data) => {
                return (
                    sum +
                    data.bossKills
                );
            },
            0
        );

    const cardsHtml =
        bossEntries
            .map(data => {
                const {
                    location,
                    boss,
                    entry,
                    bossKills,
                    rewardClaimed,
                    discovered
                } = data;

                if (!discovered) {
                    return `
                        <article
                            class="
                                journal-boss-card
                                locked
                            "
                        >
                            <div
                                class="
                                    journal-boss-header
                                "
                            >
                                <span
                                    class="
                                        journal-boss-icon
                                    "
                                >
                                    🔒
                                </span>

                                <div>
                                    <strong>
                                        ???
                                    </strong>

                                    <span>
                                        ${location.name}
                                    </span>
                                </div>

                                <span
                                    class="
                                        journal-boss-status
                                    "
                                >
                                    Nieodkryty
                                </span>
                            </div>

                            <p>
                                Boss zostanie ujawniony,
                                gdy pojawi się podczas polowania.
                            </p>
                        </article>
                    `;
                }

                const defeated =
                    bossKills > 0;

                const firstReward =
                    boss.firstKillReward ||
                    {};

                const firstRewardParts = [];

                if (
                    Number(firstReward.gold) > 0
                ) {
                    firstRewardParts.push(
                        "💰 +" +
                        firstReward.gold +
                        " złota"
                    );
                }

                if (
                    Number(firstReward.exp) > 0
                ) {
                    firstRewardParts.push(
                        "⭐ +" +
                        firstReward.exp +
                        " EXP"
                    );
                }

                if (
                    Array.isArray(
                        firstReward.items
                    )
                ) {
                    firstReward.items.forEach(
                        rewardItem => {
                            const item =
                                typeof items !==
                                    "undefined"
                                    ? items[
                                    rewardItem.item
                                    ]
                                    : null;

                            firstRewardParts.push(
                                "🎁 " +
                                (
                                    item?.name ||
                                    rewardItem.item
                                ) +
                                " x" +
                                (
                                    Number(
                                        rewardItem.quantity
                                    ) || 1
                                )
                            );
                        }
                    );
                }

                const firstRewardHtml =
                    firstRewardParts.length > 0
                        ? firstRewardParts
                            .map(text => {
                                return `
                    <span>
                        ${text}
                    </span>
                `;
                            })
                            .join("")
                        : `
            <span>
                Brak dodatkowej nagrody
            </span>
        `;

                const bossLootTable =
                    Array.isArray(boss.loot)
                        ? boss.loot
                        : [];

                const discoveredBossLoot =
                    Array.isArray(
                        entry?.discoveredLoot
                    )
                        ? entry.discoveredLoot
                        : [];

                const discoveredBossLootCount =
                    bossLootTable.filter(drop => {
                        return (
                            discoveredBossLoot.includes(
                                drop.item
                            )
                        );
                    }).length;

                const bossLootHtml =
                    bossLootTable
                        .map(drop => {
                            const lootDiscovered =
                                discoveredBossLoot.includes(
                                    drop.item
                                );

                            const item =
                                typeof items !==
                                    "undefined"
                                    ? items[drop.item]
                                    : null;

                            if (
                                !lootDiscovered ||
                                !item
                            ) {
                                return `
                    <span
                        class="
                            journal-bestiary-loot-item
                            locked
                        "
                    >
                        🔒 ???
                    </span>
                `;
                            }

                            return `
                <span
                    class="
                        journal-bestiary-loot-item
                        discovered
                    "
                    title="
                        Podstawowa szansa:
                        ${drop.chance}%
                    "
                >
                    🎒 ${item.name}
                </span>
            `;
                        })
                        .join("");

                return `
                    <article
                        class="
                            journal-boss-card
                            discovered
                            ${defeated
                        ? "defeated"
                        : ""
                    }
                        "
                    >
                        <div
                            class="
                                journal-boss-header
                            "
                        >
                            <span
                                class="
                                    journal-boss-icon
                                "
                            >
                                👑
                            </span>

                            <div>
                                <strong>
                                    ${boss.name}
                                </strong>

                                <span>
                                    ${location.name}
                                </span>
                            </div>

                            <span
                                class="
                                    journal-boss-status
                                    ${defeated
                        ? "defeated"
                        : ""
                    }
                                "
                            >
                                ${defeated
                        ? "Pokonany"
                        : "Spotkany"
                    }
                            </span>
                        </div>

                        <div
                            class="
                                journal-boss-stats
                            "
                        >
                            <div>
                                <span>
                                    Zwycięstwa
                                </span>

                                <strong>
                                    ${bossKills}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    HP
                                </span>

                                <strong>
                                    ${boss.hp}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Atak
                                </span>

                                <strong>
                                    ${boss.attack}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    EXP
                                </span>

                                <strong>
                                    ${boss.exp}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Złoto
                                </span>

                                <strong>
                                    ${boss.gold}
                                </strong>
                            </div>
                        </div>

                        <div
                            class="
                                journal-boss-first-reward
                                ${rewardClaimed
                        ? "claimed"
                        : ""
                    }
                            "
                        >
                            <span>
                                🏆 Pierwsza nagroda
                            </span>

                            <strong>
                                ${rewardClaimed
                        ? "Odebrana"
                        : "Do zdobycia"
                    }
                            </strong>
                        </div>

                        <div
    class="
        journal-boss-first-reward-details
        ${rewardClaimed
                        ? "claimed"
                        : ""
                    }
    "
>
    ${firstRewardHtml}
</div>

<div
    class="
        journal-boss-loot
    "
>
    <div
        class="
            journal-boss-loot-header
        "
    >
        <span>
            Możliwy łup bossa
        </span>

        <strong>
            ${discoveredBossLootCount}
            /
            ${bossLootTable.length}
        </strong>
    </div>

    <div
        class="
            journal-bestiary-loot-list
        "
    >
        ${bossLootHtml}
    </div>
</div>
                    </article>
                `;
            })
            .join("");

    container.className =
        "journal-boss-content";

    container.innerHTML = `
        <div
            class="
                journal-boss-summary
            "
        >
            <div>
                <span>
                    Odkryci bossowie
                </span>

                <strong>
                    ${discoveredCount}
                    /
                    ${bossEntries.length}
                </strong>
            </div>

            <div>
                <span>
                    Pokonani bossowie
                </span>

                <strong>
                    ${defeatedCount}
                    /
                    ${bossEntries.length}
                </strong>
            </div>

            <div>
                <span>
                    Łączne zwycięstwa
                </span>

                <strong>
                    ${totalBossKills}
                </strong>
            </div>
        </div>

        <div
            class="
                journal-boss-grid
            "
        >
            ${cardsHtml}
        </div>
    `;
}

function refreshBestiaryInterface() {
    const journalScreen =
        document.getElementById(
            "screen-journal"
        );

    if (
        !journalScreen ||
        journalScreen.style.display ===
        "none"
    ) {
        return;
    }

    if (
        currentJournalTab ===
        "bestiary"
    ) {
        renderBestiary();
    }

    if (
        currentJournalTab ===
        "bosses"
    ) {
        renderBossJournal();
    }
}

function renderJournal() {
    const tabButtons =
        document.querySelectorAll(
            "[data-journal-tab]"
        );

    const tabPanels =
        document.querySelectorAll(
            "[data-journal-panel]"
        );

    tabButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.journalTab ===
            currentJournalTab
        );
    });

    tabPanels.forEach(panel => {
        panel.hidden =
            panel.dataset.journalPanel !==
            currentJournalTab;
    });

    if (
        currentJournalTab ===
        "bestiary"
    ) {
        renderBestiary();
    }

    if (
        currentJournalTab ===
        "locations"
    ) {
        renderLocationJournal();
    }

    if (
        currentJournalTab ===
        "bosses"
    ) {
        renderBossJournal();
    }

    if (
        currentJournalTab ===
        "achievements"
    ) {
        renderJournalAchievements();
    }

}

function openJournalTab(
    tabName
) {
    if (
        !allowedJournalTabs.includes(
            tabName
        )
    ) {
        return;
    }

    currentJournalTab =
        tabName;

    localStorage.setItem(
        "idler_journal_tab",
        tabName
    );

    renderJournal();
}

function openJournal() {
    showScreen(
        "screen-journal"
    );

    renderJournal();
}

renderJournal();