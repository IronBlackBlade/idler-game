const savedShopCategory =
    localStorage.getItem(
        "idler_shop_category"
    );

let currentShopCategory =
    savedShopCategory || null;

function setShopCategory(
    categoryId
) {
    currentShopCategory =
        categoryId;

    localStorage.setItem(
        "idler_shop_category",
        categoryId
    );

    renderShop();
}

function openShopItemFromJournal(
    itemId
) {
    const shopEntry =
        typeof shopItems !==
            "undefined"
            ? shopItems.find(
                shopItem => {
                    return (
                        shopItem.itemId ===
                        itemId
                    );
                }
            )
            : null;

    if (!shopEntry) {
        console.warn(
            "Przedmiot nie jest dostępny u Kupca:",
            itemId
        );

        return;
    }

    currentShopCategory =
        shopEntry.category;

    localStorage.setItem(
        "idler_shop_category",
        currentShopCategory
    );

    if (
        typeof showScreen ===
        "function"
    ) {
        showScreen(
            "screen-shop"
        );
    }

    renderShop();

    if (
        typeof focusJournalNavigationTarget ===
            "function"
    ) {
        focusJournalNavigationTarget(
            '[data-shop-item-id="' +
            itemId +
            '"]'
        );
    }
}

function updateShopQuantityCost(
    itemId,
    unitPrice
) {
    const input =
        document.getElementById(
            "shop-quantity-" + itemId
        );
    const costElement =
        document.getElementById(
            "shop-quantity-cost-" +
            itemId
        );
    const buyButton =
        document.getElementById(
            "shop-quantity-buy-" +
            itemId
        );

    if (
        !input ||
        !costElement ||
        !buyButton
    ) {
        return;
    }

    const quantity = Math.max(
        0,
        Math.min(
            99999,
            Math.floor(
                Number(input.value) || 0
            )
        )
    );
    const finalUnitPrice =
        typeof getFinalTradeBulkBuyPrice ===
            "function"
            ? getFinalTradeBulkBuyPrice(
                unitPrice,
                quantity
            )
            : (
                typeof getFinalShopItemPrice ===
                    "function"
                    ? getFinalShopItemPrice(
                        unitPrice
                    )
                    : Math.max(
                        0,
                        Number(unitPrice) || 0
                    )
            );

    const totalCost =
        quantity *
        finalUnitPrice;

    costElement.textContent =
        totalCost.toLocaleString("pl-PL") +
        " 💰";
    buyButton.disabled =
        quantity <= 0 ||
        player.gold < totalCost;
    buyButton.textContent =
        quantity <= 0
            ? "Wpisz liczbę sztuk"
            : player.gold < totalCost
                ? "Brakuje złota"
                : "Kup " +
                quantity.toLocaleString(
                    "pl-PL"
                ) +
                " szt.";
}

function buySelectedShopQuantity(
    itemId,
    unitPrice
) {
    const input =
        document.getElementById(
            "shop-quantity-" + itemId
        );

    if (!input) {
        return;
    }

    const quantity = Math.max(
        0,
        Math.min(
            99999,
            Math.floor(
                Number(input.value) || 0
            )
        )
    );

    if (quantity <= 0) {
        showNotification(
            "Wpisz liczbę przynęt większą od zera.",
            "error"
        );
        return;
    }

    buyItemQuantity(
        itemId,
        unitPrice,
        quantity
    );
}

function renderShop() {
    const container = document.getElementById("shop-list");

    if (!container) {
        return;
    }

    if (typeof shopItems === "undefined") {
        console.warn("shopItems is not defined");
        return;
    }

    if (typeof shopCategories === "undefined") {
        console.warn("shopCategories is not defined");
        return;
    }

    container.innerHTML = "";

    /*
     * Usuwa przypadkowo zdublowane kategorie.
     * Zostaje tylko pierwsza kategoria o danym id.
     */
    const uniqueCategories = shopCategories.filter((category, index, categories) => {
        return categories.findIndex(otherCategory => {
            return otherCategory.id === category.id;
        }) === index;
    });

    /*
     * Sprawdzamy, czy zapisana kategoria
     * nadal istnieje.
     */
    const selectedCategoryExists =
        uniqueCategories.some(
            category => {
                return (
                    category.id ===
                    currentShopCategory
                );
            }
        );

    if (
        !selectedCategoryExists &&
        uniqueCategories.length > 0
    ) {
        currentShopCategory =
            uniqueCategories[0].id;

        localStorage.setItem(
            "idler_shop_category",
            currentShopCategory
        );
    }

    /*
     * Pasek zakładek korzysta z tych samych
     * klas co zakładki Bohatera.
     */
    const tabsContainer =
        document.createElement(
            "div"
        );

    tabsContainer.className =
        "hero-tabs shop-tabs";

    uniqueCategories.forEach(
        category => {
            const categoryItemsCount =
                shopItems
                    .filter(shopItem => {
                        return (
                            shopItem.category ===
                            category.id
                        );
                    })
                    .filter(
                        (
                            shopItem,
                            index,
                            filteredItems
                        ) => {
                            return (
                                filteredItems
                                    .findIndex(
                                        otherItem => {
                                            return (
                                                otherItem.itemId ===
                                                shopItem.itemId
                                            );
                                        }
                                    ) === index
                            );
                        }
                    )
                    .length;

            const tabButton =
                document.createElement(
                    "button"
                );

            tabButton.type =
                "button";

            tabButton.className =
                "hero-tab-button shop-tab-button";

            tabButton.textContent =
                category.name +
                " (" +
                categoryItemsCount +
                ")";

            if (
                category.id ===
                currentShopCategory
            ) {
                tabButton.classList.add(
                    "active"
                );
            }

            tabButton.onclick = () => {
                setShopCategory(
                    category.id
                );
            };

            tabsContainer.appendChild(
                tabButton
            );
        }
    );

    container.appendChild(
        tabsContainer
    );

    uniqueCategories.forEach(category => {
        /*
         * Najpierw wybieramy przedmioty należące do kategorii,
         * a następnie usuwamy duplikaty według itemId.
         */
        const categoryItems = shopItems
            .filter(shopItem => {
                return (
                    shopItem.category ===
                    category.id
                );
            })
            .filter(
                (
                    shopItem,
                    index,
                    filteredItems
                ) => {
                    return (
                        filteredItems.findIndex(
                            otherItem => {
                                return (
                                    otherItem.itemId ===
                                    shopItem.itemId
                                );
                            }
                        ) === index
                    );
                }
            );

        categoryItems.sort(
            compareShopItems
        );

        const details =
            document.createElement(
                "details"
            );

        details.className =
            "shop-category shop-category-tab-panel";

        /*
         * Otwarta i widoczna jest wyłącznie
         * aktualnie wybrana kategoria.
         */
        details.open =
            category.id ===
            currentShopCategory;

        details.hidden =
            category.id !==
            currentShopCategory;

        const summary = document.createElement("summary");
        summary.textContent = `${category.name} (${categoryItems.length})`;
        details.appendChild(summary);

        const itemsContainer = document.createElement("div");
        itemsContainer.className = "shop-category-items";

        if (categoryItems.length === 0) {
            itemsContainer.innerHTML = `
                <p class="empty-category">
                    Brak przedmiotów w tej kategorii.
                </p>
            `;
        }

        categoryItems.forEach(shopItem => {
            const item = items[shopItem.itemId];

            if (!item) {
                console.warn("Shop item not found:", shopItem.itemId);
                return;
            }

            const finalPrice =
                typeof getFinalShopItemPrice ===
                    "function"
                    ? getFinalShopItemPrice(
                        shopItem.price
                    )
                    : shopItem.price;
            const bulkTenUnitPrice =
                typeof getFinalTradeBulkBuyPrice ===
                    "function"
                    ? getFinalTradeBulkBuyPrice(
                        shopItem.price,
                        10
                    )
                    : finalPrice;

            const bulkTenTotalPrice =
                bulkTenUnitPrice *
                10;

            const hasTradeDiscount =
                finalPrice <
                shopItem.price;

            const requiredLevel =
                getShopItemRequiredLevel(
                    item
                );

            const currentLevel =
                getShopItemCurrentLevel(
                    item
                );

            const hasLevel =
                currentLevel >=
                requiredLevel;

            const isProfessionTool =
                item.type ===
                "profession_tool";

            const levelLabel =
                isProfessionTool
                    ? "Poziom profesji"
                    : "Poziom";

            const professionToolTierHtml =
                isProfessionTool
                    ? `
                        <span>
                            Ranga:
                            ${getProfessionToolTierLabel(
                        item
                    )}
                        </span>
                    `
                    : "";

            const hasEnoughGold =
                player.gold >=
                finalPrice;

            const canBuy =
                hasEnoughGold;
            const isFishingSupply =
                shopItem.category ===
                "fishing_supplies";
            const canBuyTen =
                player.gold >=
                bulkTenTotalPrice;

            const canBuyAndEquip =
                !isFishingSupply &&
                hasLevel &&
                hasEnoughGold;

            const ownership =
                getShopItemOwnership(
                    shopItem.itemId
                );

            const ownershipHtml =
                getShopOwnershipHtml(
                    ownership
                );

            const comparison =
                getShopItemComparison(
                    item
                );

            const comparisonTargetName =
                comparison.equippedItem
                    ? comparison
                        .equippedItem
                        .name
                    : "Pusty slot";

            const comparisonHtml =
                comparison.rows.length > 0
                    ? comparison.rows
                        .map(row => {
                            return `
                    <div
                        class="
                            shop-comparison-stat
                            ${row.differenceClass}
                        "
                    >
                        <span
                            class="shop-comparison-label"
                        >
                            ${row.label}
                        </span>

                        <strong
                            class="shop-comparison-value"
                        >
                            ${row.value}
                        </strong>

                        <span
                            class="shop-comparison-difference"
                        >
                            ${row.difference}
                        </span>
                    </div>
                `;
                        })
                        .join("")
                    : `
            <div class="shop-comparison-empty">
                Brak statystyk do porównania
            </div>
        `;

            const weaponCombatLabelsHtml =
                getWeaponCombatLabels(
                    item
                )
                    .map(label => {
                        return `
                <span>
                    ${label}
                </span>
            `;
                    })
                    .join("");


            const buyButtonText =
                !hasEnoughGold
                    ? "Brak złota"
                    : !hasLevel
                        ? (
                            isProfessionTool
                                ? "Kup do plecaka"
                                : "Kup jako materiał"
                        )
                        : "Kup";


            const upgradeStatus =
                getShopItemUpgradeStatus(
                    item
                );

            const upgradeStatusHtml = `
    <span
        class="
            shop-upgrade-badge
            shop-upgrade-${upgradeStatus.id}
        "
    >
        ${upgradeStatus.icon}
        ${upgradeStatus.label}
    </span>
`;

            const buyAndEquipButtonText =
                isFishingSupply
                    ? (
                        canBuyTen
                            ? "Kup ×10"
                            : "Brak złota na ×10"
                    )
                    : !hasLevel
                        ? "Niedostępne"
                        : !hasEnoughGold
                            ? "Brak złota"
                            : "Kup i załóż";

            const comparisonSlotArgument =
                comparison.slot
                    ? "'" +
                    comparison.slot +
                    "'"
                    : "null";

            const buyDisabledAttribute =
                canBuy
                    ? ""
                    : "disabled";

            const buyAndEquipDisabledAttribute =
                (
                    isFishingSupply
                        ? canBuyTen
                        : canBuyAndEquip
                )
                    ? ""
                    : "disabled";

            const secondaryButtonAction =
                isFishingSupply
                    ? (
                        "buyItemQuantity('" +
                        shopItem.itemId +
                        "', " +
                        shopItem.price +
                        ", 10)"
                    )
                    : (
                        "buyAndEquipItem('" +
                        shopItem.itemId +
                        "', " +
                        shopItem.price +
                        ", " +
                        comparisonSlotArgument +
                        ")"
                    );

            const secondaryButtonAvailable =
                isFishingSupply
                    ? canBuyTen
                    : canBuyAndEquip;
            const quantityPurchaseHtml =
                isFishingSupply
                    ? `
                        <div class="shop-quantity-purchase">
                            <label for="shop-quantity-${shopItem.itemId}">
                                Liczba sztuk
                                <input
                                    id="shop-quantity-${shopItem.itemId}"
                                    type="number"
                                    min="1"
                                    max="99999"
                                    step="1"
                                    value="10"
                                    inputmode="numeric"
                                    oninput="updateShopQuantityCost(
                                        '${shopItem.itemId}',
                                        ${finalPrice}
                                    )"
                                    onkeydown="if (event.key === 'Enter') {
                                        buySelectedShopQuantity(
                                            '${shopItem.itemId}',
                                            ${shopItem.price}
                                        )
                                    }"
                                >
                            </label>

                            <div class="shop-quantity-total">
                                Łączny koszt
                                <strong id="shop-quantity-cost-${shopItem.itemId}">
                                    ${bulkTenTotalPrice.toLocaleString("pl-PL")} 💰
                                </strong>
                            </div>

                            <button
                                id="shop-quantity-buy-${shopItem.itemId}"
                                class="shop-buy-btn shop-quantity-buy-button"
                                onclick="buySelectedShopQuantity(
                                    '${shopItem.itemId}',
                                    ${shopItem.price}
                                )"
                                ${canBuyTen ? "" : "disabled"}
                            >
                                ${canBuyTen
                        ? "Kup 10 szt."
                        : "Brakuje złota"}
                            </button>
                        </div>
                    `
                    : "";

            const div =
                document.createElement("div");

            div.className =
                "shop-item";

            div.dataset.shopItemId =
                shopItem.itemId;

            if (ownership.isInInventory) {
                div.classList.add(
                    "shop-item-owned"
                );
            }

            if (ownership.isEquipped) {
                div.classList.add(
                    "shop-item-equipped"
                );
            }

            if (item.rarity) {
                div.classList.add("rarity-" + item.rarity);
            }


            div.innerHTML = `
<div class="shop-item-header">
    <div class="shop-item-title">
        <strong>
            ${item.name}
        </strong>

        ${upgradeStatusHtml}
    </div>

    <div class="shop-item-actions">
    <button
        class="
            shop-buy-btn
            ${canBuy
                    ? ""
                    : "shop-button-unavailable"
                }
        "
        onclick="buyItem(
            '${shopItem.itemId}',
            ${shopItem.price}
        )"
${buyDisabledAttribute}
    >
        ${buyButtonText}
    </button>

    <button
        class="
            shop-buy-btn
            shop-buy-equip-btn
            ${secondaryButtonAvailable
                    ? ""
                    : "shop-button-unavailable"
                }
        "
        onclick="${secondaryButtonAction}"
        ${buyAndEquipDisabledAttribute}
    >
        ${buyAndEquipButtonText}
    </button>
</div>
    </div>

${ownershipHtml}

${quantityPurchaseHtml}

    <div class="shop-item-tags">
        <span>
            Rzadkość:
            ${typeof getRarityName ===
                    "function"
                    ? getRarityName(
                        item.rarity
                    )
                    : item.rarity
                }
        </span>

        <span>
            Typ:
            ${getShopItemTypeName(item)}
        </span>
${weaponCombatLabelsHtml}
        <span>
            ${levelLabel}:
            ${requiredLevel}
        </span>

        ${professionToolTierHtml}

<span
    class="${hasTradeDiscount
                    ? "shop-price-discounted"
                    : ""
                }"
>
    Cena:

    ${hasTradeDiscount
                    ? `
            <del>
                ${shopItem.price.toLocaleString(
                        "pl-PL"
                    )}
            </del>

            <strong>
                ${finalPrice.toLocaleString(
                        "pl-PL"
                    )} 💰
            </strong>
        `
                    : `
            ${finalPrice.toLocaleString(
                        "pl-PL"
                    )} 💰
        `
                }
</span>

${hasTradeDiscount
                    ? `
        <span class="shop-trade-discount">
            Handel:
            −${getTradeBuyPriceReduction()}%
        </span>
    `
                    : ""
                }
    </div>

    <div class="shop-comparison-target">
        Porównanie z:

        <strong>
            ${comparisonTargetName}
        </strong>
    </div>

    <div class="shop-item-stats">
        ${comparisonHtml}
    </div>
`;


            itemsContainer.appendChild(div);
        });

        details.appendChild(itemsContainer);
        container.appendChild(details);
    });
}

function getShopItemTypeName(item) {
    if (item.type === "weapon") {
        if (item.weaponType === "ranged") {
            return "Broń dystansowa";
        }

        if (item.weaponType === "magic") {
            return "Broń magiczna";
        }

        return "Broń biała";
    }

    const typeNames = {
        shield: "Tarcza",
        helmet: "Hełm",
        armor: "Pancerz",
        pants: "Spodnie",
        boots: "Buty",
        gloves: "Rękawice",
        ring: "Pierścień",
        amulet: "Amulet",
        talisman: "Talizman",
        fishing_bait:
            "Przynęta wędkarska",
        profession_tool:
            "Narzędzie profesji"
    };

    return typeNames[item.type] || item.type || "Przedmiot";
}
