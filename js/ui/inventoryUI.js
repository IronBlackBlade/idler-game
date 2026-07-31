
function getInventoryLockButtonHtml(
    itemId
) {
    const isLocked =
        typeof isInventoryItemLocked ===
            "function"
            ? isInventoryItemLocked(
                itemId
            )
            : false;

    return `
        <button
            class="
                inventory-lock-button
                ${isLocked
            ? "locked"
            : ""
        }
            "
            onclick="toggleInventoryItemLock(
                '${itemId}'
            )"
        >
            ${isLocked
            ? "🔓 Odblokuj"
            : "🔒 Zablokuj"
        }
        </button>
    `;
}

function getInventoryLockBadgeHtml(
    itemId
) {
    const isLocked =
        typeof isInventoryItemLocked ===
            "function"
            ? isInventoryItemLocked(
                itemId
            )
            : false;

    if (!isLocked) {
        return "";
    }

    return `
        <span class="inventory-lock-tag">
            🔒 Zablokowany
        </span>
    `;
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


function getPotionEffectText(potionItem) {
    const effectValue =
        Number(potionItem.effectValue) || 0;

    const effectTexts = {
        mining_speed:
            "Szybkość kopania: +" +
            effectValue +
            "%",

        herbalism_speed:
            "Szybkość zielarstwa: +" +
            effectValue +
            "%",

        hunter_luck:
            "Szansa na zdobycie łupu: +" +
            effectValue +
            "%",
        melee_weapon_damage:
            "Obrażenia broni w zwarciu: +" +
            effectValue +
            "%",

        ranged_weapon_damage:
            "Obrażenia broni dystansowej: +" +
            effectValue +
            "%",

        magic_weapon_damage:
            "Obrażenia różdżek i kosturów: +" +
            effectValue +
            "%",

        spell_damage:
            "Obrażenia czarów: +" +
            effectValue +
            "%",

        combat_defense:
            "Obrona bohatera: +" +
            effectValue +
            "%",

        mana_regeneration:
            "Regeneracja many: +" +
            effectValue +
            "%"
    };

    return (
        effectTexts[
        potionItem.potionEffectId
        ] ||
        "Specjalny efekt mikstury"
    );
}

function getPotionDurationText(
    durationSeconds
) {
    const safeDurationSeconds =
        Math.max(
            1,
            Number(durationSeconds) || 300
        );

    if (
        safeDurationSeconds >= 60 &&
        safeDurationSeconds % 60 === 0
    ) {
        return (
            safeDurationSeconds / 60 +
            " min"
        );
    }

    return (
        safeDurationSeconds +
        " s"
    );
}

function updateInventoryTrashSellButton() {
    const button =
        document.getElementById(
            "inventory-sell-trash-button"
        );

    if (!button) {
        return;
    }

    const summary =
        typeof getSellableMonsterTrashSummary ===
        "function"
            ? getSellableMonsterTrashSummary()
            : {
                items: [],
                totalQuantity: 0,
                totalGold: 0
            };

    button.textContent =
        "💰 Sprzedaj śmieci (" +
        summary.totalGold
            .toLocaleString(
                "pl-PL"
            ) +
        " 💰)";

    button.disabled =
        summary.totalQuantity <= 0;
}

function renderInventory() {
    const container =
        document.getElementById(
            "inventory-list"
        );

    if (!container) return;

    updateInventoryTrashSellButton();

    container.innerHTML = "";

    const filters = [
        {
            id: "all",
            name: "🎒 Wszystko"
        },
        {
            id: "monster_material",
            name: "👹Łupy z potworów"
        },
        {
            id: "crafting_material",
            name: "🔧 Rzemiosło"
        },
        {
            id: "processed_material",
            name: "⚒️ Wytworzone"
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
            id: "fishing",
            name: "🎣 Łowienie"
        },
        {
            id: "potion",
            name: "🧪 Mikstury"
        },
        {
            id: "food",
            name: "🍲 Jedzenie"
        },
        {
            id: "weapon",
            name: "⚔️ Broń"
        },
        {
            id: "armor",
            name: "🛡️ Pancerz"
        },
        {
            id: "jewelry",
            name: "💍 Biżuteria"
        },
        {
            id: "recipe",
            name: "📜 Receptury"
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

    const subfilters =
        getInventorySubfilters(
            currentInventoryFilter
        );

    if (subfilters.length > 0) {
        const subfiltersDiv =
            document.createElement(
                "div"
            );

        subfiltersDiv.className =
            "inventory-subfilters";

        const subfiltersLabel =
            document.createElement(
                "span"
            );

        subfiltersLabel.className =
            "inventory-subfilters-label";

        subfiltersLabel.textContent =
            "Podkategoria:";

        subfiltersDiv.appendChild(
            subfiltersLabel
        );

        subfilters.forEach(
            subfilter => {
                const button =
                    document.createElement(
                        "button"
                    );

                button.textContent =
                    subfilter.name;

                button.dataset.subfilter =
                    subfilter.id;

                if (
                    currentInventorySubfilter ===
                    subfilter.id
                ) {
                    button.classList.add(
                        "active"
                    );
                }

                button.onclick = () => {
                    setInventorySubfilter(
                        subfilter.id
                    );
                };

                subfiltersDiv.appendChild(
                    button
                );
            }
        );

        container.appendChild(
            subfiltersDiv
        );
    }


    if (!player.inventory || player.inventory.length === 0) {
        const emptyInfo = document.createElement("p");
        emptyInfo.className = "inventory-empty";
        emptyInfo.textContent = "Ekwipunek jest pusty.";
        container.appendChild(emptyInfo);
        return;
    }

    const filteredInventory =
        player.inventory.filter(
            invItem => {
                const item =
                    items[
                    invItem.itemId
                    ];

                const category =
                    getInventoryItemCategory(
                        item,
                        invItem.itemId
                    );

                if (
                    currentInventoryFilter ===
                    "all"
                ) {
                    return true;
                }

                if (
                    category !==
                    currentInventoryFilter
                ) {
                    return false;
                }

                if (
                    currentInventorySubfilter ===
                    "all"
                ) {
                    return true;
                }

                const subcategory =
                    getInventoryItemSubcategory(
                        item,
                        invItem.itemId
                    );

                return (
                    subcategory ===
                    currentInventorySubfilter
                );
            }
        );

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

        const itemIsLocked =
            typeof isInventoryItemLocked ===
                "function"
                ? isInventoryItemLocked(
                    invItem.itemId
                )
                : false;

        const lockButtonHtml =
            getInventoryLockButtonHtml(
                invItem.itemId
            );

        const lockBadgeHtml =
            getInventoryLockBadgeHtml(
                invItem.itemId
            );

        const sellDisabledAttribute =
            itemIsLocked
                ? "disabled"
                : "";

        const itemCategory =
            getInventoryItemCategory(
                item,
                invItem.itemId
            );

        let purposeLabel = "";

        if (
            itemCategory ===
            "monster_material"
        ) {
            purposeLabel =
                item.type ===
                    "vendor_trash"
                    ? "Śmieć — tylko na sprzedaż"
                    : "Składnik z potwora";
        }

        if (
            itemCategory ===
            "crafting_material"
        ) {
            purposeLabel =
                "Materiał rzemieślniczy";
        }


        if (
            itemCategory ===
            "processed_material"
        ) {
            purposeLabel =
                "Materiał wytworzony";
        }

        if (
            itemCategory === "fishing"
        ) {
            purposeLabel =
                item.type ===
                    "fishing_bait"
                    ? "Przynęta wędkarska"
                    : item.type ===
                    "fishing_treasure"
                    ? "Skarb z łowienia"
                    : "Połów";
        }

        if (
            itemCategory ===
            "vendor_trash"
        ) {
            purposeLabel =
                "Wyłącznie na sprzedaż";
        }

        if (itemCategory === "food") {
            purposeLabel =
                "Potrawa — aktywuje jeden efekt posiłku";
        }

        const div =
            document.createElement("div");

        div.className =
            "inventory-item";

        div.classList.add(
            "rarity-" +
            (
                item.rarity ||
                "common"
            )
        );

        if (itemIsLocked) {
            div.classList.add(
                "inventory-item-locked"
            );
        }

        const compactCategories = [
            "monster_material",
            "crafting_material",
            "processed_material",
            "vendor_trash",
            "recipe",
            "mining",
            "herbalism",
            "fishing"
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

        const foodUseButton = item.type === "food"
            ? `<button class="inventory-use-food-button" onclick="useFood('${invItem.itemId}')">🍴 Zjedz</button>`
            : "";

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
        if (item.type === "food") {
            stats += `<span>${item.foodEffectDescription || "Efekt posiłku"}</span>`;
            stats += `<span>Czas działania: ${formatCookingDuration(item.durationSeconds)}</span>`;
        }
        getWeaponCombatLabels(
            item
        ).forEach(label => {
            stats += `<span>${label}</span>`;
        });
        if (itemCategory === "potion") {
            const effectText =
                getPotionEffectText(item);

            const durationText =
                getPotionDurationText(
                    item.durationSeconds
                );

            div.classList.add(
                "inventory-item-potion"
            );

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
        ${lockBadgeHtml}
            <span class="inventory-rarity-tag">
                ${getItemRarityLabel(item.rarity)}
            </span>

            <span class="inventory-potion-duration-tag">
                ⏱️ ${durationText}
            </span>

            <span class="inventory-value-tag">
                Cena sprzedaży:
                ${typeof getFinalSellPrice ===
                    "function"
                    ? getFinalSellPrice(item)
                    : item.value || 0
                }
                💰
            </span>
        </div>

        <p class="inventory-potion-description">
            ${item.description ||
                "Mikstura zapewniająca czasowy efekt."
                }
        </p>

        <div class="inventory-potion-effect">
            ${effectText}
        </div>

        <div class="inventory-actions">
            <button
                class="inventory-use-potion-button"
                onclick="usePotion('${invItem.itemId}')"
            >
                🧪 Użyj
            </button>

            <button
    onclick="sellItem('${invItem.itemId}', 1)"
    ${sellDisabledAttribute}
>
    Sprzedaj 1
</button>

<button
    onclick="sellAllItems('${invItem.itemId}')"
    ${sellDisabledAttribute}
>
    Sprzedaj wszystko
</button>
        </div>
    `;

            itemsGrid.appendChild(div);

            return;
        }

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
    ${lockBadgeHtml}
        <span class="inventory-rarity-tag">
            ${getItemRarityLabel(item.rarity)}
        </span>

        ${purposeLabel
                ? `
                    <span class="inventory-purpose-tag">
                        ${purposeLabel}
                    </span>
                `
                : ""
            }

        <span class="inventory-value-tag">
            Cena sprzedaży:
            ${typeof getFinalSellPrice === "function"
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

    ${foodUseButton}

    ${lockButtonHtml}

    <button
        onclick="sellItem('${invItem.itemId}', 1)"
        ${sellDisabledAttribute}
    >
        Sprzedaj 1
    </button>

    <button
        onclick="sellAllItems('${invItem.itemId}')"
        ${sellDisabledAttribute}
    >
        Sprzedaj wszystko
    </button>
</div>
`;

        itemsGrid.appendChild(div);
    });

    container.appendChild(itemsGrid);
}
