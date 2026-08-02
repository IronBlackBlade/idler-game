const equipmentComparisonStatDefinitions = [
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

function getDefaultEquipmentSlotForItem(
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
        ring: "ring1",
        amulet: "amulet",
        talisman: "talisman"
    };

    return (
        defaultSlots[item.type] ||
        null
    );
}

function getComparisonEquipmentSlot(
    item,
    preferredSlot = null
) {
    if (!item) {
        return null;
    }

    if (preferredSlot) {
        const preferredSlotDefinition =
            typeof equipmentSlotDefinitions !==
                "undefined"
                ? equipmentSlotDefinitions[
                    preferredSlot
                ]
                : null;

        if (
            preferredSlotDefinition &&
            preferredSlotDefinition.itemType ===
                item.type
        ) {
            return preferredSlot;
        }
    }

    /*
     * Jeżeli gracz kliknął konkretny
     * slot, porównujemy właśnie z nim.
     */
    if (
        typeof selectedEquipmentSlot !==
            "undefined" &&
        selectedEquipmentSlot
    ) {
        const slotDefinition =
            equipmentSlotDefinitions[
            selectedEquipmentSlot
            ];

        if (
            slotDefinition &&
            slotDefinition.itemType ===
            item.type
        ) {
            return selectedEquipmentSlot;
        }
    }

    /*
     * Bez wybranego slotu korzystamy
     * z domyślnego miejsca.
     */
    return getDefaultEquipmentSlotForItem(
        item
    );
}

function formatEquipmentComparisonNumber(
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

function formatEquipmentStatValue(
    value,
    showPlus
) {
    const safeValue =
        Number(value) || 0;

    const formattedValue =
        formatEquipmentComparisonNumber(
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

function formatEquipmentStatDifference(
    difference
) {
    const safeDifference =
        Number(difference) || 0;

    if (safeDifference > 0) {
        return (
            "▲ +" +
            formatEquipmentComparisonNumber(
                safeDifference
            )
        );
    }

    if (safeDifference < 0) {
        return (
            "▼ " +
            formatEquipmentComparisonNumber(
                safeDifference
            )
        );
    }

    return "• 0";
}

function getEquipmentItemComparison(
    item,
    preferredSlot = null
) {
    const comparisonSlot =
        getComparisonEquipmentSlot(
            item,
            preferredSlot
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

    equipmentComparisonStatDefinitions
        .forEach(statDefinition => {
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
             * Nie pokazujemy statystyki,
             * jeżeli oba przedmioty mają 0.
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
                key:
                    statDefinition.key,

                label:
                    statDefinition.label,

                value:
                    formatEquipmentStatValue(
                        newValue,
                        statDefinition
                            .showPlus
                    ),

                difference:
                    formatEquipmentStatDifference(
                        difference
                    ),

                rawDifference:
                    difference,

                differenceClass:
                    differenceClass
            });
        });

    return {
        slot: comparisonSlot,
        equippedItem: equippedItem,
        rows: comparisonRows
    };
}

function getEquipmentSetChangePreview(
    item,
    preferredSlot = null
) {
    const comparisonSlot =
        getComparisonEquipmentSlot(
            item,
            preferredSlot
        );

    if (
        !comparisonSlot ||
        !item?.id ||
        typeof getEquipmentSetThresholdChanges !==
            "function"
    ) {
        return {
            slot: comparisonSlot,
            activated: [],
            deactivated: []
        };
    }

    const previousEquipment = {
        ...(player.equipment || {})
    };
    const nextEquipment = {
        ...previousEquipment,
        [comparisonSlot]: item.id
    };

    return {
        slot: comparisonSlot,
        ...getEquipmentSetThresholdChanges(
            previousEquipment,
            nextEquipment
        )
    };
}

function getEquipmentSetChangePreviewHtml(
    item,
    preferredSlot = null
) {
    const preview =
        getEquipmentSetChangePreview(
            item,
            preferredSlot
        );

    if (
        preview.activated.length === 0 &&
        preview.deactivated.length === 0
    ) {
        return "";
    }

    const activatedHtml =
        preview.activated.map(entry => {
            return `
                <div class="equipment-set-change is-activated">
                    <span>✓</span>
                    <div>
                        <small>PO ZAŁOŻENIU AKTYWUJESZ</small>
                        <strong>
                            ${entry.definition.icon}
                            ${entry.threshold.pieces}/${entry.totalPieces}
                            · ${entry.threshold.name}
                        </strong>
                        <span>${entry.threshold.description}</span>
                    </div>
                </div>
            `;
        }).join("");

    const deactivatedHtml =
        preview.deactivated.map(entry => {
            return `
                <div class="equipment-set-change is-deactivated">
                    <span>!</span>
                    <div>
                        <small>PO ZAŁOŻENIU UTRACISZ</small>
                        <strong>
                            ${entry.definition.icon}
                            ${entry.threshold.pieces}/${entry.totalPieces}
                            · ${entry.threshold.name}
                        </strong>
                        <span>${entry.threshold.description}</span>
                    </div>
                </div>
            `;
        }).join("");

    return `
        <div class="equipment-set-change-preview">
            ${activatedHtml}
            ${deactivatedHtml}
        </div>
    `;
}

function getEquipmentComparisonPreviewHtml(
    item,
    options = {}
) {
    const comparison =
        getEquipmentItemComparison(
            item,
            options.preferredSlot || null
        );
    const targetName =
        comparison.equippedItem
            ? comparison.equippedItem.name
            : "Pusty slot";
    const rowsHtml =
        comparison.rows.length > 0
            ? comparison.rows.map(row => {
                return `
                    <div class="equipment-quick-comparison-row ${row.differenceClass}">
                        <span>${row.label}</span>
                        <strong>${row.value}</strong>
                        <em>${row.difference}</em>
                    </div>
                `;
            }).join("")
            : `
                <div class="equipment-quick-comparison-empty">
                    Brak statystyk do porównania
                </div>
            `;
    const setChangeHtml =
        getEquipmentSetChangePreviewHtml(
            item,
            options.preferredSlot || null
        );

    return `
        <section class="equipment-quick-comparison ${options.className || ""}">
            <header>
                <span>${options.title || "PORÓWNANIE Z ZAŁOŻONYM"}</span>
                <strong>${targetName}</strong>
            </header>
            <div class="equipment-quick-comparison-rows">
                ${rowsHtml}
            </div>
            ${setChangeHtml}
        </section>
    `;
}

function getEquipmentUpgradeRank(
    item
) {
    const comparison =
        getEquipmentItemComparison(
            item
        );

    let positiveStatsCount = 0;
    let negativeStatsCount = 0;

    let positiveDifferenceTotal = 0;
    let negativeDifferenceTotal = 0;

    comparison.rows.forEach(row => {
        const difference =
            Number(
                row.rawDifference
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
    });

    return {
        positiveStatsCount:
            positiveStatsCount,

        negativeStatsCount:
            negativeStatsCount,

        netStatsCount:
            positiveStatsCount -
            negativeStatsCount,

        positiveDifferenceTotal:
            positiveDifferenceTotal,

        negativeDifferenceTotal:
            negativeDifferenceTotal,

        netDifference:
            positiveDifferenceTotal -
            negativeDifferenceTotal
    };
}

function compareEquipmentBackpackItems(
    firstEntry,
    secondEntry
) {
    const firstItem =
        items[
        firstEntry.itemId
        ];

    const secondItem =
        items[
        secondEntry.itemId
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

    const playerLevel =
        Math.max(
            1,
            Number(player.level) || 1
        );

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

    const firstIsLocked =
        firstRequiredLevel >
        playerLevel;

    const secondIsLocked =
        secondRequiredLevel >
        playerLevel;

    /*
     * Przedmioty możliwe do założenia
     * zawsze pojawiają się przed
     * przedmiotami zablokowanymi.
     */
    if (
        firstIsLocked !==
        secondIsLocked
    ) {
        return firstIsLocked
            ? 1
            : -1;
    }

    const firstRank =
        getEquipmentUpgradeRank(
            firstItem
        );

    const secondRank =
        getEquipmentUpgradeRank(
            secondItem
        );

    /*
     * Najpierw przedmioty, które
     * poprawiają więcej statystyk,
     * niż pogarszają.
     */
    if (
        firstRank.netStatsCount !==
        secondRank.netStatsCount
    ) {
        return (
            secondRank.netStatsCount -
            firstRank.netStatsCount
        );
    }

    /*
     * Następnie większa liczba
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
     * Przy podobnej liczbie ulepszeń
     * preferujemy mniej czerwonych
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
     * Kolejnym kryterium jest
     * łączna różnica wartości.
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
     * Przy remisie wyżej pojawia się
     * przedmiot o większym wymaganym
     * poziomie.
     */
    if (
        firstRequiredLevel !==
        secondRequiredLevel
    ) {
        return (
            secondRequiredLevel -
            firstRequiredLevel
        );
    }

    /*
     * Ostateczny remis rozstrzygamy
     * nazwą przedmiotu.
     */
    return (
        firstItem.name || ""
    ).localeCompare(
        secondItem.name || "",
        "pl"
    );
}
