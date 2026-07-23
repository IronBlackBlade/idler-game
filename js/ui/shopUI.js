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

const shopComparisonStatDefinitions = [
    {
        key: "damage",
        label: "Obrażenia",
        showPlus: false
    },
    {
        key: "attack",
        label: "Atak",
        showPlus: true
    },
    {
        key: "strength",
        label: "Siła",
        showPlus: true
    },
    {
        key: "dexterity",
        label: "Zręczność",
        showPlus: true
    },
    {
        key: "intelligence",
        label: "Inteligencja",
        showPlus: true
    },
    {
        key: "endurance",
        label: "Wytrzymałość",
        showPlus: true
    },
    {
        key: "luck",
        label: "Szczęście",
        showPlus: true
    }
];

function getShopEquipmentItemScore(
    item
) {
    if (!item) {
        return 0;
    }

    return shopComparisonStatDefinitions
        .reduce(
            (
                totalScore,
                statDefinition
            ) => {
                return (
                    totalScore +
                    (
                        Number(
                            item[
                            statDefinition.key
                            ]
                        ) || 0
                    )
                );
            },
            0
        );
}

function getShopComparisonSlot(
    item
) {
    if (!item) {
        return null;
    }

    const defaultSlots = {
        weapon: "weapon",
        shield: "shield",
        helmet: "helmet",
        armor: "armor",
        pants: "pants",
        boots: "boots",
        gloves: "gloves",
        amulet: "amulet",
        talisman: "talisman"
    };

    if (item.type !== "ring") {
        return (
            defaultSlots[item.type] ||
            null
        );
    }

    /*
     * Pierścienie mają dwa sloty.
     * Najpierw wybieramy pusty slot.
     */
    if (!player.equipment?.ring1) {
        return "ring1";
    }

    if (!player.equipment?.ring2) {
        return "ring2";
    }

    /*
     * Jeżeli oba są zajęte,
     * porównujemy nowy pierścień
     * ze słabszym z nich.
     */
    const firstRing =
        items[
        player.equipment.ring1
        ];

    const secondRing =
        items[
        player.equipment.ring2
        ];

    const firstRingScore =
        getShopEquipmentItemScore(
            firstRing
        );

    const secondRingScore =
        getShopEquipmentItemScore(
            secondRing
        );

    return firstRingScore <=
        secondRingScore
        ? "ring1"
        : "ring2";
}

function formatShopComparisonNumber(
    value
) {
    const safeValue =
        Number(value) || 0;

    if (Number.isInteger(safeValue)) {
        return String(safeValue);
    }

    return safeValue
        .toFixed(1)
        .replace(".", ",");
}

function formatShopStatValue(
    value,
    showPlus
) {
    const safeValue =
        Number(value) || 0;

    const formattedValue =
        formatShopComparisonNumber(
            safeValue
        );

    if (
        showPlus &&
        safeValue > 0
    ) {
        return "+" + formattedValue;
    }

    return formattedValue;
}

function formatShopStatDifference(
    difference
) {
    const safeDifference =
        Number(difference) || 0;

    if (safeDifference > 0) {
        return (
            "▲ +" +
            formatShopComparisonNumber(
                safeDifference
            )
        );
    }

    if (safeDifference < 0) {
        return (
            "▼ " +
            formatShopComparisonNumber(
                safeDifference
            )
        );
    }

    return "• 0";
}

function getShopItemComparison(
    item
) {
    const comparisonSlot =
        getShopComparisonSlot(
            item
        );

    const equippedItemId =
        comparisonSlot
            ? player.equipment?.[
            comparisonSlot
            ]
            : null;

    const equippedItem =
        equippedItemId
            ? items[equippedItemId]
            : null;

    const comparisonRows = [];

    shopComparisonStatDefinitions
        .forEach(
            statDefinition => {
                const newValue =
                    Number(
                        item?.[
                        statDefinition.key
                        ]
                    ) || 0;

                const equippedValue =
                    Number(
                        equippedItem?.[
                        statDefinition.key
                        ]
                    ) || 0;

                /*
                 * Pomijamy statystyki,
                 * których nie ma ani nowy,
                 * ani założony przedmiot.
                 */
                if (
                    newValue === 0 &&
                    equippedValue === 0
                ) {
                    return;
                }

                const difference =
                    newValue -
                    equippedValue;

                let differenceClass =
                    "neutral";

                if (difference > 0) {
                    differenceClass =
                        "positive";
                }

                if (difference < 0) {
                    differenceClass =
                        "negative";
                }

                comparisonRows.push({
                    label:
                        statDefinition.label,

                    value:
                        formatShopStatValue(
                            newValue,
                            statDefinition
                                .showPlus
                        ),

                    difference:
                        formatShopStatDifference(
                            difference
                        ),

                    differenceClass:
                        differenceClass
                });
            }
        );

    return {
        slot: comparisonSlot,
        equippedItem: equippedItem,
        rows: comparisonRows
    };
}

const shopEquipmentSlotNames = {
    weapon: "Broń",
    shield: "Tarcza",
    helmet: "Hełm",
    armor: "Pancerz",
    pants: "Spodnie",
    boots: "Buty",
    gloves: "Rękawice",
    ring1: "Pierścień 1",
    ring2: "Pierścień 2",
    amulet: "Amulet",
    talisman: "Talizman"
};

function getShopInventoryQuantity(
    itemId
) {
    if (
        !Array.isArray(
            player.inventory
        )
    ) {
        return 0;
    }

    const inventoryEntry =
        player.inventory.find(
            entry => {
                return (
                    entry.itemId ===
                    itemId
                );
            }
        );

    return Math.max(
        0,
        Number(
            inventoryEntry?.quantity
        ) || 0
    );
}

function getShopEquippedSlots(
    itemId
) {
    if (
        !player.equipment ||
        typeof player.equipment !==
        "object"
    ) {
        return [];
    }

    return Object.entries(
        player.equipment
    )
        .filter(
            (
                [
                    slot,
                    equippedItemId
                ]
            ) => {
                return (
                    equippedItemId ===
                    itemId
                );
            }
        )
        .map(
            ([slot]) => slot
        );
}

function getShopItemOwnership(
    itemId
) {
    const inventoryQuantity =
        getShopInventoryQuantity(
            itemId
        );

    const equippedSlots =
        getShopEquippedSlots(
            itemId
        );

    return {
        inventoryQuantity:
            inventoryQuantity,

        equippedSlots:
            equippedSlots,

        equippedCount:
            equippedSlots.length,

        isInInventory:
            inventoryQuantity > 0,

        isEquipped:
            equippedSlots.length > 0
    };
}

function getShopOwnershipHtml(
    ownership
) {
    if (!ownership) {
        return "";
    }

    const badges = [];

    if (ownership.isEquipped) {
        const equippedSlotNames =
            ownership.equippedSlots
                .map(slot => {
                    return (
                        shopEquipmentSlotNames[
                        slot
                        ] || slot
                    );
                })
                .join(", ");

        const equippedText =
            ownership.equippedCount > 1
                ? (
                    "✓ Założone x" +
                    ownership
                        .equippedCount
                )
                : "✓ Założone";

        badges.push(`
            <span
                class="
                    shop-ownership-badge
                    shop-ownership-equipped
                "
                title="Slot: ${equippedSlotNames}"
            >
                ${equippedText}
            </span>
        `);
    }

    if (ownership.isInInventory) {
        badges.push(`
            <span
                class="
                    shop-ownership-badge
                    shop-ownership-inventory
                "
            >
                🎒 W plecaku:
                ${ownership.inventoryQuantity}
            </span>
        `);
    }

    if (badges.length === 0) {
        return "";
    }

    return `
        <div class="shop-item-ownership">
            ${badges.join("")}
        </div>
    `;
}

function getShopItemUpgradeRank(
    item
) {
    const comparison =
        getShopItemComparison(
            item
        );

    let positiveStatsCount = 0;
    let negativeStatsCount = 0;

    let positiveDifferenceTotal = 0;
    let negativeDifferenceTotal = 0;

    shopComparisonStatDefinitions
        .forEach(
            statDefinition => {
                const newValue =
                    Number(
                        item?.[
                        statDefinition.key
                        ]
                    ) || 0;

                const equippedValue =
                    Number(
                        comparison
                            .equippedItem?.[
                        statDefinition.key
                        ]
                    ) || 0;

                const difference =
                    newValue -
                    equippedValue;

                if (difference > 0) {
                    positiveStatsCount++;

                    positiveDifferenceTotal +=
                        difference;
                }

                if (difference < 0) {
                    negativeStatsCount++;

                    negativeDifferenceTotal +=
                        Math.abs(
                            difference
                        );
                }
            }
        );

    const netDifference =
        positiveDifferenceTotal -
        negativeDifferenceTotal;

    return {
        positiveStatsCount:
            positiveStatsCount,

        negativeStatsCount:
            negativeStatsCount,

        positiveDifferenceTotal:
            positiveDifferenceTotal,

        negativeDifferenceTotal:
            negativeDifferenceTotal,

        netDifference:
            netDifference,

        isUpgrade:
            positiveStatsCount > 0 &&
            netDifference > 0
    };
}

function getShopItemUpgradeStatus(
    item
) {
    const upgradeRank =
        getShopItemUpgradeRank(
            item
        );

    if (
        upgradeRank.netDifference > 0
    ) {
        return {
            id: "upgrade",
            icon: "▲",
            label: "Ulepszenie"
        };
    }

    if (
        upgradeRank.netDifference < 0
    ) {
        return {
            id: "downgrade",
            icon: "▼",
            label: "Gorszy"
        };
    }

    return {
        id: "similar",
        icon: "•",
        label: "Podobny"
    };
}

function getShopItemSortGroup(
    shopItem
) {
    const item =
        items[
        shopItem?.itemId
        ];

    if (!item) {
        return 99;
    }

    const requiredLevel =
        Math.max(
            1,
            Number(
                item.requiredLevel
            ) || 1
        );

    const playerLevel =
        Math.max(
            1,
            Number(
                player.level
            ) || 1
        );

    /*
     * Grupa 5:
     * przedmiot zablokowany poziomem.
     */
    if (
        playerLevel <
        requiredLevel
    ) {
        return 5;
    }

    const ownership =
        getShopItemOwnership(
            shopItem.itemId
        );

    /*
     * Grupa 3:
     * przedmiot już posiadany.
     */
    if (
        ownership.isEquipped ||
        ownership.isInInventory
    ) {
        return 3;
    }

    const price =
        Math.max(
            0,
            Number(
                shopItem.price
            ) || 0
        );

    const playerGold =
        Math.max(
            0,
            Number(
                player.gold
            ) || 0
        );

    /*
     * Grupa 4:
     * poziom jest odpowiedni,
     * ale brakuje złota.
     */
    if (playerGold < price) {
        return 4;
    }

    const upgradeRank =
        getShopItemUpgradeRank(
            item
        );

    /*
     * Grupa 1:
     * dostępne ulepszenie.
     *
     * Grupa 2:
     * dostępny przedmiot, ale nie
     * jest wyraźnym ulepszeniem.
     */
    return upgradeRank.isUpgrade
        ? 1
        : 2;
}

function compareShopItems(
    firstShopItem,
    secondShopItem
) {
    const firstItem =
        items[
        firstShopItem?.itemId
        ];

    const secondItem =
        items[
        secondShopItem?.itemId
        ];

    if (!firstItem && !secondItem) {
        return 0;
    }

    if (!firstItem) {
        return 1;
    }

    if (!secondItem) {
        return -1;
    }

    const firstGroup =
        getShopItemSortGroup(
            firstShopItem
        );

    const secondGroup =
        getShopItemSortGroup(
            secondShopItem
        );

    /*
     * Najważniejsza jest grupa.
     */
    if (
        firstGroup !==
        secondGroup
    ) {
        return (
            firstGroup -
            secondGroup
        );
    }

    const firstRank =
        getShopItemUpgradeRank(
            firstItem
        );

    const secondRank =
        getShopItemUpgradeRank(
            secondItem
        );

    /*
     * W grupie posiadanych przedmiotów
     * najpierw pokazujemy założone.
     */
    if (firstGroup === 3) {
        const firstOwnership =
            getShopItemOwnership(
                firstShopItem.itemId
            );

        const secondOwnership =
            getShopItemOwnership(
                secondShopItem.itemId
            );

        if (
            firstOwnership.isEquipped !==
            secondOwnership.isEquipped
        ) {
            return firstOwnership
                .isEquipped
                ? -1
                : 1;
        }
    }

    /*
     * Zablokowane przedmioty sortujemy
     * od najbliższego wymaganego poziomu.
     */
    if (firstGroup === 5) {
        const firstRequiredLevel =
            Math.max(
                1,
                Number(
                    firstItem.requiredLevel
                ) || 1
            );

        const secondRequiredLevel =
            Math.max(
                1,
                Number(
                    secondItem.requiredLevel
                ) || 1
            );

        if (
            firstRequiredLevel !==
            secondRequiredLevel
        ) {
            return (
                firstRequiredLevel -
                secondRequiredLevel
            );
        }
    }

    /*
     * Lepszy łączny wynik statystyk
     * pojawia się wyżej.
     */
    if (
        firstRank.netDifference !==
        secondRank.netDifference
    ) {
        return (
            secondRank.netDifference -
            firstRank.netDifference
        );
    }

    /*
     * Przy remisie preferujemy więcej
     * zielonych statystyk.
     */
    if (
        firstRank.positiveStatsCount !==
        secondRank.positiveStatsCount
    ) {
        return (
            secondRank
                .positiveStatsCount -
            firstRank
                .positiveStatsCount
        );
    }

    /*
     * Następnie mniej czerwonych
     * statystyk.
     */
    if (
        firstRank.negativeStatsCount !==
        secondRank.negativeStatsCount
    ) {
        return (
            firstRank
                .negativeStatsCount -
            secondRank
                .negativeStatsCount
        );
    }

    /*
     * W grupie zbyt drogich przedmiotów
     * wyżej pokazujemy te, do których
     * brakuje mniej złota.
     */
    if (firstGroup === 4) {
        const firstMissingGold =
            Math.max(
                0,
                (
                    Number(
                        firstShopItem.price
                    ) || 0
                ) -
                (
                    Number(
                        player.gold
                    ) || 0
                )
            );

        const secondMissingGold =
            Math.max(
                0,
                (
                    Number(
                        secondShopItem.price
                    ) || 0
                ) -
                (
                    Number(
                        player.gold
                    ) || 0
                )
            );

        if (
            firstMissingGold !==
            secondMissingGold
        ) {
            return (
                firstMissingGold -
                secondMissingGold
            );
        }
    }

    /*
     * Kolejnym kryterium jest cena.
     */
    const firstPrice =
        Number(
            firstShopItem.price
        ) || 0;

    const secondPrice =
        Number(
            secondShopItem.price
        ) || 0;

    if (
        firstPrice !==
        secondPrice
    ) {
        return (
            firstPrice -
            secondPrice
        );
    }

    /*
     * Ostateczny remis rozstrzyga nazwa.
     */
    return (
        firstItem.name || ""
    ).localeCompare(
        secondItem.name || "",
        "pl"
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

            const requiredLevel =
                item.requiredLevel || 1;

            const hasLevel =
                player.level >=
                requiredLevel;

            const hasEnoughGold =
                player.gold >=
                shopItem.price;

const canBuy =
    hasEnoughGold;

const canBuyAndEquip =
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
            ? "Kup jako materiał"
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
                !hasLevel
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
    canBuyAndEquip
        ? ""
        : "disabled";

            const div = document.createElement("div");
            div.className = "shop-item";

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
            ${canBuyAndEquip
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
            ${canBuy
                    ? ""
                    : "shop-button-unavailable"
                }
        "
        onclick="buyAndEquipItem(
            '${shopItem.itemId}',
            ${shopItem.price},
            ${comparisonSlotArgument}
        )"
        ${buyAndEquipDisabledAttribute}
    >
        ${buyAndEquipButtonText}
    </button>
</div>
    </div>

${ownershipHtml}

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
            Poziom:
            ${requiredLevel}
        </span>

        <span>
            Cena:
            ${shopItem.price} 💰
        </span>
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
        talisman: "Talizman"
    };

    return typeNames[item.type] || item.type || "Przedmiot";
}