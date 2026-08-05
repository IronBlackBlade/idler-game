function getGoblinHideoutDungeonState() {
    const keyProgress =
        player.dungeonKeyProgress
            ?.goblinHideout ||
        {
            firstKeyGranted: false,
            bossKillsSinceKey: 0
        };

    const keyQuantity =
        typeof getInventoryItemQuantity ===
            "function"
            ? getInventoryItemQuantity(
                "goblin_hideout_key"
            )
            : 0;

    const unlocked =
        keyProgress.firstKeyGranted ===
            true ||
        keyQuantity > 0;

    return {
        unlocked,
        keyQuantity,
        keyProgress
    };
}

function previewGoblinHideoutStart() {
    const dungeonState =
        getGoblinHideoutDungeonState();

    if (!dungeonState.unlocked) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Najpierw pokonaj Gobliniego Herszta.",
                "error"
            );
        }

        return;
    }

    if (
        dungeonState.keyQuantity <= 0
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Potrzebujesz Klucza do Kryjówki Goblinów.",
                "error"
            );
        }

        return;
    }

    /*
     * Na tym etapie nie zużywamy klucza.
     * Sprawdzamy wyłącznie działanie
     * przycisku i dostępności lochu.
     */
    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Kryjówka Goblinów jest gotowa do rozpoczęcia.",
            "success"
        );
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "🗝️ Przygotowano wyprawę do Kryjówki Goblinów. Klucz nie został jeszcze zużyty.",
            "dungeon"
        );
    }
}

function renderDungeons() {
    const container =
        document.getElementById(
            "dungeons-list"
        );

    if (!container) {
        return;
    }

    const dungeonState =
        getGoblinHideoutDungeonState();

    const unlocked =
        dungeonState.unlocked;

    const keyQuantity =
        dungeonState.keyQuantity;

    const canStart =
        unlocked &&
        keyQuantity > 0;

    let statusText =
        "Nieodkryty";

    if (unlocked) {
        statusText =
            keyQuantity > 0
                ? "Gotowy"
                : "Brak klucza";
    }

    let buttonText =
        "🔒 Pokonaj Gobliniego Herszta";

    if (unlocked) {
        buttonText =
            keyQuantity > 0
                ? "🚪 Rozpocznij wyprawę"
                : "🗝️ Potrzebujesz klucza";
    }

    container.innerHTML = `
        <article
            class="
                game-card
                journal-boss-card
                ${unlocked
                    ? "discovered"
                    : "locked"
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
                    ${unlocked
                        ? "🏚️"
                        : "🔒"
                    }
                </span>

                <div>
                    <strong>
                        ${unlocked
                            ? "Kryjówka Goblinów"
                            : "???"
                        }
                    </strong>

                    <span>
                        Pierwszy loch
                    </span>
                </div>

                <span
                    class="
                        journal-boss-status
                        ${canStart
                            ? "defeated"
                            : ""
                        }
                    "
                >
                    ${statusText}
                </span>
            </div>

            <p>
                ${unlocked
                    ? `
                        Przedostań się przez
                        goblińskie komnaty
                        i pokonaj władcę kryjówki.
                    `
                    : `
                        Pokonaj Gobliniego Herszta,
                        aby odkryć wejście do lochu.
                    `
                }
            </p>

            <div
                class="
                    journal-boss-stats
                "
            >
                <div>
                    <span>
                        Zalecany poziom
                    </span>

                    <strong>
                        10
                    </strong>
                </div>

                <div>
                    <span>
                        Pomieszczenia
                    </span>

                    <strong>
                        5
                    </strong>
                </div>

                <div>
                    <span>
                        Koszt wejścia
                    </span>

                    <strong>
                        1 klucz
                    </strong>
                </div>

                <div>
                    <span>
                        Klucze w plecaku
                    </span>

                    <strong>
                        ${keyQuantity}
                    </strong>
                </div>
            </div>

            <div
                class="
                    journal-boss-first-reward
                    ${canStart
                        ? "claimed"
                        : ""
                    }
                "
            >
                <span>
                    👑 Finałowy boss
                </span>

                <strong>
                    ${unlocked
                        ? "Król Goblinów"
                        : "???"
                    }
                </strong>
            </div>

            <button
                type="button"
                onclick="
                    previewGoblinHideoutStart()
                "
                ${canStart
                    ? ""
                    : "disabled"
                }
            >
                ${buttonText}
            </button>
        </article>
    `;
}