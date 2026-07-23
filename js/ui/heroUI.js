let currentHeroTab = "summary";

let heroActiveBonusesIntervalId = null;

const heroActiveBonusDefinitions = {
    mining_speed: {
        icon: "⛏️",
        name: "Szybkość kopania",

        getDescription(value) {
            return (
                "+" +
                value +
                "% szybkości kopania"
            );
        }
    },

    herbalism_speed: {
        icon: "🌿",
        name: "Szybkość zielarstwa",

        getDescription(value) {
            return (
                "+" +
                value +
                "% szybkości zbierania ziół"
            );
        }
    },

    hunter_luck: {
        icon: "🎯",
        name: "Szczęście łowcy",

        getDescription(value) {
            return (
                "+" +
                value +
                "% szansy na łup"
            );
        }
    },

    melee_weapon_damage: {
        icon: "⚔️",
        name: "Broń w zwarciu",

        getDescription(value) {
            return (
                "+" +
                value +
                "% obrażeń broni w zwarciu"
            );
        }
    },

    ranged_weapon_damage: {
        icon: "🏹",
        name: "Broń dystansowa",

        getDescription(value) {
            return (
                "+" +
                value +
                "% obrażeń łuków i kusz"
            );
        }
    },

    magic_weapon_damage: {
        icon: "🪄",
        name: "Broń magiczna",

        getDescription(value) {
            return (
                "+" +
                value +
                "% obrażeń różdżek i kosturów"
            );
        }
    },

    spell_damage: {
        icon: "🔥",
        name: "Moc czarów",

        getDescription(value) {
            return (
                "+" +
                value +
                "% obrażeń czarów ofensywnych"
            );
        }
    },

    combat_defense: {
        icon: "🛡️",
        name: "Ochrona",

        getDescription(value) {
            return (
                "-" +
                value +
                "% otrzymywanych obrażeń"
            );
        }
    },

    mana_regeneration: {
        icon: "🔵",
        name: "Regeneracja many",

        getDescription(value) {
            let description =
                "+" +
                value +
                "% regeneracji many";

            if (
                typeof getManaRegenerationPerSecond ===
                "function"
            ) {
                const regeneration =
                    getManaRegenerationPerSecond();

                description +=
                    " (" +
                    regeneration
                        .toFixed(1)
                        .replace(".", ",") +
                    " many/s)";
            }

            return description;
        }
    }
};

function formatHeroBonusRemainingTime(
    expiresAt
) {
    const remainingSeconds =
        Math.max(
            0,
            Math.ceil(
                (
                    Number(expiresAt) -
                    Date.now()
                ) / 1000
            )
        );

    const minutes =
        Math.floor(
            remainingSeconds / 60
        );

    const seconds =
        remainingSeconds % 60;

    return (
        minutes +
        ":" +
        String(seconds).padStart(
            2,
            "0"
        )
    );
}

function getActiveHeroBonuses() {
    const activeBonuses = [];
    const currentTime = Date.now();

    const potionEffects =
        player.activeEffects
            ?.potionEffects;

    if (
        potionEffects &&
        typeof potionEffects === "object"
    ) {
        Object.entries(
            potionEffects
        ).forEach(
            ([effectId, effect]) => {
                if (!effect) {
                    return;
                }

                const expiresAt =
                    Number(
                        effect.expiresAt
                    ) || 0;

                if (
                    expiresAt <= currentTime
                ) {
                    return;
                }

                const definition =
                    heroActiveBonusDefinitions[
                    effectId
                    ];

                if (!definition) {
                    return;
                }

                const value =
                    Math.max(
                        0,
                        Number(
                            effect.value
                        ) || 0
                    );

                activeBonuses.push({
                    id: effectId,
                    icon:
                        definition.icon,
                    name:
                        definition.name,
                    description:
                        definition
                            .getDescription(
                                value
                            ),
                    expiresAt:
                        expiresAt
                });
            }
        );
    }

    const barrierExpiresAt =
        Number(
            player.activeEffects
                ?.arcaneBarrierUntil
        ) || 0;

    if (
        barrierExpiresAt >
        currentTime
    ) {
        const barrierReduction =
            typeof getArcaneBarrierDamageReduction ===
                "function"
                ? getArcaneBarrierDamageReduction()
                : 0;

        activeBonuses.push({
            id: "arcane_barrier",
            icon: "🔮",
            name: "Magiczna bariera",

            description:
                "-" +
                barrierReduction +
                "% otrzymywanych obrażeń",

            expiresAt:
                barrierExpiresAt
        });
    }

    return activeBonuses;
}

function renderActiveHeroBonuses() {
    const container =
        document.getElementById(
            "hero-active-bonuses-list"
        );

    if (!container) {
        return;
    }

    if (
        typeof player === "undefined"
    ) {
        return;
    }

    const activeBonuses =
        getActiveHeroBonuses();

    container.innerHTML = "";

    if (
        activeBonuses.length === 0
    ) {
        const emptyMessage =
            document.createElement(
                "div"
            );

        emptyMessage.className =
            "hero-active-bonuses-empty";

        emptyMessage.textContent =
            "Brak aktywnych premii.";

        container.appendChild(
            emptyMessage
        );

        return;
    }

    activeBonuses.forEach(
        bonus => {
            const bonusCard =
                document.createElement(
                    "div"
                );

            bonusCard.className =
                "hero-active-bonus";

            bonusCard.innerHTML = `
                <div class="hero-active-bonus-icon">
                    ${bonus.icon}
                </div>

                <div class="hero-active-bonus-info">
                    <strong>
                        ${bonus.name}
                    </strong>

                    <span>
                        ${bonus.description}
                    </span>
                </div>

                <div class="hero-active-bonus-time">
                    ${formatHeroBonusRemainingTime(
                bonus.expiresAt
            )}
                </div>
            `;

            container.appendChild(
                bonusCard
            );
        }
    );
}

function formatNumber(value) {
    return Number(value).toFixed(1);
}

function renderHero() {
    const stats = getTotalStats();
    const derived = getDerivedStats();

    const heroLevel = document.getElementById("hero-level");
    const heroAttributePoints = document.getElementById("hero-attribute-points");

    const heroHp = document.getElementById("hero-hp");
    const heroMana = document.getElementById("hero-mana");
    const heroExp = document.getElementById("hero-exp");
    const heroGold = document.getElementById("hero-gold");

    const heroStrength = document.getElementById("hero-strength");
    const heroDexterity = document.getElementById("hero-dexterity");
    const heroIntelligence = document.getElementById("hero-intelligence");
    const heroEndurance = document.getElementById("hero-endurance");
    const heroLuck = document.getElementById("hero-luck");

    const heroGeneralDamage = document.getElementById("hero-general-damage");
    const heroMeleeDamage = document.getElementById("hero-melee-damage");
    const heroRangedDamage = document.getElementById("hero-ranged-damage");
    const heroMagicDamage = document.getElementById("hero-magic-damage");

    const heroDefense = document.getElementById("hero-defense");
    const heroDodgeChance = document.getElementById("hero-dodge-chance");
    const heroCritChance = document.getElementById("hero-crit-chance");
    const heroCritDamage = document.getElementById("hero-crit-damage");
    const heroLootBonus = document.getElementById("hero-loot-bonus");
    const pendingPointsElement =
        document.getElementById(
            "hero-pending-attribute-points"
        );

    if (pendingPointsElement) {
        pendingPointsElement.textContent =
            getAvailablePendingAttributePoints();
    }

    if (heroLevel) heroLevel.textContent = player.level;

    if (heroAttributePoints) {
        heroAttributePoints.textContent = player.attributePoints || 0;
    }

    if (heroHp) heroHp.textContent = player.hp + "/" + derived.maxHp;
    if (heroMana) heroMana.textContent = player.mana + "/" + derived.maxMana;

    if (heroExp) heroExp.textContent = player.exp + "/" + player.expToNextLevel;
    if (heroGold) heroGold.textContent = player.gold;

    if (heroStrength) {
        heroStrength.textContent =
            formatPreviewAttribute(
                "strength"
            );
    }

    if (heroDexterity) {
        heroDexterity.textContent =
            formatPreviewAttribute(
                "dexterity"
            );
    }

    if (heroIntelligence) {
        heroIntelligence.textContent =
            formatPreviewAttribute(
                "intelligence"
            );
    }

    if (heroEndurance) {
        heroEndurance.textContent =
            formatPreviewAttribute(
                "endurance"
            );
    }

    if (heroLuck) {
        heroLuck.textContent =
            formatPreviewAttribute(
                "luck"
            );
    }

    if (heroGeneralDamage) {
        heroGeneralDamage.textContent = "+" + derived.generalDamage.toFixed(1);
    }

    if (heroMeleeDamage) heroMeleeDamage.textContent = Math.floor(derived.meleeDamage);
    if (heroRangedDamage) heroRangedDamage.textContent = Math.floor(derived.rangedDamage);
    if (heroMagicDamage) heroMagicDamage.textContent = Math.floor(derived.magicDamage);

    if (heroDefense) heroDefense.textContent = derived.defense.toFixed(1);

    if (heroDodgeChance) {
        heroDodgeChance.textContent = derived.dodgeChance.toFixed(1) + "%";
    }

    if (heroCritChance) {
        heroCritChance.textContent = derived.critChance.toFixed(1) + "%";
    }

    if (heroCritDamage) {
        heroCritDamage.textContent = derived.critDamage + "%";
    }

    if (heroLootBonus) {
        heroLootBonus.textContent = "+" + derived.lootBonus + "%";
    }

    if (
        typeof renderActiveHeroBonuses ===
        "function"
    ) {
        renderActiveHeroBonuses();
    }


}

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

let currentEquipmentBackpackFilter =
    "all";

let currentEquipmentBackpackSubfilter =
    "all";

let selectedEquipmentSlot = null;

const equipmentBackpackSubfilterDefinitions = {
    weapon: [
        {
            id: "all",
            label: "Wszystkie"
        },
        {
            id: "melee",
            label: "⚔️ Zwarcie"
        },
        {
            id: "ranged",
            label: "🏹 Dystans"
        },
        {
            id: "magic",
            label: "🪄 Magia"
        }
    ],

    armor: [
        {
            id: "all",
            label: "Wszystkie"
        },
        {
            id: "shield",
            label: "🔰 Tarcze"
        },
        {
            id: "helmet",
            label: "⛑️ Hełmy"
        },
        {
            id: "armor",
            label: "🛡️ Pancerze"
        },
        {
            id: "gloves",
            label: "🧤 Rękawice"
        },
        {
            id: "pants",
            label: "👖 Spodnie"
        },
        {
            id: "boots",
            label: "🥾 Buty"
        }
    ],

    jewelry: [
        {
            id: "all",
            label: "Wszystkie"
        },
        {
            id: "ring",
            label: "💍 Pierścienie"
        },
        {
            id: "amulet",
            label: "📿 Amulety"
        },
        {
            id: "talisman",
            label: "🔮 Talizmany"
        }
    ]
};

const equipmentSlotDefinitions = {
    weapon: {
        itemType: "weapon",
        label: "Broń"
    },

    shield: {
        itemType: "shield",
        label: "Tarcza"
    },

    helmet: {
        itemType: "helmet",
        label: "Hełm"
    },

    armor: {
        itemType: "armor",
        label: "Pancerz"
    },

    pants: {
        itemType: "pants",
        label: "Spodnie"
    },

    boots: {
        itemType: "boots",
        label: "Buty"
    },

    gloves: {
        itemType: "gloves",
        label: "Rękawice"
    },

    ring1: {
        itemType: "ring",
        label: "Pierścień 1"
    },

    ring2: {
        itemType: "ring",
        label: "Pierścień 2"
    },

    amulet: {
        itemType: "amulet",
        label: "Amulet"
    },

    talisman: {
        itemType: "talisman",
        label: "Talizman"
    }
};

function selectEquipmentSlot(
    slot
) {
    const slotDefinition =
        equipmentSlotDefinitions[
        slot
        ];

    if (!slotDefinition) {
        return;
    }

    if (
        selectedEquipmentSlot ===
        slot
    ) {
        selectedEquipmentSlot = null;
    } else {
        selectedEquipmentSlot = slot;
    }

    currentEquipmentBackpackFilter =
        "all";

    currentEquipmentBackpackSubfilter =
        "all";

    renderEquipmentSlots();
}

function equipItemFromEquipmentBackpack(
    itemId
) {
    if (
        typeof equipItem !==
        "function"
    ) {
        return;
    }

    equipItem(
        itemId,
        selectedEquipmentSlot
    );
}

const equipableItemTypes = [
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

function isEquipableItem(item) {
    return Boolean(
        item &&
        equipableItemTypes.includes(
            item.type
        )
    );
}

function getEquipmentBackpackCategory(
    item
) {
    if (!item) {
        return "other";
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

    if (
        armorTypes.includes(
            item.type
        )
    ) {
        return "armor";
    }

    const jewelryTypes = [
        "ring",
        "amulet",
        "talisman"
    ];

    if (
        jewelryTypes.includes(
            item.type
        )
    ) {
        return "jewelry";
    }

    return "other";
}

function getEquipmentBackpackSubcategory(
    item
) {
    if (!item) {
        return "other";
    }

    if (item.type === "weapon") {
        return (
            item.weaponType ||
            "other"
        );
    }

    return item.type || "other";
}

function setEquipmentBackpackFilter(
    filter
) {
    const allowedFilters = [
        "all",
        "weapon",
        "armor",
        "jewelry"
    ];

    if (
        !allowedFilters.includes(
            filter
        )
    ) {
        return;
    }

    selectedEquipmentSlot = null;

    currentEquipmentBackpackFilter =
        filter;

    currentEquipmentBackpackSubfilter =
        "all";

    renderEquipmentBackpack();
}

function setEquipmentBackpackSubfilter(
    subfilter
) {
    const definitions =
        equipmentBackpackSubfilterDefinitions[
        currentEquipmentBackpackFilter
        ] || [];

    const isAllowed =
        definitions.some(definition => {
            return (
                definition.id ===
                subfilter
            );
        });

    if (!isAllowed) {
        return;
    }

    selectedEquipmentSlot = null;

    currentEquipmentBackpackSubfilter =
        subfilter;

    renderEquipmentBackpack();
}

function renderEquipmentBackpackSubfilters() {
    const container =
        document.getElementById(
            "equipment-backpack-subfilters"
        );

    if (!container) {
        return;
    }

    const definitions =
        selectedEquipmentSlot === null
            ? (
                equipmentBackpackSubfilterDefinitions[
                currentEquipmentBackpackFilter
                ] || []
            )
            : [];

    container.innerHTML = "";

    if (definitions.length === 0) {
        container.hidden = true;
        return;
    }

    container.hidden = false;

    definitions.forEach(definition => {
        const button =
            document.createElement(
                "button"
            );

        button.type = "button";

        button.className =
            "equipment-backpack-subfilter";

        button.textContent =
            definition.label;

        button.classList.toggle(
            "active",
            definition.id ===
            currentEquipmentBackpackSubfilter
        );

        button.addEventListener(
            "click",
            () => {
                setEquipmentBackpackSubfilter(
                    definition.id
                );
            }
        );

        container.appendChild(button);
    });
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
    item
) {
    if (!item) {
        return null;
    }

    /*
     * Jeżeli gracz kliknął konkretny
     * slot, porównujemy właśnie z nim.
     */
    if (selectedEquipmentSlot) {
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
    item
) {
    const comparisonSlot =
        getComparisonEquipmentSlot(
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

function formatPreviewAttribute(
    statName
) {
    const baseValue =
        player.stats[statName] || 0;

    const pendingValue =
        pendingAttributeChanges[
        statName
        ] || 0;

    if (pendingValue <= 0) {
        return String(baseValue);
    }

    return (
        baseValue +
        " +" +
        pendingValue
    );
}



function isHeroTabVisible(
    tabName
) {
    const heroScreen =
        document.getElementById(
            "screen-hero"
        );

    const heroPanel =
        document.querySelector(
            '[data-hero-panel="' +
            tabName +
            '"]'
        );

    if (
        !heroScreen ||
        !heroPanel
    ) {
        return false;
    }

    const isScreenVisible =
        window.getComputedStyle(
            heroScreen
        ).display !== "none";

    const isPanelActive =
        heroPanel.classList.contains(
            "active"
        );

    return (
        isScreenVisible &&
        isPanelActive
    );
}

function refreshHeroInventoryView() {
    if (
        !isHeroTabVisible(
            "inventory"
        )
    ) {
        return;
    }

    if (
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
    }
}

function refreshHeroEquipmentView() {
    if (
        !isHeroTabVisible(
            "equipment"
        )
    ) {
        return;
    }

    if (
        typeof renderEquipmentSlots ===
        "function"
    ) {
        renderEquipmentSlots();
    }
}

function refreshCurrentHeroTab() {
    if (
        currentHeroTab ===
        "inventory" &&
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
        return;
    }

    if (
        currentHeroTab ===
        "equipment" &&
        typeof renderEquipmentSlots ===
        "function"
    ) {
        renderEquipmentSlots();
        return;
    }

    if (
        currentHeroTab ===
        "skills" &&
        typeof renderSkills ===
        "function"
    ) {
        renderSkills();
    }
}

function showHeroTab(tabName) {
    currentHeroTab = tabName;

    const panels =
        document.querySelectorAll(
            ".hero-tab-panel"
        );

    panels.forEach(panel => {
        panel.classList.toggle(
            "active",
            panel.dataset.heroPanel ===
            tabName
        );
    });

    const buttons =
        document.querySelectorAll(
            ".hero-tab-button"
        );

    buttons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.heroTab ===
            tabName
        );
    });

    localStorage.setItem(
        "idler_hero_tab",
        tabName
    );

    if (
        tabName === "inventory" &&
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
    }

    if (
        tabName === "equipment" &&
        typeof renderEquipmentSlots ===
        "function"
    ) {
        renderEquipmentSlots();
    }

    if (
        tabName === "skills" &&
        typeof renderSkills ===
        "function"
    ) {
        renderSkills();
    }
}

function openHeroTab(
    tabName
) {
    const allowedTabs = [
        "summary",
        "attributes",
        "equipment",
        "inventory",
        "skills"
    ];

    if (
        !allowedTabs.includes(
            tabName
        )
    ) {
        console.warn(
            "Nieznana zakładka bohatera:",
            tabName
        );

        return;
    }

    if (
        typeof showScreen ===
        "function"
    ) {
        showScreen(
            "screen-hero"
        );
    }

    showHeroTab(
        tabName
    );
}

function restoreHeroTab() {
    const savedTab =
        localStorage.getItem(
            "idler_hero_tab"
        );

    const allowedTabs = [
        "summary",
        "attributes",
        "equipment",
        "inventory",
        "skills"
    ];

    const tabName =
        allowedTabs.includes(savedTab)
            ? savedTab
            : "summary";

    showHeroTab(tabName);
}

function startHeroActiveBonusesUpdates() {
    if (
        heroActiveBonusesIntervalId !==
        null
    ) {
        clearInterval(
            heroActiveBonusesIntervalId
        );
    }

    heroActiveBonusesIntervalId =
        setInterval(() => {
            renderActiveHeroBonuses();
        }, 1000);
}

startHeroActiveBonusesUpdates();

function initializeHeroTab() {
    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            () => {
                restoreHeroTab();
            },
            {
                once: true
            }
        );

        return;
    }

    restoreHeroTab();
}

initializeHeroTab();