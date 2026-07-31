const journalProfessionDefinitions = [
    {
        id: "mining",
        icon: "⛏️",
        name: "Kopalnia",
        description: "Wydobyte surowce, odkryte złoża i postęp w szybach."
    },
    {
        id: "herbalism",
        icon: "🌿",
        name: "Zielarstwo",
        description: "Zebrane rośliny, rzadkie okazy i odwiedzone obszary."
    },
    {
        id: "fishing",
        icon: "🎣",
        name: "Łowienie",
        description: "Połowy, skarby, zlecenia i rekordowe okazy."
    },
    {
        id: "alchemy",
        icon: "🧪",
        name: "Alchemia",
        description: "Uwarzone mikstury i poznane receptury alchemiczne."
    },
    {
        id: "cooking",
        icon: "🍳",
        name: "Gotowanie",
        description: "Przygotowane potrawy i renoma Karczmy Pod Złotym Karpiem."
    },
    {
        id: "crafting",
        icon: "🛠️",
        name: "Wytwarzanie",
        description: "Wytworzone przedmioty i odblokowane receptury."
    }
];

const savedJournalProfession =
    localStorage.getItem(
        "idler_journal_profession"
    );

let currentJournalProfession =
    journalProfessionDefinitions.some(
        definition => {
            return (
                definition.id ===
                savedJournalProfession
            );
        }
    )
        ? savedJournalProfession
        : "mining";

function openJournalProfession(
    professionId
) {
    if (
        !journalProfessionDefinitions.some(
            definition => {
                return (
                    definition.id ===
                    professionId
                );
            }
        )
    ) {
        return;
    }

    currentJournalProfession =
        professionId;

    localStorage.setItem(
        "idler_journal_profession",
        professionId
    );

    renderJournalProfessions();
}

function normalizeJournalProfessionState(
    professionId
) {
    const ensureFunctions = {
        mining: "ensureMiningState",
        herbalism: "ensureHerbalismState",
        fishing: "ensureFishingState",
        alchemy: "ensureAlchemyState",
        cooking: "ensureCookingState",
        crafting: "ensureCraftingState"
    };

    const ensureFunction =
        globalThis[
            ensureFunctions[professionId]
        ];

    if (
        typeof ensureFunction ===
        "function"
    ) {
        ensureFunction();
    }

    const state =
        player[professionId] || {};

    return {
        ...state,
        level: Math.max(
            1,
            Math.floor(
                Number(state.level) || 1
            )
        ),
        exp: Math.max(
            0,
            Math.floor(
                Number(state.exp) || 0
            )
        ),
        expToNextLevel: Math.max(
            1,
            Math.floor(
                Number(
                    state.expToNextLevel
                ) || 1
            )
        ),
        statistics:
            state.statistics || {}
    };
}

function formatJournalProfessionNumber(
    value
) {
    return Math.max(
        0,
        Math.floor(Number(value) || 0)
    ).toLocaleString("pl-PL");
}

function getJournalProfessionMetrics(
    professionId,
    state
) {
    const statistics =
        state.statistics || {};

    const metricDefinitions = {
        mining: [
            ["🔁", "Cykle", statistics.totalCycles],
            ["🪨", "Surowce", statistics.totalResources],
            ["💎", "Rzadkie", statistics.rareResources],
            ["✨", "Wyjątkowe", statistics.exceptionalResources]
        ],
        herbalism: [
            ["🔁", "Wyprawy", statistics.totalCycles],
            ["🌱", "Składniki", statistics.totalIngredients],
            ["🌺", "Rzadkie", statistics.rareIngredients],
            ["✨", "Wyjątkowe", statistics.exceptionalIngredients]
        ],
        fishing: [
            ["🔁", "Połowy", statistics.totalCycles],
            ["🐟", "Ryby", statistics.totalFish],
            ["🌟", "Rzadkie", statistics.rareFish],
            ["🧰", "Skarby", statistics.treasures],
            ["📦", "Zlecenia", statistics.totalOrdersCompleted]
        ],
        alchemy: [
            ["🧪", "Uwarzone", statistics.totalCrafted],
            ["📖", "Receptury", getJournalKnownRecipeCount("alchemy", state)],
            ["⏳", "W kolejce", Array.isArray(state.queue) ? state.queue.length : 0]
        ],
        cooking: [
            ["🍲", "Porcje", statistics.totalMealsCooked],
            ["📖", "Poznane potrawy", Object.keys(statistics.recipesById || {}).length],
            ["🍻", "Zamówienia", state.tavern?.completedOrders],
            ["🏅", "Poziom karczmy", state.tavern?.level]
        ],
        crafting: [
            ["⚒️", "Wytworzone", statistics.totalCrafted],
            ["📖", "Receptury", getJournalKnownRecipeCount("crafting", state)],
            ["⏳", "W kolejce", Array.isArray(state.queue) ? state.queue.length : 0]
        ]
    };

    return (
        metricDefinitions[professionId] || []
    ).map(metric => {
        return {
            icon: metric[0],
            label: metric[1],
            value:
                formatJournalProfessionNumber(
                    metric[2]
                )
        };
    });
}

function getJournalKnownRecipeCount(
    professionId,
    state
) {
    if (
        professionId === "alchemy" &&
        typeof alchemyRecipes !==
            "undefined"
    ) {
        return alchemyRecipes.filter(
            recipe => {
                return (
                    state.level >=
                    Math.max(
                        1,
                        Number(
                            recipe.requiredAlchemyLevel
                        ) || 1
                    )
                );
            }
        ).length;
    }

    if (
        professionId === "crafting" &&
        typeof recipes !== "undefined"
    ) {
        return recipes.filter(recipe => {
            const hasLevel =
                state.level >=
                Math.max(
                    1,
                    Number(
                        recipe.requiredCraftingLevel
                    ) || 1
                );
            const hasRecipe =
                recipe.requiresScroll === false ||
                (
                    Array.isArray(
                        player.unlockedRecipes
                    ) &&
                    player.unlockedRecipes.includes(
                        recipe.id
                    )
                );

            return hasLevel && hasRecipe;
        }).length;
    }

    return 0;
}

function getJournalProfessionAreaData(
    professionId,
    state
) {
    const areaDefinitions = {
        mining: {
            list:
                typeof miningAreas !==
                    "undefined"
                    ? miningAreas
                    : [],
            levelKey:
                "requiredMiningLevel"
        },
        herbalism: {
            list:
                typeof herbalismAreas !==
                    "undefined"
                    ? herbalismAreas
                    : [],
            levelKey:
                "requiredHerbalismLevel"
        },
        fishing: {
            list:
                typeof fishingAreas !==
                    "undefined"
                    ? fishingAreas
                    : [],
            levelKey:
                "requiredFishingLevel"
        }
    }[professionId];

    if (!areaDefinitions) {
        return [];
    }

    return areaDefinitions.list.map(area => {
        const requiredLevel =
            Math.max(
                1,
                Number(
                    area[
                        areaDefinitions.levelKey
                    ]
                ) || 1
            );

        return {
            id: area.id,
            name: area.name,
            requiredLevel,
            unlocked:
                state.level >=
                requiredLevel,
            cycles: Math.max(
                0,
                Math.floor(
                    Number(
                        state.statistics
                            ?.cyclesByArea
                            ?.[area.id]
                    ) || 0
                )
            )
        };
    });
}

function getJournalProfessionDropIds(
    areas
) {
    const dropIds = [];

    areas.forEach(area => {
        [
            ...(area.basicDrops || []),
            ...(area.rareDrops || []),
            ...(area.exceptionalDrops || []),
            ...(area.treasureDrops || [])
        ].forEach(drop => {
            if (
                drop.itemId &&
                !dropIds.includes(drop.itemId)
            ) {
                dropIds.push(drop.itemId);
            }
        });
    });

    return dropIds;
}

function getJournalProfessionCollection(
    professionId,
    state
) {
    const statistics =
        state.statistics || {};

    if (
        professionId === "mining" ||
        professionId === "herbalism" ||
        professionId === "fishing"
    ) {
        const sourceAreas =
            professionId === "mining"
                ? miningAreas
                : professionId === "herbalism"
                    ? herbalismAreas
                    : fishingAreas;
        const quantities =
            professionId === "mining"
                ? statistics.resourcesByItem || {}
                : professionId === "herbalism"
                    ? statistics.ingredientsByItem || {}
                    : statistics.fishByItem || {};

        return getJournalProfessionDropIds(
            sourceAreas
        ).map(itemId => {
            const quantity =
                Math.max(
                    0,
                    Math.floor(
                        Number(
                            quantities[itemId]
                        ) || 0
                    )
                );
            const item =
                typeof items !== "undefined"
                    ? items[itemId]
                    : null;
            const record =
                professionId === "fishing"
                    ? statistics.recordsByItem
                        ?.[itemId]
                    : null;

            return {
                id: itemId,
                icon: item?.icon ||
                    (
                        professionId === "mining"
                            ? "🪨"
                            : professionId === "herbalism"
                                ? "🌱"
                                : "🐟"
                    ),
                name: item?.name || itemId,
                discovered: quantity > 0,
                detail:
                    "Zdobyto: " +
                    formatJournalProfessionNumber(
                        quantity
                    ) +
                    (
                        record?.sizeCm
                            ? " • Rekord: " +
                                Number(
                                    record.sizeCm
                                ).toFixed(1) +
                                " cm"
                            : ""
                    )
            };
        });
    }

    if (
        professionId === "alchemy"
    ) {
        return (
            typeof alchemyRecipes !==
                "undefined"
                ? alchemyRecipes
                : []
        ).map(recipe => {
            const requiredLevel =
                Math.max(
                    1,
                    Number(
                        recipe.requiredAlchemyLevel
                    ) || 1
                );

            return {
                id: recipe.id,
                icon: recipe.icon || "🧪",
                name: recipe.name,
                discovered:
                    state.level >=
                    requiredLevel,
                detail:
                    "Wymagany poziom: " +
                    requiredLevel
            };
        });
    }

    if (
        professionId === "cooking"
    ) {
        return (
            typeof cookingRecipes !==
                "undefined"
                ? cookingRecipes
                : []
        ).map(recipe => {
            const cooked = Math.max(
                0,
                Math.floor(
                    Number(
                        statistics.recipesById
                            ?.[recipe.id]
                    ) || 0
                )
            );

            return {
                id: recipe.id,
                icon: recipe.icon || "🍲",
                name: recipe.name,
                discovered: cooked > 0,
                detail:
                    "Ugotowano: " +
                    formatJournalProfessionNumber(
                        cooked
                    )
            };
        });
    }

    if (
        professionId === "crafting"
    ) {
        return (
            typeof recipes !== "undefined"
                ? recipes
                : []
        ).map(recipe => {
            const requiredLevel =
                Math.max(
                    1,
                    Number(
                        recipe.requiredCraftingLevel
                    ) || 1
                );
            const discovered =
                state.level >= requiredLevel &&
                (
                    recipe.requiresScroll === false ||
                    (
                        Array.isArray(
                            player.unlockedRecipes
                        ) &&
                        player.unlockedRecipes.includes(
                            recipe.id
                        )
                    )
                );

            return {
                id: recipe.id,
                icon: "📜",
                name: recipe.name,
                discovered,
                detail:
                    "Wymagany poziom: " +
                    requiredLevel
            };
        });
    }

    return [];
}

function renderJournalProfessions() {
    const container =
        document.getElementById(
            "journal-professions-list"
        );

    if (!container) {
        return;
    }

    const definition =
        journalProfessionDefinitions.find(
            currentDefinition => {
                return (
                    currentDefinition.id ===
                    currentJournalProfession
                );
            }
        ) ||
        journalProfessionDefinitions[0];
    const state =
        normalizeJournalProfessionState(
            definition.id
        );
    const progressPercent = Math.min(
        100,
        (
            state.exp /
            state.expToNextLevel
        ) * 100
    );
    const metrics =
        getJournalProfessionMetrics(
            definition.id,
            state
        );
    const areas =
        getJournalProfessionAreaData(
            definition.id,
            state
        );
    const collection =
        getJournalProfessionCollection(
            definition.id,
            state
        );
    const discoveredCount =
        collection.filter(entry => {
            return entry.discovered;
        }).length;

    const tabsHtml =
        journalProfessionDefinitions
            .map(tabDefinition => {
                const professionState =
                    player[
                        tabDefinition.id
                    ] || {};

                return `
                    <button
                        type="button"
                        class="journal-profession-tab ${
                            tabDefinition.id ===
                            definition.id
                                ? "active"
                                : ""
                        }"
                        onclick="openJournalProfession('${tabDefinition.id}')"
                    >
                        <span>
                            ${tabDefinition.icon}
                            ${tabDefinition.name}
                        </span>
                        <small>
                            Poz. ${Math.max(1, Number(professionState.level) || 1)}
                        </small>
                    </button>
                `;
            })
            .join("");

    const metricsHtml = metrics
        .map(metric => {
            return `
                <div class="journal-profession-stat">
                    <span>${metric.icon} ${metric.label}</span>
                    <strong>${metric.value}</strong>
                </div>
            `;
        })
        .join("");

    const areasHtml = areas.length > 0
        ? `
            <section class="journal-profession-section">
                <div class="journal-profession-section-title">
                    <strong>🗺️ Obszary aktywności</strong>
                    <span>
                        ${areas.filter(area => area.unlocked).length}/${areas.length} odblokowanych
                    </span>
                </div>
                <div class="journal-profession-area-grid">
                    ${areas.map(area => {
                        return `
                            <article class="journal-profession-area ${area.unlocked ? "" : "locked"}">
                                <div>
                                    <strong>${area.unlocked ? area.name : "🔒 ???"}</strong>
                                    <span>Wymagany poziom: ${area.requiredLevel}</span>
                                </div>
                                <div>
                                    <span>Ukończone cykle</span>
                                    <strong>${formatJournalProfessionNumber(area.cycles)}</strong>
                                </div>
                            </article>
                        `;
                    }).join("")}
                </div>
            </section>
        `
        : "";

    const tavernHtml =
        definition.id === "cooking"
            ? `
                <section class="journal-profession-special">
                    <div>
                        <span>🍻 Karczma Pod Złotym Karpiem</span>
                        <strong>Poziom ${formatJournalProfessionNumber(state.tavern?.level || 1)}</strong>
                    </div>
                    <div class="journal-profession-special-stats">
                        <span>
                            Renoma:
                            <strong>${formatJournalProfessionNumber(state.tavern?.reputation)}/${formatJournalProfessionNumber(state.tavern?.reputationToNextLevel)}</strong>
                        </span>
                        <span>
                            Zarobione złoto:
                            <strong>${formatJournalProfessionNumber(state.tavern?.totalGoldEarned)}</strong>
                        </span>
                    </div>
                </section>
            `
            : "";

    const collectionHtml = collection
        .map(entry => {
            return `
                <article class="journal-profession-discovery ${entry.discovered ? "discovered" : "locked"}">
                    <span class="journal-profession-discovery-icon">
                        ${entry.discovered ? entry.icon : "🔒"}
                    </span>
                    <div>
                        <strong>${entry.discovered ? entry.name : "???"}</strong>
                        <span>${entry.discovered ? entry.detail : "Jeszcze nieodkryte"}</span>
                    </div>
                </article>
            `;
        })
        .join("");

    container.innerHTML = `
        <div class="journal-profession-content">
            <div class="journal-profession-tabs">
                ${tabsHtml}
            </div>

            <section class="journal-profession-overview" data-profession="${definition.id}">
                <div class="journal-profession-overview-header">
                    <span class="journal-profession-main-icon">${definition.icon}</span>
                    <div>
                        <strong>${definition.name}</strong>
                        <span>${definition.description}</span>
                    </div>
                    <div class="journal-profession-level">
                        <span>Poziom</span>
                        <strong>${state.level}</strong>
                    </div>
                </div>

                <div class="journal-profession-exp-info">
                    <span>Doświadczenie profesji</span>
                    <strong>${formatJournalProfessionNumber(state.exp)} / ${formatJournalProfessionNumber(state.expToNextLevel)}</strong>
                </div>
                <div class="journal-profession-exp-track">
                    <div class="journal-profession-exp-fill" style="width: ${progressPercent}%"></div>
                </div>

                <div class="journal-profession-stats">
                    ${metricsHtml}
                </div>
            </section>

            ${tavernHtml}
            ${areasHtml}

            <section class="journal-profession-section">
                <div class="journal-profession-section-title">
                    <strong>📚 Odkrycia</strong>
                    <span>${discoveredCount}/${collection.length} odkrytych</span>
                </div>
                <div class="journal-profession-discovery-grid">
                    ${collectionHtml}
                </div>
            </section>
        </div>
    `;
}
