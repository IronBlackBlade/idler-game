function renderCrafting() {
    const container = document.getElementById("crafting-list");

    if (!container) return;

    container.innerHTML = "";

    recipes.forEach(recipe => {
        const resultItem = items[recipe.resultItemId];

        if (!resultItem) {
            console.warn("Craft result item not found:", recipe.resultItemId);
            return;
        }

        const recipeUnlocked = isRecipeUnlocked(recipe.id);
        const recipeScroll = getRecipeScrollItem(recipe.id);
        const ownedScrolls = recipeScroll ? getInventoryItemQuantity(recipeScroll.id) : 0;

        const div = document.createElement("div");
        div.className = "shop-item";

        let materialsHtml = "";

        recipe.materials.forEach(material => {
            const item = items[material.itemId];
            const owned = getInventoryItemQuantity(material.itemId);
            const hasEnough = owned >= material.quantity;

            materialsHtml += `
                <p>
                    ${hasEnough ? "✅" : "❌"}
                    ${item ? item.name : material.itemId}:
                    ${owned}/${material.quantity}
                </p>
            `;
        });

        if (!recipeUnlocked) {
            div.innerHTML = `
                <strong>📜 Receptura: ${recipe.name}</strong>

                <p>Status: Nieodblokowana</p>
                <p>Posiadane zwoje: ${ownedScrolls}</p>
                <p>Koszt odblokowania: ${recipe.unlockCost} 💰</p>

                <button 
                    onclick="unlockRecipe('${recipe.id}')"
                    ${ownedScrolls > 0 && player.gold >= recipe.unlockCost ? "" : "disabled"}
                >
                    Odblokuj recepturę
                </button>
            `;

            container.appendChild(div);
            return;
        }

        const canCraft = canCraftRecipe(recipe);

        div.innerHTML = `
            <strong>⚒️ ${recipe.name}</strong>
            <p>Status: Odblokowana</p>
            <p>Efekt: ${resultItem.name}</p>
            <p>Koszt wytworzenia: ${recipe.goldCost} 💰</p>

            <hr>

            ${materialsHtml}

            <br>

            <button 
                onclick="craftItem('${recipe.id}')"
                ${canCraft ? "" : "disabled"}
            >
                Wytwórz
            </button>
        `;

        container.appendChild(div);
    });
}