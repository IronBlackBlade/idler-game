const alchemyCategories = [
    {
        id: "hunting",
        name: "⚔️ Polowanie"
    },
    {
        id: "gathering",
        name: "🌿 Zbieractwo"
    },
    {
        id: "mining",
        name: "⛏️ Kopalnia"
    }
];

let currentAlchemyCategory =
    localStorage.getItem(
        "idler_alchemy_category"
    ) || "hunting";

function setAlchemyCategory(categoryId) {
    currentAlchemyCategory =
        categoryId;

    localStorage.setItem(
        "idler_alchemy_category",
        categoryId
    );

    renderAlchemy();
}

const alchemyHuntingSubcategories = [
    {
        id: "all",
        name: "Wszystkie"
    },
    {
        id: "weapon",
        name: "🗡️ Broń"
    },
    {
        id: "spells",
        name: "✨ Czary"
    },
    {
        id: "defense",
        name: "🛡️ Obrona"
    },
    {
        id: "loot",
        name: "🎁 Łupy"
    }
];

let currentAlchemyHuntingSubcategory =
    localStorage.getItem(
        "idler_alchemy_hunting_subcategory"
    ) || "all";

function setAlchemyHuntingSubcategory(
    subcategoryId
) {
    currentAlchemyHuntingSubcategory =
        subcategoryId;

    localStorage.setItem(
        "idler_alchemy_hunting_subcategory",
        subcategoryId
    );

    renderAlchemy();
}

const alchemyHuntingSubcategoryByEffect = {
    melee_weapon_damage: "weapon",
    ranged_weapon_damage: "weapon",
    magic_weapon_damage: "weapon",

    spell_damage: "spells",
    mana_regeneration: "spells",

    combat_defense: "defense",
    hunter_luck: "loot"
};

function getAlchemyHuntingSubcategory(
    recipe
) {
    const resultItem =
        items[recipe.resultItemId];

    const potionEffectId =
        resultItem?.potionEffectId;

    return (
        alchemyHuntingSubcategoryByEffect[
            potionEffectId
        ] || null
    );
}

function renderAlchemy() {
    ensureAlchemyState();

    const recipesContainer =
        document.getElementById(
            "alchemy-recipes-list"
        );

    const progressContainer =
        document.getElementById(
            "alchemy-progress-panel"
        );

    if (recipesContainer) {
        renderAlchemyRecipes(
            recipesContainer
        );
    }

    if (progressContainer) {
        renderAlchemyProgressPanel(
            progressContainer
        );
    }
}

function renderAlchemyCategoryTabs(
    container
) {
    const tabs =
        document.createElement("div");

    tabs.className =
        "alchemy-category-tabs";

    alchemyCategories.forEach(
        category => {
            const recipeCount =
                alchemyRecipes.filter(
                    recipe =>
                        recipe.category ===
                        category.id
                ).length;

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "alchemy-category-tab";

            if (
                category.id ===
                currentAlchemyCategory
            ) {
                button.classList.add(
                    "active"
                );
            }

            button.textContent =
                `${category.name} (${recipeCount})`;

            button.onclick = () => {
                setAlchemyCategory(
                    category.id
                );
            };

            tabs.appendChild(button);
        }
    );

    container.appendChild(tabs);
}

function renderAlchemyHuntingSubcategoryTabs(
    container
) {
    if (
        currentAlchemyCategory !==
        "hunting"
    ) {
        return;
    }

    const tabs =
        document.createElement("div");

    tabs.className =
        "alchemy-category-tabs " +
        "alchemy-subcategory-tabs";

    alchemyHuntingSubcategories.forEach(
        subcategory => {
                        const recipeCount =
                alchemyRecipes.filter(
                    recipe => {
                        if (
                            recipe.category !==
                            "hunting"
                        ) {
                            return false;
                        }

                        if (
                            subcategory.id ===
                            "all"
                        ) {
                            return true;
                        }

                        return (
                            getAlchemyHuntingSubcategory(
                                recipe
                            ) ===
                            subcategory.id
                        );
                    }
                ).length;
            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "alchemy-category-tab " +
                "alchemy-subcategory-tab";

            if (
                subcategory.id ===
                currentAlchemyHuntingSubcategory
            ) {
                button.classList.add(
                    "active"
                );
            }

button.textContent =
    `${subcategory.name} (${recipeCount})`;

            button.onclick = () => {
                setAlchemyHuntingSubcategory(
                    subcategory.id
                );
            };

            tabs.appendChild(button);
        }
    );

    container.appendChild(tabs);
}

function renderAlchemyRecipes(
    container
) {
container.innerHTML = "";

renderAlchemyCategoryTabs(
    container
);

renderAlchemyHuntingSubcategoryTabs(
    container
);

const visibleRecipes =
    alchemyRecipes.filter(recipe => {
        const isCurrentCategory =
            recipe.category ===
            currentAlchemyCategory;

        if (!isCurrentCategory) {
            return false;
        }

        if (
            currentAlchemyCategory !==
                "hunting" ||
            currentAlchemyHuntingSubcategory ===
                "all"
        ) {
            return true;
        }

        return (
            getAlchemyHuntingSubcategory(
                recipe
            ) ===
            currentAlchemyHuntingSubcategory
        );
    });

visibleRecipes.forEach(recipe => {
        const isUnlocked =
            isAlchemyRecipeUnlocked(
                recipe
            );

        const hasIngredients =
            hasAlchemyIngredients(
                recipe
            );

        const isActiveRecipe =
            player.alchemy.isCrafting &&
            player.alchemy.activeRecipeId ===
            recipe.id;

        const resultItem =
            items[
            recipe.resultItemId
            ];

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "alchemy-recipe-card";

        if (!isUnlocked) {
            card.classList.add(
                "alchemy-recipe-locked"
            );
        }

        if (isActiveRecipe) {
            card.classList.add(
                "alchemy-recipe-active"
            );
        }

        const ingredientsHtml =
            recipe.ingredients
                .map(ingredient => {
                    const item =
                        items[
                        ingredient.itemId
                        ];

                    const ownedQuantity =
                        getInventoryItemQuantity(
                            ingredient.itemId
                        );

                    const hasEnough =
                        ownedQuantity >=
                        ingredient.quantity;

                    return `
                        <div class="alchemy-ingredient-row ${hasEnough
                            ? "alchemy-ingredient-ready"
                            : "alchemy-ingredient-missing"
                        }">
                            <span>
                                ${item?.name ||
                        ingredient.itemId
                        }
                            </span>

                            <strong>
                                ${ownedQuantity}/${ingredient.quantity}
                            </strong>
                        </div>
                    `;
                })
                .join("");

        let buttonText =
            player.alchemy.isCrafting
                ? "DODAJ DO KOLEJKI 🧪"
                : "ROZPOCZNIJ WARZENIE 🧪";

        if (!isUnlocked) {
            buttonText =
                "WYMAGA POZIOMU ALCHEMII " +
                recipe.requiredAlchemyLevel;
        } else if (!hasIngredients) {
            buttonText =
                "BRAK SKŁADNIKÓW";
        }

        const isDisabled =
            !isUnlocked ||
            !hasIngredients;

        const maxCraftable =
            getMaxCraftableAlchemyQuantity(
                recipe
            );

        card.innerHTML = `
            <div class="alchemy-recipe-header">
                <div>
                    <span class="alchemy-recipe-status">
                        ${isActiveRecipe
                ? "🧪 Trwa warzenie"
                : isUnlocked
                    ? "Dostępna receptura"
                    : "Zablokowana"
            }
                    </span>

                    <h3>
                        ${resultItem?.name ||
            recipe.name
            }
                    </h3>
                </div>

                <div class="alchemy-level-badge">
                    🧪 Lv. ${recipe.requiredAlchemyLevel}
                </div>
            </div>

            <p class="alchemy-recipe-description">
                ${recipe.description}
            </p>

            <div class="alchemy-recipe-info">
                <span>
                    Czas:
                    <strong>
                        ${recipe.craftingDurationSeconds} s
                    </strong>
                </span>

                <span>
                    Wynik:
                    <strong>
                        x${recipe.resultQuantity || 1}
                    </strong>
                </span>

                <span>
                    EXP:
                    <strong>
                        +${getAlchemyRecipeExp(recipe)}
                    </strong>
                </span>
            </div>

           <div class="alchemy-ingredients">
    <h4>Składniki</h4>

    ${ingredientsHtml}
</div>

<div class="alchemy-recipe-actions">
    <div class="alchemy-quantity-control">
        <span>Ilość</span>

        <select
            id="alchemy-quantity-${recipe.id}"
            ${isDisabled ? "disabled" : ""}
        >
            <option value="1">
                1
            </option>

            <option
                value="5"
                ${maxCraftable < 5 ? "disabled" : ""}
            >
                5
            </option>

            <option
                value="10"
                ${maxCraftable < 10 ? "disabled" : ""}
            >
                10
            </option>

            <option
                value="${maxCraftable}"
                ${maxCraftable < 1 ? "disabled" : ""}
            >
                MAX (${maxCraftable})
            </option>
        </select>
    </div>

    <button
        class="alchemy-craft-button"
        onclick="startAlchemyCraftingFromUI('${recipe.id}')"
        ${isDisabled ? "disabled" : ""}
    >
        ${buttonText}
    </button>
</div>
`;

        container.appendChild(
            card
        );
    });
}

function enableAlchemyQueueDragging(list) {
    let draggedRow = null;
    let dragHandle = null;
    let activePointerId = null;

    function resetAlchemyDrag() {
        if (draggedRow) {
            draggedRow.classList.remove(
                "is-dragging",
            );
        }

        if (
            dragHandle &&
            activePointerId !== null &&
            dragHandle.hasPointerCapture(
                activePointerId,
            )
        ) {
            dragHandle.releasePointerCapture(
                activePointerId,
            );
        }

        draggedRow = null;
        dragHandle = null;
        activePointerId = null;
    }

    list.addEventListener(
        "pointerdown",
        (event) => {
            if (event.button !== 0) {
                return;
            }

            const handle = event.target.closest(
                "[data-alchemy-drag-handle]",
            );

            if (!handle) {
                return;
            }

            const row = handle.closest(
                "[data-alchemy-job-id]",
            );

            if (!row) {
                return;
            }

            event.preventDefault();

            draggedRow = row;
            dragHandle = handle;
            activePointerId = event.pointerId;

            draggedRow.classList.add(
                "is-dragging",
            );

            dragHandle.setPointerCapture(
                activePointerId,
            );
        },
    );

    list.addEventListener(
        "pointermove",
        (event) => {
            if (
                !draggedRow ||
                event.pointerId !== activePointerId
            ) {
                return;
            }

            event.preventDefault();

            const listRectangle =
                list.getBoundingClientRect();

            if (
                event.clientY <
                listRectangle.top + 45
            ) {
                list.scrollTop -= 10;
            } else if (
                event.clientY >
                listRectangle.bottom - 45
            ) {
                list.scrollTop += 10;
            }

            const otherRows = Array.from(
                list.querySelectorAll(
                    ".alchemy-queue-waiting",
                ),
            ).filter((row) => {
                return row !== draggedRow;
            });

            let rowWasMoved = false;

            for (const row of otherRows) {
                const rectangle =
                    row.getBoundingClientRect();

                const rowMiddle =
                    rectangle.top +
                    rectangle.height / 2;

                if (event.clientY < rowMiddle) {
                    list.insertBefore(
                        draggedRow,
                        row,
                    );

                    rowWasMoved = true;
                    break;
                }
            }

            if (!rowWasMoved) {
                list.appendChild(draggedRow);
            }
        },
    );


    list.addEventListener(
        "pointerup",
        (event) => {
            if (
                !draggedRow ||
                event.pointerId !== activePointerId
            ) {
                return;
            }

            const movedJobId =
                draggedRow.dataset.alchemyJobId;

            const waitingRows = Array.from(
                list.querySelectorAll(
                    "[data-alchemy-job-id]",
                ),
            );

            const targetIndex =
                waitingRows.indexOf(draggedRow);

            resetAlchemyDrag();

            const moved = moveAlchemyQueueJob(
                movedJobId,
                targetIndex,
            );

            if (moved) {
                renderAlchemy();
            }
        },
    );

    list.addEventListener(
        "pointercancel",
        () => {
            resetAlchemyDrag();
        },
    );
}

function renderAlchemyProgressPanel(
    container
) {
    const level =
        player.alchemy.level;

    const exp =
        player.alchemy.exp;

    const expNeeded =
        player.alchemy
            .expToNextLevel;

    const expProgress =
        expNeeded > 0
            ? Math.min(
                100,
                exp / expNeeded * 100
            )
            : 0;

    const activeRecipe =
        player.alchemy.isCrafting
            ? getAlchemyRecipe(
                player.alchemy
                    .activeRecipeId
            )
            : null;

    const activeQuantity =
        player.alchemy.isCrafting
            ? player.alchemy
                .craftingQuantity || 1
            : 0;


    const craftingProgress =
        activeRecipe
            ? getAlchemyCraftingProgressPercent()
            : 0;

    const remainingSeconds =
        activeRecipe
            ? getAlchemyTimeRemainingSeconds()
            : 0;

    const lastResultHtml =
        getAlchemyLastResultHtml();


    const queueHtml =
        getAlchemyQueueHtml();

    const waitingQueueCount =
        Array.isArray(
            player.alchemy.queue
        )
            ? player.alchemy.queue.length
            : 0;

    const totalQueueCount =
        waitingQueueCount +
        (
            player.alchemy.isCrafting
                ? 1
                : 0
        );

    container.innerHTML = `
        <div class="alchemy-progress-header">
            <div>
                <span>Stan alchemii</span>

                <h3>
                    ${activeRecipe
            ? activeRecipe.name +
            " x" +
            activeQuantity
            : "Brak aktywnego warzenia"
        }
                </h3>
            </div>

            <div class="alchemy-current-level">
                Poziom alchemii
                <strong>${level}</strong>
            </div>
        </div>

        <div class="alchemy-exp-label">
            <span>EXP alchemii</span>

            <strong>
                ${exp}/${expNeeded}
            </strong>
        </div>

        <div class="alchemy-exp-bar">
            <div
                class="alchemy-exp-fill"
                style="width: ${expProgress}%"
            ></div>
        </div>

        <div class="alchemy-crafting-label">
            <span>
                ${activeRecipe
            ? "Trwa warzenie..."
            : "Kocioł jest wolny"
        }
            </span>

            <strong id="alchemy-progress-percent">
                ${Math.floor(craftingProgress)}%
            </strong>
        </div>

        <div class="alchemy-crafting-bar">
            <div
                id="alchemy-progress-fill"
                class="alchemy-crafting-fill"
                style="width: ${craftingProgress}%"
            ></div>
        </div>

        <div class="alchemy-time-row">
            <span>Pozostały czas</span>

            <strong id="alchemy-time-remaining">
                ${activeRecipe
            ? remainingSeconds + " s"
            : "—"
        }
            </strong>
        </div>

                <div class="alchemy-queue-section">
    <div class="alchemy-queue-header">
        <div>
            <span>Kolejka warzenia</span>

            <strong>
                ${totalQueueCount}
                ${totalQueueCount === 1
            ? "mikstura"
            : "mikstur"
        }
            </strong>
        </div>

        <small>
            Oczekujące:
            ${waitingQueueCount}
        </small>
    </div>

    <div class="alchemy-queue-list">
        ${queueHtml}
    </div>
</div>


        <div class="alchemy-last-result">
            <h4>Ostatnie warzenie</h4>

            ${lastResultHtml}
        </div>
    `;

    const queueList = container.querySelector(
        ".alchemy-queue-list",
    );

    if (queueList) {
        enableAlchemyQueueDragging(
            queueList,
        );
    }
}

function updateAlchemyProgressUI() {
    if (
        !player.alchemy ||
        !player.alchemy.isCrafting
    ) {
        return;
    }

    const progressFill =
        document.getElementById(
            "alchemy-progress-fill"
        );

    const progressPercent =
        document.getElementById(
            "alchemy-progress-percent"
        );

    const timeRemaining =
        document.getElementById(
            "alchemy-time-remaining"
        );

    if (
        !progressFill ||
        !progressPercent ||
        !timeRemaining
    ) {
        return;
    }

    const progress =
        getAlchemyCraftingProgressPercent();

    const remainingSeconds =
        getAlchemyTimeRemainingSeconds();

    progressFill.style.width =
        progress + "%";

    progressPercent.textContent =
        Math.floor(progress) + "%";

    timeRemaining.textContent =
        remainingSeconds + " s";
}

function getAlchemyLastResultHtml() {
    const result =
        player.alchemy.lastResult;

    if (!result) {
        return `
            <p class="alchemy-empty-result">
                Nie uwarzono jeszcze żadnej mikstury.
            </p>
        `;
    }

    const item =
        items[
        result.resultItemId
        ];

    return `
        <div class="alchemy-result-row">
            <span>
                ${item?.name ||
        result.resultItemId
        }
            </span>

            <strong>
                x${result.resultQuantity}
            </strong>
        </div>

        <div class="alchemy-result-exp">
            Zdobyte doświadczenie:
            <strong>
                +${result.alchemyExp} EXP
            </strong>
        </div>
    `;
}

function startAlchemyCraftingFromUI(
    recipeId
) {
    const quantitySelect =
        document.getElementById(
            "alchemy-quantity-" +
            recipeId
        );

    const quantity =
        quantitySelect
            ? Number(
                quantitySelect.value
            )
            : 1;

    startAlchemyCrafting(
        recipeId,
        quantity
    );
}

function getAlchemyQueueHtml() {
    ensureAlchemyState();

    const activeRecipe =
        player.alchemy.isCrafting
            ? getAlchemyRecipe(
                player.alchemy.activeRecipeId
            )
            : null;

    const waitingQueue =
        Array.isArray(player.alchemy.queue)
            ? player.alchemy.queue
            : [];

    if (
        !activeRecipe &&
        waitingQueue.length === 0
    ) {
        return `
            <p class="alchemy-empty-queue">
                Kolejka warzenia jest pusta.
            </p>
        `;
    }

    let html = "";

    if (activeRecipe) {
        const activeItem =
            items[activeRecipe.resultItemId];

        html += `
        <div class="alchemy-queue-item alchemy-queue-active">
            <div class="alchemy-queue-number">
                🧪
            </div>

            <div class="alchemy-queue-info">
                <span>Aktualnie warzona</span>

                <strong>
                    ${activeItem?.name ||
            activeRecipe.name
            }
                </strong>
            </div>

            <div class="alchemy-queue-status">
                W trakcie
            </div>

            <button
                type="button"
                class="alchemy-queue-remove-button alchemy-active-cancel-button"
                onclick="cancelActiveAlchemyJob()"
            >
                Anuluj
            </button>
        </div>
    `;
    }

    waitingQueue.forEach(
        (job, index) => {
            const recipe =
                getAlchemyRecipe(
                    job.recipeId
                );

            if (!recipe) {
                return;
            }

            const resultItem =
                items[
                recipe.resultItemId
                ];

            const queuePosition =
                index + 1;

            html += `
                <div
  class="alchemy-queue-item alchemy-queue-waiting"
  data-alchemy-job-id="${job.id}"
>
<button
  type="button"
  class="alchemy-queue-drag-handle"
  data-alchemy-drag-handle="true"
  title="Przytrzymaj i przeciągnij"
  aria-label="Przeciągnij ${recipe.name}"
>
  ⠿
</button>
                    <div class="alchemy-queue-number">
                        ${queuePosition}
                    </div>

                    <div class="alchemy-queue-info">
                        <span>
                            Pozycja w kolejce
                        </span>

                        <strong>
                            ${resultItem?.name ||
                recipe.name
                }
                        </strong>
                    </div>

                    <div class="alchemy-queue-duration">
                        ${formatAlchemyDuration(
                    recipe.craftingDurationSeconds
                )}
                    </div>

                    <button
                        type="button"
                        class="alchemy-queue-remove-button"
                        onclick="removeAlchemyQueueItem('${job.id}')"
                    >
                        Usuń
                    </button>
                </div>
            `;
        }
    );

    return html;
}

function formatAlchemyDuration(
    totalSeconds
) {
    const safeSeconds =
        Math.max(
            0,
            Math.floor(
                Number(totalSeconds) || 0
            )
        );

    const minutes =
        Math.floor(
            safeSeconds / 60
        );

    const seconds =
        safeSeconds % 60;

    if (minutes <= 0) {
        return seconds + " s";
    }

    if (seconds <= 0) {
        return minutes + " min";
    }

    return (
        minutes +
        " min " +
        seconds +
        " s"
    );
}