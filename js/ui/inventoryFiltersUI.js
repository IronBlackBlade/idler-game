const allowedInventoryFilters = [
    "all",
    "crafting_material",
    "processed_material",
    "vendor_trash",
    "mining",
    "herbalism",
    "potion",
    "weapon",
    "armor",
    "jewelry",
    "recipe"
];

const savedInventoryFilter =
    localStorage.getItem(
        "idler_inventory_filter"
    );

let currentInventoryFilter =
    allowedInventoryFilters.includes(
        savedInventoryFilter
    )
        ? savedInventoryFilter
        : "all";

let currentInventorySubfilter = "all";

function setInventoryFilter(
    filter
) {
    if (
        !allowedInventoryFilters.includes(
            filter
        )
    ) {
        return;
    }

    currentInventoryFilter =
        filter;
    currentInventorySubfilter =
        "all";

    localStorage.setItem(
        "idler_inventory_filter",
        filter
    );

    renderInventory();
}

function setInventorySubfilter(
    subfilter
) {
    currentInventorySubfilter =
        subfilter;

    renderInventory();
}

function getInventorySubfilters(
    filter
) {
    const subfiltersByCategory = {
        weapon: [
            {
                id: "all",
                name: "📦 Wszystko"
            },
            {
                id: "melee",
                name: "⚔️ Zwarcie"
            },
            {
                id: "ranged",
                name: "🏹 Dystans"
            },
            {
                id: "magic",
                name: "🪄 Magia"
            }
        ],

        armor: [
            {
                id: "all",
                name: "📦 Wszystko"
            },
            {
                id: "shield",
                name: "🔰 Tarcze"
            },
            {
                id: "helmet",
                name: "⛑️ Hełmy"
            },
            {
                id: "armor",
                name: "🛡️ Pancerz"
            },
            {
                id: "pants",
                name: "👖 Spodnie"
            },
            {
                id: "gloves",
                name: "🧤 Rękawice"
            },
            {
                id: "boots",
                name: "🥾 Buty"
            }
        ],

        jewelry: [
            {
                id: "all",
                name: "📦 Wszystko"
            },
            {
                id: "ring",
                name: "💍 Pierścienie"
            },
            {
                id: "amulet",
                name: "📿 Amulety"
            },
            {
                id: "talisman",
                name: "🧿 Talizmany"
            }
        ],

        processed_material: [
            {
                id: "all",
                name: "📦 Wszystko"
            },
            {
                id: "ingot",
                name: "🧱 Sztabki"
            },
            {
                id: "leather_cloth",
                name: "🧵 Skóry i tkaniny"
            },
            {
                id: "other",
                name: "⚙️ Pozostałe"
            }
        ]
    };

    return (
        subfiltersByCategory[
        filter
        ] || []
    );
}

function getInventoryItemSubcategory(
    item,
    itemId
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

    const armorTypes = [
        "shield",
        "helmet",
        "armor",
        "pants",
        "gloves",
        "boots"
    ];

    if (
        armorTypes.includes(
            item.type
        )
    ) {
        return item.type;
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
        return item.type;
    }

    if (
        item.type ===
        "processed_material"
    ) {
        if (
            itemId.endsWith(
                "_ingot"
            )
        ) {
            return "ingot";
        }

        if (
            itemId.includes(
                "leather"
            ) ||
            itemId.includes(
                "cloth"
            )
        ) {
            return "leather_cloth";
        }

        return "other";
    }

    return "other";
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

    if (item.type === "potion") {
        return "potion";
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
        "processed_material"
    ) {
        return "processed_material";
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