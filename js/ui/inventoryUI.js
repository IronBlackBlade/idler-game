let currentInventoryFilter = "all";

function setInventoryFilter(filter) {
    currentInventoryFilter = filter;
    renderInventory();
}

function isMiningInventoryItem(itemId) {
    if (
        typeof miningAreas === "undefined" ||
        !Array.isArray(miningAreas)
    ) {
        return false;
    }

    return miningAreas.some(area => {
        const allDrops = [
            ...(area.basicDrops || []),
            ...(area.rareDrops || []),
            ...(area.exceptionalDrops || [])
        ];

        return allDrops.some(drop => {
            return drop.itemId === itemId;
        });
    });
}

function isHerbalismInventoryItem(itemId) {
    if (
        typeof herbalismAreas === "undefined" ||
        !Array.isArray(herbalismAreas)
    ) {
        return false;
    }

    return herbalismAreas.some(area => {
        const allDrops = [
            ...(area.basicDrops || []),
            ...(area.rareDrops || []),
            ...(area.exceptionalDrops || [])
        ];

        return allDrops.some(drop => {
            return drop.itemId === itemId;
        });
    });
}

function getInventoryItemCategory(
    item,
    itemId
) {
    if (!item) {
        return "other";
    }

    if (
        isMiningInventoryItem(itemId)
    ) {
        return "mining";
    }

    if (
        isHerbalismInventoryItem(itemId)
    ) {
        return "herbalism";
    }

    if (
    item.type ===
    "crafting_material"
) {
    return "crafting_material";
}

if (
    item.type ===
    "vendor_trash"
) {
    return "vendor_trash";
}

    if (!item.type) {
        return "other";
    }

if (item.type === "material") {
    return "crafting_material";
}

    if (item.type === "recipe") {
        return "recipe";
    }

    if (item.type === "weapon") {
        return "weapon";
    }

    const armorTypes = [
        "shield",
        "helmet",
        "armor",
        "pants",
        "boots",
        "gloves"
    ];

    if (armorTypes.includes(item.type)) {
        return "armor";
    }

    const jewelryTypes = [
        "ring",
        "amulet",
        "talisman"
    ];

    if (jewelryTypes.includes(item.type)) {
        return "jewelry";
    }

    return "other";
}

function getItemRarityLabel(rarity) {
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

function renderInventory() {
    const container = document.getElementById("inventory-list");

    if (!container) return;

    container.innerHTML = "";

const filters = [
    {
        id: "all",
        name: "Wszystko"
    },
    {
        id: "crafting_material",
        name: "🔧 Rzemiosło"
    },
    {
        id: "vendor_trash",
        name: "💰 Na sprzedaż"
    },
    {
        id: "mining",
        name: "⛏️ Kopalnia"
    },
    {
        id: "herbalism",
        name: "🌿 Zielarstwo"
    },
    {
        id: "weapon",
        name: "Broń"
    },
    {
        id: "armor",
        name: "Pancerz"
    },
    {
        id: "jewelry",
        name: "Biżuteria"
    },
    {
        id: "recipe",
        name: "Receptury"
    }
];

    const filtersDiv = document.createElement("div");
    filtersDiv.className = "inventory-filters";

    filters.forEach(filter => {
        const button = document.createElement("button");
        button.textContent = filter.name;
        button.dataset.filter =
    filter.id;

        if (currentInventoryFilter === filter.id) {
            button.classList.add("active");
        }

        button.onclick = () => setInventoryFilter(filter.id);

        filtersDiv.appendChild(button);
    });

    container.appendChild(filtersDiv);

    if (!player.inventory || player.inventory.length === 0) {
        const emptyInfo = document.createElement("p");
        emptyInfo.className = "inventory-empty";
        emptyInfo.textContent = "Ekwipunek jest pusty.";
        container.appendChild(emptyInfo);
        return;
    }

    const filteredInventory = player.inventory.filter(invItem => {
        const item = items[invItem.itemId];
        const category =
    getInventoryItemCategory(
        item,
        invItem.itemId
    );

        if (currentInventoryFilter === "all") return true;

        return category === currentInventoryFilter;
    });

    if (filteredInventory.length === 0) {
        const emptyInfo = document.createElement("p");
        emptyInfo.className = "inventory-empty";
        emptyInfo.textContent = "Brak przedmiotów w tej kategorii.";
        container.appendChild(emptyInfo);
        return;
    }

    const itemsGrid = document.createElement("div");
    itemsGrid.className = "inventory-items-grid";

filteredInventory.forEach(invItem => {
    const item = items[invItem.itemId];

    if (!item) {
        console.warn(
            "Brak przedmiotu:",
            invItem.itemId
        );
        return;
    }

    const itemCategory =
        getInventoryItemCategory(
            item,
            invItem.itemId
        );

    let purposeLabel = "";

    if (
        itemCategory ===
        "crafting_material"
    ) {
        purposeLabel =
            "Materiał rzemieślniczy";
    }

    if (
        itemCategory ===
        "vendor_trash"
    ) {
        purposeLabel =
            "Wyłącznie na sprzedaż";
    }

    const div =
        document.createElement("div");

    div.className =
        "inventory-item";

const compactCategories = [
    "crafting_material",
    "vendor_trash",
    "recipe",
    "mining",
    "herbalism"
];

if (
    compactCategories.includes(
        itemCategory
    )
) {
    div.classList.add(
        "inventory-item-compact"
    );
}

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
        <strong>
            ${item.name}
        </strong>

        <span class="inventory-quantity">
            x${invItem.quantity}
        </span>
    </div>

    <div class="inventory-item-tags">
        <span class="inventory-rarity-tag">
            ${getItemRarityLabel(item.rarity)}
        </span>

        ${
            purposeLabel
                ? `
                    <span class="inventory-purpose-tag">
                        ${purposeLabel}
                    </span>
                `
                : ""
        }

        <span class="inventory-value-tag">
            Cena sprzedaży:
            ${
                typeof getFinalSellPrice === "function"
                    ? getFinalSellPrice(item)
                    : item.value || 0
            }
            💰
        </span>
    </div>

    <div class="inventory-item-stats">
        ${stats}
    </div>

    <div class="inventory-actions">
        ${equipButton}

        <button
            onclick="sellItem('${invItem.itemId}', 1)"
        >
            Sprzedaj 1
        </button>

        <button
            onclick="sellAllItems('${invItem.itemId}')"
        >
            Sprzedaj wszystko
        </button>
    </div>
`;

        itemsGrid.appendChild(div);
    });

    container.appendChild(itemsGrid);
}