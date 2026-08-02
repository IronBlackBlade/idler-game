const equipmentLoadoutSlots = [
    "weapon",
    "shield",
    "helmet",
    "armor",
    "pants",
    "boots",
    "gloves",
    "ring1",
    "ring2",
    "amulet",
    "talisman"
];

const equipmentLoadoutDefinitions = [
    {
        id: "combat",
        name: "Walka",
        icon: "⚔️",
        description: "Komplet do walki"
    },
    {
        id: "mining",
        name: "Kopanie",
        icon: "⛏️",
        description: "Komplet do kopalni"
    },
    {
        id: "herbalism",
        name: "Zielarstwo",
        icon: "🌿",
        description: "Komplet do zbierania"
    },
    {
        id: "hunting",
        name: "Polowanie",
        icon: "🏹",
        description: "Komplet do polowania"
    }
];

function getEmptyEquipmentLoadout() {
    return Object.fromEntries(
        equipmentLoadoutSlots.map(slot => {
            return [slot, null];
        })
    );
}

function ensureEquipmentLoadouts() {
    if (
        !player.equipmentLoadouts ||
        typeof player.equipmentLoadouts !==
            "object" ||
        Array.isArray(
            player.equipmentLoadouts
        )
    ) {
        player.equipmentLoadouts = {};
    }

    equipmentLoadoutDefinitions.forEach(
        definition => {
            const savedLoadout =
                player.equipmentLoadouts[
                    definition.id
                ];

            if (
                !savedLoadout ||
                typeof savedLoadout !==
                    "object" ||
                Array.isArray(savedLoadout)
            ) {
                player.equipmentLoadouts[
                    definition.id
                ] = null;
                return;
            }

            const normalizedLoadout =
                getEmptyEquipmentLoadout();
            let savedPieceCount = 0;

            equipmentLoadoutSlots.forEach(
                slot => {
                    const itemId =
                        savedLoadout[slot];

                    if (
                        typeof itemId ===
                            "string" &&
                        itemId
                    ) {
                        normalizedLoadout[slot] =
                            itemId;
                        savedPieceCount += 1;
                    }
                }
            );

            player.equipmentLoadouts[
                definition.id
            ] = savedPieceCount > 0
                ? normalizedLoadout
                : null;
        }
    );

    return player.equipmentLoadouts;
}

function getEquipmentLoadoutDefinition(
    loadoutId
) {
    return (
        equipmentLoadoutDefinitions.find(
            definition => {
                return (
                    definition.id ===
                    loadoutId
                );
            }
        ) || null
    );
}

function getEquipmentLoadoutSavedPieceCount(
    loadout
) {
    if (!loadout) {
        return 0;
    }

    return equipmentLoadoutSlots.filter(
        slot => Boolean(loadout[slot])
    ).length;
}

function isEquipmentLoadoutActive(loadout) {
    if (!loadout) {
        return false;
    }

    return equipmentLoadoutSlots.every(
        slot => {
            return (
                (
                    player.equipment?.[
                        slot
                    ] || null
                ) ===
                (loadout[slot] || null)
            );
        }
    );
}

function isEquipmentLoadoutItemCompatible(
    item,
    slot
) {
    if (
        typeof canEquipItemInSlot ===
        "function"
    ) {
        return canEquipItemInSlot(
            item,
            slot
        );
    }

    const slotTypes = {
        weapon: "weapon",
        shield: "shield",
        helmet: "helmet",
        armor: "armor",
        pants: "pants",
        boots: "boots",
        gloves: "gloves",
        ring1: "ring",
        ring2: "ring",
        amulet: "amulet",
        talisman: "talisman"
    };

    return (
        item?.type === slotTypes[slot]
    );
}

function getEquipmentLoadoutValidation(
    loadout
) {
    if (!loadout) {
        return {
            ready: false,
            missingItemCount: 0,
            missingItemNames: [],
            levelLockedItemNames: [],
            invalidItemNames: []
        };
    }

    const availableCounts = {};
    const requiredCounts = {};
    const missingItemNames = [];
    const levelLockedItemNames = [];
    const invalidItemNames = [];
    const playerLevel = Math.max(
        1,
        Number(player.level) || 1
    );

    if (Array.isArray(player.inventory)) {
        player.inventory.forEach(entry => {
            const quantity = Math.max(
                0,
                Math.floor(
                    Number(entry.quantity) || 0
                )
            );

            if (quantity <= 0) {
                return;
            }

            availableCounts[entry.itemId] =
                (
                    availableCounts[
                        entry.itemId
                    ] || 0
                ) + quantity;
        });
    }

    equipmentLoadoutSlots.forEach(slot => {
        const equippedItemId =
            player.equipment?.[slot];

        if (equippedItemId) {
            availableCounts[equippedItemId] =
                (
                    availableCounts[
                        equippedItemId
                    ] || 0
                ) + 1;
        }
    });

    equipmentLoadoutSlots.forEach(slot => {
        const itemId = loadout[slot];

        if (!itemId) {
            return;
        }

        const item =
            typeof items !== "undefined"
                ? items[itemId]
                : null;

        if (
            !item ||
            !isEquipmentLoadoutItemCompatible(
                item,
                slot
            )
        ) {
            invalidItemNames.push(
                item?.name || itemId
            );
            return;
        }

        const requiredLevel = Math.max(
            1,
            Number(item.requiredLevel) || 1
        );

        if (playerLevel < requiredLevel) {
            levelLockedItemNames.push(
                item.name
            );
        }

        requiredCounts[itemId] =
            (requiredCounts[itemId] || 0) +
            1;
    });

    let missingItemCount = 0;

    Object.entries(requiredCounts).forEach(
        ([itemId, requiredQuantity]) => {
            const missingQuantity =
                Math.max(
                    0,
                    requiredQuantity -
                        (
                            availableCounts[
                                itemId
                            ] || 0
                        )
                );

            if (missingQuantity <= 0) {
                return;
            }

            missingItemCount +=
                missingQuantity;
            missingItemNames.push(
                items[itemId]?.name || itemId
            );
        }
    );

    return {
        ready:
            missingItemCount === 0 &&
            levelLockedItemNames.length ===
                0 &&
            invalidItemNames.length === 0,
        missingItemCount,
        missingItemNames,
        levelLockedItemNames,
        invalidItemNames
    };
}

function getEquipmentLoadoutPreviewHtml(
    loadout
) {
    if (!loadout) {
        return `
            <span class="equipment-loadout-empty">
                Nie zapisano wyposażenia
            </span>
        `;
    }

    const previewItems =
        equipmentLoadoutSlots
            .map(slot => loadout[slot])
            .filter(Boolean)
            .map(itemId => {
                const item = items[itemId];
                const typeDisplay =
                    getEquipmentTypeDisplay(
                        item
                    );

                return `
                    <span
                        class="equipment-loadout-item"
                        title="${item?.name || itemId}"
                    >
                        ${typeDisplay.icon}
                    </span>
                `;
            });

    return previewItems.join("");
}

function renderEquipmentLoadouts() {
    if (typeof document === "undefined") {
        return;
    }

    const container =
        document.getElementById(
            "equipment-loadout-list"
        );

    if (!container) {
        return;
    }

    ensureEquipmentLoadouts();

    container.innerHTML =
        equipmentLoadoutDefinitions.map(
            definition => {
                const loadout =
                    player.equipmentLoadouts[
                        definition.id
                    ];
                const savedPieceCount =
                    getEquipmentLoadoutSavedPieceCount(
                        loadout
                    );
                const isActive =
                    isEquipmentLoadoutActive(
                        loadout
                    );
                const validation =
                    getEquipmentLoadoutValidation(
                        loadout
                    );
                let statusLabel = "Pusty";
                let statusClass = "is-empty";

                if (isActive) {
                    statusLabel =
                        "Aktualnie założony";
                    statusClass = "is-active";
                } else if (
                    validation
                        .levelLockedItemNames
                        .length > 0
                ) {
                    statusLabel =
                        "Wymaga wyższego poziomu";
                    statusClass = "is-unavailable";
                } else if (
                    validation.missingItemCount >
                        0 ||
                    validation.invalidItemNames
                        .length > 0
                ) {
                    statusLabel =
                        "Brakuje wyposażenia";
                    statusClass = "is-unavailable";
                } else if (loadout) {
                    statusLabel = "Gotowy";
                    statusClass = "is-ready";
                }

                return `
                    <article class="equipment-loadout-card ${statusClass}">
                        <header>
                            <span class="equipment-loadout-icon">
                                ${definition.icon}
                            </span>
                            <div>
                                <strong>${definition.name}</strong>
                                <span>${definition.description}</span>
                            </div>
                            <small>${statusLabel}</small>
                        </header>

                        <div class="equipment-loadout-preview">
                            ${getEquipmentLoadoutPreviewHtml(loadout)}
                        </div>

                        <div class="equipment-loadout-meta">
                            ${loadout
                                ? savedPieceCount + " elementów zapisanych"
                                : "Zapisz aktualnie założone przedmioty"}
                        </div>

                        <div class="equipment-loadout-actions">
                            <button
                                type="button"
                                class="is-secondary"
                                onclick="saveEquipmentLoadout('${definition.id}')"
                            >
                                ${loadout ? "Nadpisz" : "Zapisz"}
                            </button>

                            <button
                                type="button"
                                onclick="equipEquipmentLoadout('${definition.id}')"
                                ${!loadout || isActive || !validation.ready ? "disabled" : ""}
                            >
                                ${isActive ? "Założony" : "Załóż"}
                            </button>
                        </div>
                    </article>
                `;
            }
        ).join("");
}

function saveEquipmentLoadout(loadoutId) {
    const definition =
        getEquipmentLoadoutDefinition(
            loadoutId
        );

    if (!definition) {
        return false;
    }

    ensureEquipmentLoadouts();

    const snapshot =
        getEmptyEquipmentLoadout();

    equipmentLoadoutSlots.forEach(slot => {
        snapshot[slot] =
            player.equipment?.[slot] ||
            null;
    });

    const savedPieceCount =
        getEquipmentLoadoutSavedPieceCount(
            snapshot
        );

    if (savedPieceCount <= 0) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Załóż przynajmniej jeden przedmiot przed zapisaniem kompletu.",
                "error"
            );
        }

        return false;
    }

    if (
        player.equipmentLoadouts[
            loadoutId
        ] &&
        typeof window !== "undefined" &&
        typeof window.confirm ===
            "function" &&
        !window.confirm(
            "Nadpisać zapisany komplet „" +
                definition.name +
                "” aktualnym wyposażeniem?"
        )
    ) {
        return false;
    }

    player.equipmentLoadouts[
        loadoutId
    ] = snapshot;

    if (typeof saveGame === "function") {
        saveGame();
    }

    renderEquipmentLoadouts();

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Zapisano komplet „" +
                definition.name +
                "” — " +
                savedPieceCount +
                " elementów.",
            "success"
        );
    }

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "🧰 Zapisano komplet wyposażenia: " +
                definition.name +
                ".",
            "equipment"
        );
    }

    return true;
}

function equipEquipmentLoadout(loadoutId) {
    const definition =
        getEquipmentLoadoutDefinition(
            loadoutId
        );

    if (!definition) {
        return false;
    }

    ensureEquipmentLoadouts();

    const loadout =
        player.equipmentLoadouts[
            loadoutId
        ];

    if (!loadout) {
        return false;
    }

    if (isEquipmentLoadoutActive(loadout)) {
        return false;
    }

    const validation =
        getEquipmentLoadoutValidation(
            loadout
        );

    if (!validation.ready) {
        let message =
            "Nie można założyć tego kompletu.";

        if (
            validation
                .levelLockedItemNames
                .length > 0
        ) {
            message =
                "Część zapisanego kompletu wymaga wyższego poziomu postaci.";
        } else if (
            validation.missingItemCount > 0
        ) {
            message =
                "Brakuje wyposażenia: " +
                validation.missingItemNames
                    .slice(0, 3)
                    .join(", ") +
                ".";
        }

        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                message,
                "error"
            );
        }

        return false;
    }

    const equipmentBeforeChange = {
        ...player.equipment
    };
    const nextInventory =
        Array.isArray(player.inventory)
            ? player.inventory.map(entry => {
                return {
                    ...entry,
                    quantity: Math.max(
                        0,
                        Math.floor(
                            Number(
                                entry.quantity
                            ) || 0
                        )
                    )
                };
            })
            : [];
    const addToNextInventory = itemId => {
        const existingEntry =
            nextInventory.find(entry => {
                return (
                    entry.itemId === itemId
                );
            });

        if (existingEntry) {
            existingEntry.quantity += 1;
        } else {
            nextInventory.push({
                itemId,
                quantity: 1
            });
        }
    };
    const takeFromNextInventory = itemId => {
        const existingEntry =
            nextInventory.find(entry => {
                return (
                    entry.itemId === itemId &&
                    entry.quantity > 0
                );
            });

        if (!existingEntry) {
            return false;
        }

        existingEntry.quantity -= 1;
        return true;
    };

    equipmentLoadoutSlots.forEach(slot => {
        const itemId =
            player.equipment?.[slot];

        if (itemId) {
            addToNextInventory(itemId);
        }
    });

    const nextEquipment =
        getEmptyEquipmentLoadout();
    let transactionReady = true;

    equipmentLoadoutSlots.forEach(slot => {
        const itemId = loadout[slot];

        if (!itemId) {
            return;
        }

        if (!takeFromNextInventory(itemId)) {
            transactionReady = false;
            return;
        }

        nextEquipment[slot] = itemId;
    });

    if (!transactionReady) {
        return false;
    }

    player.inventory =
        nextInventory.filter(entry => {
            return entry.quantity > 0;
        });

    equipmentLoadoutSlots.forEach(slot => {
        player.equipment[slot] =
            nextEquipment[slot];
    });

    if (
        typeof notifyEquipmentSetThresholdChanges ===
        "function"
    ) {
        notifyEquipmentSetThresholdChanges(
            equipmentBeforeChange,
            player.equipment
        );
    }

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Założono komplet „" +
                definition.name +
                "”.",
            "success"
        );
    }

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "🧰 Założono zapisany komplet: " +
                definition.name +
                ".",
            "equipment"
        );
    }

    if (typeof saveGame === "function") {
        saveGame();
    }

    if (typeof render === "function") {
        render();
    }

    if (
        typeof refreshHeroEquipmentView ===
        "function"
    ) {
        refreshHeroEquipmentView();
    }

    if (
        typeof refreshHeroInventoryView ===
        "function"
    ) {
        refreshHeroInventoryView();
    }

    renderEquipmentLoadouts();

    return {
        loadoutId,
        equippedCount:
            getEquipmentLoadoutSavedPieceCount(
                loadout
            )
    };
}

function getEquipmentSetProgressDotsHtml(
    progress
) {
    return Array.from(
        {
            length:
                progress.totalPieces
        },
        (_, index) => {
            const isActive =
                index <
                progress.equippedPieces;

            return `
                <span class="${isActive ? "is-active" : ""}">
                    ${index + 1}
                </span>
            `;
        }
    ).join("");
}

function getEquipmentSetInventoryQuantity(
    itemId
) {
    if (!Array.isArray(player.inventory)) {
        return 0;
    }

    const inventoryEntry =
        player.inventory.find(entry => {
            return (
                entry.itemId === itemId
            );
        });

    return Math.max(
        0,
        Number(inventoryEntry?.quantity) || 0
    );
}

function getEquipmentSetRecipe(
    itemId
) {
    if (
        typeof recipes === "undefined" ||
        !Array.isArray(recipes)
    ) {
        return null;
    }

    return (
        recipes.find(recipe => {
            return (
                recipe.resultItemId === itemId
            );
        }) || null
    );
}

function getEquipmentSetPartModel(
    itemId,
    progress
) {
    const item =
        typeof items !== "undefined"
            ? items[itemId]
            : null;
    const typeDisplay =
        getEquipmentTypeDisplay(item);
    const isEquipped =
        progress.equippedItemIds.includes(
            itemId
        );
    const inventoryQuantity =
        getEquipmentSetInventoryQuantity(
            itemId
        );
    const requiredLevel = Math.max(
        1,
        Number(item?.requiredLevel) || 1
    );
    const canEquipByLevel =
        Math.max(
            1,
            Number(player.level) || 1
        ) >= requiredLevel;
    const recipe =
        getEquipmentSetRecipe(
            itemId
        );

    if (isEquipped) {
        return {
            item,
            icon: typeDisplay.icon,
            typeName: typeDisplay.name,
            status: "equipped",
            statusLabel: "Założone",
            actionHtml: ""
        };
    }

    if (inventoryQuantity > 0) {
        if (!canEquipByLevel) {
            return {
                item,
                icon: typeDisplay.icon,
                typeName: typeDisplay.name,
                status: "locked",
                statusLabel:
                    "Wymaga poziomu " +
                    requiredLevel,
                actionHtml: `
                    <button
                        type="button"
                        class="equipment-set-part-action is-secondary"
                        disabled
                    >
                        Zablokowane
                    </button>
                `
            };
        }

        return {
            item,
            icon: typeDisplay.icon,
            typeName: typeDisplay.name,
            status: "owned",
            statusLabel:
                "W plecaku · x" +
                inventoryQuantity,
            actionHtml: `
                <button
                    type="button"
                    class="equipment-set-part-action"
                    onclick="equipItem('${itemId}')"
                >
                    Załóż
                </button>
            `
        };
    }

    if (!recipe) {
        return {
            item,
            icon: typeDisplay.icon,
            typeName: typeDisplay.name,
            status: "locked",
            statusLabel: "Brak receptury",
            actionHtml: ""
        };
    }

    const requiredCraftingLevel =
        typeof getRecipeRequiredCraftingLevel ===
            "function"
            ? getRecipeRequiredCraftingLevel(
                recipe
            )
            : Math.max(
                1,
                Number(
                    recipe.requiredCraftingLevel
                ) || 1
            );
    const hasCraftingLevel =
        typeof hasRequiredCraftingLevel ===
            "function"
            ? hasRequiredCraftingLevel(
                recipe
            )
            : (
                Number(
                    player.crafting?.level
                ) || 1
            ) >= requiredCraftingLevel;
    const recipeUnlocked =
        typeof isRecipeUnlocked ===
            "function"
            ? isRecipeUnlocked(recipe.id)
            : recipe.requiresScroll === false;

    if (
        !hasCraftingLevel ||
        !recipeUnlocked
    ) {
        const lockedLabel =
            !hasCraftingLevel
                ? "Rzemiosło Lv. " +
                    requiredCraftingLevel
                : "Wymaga odblokowania";

        return {
            item,
            icon: typeDisplay.icon,
            typeName: typeDisplay.name,
            status: "locked",
            statusLabel: lockedLabel,
            actionHtml: `
                <button
                    type="button"
                    class="equipment-set-part-action is-secondary"
                    onclick="openEquipmentSetRecipe('${itemId}')"
                >
                    Sprawdź
                </button>
            `
        };
    }

    const canCraftNow =
        typeof canCraftRecipe === "function"
            ? canCraftRecipe(recipe, 1)
            : false;

    return {
        item,
        icon: typeDisplay.icon,
        typeName: typeDisplay.name,
        status: "craftable",
        statusLabel: canCraftNow
            ? "Gotowe do wytworzenia"
            : "Do wytworzenia",
        actionHtml: `
            <button
                type="button"
                class="equipment-set-part-action"
                onclick="openEquipmentSetRecipe('${itemId}')"
            >
                Wytwórz
            </button>
        `
    };
}

function getEquipmentSetPartsHtml(
    definition,
    progress
) {
    return definition.itemIds.map(itemId => {
        const model =
            getEquipmentSetPartModel(
                itemId,
                progress
            );

        return `
            <div class="equipment-set-part is-${model.status}">
                <span class="equipment-set-part-icon">
                    ${model.icon}
                </span>

                <div class="equipment-set-part-info">
                    <strong>
                        ${model.item?.name || itemId}
                    </strong>
                    <span>
                        ${model.typeName} · ${model.statusLabel}
                    </span>
                </div>

                ${model.actionHtml}
            </div>
        `;
    }).join("");
}

function openEquipmentSetRecipe(
    itemId
) {
    const recipe =
        getEquipmentSetRecipe(itemId);

    if (!recipe) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Nie znaleziono receptury tego elementu zestawu.",
                "error"
            );
        }

        return false;
    }

    const category =
        typeof getCraftingCategory ===
            "function"
            ? getCraftingCategory(recipe)
            : "armorer";
    const item =
        typeof items !== "undefined"
            ? items[itemId]
            : null;

    if (
        category === "armorer" &&
        typeof setArmorerSubcategory ===
            "function" &&
        item?.type
    ) {
        setArmorerSubcategory(
            item.type
        );
    }

    if (
        typeof setCraftingCategory ===
        "function"
    ) {
        setCraftingCategory(category);
    }

    if (typeof showScreen === "function") {
        showScreen("screen-crafting");
    }

    const focusRecipeCard = () => {
        const recipeCard =
            document.querySelector(
                `[data-crafting-recipe-id="${recipe.id}"]`
            );

        if (!recipeCard) {
            return;
        }

        recipeCard.classList.add(
            "is-set-recipe-focus"
        );
        recipeCard.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        if (typeof setTimeout === "function") {
            setTimeout(() => {
                recipeCard.classList.remove(
                    "is-set-recipe-focus"
                );
            }, 1800);
        }
    };

    if (
        typeof window !== "undefined" &&
        typeof window.requestAnimationFrame ===
            "function"
    ) {
        window.requestAnimationFrame(
            focusRecipeCard
        );
    } else {
        focusRecipeCard();
    }

    return true;
}

function getEquipmentSetBulkEquipModel(
    definition,
    progress
) {
    const playerLevel = Math.max(
        1,
        Number(player.level) || 1
    );
    let availableCount = 0;
    let levelLockedCount = 0;

    definition.itemIds.forEach(itemId => {
        if (
            progress.equippedItemIds.includes(
                itemId
            )
        ) {
            return;
        }

        if (
            getEquipmentSetInventoryQuantity(
                itemId
            ) <= 0
        ) {
            return;
        }

        const item =
            typeof items !== "undefined"
                ? items[itemId]
                : null;
        const requiredLevel = Math.max(
            1,
            Number(item?.requiredLevel) || 1
        );

        if (playerLevel < requiredLevel) {
            levelLockedCount += 1;
            return;
        }

        availableCount += 1;
    });

    if (availableCount > 0) {
        return {
            disabled: false,
            label:
                "Załóż posiadane elementy (" +
                availableCount +
                ")",
            description:
                "Zastąpione przedmioty wrócą do plecaka."
        };
    }

    if (
        progress.equippedPieces >=
        progress.totalPieces
    ) {
        return {
            disabled: true,
            label: "Cały zestaw jest założony",
            description:
                "Wszystkie elementy tego kompletu są aktywne."
        };
    }

    if (levelLockedCount > 0) {
        return {
            disabled: true,
            label: "Wymagany wyższy poziom",
            description:
                "Posiadasz element, którego postać nie może jeszcze założyć."
        };
    }

    return {
        disabled: true,
        label: "Brak elementów do założenia",
        description:
            "Zdobądź lub wytwórz kolejne części zestawu."
    };
}

function equipOwnedEquipmentSet(setId) {
    const definition =
        typeof equipmentSetDefinitions !==
            "undefined"
            ? equipmentSetDefinitions.find(
                set => set.id === setId
            )
            : null;

    if (!definition) {
        return false;
    }

    if (!Array.isArray(player.inventory)) {
        player.inventory = [];
    }

    if (!player.equipment) {
        player.equipment = {};
    }

    const equipmentBeforeChange = {
        ...player.equipment
    };
    const playerLevel = Math.max(
        1,
        Number(player.level) || 1
    );
    let equippedCount = 0;
    let levelLockedCount = 0;
    let missingCount = 0;

    definition.itemIds.forEach(itemId => {
        const item =
            typeof items !== "undefined"
                ? items[itemId]
                : null;
        const slot = item
            ? getSlotForItem(item)
            : null;

        if (!item || !slot) {
            missingCount += 1;
            return;
        }

        if (player.equipment[slot] === itemId) {
            return;
        }

        const inventoryEntry =
            player.inventory.find(entry => {
                return (
                    entry.itemId === itemId &&
                    Number(entry.quantity) > 0
                );
            });

        if (!inventoryEntry) {
            missingCount += 1;
            return;
        }

        const requiredLevel = Math.max(
            1,
            Number(item.requiredLevel) || 1
        );

        if (playerLevel < requiredLevel) {
            levelLockedCount += 1;
            return;
        }

        const previousItemId =
            player.equipment[slot];

        if (
            previousItemId &&
            typeof addItemToInventory ===
                "function"
        ) {
            addItemToInventory(
                previousItemId,
                1
            );
        }

        player.equipment[slot] = itemId;
        inventoryEntry.quantity =
            Math.max(
                0,
                Number(inventoryEntry.quantity) - 1
            );

        if (inventoryEntry.quantity <= 0) {
            player.inventory =
                player.inventory.filter(
                    entry =>
                        entry !== inventoryEntry
                );
        }

        equippedCount += 1;
    });

    if (equippedCount <= 0) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                levelLockedCount > 0
                    ? "Posiadane elementy wymagają wyższego poziomu postaci."
                    : "Nie masz nowych elementów tego zestawu do założenia.",
                "error"
            );
        }

        return false;
    }

    if (
        typeof notifyEquipmentSetThresholdChanges ===
        "function"
    ) {
        notifyEquipmentSetThresholdChanges(
            equipmentBeforeChange,
            player.equipment
        );
    }

    const summaryParts = [
        "Założono " +
            equippedCount +
            " element" +
            (equippedCount === 1
                ? ""
                : "ów") +
            " zestawu " +
            definition.name +
            "."
    ];

    if (levelLockedCount > 0) {
        summaryParts.push(
            levelLockedCount +
                " pominięto z powodu poziomu."
        );
    }

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            summaryParts.join(" "),
            "success"
        );
    }

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "🛡️ " + summaryParts.join(" "),
            "equipment"
        );
    }

    if (typeof saveGame === "function") {
        saveGame();
    }

    if (typeof render === "function") {
        render();
    }

    if (
        typeof refreshHeroEquipmentView ===
        "function"
    ) {
        refreshHeroEquipmentView();
    }

    if (
        typeof refreshHeroInventoryView ===
        "function"
    ) {
        refreshHeroInventoryView();
    }

    return {
        equippedCount,
        levelLockedCount,
        missingCount
    };
}

function renderEquipmentSetSummary() {
    const container =
        document.getElementById(
            "equipment-set-summary"
        );

    if (!container) {
        return;
    }

    if (
        typeof equipmentSetDefinitions ===
            "undefined" ||
        typeof getEquipmentSetProgress !==
            "function"
    ) {
        container.hidden = true;
        container.innerHTML = "";
        return;
    }

    const equippedSets =
        equipmentSetDefinitions
            .map(definition => {
                return {
                    definition,
                    progress:
                        getEquipmentSetProgress(
                            definition
                        )
                };
            })
            .filter(({ progress }) => {
                return progress.equippedPieces > 0;
            });

    if (equippedSets.length === 0) {
        container.hidden = true;
        container.innerHTML = "";
        return;
    }

    container.hidden = false;
    container.innerHTML =
        equippedSets.map(({
            definition,
            progress
        }) => {
            const bulkEquipModel =
                getEquipmentSetBulkEquipModel(
                    definition,
                    progress
                );
            const thresholdsHtml =
                progress.thresholds.map(
                    threshold => {
                        return `
                            <div class="equipment-set-threshold ${threshold.active ? "is-active" : "is-locked"}">
                                <span class="equipment-set-threshold-state">
                                    ${threshold.active ? "✓" : "🔒"}
                                </span>
                                <div>
                                    <strong>
                                        ${threshold.pieces} części — ${threshold.name}
                                    </strong>
                                    <span>${threshold.description}</span>
                                    ${threshold.uniqueEffect ? `
                                        <span class="equipment-set-unique-effect">
                                            <b>UNIKALNY EFEKT · ${threshold.uniqueEffect.name}</b>
                                            ${threshold.uniqueEffect.description}
                                        </span>
                                    ` : ""}
                                </div>
                            </div>
                        `;
                    }
                ).join("");

            return `
                <article class="equipment-set-card equipment-set-${definition.theme} has-pieces">
                    <header>
                        <span class="equipment-set-icon">
                            ${definition.icon}
                        </span>
                        <div>
                            <small>ZESTAW EKWIPUNKU</small>
                            <strong>${definition.name}</strong>
                        </div>
                        <span class="equipment-set-count">
                            ${progress.equippedPieces}/${progress.totalPieces}
                        </span>
                    </header>

                    <div class="equipment-set-progress" aria-label="Założone części: ${progress.equippedPieces} z ${progress.totalPieces}">
                        ${getEquipmentSetProgressDotsHtml(progress)}
                    </div>

                    <div class="equipment-set-bulk-action">
                        <button
                            type="button"
                            onclick="equipOwnedEquipmentSet('${definition.id}')"
                            ${bulkEquipModel.disabled ? "disabled" : ""}
                        >
                            ${bulkEquipModel.label}
                        </button>
                        <span>${bulkEquipModel.description}</span>
                    </div>

                    <div class="equipment-set-parts">
                        ${getEquipmentSetPartsHtml(
                            definition,
                            progress
                        )}
                    </div>

                    <div class="equipment-set-thresholds">
                        ${thresholdsHtml}
                    </div>
                </article>
            `;
        }).join("");
}

function renderEquipmentSlots() {
    const slots = {
        weapon: "slot-weapon",
        shield: "slot-shield",
        helmet: "slot-helmet",
        armor: "slot-armor",
        pants: "slot-pants",
        boots: "slot-boots",
        gloves: "slot-gloves",
        ring1: "slot-ring1",
        ring2: "slot-ring2",
        amulet: "slot-amulet",
        talisman: "slot-talisman"
    };

    Object.keys(slots).forEach(slot => {
        const element = document.getElementById(slots[slot]);

        if (!element) return;


        const slotBox = element.closest(".equipment-slot");

        if (slotBox) {
            const equipmentSetThemeClasses =
                typeof equipmentSetDefinitions !==
                    "undefined"
                    ? equipmentSetDefinitions.map(
                        definition => {
                            return (
                                "equipment-set-piece-" +
                                definition.theme
                            );
                        }
                    )
                    : [];

            slotBox.classList.remove(
                "equipment-set-piece",
                ...equipmentSetThemeClasses
            );
            delete slotBox.dataset
                .equipmentSetId;

            slotBox.dataset
                .equipmentSlot =
                slot;

            slotBox.classList.toggle(
                "selected-slot",
                selectedEquipmentSlot ===
                slot
            );

            slotBox.onclick = event => {
                /*
                 * Kliknięcie przycisku
                 * "Zdejmij" nie może wybierać
                 * całego slotu.
                 */
                if (
                    event.target.closest(
                        "button"
                    )
                ) {
                    return;
                }

                selectEquipmentSlot(
                    slot
                );
            };
        }

        const itemId = player.equipment[slot];

        if (!itemId) {
            if (slotBox) {
                slotBox.classList.add("empty-slot");
            }

            element.innerHTML = "Pusty";
            return;
        }

        if (slotBox) {
            slotBox.classList.remove("empty-slot");
        }

        const item = items[itemId];

        if (!item) {
            element.innerHTML = "Nieznany przedmiot";
            return;
        }

        const equipmentSet =
            typeof getEquipmentSetForItemId ===
                "function"
                ? getEquipmentSetForItemId(
                    itemId
                )
                : null;

        if (
            slotBox &&
            equipmentSet
        ) {
            slotBox.classList.add(
                "equipment-set-piece",
                "equipment-set-piece-" +
                equipmentSet.theme
            );
            slotBox.dataset
                .equipmentSetId =
                equipmentSet.id;
        }

        let stats = "";

        if (item.damage) stats += `<span>Obrażenia: ${item.damage}</span>`;
        if (item.attack) stats += `<span>Atak: +${item.attack}</span>`;
        if (item.armor) stats += `<span>Pancerz: +${item.armor}</span>`;
        if (item.strength) stats += `<span>Siła: +${item.strength}</span>`;
        if (item.dexterity) stats += `<span>Zręczność: +${item.dexterity}</span>`;
        if (item.intelligence) stats += `<span>Inteligencja: +${item.intelligence}</span>`;
        if (item.endurance) stats += `<span>Wytrzymałość: +${item.endurance}</span>`;
        if (item.critChance) stats += `<span>Szansa na krytyk: +${item.critChance} p.p.</span>`;
        if (item.critDamage) stats += `<span>Obrażenia krytyczne: +${item.critDamage} p.p.</span>`;
        if (item.dodgeChance) stats += `<span>Szansa na unik: +${item.dodgeChance} p.p.</span>`;
        if (item.lootBonus) stats += `<span>Bonus do łupu: +${item.lootBonus} p.p.</span>`;

        getWeaponCombatLabels(
            item
        ).forEach(label => {
            stats += `<span>${label}</span>`;
        });
        element.classList.remove(
            "rarity-common",
            "rarity-uncommon",
            "rarity-rare",
            "rarity-epic",
            "rarity-legendary"
        );

        if (item.rarity) {
            element.classList.add("rarity-" + item.rarity);
        }

        element.innerHTML = `
    <div class="equipment-item-content">
        <div>
            <div class="equipment-item-name">${item.name}</div>

            <div class="equipment-item-tags">
                <span>Poziom: ${item.requiredLevel || 1}</span>
                <span>${getRarityName(item.rarity)}</span>
                ${equipmentSet ? `
                    <span class="equipment-set-item-tag">
                        ${equipmentSet.icon} ${equipmentSet.name}
                    </span>
                ` : ""}
                ${stats}
            </div>
        </div>

        <button class="equipment-unequip-btn" onclick="unequipItem('${slot}')">Zdejmij</button>
    </div>
`;
    });

    renderEquipmentLoadouts();
    renderEquipmentSetSummary();

    if (
        typeof renderEquipmentBackpack ===
        "function"
    ) {
        renderEquipmentBackpack();
    }
}


function getEquipmentTypeDisplay(
    item
) {
    const typeDisplays = {
        weapon: {
            icon: "⚔️",
            name: "Broń"
        },

        shield: {
            icon: "🔰",
            name: "Tarcza"
        },

        helmet: {
            icon: "⛑️",
            name: "Hełm"
        },

        armor: {
            icon: "🛡️",
            name: "Pancerz"
        },

        pants: {
            icon: "👖",
            name: "Spodnie"
        },

        boots: {
            icon: "🥾",
            name: "Buty"
        },

        gloves: {
            icon: "🧤",
            name: "Rękawice"
        },

        ring: {
            icon: "💍",
            name: "Pierścień"
        },

        amulet: {
            icon: "📿",
            name: "Amulet"
        },

        talisman: {
            icon: "🔮",
            name: "Talizman"
        }
    };

    return (
        typeDisplays[item?.type] || {
            icon: "🎒",
            name: "Przedmiot"
        }
    );
}

function renderEquipmentBackpack() {
    const container =
        document.getElementById(
            "equipment-backpack-list"
        );

    if (!container) {
        return;
    }

    const inventory =
        Array.isArray(player.inventory)
            ? player.inventory
            : [];

    const equipableInventory =
        inventory.filter(
            inventoryEntry => {
                const item =
                    items[
                    inventoryEntry.itemId
                    ];

                return (
                    inventoryEntry.quantity > 0 &&
                    isEquipableItem(item)
                );
            }
        );

    const selectedSlotDefinition =
        selectedEquipmentSlot
            ? equipmentSlotDefinitions[
            selectedEquipmentSlot
            ]
            : null;

    const descriptionElement =
        document.getElementById(
            "equipment-backpack-description"
        );

    if (descriptionElement) {
        if (selectedSlotDefinition) {
            descriptionElement.textContent =
                "Wybrany slot: " +
                selectedSlotDefinition.label +
                " — najlepsze ulepszenia są wyżej";
        } else {
            descriptionElement.textContent =
                "Przedmioty możliwe do założenia — najlepsze ulepszenia są wyżej";
        }
    }
    renderEquipmentBackpackSubfilters();
    const filteredInventory =
        equipableInventory.filter(
            inventoryEntry => {
                const item =
                    items[
                    inventoryEntry.itemId
                    ];

                if (!item) {
                    return false;
                }

                /*
                 * Wybrany konkretny slot
                 * ma pierwszeństwo przed
                 * filtrami kategorii.
                 */
                if (
                    selectedSlotDefinition
                ) {
                    return (
                        item.type ===
                        selectedSlotDefinition
                            .itemType
                    );
                }

                if (
                    currentEquipmentBackpackFilter ===
                    "all"
                ) {
                    return true;
                }

                const matchesMainCategory =
                    getEquipmentBackpackCategory(
                        item
                    ) ===
                    currentEquipmentBackpackFilter;

                if (!matchesMainCategory) {
                    return false;
                }

                if (
                    currentEquipmentBackpackSubfilter ===
                    "all"
                ) {
                    return true;
                }

                return (
                    getEquipmentBackpackSubcategory(
                        item
                    ) ===
                    currentEquipmentBackpackSubfilter
                );
            }
        );

    filteredInventory.sort(
        compareEquipmentBackpackItems
    );

    const countElement =
        document.getElementById(
            "equipment-backpack-count"
        );

    if (countElement) {
        const totalQuantity =
            equipableInventory.reduce(
                (
                    currentTotal,
                    inventoryEntry
                ) => {
                    return (
                        currentTotal +
                        (
                            Number(
                                inventoryEntry
                                    .quantity
                            ) || 0
                        )
                    );
                },
                0
            );

        countElement.textContent =
            totalQuantity;
    }

    document
        .querySelectorAll(
            ".equipment-backpack-filter"
        )
        .forEach(button => {
            const isActive =
                selectedEquipmentSlot ===
                null &&
                button.dataset
                    .equipmentFilter ===
                currentEquipmentBackpackFilter;

            button.classList.toggle(
                "active",
                isActive
            );
        });

    container.innerHTML = "";

    if (
        filteredInventory.length === 0
    ) {
        const emptyMessage =
            document.createElement(
                "div"
            );

        emptyMessage.className =
            "equipment-backpack-empty";

        if (equipableInventory.length === 0) {
            emptyMessage.textContent =
                "Nie masz przedmiotów, które można założyć.";
        } else if (selectedSlotDefinition) {
            emptyMessage.textContent =
                "Brak przedmiotów pasujących do slotu: " +
                selectedSlotDefinition.label +
                ".";
        } else {
            emptyMessage.textContent =
                "Brak przedmiotów w tej kategorii.";
        }

        container.appendChild(
            emptyMessage
        );

        return;
    }

    filteredInventory.forEach(
        inventoryEntry => {
            const item =
                items[
                inventoryEntry.itemId
                ];

            if (!item) {
                return;
            }

            const typeDisplay =
                getEquipmentTypeDisplay(
                    item
                );

            const comparison =
                getEquipmentItemComparison(
                    item
                );

            const comparisonTargetName =
                comparison.equippedItem
                    ? comparison
                        .equippedItem
                        .name
                    : "Pusty slot";

            const rarityName =
                typeof getRarityName ===
                    "function"
                    ? getRarityName(
                        item.rarity
                    )
                    : item.rarity ||
                    "Zwykły";

            const statsHtml =
                comparison.rows.length > 0
                    ? comparison.rows
                        .map(row => {
                            return `
                    <div
                        class="equipment-comparison-stat
                        ${row.differenceClass}"
                    >
                        <span
                            class="equipment-comparison-label"
                        >
                            ${row.label}
                        </span>

                        <strong
                            class="equipment-comparison-value"
                        >
                            ${row.value}
                        </strong>

                        <span
                            class="equipment-comparison-difference"
                        >
                            ${row.difference}
                        </span>
                    </div>
                `;
                        })
                        .join("")
                    : `
            <div class="equipment-comparison-empty">
            Brak statystyk do porównania
            </div>
        `;

            const setChangePreviewHtml =
                typeof getEquipmentSetChangePreviewHtml ===
                    "function"
                    ? getEquipmentSetChangePreviewHtml(
                        item,
                        comparison.slot
                    )
                    : "";


            const requiredLevel =
                Math.max(
                    1,
                    Number(
                        item.requiredLevel
                    ) || 1
                );

            const playerLevel =
                Math.max(
                    1,
                    Number(
                        player.level
                    ) || 1
                );

            const canEquipByLevel =
                playerLevel >=
                requiredLevel;

            const equipButtonHtml =
                canEquipByLevel
                    ? `
            <button
                class="equipment-equip-button"
                onclick="equipItemFromEquipmentBackpack(
                    '${inventoryEntry.itemId}'
                )"
            >
                Załóż
            </button>
        `
                    : `
            <button
                class="equipment-equip-button
                equipment-equip-button-locked"
                disabled
            >
                Wymaga poziomu
                ${requiredLevel}
            </button>
        `;

            const itemCard =
                document.createElement(
                    "div"
                );

            itemCard.className =
                "equipment-backpack-item " +
                "rarity-" +
                (
                    item.rarity ||
                    "common"
                ) +
                (
                    canEquipByLevel
                        ? ""
                        : " level-locked"
                );

            itemCard.innerHTML = `
    <div class="equipment-backpack-item-main">
        <div class="equipment-backpack-item-icon">
            ${typeDisplay.icon}
        </div>

        <div class="equipment-backpack-item-info">
            <strong>
                ${item.name}
            </strong>

            <span>
                ${typeDisplay.name}
                • Poziom
                ${requiredLevel}
                • ${rarityName}
                • x${inventoryEntry.quantity}
            </span>
        </div>

        ${equipButtonHtml}
    </div>

    <div class="equipment-comparison-target">
        Porównanie z:

        <strong>
            ${comparisonTargetName}
        </strong>
    </div>

    <div class="equipment-backpack-item-stats">
        ${statsHtml}
    </div>

    ${setChangePreviewHtml}
`;


            container.appendChild(
                itemCard
            );
        }
    );
}
