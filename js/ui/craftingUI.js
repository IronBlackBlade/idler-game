const openCraftingCategories = {};

const craftingCategories = [
    {
        id: "weapon",
        name: "⚔️ Broń biała"
    },
    {
        id: "ranged_weapon",
        name: "🏹 Broń dystansowa"
    },
    {
        id: "magic_weapon",
        name: "🪄 Broń magiczna"
    },
    {
        id: "shield",
        name: "🛡️ Tarcze"
    },
    {
        id: "helmet",
        name: "⛑️ Hełmy"
    },
    {
        id: "armor",
        name: "🥋 Pancerze"
    },
    {
        id: "pants",
        name: "👖 Spodnie"
    },
    {
        id: "boots",
        name: "🥾 Buty"
    },
    {
        id: "gloves",
        name: "🧤 Rękawice"
    },
    {
        id: "ring",
        name: "💍 Pierścienie"
    },
    {
        id: "amulet",
        name: "📿 Amulety"
    },
    {
        id: "talisman",
        name: "🔮 Talizmany"
    },
    {
        id: "special",
        name: "📜 Specjalne receptury"
    }
];

function getCraftingCategory(recipe) {
    const resultItem = items[recipe.resultItemId];

    if (!resultItem) {
        return "special";
    }

    if (recipe.requiresScroll === true) {
        return "special";
    }

    if (resultItem.type === "weapon") {
        if (resultItem.weaponType === "ranged") {
            return "ranged_weapon";
        }

        if (resultItem.weaponType === "magic") {
            return "magic_weapon";
        }

        return "weapon";
    }

    return resultItem.type;
}

function getCraftingRarityLabel(rarity) {
    if (typeof getRarityName === "function") {
        return getRarityName(rarity);
    }

    const rarityNames = {
        common: "Zwykły",
        uncommon: "Niepospolity",
        rare: "Rzadki",
        epic: "Epicki",
        legendary: "Legendarny"
    };

    return rarityNames[rarity] || rarity || "Brak";
}

function renderCrafting() {
    const container = document.getElementById("crafting-list");

    if (!container) return;

    container.innerHTML = "";

    craftingCategories.forEach(category => {
        const categoryRecipes = recipes.filter(recipe => {
            return getCraftingCategory(recipe) === category.id;
        });

        const details = document.createElement("details");
        details.className = "crafting-category";

        details.open = openCraftingCategories[category.id] === true;

        details.addEventListener("toggle", () => {
            openCraftingCategories[category.id] = details.open;
        });

        const summary = document.createElement("summary");
        summary.textContent = category.name + " (" + categoryRecipes.length + ")";
        details.appendChild(summary);

        const recipesContainer = document.createElement("div");
        recipesContainer.className = "crafting-category-items";

        if (categoryRecipes.length === 0) {
            recipesContainer.innerHTML = `<p class="empty-category">Brak receptur w tej kategorii.</p>`;
        }

categoryRecipes.forEach(recipe => {
    const resultItem = items[recipe.resultItemId];

    if (!resultItem) {
        console.warn(
            "Craft result item not found:",
            recipe.resultItemId
        );

        return;
    }

    const baseGoldCost = recipe.goldCost || 0;

    const finalGoldCost =
        typeof getFinalCraftingGoldCost === "function"
            ? getFinalCraftingGoldCost(recipe)
            : baseGoldCost;

    const hasCraftingDiscount =
        finalGoldCost < baseGoldCost;

            const recipeUnlocked = isRecipeUnlocked(recipe.id);
            const recipeScroll = getRecipeScrollItem(recipe.id);
            const ownedScrolls = recipeScroll ? getInventoryItemQuantity(recipeScroll.id) : 0;

            const div = document.createElement("div");
            div.className = "crafting-item";

            if (resultItem.rarity) {
                div.classList.add("rarity-" + resultItem.rarity);
            }

            let materialsHtml = "";

            recipe.materials.forEach(material => {
                const item = items[material.itemId];
                const owned = getInventoryItemQuantity(material.itemId);
                const hasEnough = owned >= material.quantity;

                materialsHtml += `
                    <span class="${hasEnough ? "material-ok" : "material-missing"}">
                        ${hasEnough ? "✅" : "❌"}
                        ${item ? item.name : material.itemId}: ${owned}/${material.quantity}
                    </span>
                `;
            });

            let stats = "";

            if (resultItem.damage) stats += `<span>Obrażenia: ${resultItem.damage}</span>`;
            if (resultItem.strength) stats += `<span>Siła: +${resultItem.strength}</span>`;
            if (resultItem.dexterity) stats += `<span>Zręczność: +${resultItem.dexterity}</span>`;
            if (resultItem.intelligence) stats += `<span>Inteligencja: +${resultItem.intelligence}</span>`;
            if (resultItem.endurance) stats += `<span>Wytrzymałość: +${resultItem.endurance}</span>`;
            if (resultItem.luck) stats += `<span>Szczęście: +${resultItem.luck}</span>`;

            if (!recipeUnlocked) {
                div.classList.add("crafting-locked");

                div.innerHTML = `
                    <div class="crafting-item-header">
                        <strong>📜 ${recipe.name}</strong>
                    </div>

                    <div class="crafting-item-tags">
                        <span>${getCraftingRarityLabel(resultItem.rarity)}</span>
                        <span>Status: Nieodblokowana</span>
                        <span>Zwoje: ${ownedScrolls}</span>
                        <span>Koszt odblokowania: ${recipe.unlockCost} 💰</span>
                    </div>

<button 
    class="crafting-main-btn ${
        ownedScrolls > 0 && player.gold >= recipe.unlockCost
            ? ""
            : "crafting-button-unavailable"
    }"
    onclick="unlockRecipe('${recipe.id}')"
>
    Odblokuj recepturę
</button>
                `;

                recipesContainer.appendChild(div);
                return;
            }

            const canCraft = canCraftRecipe(recipe);

div.innerHTML = `
    <div class="crafting-item-header">
        <strong>⚒️ ${recipe.name}</strong>

        <button 
            class="crafting-main-btn ${
                canCraft
                    ? ""
                    : "crafting-button-unavailable"
            }"
            onclick="craftItem('${recipe.id}')"
        >
            Wytwórz
        </button>
    </div>

    <div class="crafting-item-tags">
        <span>
            ${getCraftingRarityLabel(resultItem.rarity)}
        </span>

        <span>Status: Odblokowana</span>

        <span>Efekt: ${resultItem.name}</span>

        <span>
            Poziom: ${resultItem.requiredLevel || 1}
        </span>

        <span>
            Koszt:
            ${
                hasCraftingDiscount
                    ? `<s>${baseGoldCost}</s> ${finalGoldCost}`
                    : finalGoldCost
            }
            💰
        </span>
    </div>

    <div class="crafting-item-stats">
        ${stats}
    </div>

    <div class="crafting-materials">
        ${materialsHtml}
    </div>
`;

            recipesContainer.appendChild(div);
        });

        details.appendChild(recipesContainer);
        container.appendChild(details);
    });
}