const fishingAreas = [
    {
        id: "forest_pond",
        name: "Leśny staw",
        description:
            "Spokojne łowisko dobre dla początkujących wędkarzy.",
        requiredFishingLevel: 1,
        durationSeconds: 10,
        rareChance: 12,
        treasureChance: 1.5,
        basicDrops: [
            { itemId: "small_carp", weight: 42, fishingExp: 5, minSize: 12, maxSize: 38 },
            { itemId: "river_perch", weight: 34, fishingExp: 6, minSize: 10, maxSize: 34 },
            { itemId: "silver_roach", weight: 24, fishingExp: 8, minSize: 14, maxSize: 42 }
        ],
        rareDrops: [
            { itemId: "golden_trout", weight: 100, fishingExp: 28, minSize: 28, maxSize: 72 }
        ],
        treasureDrops: [
            { itemId: "freshwater_pearl", weight: 100, fishingExp: 70 }
        ]
    },
    {
        id: "underground_lake",
        name: "Podziemne jezioro",
        description:
            "Ciemne wody jaskini skrywają ślepe ryby i kryształowe okazy.",
        requiredFishingLevel: 10,
        durationSeconds: 14,
        rareChance: 11,
        treasureChance: 1.3,
        basicDrops: [
            { itemId: "blind_cavefish", weight: 40, fishingExp: 13, minSize: 16, maxSize: 46 },
            { itemId: "stone_eel", weight: 35, fishingExp: 15, minSize: 38, maxSize: 105 },
            { itemId: "shadow_tench", weight: 25, fishingExp: 18, minSize: 22, maxSize: 68 }
        ],
        rareDrops: [
            { itemId: "crystal_fish", weight: 100, fishingExp: 52, minSize: 24, maxSize: 64 }
        ],
        treasureDrops: [
            { itemId: "sunken_lockbox", weight: 100, fishingExp: 125 }
        ]
    },
    {
        id: "sunken_ruins",
        name: "Zatopione ruiny",
        description:
            "Pozostałości dawnego miasta przyciągają niezwykłe morskie stworzenia.",
        requiredFishingLevel: 20,
        durationSeconds: 18,
        rareChance: 10,
        treasureChance: 1.1,
        basicDrops: [
            { itemId: "ruins_bream", weight: 40, fishingExp: 24, minSize: 28, maxSize: 76 },
            { itemId: "azure_tuna", weight: 34, fishingExp: 28, minSize: 72, maxSize: 210 },
            { itemId: "ancient_eel", weight: 26, fishingExp: 33, minSize: 65, maxSize: 185 }
        ],
        rareDrops: [
            { itemId: "royal_lionfish", weight: 100, fishingExp: 85, minSize: 32, maxSize: 88 }
        ],
        treasureDrops: [
            { itemId: "coral_relic", weight: 100, fishingExp: 200 }
        ]
    },
    {
        id: "ice_hole",
        name: "Lodowy przerębel",
        description:
            "Zamarznięte jezioro, w którym przetrwały tylko najtwardsze gatunki.",
        requiredFishingLevel: 35,
        durationSeconds: 23,
        rareChance: 9,
        treasureChance: 0.9,
        basicDrops: [
            { itemId: "frost_cod", weight: 40, fishingExp: 42, minSize: 45, maxSize: 125 },
            { itemId: "ice_pike", weight: 34, fishingExp: 48, minSize: 58, maxSize: 165 },
            { itemId: "snow_salmon", weight: 26, fishingExp: 56, minSize: 50, maxSize: 142 }
        ],
        rareDrops: [
            { itemId: "crystal_sturgeon", weight: 100, fishingExp: 135, minSize: 110, maxSize: 320 }
        ],
        treasureDrops: [
            { itemId: "frostbound_chest", weight: 100, fishingExp: 320 }
        ]
    },
    {
        id: "volcanic_spring",
        name: "Wulkaniczne źródło",
        description:
            "Wrzące źródło pełne ryb zahartowanych przez ogień i magmę.",
        requiredFishingLevel: 50,
        durationSeconds: 28,
        rareChance: 8,
        treasureChance: 0.7,
        basicDrops: [
            { itemId: "emberfish", weight: 40, fishingExp: 65, minSize: 30, maxSize: 82 },
            { itemId: "lava_eel", weight: 34, fishingExp: 74, minSize: 85, maxSize: 245 },
            { itemId: "magma_ray", weight: 26, fishingExp: 86, minSize: 95, maxSize: 270 }
        ],
        rareDrops: [
            { itemId: "phoenix_koi", weight: 100, fishingExp: 210, minSize: 40, maxSize: 108 }
        ],
        treasureDrops: [
            { itemId: "volcanic_cache", weight: 100, fishingExp: 500 }
        ]
    }
];

const fishingBaits = [
    {
        itemId: "worm_bait",
        icon: "🪱",
        effectDescription:
            "+5% szansy na rzadką rybę",
        rareChanceBonus: 5,
        treasureChanceBonus: 0,
        sizeBonus: 0
    },
    {
        itemId: "royal_grub",
        icon: "🐛",
        effectDescription:
            "+20% do rozmiaru złowionych ryb",
        rareChanceBonus: 0,
        treasureChanceBonus: 0,
        sizeBonus: 20
    },
    {
        itemId: "magnetic_lure",
        icon: "🧲",
        effectDescription:
            "+2% szansy na wyłowienie skarbu",
        rareChanceBonus: 0,
        treasureChanceBonus: 2,
        sizeBonus: 0
    }
];

const fishingOrders = [
    {
        id: "forest_inn",
        name: "Dostawa do leśnej gospody",
        description:
            "Karczmarz potrzebuje świeżych ryb na dzisiejszą kolację.",
        icon: "🍲",
        requiredFishingLevel: 1,
        requirements: [
            { itemId: "small_carp", quantity: 6 },
            { itemId: "river_perch", quantity: 4 }
        ],
        goldReward: 90,
        fishingExpReward: 35
    },
    {
        id: "cave_research",
        name: "Próbki dla badacza jaskiń",
        description:
            "Badacz chce porównać gatunki żyjące bez dostępu do światła.",
        icon: "🔬",
        requiredFishingLevel: 10,
        requirements: [
            { itemId: "blind_cavefish", quantity: 5 },
            { itemId: "stone_eel", quantity: 3 },
            { itemId: "shadow_tench", quantity: 2 }
        ],
        goldReward: 340,
        fishingExpReward: 75
    },
    {
        id: "ruins_banquet",
        name: "Uczta odkrywców ruin",
        description:
            "Ekspedycja zamawia solidny zapas ryb przed kolejną wyprawą.",
        icon: "🏺",
        requiredFishingLevel: 20,
        requirements: [
            { itemId: "ruins_bream", quantity: 4 },
            { itemId: "azure_tuna", quantity: 3 },
            { itemId: "ancient_eel", quantity: 2 }
        ],
        goldReward: 700,
        fishingExpReward: 140
    },
    {
        id: "ice_outpost",
        name: "Zapasy dla lodowej strażnicy",
        description:
            "Strażnicy potrzebują pożywienia odpornego na długie mrozy.",
        icon: "🏔️",
        requiredFishingLevel: 35,
        requirements: [
            { itemId: "frost_cod", quantity: 4 },
            { itemId: "ice_pike", quantity: 3 },
            { itemId: "snow_salmon", quantity: 2 }
        ],
        goldReward: 1250,
        fishingExpReward: 260
    },
    {
        id: "volcanic_feast",
        name: "Wulkaniczna uczta",
        description:
            "Mistrz kuchni płaci fortunę za ryby zahartowane w magmie.",
        icon: "🌋",
        requiredFishingLevel: 50,
        requirements: [
            { itemId: "emberfish", quantity: 4 },
            { itemId: "lava_eel", quantity: 3 },
            { itemId: "magma_ray", quantity: 2 }
        ],
        goldReward: 2300,
        fishingExpReward: 400
    }
];

function getFishingArea(areaId) {
    return (
        fishingAreas.find(area => {
            return area.id === areaId;
        }) || null
    );
}

function getFishingBait(itemId) {
    return (
        fishingBaits.find(bait => {
            return bait.itemId === itemId;
        }) || null
    );
}

function getFishingOrder(orderId) {
    return (
        fishingOrders.find(order => {
            return order.id === orderId;
        }) || null
    );
}
