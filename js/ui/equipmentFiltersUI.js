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