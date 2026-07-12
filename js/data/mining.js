const miningAreas = [
    {
        id: "upper_shaft",
        name: "Górny szyb",
        description: "Jasna i bezpieczna część kopalni. Dobre miejsce na rozpoczęcie nauki kopania.",
        requiredMiningLevel: 1,
        durationSeconds: 12,
        rareChance: 18,
        exceptionalChance: 2,
        basicDrops: [
            { itemId: "stone", weight: 45, miningExp: 3 },
            { itemId: "coal", weight: 35, miningExp: 4 },
            { itemId: "copper_ore", weight: 20, miningExp: 5 }
        ],
        rareDrops: [
            { itemId: "tin_ore", weight: 60, miningExp: 12 },
            { itemId: "quartz", weight: 40, miningExp: 15 }
        ],
        exceptionalDrops: [
            { itemId: "mine_amber", weight: 100, miningExp: 50 }
        ]
    },
    {
        id: "middle_mine",
        name: "Środek kopalni",
        description: "Głębsze korytarze z lepszymi rudami i pierwszymi cennymi kryształami.",
        requiredMiningLevel: 5,
        durationSeconds: 15,
        rareChance: 16,
        exceptionalChance: 1.8,
        basicDrops: [
            { itemId: "stone", weight: 30, miningExp: 4 },
            { itemId: "coal", weight: 35, miningExp: 5 },
            { itemId: "iron_ore", weight: 35, miningExp: 7 }
        ],
        rareDrops: [
            { itemId: "silver_ore", weight: 60, miningExp: 18 },
            { itemId: "amethyst", weight: 40, miningExp: 22 }
        ],
        exceptionalDrops: [
            { itemId: "pure_crystal", weight: 100, miningExp: 65 }
        ]
    },
    {
        id: "left_shaft",
        name: "Lewy szyb",
        description: "Stare wyrobisko pełne srebra, złota i pozostałości pradawnych stworzeń.",
        requiredMiningLevel: 10,
        durationSeconds: 18,
        rareChance: 14,
        exceptionalChance: 1.5,
        basicDrops: [
            { itemId: "coal", weight: 30, miningExp: 6 },
            { itemId: "iron_ore", weight: 40, miningExp: 8 },
            { itemId: "silver_ore", weight: 30, miningExp: 10 }
        ],
        rareDrops: [
            { itemId: "gold_ore", weight: 60, miningExp: 25 },
            { itemId: "sapphire", weight: 40, miningExp: 30 }
        ],
        exceptionalDrops: [
            { itemId: "ancient_fossil", weight: 100, miningExp: 80 }
        ]
    },
    {
        id: "right_shaft",
        name: "Prawy szyb",
        description: "Niebezpieczne, gorące tunele z obsydianem i rudą platyny.",
        requiredMiningLevel: 15,
        durationSeconds: 21,
        rareChance: 12,
        exceptionalChance: 1.2,
        basicDrops: [
            { itemId: "silver_ore", weight: 35, miningExp: 10 },
            { itemId: "gold_ore", weight: 35, miningExp: 13 },
            { itemId: "obsidian", weight: 30, miningExp: 15 }
        ],
        rareDrops: [
            { itemId: "ruby", weight: 55, miningExp: 35 },
            { itemId: "platinum_ore", weight: 45, miningExp: 40 }
        ],
        exceptionalDrops: [
            { itemId: "burning_crystal", weight: 100, miningExp: 100 }
        ]
    },
    {
        id: "deep_tunnels",
        name: "Głębokie tunele",
        description: "Najgłębsza część kopalni. Kryje najcenniejsze minerały i odłamki mocy ziemi.",
        requiredMiningLevel: 20,
        durationSeconds: 27,
        rareChance: 10,
        exceptionalChance: 1,
        basicDrops: [
            { itemId: "obsidian", weight: 35, miningExp: 16 },
            { itemId: "platinum_ore", weight: 35, miningExp: 18 },
            { itemId: "deep_coal", weight: 30, miningExp: 20 }
        ],
        rareDrops: [
            { itemId: "mithril_ore", weight: 55, miningExp: 50 },
            { itemId: "diamond", weight: 45, miningExp: 60 }
        ],
        exceptionalDrops: [
            { itemId: "earth_core_shard", weight: 100, miningExp: 150 }
        ]
    }
];

function getMiningArea(areaId) {
    return miningAreas.find(area => area.id === areaId) || null;
}
