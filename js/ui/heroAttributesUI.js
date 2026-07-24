function formatHeroAttributeMetric(
    value
) {
    const safeValue =
        Number(value) || 0;

    if (
        Number.isInteger(
            safeValue
        )
    ) {
        return String(
            safeValue
        );
    }

    return safeValue
        .toFixed(1)
        .replace(".", ",");
}

const heroAttributeEffectDefinitions = {
    strength: {
        perPoint: [
            "⚔️ +1,8 obrażeń broni w zwarciu",

            "💥 +0,25% obrażeń krytycznych w zwarciu"
        ],

        getEffects(value) {
            const meleeCritDamageBonus =
                Math.min(
                    30,
                    value * 0.25
                );

            return [
                {
                    label:
                        "Obrażenia w zwarciu",

                    value:
                        "+" +
                        formatHeroAttributeMetric(
                            value * 1.8
                        )
                },
                {
                    label:
                        "Premia do krytyków w zwarciu",

                    value:
                        "+" +
                        formatHeroAttributeMetric(
                            meleeCritDamageBonus
                        ) +
                        "%"
                }
            ];
        }
    },

    dexterity: {
        perPoint: [
            "🏹 +1,8 obrażeń broni dystansowej",
            "💨 +0,4% szansy na unik"
        ],

        getEffects(value) {
            return [
                {
                    label:
                        "Obrażenia dystansowe",

                    value:
                        "+" +
                        formatHeroAttributeMetric(
                            value * 1.8
                        )
                },
                {
                    label:
                        "Szansa na unik",

                    value:
                        formatHeroAttributeMetric(
                            Math.min(
                                40,
                                value * 0.4
                            )
                        ) +
                        "%"
                }
            ];
        }
    },

    intelligence: {
        perPoint: [
            "🪄 +1,8 obrażeń broni magicznej",
            "🔵 +10 maksymalnej many"
        ],

        getEffects(value) {
            return [
                {
                    label:
                        "Obrażenia magiczne",

                    value:
                        "+" +
                        formatHeroAttributeMetric(
                            value * 1.8
                        )
                },
                {
                    label:
                        "Maksymalna mana",

                    value:
                        formatHeroAttributeMetric(
                            Math.floor(
                                20 +
                                value * 10
                            )
                        )
                }
            ];
        }
    },

    endurance: {
        perPoint: [
            "❤️ +10 maksymalnego HP",
            "🛡️ +0,5 obrony"
        ],

        getEffects(value) {
            const levelBonus =
                (
                    Math.max(
                        1,
                        Number(
                            player.level
                        ) || 1
                    ) -
                    1
                ) *
                10;

            return [
                {
                    label:
                        "Maksymalne HP",

                    value:
                        formatHeroAttributeMetric(
                            Math.floor(
                                50 +
                                value * 10 +
                                levelBonus
                            )
                        )
                },
                {
                    label:
                        "Obrona",

                    value:
                        formatHeroAttributeMetric(
                            value * 0.5
                        )
                }
            ];
        }
    },

    luck: {
        perPoint: [
            "💥 +0,4% szansy na trafienie krytyczne",
            "🔥 +1% obrażeń krytycznych",
            "🎁 +1% bonusu do łupu"
        ],

        getEffects(value) {
            return [
                {
                    label:
                        "Szansa na krytyk",

                    value:
                        formatHeroAttributeMetric(
                            Math.min(
                                50,
                                value * 0.4
                            )
                        ) +
                        "%"
                },
                {
                    label:
                        "Obrażenia krytyczne",

                    value:
                        formatHeroAttributeMetric(
                            150 +
                            value
                        ) +
                        "%"
                },
                {
                    label:
                        "Bonus do łupu",

                    value:
                        "+" +
                        formatHeroAttributeMetric(
                            value
                        ) +
                        "%"
                }
            ];
        }
    }
};

function getHeroAttributeEffectsHtml(
    effects
) {
    return effects
        .map(effect => {
            return `
                <div class="hero-attribute-effect-row">
                    <span>
                        ${effect.label}
                    </span>

                    <strong>
                        ${effect.value}
                    </strong>
                </div>
            `;
        })
        .join("");
}

function renderHeroAttributeDetails() {
    const totalStats =
        getTotalStats();

    const classBonuses =
        typeof getPlayerClassBonuses ===
            "function"
            ? getPlayerClassBonuses()
            : {
                strength: 0,
                dexterity: 0,
                intelligence: 0,
                endurance: 0,
                luck: 0
            };

    Object.entries(
        heroAttributeEffectDefinitions
    ).forEach(
        ([
            statName,
            definition
        ]) => {
            const valueElement =
                document.getElementById(
                    "hero-" +
                    statName
                );

            if (!valueElement) {
                return;
            }

            const card =
                valueElement.closest(
                    ".hero-attribute-card"
                );

            if (!card) {
                return;
            }

            let details =
                card.querySelector(
                    ".hero-attribute-details"
                );

            if (!details) {
                details =
                    document.createElement(
                        "div"
                    );

                details.className =
                    "hero-attribute-details";

                card.appendChild(
                    details
                );
            }

            const baseValue =
                Number(
                    player.stats?.[
                    statName
                    ]
                ) || 0;

            const totalValue =
                Number(
                    totalStats?.[
                    statName
                    ]
                ) ||
                baseValue;

            const classBonus =
                Number(
                    classBonuses[
                    statName
                    ]
                ) || 0;

            const equipmentBonus =
                totalValue -
                baseValue -
                classBonus;

            const pendingValue =
                Number(
                    pendingAttributeChanges?.[
                    statName
                    ]
                ) || 0;

            const previewValue =
                totalValue +
                pendingValue;

            const currentEffects =
                definition.getEffects(
                    totalValue
                );

            const previewEffects =
                definition.getEffects(
                    previewValue
                );

            const perPointHtml =
                definition.perPoint
                    .map(text => {
                        return `
                            <span>
                                ${text}
                            </span>
                        `;
                    })
                    .join("");

            const previewHtml =
                pendingValue > 0
                    ? `
                        <div
                            class="
                                hero-attribute-effect-panel
                                hero-attribute-effect-preview
                            "
                        >
                            <div
                                class="
                                    hero-attribute-effect-title
                                "
                            >
                                Po zatwierdzeniu
                            </div>

                            ${getHeroAttributeEffectsHtml(
                        previewEffects
                    )}
                        </div>
                    `
                    : "";

            details.innerHTML = `
                <div
                    class="
                        hero-attribute-breakdown
                    "
                >
                    <span>
                        Bazowa
                        <strong>
                            ${formatHeroAttributeMetric(
                baseValue
            )}
                        </strong>
                    </span>
<span>
    Klasa
    <strong>
        ${classBonus >= 0
                    ? "+"
                    : ""
                }${formatHeroAttributeMetric(
                    classBonus
                )}
    </strong>
</span>
                    <span>
                        Ekwipunek
                        <strong>
                            ${equipmentBonus >= 0
                    ? "+"
                    : ""
                }${formatHeroAttributeMetric(
                    equipmentBonus
                )}
                        </strong>
                    </span>

                    <span>
                        Łącznie
                        <strong>
                            ${formatHeroAttributeMetric(
                    totalValue
                )}
                        </strong>
                    </span>
                </div>

                <div
                    class="
                        hero-attribute-per-point
                    "
                >
                    <strong>
                        Każdy punkt daje:
                    </strong>

                    <div>
                        ${perPointHtml}
                    </div>
                </div>

                <div
                    class="
                        hero-attribute-effect-panel
                    "
                >
                    <div
                        class="
                            hero-attribute-effect-title
                        "
                    >
                        Aktualny efekt
                    </div>

                    ${getHeroAttributeEffectsHtml(
                    currentEffects
                )}
                </div>

                ${previewHtml}
            `;
        }
    );
}


function formatPreviewAttribute(
    statName
) {
    const baseValue =
        player.stats[statName] || 0;

    const pendingValue =
        pendingAttributeChanges[
        statName
        ] || 0;

    if (pendingValue <= 0) {
        return String(baseValue);
    }

    return (
        baseValue +
        " +" +
        pendingValue
    );
}
