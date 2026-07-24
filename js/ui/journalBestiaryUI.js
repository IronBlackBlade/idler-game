
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
${getEnemyIcon(
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