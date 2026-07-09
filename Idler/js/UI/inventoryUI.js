function renderInventory() {
    const container = document.getElementById("inventory-list");

    if (!container) return;

    container.innerHTML = "";

    if (player.inventory.length === 0) {
        container.innerHTML = "<p>Ekwipunek jest pusty.</p>";
        return;
    }

    player.inventory.forEach(invItem => {
        const item = items[invItem.itemId];

        if (!item) {
            console.warn("Brak przedmiotu:", invItem.itemId);
            return;
        }

        const div = document.createElement("div");
        div.className = "inventory-item";

        const equipableTypes = [
            "weapon",
            "shield",
            "helmet",
            "armor",
            "pants",
            "boots",
            "gloves",
            "ring",
            "amulet",
            "talisman"
        ];

        const equipButton = equipableTypes.includes(item.type)
            ? `<button onclick="equipItem('${invItem.itemId}')">Załóż</button>`
            : "";

        let stats = "";

        if (item.damage) stats += `<span>Obrażenia: ${item.damage}</span>`;
        if (item.attack) stats += `<span>Atak: +${item.attack}</span>`;
        if (item.strength) stats += `<span>Siła: +${item.strength}</span>`;
        if (item.dexterity) stats += `<span>Zręczność: +${item.dexterity}</span>`;
        if (item.intelligence) stats += `<span>Inteligencja: +${item.intelligence}</span>`;
        if (item.endurance) stats += `<span>Wytrzymałość: +${item.endurance}</span>`;
        if (item.luck) stats += `<span>Szczęście: +${item.luck}</span>`;

        div.innerHTML = `
            <div class="inventory-item-header">
                <strong>${item.name}</strong>
                <span class="inventory-quantity">x${invItem.quantity}</span>
            </div>

            <div class="inventory-item-tags">
                <span>Rzadkość: ${item.rarity}</span>
                <span>Typ: ${item.type}</span>
                <span>Wartość: ${item.value || 0} 💰</span>
            </div>

            <div class="inventory-item-stats">
                ${stats}
            </div>

            <div class="inventory-actions">
                ${equipButton}
                <button onclick="sellItem('${invItem.itemId}', 1)">Sprzedaj 1</button>
                <button onclick="sellAllItems('${invItem.itemId}')">Sprzedaj wszystko</button>
            </div>
        `;

        container.appendChild(div);
    });
}