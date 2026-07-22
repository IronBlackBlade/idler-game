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

function renderAlchemyRecipes(
    container
) {
    container.innerHTML = "";

    alchemyRecipes.forEach(recipe => {
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
                <div class="alchemy-queue-item">
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