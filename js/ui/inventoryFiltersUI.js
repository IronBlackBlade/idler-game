const allowedInventoryFilters = [
    "all",
    "monster_material",
    "crafting_material",
    "processed_material",
    "mining",
    "herbalism",
    "fishing",
    "potion",
    "food",
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

function isFishingInventoryItem(itemId) {
    if (
        typeof fishingAreas === "undefined" ||
        !Array.isArray(fishingAreas)
    ) {
        return false;
    }

    return fishingAreas.some(area => {
        const allDrops = [
            ...(area.basicDrops || []),
            ...(area.rareDrops || []),
            ...(area.treasureDrops || [])
        ];

        return allDrops.some(drop => {
            return drop.itemId === itemId;
        });
    });
}

function isMonsterLootInventoryItem(
    item,
    itemId
) {
    if (!item || !itemId) {
        return false;
    }

    const allowedLootTypes = [
        "crafting_material",
        "material",
        "vendor_trash"
    ];

    if (
        item.type &&
        !allowedLootTypes.includes(
            item.type
        )
    ) {
        return false;
    }

    if (
        typeof locations === "undefined" ||
        !locations
    ) {
        return false;
    }

    return Object.values(
        locations
    ).some(location => {
        const enemies = [
            ...(
                Array.isArray(
                    location.enemies
                )
                    ? location.enemies
                    : []
            ),
            ...(
                location.boss
                    ? [location.boss]
                    : []
            )
        ];

        return enemies.some(enemy => {
            const loot =
                Array.isArray(enemy.loot)
                    ? enemy.loot
                    : [];

            return loot.some(drop => {
                const dropItemId =
                    drop.itemId ||
                    drop.item;

                return (
                    dropItemId === itemId
                );
            });
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

    if (item.type === "food") {
        return "food";
    }

    if (
        item.type === "fishing_bait"
    ) {
        return "fishing";
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
        isFishingInventoryItem(itemId)
    ) {
        return "fishing";
    }

    if (
        isMonsterLootInventoryItem(
            item,
            itemId
        )
    ) {
        return "monster_material";
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
