function getGoblinHideoutKeyJournalHtml(
    location,
    boss
) {
    /*
     * Panel klucza pokazujemy wyłącznie
     * przy Goblinim Herszcie w Lesie.
     */
    if (
        location?.id !== "forest" ||
        boss?.id !== "goblin_chief"
    ) {
        return "";
    }

    const keyProgress =
        typeof ensureGoblinHideoutKeyProgress ===
            "function"
            ? ensureGoblinHideoutKeyProgress()
            : (
                player.dungeonKeyProgress
                    ?.goblinHideout || {
                    firstKeyGranted: false,
                    bossKillsSinceKey: 0
                }
            );

    const firstKeyGranted =
        keyProgress.firstKeyGranted ===
        true;

    const bossKillsSinceKey =
        Math.max(
            0,
            Math.floor(
                Number(
                    keyProgress
                        .bossKillsSinceKey
                ) || 0
            )
        );

    const keyQuantity =
        typeof getInventoryItemQuantity ===
            "function"
            ? getInventoryItemQuantity(
                "goblin_hideout_key"
            )
            : 0;

    /*
     * Licznik zwiększa się dopiero po
     * zabiciu bossa, dlatego sprawdzamy
     * szansę dla następnej wartości.
     */
    const nextBossChance =
        firstKeyGranted &&
            typeof getGoblinHideoutKeyDropChance ===
            "function"
            ? getGoblinHideoutKeyDropChance(
                bossKillsSinceKey + 1
            )
            : 100;

    const chanceText =
        firstKeyGranted
            ? nextBossChance + "%"
            : "Gwarantowany";

    return `
        <div
            class="
                journal-boss-first-reward
            "
        >
            <span>
                🗝️ Klucz do Kryjówki Goblinów
            </span>

            <strong>
                ${keyQuantity} w plecaku
            </strong>
        </div>

        <div
            class="
                journal-boss-stats
            "
        >
            <div>
                <span>
                    Bossowie od klucza
                </span>

                <strong>
                    ${bossKillsSinceKey}
                </strong>
            </div>

            <div>
                <span>
                    Następna szansa
                </span>

                <strong>
                    ${chanceText}
                </strong>
            </div>

            <div>
                <span>
                    Pierwszy klucz
                </span>

                <strong>
                    ${firstKeyGranted
            ? "Zdobyty"
            : "Gwarantowany"
        }
                </strong>
            </div>
        </div>
    `;
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
                const dungeonKeyHtml =
                    getGoblinHideoutKeyJournalHtml(
                        location,
                        boss
                    );

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
                                journal-boss-first-reward
                                ${rewardClaimed
                        ? "claimed"
                        : ""
                    }
    "
>
    ${firstRewardHtml}
    
</div>
${dungeonKeyHtml}
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

