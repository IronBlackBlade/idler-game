const recipes = [

    // ========================================
    // PRZETWARZANIE MATERIAŁÓW
    // ========================================

    {
        id: "copper_ingot_recipe",
        name: "Sztabka miedzi",

        category: "metallurgy",

        resultItemId: "copper_ingot",
        requiredCraftingLevel: 1,
        craftingExp: 10,
        craftingTimeSeconds: 10,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 2,

        materials: [
            {
                itemId: "copper_ore",
                quantity: 3
            },
            {
                itemId: "coal",
                quantity: 1
            }
        ]
    },

    {
        id: "tin_ingot_recipe",
        name: "Sztabka cyny",

        category: "metallurgy",

        resultItemId: "tin_ingot",
        requiredCraftingLevel: 1,
        craftingExp: 10,
        craftingTimeSeconds: 10,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 3,

        materials: [
            {
                itemId: "tin_ore",
                quantity: 3
            },
            {
                itemId: "coal",
                quantity: 1
            }
        ]
    },

    {
        id: "bronze_ingot_recipe",
        name: "Sztabka brązu",

        category: "metallurgy",

        resultItemId:
            "bronze_ingot",
        requiredCraftingLevel: 2,
        craftingExp: 18,
        craftingTimeSeconds: 10,
        resultQuantity: 2,

        requiresScroll: false,
        unlockCost: 0,
        goldCost: 3,

        materials: [
            {
                itemId:
                    "copper_ingot",
                quantity: 2
            },
            {
                itemId:
                    "tin_ingot",
                quantity: 1
            }
        ]
    },

    {
        id: "iron_ingot_recipe",
        name: "Sztabka żelaza",

        category: "metallurgy",

        resultItemId: "iron_ingot",
        requiredCraftingLevel: 3,
        craftingExp: 20,
        craftingTimeSeconds: 10,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 4,

        materials: [
            {
                itemId: "iron_ore",
                quantity: 3
            },
            {
                itemId: "coal",
                quantity: 1
            }
        ]
    },

    {
        id: "silver_ingot_recipe",
        name: "Sztabka srebra",

        category: "metallurgy",

        resultItemId: "silver_ingot",

        requiredCraftingLevel: 5,
        craftingExp: 30,
        craftingTimeSeconds: 12,

        requiresScroll: false,
        unlockCost: 0,
        goldCost: 6,

        materials: [
            {
                itemId: "silver_ore",
                quantity: 3,
            },
            {
                itemId: "coal",
                quantity: 2,
            },
        ],
    },

    {
        id: "gold_ingot_recipe",
        name: "Sztabka złota",

        category: "metallurgy",

        resultItemId: "gold_ingot",

        requiredCraftingLevel: 10,
        craftingExp: 45,
        craftingTimeSeconds: 14,

        requiresScroll: false,
        unlockCost: 0,
        goldCost: 8,

        materials: [
            {
                itemId: "gold_ore",
                quantity: 3,
            },
            {
                itemId: "coal",
                quantity: 2,
            },
        ],
    },

    {
        id: "platinum_ingot_recipe",
        name: "Sztabka platyny",

        category: "metallurgy",

        resultItemId: "platinum_ingot",

        requiredCraftingLevel: 15,
        craftingExp: 70,
        craftingTimeSeconds: 16,

        requiresScroll: false,
        unlockCost: 0,
        goldCost: 12,

        materials: [
            {
                itemId: "platinum_ore",
                quantity: 3,
            },
            {
                itemId: "coal",
                quantity: 2,
            },
        ],
    },

    {
        id: "mithril_ingot_recipe",
        name: "Sztabka mithrilu",

        category: "metallurgy",

        resultItemId: "mithril_ingot",

        requiredCraftingLevel: 20,
        craftingExp: 100,
        craftingTimeSeconds: 20,

        requiresScroll: false,
        unlockCost: 0,
        goldCost: 18,

        materials: [
            {
                itemId: "mithril_ore",
                quantity: 3,
            },
            {
                itemId: "deep_coal",
                quantity: 2,
            },
        ],
    },

    {
        id: "adamantite_ingot_recipe",
        name: "Sztabka adamantytu",
        category: "metallurgy",
        resultItemId: "adamantite_ingot",
        requiredCraftingLevel: 35,
        craftingExp: 320,
        craftingTimeSeconds: 36,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 40,
        materials: [
            {
                itemId: "adamantite_ore",
                quantity: 3
            },
            {
                itemId: "runic_stone",
                quantity: 1
            },
            {
                itemId: "deep_coal",
                quantity: 1
            }
        ]
    },

    {
        id: "dragonsteel_ingot_recipe",
        name: "Sztabka smoczej stali",
        category: "metallurgy",
        resultItemId: "dragonsteel_ingot",
        requiredCraftingLevel: 50,
        craftingExp: 600,
        craftingTimeSeconds: 48,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 90,
        materials: [
            {
                itemId: "dragonsteel_ore",
                quantity: 3
            },
            {
                itemId: "titan_stone",
                quantity: 1
            },
            {
                itemId: "deep_coal",
                quantity: 2
            }
        ]
    },

    {
        id: "tanned_sheep_leather_recipe",
        name: "Garbowana skóra owcza",

        category: "tanner",
        subcategory: "leather",
        resultItemId:
            "tanned_sheep_leather",
        requiredCraftingLevel: 1,
        craftingExp: 10,
        craftingTimeSeconds: 10,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 2,

        materials: [
            {
                itemId: "sheep_skin",
                quantity: 2
            }
        ]
    },

    {
        id: "tanned_wolf_leather_recipe",
        name: "Garbowana wilcza skóra",

        category: "tanner",
        subcategory: "leather",
        resultItemId:
            "tanned_wolf_leather",
        requiredCraftingLevel: 1,
        craftingExp: 18,
        craftingTimeSeconds: 10,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 3,

        materials: [
            {
                itemId: "wolf_fur",
                quantity: 2
            }
        ]
    },

    {
        id: "tanned_ice_wolf_leather_recipe",
        name: "Garbowana skóra lodowego wilka",
        category: "tanner",
        subcategory: "leather",
        resultItemId:
            "tanned_ice_wolf_leather",
        requiredCraftingLevel: 35,
        craftingExp: 260,
        craftingTimeSeconds: 30,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 30,
        materials: [
            {
                itemId: "ice_wolf_fur",
                quantity: 2
            }
        ]
    },

    {
        id: "tanned_lava_hound_leather_recipe",
        name: "Garbowana skóra ogara lawy",
        category: "tanner",
        subcategory: "leather",
        resultItemId:
            "tanned_lava_hound_leather",
        requiredCraftingLevel: 50,
        craftingExp: 480,
        craftingTimeSeconds: 42,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 65,
        materials: [
            {
                itemId: "lava_hound_hide",
                quantity: 2
            }
        ]
    },

    {
        id: "wool_cloth_recipe",
        name: "Tkanina wełniana",

        category: "tanner",
        subcategory: "fabric",
        resultItemId: "wool_cloth",
        requiredCraftingLevel: 1,
        craftingExp: 10,
        craftingTimeSeconds: 10,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 2,

        materials: [
            {
                itemId: "wool",
                quantity: 3
            }
        ]
    },

    {
        id: "chitin_plate_recipe",
        name: "Płyta chitynowa",

        category: "armorer",

        resultItemId: "chitin_plate",
        requiredCraftingLevel: 1,
        craftingExp: 10,
        craftingTimeSeconds: 10,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 2,

        materials: [
            {
                itemId: "beetle_shell",
                quantity: 3
            }
        ]
    },

    {
        id: "whetstone_recipe",
        name: "Kamień szlifierski",

        category: "blacksmith",

        resultItemId: "whetstone",
        requiredCraftingLevel: 1,
        craftingExp: 5,
        craftingTimeSeconds: 5,

        requiresScroll: false,
        unlockCost: 0,
        goldCost: 1,

        materials: [
            {
                itemId: "stone",
                quantity: 5
            }
        ]
    },


    {
        id: "forest_blade_recipe",
        name: "Leśne ostrze",
        resultItemId: "forest_blade",
        requiredCraftingLevel: 1,
        craftingExp: 25,
        craftingTimeSeconds: 12,
        requiresScroll: false,
        unlockCost: 80,
        goldCost: 60,
        materials: [
            {
                itemId: "old_sword",
                quantity: 1,
            },
            {
                itemId: "bronze_ingot",
                quantity: 2,
            },
            {
                itemId: "wolf_fang",
                quantity: 2,
            },
            {
                itemId: "goblin_blade_fragment",
                quantity: 1,
            },
        ],
    },

    {
        id: "cave_sword_recipe",
        name: "Zabójca Koboldów",
        resultItemId: "cave_sword",
        requiredCraftingLevel: 5,
        craftingExp: 50,
        craftingTimeSeconds: 14,
        requiresScroll: false,
        unlockCost: 250,
        goldCost: 180,
        materials: [
            {
                itemId: "iron_sword",
                quantity: 1,
            },
            {
                itemId: "iron_ingot",
                quantity: 3,
            },
            {
                itemId: "amethyst",
                quantity: 1,
            },
            {
                itemId: "rusty_chain",
                quantity: 2,
            },
            {
                itemId: "kobold_crown_fragment",
                quantity: 1,
            },
        ],
    },

    {
        id: "guardian_blade_recipe",
        name: "Ostrze strażnika",
        resultItemId: "guardian_blade",
        requiredCraftingLevel: 10,
        craftingExp: 85,
        craftingTimeSeconds: 16,
        requiresScroll: false,
        unlockCost: 600,
        goldCost: 450,
        materials: [
            {
                itemId: "steel_sword",
                quantity: 1,
            },
            {
                itemId: "silver_ingot",
                quantity: 3,
            },
            {
                itemId: "sapphire",
                quantity: 1,
            },
            {
                itemId: "stone_core",
                quantity: 3,
            },
            {
                itemId: "rusty_chain",
                quantity: 2,
            },
        ],
    },

    {
        id: "commander_sword_recipe",
        name: "Miecz dowódcy",
        resultItemId: "commander_sword",
        requiredCraftingLevel: 15,
        craftingExp: 140,
        craftingTimeSeconds: 20,
        requiresScroll: false,
        unlockCost: 1600,
        goldCost: 1200,
materials: [
    {
        itemId: "knight_sword",
        quantity: 1
    },
    {
        itemId: "platinum_ingot",
        quantity: 3
    },
    {
        itemId: "frost_giant_shard",
        quantity: 4
    },
    {
        itemId: "frozen_chain",
        quantity: 3
    },
    {
        itemId: "ice_elemental_core",
        quantity: 2
    },
    {
        itemId: "frost_crown_fragment",
        quantity: 1
    }
],
    },



    {
        id: "dragon_blade_recipe",
        name: "Smocze ostrze",
        resultItemId: "dragon_blade",
        requiredCraftingLevel: 20,
        craftingExp: 220,
        craftingTimeSeconds: 24,
        requiresScroll: false,
        unlockCost: 5000,
        goldCost: 4000,
materials: [
    {
        itemId: "master_sword",
        quantity: 1
    },
    {
        itemId: "mithril_ingot",
        quantity: 4
    },
    {
        itemId: "obsidian_shard",
        quantity: 5
    },
    {
        itemId: "magma_golem_plate",
        quantity: 3
    },
    {
        itemId: "magma_core",
        quantity: 2
    },
    {
        itemId: "volcanic_heart_fragment",
        quantity: 1
    }
],
    },

    {
        id: "shadow_blade_recipe",
        name: "Ostrze cienia",
        resultItemId: "shadow_blade",
        requiredCraftingLevel: 8,
        craftingExp: 75,
        craftingTimeSeconds: 18,
        requiresScroll: true,
        unlockCost: 500,
        goldCost: 350,
        materials: [
            {
                itemId: "iron_sword",
                quantity: 1,
            },
            {
                itemId: "silver_ingot",
                quantity: 2,
            },
            {
                itemId: "amethyst",
                quantity: 2,
            },
            {
                itemId: "dark_feather",
                quantity: 3,
            },
            {
                itemId: "spider_venom",
                quantity: 2,
            },
        ],
    },

    {
        id: "bark_shield_recipe",
        name: "Tarcza z kory",
        resultItemId: "bark_shield",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 50,
        materials: [
            { itemId: "wooden_shield", quantity: 1 },
            { itemId: "chitin_plate", quantity: 1 },
            { itemId: "tanned_sheep_leather", quantity: 1 },
            { itemId: "tanned_wolf_leather", quantity: 1 }
        ]
    },

    {
        id: "kobold_shield_recipe",
        name: "Tarcza koboldów",
        resultItemId: "kobold_shield",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 190,
        materials: [
            { itemId: "iron_shield", quantity: 1 },
            { itemId: "broken_shield", quantity: 2 },
            { itemId: "kobold_ear", quantity: 3 },
            { itemId: "cave_crystal", quantity: 1 }
        ]
    },

    {
        id: "guardian_shield_recipe",
        name: "Tarcza strażnika",
        resultItemId: "guardian_shield",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 500,
        materials: [
            { itemId: "steel_shield", quantity: 1 },
            { itemId: "stone_core", quantity: 3 },
            { itemId: "heavy_rock", quantity: 6 },
            { itemId: "rusty_chain", quantity: 3 }
        ]
    },

    {
        id: "commander_shield_recipe",
        name: "Tarcza dowódcy",
        resultItemId: "commander_shield",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 1300,
        materials: [
            { itemId: "knight_shield", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 3 },
            { itemId: "stone_core", quantity: 8 },
            { itemId: "cave_crystal", quantity: 8 }
        ]
    },

    {
        id: "dragon_shield_recipe",
        name: "Smocza tarcza",
        resultItemId: "dragon_shield",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 4200,
        materials: [
            { itemId: "master_shield", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 8 },
            { itemId: "stone_core", quantity: 20 },
            { itemId: "cave_crystal", quantity: 25 },
            { itemId: "old_coin", quantity: 10 }
        ]
    },

    {
        id: "beetle_helmet_recipe",
        name: "Hełm z pancerza chrząszcza",
        resultItemId: "beetle_helmet",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 40,
        materials: [
            { itemId: "leather_helmet", quantity: 1 },
            { itemId: "chitin_plate", quantity: 2 },
            { itemId: "small_spike", quantity: 1 },
            { itemId: "tanned_sheep_leather", quantity: 1 }
        ]
    },

    {
        id: "kobold_helmet_recipe",
        name: "Hełm kobolda",
        resultItemId: "kobold_helmet",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 160,
        materials: [
            { itemId: "iron_helmet", quantity: 1 },
            { itemId: "kobold_ear", quantity: 3 },
            { itemId: "broken_shield", quantity: 1 },
            { itemId: "cave_crystal", quantity: 1 }
        ]
    },

    {
        id: "guardian_helmet_recipe",
        name: "Hełm strażnika",
        resultItemId: "guardian_helmet",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 420,
        materials: [
            { itemId: "steel_helmet", quantity: 1 },
            { itemId: "stone_core", quantity: 2 },
            { itemId: "heavy_rock", quantity: 5 },
            { itemId: "rusty_chain", quantity: 3 }
        ]
    },

    {
        id: "commander_helmet_recipe",
        name: "Hełm dowódcy",
        resultItemId: "commander_helmet",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 1100,
        materials: [
            { itemId: "knight_helmet", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 2 },
            { itemId: "stone_core", quantity: 6 },
            { itemId: "cave_crystal", quantity: 8 }
        ]
    },

    {
        id: "dragon_helmet_recipe",
        name: "Smoczy hełm",
        resultItemId: "dragon_helmet",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 3800,
        materials: [
            { itemId: "master_helmet", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 6 },
            { itemId: "stone_core", quantity: 16 },
            { itemId: "cave_crystal", quantity: 20 },
            { itemId: "old_coin", quantity: 8 }
        ]
    },

    {
        id: "wolf_armor_recipe",
        name: "Pancerz wilka",
        resultItemId: "wolf_armor",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 90,
        materials: [
            { itemId: "leather_armor", quantity: 1 },
            { itemId: "tanned_wolf_leather", quantity: 2 },
            { itemId: "wolf_claw", quantity: 1 },
            { itemId: "tanned_sheep_leather", quantity: 1 }
        ]
    },

    {
        id: "kobold_armor_recipe",
        name: "Pancerz kobolda",
        resultItemId: "kobold_armor",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 280,
        materials: [
            { itemId: "iron_armor", quantity: 1 },
            { itemId: "kobold_ear", quantity: 4 },
            { itemId: "broken_shield", quantity: 2 },
            { itemId: "cave_crystal", quantity: 2 }
        ]
    },

    {
        id: "guardian_armor_recipe",
        name: "Pancerz strażnika",
        resultItemId: "guardian_armor",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 750,
        materials: [
            { itemId: "steel_armor", quantity: 1 },
            { itemId: "stone_core", quantity: 4 },
            { itemId: "heavy_rock", quantity: 8 },
            { itemId: "rusty_chain", quantity: 5 }
        ]
    },

    {
        id: "commander_armor_recipe",
        name: "Pancerz dowódcy",
        resultItemId: "commander_armor",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 2200,
        materials: [
            { itemId: "knight_armor", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 4 },
            { itemId: "stone_core", quantity: 10 },
            { itemId: "cave_crystal", quantity: 12 }
        ]
    },

    {
        id: "dragon_armor_recipe",
        name: "Smoczy pancerz",
        resultItemId: "dragon_armor",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 7000,
        materials: [
            { itemId: "master_armor", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 10 },
            { itemId: "stone_core", quantity: 25 },
            { itemId: "cave_crystal", quantity: 30 },
            { itemId: "old_coin", quantity: 12 }
        ]
    },

    {
        id: "tracker_pants_recipe",
        name: "Spodnie tropiciela",
        resultItemId: "tracker_pants",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 70,
        materials: [
            { itemId: "leather_pants", quantity: 1 },
            { itemId: "tanned_wolf_leather", quantity: 2 },
            { itemId: "tanned_sheep_leather", quantity: 1 },
            { itemId: "wolf_claw", quantity: 1 }
        ]
    },

    {
        id: "kobold_pants_recipe",
        name: "Nogawice kobolda",
        resultItemId: "kobold_pants",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 220,
        materials: [
            { itemId: "iron_pants", quantity: 1 },
            { itemId: "kobold_ear", quantity: 4 },
            { itemId: "rusty_chain", quantity: 2 },
            { itemId: "cave_crystal", quantity: 1 }
        ]
    },

    {
        id: "guardian_pants_recipe",
        name: "Nogawice strażnika",
        resultItemId: "guardian_pants",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 580,
        materials: [
            { itemId: "steel_pants", quantity: 1 },
            { itemId: "stone_core", quantity: 3 },
            { itemId: "heavy_rock", quantity: 6 },
            { itemId: "rusty_chain", quantity: 4 }
        ]
    },

    {
        id: "commander_pants_recipe",
        name: "Nogawice dowódcy",
        resultItemId: "commander_pants",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 1600,
        materials: [
            { itemId: "knight_pants", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 3 },
            { itemId: "stone_core", quantity: 8 },
            { itemId: "cave_crystal", quantity: 10 }
        ]
    },

    {
        id: "dragon_pants_recipe",
        name: "Smocze nogawice",
        resultItemId: "dragon_pants",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 5200,
        materials: [
            { itemId: "master_pants", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 8 },
            { itemId: "stone_core", quantity: 20 },
            { itemId: "cave_crystal", quantity: 25 },
            { itemId: "old_coin", quantity: 10 }
        ]
    },

    {
        id: "wolf_boots_recipe",
        name: "Buty wilka",
        resultItemId: "wolf_boots",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 60,
        materials: [
            { itemId: "old_boots", quantity: 1 },
            { itemId: "tanned_wolf_leather", quantity: 1 },
            { itemId: "wolf_claw", quantity: 1 },
            { itemId: "tanned_sheep_leather", quantity: 1 }
        ]
    },

    {
        id: "kobold_boots_recipe",
        name: "Buty kobolda",
        resultItemId: "kobold_boots",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 200,
        materials: [
            { itemId: "iron_boots", quantity: 1 },
            { itemId: "kobold_ear", quantity: 3 },
            { itemId: "rusty_chain", quantity: 2 },
            { itemId: "cave_crystal", quantity: 1 }
        ]
    },

    {
        id: "guardian_boots_recipe",
        name: "Buty strażnika",
        resultItemId: "guardian_boots",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 520,
        materials: [
            { itemId: "steel_boots", quantity: 1 },
            { itemId: "stone_core", quantity: 2 },
            { itemId: "heavy_rock", quantity: 5 },
            { itemId: "rusty_chain", quantity: 3 }
        ]
    },

    {
        id: "commander_boots_recipe",
        name: "Buty dowódcy",
        resultItemId: "commander_boots",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 1450,
        materials: [
            { itemId: "knight_boots", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 3 },
            { itemId: "stone_core", quantity: 7 },
            { itemId: "cave_crystal", quantity: 9 }
        ]
    },

    {
        id: "dragon_boots_recipe",
        name: "Smocze buty",
        resultItemId: "dragon_boots",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 4800,
        materials: [
            { itemId: "master_boots", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 7 },
            { itemId: "stone_core", quantity: 18 },
            { itemId: "cave_crystal", quantity: 22 },
            { itemId: "old_coin", quantity: 9 }
        ]
    },

    {
        id: "wolf_gloves_recipe",
        name: "Rękawice wilka",
        resultItemId: "wolf_gloves",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 65,
        materials: [
            { itemId: "leather_gloves", quantity: 1 },
            { itemId: "tanned_wolf_leather", quantity: 1 },
            { itemId: "wolf_claw", quantity: 2 },
            { itemId: "tanned_sheep_leather", quantity: 1 }
        ]
    },

    {
        id: "kobold_gloves_recipe",
        name: "Rękawice kobolda",
        resultItemId: "kobold_gloves",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 210,
        materials: [
            { itemId: "iron_gloves", quantity: 1 },
            { itemId: "kobold_ear", quantity: 3 },
            { itemId: "rusty_chain", quantity: 2 },
            { itemId: "cave_crystal", quantity: 1 }
        ]
    },

    {
        id: "guardian_gloves_recipe",
        name: "Rękawice strażnika",
        resultItemId: "guardian_gloves",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 550,
        materials: [
            { itemId: "steel_gloves", quantity: 1 },
            { itemId: "stone_core", quantity: 3 },
            { itemId: "heavy_rock", quantity: 5 },
            { itemId: "rusty_chain", quantity: 3 }
        ]
    },

    {
        id: "commander_gloves_recipe",
        name: "Rękawice dowódcy",
        resultItemId: "commander_gloves",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 1500,
        materials: [
            { itemId: "knight_gloves", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 3 },
            { itemId: "stone_core", quantity: 7 },
            { itemId: "cave_crystal", quantity: 9 }
        ]
    },

    {
        id: "dragon_gloves_recipe",
        name: "Smocze rękawice",
        resultItemId: "dragon_gloves",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 5000,
        materials: [
            { itemId: "master_gloves", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 7 },
            { itemId: "stone_core", quantity: 18 },
            { itemId: "cave_crystal", quantity: 22 },
            { itemId: "old_coin", quantity: 9 }
        ]
    },

    {
        id: "lucky_ring_recipe",
        name: "Pierścień szczęścia",
        resultItemId: "lucky_ring",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 90,
        materials: [
            { itemId: "simple_ring", quantity: 1 },
            { itemId: "old_coin", quantity: 2 },
            { itemId: "ram_horn", quantity: 1 },
            { itemId: "small_spike", quantity: 1 }
        ]
    },

    {
        id: "kobold_ring_recipe",
        name: "Pierścień kobolda",
        resultItemId: "kobold_ring",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 260,
        materials: [
            { itemId: "iron_ring", quantity: 1 },
            { itemId: "kobold_ear", quantity: 3 },
            { itemId: "cave_crystal", quantity: 2 },
            { itemId: "old_coin", quantity: 2 }
        ]
    },

    {
        id: "guardian_ring_recipe",
        name: "Pierścień strażnika",
        resultItemId: "guardian_ring",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 700,
        materials: [
            { itemId: "steel_ring", quantity: 1 },
            { itemId: "stone_core", quantity: 3 },
            { itemId: "cave_crystal", quantity: 5 },
            { itemId: "old_coin", quantity: 4 }
        ]
    },

    {
        id: "commander_ring_recipe",
        name: "Pierścień dowódcy",
        resultItemId: "commander_ring",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 1900,
        materials: [
            { itemId: "knight_ring", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 3 },
            { itemId: "stone_core", quantity: 8 },
            { itemId: "cave_crystal", quantity: 10 },
            { itemId: "old_coin", quantity: 8 }
        ]
    },

    {
        id: "dragon_ring_recipe",
        name: "Smoczy pierścień",
        resultItemId: "dragon_ring",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 6200,
        materials: [
            { itemId: "master_ring", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 8 },
            { itemId: "stone_core", quantity: 18 },
            { itemId: "cave_crystal", quantity: 25 },
            { itemId: "old_coin", quantity: 15 }
        ]
    },

    {
        id: "mana_amulet_recipe",
        name: "Amulet many",
        resultItemId: "mana_amulet",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 100,
        materials: [
            { itemId: "simple_amulet", quantity: 1 },
            { itemId: "cave_crystal", quantity: 1 },
            { itemId: "dark_feather", quantity: 1 },
            { itemId: "old_coin", quantity: 2 }
        ]
    },

    {
        id: "kobold_amulet_recipe",
        name: "Amulet kobolda",
        resultItemId: "kobold_amulet",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 280,
        materials: [
            { itemId: "iron_amulet", quantity: 1 },
            { itemId: "kobold_ear", quantity: 3 },
            { itemId: "cave_crystal", quantity: 2 },
            { itemId: "old_coin", quantity: 3 }
        ]
    },

    {
        id: "guardian_amulet_recipe",
        name: "Amulet strażnika",
        resultItemId: "guardian_amulet",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 760,
        materials: [
            { itemId: "steel_amulet", quantity: 1 },
            { itemId: "stone_core", quantity: 3 },
            { itemId: "cave_crystal", quantity: 5 },
            { itemId: "dark_feather", quantity: 2 }
        ]
    },

    {
        id: "commander_amulet_recipe",
        name: "Amulet dowódcy",
        resultItemId: "commander_amulet",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 2000,
        materials: [
            { itemId: "knight_amulet", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 3 },
            { itemId: "stone_core", quantity: 8 },
            { itemId: "cave_crystal", quantity: 10 },
            { itemId: "old_coin", quantity: 8 }
        ]
    },

    {
        id: "dragon_amulet_recipe",
        name: "Smoczy amulet",
        resultItemId: "dragon_amulet",
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 6500,
        materials: [
            { itemId: "master_amulet", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 8 },
            { itemId: "stone_core", quantity: 18 },
            { itemId: "cave_crystal", quantity: 25 },
            { itemId: "old_coin", quantity: 15 }
        ]
    },

    {
        id: "nature_talisman_recipe",
        name: "Talizman natury",
        resultItemId: "nature_talisman",
        requiredCraftingLevel: 1,
        craftingExp: 25,
        craftingTimeSeconds: 12,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 120,
        materials: [
            { itemId: "simple_talisman", quantity: 1 },
            { itemId: "mine_amber", quantity: 1 },
            { itemId: "quartz", quantity: 2 },
            { itemId: "beetle_wing", quantity: 3 },
            { itemId: "ram_horn", quantity: 1 },
        ]
    },

    {
        id: "kobold_talisman_recipe",
        name: "Talizman kobolda",
        resultItemId: "kobold_talisman",
        requiredCraftingLevel: 5,
        craftingExp: 50,
        craftingTimeSeconds: 14,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 320,
        materials: [
            { itemId: "iron_talisman", quantity: 1 },
            { itemId: "pure_crystal", quantity: 1 },
            { itemId: "amethyst", quantity: 1 },
            { itemId: "kobold_ear", quantity: 4 },
            { itemId: "cave_crystal", quantity: 2 },
        ]
    },

    {
        id: "guardian_talisman_recipe",
        name: "Talizman strażnika",
        resultItemId: "guardian_talisman",
        requiredCraftingLevel: 10,
        craftingExp: 85,
        craftingTimeSeconds: 16,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 850,
        materials: [
            { itemId: "steel_talisman", quantity: 1 },
            { itemId: "ancient_fossil", quantity: 1 },
            { itemId: "sapphire", quantity: 1 },
            { itemId: "stone_core", quantity: 4 },
            { itemId: "dark_feather", quantity: 2 },
        ]
    },

    {
        id: "commander_talisman_recipe",
        name: "Talizman dowódcy",
        resultItemId: "commander_talisman",
        requiredCraftingLevel: 15,
        craftingExp: 140,
        craftingTimeSeconds: 20,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 2300,
        materials: [
            { itemId: "knight_talisman", quantity: 1 },
            { itemId: "obsidian", quantity: 3 },
            { itemId: "ruby", quantity: 1 },
            { itemId: "burning_crystal", quantity: 1 },
            { itemId: "kobold_crown_fragment", quantity: 4 },
        ]
    },

    {
        id: "dragon_talisman_recipe",
        name: "Smoczy talizman",
        resultItemId: "dragon_talisman",
        requiredCraftingLevel: 20,
        craftingExp: 220,
        craftingTimeSeconds: 24,
        requiresScroll: false,
        unlockCost: 0,
        goldCost: 7200,
        materials: [
            { itemId: "master_talisman", quantity: 1 },
            { itemId: "mithril_ingot", quantity: 1 },
            { itemId: "diamond", quantity: 2 },
            { itemId: "earth_core_shard", quantity: 1 },
            { itemId: "burning_crystal", quantity: 1 },
        ]
    },

    // ======================================================
    // BROŃ DYSTANSOWA
    // ======================================================

    {
        id: "forest_bow_recipe",
        name: "Leśny łuk",
        subcategory: "bow",
        resultItemId: "forest_bow",
        requiredCraftingLevel: 1,
        craftingExp: 25,
        craftingTimeSeconds: 12,
        requiresScroll: false,
        unlockCost: 80,
        goldCost: 60,
        materials: [
            { itemId: "old_bow", quantity: 1 },
            { itemId: "tanned_sheep_leather", quantity: 2 },
            { itemId: "wool_cloth", quantity: 1 },
            { itemId: "wolf_fang", quantity: 2 },
        ],
    },

    {
        id: "kobold_crossbow_recipe",
        name: "Kusza koboldów",
        subcategory: "crossbow",
        resultItemId: "kobold_crossbow",
        requiredCraftingLevel: 5,
        craftingExp: 50,
        craftingTimeSeconds: 14,
        requiresScroll: false,
        unlockCost: 250,
        goldCost: 180,
        materials: [
            { itemId: "hunter_bow", quantity: 1 },
            { itemId: "iron_ingot", quantity: 2 },
            { itemId: "tanned_wolf_leather", quantity: 1 },
            { itemId: "rusty_chain", quantity: 2 },
            { itemId: "sharp_tooth", quantity: 4 },
        ],
    },

    {
        id: "guardian_bow_recipe",
        name: "Łuk strażnika",
        subcategory: "bow",
        resultItemId: "guardian_bow",
        requiredCraftingLevel: 10,
        craftingExp: 85,
        craftingTimeSeconds: 16,
        requiresScroll: false,
        unlockCost: 600,
        goldCost: 450,
        materials: [
            { itemId: "steel_crossbow", quantity: 1 },
            { itemId: "silver_ingot", quantity: 1 },
            { itemId: "tanned_wolf_leather", quantity: 2 },
            { itemId: "spider_silk", quantity: 3 },
            { itemId: "sapphire", quantity: 1 },
        ],
    },

    {
        id: "shadow_crossbow_recipe",
        name: "Kusza cienia",
        subcategory: "crossbow",
        resultItemId: "shadow_crossbow",
        requiredCraftingLevel: 15,
        craftingExp: 140,
        craftingTimeSeconds: 20,
        requiresScroll: false,
        unlockCost: 1600,
        goldCost: 1200,
materials: [
    {
        itemId: "ranger_bow",
        quantity: 1
    },
    {
        itemId: "platinum_ingot",
        quantity: 2
    },
    {
        itemId: "tanned_ice_wolf_leather",
        quantity: 3
    },
    {
        itemId: "frozen_chain",
        quantity: 3
    },
    {
        itemId: "frost_essence",
        quantity: 6
    },
    {
        itemId: "ice_elemental_core",
        quantity: 1
    }
],
    },

    {
        id: "dragon_bow_recipe",
        name: "Smoczy łuk",
        subcategory: "bow",
        resultItemId: "dragon_bow",
        requiredCraftingLevel: 20,
        craftingExp: 220,
        craftingTimeSeconds: 24,
        requiresScroll: false,
        unlockCost: 5000,
        goldCost: 4000,
materials: [
    {
        itemId: "master_bow",
        quantity: 1
    },
    {
        itemId: "mithril_ingot",
        quantity: 2
    },
    {
        itemId: "tanned_lava_hound_leather",
        quantity: 3
    },
    {
        itemId: "obsidian_shard",
        quantity: 4
    },
    {
        itemId: "ember_essence",
        quantity: 6
    },
    {
        itemId: "magma_core",
        quantity: 2
    },
    {
        itemId: "volcanic_heart_fragment",
        quantity: 1
    }
],
    },

    // ======================================================
    // BROŃ MAGICZNA
    // ======================================================

    {
        id: "nature_wand_recipe",
        name: "Różdżka natury",
        subcategory: "wand",
        resultItemId: "nature_wand",
        requiredCraftingLevel: 1,
        craftingExp: 25,
        craftingTimeSeconds: 12,
        requiresScroll: false,
        unlockCost: 80,
        goldCost: 60,
        materials: [
            { itemId: "wooden_wand", quantity: 1 },
            { itemId: "bronze_ingot", quantity: 1 },
            { itemId: "quartz", quantity: 2 },
            { itemId: "beetle_wing", quantity: 4 },
            { itemId: "ram_horn", quantity: 1 },
        ],
    },

    {
        id: "crystal_staff_recipe",
        name: "Kryształowy kostur",
        subcategory: "staff",
        resultItemId: "crystal_staff",
        requiredCraftingLevel: 5,
        craftingExp: 50,
        craftingTimeSeconds: 14,
        requiresScroll: false,
        unlockCost: 250,
        goldCost: 180,
        materials: [
            { itemId: "apprentice_staff", quantity: 1 },
            { itemId: "silver_ingot", quantity: 1 },
            { itemId: "amethyst", quantity: 2 },
            { itemId: "cave_crystal", quantity: 2 },
            { itemId: "bat_wing", quantity: 3 },
        ]
    },

    {
        id: "guardian_staff_recipe",
        name: "Kostur strażnika",
        subcategory: "staff",
        resultItemId: "guardian_staff",
        requiredCraftingLevel: 10,
        craftingExp: 85,
        craftingTimeSeconds: 16,
        requiresScroll: false,
        unlockCost: 600,
        goldCost: 450,
        materials: [
            { itemId: "arcane_wand", quantity: 1 },
            { itemId: "gold_ingot", quantity: 1 },
            { itemId: "pure_crystal", quantity: 1 },
            { itemId: "stone_core", quantity: 3 },
            { itemId: "spider_silk", quantity: 3 },
        ]
    },

    {
        id: "shadow_wand_recipe",
        name: "Różdżka cienia",
        subcategory: "wand",
        resultItemId: "shadow_wand",
        requiredCraftingLevel: 15,
        craftingExp: 140,
        craftingTimeSeconds: 20,
        requiresScroll: false,
        unlockCost: 1600,
        goldCost: 1200,
materials: [
    {
        itemId: "mage_staff",
        quantity: 1
    },
    {
        itemId: "frost_essence",
        quantity: 8
    },
    {
        itemId: "frozen_bone",
        quantity: 3
    },
    {
        itemId: "ice_elemental_core",
        quantity: 2
    },
    {
        itemId: "frost_crown_fragment",
        quantity: 1
    }
],
    },

    {
        id: "dragon_staff_recipe",
        name: "Smoczy kostur",
        subcategory: "staff",
        resultItemId: "dragon_staff",
        requiredCraftingLevel: 20,
        craftingExp: 220,
        craftingTimeSeconds: 24,
        requiresScroll: false,
        unlockCost: 5000,
        goldCost: 4000,
materials: [
    {
        itemId: "master_staff",
        quantity: 1
    },
    {
        itemId: "mithril_ingot",
        quantity: 2
    },
    {
        itemId: "charred_bone",
        quantity: 4
    },
    {
        itemId: "ember_essence",
        quantity: 10
    },
    {
        itemId: "magma_core",
        quantity: 3
    },
    {
        itemId: "volcanic_heart_fragment",
        quantity: 1
    }
],
    },

    ...professionToolUpgradeRecipes


];

const armorerTierSettings = {
    1: {
        requiredCraftingLevel: 1,
        craftingExp: 25,
        craftingTimeSeconds: 12,
        ingotId: "bronze_ingot",
    },

    10: {
        requiredCraftingLevel: 5,
        craftingExp: 50,
        craftingTimeSeconds: 14,
        ingotId: "iron_ingot",
    },

    20: {
        requiredCraftingLevel: 10,
        craftingExp: 85,
        craftingTimeSeconds: 16,
        ingotId: "silver_ingot",
    },

    35: {
        requiredCraftingLevel: 15,
        craftingExp: 140,
        craftingTimeSeconds: 20,
        ingotId: "platinum_ingot",
    },

    50: {
        requiredCraftingLevel: 20,
        craftingExp: 220,
        craftingTimeSeconds: 24,
        ingotId: "mithril_ingot",
    },
};

const armorerIngotQuantityByType = {
    shield: 2,
    helmet: 2,
    armor: 4,
    pants: 3,
    boots: 2,
    gloves: 2,
};

recipes.forEach((recipe) => {
    const resultItem =
        items[recipe.resultItemId];

    if (!resultItem) {
        return;
    }

    const ingotQuantity =
        armorerIngotQuantityByType[
        resultItem.type
        ];

    /*
     * Jeśli typ przedmiotu nie znajduje
     * się na liście Płatnerza,
     * pozostawiamy recepturę bez zmian.
     */
    if (!ingotQuantity) {
        return;
    }

    const tierSettings =
        armorerTierSettings[
        resultItem.requiredLevel
        ];

    if (!tierSettings) {
        return;
    }

    recipe.requiredCraftingLevel =
        tierSettings.requiredCraftingLevel;

    recipe.craftingExp =
        tierSettings.craftingExp;

    recipe.craftingTimeSeconds =
        tierSettings.craftingTimeSeconds;

    /*
     * Stara moneta jest łupem na sprzedaż,
     * dlatego usuwamy ją z receptur.
     */
    recipe.materials =
        recipe.materials.filter(
            (material) => {
                return (
                    material.itemId !==
                    "old_coin"
                );
            },
        );

    const alreadyHasIngot =
        recipe.materials.some(
            (material) => {
                return (
                    material.itemId ===
                    tierSettings.ingotId
                );
            },
        );

    if (!alreadyHasIngot) {
        recipe.materials.push({
            itemId:
                tierSettings.ingotId,

            quantity:
                ingotQuantity,
        });
    }
});

const armorerLocationMaterialsByTier = {
    35: {
        shield: [
            {
                itemId:
                    "frost_giant_shard",
                quantity: 2
            },
            {
                itemId:
                    "frozen_chain",
                quantity: 2
            }
        ],

        helmet: [
            {
                itemId:
                    "frozen_bone",
                quantity: 2
            },
            {
                itemId:
                    "frost_essence",
                quantity: 3
            }
        ],

        armor: [
            {
                itemId:
                    "tanned_ice_wolf_leather",
                quantity: 2
            },
            {
                itemId:
                    "frozen_chain",
                quantity: 3
            },
            {
                itemId:
                    "ice_elemental_core",
                quantity: 1
            }
        ],

        pants: [
            {
                itemId:
                    "tanned_ice_wolf_leather",
                quantity: 2
            },
            {
                itemId:
                    "frozen_bone",
                quantity: 2
            }
        ],

        boots: [
            {
                itemId:
                    "tanned_ice_wolf_leather",
                quantity: 1
            },
            {
                itemId:
                    "frost_essence",
                quantity: 3
            }
        ],

        gloves: [
            {
                itemId:
                    "frozen_chain",
                quantity: 2
            },
            {
                itemId:
                    "frost_giant_shard",
                quantity: 1
            }
        ]
    },

    50: {
        shield: [
            {
                itemId:
                    "obsidian_shard",
                quantity: 3
            },
            {
                itemId:
                    "magma_golem_plate",
                quantity: 2
            }
        ],

        helmet: [
            {
                itemId:
                    "charred_bone",
                quantity: 2
            },
            {
                itemId:
                    "ember_essence",
                quantity: 3
            }
        ],

        armor: [
            {
                itemId:
                    "magma_golem_plate",
                quantity: 4
            },
            {
                itemId:
                    "magma_core",
                quantity: 1
            }
        ],

        pants: [
            {
                itemId:
                    "tanned_lava_hound_leather",
                quantity: 2
            },
            {
                itemId:
                    "charred_bone",
                quantity: 2
            }
        ],

        boots: [
            {
                itemId:
                    "tanned_lava_hound_leather",
                quantity: 1
            },
            {
                itemId:
                    "ember_essence",
                quantity: 3
            }
        ],

        gloves: [
            {
                itemId:
                    "obsidian_shard",
                quantity: 2
            },
            {
                itemId:
                    "magma_golem_plate",
                quantity: 1
            }
        ]
    }
};

recipes.forEach(recipe => {
    const resultItem =
        items[recipe.resultItemId];

    if (!resultItem) {
        return;
    }

    const tierMaterials =
        armorerLocationMaterialsByTier[
            resultItem.requiredLevel
        ]?.[resultItem.type];

    if (!tierMaterials) {
        return;
    }

    tierMaterials.forEach(
        requiredMaterial => {
            const existingMaterial =
                recipe.materials.find(
                    material => {
                        return (
                            material.itemId ===
                            requiredMaterial.itemId
                        );
                    }
                );

            if (existingMaterial) {
                existingMaterial.quantity =
                    Math.max(
                        existingMaterial.quantity,
                        requiredMaterial.quantity
                    );

                return;
            }

            recipe.materials.push({
                ...requiredMaterial
            });
        }
    );

    let bossMaterialId = null;

    if (
        resultItem.id.startsWith(
            "commander_"
        )
    ) {
        bossMaterialId =
            "frost_crown_fragment";
    }

    if (
        resultItem.id.startsWith(
            "dragon_"
        )
    ) {
        bossMaterialId =
            "volcanic_heart_fragment";
    }

    if (
        bossMaterialId &&
        !recipe.materials.some(
            material =>
                material.itemId ===
                bossMaterialId
        )
    ) {
        recipe.materials.push({
            itemId: bossMaterialId,
            quantity: 1
        });
    }
});

const jewelerTierSettings = {
    1: {
        requiredCraftingLevel: 1,
        craftingExp: 25,
        craftingTimeSeconds: 12,
        ingotId: "bronze_ingot",
        gemId: "quartz",
    },

    10: {
        requiredCraftingLevel: 5,
        craftingExp: 50,
        craftingTimeSeconds: 14,
        ingotId: "silver_ingot",
        gemId: "amethyst",
    },

    20: {
        requiredCraftingLevel: 10,
        craftingExp: 85,
        craftingTimeSeconds: 16,
        ingotId: "gold_ingot",
        gemId: "sapphire",
    },

    35: {
        requiredCraftingLevel: 15,
        craftingExp: 140,
        craftingTimeSeconds: 20,
        ingotId: "platinum_ingot",
        gemId: "ruby",
    },

    50: {
        requiredCraftingLevel: 20,
        craftingExp: 220,
        craftingTimeSeconds: 24,
        ingotId: "mithril_ingot",
        gemId: "diamond",
    },
};

const jewelerIngotQuantityByType = {
    ring: 1,
    amulet: 2,
};

recipes.forEach((recipe) => {
    const resultItem =
        items[recipe.resultItemId];

    if (!resultItem) {
        return;
    }

    const ingotQuantity =
        jewelerIngotQuantityByType[
        resultItem.type
        ];

    /*
     * Pozostałe rodzaje przedmiotów
     * nie należą do Jubilera.
     */
    if (!ingotQuantity) {
        return;
    }

    const tierSettings =
        jewelerTierSettings[
        resultItem.requiredLevel
        ];

    if (!tierSettings) {
        return;
    }

    recipe.requiredCraftingLevel =
        tierSettings.requiredCraftingLevel;

    recipe.craftingExp =
        tierSettings.craftingExp;

    recipe.craftingTimeSeconds =
        tierSettings.craftingTimeSeconds;

    /*
     * Usuwamy stare, powtarzające się
     * składniki biżuterii.
     */
    recipe.materials =
        recipe.materials.filter(
            (material) => {
                return (
                    material.itemId !==
                    "old_coin" &&
                    material.itemId !==
                    "cave_crystal"
                );
            },
        );

    const newMaterials = [
        {
            itemId: tierSettings.ingotId,
            quantity: ingotQuantity,
        },
        {
            itemId: tierSettings.gemId,
            quantity: 1,
        },
    ];

    newMaterials.forEach(
        (newMaterial) => {
            const alreadyExists =
                recipe.materials.some(
                    (material) => {
                        return (
                            material.itemId ===
                            newMaterial.itemId
                        );
                    },
                );

            if (!alreadyExists) {
                recipe.materials.push(
                    newMaterial,
                );
            }
        },
    );
});

const jewelryLocationMaterialsByTier = {
    35: {
        ring: [
            {
                itemId: "frost_essence",
                quantity: 3
            },
            {
                itemId:
                    "ice_elemental_core",
                quantity: 1
            }
        ],

        amulet: [
            {
                itemId: "frozen_chain",
                quantity: 2
            },
            {
                itemId:
                    "ice_elemental_core",
                quantity: 1
            }
        ],

        talisman: [
            {
                itemId: "frozen_bone",
                quantity: 3
            },
            {
                itemId: "frost_essence",
                quantity: 4
            },
            {
                itemId:
                    "frost_giant_shard",
                quantity: 1
            }
        ]
    },

    50: {
        ring: [
            {
                itemId: "ember_essence",
                quantity: 3
            },
            {
                itemId: "magma_core",
                quantity: 1
            }
        ],

        amulet: [
            {
                itemId: "obsidian_shard",
                quantity: 2
            },
            {
                itemId: "magma_core",
                quantity: 1
            }
        ],

        talisman: [
            {
                itemId: "charred_bone",
                quantity: 3
            },
            {
                itemId: "ember_essence",
                quantity: 5
            },
            {
                itemId: "magma_core",
                quantity: 1
            }
        ]
    }
};

const obsoleteLateJewelryMaterials =
    new Set([
        "kobold_crown_fragment",
        "stone_core",
        "cave_crystal",
        "old_coin",
        "obsidian",
        "earth_core_shard",
        "burning_crystal"
    ]);

recipes.forEach(recipe => {
    const resultItem =
        items[recipe.resultItemId];

    if (!resultItem) {
        return;
    }

    const tierMaterials =
        jewelryLocationMaterialsByTier[
            resultItem.requiredLevel
        ]?.[resultItem.type];

    if (!tierMaterials) {
        return;
    }

    recipe.materials =
        recipe.materials.filter(
            material => {
                return (
                    !obsoleteLateJewelryMaterials
                        .has(
                            material.itemId
                        )
                );
            }
        );

    tierMaterials.forEach(
        requiredMaterial => {
            const existingMaterial =
                recipe.materials.find(
                    material => {
                        return (
                            material.itemId ===
                            requiredMaterial.itemId
                        );
                    }
                );

            if (existingMaterial) {
                existingMaterial.quantity =
                    Math.max(
                        existingMaterial.quantity,
                        requiredMaterial.quantity
                    );

                return;
            }

            recipe.materials.push({
                ...requiredMaterial
            });
        }
    );

    let bossMaterialId = null;

    if (
        resultItem.id.startsWith(
            "commander_"
        )
    ) {
        bossMaterialId =
            "frost_crown_fragment";
    }

    if (
        resultItem.id.startsWith(
            "dragon_"
        )
    ) {
        bossMaterialId =
            "volcanic_heart_fragment";
    }

    if (
        bossMaterialId &&
        !recipe.materials.some(
            material =>
                material.itemId ===
                bossMaterialId
        )
    ) {
        recipe.materials.push({
            itemId: bossMaterialId,
            quantity: 1
        });
    }
});

const blacksmithWhetstoneRequirements = {
    forest_blade_recipe: 1,
    cave_sword_recipe: 1,
    guardian_blade_recipe: 2,
    commander_sword_recipe: 2,
    dragon_blade_recipe: 3,
    shadow_blade_recipe: 2
};

recipes.forEach(recipe => {
    const requiredQuantity =
        blacksmithWhetstoneRequirements[
        recipe.id
        ];

    if (!requiredQuantity) {
        return;
    }

    const alreadyHasWhetstone =
        recipe.materials.some(
            material =>
                material.itemId ===
                "whetstone"
        );

    if (alreadyHasWhetstone) {
        return;
    }

    recipe.materials.push({
        itemId: "whetstone",
        quantity: requiredQuantity
    });
});

// ======================================================
// EKSPERCKIE I MISTRZOWSKIE ULEPSZENIA EKWIPUNKU
// ======================================================

const lateEquipmentUpgradeSettings = {
    35: {
        rank: "expert",
        rankLabel: "Eksperckie ulepszenie",
        requiredCraftingLevel: 35,
        craftingExp: 650,
        craftingTimeSeconds: 45,
        bossMaterialId: "frost_crown_fragment",
        goldCosts: {
            weapon: 9000,
            shield: 7000,
            helmet: 6500,
            armor: 14000,
            pants: 9000,
            boots: 7500,
            gloves: 7500,
            ring: 8000,
            amulet: 8500,
            talisman: 9000
        },
        materials: {
            "weapon:melee": [
                { itemId: "adamantite_ingot", quantity: 4 },
                { itemId: "crystal_shard", quantity: 4 },
                { itemId: "prismatic_gem", quantity: 1 },
                { itemId: "whetstone", quantity: 3 }
            ],
            "weapon:ranged": [
                { itemId: "adamantite_ingot", quantity: 2 },
                { itemId: "tanned_ice_wolf_leather", quantity: 3 },
                { itemId: "spirit_bloom", quantity: 1 }
            ],
            "weapon:magic": [
                { itemId: "runic_stone", quantity: 4 },
                { itemId: "spirit_bloom", quantity: 2 },
                { itemId: "prismatic_gem", quantity: 1 }
            ],
            shield: [
                { itemId: "adamantite_ingot", quantity: 2 },
                { itemId: "runic_stone", quantity: 3 },
                { itemId: "spirit_bloom", quantity: 1 }
            ],
            helmet: [
                { itemId: "adamantite_ingot", quantity: 2 },
                { itemId: "crystal_shard", quantity: 3 },
                { itemId: "dream_moss", quantity: 3 }
            ],
            armor: [
                { itemId: "adamantite_ingot", quantity: 4 },
                { itemId: "tanned_ice_wolf_leather", quantity: 2 },
                { itemId: "witch_root", quantity: 1 }
            ],
            pants: [
                { itemId: "adamantite_ingot", quantity: 3 },
                { itemId: "tanned_ice_wolf_leather", quantity: 2 },
                { itemId: "crystal_shard", quantity: 2 }
            ],
            boots: [
                { itemId: "adamantite_ingot", quantity: 2 },
                { itemId: "tanned_ice_wolf_leather", quantity: 1 },
                { itemId: "dream_moss", quantity: 3 }
            ],
            gloves: [
                { itemId: "adamantite_ingot", quantity: 2 },
                { itemId: "runic_stone", quantity: 3 },
                { itemId: "witch_root", quantity: 1 }
            ],
            ring: [
                { itemId: "adamantite_ingot", quantity: 1 },
                { itemId: "prismatic_gem", quantity: 1 },
                { itemId: "spirit_bloom", quantity: 1 }
            ],
            amulet: [
                { itemId: "adamantite_ingot", quantity: 2 },
                { itemId: "prismatic_gem", quantity: 1 },
                { itemId: "witch_root", quantity: 1 }
            ],
            talisman: [
                { itemId: "runic_stone", quantity: 3 },
                { itemId: "spirit_bloom", quantity: 2 },
                { itemId: "lunar_essence", quantity: 1 }
            ]
        }
    },

    50: {
        rank: "master",
        rankLabel: "Mistrzowskie ulepszenie",
        requiredCraftingLevel: 50,
        craftingExp: 1200,
        craftingTimeSeconds: 70,
        bossMaterialId: "volcanic_heart_fragment",
        goldCosts: {
            weapon: 30000,
            shield: 24000,
            helmet: 22000,
            armor: 45000,
            pants: 30000,
            boots: 26000,
            gloves: 26000,
            ring: 27000,
            amulet: 29000,
            talisman: 32000
        },
        materials: {
            "weapon:melee": [
                { itemId: "dragonsteel_ingot", quantity: 4 },
                { itemId: "astral_ore", quantity: 4 },
                { itemId: "astral_diamond", quantity: 1 },
                { itemId: "whetstone", quantity: 4 }
            ],
            "weapon:ranged": [
                { itemId: "dragonsteel_ingot", quantity: 2 },
                { itemId: "tanned_lava_hound_leather", quantity: 3 },
                { itemId: "celestial_lotus", quantity: 1 }
            ],
            "weapon:magic": [
                { itemId: "astral_ore", quantity: 4 },
                { itemId: "celestial_lotus", quantity: 2 },
                { itemId: "life_essence", quantity: 1 }
            ],
            shield: [
                { itemId: "dragonsteel_ingot", quantity: 2 },
                { itemId: "titan_stone", quantity: 3 },
                { itemId: "celestial_lotus", quantity: 1 }
            ],
            helmet: [
                { itemId: "dragonsteel_ingot", quantity: 2 },
                { itemId: "astral_ore", quantity: 3 },
                { itemId: "aether_petals", quantity: 3 }
            ],
            armor: [
                { itemId: "dragonsteel_ingot", quantity: 4 },
                { itemId: "worldroot_sprout", quantity: 3 },
                { itemId: "time_bloom", quantity: 1 }
            ],
            pants: [
                { itemId: "dragonsteel_ingot", quantity: 3 },
                { itemId: "tanned_lava_hound_leather", quantity: 2 },
                { itemId: "astral_ore", quantity: 2 }
            ],
            boots: [
                { itemId: "dragonsteel_ingot", quantity: 2 },
                { itemId: "tanned_lava_hound_leather", quantity: 1 },
                { itemId: "phoenix_herb", quantity: 3 }
            ],
            gloves: [
                { itemId: "dragonsteel_ingot", quantity: 2 },
                { itemId: "titan_stone", quantity: 3 },
                { itemId: "time_bloom", quantity: 1 }
            ],
            ring: [
                { itemId: "dragonsteel_ingot", quantity: 1 },
                { itemId: "astral_diamond", quantity: 1 },
                { itemId: "celestial_lotus", quantity: 1 }
            ],
            amulet: [
                { itemId: "dragonsteel_ingot", quantity: 2 },
                { itemId: "astral_diamond", quantity: 1 },
                { itemId: "time_bloom", quantity: 1 }
            ],
            talisman: [
                { itemId: "astral_ore", quantity: 3 },
                { itemId: "celestial_lotus", quantity: 2 },
                { itemId: "life_essence", quantity: 1 }
            ]
        }
    }
};

const upgradableEquipmentTypes = new Set([
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
]);

recipes.forEach(recipe => {
    const resultItem = items[recipe.resultItemId];
    const settings = lateEquipmentUpgradeSettings[
        resultItem?.requiredLevel
    ];

    if (
        !resultItem ||
        !settings ||
        !upgradableEquipmentTypes.has(resultItem.type)
    ) {
        return;
    }

    const sourceMaterial = recipe.materials.find(material => {
        const materialItem = items[material.itemId];

        if (!materialItem) {
            return false;
        }

        if (resultItem.type === "weapon") {
            return materialItem.type === "weapon";
        }

        return materialItem.type === resultItem.type;
    });

    if (!sourceMaterial) {
        return;
    }

    const materialKey = resultItem.type === "weapon"
        ? "weapon:" + resultItem.weaponType
        : resultItem.type;
    const upgradeMaterials = settings.materials[materialKey];

    if (!upgradeMaterials) {
        return;
    }

    recipe.requiredCraftingLevel =
        settings.requiredCraftingLevel;
    recipe.craftingExp = settings.craftingExp;
    recipe.craftingTimeSeconds =
        settings.craftingTimeSeconds;
    recipe.goldCost = Math.max(
        Number(recipe.goldCost) || 0,
        settings.goldCosts[resultItem.type] || 0
    );
    recipe.upgradeFromItemId =
        sourceMaterial.itemId;
    recipe.equipmentUpgradeRank =
        settings.rank;
    recipe.equipmentUpgradeRankLabel =
        settings.rankLabel;
    recipe.materials = [
        {
            itemId: sourceMaterial.itemId,
            quantity: 1
        },
        ...upgradeMaterials.map(material => ({
            ...material
        })),
        {
            itemId: settings.bossMaterialId,
            quantity: 1
        }
    ];
});

// Każda receptura broni i pancerza jest
// prezentowana jako ulepszenie przedmiotu,
// również na wcześniejszych poziomach.
const equipmentUpgradePresentationByLevel = {
    1: {
        rank: "basic",
        rankLabel: "Podstawowe ulepszenie"
    },
    10: {
        rank: "improved",
        rankLabel: "Ulepszone uzbrojenie"
    },
    20: {
        rank: "advanced",
        rankLabel: "Zaawansowane ulepszenie"
    },
    35: {
        rank: "expert",
        rankLabel: "Eksperckie ulepszenie"
    },
    50: {
        rank: "master",
        rankLabel: "Mistrzowskie ulepszenie"
    }
};

const equipmentUpgradePresentationTypes =
    new Set([
        "weapon",
        "shield",
        "helmet",
        "armor",
        "pants",
        "boots",
        "gloves"
    ]);

recipes.forEach(recipe => {
    const resultItem = items[recipe.resultItemId];

    if (
        !resultItem ||
        !equipmentUpgradePresentationTypes
            .has(resultItem.type)
    ) {
        return;
    }

    const sourceMaterial = recipe.materials.find(material => {
        const materialItem = items[material.itemId];

        if (!materialItem) {
            return false;
        }

        if (resultItem.type === "weapon") {
            return materialItem.type === "weapon";
        }

        return materialItem.type === resultItem.type;
    });

    if (!sourceMaterial) {
        return;
    }

    const presentation = recipe.requiresScroll
        ? {
            rank: "special",
            rankLabel: "Specjalne ulepszenie"
        }
        : equipmentUpgradePresentationByLevel[
            resultItem.requiredLevel
        ] || {
            rank: "special",
            rankLabel: "Specjalne ulepszenie"
        };

    recipe.upgradeFromItemId =
        recipe.upgradeFromItemId ||
        sourceMaterial.itemId;
    recipe.equipmentUpgradeRank =
        recipe.equipmentUpgradeRank ||
        presentation.rank;
    recipe.equipmentUpgradeRankLabel =
        recipe.equipmentUpgradeRankLabel ||
        presentation.rankLabel;
});
