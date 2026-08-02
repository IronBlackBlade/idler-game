function getProfessionToolContextDefinition(
    toolType
) {
    if (
        typeof professionToolDefinitions ===
        "undefined"
    ) {
        return null;
    }

    return (
        professionToolDefinitions.find(
            definition => {
                return (
                    definition.toolType ===
                    toolType
                );
            }
        ) || null
    );
}

function getProfessionToolContextOwnedTools(
    toolType
) {
    if (
        typeof getOwnedProfessionTools ===
        "function"
    ) {
        return getOwnedProfessionTools(
            toolType
        );
    }

    return [];
}

function getProfessionToolContextModel(
    toolType
) {
    const definition =
        getProfessionToolContextDefinition(
            toolType
        );

    if (!definition) {
        return null;
    }

    if (
        typeof ensureProfessionToolsState ===
        "function"
    ) {
        ensureProfessionToolsState();
    }

    const professionLevel =
        typeof getProfessionLevelForTool ===
        "function"
            ? getProfessionLevelForTool(
                toolType
            )
            : 1;
    const ownedTools =
        getProfessionToolContextOwnedTools(
            toolType
        );
    let activeToolId =
        player.professionTools?.[
            toolType
        ] || null;

    if (
        activeToolId &&
        getInventoryItemQuantity(
            activeToolId
        ) <= 0
    ) {
        player.professionTools[
            toolType
        ] = null;
        activeToolId = null;
    }

    const activeTool =
        activeToolId
            ? items[activeToolId]
            : null;
    const usableOwnedTools =
        ownedTools.filter(entry => {
            return (
                Number(
                    entry.tool
                        .requiredProfessionLevel
                ) <= professionLevel
            );
        });
    const bestOwnedEntry =
        usableOwnedTools[
            usableOwnedTools.length - 1
        ] || null;

    if (!activeTool) {
        return {
            definition,
            professionLevel,
            ownedTools,
            bestOwnedTool:
                bestOwnedEntry?.tool ||
                null,
            activeTool: null,
            nextTool: null,
            upgradeRecipe: null,
            materialStates: [],
            canUpgrade: false
        };
    }

    const upgradeRecipe =
        typeof professionToolUpgradeRecipes !==
        "undefined"
            ? professionToolUpgradeRecipes.find(
                recipe => {
                    return (
                        recipe.upgradeFromItemId ===
                        activeTool.id
                    );
                }
            ) || null
            : null;
    const nextTool =
        upgradeRecipe
            ? items[
                upgradeRecipe.resultItemId
            ]
            : null;
    const materialStates =
        upgradeRecipe
            ? upgradeRecipe.materials
                .filter(material => {
                    return (
                        material.itemId !==
                        upgradeRecipe
                            .upgradeFromItemId
                    );
                })
                .map(material => {
                    const owned =
                        typeof getCraftingItemQuantity ===
                        "function"
                            ? getCraftingItemQuantity(
                                material.itemId
                            )
                            : getInventoryItemQuantity(
                                material.itemId
                            );

                    return {
                        itemId: material.itemId,
                        item: items[material.itemId],
                        owned,
                        required:
                            material.quantity,
                        hasEnough:
                            owned >=
                            material.quantity
                    };
                })
            : [];
    const requiredCraftingLevel =
        upgradeRecipe
            ? typeof getRecipeRequiredCraftingLevel ===
                "function"
                ? getRecipeRequiredCraftingLevel(
                    upgradeRecipe
                )
                : Number(
                    upgradeRecipe
                        .requiredCraftingLevel
                ) || 1
            : 0;
    const craftingLevel =
        Math.max(
            1,
            Number(
                player.crafting?.level
            ) || 1
        );
    const goldCost =
        upgradeRecipe
            ? typeof getRecipeTotalGoldCost ===
                "function"
                ? getRecipeTotalGoldCost(
                    upgradeRecipe,
                    1
                )
                : Number(
                    upgradeRecipe.goldCost
                ) || 0
            : 0;
    const hasCraftingLevel =
        craftingLevel >=
        requiredCraftingLevel;
    const hasMaterials =
        materialStates.every(
            material => {
                return material.hasEnough;
            }
        );
    const hasGold =
        player.gold >= goldCost;

    return {
        definition,
        professionLevel,
        ownedTools,
        bestOwnedTool:
            bestOwnedEntry?.tool || null,
        activeTool,
        nextTool,
        upgradeRecipe,
        materialStates,
        craftingLevel,
        requiredCraftingLevel,
        goldCost,
        hasCraftingLevel,
        hasMaterials,
        hasGold,
        canUpgrade:
            Boolean(upgradeRecipe) &&
            hasCraftingLevel &&
            hasMaterials &&
            hasGold
    };
}

function getProfessionToolContextRankHtml(
    activeTier,
    targetTier = 0
) {
    return Array.from(
        {
            length:
                PROFESSION_TOOL_MAX_TIER
        },
        (_, index) => index + 1
    )
        .map(tier => {
            const classes = [];

            if (tier <= activeTier) {
                classes.push(
                    "is-complete"
                );
            }

            if (tier === targetTier) {
                classes.push(
                    "is-next"
                );
            }

            return `
                <span class="${classes.join(" ")}">
                    ${tier}
                </span>
            `;
        })
        .join("");
}

function getProfessionToolContextBonusesHtml(
    tool
) {
    if (!tool?.bonuses) {
        return "";
    }

    return Object.entries(
        tool.bonuses
    )
        .map(([bonusName, bonusValue]) => {
            const label =
                typeof professionToolsBonusLabels !==
                "undefined"
                    ? professionToolsBonusLabels[
                        bonusName
                    ] || bonusName
                    : bonusName;

            return `
                <span>
                    <em>${label}</em>
                    <strong>
                        +${Number(bonusValue) || 0}%
                    </strong>
                </span>
            `;
        })
        .join("");
}

function getProfessionToolContextUpgradeStatus(
    model
) {
    if (model.canUpgrade) {
        return {
            className: "is-ready",
            text: "✓ Ulepszenie dostępne"
        };
    }

    if (!model.hasCraftingLevel) {
        return {
            className: "is-locked",
            text:
                "🔒 Rzemiosło Lv. " +
                model.requiredCraftingLevel
        };
    }

    if (!model.hasMaterials) {
        return {
            className: "is-missing",
            text: "Brakuje materiałów"
        };
    }

    if (!model.hasGold) {
        return {
            className: "is-missing",
            text: "Brakuje złota"
        };
    }

    return {
        className: "",
        text: "Kolejna ranga"
    };
}

function renderLegacyEmptyProfessionToolContext(
    container,
    model
) {
    const hasOwnedTool =
        Boolean(model.bestOwnedTool);

    container.innerHTML = `
        <section class="profession-tool-context-card is-empty">
            <header class="profession-tool-context-header">
                <div class="profession-tool-context-title">
                    <span>${model.definition.icon}</span>
                    <div>
                        <small>NARZĘDZIE · ${model.definition.professionName}</small>
                        <strong>Brak aktywnego narzędzia</strong>
                    </div>
                </div>
                <span class="profession-tool-context-level">
                    Poziom profesji ${model.professionLevel}
                </span>
            </header>

            <div class="profession-tool-context-empty-body">
                <div>
                    <strong>
                        ${hasOwnedTool
                            ? "Masz narzędzie gotowe do użycia"
                            : "Zacznij od narzędzia podstawowego"
                        }
                    </strong>
                    <p>
                        ${hasOwnedTool
                            ? model.bestOwnedTool.name + " czeka w plecaku. Aktywuj je jednym kliknięciem."
                            : "Kup podstawowe narzędzie u kupca, a kolejne rangi ulepszaj w warsztacie."
                        }
                    </p>
                </div>

                <button
                    type="button"
                    class="profession-tool-context-button"
                    onclick="${hasOwnedTool
                        ? "activateBestProfessionToolFromPanel('" + model.definition.toolType + "')"
                        : "openProfessionToolShop()"
                    }"
                >
                    ${hasOwnedTool
                        ? "Załóż " + model.bestOwnedTool.name
                        : "Przejdź do kupca"
                    }
                </button>
            </div>
        </section>
    `;
}

function renderLegacyProfessionToolContextPanel(
    container,
    toolType
) {
    const model =
        getProfessionToolContextModel(
            toolType
        );

    if (!model) {
        container.innerHTML = "";
        return;
    }

    if (!model.activeTool) {
        renderLegacyEmptyProfessionToolContext(
            container,
            model
        );
        return;
    }

    const activeTier =
        Math.max(
            1,
            Number(
                model.activeTool.toolTier
            ) || 1
        );
    const targetTier =
        model.nextTool
            ? Math.max(
                1,
                Number(
                    model.nextTool.toolTier
                ) || activeTier + 1
            )
            : 0;
    const isMaster =
        activeTier >=
        PROFESSION_TOOL_MAX_TIER;
    const status =
        model.upgradeRecipe
            ? getProfessionToolContextUpgradeStatus(
                model
            )
            : null;
    const materialsHtml =
        model.materialStates
            .map(material => {
                return `
                    <span class="${material.hasEnough ? "is-ready" : "is-missing"}">
                        ${material.hasEnough ? "✓" : "✕"}
                        ${material.item?.name || material.itemId}
                        <strong>
                            ${material.owned}/${material.required}
                        </strong>
                    </span>
                `;
            })
            .join("");

    container.innerHTML = `
        <section class="profession-tool-context-card tool-tier-${activeTier} ${isMaster ? "is-master" : ""}">
            <header class="profession-tool-context-header">
                <div class="profession-tool-context-title">
                    <span>${model.definition.icon}</span>
                    <div>
                        <small>AKTYWNE NARZĘDZIE · ${model.definition.professionName}</small>
                        <strong>${model.activeTool.name}</strong>
                    </div>
                </div>

                <div class="profession-tool-context-header-actions">
                    <span class="profession-tool-context-level">
                        Profesja Lv. ${model.professionLevel}
                    </span>
                    <button
                        type="button"
                        class="profession-tool-context-manage"
                        onclick="openProfessionToolsInventory()"
                    >
                        Zmień
                    </button>
                </div>
            </header>

            <div class="profession-tool-context-body">
                <div class="profession-tool-context-current">
                    <div class="profession-tool-context-rank-copy">
                        <span>${getProfessionToolTierLabel(model.activeTool)}</span>
                        <strong>${activeTier}/${PROFESSION_TOOL_MAX_TIER}</strong>
                    </div>

                    <div class="profession-tool-context-ranks">
                        ${getProfessionToolContextRankHtml(activeTier, targetTier)}
                    </div>

                    <div class="profession-tool-context-bonuses">
                        ${getProfessionToolContextBonusesHtml(model.activeTool)}
                    </div>
                </div>

                ${isMaster ? `
                    <div class="profession-tool-context-master">
                        <span>🏆</span>
                        <div>
                            <strong>Osiągnięto rangę mistrzowską</strong>
                            <p>To narzędzie jest rozwinięte do maksymalnej rangi.</p>
                        </div>
                    </div>
                ` : `
                    <div class="profession-tool-context-upgrade">
                        <div class="profession-tool-context-upgrade-title">
                            <div>
                                <small>NASTĘPNE ULEPSZENIE</small>
                                <strong>
                                    ${model.activeTool.name}
                                    <span>→</span>
                                    ${model.nextTool.name}
                                </strong>
                            </div>
                            <span class="profession-tool-context-status ${status.className}">
                                ${status.text}
                            </span>
                        </div>

                        <div class="profession-tool-context-materials">
                            ${materialsHtml}
                            <span class="${model.hasGold ? "is-ready" : "is-missing"}">
                                ${model.hasGold ? "✓" : "✕"}
                                Złoto
                                <strong>${Math.floor(player.gold)}/${model.goldCost}</strong>
                            </span>
                        </div>

                        <button
                            type="button"
                            class="profession-tool-context-button ${model.canUpgrade ? "is-ready" : ""}"
                            onclick="upgradeProfessionToolFromPanel('${model.definition.toolType}')"
                        >
                            Ulepsz
                            <span>↑</span>
                        </button>
                    </div>
                `}
            </div>
        </section>
    `;
}

function renderProfessionToolContextPanel(
    container,
    toolType
) {
    renderLegacyProfessionToolContextPanel(
        container,
        toolType
    );
}

function renderProfessionToolContextPanels() {
    document
        .querySelectorAll(
            "[data-profession-tool-panel]"
        )
        .forEach(container => {
            renderProfessionToolContextPanel(
                container,
                container.dataset
                    .professionToolPanel
            );
        });
}

function getProfessionToolUpgradeBlockedMessage(
    model
) {
    if (!model?.activeTool) {
        return "Najpierw załóż narzędzie profesji.";
    }

    if (!model.upgradeRecipe || !model.nextTool) {
        return "To narzędzie ma już rangę mistrzowską.";
    }

    if (!model.hasCraftingLevel) {
        return (
            "Wymagany poziom rzemiosła: " +
            model.requiredCraftingLevel +
            "."
        );
    }

    const missingMaterials =
        model.materialStates.filter(
            material => {
                return !material.hasEnough;
            }
        );

    if (missingMaterials.length > 0) {
        return (
            "Brakuje materiałów: " +
            missingMaterials
                .map(material => {
                    return (
                        (material.item?.name ||
                            material.itemId) +
                        " " +
                        material.owned +
                        "/" +
                        material.required
                    );
                })
                .join(", ") +
            "."
        );
    }

    if (!model.hasGold) {
        return (
            "Brakuje złota: " +
            Math.floor(player.gold) +
            "/" +
            model.goldCost +
            "."
        );
    }

    return "Nie można teraz ulepszyć tego narzędzia.";
}

function upgradeProfessionToolFromPanel(
    toolType
) {
    const model =
        getProfessionToolContextModel(
            toolType
        );

    if (!model?.canUpgrade) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                getProfessionToolUpgradeBlockedMessage(
                    model
                ),
                "error"
            );
        }

        return false;
    }

    if (
        typeof upgradeProfessionToolImmediately !==
        "function"
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Mechanizm ulepszania jest chwilowo niedostępny.",
                "error"
            );
        }

        return false;
    }

    const result =
        upgradeProfessionToolImmediately(
            model.upgradeRecipe
        );

    if (
        !result &&
        typeof showNotification ===
            "function"
    ) {
        showNotification(
            "Nie udało się ulepszyć narzędzia. Sprawdź wymagania.",
            "error"
        );
    }

    return Boolean(result);
}

function openProfessionToolWorkshop(
    toolType
) {
    if (
        typeof setCraftingCategory ===
        "function"
    ) {
        setCraftingCategory(
            "profession_tools"
        );
    }

    if (
        typeof setProfessionToolsSubcategory ===
        "function"
    ) {
        setProfessionToolsSubcategory(
            toolType
        );
    }

    if (typeof showScreen === "function") {
        showScreen(
            "screen-crafting"
        );
    }

    window.requestAnimationFrame(() => {
        document
            .querySelector(
                ".profession-tool-upgrade-intro"
            )
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    });
}

function openProfessionToolsInventory() {
    if (typeof showScreen === "function") {
        showScreen(
            "screen-hero"
        );
    }

    if (typeof showHeroTab === "function") {
        showHeroTab(
            "profession-tools"
        );
    }
}

function openProfessionToolShop() {
    if (typeof showScreen === "function") {
        showScreen(
            "screen-shop"
        );
    }
}

function activateBestProfessionToolFromPanel(
    toolType
) {
    const model =
        getProfessionToolContextModel(
            toolType
        );

    if (
        !model?.bestOwnedTool ||
        typeof equipProfessionTool !==
        "function"
    ) {
        return;
    }

    equipProfessionTool(
        model.bestOwnedTool.id
    );
}
