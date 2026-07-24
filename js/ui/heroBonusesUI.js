let heroActiveBonusesIntervalId = null;

const heroActiveBonusDefinitions = {
    mining_speed: {
        icon: "⛏️",
        name: "Szybkość kopania",

        getDescription(value) {
            return (
                "+" +
                value +
                "% szybkości kopania"
            );
        }
    },

    herbalism_speed: {
        icon: "🌿",
        name: "Szybkość zielarstwa",

        getDescription(value) {
            return (
                "+" +
                value +
                "% szybkości zbierania ziół"
            );
        }
    },

    hunter_luck: {
        icon: "🎯",
        name: "Szczęście łowcy",

        getDescription(value) {
            return (
                "+" +
                value +
                "% szansy na łup"
            );
        }
    },

    melee_weapon_damage: {
        icon: "⚔️",
        name: "Broń w zwarciu",

        getDescription(value) {
            return (
                "+" +
                value +
                "% obrażeń broni w zwarciu"
            );
        }
    },

    ranged_weapon_damage: {
        icon: "🏹",
        name: "Broń dystansowa",

        getDescription(value) {
            return (
                "+" +
                value +
                "% obrażeń łuków i kusz"
            );
        }
    },

    magic_weapon_damage: {
        icon: "🪄",
        name: "Broń magiczna",

        getDescription(value) {
            return (
                "+" +
                value +
                "% obrażeń różdżek i kosturów"
            );
        }
    },

    spell_damage: {
        icon: "🔥",
        name: "Moc czarów",

        getDescription(value) {
            return (
                "+" +
                value +
                "% obrażeń czarów ofensywnych"
            );
        }
    },

    combat_defense: {
        icon: "🛡️",
        name: "Ochrona",

        getDescription(value) {
            return (
                "-" +
                value +
                "% otrzymywanych obrażeń"
            );
        }
    },

    mana_regeneration: {
        icon: "🔵",
        name: "Regeneracja many",

        getDescription(value) {
            let description =
                "+" +
                value +
                "% regeneracji many";

            if (
                typeof getManaRegenerationPerSecond ===
                "function"
            ) {
                const regeneration =
                    getManaRegenerationPerSecond();

                description +=
                    " (" +
                    regeneration
                        .toFixed(1)
                        .replace(".", ",") +
                    " many/s)";
            }

            return description;
        }
    }
};

function formatHeroBonusRemainingTime(
    expiresAt
) {
    const remainingSeconds =
        Math.max(
            0,
            Math.ceil(
                (
                    Number(expiresAt) -
                    Date.now()
                ) / 1000
            )
        );

    const minutes =
        Math.floor(
            remainingSeconds / 60
        );

    const seconds =
        remainingSeconds % 60;

    return (
        minutes +
        ":" +
        String(seconds).padStart(
            2,
            "0"
        )
    );
}

function getActiveHeroBonuses() {
    const activeBonuses = [];
    const currentTime = Date.now();

    const potionEffects =
        player.activeEffects
            ?.potionEffects;

    if (
        potionEffects &&
        typeof potionEffects === "object"
    ) {
        Object.entries(
            potionEffects
        ).forEach(
            ([effectId, effect]) => {
                if (!effect) {
                    return;
                }

                const expiresAt =
                    Number(
                        effect.expiresAt
                    ) || 0;

                if (
                    expiresAt <= currentTime
                ) {
                    return;
                }

                const definition =
                    heroActiveBonusDefinitions[
                    effectId
                    ];

                if (!definition) {
                    return;
                }

                const value =
                    Math.max(
                        0,
                        Number(
                            effect.value
                        ) || 0
                    );

                activeBonuses.push({
                    id: effectId,
                    icon:
                        definition.icon,
                    name:
                        definition.name,
                    description:
                        definition
                            .getDescription(
                                value
                            ),
                    expiresAt:
                        expiresAt
                });
            }
        );
    }

    const barrierExpiresAt =
        Number(
            player.activeEffects
                ?.arcaneBarrierUntil
        ) || 0;

    if (
        barrierExpiresAt >
        currentTime
    ) {
        const barrierReduction =
            typeof getArcaneBarrierDamageReduction ===
                "function"
                ? getArcaneBarrierDamageReduction()
                : 0;

        activeBonuses.push({
            id: "arcane_barrier",
            icon: "🔮",
            name: "Magiczna bariera",

            description:
                "-" +
                barrierReduction +
                "% otrzymywanych obrażeń",

            expiresAt:
                barrierExpiresAt
        });
    }

    return activeBonuses;
}

function renderActiveHeroBonuses() {
    const container =
        document.getElementById(
            "hero-active-bonuses-list"
        );

    if (!container) {
        return;
    }

    if (
        typeof player === "undefined"
    ) {
        return;
    }

    const activeBonuses =
        getActiveHeroBonuses();

    container.innerHTML = "";

    if (
        activeBonuses.length === 0
    ) {
        const emptyMessage =
            document.createElement(
                "div"
            );

        emptyMessage.className =
            "hero-active-bonuses-empty";

        emptyMessage.textContent =
            "Brak aktywnych premii.";

        container.appendChild(
            emptyMessage
        );

        return;
    }

    activeBonuses.forEach(
        bonus => {
            const bonusCard =
                document.createElement(
                    "div"
                );

            bonusCard.className =
                "hero-active-bonus";

            bonusCard.innerHTML = `
                <div class="hero-active-bonus-icon">
                    ${bonus.icon}
                </div>

                <div class="hero-active-bonus-info">
                    <strong>
                        ${bonus.name}
                    </strong>

                    <span>
                        ${bonus.description}
                    </span>
                </div>

                <div class="hero-active-bonus-time">
                    ${formatHeroBonusRemainingTime(
                bonus.expiresAt
            )}
                </div>
            `;

            container.appendChild(
                bonusCard
            );
        }
    );
}

function startHeroActiveBonusesUpdates() {
    if (
        heroActiveBonusesIntervalId !==
        null
    ) {
        clearInterval(
            heroActiveBonusesIntervalId
        );
    }

    heroActiveBonusesIntervalId =
        setInterval(() => {
            renderActiveHeroBonuses();
        }, 1000);
}

startHeroActiveBonusesUpdates();