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
        key: "armor",
        label: "Pancerz",
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
    },
    {
        key: "critChance",
        label: "Szansa na krytyk (p.p.)",
        showPlus: true
    },
    {
        key: "critDamage",
        label: "Obrażenia krytyczne (p.p.)",
        showPlus: true
    },
    {
        key: "dodgeChance",
        label: "Szansa na unik (p.p.)",
        showPlus: true
    },
    {
        key: "lootBonus",
        label: "Bonus do łupu (p.p.)",
        showPlus: true
    }
];

const shopProfessionToolBonusDefinitions = [
    {
        key: "miningSpeedPercent",
        label: "Szybkość kopania",
        showPlus: true
    },
    {
        key: "extraOreChancePercent",
        label: "Dodatkowa ruda",
        showPlus: true
    },
    {
        key: "herbalismSpeedPercent",
        label: "Szybkość zielarstwa",
        showPlus: true
    },
    {
        key: "extraHerbChancePercent",
        label: "Dodatkowe zioło",
        showPlus: true
    },
    {
        key: "fishingSpeedPercent",
        label: "Szybkość łowienia",
        showPlus: true
    },
    {
        key: "rareFishChancePercent",
        label: "Rzadka ryba",
        showPlus: true
    },
    {
        key: "alchemySpeedPercent",
        label: "Szybkość warzenia",
        showPlus: true
    },
    {
        key: "extraPotionChancePercent",
        label: "Dodatkowa mikstura",
        showPlus: true
    },
    {
        key: "cookingExpPercent",
        label: "Doświadczenie gotowania",
        showPlus: true
    },
    {
        key: "extraMealChancePercent",
        label: "Dodatkowa potrawa",
        showPlus: true
    },
    {
        key: "craftingExpPercent",
        label: "Doświadczenie wytwarzania",
        showPlus: true
    },
    {
        key: "materialRefundChancePercent",
        label: "Zwrot składnika",
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
    const isProfessionTool =
        item?.type ===
        "profession_tool";

    const comparisonSlot =
        isProfessionTool
            ? null
            : getShopComparisonSlot(
                item
            );

    const equippedItemId =
        isProfessionTool
            ? player.professionTools?.[
                item.toolType
            ]
            : comparisonSlot
            ? player.equipment?.[
                comparisonSlot
            ]
                : null;

    const equippedItem =
        equippedItemId
            ? items[equippedItemId]
            : null;

    const comparisonRows = [];

    const comparisonDefinitions =
        isProfessionTool
            ? shopProfessionToolBonusDefinitions
            : shopComparisonStatDefinitions;

    comparisonDefinitions
        .forEach(
            statDefinition => {
                const newValue =
                    Number(
                        isProfessionTool
                            ? item?.bonuses?.[
                                statDefinition.key
                            ]
                            : item?.[
                                statDefinition.key
                            ]
                    ) || 0;

                const equippedValue =
                    Number(
                        isProfessionTool
                            ? equippedItem?.bonuses?.[
                                statDefinition.key
                            ]
                            : equippedItem?.[
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
                        differenceClass,

                    rawDifference:
                        difference
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
    talisman: "Talizman",
    pickaxe: "Kopalnia",
    sickle: "Zielarstwo",
    fishingRod: "Łowienie",
    alchemyKit: "Alchemia",
    cookingTools: "Gotowanie",
    craftingHammer: "Wytwarzanie"
};

function getShopEquippedSlots(
    itemId
) {
    const item =
        items[itemId];

    if (
        item?.type ===
        "profession_tool"
    ) {
        return (
            player.professionTools?.[
                item.toolType
            ] === itemId
                ? [item.toolType]
                : []
        );
    }

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
        getInventoryItemQuantity(
            itemId
        )

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

    comparison.rows
        .forEach(
            comparisonRow => {
                const difference =
                    Number(
                        comparisonRow
                            .rawDifference
                    ) || 0;

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

    if (
        firstItem.type ===
            "profession_tool" &&
        secondItem.type ===
            "profession_tool"
    ) {
        const toolTypeOrder = [
            "pickaxe",
            "sickle",
            "fishingRod",
            "alchemyKit",
            "cookingTools",
            "craftingHammer"
        ];

        const firstToolTypeIndex =
            toolTypeOrder.indexOf(
                firstItem.toolType
            );

        const secondToolTypeIndex =
            toolTypeOrder.indexOf(
                secondItem.toolType
            );

        if (
            firstToolTypeIndex !==
            secondToolTypeIndex
        ) {
            return (
                firstToolTypeIndex -
                secondToolTypeIndex
            );
        }
    }

    /*
     * Najpierw sortujemy według poziomu.
     * Dzięki temu przedmioty zawsze idą
     * od najsłabszego do najmocniejszego.
     */
    const firstRequiredLevel =
        Math.max(
            1,
            Number(
                firstItem.type ===
                    "profession_tool"
                    ? firstItem
                        .requiredProfessionLevel
                    : firstItem.requiredLevel
            ) || 1
        );

    const secondRequiredLevel =
        Math.max(
            1,
            Number(
                secondItem.type ===
                    "profession_tool"
                    ? secondItem
                        .requiredProfessionLevel
                    : secondItem.requiredLevel
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

    /*
     * Przedmioty z tego samego poziomu
     * układamy od tańszego do droższego.
     */
    const firstPrice =
        Math.max(
            0,
            Number(
                firstShopItem.price
            ) || 0
        );

    const secondPrice =
        Math.max(
            0,
            Number(
                secondShopItem.price
            ) || 0
        );

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

