function renderEquipmentSlots() {
    const slots = {
        weapon: "slot-weapon",
        shield: "slot-shield",
        helmet: "slot-helmet",
        armor: "slot-armor",
        pants: "slot-pants",
        boots: "slot-boots",
        gloves: "slot-gloves",
        ring1: "slot-ring1",
        ring2: "slot-ring2",
        amulet: "slot-amulet",
        talisman: "slot-talisman"
    };

    Object.keys(slots).forEach(slot => {
        const element = document.getElementById(slots[slot]);

        if (!element) return;


        const slotBox = element.closest(".equipment-slot");

        if (slotBox) {
            slotBox.dataset
                .equipmentSlot =
                slot;

            slotBox.classList.toggle(
                "selected-slot",
                selectedEquipmentSlot ===
                slot
            );

            slotBox.onclick = event => {
                /*
                 * Kliknięcie przycisku
                 * "Zdejmij" nie może wybierać
                 * całego slotu.
                 */
                if (
                    event.target.closest(
                        "button"
                    )
                ) {
                    return;
                }

                selectEquipmentSlot(
                    slot
                );
            };
        }

        const itemId = player.equipment[slot];

        if (!itemId) {
            if (slotBox) {
                slotBox.classList.add("empty-slot");
            }

            element.innerHTML = "Pusty";
            return;
        }

        if (slotBox) {
            slotBox.classList.remove("empty-slot");
        }

        const item = items[itemId];

        if (!item) {
            element.innerHTML = "Nieznany przedmiot";
            return;
        }

        let stats = "";

        if (item.damage) stats += `<span>Obrażenia: ${item.damage}</span>`;
        if (item.attack) stats += `<span>Atak: +${item.attack}</span>`;
        if (item.strength) stats += `<span>Siła: +${item.strength}</span>`;
        if (item.dexterity) stats += `<span>Zręczność: +${item.dexterity}</span>`;
        if (item.intelligence) stats += `<span>Inteligencja: +${item.intelligence}</span>`;
        if (item.endurance) stats += `<span>Wytrzymałość: +${item.endurance}</span>`;
        if (item.luck) stats += `<span>Szczęście: +${item.luck}</span>`;
        getWeaponCombatLabels(
            item
        ).forEach(label => {
            stats += `<span>${label}</span>`;
        });
        element.classList.remove(
            "rarity-common",
            "rarity-uncommon",
            "rarity-rare",
            "rarity-epic",
            "rarity-legendary"
        );

        if (item.rarity) {
            element.classList.add("rarity-" + item.rarity);
        }

        element.innerHTML = `
    <div class="equipment-item-content">
        <div>
            <div class="equipment-item-name">${item.name}</div>

            <div class="equipment-item-tags">
                <span>Poziom: ${item.requiredLevel || 1}</span>
                <span>${getRarityName(item.rarity)}</span>
                ${stats}
            </div>
        </div>

        <button class="equipment-unequip-btn" onclick="unequipItem('${slot}')">Zdejmij</button>
    </div>
`;
    });

    if (
        typeof renderEquipmentBackpack ===
        "function"
    ) {
        renderEquipmentBackpack();
    }
}


function getEquipmentTypeDisplay(
    item
) {
    const typeDisplays = {
        weapon: {
            icon: "⚔️",
            name: "Broń"
        },

        shield: {
            icon: "🔰",
            name: "Tarcza"
        },

        helmet: {
            icon: "⛑️",
            name: "Hełm"
        },

        armor: {
            icon: "🛡️",
            name: "Pancerz"
        },

        pants: {
            icon: "👖",
            name: "Spodnie"
        },

        boots: {
            icon: "🥾",
            name: "Buty"
        },

        gloves: {
            icon: "🧤",
            name: "Rękawice"
        },

        ring: {
            icon: "💍",
            name: "Pierścień"
        },

        amulet: {
            icon: "📿",
            name: "Amulet"
        },

        talisman: {
            icon: "🔮",
            name: "Talizman"
        }
    };

    return (
        typeDisplays[item?.type] || {
            icon: "🎒",
            name: "Przedmiot"
        }
    );
}

function renderEquipmentBackpack() {
    const container =
        document.getElementById(
            "equipment-backpack-list"
        );

    if (!container) {
        return;
    }

    const inventory =
        Array.isArray(player.inventory)
            ? player.inventory
            : [];

    const equipableInventory =
        inventory.filter(
            inventoryEntry => {
                const item =
                    items[
                    inventoryEntry.itemId
                    ];

                return (
                    inventoryEntry.quantity > 0 &&
                    isEquipableItem(item)
                );
            }
        );

    const selectedSlotDefinition =
        selectedEquipmentSlot
            ? equipmentSlotDefinitions[
            selectedEquipmentSlot
            ]
            : null;

    const descriptionElement =
        document.getElementById(
            "equipment-backpack-description"
        );

    if (descriptionElement) {
        if (selectedSlotDefinition) {
            descriptionElement.textContent =
                "Wybrany slot: " +
                selectedSlotDefinition.label +
                " — najlepsze ulepszenia są wyżej";
        } else {
            descriptionElement.textContent =
                "Przedmioty możliwe do założenia — najlepsze ulepszenia są wyżej";
        }
    }
    renderEquipmentBackpackSubfilters();
    const filteredInventory =
        equipableInventory.filter(
            inventoryEntry => {
                const item =
                    items[
                    inventoryEntry.itemId
                    ];

                if (!item) {
                    return false;
                }

                /*
                 * Wybrany konkretny slot
                 * ma pierwszeństwo przed
                 * filtrami kategorii.
                 */
                if (
                    selectedSlotDefinition
                ) {
                    return (
                        item.type ===
                        selectedSlotDefinition
                            .itemType
                    );
                }

                if (
                    currentEquipmentBackpackFilter ===
                    "all"
                ) {
                    return true;
                }

                const matchesMainCategory =
                    getEquipmentBackpackCategory(
                        item
                    ) ===
                    currentEquipmentBackpackFilter;

                if (!matchesMainCategory) {
                    return false;
                }

                if (
                    currentEquipmentBackpackSubfilter ===
                    "all"
                ) {
                    return true;
                }

                return (
                    getEquipmentBackpackSubcategory(
                        item
                    ) ===
                    currentEquipmentBackpackSubfilter
                );
            }
        );

    filteredInventory.sort(
        compareEquipmentBackpackItems
    );

    const countElement =
        document.getElementById(
            "equipment-backpack-count"
        );

    if (countElement) {
        const totalQuantity =
            equipableInventory.reduce(
                (
                    currentTotal,
                    inventoryEntry
                ) => {
                    return (
                        currentTotal +
                        (
                            Number(
                                inventoryEntry
                                    .quantity
                            ) || 0
                        )
                    );
                },
                0
            );

        countElement.textContent =
            totalQuantity;
    }

    document
        .querySelectorAll(
            ".equipment-backpack-filter"
        )
        .forEach(button => {
            const isActive =
                selectedEquipmentSlot ===
                null &&
                button.dataset
                    .equipmentFilter ===
                currentEquipmentBackpackFilter;

            button.classList.toggle(
                "active",
                isActive
            );
        });

    container.innerHTML = "";

    if (
        filteredInventory.length === 0
    ) {
        const emptyMessage =
            document.createElement(
                "div"
            );

        emptyMessage.className =
            "equipment-backpack-empty";

        if (equipableInventory.length === 0) {
            emptyMessage.textContent =
                "Nie masz przedmiotów, które można założyć.";
        } else if (selectedSlotDefinition) {
            emptyMessage.textContent =
                "Brak przedmiotów pasujących do slotu: " +
                selectedSlotDefinition.label +
                ".";
        } else {
            emptyMessage.textContent =
                "Brak przedmiotów w tej kategorii.";
        }

        container.appendChild(
            emptyMessage
        );

        return;
    }

    filteredInventory.forEach(
        inventoryEntry => {
            const item =
                items[
                inventoryEntry.itemId
                ];

            if (!item) {
                return;
            }

            const typeDisplay =
                getEquipmentTypeDisplay(
                    item
                );

            const comparison =
                getEquipmentItemComparison(
                    item
                );

            const comparisonTargetName =
                comparison.equippedItem
                    ? comparison
                        .equippedItem
                        .name
                    : "Pusty slot";

            const rarityName =
                typeof getRarityName ===
                    "function"
                    ? getRarityName(
                        item.rarity
                    )
                    : item.rarity ||
                    "Zwykły";

            const statsHtml =
                comparison.rows.length > 0
                    ? comparison.rows
                        .map(row => {
                            return `
                    <div
                        class="equipment-comparison-stat
                        ${row.differenceClass}"
                    >
                        <span
                            class="equipment-comparison-label"
                        >
                            ${row.label}
                        </span>

                        <strong
                            class="equipment-comparison-value"
                        >
                            ${row.value}
                        </strong>

                        <span
                            class="equipment-comparison-difference"
                        >
                            ${row.difference}
                        </span>
                    </div>
                `;
                        })
                        .join("")
                    : `
            <div class="equipment-comparison-empty">
                Brak statystyk do porównania
            </div>
        `;


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

            const canEquipByLevel =
                playerLevel >=
                requiredLevel;

            const equipButtonHtml =
                canEquipByLevel
                    ? `
            <button
                class="equipment-equip-button"
                onclick="equipItemFromEquipmentBackpack(
                    '${inventoryEntry.itemId}'
                )"
            >
                Załóż
            </button>
        `
                    : `
            <button
                class="equipment-equip-button
                equipment-equip-button-locked"
                disabled
            >
                Wymaga poziomu
                ${requiredLevel}
            </button>
        `;

            const itemCard =
                document.createElement(
                    "div"
                );

            itemCard.className =
                "equipment-backpack-item " +
                "rarity-" +
                (
                    item.rarity ||
                    "common"
                ) +
                (
                    canEquipByLevel
                        ? ""
                        : " level-locked"
                );

            itemCard.innerHTML = `
    <div class="equipment-backpack-item-main">
        <div class="equipment-backpack-item-icon">
            ${typeDisplay.icon}
        </div>

        <div class="equipment-backpack-item-info">
            <strong>
                ${item.name}
            </strong>

            <span>
                ${typeDisplay.name}
                • Poziom
                ${requiredLevel}
                • ${rarityName}
                • x${inventoryEntry.quantity}
            </span>
        </div>

        ${equipButtonHtml}
    </div>

    <div class="equipment-comparison-target">
        Porównanie z:

        <strong>
            ${comparisonTargetName}
        </strong>
    </div>

    <div class="equipment-backpack-item-stats">
        ${statsHtml}
    </div>
`;


            container.appendChild(
                itemCard
            );
        }
    );
}
