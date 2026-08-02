function formatCookingDuration(seconds) {
    const safeSeconds = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(safeSeconds / 60);
    return minutes > 0 ? minutes + " min" : safeSeconds + " sek.";
}

function getCookingIngredientHtml(ingredient, quantity) {
    const item = items[ingredient.itemId];
    const owned = getCookingIngredientQuantity(ingredient.itemId);
    const required = ingredient.quantity * quantity;
    const statusClass = owned >= required ? "has-enough" : "not-enough";

    return `
        <span class="cooking-ingredient ${statusClass}">
            ${item?.name || ingredient.itemId}: ${owned}/${required}
        </span>
    `;
}

function updateCookingQuantityPreview(recipeId) {
    const recipe = getCookingRecipe(recipeId);
    if (!recipe) return;

    const quantity = getCookingRequestedQuantity(recipeId);
    const input = document.getElementById("cooking-quantity-" + recipeId);
    if (input) input.value = quantity;

    const ingredients = document.getElementById(
        "cooking-ingredients-" + recipeId
    );
    if (ingredients) {
        ingredients.innerHTML = recipe.ingredients
            .map(ingredient => getCookingIngredientHtml(ingredient, quantity))
            .join("");
    }

    const experience = document.getElementById("cooking-exp-" + recipeId);
    if (experience) {
        experience.textContent = "+" + recipe.cookingExp * quantity + " EXP";
    }

    const button = document.getElementById("cooking-button-" + recipeId);
    if (button) {
        button.disabled = getMaxCookableQuantity(recipe) < quantity;
    }
}

function changeCookingQuantity(
    recipeId,
    change
) {
    const input = document.getElementById(
        "cooking-quantity-" +
        recipeId
    );

    if (!input) return;

    input.value = Math.min(
        9999,
        Math.max(
            1,
            Math.floor(
                Number(input.value) || 1
            ) +
            Math.floor(
                Number(change) || 0
            )
        )
    );

    updateCookingQuantityPreview(
        recipeId
    );
}

function renderTavern() {
    const container = document.getElementById("tavern-panel");
    if (!container) return;

    ensureCookingState();

    const tavern = player.cooking.tavern;
    const reputationPercent = Math.min(
        100,
        tavern.reputationToNextLevel > 0
            ? tavern.reputation / tavern.reputationToNextLevel * 100
            : 0
    );
    const tipChance = Math.round(
        Math.min(0.3, 0.14 + tavern.level * 0.02) * 100
    );
    const orderCards = tavern.activeOrders.map(order => {
        const progress = getTavernOrderProgress(order);
        const isReady = progress.every(requirement => requirement.hasEnough);
        const requirementsHtml = progress.map(requirement => {
            const item = items[requirement.itemId];

            return `
                <span class="tavern-order-requirement ${requirement.hasEnough
                    ? "has-enough"
                    : "not-enough"}">
                    ${item?.name || requirement.itemId}
                    <strong>${requirement.owned}/${requirement.required}</strong>
                </span>
            `;
        }).join("");

        return `
            <article class="tavern-order-card ${isReady ? "is-ready" : ""}">
                <header>
                    <span class="tavern-order-icon">${order.icon}</span>
                    <div>
                        <span>Zamówienie gości</span>
                        <h4>${order.name}</h4>
                    </div>
                </header>

                <p>${order.description}</p>

                <div class="tavern-order-requirements">
                    ${requirementsHtml}
                </div>

                <div class="tavern-order-rewards">
                    <span>💰 <strong>+${order.goldReward}</strong> złota</span>
                    <span>🍻 <strong>+${order.reputationReward}</strong> renomy</span>
                </div>

                <button
                    class="tavern-complete-button"
                    onclick="completeTavernOrder('${order.id}')"
                    ${isReady ? "" : "disabled"}
                >
                    ${isReady ? "Podaj zamówienie" : "Brakuje potraw"}
                </button>
            </article>
        `;
    }).join("");

    container.innerHTML = `
        <section class="tavern-card">
            <div class="tavern-header">
                <div class="tavern-title">
                    <span class="tavern-sign">🍻</span>
                    <div>
                        <span class="cooking-eyebrow">Karczma</span>
                        <h3>Pod Złotym Karpem</h3>
                        <p>Realizuj zamówienia gości i zdobywaj złoto oraz renomę.</p>
                    </div>
                </div>

                <div class="tavern-summary">
                    <div>
                        <span>Poziom renomy</span>
                        <strong>${tavern.level}</strong>
                    </div>
                    <div>
                        <span>Wykonane</span>
                        <strong>${tavern.completedOrders}</strong>
                    </div>
                    <div>
                        <span>Szansa na napiwek</span>
                        <strong>${tipChance}%</strong>
                    </div>
                </div>
            </div>

            <div class="tavern-reputation-row">
                <span>Renoma ${tavern.reputation}/${tavern.reputationToNextLevel}</span>
                <small>Wyższa renoma odblokowuje trudniejsze zamówienia i lepsze napiwki.</small>
            </div>
            <div class="tavern-reputation-track">
                <span style="width: ${reputationPercent}%"></span>
            </div>

            <div class="tavern-orders-grid">
                ${orderCards}
            </div>
        </section>
    `;
}

function renderCooking() {
    ensureCookingState();

    const overview = document.getElementById("cooking-overview");
    const list = document.getElementById("cooking-recipes-list");
    if (!overview || !list) return;

    const cooking = player.cooking;
    const progress = Math.min(
        100,
        cooking.expToNextLevel > 0
            ? cooking.exp / cooking.expToNextLevel * 100
            : 0
    );
    const activeFood =
        typeof getActiveFoodEffect === "function"
            ? getActiveFoodEffect()
            : null;

    overview.innerHTML = `
        <div class="cooking-level-card">
            <div>
                <span class="cooking-eyebrow">Poziom gotowania</span>
                <strong>${cooking.level}</strong>
            </div>
            <div class="cooking-progress-copy">
                ${Math.floor(cooking.exp)} / ${cooking.expToNextLevel} EXP
            </div>
            <div class="cooking-progress-track">
                <span style="width: ${progress}%"></span>
            </div>
            <small>Łącznie ugotowano: ${cooking.statistics.totalMealsCooked}</small>
        </div>
        <div
            class="profession-tool-context-slot cooking-tool-context-slot"
            data-profession-tool-panel="cookingTools"
        ></div>
        <div class="cooking-active-meal ${activeFood ? "is-active" : ""}">
            <span class="cooking-eyebrow">Aktywny posiłek</span>
            <strong>${activeFood ? activeFood.icon + " " + activeFood.name : "Brak"}</strong>
            <p>${activeFood ? activeFood.description : "Zjedz potrawę z ekwipunku, aby otrzymać premię."}</p>
        </div>
    `;

    const toolPanel =
        overview.querySelector(
            "[data-profession-tool-panel='cookingTools']"
        );

    if (
        toolPanel &&
        typeof renderProfessionToolContextPanel ===
            "function"
    ) {
        renderProfessionToolContextPanel(
            toolPanel,
            "cookingTools"
        );
    }

    renderTavern();

    list.innerHTML = cookingRecipes.map(recipe => {
        const unlocked = isCookingRecipeUnlocked(recipe);
        const meal = items[recipe.resultItemId];
        const maximum = getMaxCookableQuantity(recipe);

        return `
            <article class="cooking-recipe-card ${unlocked ? "" : "is-locked"}">
                <header>
                    <span class="cooking-recipe-icon">${recipe.icon}</span>
                    <div>
                        <h3>${recipe.name}</h3>
                        <span>Poziom ${recipe.requiredCookingLevel}</span>
                    </div>
                </header>
                <p>${recipe.description}</p>
                <div class="cooking-effect">
                    <strong>${meal?.foodEffectName || "Efekt posiłku"}</strong>
                    <span>${meal?.foodEffectDescription || ""} · ${formatCookingDuration(meal?.durationSeconds)}</span>
                </div>
                <div id="cooking-ingredients-${recipe.id}" class="cooking-ingredients">
                    ${recipe.ingredients.map(ingredient =>
                        getCookingIngredientHtml(ingredient, 1)
                    ).join("")}
                </div>
                ${unlocked ? `
                    <div class="cooking-batch-row">
                        <label>
                            Porcje
                            <span class="cooking-quantity-control">
                                <button
                                    type="button"
                                    aria-label="Zmniejsz liczbę porcji"
                                    onclick="changeCookingQuantity('${recipe.id}', -1)"
                                >−</button>
                                <input
                                    id="cooking-quantity-${recipe.id}"
                                    type="number"
                                    min="1"
                                    max="9999"
                                    value="1"
                                    inputmode="numeric"
                                    oninput="updateCookingQuantityPreview('${recipe.id}')"
                                >
                                <button
                                    type="button"
                                    aria-label="Zwiększ liczbę porcji"
                                    onclick="changeCookingQuantity('${recipe.id}', 1)"
                                >+</button>
                            </span>
                        </label>
                        <span id="cooking-exp-${recipe.id}">+${recipe.cookingExp} EXP</span>
                    </div>
                    <div class="cooking-actions">
                        <button
                            id="cooking-button-${recipe.id}"
                            onclick="cookRecipe('${recipe.id}')"
                            ${maximum < 1 ? "disabled" : ""}
                        >🍳 Ugotuj</button>
                        <button
                            class="secondary"
                            onclick="cookMaxRecipe('${recipe.id}')"
                            ${maximum < 1 ? "disabled" : ""}
                        >Maks. (${maximum})</button>
                    </div>
                ` : `
                    <div class="cooking-locked-message">
                        🔒 Wymaga ${recipe.requiredCookingLevel}. poziomu gotowania
                    </div>
                `}
            </article>
        `;
    }).join("");
}
