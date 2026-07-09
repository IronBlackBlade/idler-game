const recipes = [
{
    id: "forest_blade_recipe",
    name: "Leśne ostrze",
    resultItemId: "forest_blade",
    requiresScroll: false,
    unlockCost: 80,
    goldCost: 60,
    materials: [
        { itemId: "old_sword", quantity: 1 },
        { itemId: "wolf_fang", quantity: 2 },
        { itemId: "small_spike", quantity: 1 },
        { itemId: "goblin_blade_fragment", quantity: 1 }
    ]
},

{
    id: "cave_sword_recipe",
    name: "Zabójca Koboldów",
    resultItemId: "cave_sword",
    requiresScroll: false,
    unlockCost: 250,
    goldCost: 180,
    materials: [
        { itemId: "iron_sword", quantity: 1 },
        { itemId: "cave_crystal", quantity: 3 },
        { itemId: "stone_core", quantity: 1 },
        { itemId: "rusty_chain", quantity: 2 },
        { itemId: "kobold_crown_fragment", quantity: 1 }
    ]
},

{
    id: "guardian_blade_recipe",
    name: "Ostrze strażnika",
    resultItemId: "guardian_blade",
    requiresScroll: false,
    unlockCost: 600,
    goldCost: 450,
    materials: [
        { itemId: "steel_sword", quantity: 1 },
        { itemId: "stone_core", quantity: 3 },
        { itemId: "cave_crystal", quantity: 5 },
        { itemId: "rusty_chain", quantity: 4 }
    ]
},

{
    id: "commander_sword_recipe",
    name: "Miecz dowódcy",
    resultItemId: "commander_sword",
    requiresScroll: false,
    unlockCost: 1600,
    goldCost: 1200,
    materials: [
        { itemId: "knight_sword", quantity: 1 },
        { itemId: "kobold_crown_fragment", quantity: 3 },
        { itemId: "stone_core", quantity: 8 },
        { itemId: "cave_crystal", quantity: 10 }
    ]
},



{
    id: "dragon_blade_recipe",
    name: "Smocze ostrze",
    resultItemId: "dragon_blade",
    requiresScroll: false,
    unlockCost: 5000,
    goldCost: 4000,
    materials: [
        { itemId: "master_sword", quantity: 1 },
        { itemId: "kobold_crown_fragment", quantity: 8 },
        { itemId: "stone_core", quantity: 18 },
        { itemId: "cave_crystal", quantity: 25 },
        { itemId: "old_coin", quantity: 10 }
    ]
},

{
    id: "shadow_blade_recipe",
    name: "Ostrze cienia",
    resultItemId: "shadow_blade",
    requiresScroll: true,
    unlockCost: 500,
    goldCost: 350,
    materials: [
        { itemId: "iron_sword", quantity: 1 },
        { itemId: "dark_feather", quantity: 3 },
        { itemId: "bat_fang", quantity: 3 },
        { itemId: "spider_venom", quantity: 2 },
        { itemId: "cave_crystal", quantity: 2 }
    ]
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
    requiresScroll: false,
    unlockCost: 0,
    goldCost: 120,
    materials: [
        { itemId: "simple_talisman", quantity: 1 },
        { itemId: "beetle_wing", quantity: 3 },
        { itemId: "ram_horn", quantity: 1 },
        { itemId: "old_coin", quantity: 2 }
    ]
},

{
    id: "kobold_talisman_recipe",
    name: "Talizman kobolda",
    resultItemId: "kobold_talisman",
    requiresScroll: false,
    unlockCost: 0,
    goldCost: 320,
    materials: [
        { itemId: "iron_talisman", quantity: 1 },
        { itemId: "kobold_ear", quantity: 4 },
        { itemId: "cave_crystal", quantity: 2 },
        { itemId: "old_coin", quantity: 3 }
    ]
},

{
    id: "guardian_talisman_recipe",
    name: "Talizman strażnika",
    resultItemId: "guardian_talisman",
    requiresScroll: false,
    unlockCost: 0,
    goldCost: 850,
    materials: [
        { itemId: "steel_talisman", quantity: 1 },
        { itemId: "stone_core", quantity: 4 },
        { itemId: "cave_crystal", quantity: 6 },
        { itemId: "dark_feather", quantity: 2 }
    ]
},

{
    id: "commander_talisman_recipe",
    name: "Talizman dowódcy",
    resultItemId: "commander_talisman",
    requiresScroll: false,
    unlockCost: 0,
    goldCost: 2300,
    materials: [
        { itemId: "knight_talisman", quantity: 1 },
        { itemId: "kobold_crown_fragment", quantity: 4 },
        { itemId: "stone_core", quantity: 9 },
        { itemId: "cave_crystal", quantity: 12 },
        { itemId: "old_coin", quantity: 10 }
    ]
},

{
    id: "dragon_talisman_recipe",
    name: "Smoczy talizman",
    resultItemId: "dragon_talisman",
    requiresScroll: false,
    unlockCost: 0,
    goldCost: 7200,
    materials: [
        { itemId: "master_talisman", quantity: 1 },
        { itemId: "kobold_crown_fragment", quantity: 10 },
        { itemId: "stone_core", quantity: 22 },
        { itemId: "cave_crystal", quantity: 28 },
        { itemId: "old_coin", quantity: 18 }
    ]
},

];