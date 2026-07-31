const journalAchievementCategories = [
    {
        id: "all",
        icon: "🏆",
        name: "Wszystkie"
    },
    {
        id: "hunting",
        icon: "⚔️",
        name: "Polowanie"
    },
    {
        id: "professions",
        icon: "🧰",
        name: "Profesje"
    },
    {
        id: "collection",
        icon: "📚",
        name: "Kolekcja"
    },
    {
        id: "character",
        icon: "🧙",
        name: "Postać"
    }
];

const savedJournalAchievementCategory =
    localStorage.getItem(
        "idler_journal_achievement_category"
    );

let currentJournalAchievementCategory =
    journalAchievementCategories.some(
        category => {
            return (
                category.id ===
                savedJournalAchievementCategory
            );
        }
    )
        ? savedJournalAchievementCategory
        : "all";

function setJournalAchievementCategory(
    categoryId
) {
    if (
        !journalAchievementCategories.some(
            category => {
                return (
                    category.id ===
                    categoryId
                );
            }
        )
    ) {
        return;
    }

    currentJournalAchievementCategory =
        categoryId;

    localStorage.setItem(
        "idler_journal_achievement_category",
        categoryId
    );

    renderJournalAchievements();
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
        getJournalAchievementDefinitions()
            .map(achievement => {
                return {
                    ...achievement,
                    category:
                        getJournalAchievementCategory(
                            achievement
                        )
                };
            });

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

    const visibleAchievements =
        currentJournalAchievementCategory ===
            "all"
            ? achievements
            : achievements.filter(
                achievement => {
                    return (
                        achievement.category ===
                        currentJournalAchievementCategory
                    );
                }
            );

    const categoryTabsHtml =
        journalAchievementCategories
            .map(category => {
                const categoryAchievements =
                    category.id === "all"
                        ? achievements
                        : achievements.filter(
                            achievement => {
                                return (
                                    achievement.category ===
                                    category.id
                                );
                            }
                        );

                const categoryCompleted =
                    categoryAchievements.filter(
                        achievement => {
                            return Boolean(
                                journal
                                    .unlockedAchievements[
                                achievement.id
                                ]
                            );
                        }
                    ).length;

                return `
                    <button
                        type="button"
                        class="journal-achievement-tab ${
                            currentJournalAchievementCategory ===
                                category.id
                                ? "active"
                                : ""
                        }"
                        onclick="setJournalAchievementCategory('${category.id}')"
                    >
                        <span>${category.icon} ${category.name}</span>
                        <small>
                            ${categoryCompleted}/${categoryAchievements.length}
                        </small>
                    </button>
                `;
            })
            .join("");

    const cardsHtml =
        visibleAchievements
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
            class="journal-achievement-tabs"
            role="tablist"
            aria-label="Kategorie osiągnięć"
        >
            ${categoryTabsHtml}
        </div>

        <div
            class="
                journal-achievement-grid
            "
        >
            ${cardsHtml}
        </div>
    `;

    if (
        typeof markJournalAchievementsSeen ===
            "function"
    ) {
        markJournalAchievementsSeen();
    }
}
