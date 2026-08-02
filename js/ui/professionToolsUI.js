const professionToolDefinitions = [
    {
        toolType: "pickaxe",
        professionState: "mining",
        professionName: "Kopalnia",
        toolName: "Kilof",
        icon: "⛏️"
    },
    {
        toolType: "sickle",
        professionState: "herbalism",
        professionName: "Zielarstwo",
        toolName: "Sierp",
        icon: "🌿"
    },
    {
        toolType: "fishingRod",
        professionState: "fishing",
        professionName: "Łowienie",
        toolName: "Wędka",
        icon: "🎣"
    },
    {
        toolType: "alchemyKit",
        professionState: "alchemy",
        professionName: "Alchemia",
        toolName: "Zestaw alchemika",
        icon: "⚗️"
    },
    {
        toolType: "cookingTools",
        professionState: "cooking",
        professionName: "Gotowanie",
        toolName: "Przybory kuchenne",
        icon: "🍳"
    },
    {
        toolType: "craftingHammer",
        professionState: "crafting",
        professionName: "Wytwarzanie",
        toolName: "Młot rzemieślniczy",
        icon: "🔨"
    }
];

const professionToolsBonusLabels = {
    miningSpeedPercent:
        "Szybkość kopania",

    extraOreChancePercent:
        "Szansa na dodatkową rudę",

    herbalismSpeedPercent:
        "Szybkość zielarstwa",

    extraHerbChancePercent:
        "Szansa na dodatkowe zioło",

    fishingSpeedPercent:
        "Szybkość łowienia",

    rareFishChancePercent:
        "Szansa na rzadką rybę",

    alchemySpeedPercent:
        "Szybkość warzenia",

    extraPotionChancePercent:
        "Szansa na dodatkową miksturę",

    cookingExpPercent:
        "Doświadczenie gotowania",

    extraMealChancePercent:
        "Szansa na dodatkową potrawę",

    craftingExpPercent:
        "Doświadczenie wytwarzania",

    materialRefundChancePercent:
        "Szansa na zwrot składnika"
};

function getProfessionLevelForToolDefinition(
    definition
) {
    const professionState =
        player[
            definition.professionState
        ];

    return Math.max(
        1,
        Math.floor(
            Number(
                professionState?.level
            ) || 1
        )
    );
}

function getOwnedProfessionTools(
    toolType
) {
    if (
        !Array.isArray(
            player.inventory
        )
    ) {
        return [];
    }

    return player.inventory
        .map(inventoryEntry => {
            return {
                inventoryEntry:
                    inventoryEntry,

                tool:
                    items[
                        inventoryEntry.itemId
                    ]
            };
        })
        .filter(entry => {
            const quantity =
                Math.max(
                    0,
                    Number(
                        entry
                            .inventoryEntry
                            .quantity
                    ) || 0
                );

            return (
                quantity > 0 &&
                entry.tool &&
                entry.tool.type ===
                    "profession_tool" &&
                entry.tool.toolType ===
                    toolType
            );
        })
        .sort((firstEntry, secondEntry) => {
            const firstLevel =
                Math.max(
                    1,
                    Number(
                        firstEntry
                            .tool
                            .requiredProfessionLevel
                    ) || 1
                );

            const secondLevel =
                Math.max(
                    1,
                    Number(
                        secondEntry
                            .tool
                            .requiredProfessionLevel
                    ) || 1
                );

            if (
                firstLevel !==
                secondLevel
            ) {
                return (
                    firstLevel -
                    secondLevel
                );
            }

            return firstEntry.tool.name
                .localeCompare(
                    secondEntry.tool.name,
                    "pl"
                );
        });
}

function getProfessionToolRarityLabel(
    tool
) {
    if (
        typeof getRarityName ===
        "function"
    ) {
        return getRarityName(
            tool.rarity
        );
    }

    if (
        typeof getItemRarityLabel ===
        "function"
    ) {
        return getItemRarityLabel(
            tool.rarity
        );
    }

    return (
        tool.rarity ||
        "Zwykły"
    );
}

function getProfessionToolBonusesHtml(
    tool
) {
    if (
        !tool ||
        !tool.bonuses ||
        typeof tool.bonuses !==
            "object"
    ) {
        return `
            <div class="profession-tool-no-bonus">
                Brak premii
            </div>
        `;
    }

    const bonuses =
        Object.entries(
            tool.bonuses
        );

    if (
        bonuses.length === 0
    ) {
        return `
            <div class="profession-tool-no-bonus">
                Brak premii
            </div>
        `;
    }

    return bonuses
        .map(entry => {
            const bonusName =
                entry[0];

            const bonusValue =
                Number(
                    entry[1]
                ) || 0;

            const label =
                professionToolsBonusLabels[
                    bonusName
                ] || bonusName;

            return `
                <div class="profession-tool-bonus-row">
                    <span>
                        ${label}
                    </span>

                    <strong>
                        +${bonusValue}%
                    </strong>
                </div>
            `;
        })
        .join("");
}

function getProfessionToolSelectHtml(
    definition,
    professionLevel,
    activeToolId
) {
    const ownedTools =
        getOwnedProfessionTools(
            definition.toolType
        );

    const optionsHtml =
        ownedTools
            .map(entry => {
                const tool =
                    entry.tool;

                const requiredLevel =
                    Math.max(
                        1,
                        Number(
                            tool
                                .requiredProfessionLevel
                        ) || 1
                    );

                const isLocked =
                    professionLevel <
                    requiredLevel;

                const isSelected =
                    activeToolId ===
                    tool.id;

                return `
                    <option
                        value="${tool.id}"
                        ${isSelected
                            ? "selected"
                            : ""
                        }
                        ${isLocked
                            ? "disabled"
                            : ""
                        }
                    >
                        [${getProfessionToolTierLabel(
                            tool
                        )}]
                        ${tool.name}
                        ${isLocked
                            ? (
                                " — wymaga " +
                                requiredLevel +
                                ". poziomu"
                            )
                            : ""
                        }
                    </option>
                `;
            })
            .join("");

    return `
        <div class="profession-tool-selector">
            <label>
                Wybierz narzędzie
            </label>

            <select
                onchange="
                    changeProfessionTool(
                        '${definition.toolType}',
                        this.value
                    )
                "
            >
                <option
                    value=""
                    ${!activeToolId
                        ? "selected"
                        : ""
                    }
                >
                    Brak narzędzia
                </option>

                ${optionsHtml}
            </select>

            ${ownedTools.length === 0
                ? `
                    <span class="profession-tool-selector-empty">
                        Brak pasujących narzędzi
                        w plecaku.
                    </span>
                `
                : ""
            }
        </div>
    `;
}

function getActiveProfessionTool(
    definition
) {
    const activeToolId =
        player.professionTools?.[
            definition.toolType
        ] || null;

    if (!activeToolId) {
        return null;
    }

    const tool =
        items[
            activeToolId
        ];

    const quantity =
        typeof getInventoryItemQuantity ===
            "function"
            ? getInventoryItemQuantity(
                activeToolId
            )
            : 0;

    if (
        !tool ||
        tool.type !==
            "profession_tool" ||
        tool.toolType !==
            definition.toolType ||
        quantity <= 0
    ) {
        player.professionTools[
            definition.toolType
        ] = null;

        return null;
    }

    return tool;
}

function getProfessionToolCardHtml(
    definition
) {
    const professionLevel =
        getProfessionLevelForToolDefinition(
            definition
        );

    const activeTool =
        getActiveProfessionTool(
            definition
        );

    const activeToolId =
        activeTool
            ? activeTool.id
            : null;

    const selectorHtml =
        getProfessionToolSelectHtml(
            definition,
            professionLevel,
            activeToolId
        );

    if (!activeTool) {
        return `
            <article
                class="
                    profession-tool-card
                    profession-tool-card-empty
                "
            >
                <div class="profession-tool-card-header">
                    <div class="profession-tool-icon">
                        ${definition.icon}
                    </div>

                    <div class="profession-tool-title">
                        <span>
                            ${definition.professionName}
                        </span>

                        <strong>
                            ${definition.toolName}
                        </strong>
                    </div>

                    <span class="profession-tool-status empty">
                        Brak
                    </span>
                </div>

                <div class="profession-tool-level">
                    Poziom profesji:
                    <strong>
                        ${professionLevel}
                    </strong>
                </div>

                ${selectorHtml}

                <div class="profession-tool-empty-content">
                    <strong>
                        Brak aktywnego narzędzia
                    </strong>

                    <span>
                        Kup lub wytwórz narzędzie,
                        a następnie wybierz je
                        z listy powyżej.
                    </span>
                </div>
            </article>
        `;
    }

    const requiredLevel =
        Math.max(
            1,
            Number(
                activeTool
                    .requiredProfessionLevel
            ) || 1
        );

    const activeToolTier =
        Math.max(
            1,
            Math.min(
                PROFESSION_TOOL_MAX_TIER,
                Number(
                    activeTool.toolTier
                ) || 1
            )
        );

    return `
        <article
            class="
                profession-tool-card
                rarity-${activeTool.rarity || "common"}
                tool-tier-${activeToolTier}
            "
        >
            <div class="profession-tool-card-header">
                <div class="profession-tool-icon">
                    ${activeTool.icon ||
                    definition.icon}
                </div>

                <div class="profession-tool-title">
                    <span>
                        ${definition.professionName}
                    </span>

                    <strong>
                        ${activeTool.name}
                    </strong>
                </div>

                <span class="profession-tool-status active">
                    Aktywne
                </span>
            </div>

            <div class="profession-tool-tags">
                <span class="profession-tool-tier-badge">
                    Ranga:
                    ${getProfessionToolTierLabel(
                        activeTool
                    )}
                </span>

                <span>
                    ${getProfessionToolRarityLabel(
                        activeTool
                    )}
                </span>

                <span>
                    Poziom profesji:
                    ${professionLevel}
                </span>

                <span>
                    Wymagany:
                    ${requiredLevel}
                </span>
            </div>

            ${selectorHtml}

            <p class="profession-tool-description">
                ${activeTool.description ||
                "Narzędzie używane podczas pracy."}
            </p>

            <div class="profession-tool-bonuses">
                ${getProfessionToolBonusesHtml(
                    activeTool
                )}
            </div>
        </article>
    `;
}

function renderProfessionTools() {
    const container =
        document.getElementById(
            "profession-tools-list"
        );

    if (!container) {
        return;
    }

    if (
        typeof ensureProfessionToolsState ===
        "function"
    ) {
        ensureProfessionToolsState();
    }

    container.innerHTML =
        professionToolDefinitions
            .map(definition => {
                return getProfessionToolCardHtml(
                    definition
                );
            })
            .join("");
}

function refreshProfessionToolsView() {
    if (
        typeof isHeroTabVisible ===
            "function" &&
        !isHeroTabVisible(
            "profession-tools"
        )
    ) {
        return;
    }

    renderProfessionTools();
}

