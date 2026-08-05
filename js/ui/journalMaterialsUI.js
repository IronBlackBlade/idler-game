const journalMaterialSourceFilters = [
    {
        id: "all",
        icon: "📦",
        name: "Wszystkie"
    },
    {
        id: "mining",
        icon: "⛏️",
        name: "Kopalnia"
    },
    {
        id: "herbalism",
        icon: "🌿",
        name: "Zielarstwo"
    },
    {
        id: "fishing",
        icon: "🎣",
        name: "Łowienie"
    },
    {
        id: "hunting",
        icon: "⚔️",
        name: "Polowanie"
    },
    {
        id: "crafting",
        icon: "🛠️",
        name: "Wytwarzanie"
    },
    {
        id: "alchemy",
        icon: "🧪",
        name: "Alchemia"
    },
    {
        id: "shop",
        icon: "🛒",
        name: "Kupiec"
    }

];

const savedJournalMaterialFilter =
    localStorage.getItem(
        "idler_journal_material_filter"
    );

let currentJournalMaterialFilter =
    journalMaterialSourceFilters.some(
        filter => {
            return (
                filter.id ===
                savedJournalMaterialFilter
            );
        }
    )
        ? savedJournalMaterialFilter
        : "all";

let currentJournalMaterialSearch = "";

function escapeJournalMaterialHtml(
    value
) {
    return String(
        value ?? ""
    )
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function getJournalMaterialIngredients(
    recipe
) {
    if (!recipe) {
        return [];
    }

    return [
        ...(
            Array.isArray(
                recipe.materials
            )
                ? recipe.materials
                : []
        ),
        ...(
            Array.isArray(
                recipe.ingredients
            )
                ? recipe.ingredients
                : []
        )
    ];
}

function getJournalMaterialResultItemId(
    recipe
) {
    if (!recipe) {
        return null;
    }

    return (
        recipe.resultItemId ||
        recipe.resultItem ||
        recipe.outputItemId ||
        recipe.result?.itemId ||
        null
    );
}

function getJournalMaterialIds() {
    const materialIds =
        new Set();

    if (
        typeof recipes !==
        "undefined" &&
        Array.isArray(recipes)
    ) {
        recipes.forEach(recipe => {
            getJournalMaterialIngredients(
                recipe
            ).forEach(material => {
                const itemId =
                    material.itemId ||
                    material.item;

                if (itemId) {
                    materialIds.add(
                        itemId
                    );
                }
            });
        });
    }

    if (
        typeof alchemyRecipes !==
        "undefined" &&
        Array.isArray(
            alchemyRecipes
        )
    ) {
        alchemyRecipes.forEach(
            recipe => {
                getJournalMaterialIngredients(
                    recipe
                ).forEach(ingredient => {
                    const itemId =
                        ingredient.itemId ||
                        ingredient.item;

                    if (itemId) {
                        materialIds.add(
                            itemId
                        );
                    }
                });
            }
        );
    }

    return Array.from(
        materialIds
    );
}

function addJournalMaterialSource(
    sources,
    source
) {
    if (
        !source ||
        !source.text
    ) {
        return;
    }

    const alreadyExists =
        sources.some(
            existingSource => {
                return (
                    existingSource.type ===
                    source.type &&
                    existingSource.text ===
                    source.text
                );
            }
        );

    if (!alreadyExists) {
        sources.push(
            source
        );
    }
}

function getJournalMaterialAreaDropIds(
    area
) {
    if (!area) {
        return [];
    }

    return [
        ...(
            Array.isArray(
                area.basicDrops
            )
                ? area.basicDrops
                : []
        ),
        ...(
            Array.isArray(
                area.rareDrops
            )
                ? area.rareDrops
                : []
        ),
        ...(
            Array.isArray(
                area.exceptionalDrops
            )
                ? area.exceptionalDrops
                : []
        ),
        ...(
            Array.isArray(
                area.treasureDrops
            )
                ? area.treasureDrops
                : []
        )
    ]
        .map(drop => {
            return (
                drop.itemId ||
                drop.item ||
                null
            );
        })
        .filter(Boolean);
}

function addJournalMaterialAreaSources(
    sources,
    itemId,
    areaList,
    sourceType,
    icon,
    sourceName,
    levelKey,
    levelLabel
) {
    if (
        !Array.isArray(
            areaList
        )
    ) {
        return;
    }

    areaList.forEach(area => {
        const dropIds =
            getJournalMaterialAreaDropIds(
                area
            );

        if (
            !dropIds.includes(
                itemId
            )
        ) {
            return;
        }

        const requiredLevel =
            Math.max(
                1,
                Number(
                    area[levelKey]
                ) || 1
            );

        addJournalMaterialSource(
            sources,
            {
                type:
                    sourceType,

                targetId:
                    area.id,

                text:
                    icon +
                    " " +
                    sourceName +
                    " — " +
                    (
                        area.name ||
                        area.id
                    ) +
                    " · " +
                    levelLabel +
                    " " +
                    requiredLevel
            }
        );
    });
}

function getJournalMaterialSources(
    itemId
) {
    const sources = [];

    addJournalMaterialAreaSources(
        sources,
        itemId,
        typeof miningAreas !==
            "undefined"
            ? miningAreas
            : [],
        "mining",
        "⛏️",
        "Kopalnia",
        "requiredMiningLevel",
        "poziom kopania"
    );

    addJournalMaterialAreaSources(
        sources,
        itemId,
        typeof herbalismAreas !==
            "undefined"
            ? herbalismAreas
            : [],
        "herbalism",
        "🌿",
        "Zielarstwo",
        "requiredHerbalismLevel",
        "poziom zielarstwa"
    );

    addJournalMaterialAreaSources(
        sources,
        itemId,
        typeof fishingAreas !==
            "undefined"
            ? fishingAreas
            : [],
        "fishing",
        "🎣",
        "Łowienie",
        "requiredFishingLevel",
        "poziom łowienia"
    );

    if (
        typeof locations !==
        "undefined"
    ) {
        Object.values(
            locations
        ).forEach(location => {
            const enemies =
                Array.isArray(
                    location.enemies
                )
                    ? location.enemies
                    : [];

            enemies.forEach(
                enemyData => {
                    const drops =
                        Array.isArray(
                            enemyData.loot
                        )
                            ? enemyData.loot
                            : [];

                    const hasItem =
                        drops.some(drop => {
                            return (
                                drop.item ===
                                itemId ||
                                drop.itemId ===
                                itemId
                            );
                        });

                    if (!hasItem) {
                        return;
                    }

                    addJournalMaterialSource(
                        sources,
                        {
                            type:
                                "hunting",
                            targetId:
                                location.id,


                            text:
                                "⚔️ Polowanie — " +
                                (
                                    location.name ||
                                    location.id
                                ) +
                                " · " +
                                (
                                    enemyData.name ||
                                    enemyData.id
                                )
                        }
                    );
                }
            );

            const boss =
                location.boss;

            if (boss) {
                const bossDrops =
                    Array.isArray(
                        boss.loot
                    )
                        ? boss.loot
                        : [];

                const bossHasItem =
                    bossDrops.some(drop => {
                        return (
                            drop.item ===
                            itemId ||
                            drop.itemId ===
                            itemId
                        );
                    });

                if (bossHasItem) {
                    addJournalMaterialSource(
                        sources,
                        {
                            type:
                                "hunting",
                            targetId:
                                location.id,

                            text:
                                "👑 Boss — " +
                                (
                                    location.name ||
                                    location.id
                                ) +
                                " · " +
                                (
                                    boss.name ||
                                    boss.id
                                )
                        }
                    );
                }
            }
        });
    }

    if (
        typeof recipes !==
        "undefined" &&
        Array.isArray(recipes)
    ) {
        recipes.forEach(recipe => {
            if (
                getJournalMaterialResultItemId(
                    recipe
                ) !== itemId
            ) {
                return;
            }

            const requiredLevel =
                Math.max(
                    1,
                    Number(
                        recipe
                            .requiredCraftingLevel
                    ) || 1
                );

            addJournalMaterialSource(
                sources,
                {
                    type:
                        "crafting",
                    targetId:
                        recipe.id,

                    text:
                        "🛠️ Wytwarzanie — " +
                        (
                            recipe.name ||
                            recipe.id
                        ) +
                        " · poziom " +
                        requiredLevel
                }
            );
        });
    }

    if (
        typeof alchemyRecipes !==
        "undefined" &&
        Array.isArray(
            alchemyRecipes
        )
    ) {
        alchemyRecipes.forEach(
            recipe => {
                if (
                    getJournalMaterialResultItemId(
                        recipe
                    ) !== itemId
                ) {
                    return;
                }

                const requiredLevel =
                    Math.max(
                        1,
                        Number(
                            recipe
                                .requiredAlchemyLevel
                        ) || 1
                    );

                addJournalMaterialSource(
                    sources,
                    {
                        type:
                            "alchemy",
                        targetId:
                            recipe.id,

                        text:
                            "🧪 Alchemia — " +
                            (
                                recipe.name ||
                                recipe.id
                            ) +
                            " · poziom " +
                            requiredLevel
                    }
                );
            }
        );
    }

    if (
        typeof shopItems !==
        "undefined" &&
        Array.isArray(
            shopItems
        )
    ) {
        shopItems
            .filter(shopItem => {
                return (
                    shopItem.itemId ===
                    itemId
                );
            })
            .forEach(shopItem => {
                const category =
                    typeof shopCategories !==
                        "undefined"
                        ? shopCategories.find(
                            categoryData => {
                                return (
                                    categoryData.id ===
                                    shopItem.category
                                );
                            }
                        )
                        : null;

                addJournalMaterialSource(
                    sources,
                    {
                        type:
                            "shop",

                        targetId:
                            itemId,

                        text:
                            "🛒 Kupiec — " +
                            (
                                category?.name ||
                                "Oferta kupca"
                            )
                    }
                );
            });
    }

    return sources;
}

function getJournalMaterialUses(
    itemId
) {
    const uses = [];

    function addUse(
        type,
        icon,
        recipe,
        requiredQuantity
    ) {
        const safeRequiredQuantity =
            Math.max(
                1,
                Math.floor(
                    Number(
                        requiredQuantity
                    ) || 1
                )
            );

        const existingUse =
            uses.find(use => {
                return (
                    use.type === type &&
                    use.id === recipe.id
                );
            });

        if (existingUse) {
            existingUse.requiredQuantity +=
                safeRequiredQuantity;

            return;
        }

        uses.push({
            id:
                recipe.id,

            type:
                type,

            icon:
                icon,

            name:
                recipe.name ||
                recipe.id,

            requiredQuantity:
                safeRequiredQuantity
        });
    }

    function getRequiredQuantity(
        recipe
    ) {
        return getJournalMaterialIngredients(
            recipe
        ).reduce(
            (
                totalQuantity,
                ingredient
            ) => {
                const ingredientItemId =
                    ingredient.itemId ||
                    ingredient.item;

                if (
                    ingredientItemId !==
                    itemId
                ) {
                    return totalQuantity;
                }

                return (
                    totalQuantity +
                    Math.max(
                        1,
                        Math.floor(
                            Number(
                                ingredient.quantity
                            ) || 1
                        )
                    )
                );
            },
            0
        );
    }

    if (
        typeof recipes !==
        "undefined" &&
        Array.isArray(recipes)
    ) {
        recipes.forEach(recipe => {
            const requiredQuantity =
                getRequiredQuantity(
                    recipe
                );

            if (
                requiredQuantity <= 0
            ) {
                return;
            }

            addUse(
                "crafting",
                "🛠️",
                recipe,
                requiredQuantity
            );
        });
    }

    if (
        typeof alchemyRecipes !==
        "undefined" &&
        Array.isArray(
            alchemyRecipes
        )
    ) {
        alchemyRecipes.forEach(
            recipe => {
                const requiredQuantity =
                    getRequiredQuantity(
                        recipe
                    );

                if (
                    requiredQuantity <= 0
                ) {
                    return;
                }

                addUse(
                    "alchemy",
                    "🧪",
                    recipe,
                    requiredQuantity
                );
            }
        );
    }

    return uses;
}

function getJournalMaterialQuantity(
    itemId
) {
    if (
        typeof getInventoryItemQuantity ===
        "function"
    ) {
        return getInventoryItemQuantity(
            itemId
        );
    }

    if (
        !Array.isArray(
            player.inventory
        )
    ) {
        return 0;
    }

    const inventoryEntry =
        player.inventory.find(
            entry => {
                return (
                    entry.itemId ===
                    itemId
                );
            }
        );

    return Math.max(
        0,
        Number(
            inventoryEntry?.quantity
        ) || 0
    );
}

function getJournalMaterialRarityName(
    rarity
) {
    const rarityNames = {
        common:
            "Zwykły",

        uncommon:
            "Niezwykły",

        rare:
            "Rzadki",

        epic:
            "Epicki",

        legendary:
            "Legendarny"
    };

    return (
        rarityNames[rarity] ||
        "Zwykły"
    );
}

function getJournalMaterialEntries() {
    if (
        typeof items ===
        "undefined"
    ) {
        return [];
    }

    return getJournalMaterialIds()
        .map(itemId => {
            const item =
                items[itemId];

            if (!item) {
                return null;
            }

            const discovered =
                typeof isJournalMaterialDiscovered ===
                    "function"
                    ? isJournalMaterialDiscovered(
                        itemId
                    )
                    : false;

            return {
                id:
                    itemId,

                item:
                    item,

                discovered:
                    discovered,

                quantity:
                    getJournalMaterialQuantity(
                        itemId
                    ),

                sources:
                    getJournalMaterialSources(
                        itemId
                    ),

                uses:
                    getJournalMaterialUses(
                        itemId
                    )
            };
        })
        .filter(Boolean)
        .sort((first, second) => {
            if (
                first.discovered !==
                second.discovered
            ) {
                return (
                    first.discovered
                        ? -1
                        : 1
                );
            }

            return String(
                first.item.name
            ).localeCompare(
                String(
                    second.item.name
                ),
                "pl"
            );
        });
}

function doesJournalMaterialMatchFilterId(
    entry,
    filterId
) {
    if (
        !entry ||
        filterId === "all"
    ) {
        return true;
    }

    /*
     * Pierwsza możliwość:
     * materiał jest zdobywany z danego
     * rodzaju aktywności.
     */
    const matchesSource =
        entry.sources.some(
            source => {
                return (
                    source.type ===
                    filterId
                );
            }
        );

    /*
     * Druga możliwość:
     * materiał jest wykorzystywany
     * przez daną profesję.
     *
     * To właśnie naprawia Alchemię,
     * ponieważ zioła są zdobywane
     * w Zielarstwie, ale używane
     * w recepturach alchemicznych.
     */
    const matchesUse =
        entry.uses.some(
            use => {
                return (
                    use.type ===
                    filterId
                );
            }
        );

    return (
        matchesSource ||
        matchesUse
    );
}

function doesJournalMaterialMatchFilter(
    entry
) {
    return doesJournalMaterialMatchFilterId(
        entry,
        currentJournalMaterialFilter
    );
}
function doesJournalMaterialMatchSearch(
    entry
) {
    const normalizedSearch =
        currentJournalMaterialSearch
            .trim()
            .toLocaleLowerCase(
                "pl"
            );

    if (!normalizedSearch) {
        return true;
    }

    /*
     * Nie ujawniamy nazw
     * nieodkrytych materiałów.
     */
    if (!entry.discovered) {
        return false;
    }

    const searchableText = [
        entry.item.name,
        ...entry.sources.map(
            source => {
                return source.text;
            }
        ),
        ...entry.uses.map(
            use => {
                return use.name;
            }
        )
    ]
        .join(" ")
        .toLocaleLowerCase(
            "pl"
        );

    return searchableText.includes(
        normalizedSearch
    );
}

function setJournalMaterialFilter(
    filterId
) {
    const isAllowed =
        journalMaterialSourceFilters.some(
            filter => {
                return (
                    filter.id ===
                    filterId
                );
            }
        );

    if (!isAllowed) {
        return;
    }

    currentJournalMaterialFilter =
        filterId;

    localStorage.setItem(
        "idler_journal_material_filter",
        filterId
    );

    renderJournalMaterials();
}

function setJournalMaterialSearch(
    searchValue,
    caretPosition = null
) {
    currentJournalMaterialSearch =
        String(
            searchValue || ""
        );

    const savedCaretPosition =
        Number.isFinite(
            Number(caretPosition)
        )
            ? Number(caretPosition)
            : currentJournalMaterialSearch
                .length;

    renderJournalMaterials();

    /*
     * Po ponownym utworzeniu interfejsu
     * przywracamy aktywność pola oraz
     * miejsce, w którym znajdował się
     * kursor.
     */
    requestAnimationFrame(() => {
        const searchInput =
            document.getElementById(
                "journal-material-search-input"
            );

        if (!searchInput) {
            return;
        }

        searchInput.focus();

        const safeCaretPosition =
            Math.max(
                0,
                Math.min(
                    searchInput.value.length,
                    savedCaretPosition
                )
            );

        searchInput.setSelectionRange(
            safeCaretPosition,
            safeCaretPosition
        );
    });
}
function ensureJournalMaterialsUI() {
    const tabContainer =
        document.querySelector(
            ".journal-tabs"
        );

    if (
        tabContainer &&
        !document.getElementById(
            "journal-materials-tab-button"
        )
    ) {
        const button =
            document.createElement(
                "button"
            );

        button.id =
            "journal-materials-tab-button";

        button.type =
            "button";

        button.dataset.journalTab =
            "materials";

        button.innerHTML =
            "📦 Materiały";

        button.addEventListener(
            "click",
            () => {
                openJournalTab(
                    "materials"
                );
            }
        );

        tabContainer.appendChild(
            button
        );
    }

    const journalScreen =
        document.getElementById(
            "screen-journal"
        ) ||
        document.querySelector(
            ".journal-screen"
        );

    if (
        journalScreen &&
        !document.querySelector(
            '[data-journal-panel="materials"]'
        )
    ) {
        const panel =
            document.createElement(
                "section"
            );

        panel.className =
            "journal-panel";

        panel.dataset.journalPanel =
            "materials";

        panel.hidden =
            true;

        panel.innerHTML = `
            <div
                id="journal-materials-list"
            ></div>
        `;

        journalScreen.appendChild(
            panel
        );
    }
    if (
        typeof updateJournalMaterialIndicators ===
        "function"
    ) {
        updateJournalMaterialIndicators();
    }
}

function focusJournalNavigationTarget(
    selector
) {
    /*
     * Dwa requestAnimationFrame dają
     * ekranowi czas na zbudowanie
     * nowych kafelków.
     */
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            const target =
                document.querySelector(
                    selector
                );

            if (!target) {
                return;
            }

            target.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest"
            });

            /*
             * Ponowne uruchomienie animacji,
             * nawet gdy ten sam kafelek
             * został kliknięty drugi raz.
             */
            target.classList.remove(
                "journal-navigation-target"
            );

            void target.offsetWidth;

            target.classList.add(
                "journal-navigation-target"
            );

            setTimeout(() => {
                target.classList.remove(
                    "journal-navigation-target"
                );
            }, 2200);
        });
    });
}

function openJournalMaterialUse(
    useType,
    targetId
) {
    if (
        useType ===
        "crafting" &&
        typeof openCraftingRecipeFromJournal ===
        "function"
    ) {
        openCraftingRecipeFromJournal(
            targetId
        );

        return;
    }

    if (
        useType ===
        "alchemy" &&
        typeof openAlchemyRecipeFromJournal ===
        "function"
    ) {
        openAlchemyRecipeFromJournal(
            targetId
        );
    }
}

function openJournalMaterialSource(
    sourceType,
    targetId = ""
) {
    if (
        sourceType ===
        "crafting" &&
        typeof openCraftingRecipeFromJournal ===
        "function"
    ) {
        openCraftingRecipeFromJournal(
            targetId
        );

        return;
    }

    if (
        sourceType ===
        "alchemy" &&
        typeof openAlchemyRecipeFromJournal ===
        "function"
    ) {
        openAlchemyRecipeFromJournal(
            targetId
        );

        return;
    }

    if (
        sourceType ===
        "shop" &&
        typeof openShopItemFromJournal ===
        "function"
    ) {
        openShopItemFromJournal(
            targetId
        );

        return;
    }

    const screenIds = {
        mining:
            "screen-mining",

        herbalism:
            "screen-herbalism",

        fishing:
            "screen-fishing",

        hunting:
            "screen-hunting"
    };

    const screenId =
        screenIds[
        sourceType
        ];

    if (
        screenId &&
        typeof showScreen ===
        "function"
    ) {
        showScreen(
            screenId
        );
    }
}

function renderJournalMaterials() {
    ensureJournalMaterialsUI();

    const container =
        document.getElementById(
            "journal-materials-list"
        );

    if (!container) {
        return;
    }

    /*
     * Zabezpieczenie dla przedmiotów
     * zdobytych przed podpięciem
     * automatycznego odkrywania.
     */
    if (
        typeof syncJournalMaterialsFromInventory ===
        "function"
    ) {
        syncJournalMaterialsFromInventory();
    }

    const entries =
        getJournalMaterialEntries();

    const discoveredCount =
        entries.filter(entry => {
            return entry.discovered;
        }).length;

    const progressPercent =
        entries.length > 0
            ? (
                discoveredCount /
                entries.length
            ) * 100
            : 0;

    const visibleEntries =
        entries.filter(entry => {
            return (
                doesJournalMaterialMatchFilter(
                    entry
                ) &&
                doesJournalMaterialMatchSearch(
                    entry
                )
            );
        });

    const filterButtonsHtml =
        journalMaterialSourceFilters
            .map(filter => {
                const count =
                    entries.filter(
                        entry => {
                            return (
                                doesJournalMaterialMatchFilterId(
                                    entry,
                                    filter.id
                                )
                            );
                        }
                    ).length;

                return `
                    <button
                        type="button"
                        class="
                            journal-material-filter
                            ${currentJournalMaterialFilter ===
                        filter.id
                        ? "active"
                        : ""
                    }
                        "
                        onclick="
                            setJournalMaterialFilter(
                                '${filter.id}'
                            )
                        "
                    >
                        <span>
                            ${filter.icon}
                            ${filter.name}
                        </span>

                        <small>
                            ${count}
                        </small>
                    </button>
                `;
            })
            .join("");

    const cardsHtml =
        visibleEntries
            .map(entry => {
                if (!entry.discovered) {
                    return `
                        <article
                            class="
                                journal-material-card
                                locked
                            "
                        >
                            <div
                                class="
                                    journal-material-header
                                "
                            >
                                <span
                                    class="
                                        journal-material-icon
                                    "
                                >
                                    🔒
                                </span>

                                <div>
                                    <strong>
                                        ???
                                    </strong>

                                    <span>
                                        Nieodkryty materiał
                                    </span>
                                </div>
                            </div>

                            <p
                                class="
                                    journal-material-locked-text
                                "
                            >
                                Zdobądź ten materiał po raz
                                pierwszy, aby poznać jego
                                źródła i zastosowanie.
                            </p>
                        </article>
                    `;
                }

                const itemName =
                    escapeJournalMaterialHtml(
                        entry.item.name ||
                        entry.id
                    );

                const rarity =
                    entry.item.rarity ||
                    "common";

                const sourcesHtml =
                    entry.sources.length > 0
                        ? entry.sources
                            .map(source => {
                                return `
                    <li>
                        <button
                            type="button"
                            class="
                                journal-material-source-button
                            "
                            onclick="
                                openJournalMaterialSource(
                                    '${source.type}',
                                    '${source.targetId || ""}'
                                )
                            "
                        >
                            <span>
                                ${escapeJournalMaterialHtml(
                                    source.text
                                )
                                    }
                            </span>

                            <strong>
                                →
                            </strong>
                        </button>
                    </li>
                `;
                            })
                            .join("")
                        : `
                            <li
                                class="
                                    journal-material-no-data
                                "
                            >
                                Brak źródła opisanego
                                w danych gry.
                            </li>
                        `;

                const usesHtml =
                    entry.uses.length > 0
                        ? entry.uses
                            .map(use => {
                                const requiredQuantity =
                                    Math.max(
                                        1,
                                        Number(
                                            use.requiredQuantity
                                        ) || 1
                                    );

                                const hasEnough =
                                    entry.quantity >=
                                    requiredQuantity;

                                return `
    <button
        type="button"
        class="
            journal-material-use
            ${hasEnough
                                        ? "enough"
                                        : "missing"
                                    }
        "
        onclick="
            openJournalMaterialUse(
                '${use.type}',
                '${use.id}'
            )
        "
    >
        <strong>
            ${use.icon}
            ${escapeJournalMaterialHtml(
                                        use.name
                                    )
                                    }
        </strong>

        <small>
            ${hasEnough
                                        ? "✅"
                                        : "❌"
                                    }

            Potrzeba:
            x${requiredQuantity}

            · Masz:
            ${entry.quantity}
        </small>
    </button>
`;
                            })
                            .join("")
                        : `
            <span
                class="
                    journal-material-no-data
                "
            >
                Brak znalezionych receptur.
            </span>
        `;

                return `
                    <article
                        class="
                            journal-material-card
                            discovered
                            rarity-${rarity}
                        "
                    >
                        <div
                            class="
                                journal-material-header
                            "
                        >
                            <span
                                class="
                                    journal-material-icon
                                "
                            >
                                ${entry.item.icon ||
                    "📦"
                    }
                            </span>

                            <div>
                                <strong>
                                    ${itemName}
                                </strong>

                                <span>
                                    ${getJournalMaterialRarityName(
                        rarity
                    )
                    }
                                </span>
                            </div>

                            <div
                                class="
                                    journal-material-quantity
                                "
                            >
                                <span>
                                    Posiadasz
                                </span>

                                <strong>
                                    ${entry.quantity
                        .toLocaleString(
                            "pl-PL"
                        )
                    }
                                </strong>
                            </div>
                        </div>

                        <section
                            class="
                                journal-material-section
                            "
                        >
                            <div
                                class="
                                    journal-material-section-title
                                "
                            >
                                <strong>
                                    📍 Skąd zdobyć
                                </strong>

                                <span>
                                    ${entry.sources.length}
                                </span>
                            </div>

                            <ul
                                class="
                                    journal-material-source-list
                                "
                            >
                                ${sourcesHtml}
                            </ul>
                        </section>

                        <section
                            class="
                                journal-material-section
                            "
                        >
                            <div
                                class="
                                    journal-material-section-title
                                "
                            >
                                <strong>
                                    🧰 Wykorzystywany w
                                </strong>

                                <span>
                                    ${entry.uses.length}
                                </span>
                            </div>

                            <div
                                class="
                                    journal-material-use-list
                                "
                            >
                                ${usesHtml}
                            </div>
                        </section>
                    </article>
                `;
            })
            .join("");

    const emptyHtml =
        visibleEntries.length === 0
            ? `
                <div
                    class="
                        journal-material-empty
                    "
                >
                    <span>
                        🔎
                    </span>

                    <strong>
                        Nie znaleziono materiałów
                    </strong>

                    <p>
                        Zmień filtr albo wpisaną
                        nazwę materiału.
                    </p>
                </div>
            `
            : "";

    container.className =
        "journal-material-content";

    container.innerHTML = `
        <section
            class="
                journal-material-summary
            "
        >
            <div
                class="
                    journal-material-summary-header
                "
            >
                <div>
                    <strong>
                        📦 Kompendium materiałów
                    </strong>

                    <span>
                        Materiały używane przez
                        Wytwarzanie i Alchemię
                    </span>
                </div>

                <div>
                    <strong>
                        ${discoveredCount}
                        /
                        ${entries.length}
                    </strong>

                    <span>
                        odkrytych
                    </span>
                </div>
            </div>

            <div
                class="
                    journal-material-progress-track
                "
            >
                <div
                    class="
                        journal-material-progress-fill
                    "
                    style="
                        width:
                        ${progressPercent}%
                    "
                ></div>
            </div>
        </section>

        <section
            class="
                journal-material-controls
            "
        >
            <label
                class="
                    journal-material-search
                "
            >
                <span>
                    🔎
                </span>

               <input
    id="journal-material-search-input"
    type="search"
    placeholder="Wyszukaj materiał, źródło lub recepturę..."
    value="${escapeJournalMaterialHtml(
        currentJournalMaterialSearch
    )
        }"
    oninput="
        setJournalMaterialSearch(
            this.value,
            this.selectionStart
        )
    "
>
            </label>

            <div
                class="
                    journal-material-filters
                "
            >
                ${filterButtonsHtml}
            </div>
        </section>

        <div
            class="
                journal-material-grid
            "
        >
            ${cardsHtml}
        </div>

        ${emptyHtml}
    `;
    if (
        typeof markJournalMaterialsSeen ===
        "function"
    ) {
        markJournalMaterialsSeen();
    }
}

function refreshJournalMaterialsInterface() {
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
        typeof currentJournalTab !==
        "undefined" &&
        currentJournalTab ===
        "materials"
    ) {
        renderJournalMaterials();
    }
}

ensureJournalMaterialsUI();