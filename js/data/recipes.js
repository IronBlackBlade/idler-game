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
        requiredCraftingLevel: 3,
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
                quantity: 1,
            },
            {
                itemId: "platinum_ingot",
                quantity: 3,
            },
            {
                itemId: "obsidian",
                quantity: 4,
            },
            {
                itemId: "ruby",
                quantity: 1,
            },
            {
                itemId: "kobold_crown_fragment",
                quantity: 3,
            },
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
                quantity: 1,
            },
            {
                itemId: "mithril_ingot",
                quantity: 4,
            },
            {
                itemId: "diamond",
                quantity: 2,
            },
            {
                itemId: "earth_core_shard",
                quantity: 1,
            },
            {
                itemId: "burning_crystal",
                quantity: 1,
            },
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
            { itemId: "beetle_shell", quantity: 4 },
            { itemId: "sheep_skin", quantity: 2 },
            { itemId: "wolf_fur", quantity: 1 }
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
            { itemId: "beetle_shell", quantity: 5 },
            { itemId: "small_spike", quantity: 1 },
            { itemId: "sheep_skin", quantity: 1 }
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
            { itemId: "wolf_fur", quantity: 4 },
            { itemId: "wolf_claw", quantity: 1 },
            { itemId: "sheep_skin", quantity: 2 }
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
            { itemId: "wolf_fur", quantity: 3 },
            { itemId: "sheep_skin", quantity: 2 },
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
            { itemId: "wolf_fur", quantity: 2 },
            { itemId: "wolf_claw", quantity: 1 },
            { itemId: "sheep_skin", quantity: 1 }
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
            { itemId: "wolf_fur", quantity: 2 },
            { itemId: "wolf_claw", quantity: 2 },
            { itemId: "sheep_skin", quantity: 1 }
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
            { itemId: "ranger_bow", quantity: 1 },
            { itemId: "platinum_ingot", quantity: 2 },
            { itemId: "obsidian", quantity: 2 },
            { itemId: "dark_feather", quantity: 4 },
            { itemId: "spider_venom", quantity: 3 },
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
            { itemId: "master_bow", quantity: 1 },
            { itemId: "mithril_ingot", quantity: 2 },
            { itemId: "diamond", quantity: 1 },
            { itemId: "spider_silk", quantity: 8 },
            { itemId: "earth_core_shard", quantity: 1 },
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
            { itemId: "mage_staff", quantity: 1 },
            { itemId: "obsidian", quantity: 3 },
            { itemId: "burning_crystal", quantity: 1 },
            { itemId: "dark_feather", quantity: 5 },
            { itemId: "spider_venom", quantity: 4 },
        ]
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
            { itemId: "master_staff", quantity: 1 },
            { itemId: "mithril_ingot", quantity: 2 },
            { itemId: "diamond", quantity: 2 },
            { itemId: "earth_core_shard", quantity: 1 },
            { itemId: "burning_crystal", quantity: 1 },
        ]
    }


];

const armorerTierSettings = {
    1: {
        requiredCraftingLevel: 1,
        craftingExp: 25,
        craftingTimeSeconds: 12,
        ingotId: "bronze_ingot",
    },

    5: {
        requiredCraftingLevel: 5,
        craftingExp: 50,
        craftingTimeSeconds: 14,
        ingotId: "iron_ingot",
    },

    10: {
        requiredCraftingLevel: 10,
        craftingExp: 85,
        craftingTimeSeconds: 16,
        ingotId: "silver_ingot",
    },

    25: {
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

const jewelerTierSettings = {
    1: {
        requiredCraftingLevel: 1,
        craftingExp: 25,
        craftingTimeSeconds: 12,
        ingotId: "bronze_ingot",
        gemId: "quartz",
    },

    5: {
        requiredCraftingLevel: 5,
        craftingExp: 50,
        craftingTimeSeconds: 14,
        ingotId: "silver_ingot",
        gemId: "amethyst",
    },

    10: {
        requiredCraftingLevel: 10,
        craftingExp: 85,
        craftingTimeSeconds: 16,
        ingotId: "gold_ingot",
        gemId: "sapphire",
    },

    25: {
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