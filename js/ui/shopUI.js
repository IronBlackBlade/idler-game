const openShopCategories = {};

function renderShop() {
    const container = document.getElementById("shop-list");

    if (!container) return;

    if (typeof shopItems === "undefined") {
        console.warn("shopItems is not defined");
        return;
    }

    if (typeof shopCategories === "undefined") {
        console.warn("shopCategories is not defined");
        return;
    }

    container.innerHTML = "";

    shopCategories.forEach(category => {
        const categoryItems = shopItems.filter(shopItem => {
            return shopItem.category === category.id;
        });

const details = document.createElement("details");
details.className = "shop-category";

details.open = openShopCategories[category.id] === true;

details.addEventListener("toggle", () => {
    openShopCategories[category.id] = details.open;
});


        const summary = document.createElement("summary");
        summary.textContent = category.name + " (" + categoryItems.length + ")";
        details.appendChild(summary);

        const itemsContainer = document.createElement("div");
        itemsContainer.className = "shop-category-items";

        if (categoryItems.length === 0) {
            itemsContainer.innerHTML = `<p class="empty-category">Brak przedmiotów w tej kategorii.</p>`;
        }

        categoryItems.forEach(shopItem => {
            const item = items[shopItem.itemId];

            if (!item) {
                console.warn("Shop item not found:", shopItem.itemId);
                return;
            }

            const requiredLevel = item.requiredLevel || 1;
            const canBuy = player.level >= requiredLevel && player.gold >= shopItem.price;
            const hasLevel = player.level >= requiredLevel;

            const div = document.createElement("div");
            div.className = "shop-item";

            if (!hasLevel) {
                div.classList.add("shop-item-locked");
            }

let stats = "";

if (item.damage) stats += `<span>Obrażenia: ${item.damage}</span>`;
if (item.strength) stats += `<span>Siła: +${item.strength}</span>`;
if (item.dexterity) stats += `<span>Zręczność: +${item.dexterity}</span>`;
if (item.intelligence) stats += `<span>Inteligencja: +${item.intelligence}</span>`;
if (item.endurance) stats += `<span>Wytrzymałość: +${item.endurance}</span>`;
if (item.luck) stats += `<span>Szczęście: +${item.luck}</span>`;

div.innerHTML = `
    <div class="shop-item-header">
        <strong>${item.name}</strong>

        <button 
            class="shop-buy-btn"
            onclick="buyItem('${shopItem.itemId}', ${shopItem.price})"
            ${canBuy ? "" : "disabled"}
        >
            ${hasLevel ? "Kup" : "Zablokowane"}
        </button>
    </div>

    <div class="shop-item-tags">
        <span>Rzadkość: ${item.rarity}</span>
        <span>Typ: ${item.type}</span>
        <span>Poziom: ${requiredLevel}</span>
        <span>Cena: ${shopItem.price} 💰</span>
    </div>

    <div class="shop-item-stats">
        ${stats}
    </div>
`;

            itemsContainer.appendChild(div);
        });

        details.appendChild(itemsContainer);
        container.appendChild(details);
    });
}