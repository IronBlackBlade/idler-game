
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
