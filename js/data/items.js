const items = {



    beetle_shell: {
        id: "beetle_shell",
        name: "Pancerzyk chrząszcza",
        rarity: "common",
        value: 2
    },

    beetle_wing: {
        id: "beetle_wing",
        name: "Skrzydło chrząszcza",
        rarity: "common",
        value: 3
    },

    small_spike: {
        id: "small_spike",
        name: "Mały kolec",
        rarity: "rare",
        value: 12
    },

    wool: {
        id: "wool",
        name: "Wełna",
        rarity: "common",
        value: 2
    },

    sheep_skin: {
        id: "sheep_skin",
        name: "Skóra owcy",
        rarity: "common",
        value: 4
    },

    ram_horn: {
        id: "ram_horn",
        name: "Róg owcy",
        rarity: "rare",
        value: 15
    },

    rat_tail: {
        id: "rat_tail",
        name: "Szczurzy ogon",
        rarity: "common",
        value: 3
    },

    sharp_tooth: {
        id: "sharp_tooth",
        name: "Ostry ząb",
        rarity: "common",
        value: 5
    },

    old_coin: {
        id: "old_coin",
        name: "Stara moneta",
        rarity: "rare",
        type: "vendor_trash",
        value: 20
    },

    wolf_fur: {
        id: "wolf_fur",
        name: "Wilcze futro",
        rarity: "common",
        value: 6
    },

    wolf_fang: {
        id: "wolf_fang",
        name: "Wilczy kieł",
        rarity: "uncommon",
        value: 12
    },

    wolf_claw: {
        id: "wolf_claw",
        name: "Wilczy pazur",
        rarity: "rare",
        value: 25
    },

    goblin_dagger: {
        id: "goblin_dagger",
        name: "Gobliński sztylet",
        rarity: "rare",
        type: "weapon",
        weaponType: "melee",
        damage: 4,
        dexterity: 1,
        value: 35
    },

    broken_shield: {
        id: "broken_shield",
        name: "Uszkodzona tarcza",
        rarity: "uncommon",

        type: "crafting_material",

        value: 18
    },

    coin_pouch: {
        id: "coin_pouch",
        name: "Sakiewka goblina",
        rarity: "common",

        type: "vendor_trash",

        value: 12
    },




    goblin_blade_fragment: {
        id: "goblin_blade_fragment",
        name: "Fragment gobliniego ostrza",
        rarity: "uncommon",
        type: "crafting_material",
        value: 18
    },

    recipe_goblin_dagger: {
        id: "recipe_goblin_dagger",
        name: "Receptura: Gobliński sztylet",
        rarity: "rare",
        type: "recipe",
        recipeId: "goblin_dagger_recipe",
        value: 0
    },







    bat_wing: {
        id: "bat_wing",
        name: "Skrzydło nietoperza",
        rarity: "common",
        type: "crafting_material",
        value: 10
    },

    bat_fang: {
        id: "bat_fang",
        name: "Kieł nietoperza",
        rarity: "uncommon",
        type: "crafting_material",
        value: 18
    },

    dark_feather: {
        id: "dark_feather",
        name: "Ciemne pióro",
        rarity: "rare",
        type: "crafting_material",
        value: 35
    },

    spider_leg: {
        id: "spider_leg",
        name: "Noga pająka",
        rarity: "common",
        type: "vendor_trash",
        value: 12
    },

    spider_venom: {
        id: "spider_venom",
        name: "Jad pająka",
        rarity: "uncommon",
        type: "crafting_material",
        value: 24
    },

    spider_silk: {
        id: "spider_silk",
        name: "Pajęczy jedwab",
        rarity: "rare",
        type: "crafting_material",
        value: 40
    },

    bone: {
        id: "bone",
        name: "Kość",
        rarity: "common",
        type: "crafting_material",
        value: 14
    },

    old_skull: {
        id: "old_skull",
        name: "Stara czaszka",
        rarity: "uncommon",
        type: "vendor_trash",
        value: 28
    },

    rusty_chain: {
        id: "rusty_chain",
        name: "Zardzewiały łańcuch",
        rarity: "rare",
        type: "crafting_material",
        value: 45
    },

    kobold_ear: {
        id: "kobold_ear",
        name: "Ucho kobolda",
        rarity: "common",
        type: "vendor_trash",
        value: 18
    },

    kobold_pickaxe: {
        id: "kobold_pickaxe",
        name: "Kilof kobolda",
        rarity: "uncommon",
        type: "crafting_material",
        value: 38
    },

    cave_crystal: {
        id: "cave_crystal",
        name: "Kryształ jaskiniowy",
        rarity: "rare",
        type: "crafting_material",
        value: 60
    },

    stone_core: {
        id: "stone_core",
        name: "Kamienne serce",
        rarity: "rare",
        type: "crafting_material",
        value: 70
    },

    heavy_rock: {
        id: "heavy_rock",
        name: "Ciężki kamień",
        rarity: "common",
        type: "crafting_material",
        value: 20
    },

    kobold_crown_fragment: {
        id: "kobold_crown_fragment",
        name: "Fragment korony kobolda",
        rarity: "epic",
        type: "crafting_material",
        value: 120
    },

    recipe_cave_sword: {
        id: "recipe_cave_sword",
        name: "Receptura: Jaskiniowy miecz",
        rarity: "rare",
        type: "recipe",
        recipeId: "cave_sword_recipe",
        value: 0
    },

    // BRONIE

    old_sword: {
        id: "old_sword",
        name: "Stary miecz",
        rarity: "common",
        type: "weapon",
        weaponType: "melee",
        requiredLevel: 1,
        damage: 3,
        strength: 1,
        value: 50
    },

    forest_blade: {
        id: "forest_blade",
        name: "Leśne ostrze",
        rarity: "uncommon",
        type: "weapon",
        weaponType: "melee",
        requiredLevel: 1,
        damage: 6,
        strength: 2,
        luck: 1,
        value: 150
    },

    iron_sword: {
        id: "iron_sword",
        name: "Żelazny miecz",
        rarity: "common",
        type: "weapon",
        weaponType: "melee",
        requiredLevel: 5,
        damage: 7,
        strength: 2,
        value: 140
    },

    cave_sword: {
        id: "cave_sword",
        name: "Zabójca Koboldów",
        rarity: "rare",
        type: "weapon",
        weaponType: "melee",
        requiredLevel: 5,
        damage: 12,
        strength: 3,
        endurance: 1,
        value: 300
    },

    steel_sword: {
        id: "steel_sword",
        name: "Stalowy miecz",
        rarity: "common",
        type: "weapon",
        weaponType: "melee",
        requiredLevel: 10,
        damage: 14,
        strength: 4,
        value: 380
    },

    guardian_blade: {
        id: "guardian_blade",
        name: "Ostrze strażnika",
        rarity: "rare",
        type: "weapon",
        weaponType: "melee",
        requiredLevel: 10,
        damage: 21,
        strength: 6,
        endurance: 2,
        value: 850
    },

    knight_sword: {
        id: "knight_sword",
        name: "Rycerski miecz",
        rarity: "common",
        type: "weapon",
        weaponType: "melee",
        requiredLevel: 25,
        damage: 32,
        strength: 8,
        endurance: 2,
        value: 1400
    },

    commander_sword: {
        id: "commander_sword",
        name: "Miecz dowódcy",
        rarity: "epic",
        type: "weapon",
        weaponType: "melee",
        requiredLevel: 25,
        damage: 48,
        strength: 12,
        endurance: 5,
        luck: 2,
        value: 3200
    },

    master_sword: {
        id: "master_sword",
        name: "Mistrzowski miecz",
        rarity: "common",
        type: "weapon",
        weaponType: "melee",
        requiredLevel: 50,
        damage: 75,
        strength: 18,
        endurance: 6,
        value: 6000
    },

    dragon_blade: {
        id: "dragon_blade",
        name: "Smocze ostrze",
        rarity: "legendary",
        type: "weapon",
        weaponType: "melee",
        requiredLevel: 50,
        damage: 115,
        strength: 28,
        endurance: 10,
        luck: 6,
        value: 14000
    },

    shadow_blade: {
        id: "shadow_blade",
        name: "Ostrze cienia",
        rarity: "epic",
        type: "weapon",
        weaponType: "melee",
        requiredLevel: 5,
        damage: 16,
        strength: 3,
        dexterity: 3,
        luck: 2,
        value: 650
    },

    recipe_shadow_blade: {
        id: "recipe_shadow_blade",
        name: "Receptura: Ostrze cienia",
        rarity: "rare",
        type: "recipe",
        recipeId: "shadow_blade_recipe",
        value: 0
    },

    // TARCZE

    wooden_shield: {
        id: "wooden_shield",
        name: "Drewniana tarcza",
        rarity: "common",
        type: "shield",
        requiredLevel: 1,
        endurance: 1,
        value: 40
    },

    bark_shield: {
        id: "bark_shield",
        name: "Tarcza z kory",
        rarity: "uncommon",
        type: "shield",
        requiredLevel: 1,
        endurance: 2,
        luck: 1,
        value: 120
    },

    iron_shield: {
        id: "iron_shield",
        name: "Żelazna tarcza",
        rarity: "common",
        type: "shield",
        requiredLevel: 5,
        endurance: 3,
        value: 160
    },

    kobold_shield: {
        id: "kobold_shield",
        name: "Tarcza koboldów",
        rarity: "rare",
        type: "shield",
        requiredLevel: 5,
        endurance: 5,
        strength: 1,
        value: 360
    },

    steel_shield: {
        id: "steel_shield",
        name: "Stalowa tarcza",
        rarity: "common",
        type: "shield",
        requiredLevel: 10,
        endurance: 6,
        value: 500
    },

    guardian_shield: {
        id: "guardian_shield",
        name: "Tarcza strażnika",
        rarity: "rare",
        type: "shield",
        requiredLevel: 10,
        endurance: 9,
        strength: 2,
        value: 1050
    },

    knight_shield: {
        id: "knight_shield",
        name: "Rycerska tarcza",
        rarity: "common",
        type: "shield",
        requiredLevel: 25,
        endurance: 13,
        strength: 2,
        value: 1800
    },

    commander_shield: {
        id: "commander_shield",
        name: "Tarcza dowódcy",
        rarity: "epic",
        type: "shield",
        requiredLevel: 25,
        endurance: 18,
        strength: 4,
        luck: 2,
        value: 4200
    },

    master_shield: {
        id: "master_shield",
        name: "Mistrzowska tarcza",
        rarity: "common",
        type: "shield",
        requiredLevel: 50,
        endurance: 28,
        strength: 5,
        value: 7500
    },

    dragon_shield: {
        id: "dragon_shield",
        name: "Smocza tarcza",
        rarity: "legendary",
        type: "shield",
        requiredLevel: 50,
        endurance: 40,
        strength: 8,
        luck: 5,
        value: 16000
    },

    // HEŁMY

    leather_helmet: {
        id: "leather_helmet",
        name: "Skórzany hełm",
        rarity: "common",
        type: "helmet",
        requiredLevel: 1,
        endurance: 1,
        value: 30
    },

    beetle_helmet: {
        id: "beetle_helmet",
        name: "Hełm z pancerza chrząszcza",
        rarity: "uncommon",
        type: "helmet",
        requiredLevel: 1,
        endurance: 2,
        luck: 1,
        value: 100
    },

    iron_helmet: {
        id: "iron_helmet",
        name: "Żelazny hełm",
        rarity: "common",
        type: "helmet",
        requiredLevel: 5,
        endurance: 3,
        value: 140
    },

    kobold_helmet: {
        id: "kobold_helmet",
        name: "Hełm kobolda",
        rarity: "rare",
        type: "helmet",
        requiredLevel: 5,
        endurance: 4,
        strength: 1,
        value: 320
    },

    steel_helmet: {
        id: "steel_helmet",
        name: "Stalowy hełm",
        rarity: "common",
        type: "helmet",
        requiredLevel: 10,
        endurance: 5,
        value: 450
    },

    guardian_helmet: {
        id: "guardian_helmet",
        name: "Hełm strażnika",
        rarity: "rare",
        type: "helmet",
        requiredLevel: 10,
        endurance: 7,
        strength: 2,
        value: 900
    },

    knight_helmet: {
        id: "knight_helmet",
        name: "Rycerski hełm",
        rarity: "common",
        type: "helmet",
        requiredLevel: 25,
        endurance: 10,
        strength: 2,
        value: 1500
    },

    commander_helmet: {
        id: "commander_helmet",
        name: "Hełm dowódcy",
        rarity: "epic",
        type: "helmet",
        requiredLevel: 25,
        endurance: 14,
        strength: 4,
        luck: 1,
        value: 3500
    },

    master_helmet: {
        id: "master_helmet",
        name: "Mistrzowski hełm",
        rarity: "common",
        type: "helmet",
        requiredLevel: 50,
        endurance: 22,
        strength: 4,
        value: 6500
    },

    dragon_helmet: {
        id: "dragon_helmet",
        name: "Smoczy hełm",
        rarity: "legendary",
        type: "helmet",
        requiredLevel: 50,
        endurance: 32,
        strength: 7,
        luck: 4,
        value: 14500
    },

    // PANCERZE

    leather_armor: {
        id: "leather_armor",
        name: "Skórzany pancerz",
        rarity: "common",
        type: "armor",
        requiredLevel: 1,
        endurance: 2,
        value: 70
    },

    wolf_armor: {
        id: "wolf_armor",
        name: "Pancerz wilka",
        rarity: "uncommon",
        type: "armor",
        requiredLevel: 1,
        endurance: 4,
        dexterity: 1,
        value: 180
    },

    iron_armor: {
        id: "iron_armor",
        name: "Żelazny pancerz",
        rarity: "common",
        type: "armor",
        requiredLevel: 5,
        endurance: 6,
        value: 320
    },

    kobold_armor: {
        id: "kobold_armor",
        name: "Pancerz kobolda",
        rarity: "rare",
        type: "armor",
        requiredLevel: 5,
        endurance: 9,
        strength: 2,
        value: 700
    },

    steel_armor: {
        id: "steel_armor",
        name: "Stalowy pancerz",
        rarity: "common",
        type: "armor",
        requiredLevel: 10,
        endurance: 12,
        value: 1100
    },

    guardian_armor: {
        id: "guardian_armor",
        name: "Pancerz strażnika",
        rarity: "rare",
        type: "armor",
        requiredLevel: 10,
        endurance: 17,
        strength: 3,
        value: 2200
    },

    knight_armor: {
        id: "knight_armor",
        name: "Rycerski pancerz",
        rarity: "common",
        type: "armor",
        requiredLevel: 25,
        endurance: 25,
        strength: 4,
        value: 4500
    },

    commander_armor: {
        id: "commander_armor",
        name: "Pancerz dowódcy",
        rarity: "epic",
        type: "armor",
        requiredLevel: 25,
        endurance: 34,
        strength: 7,
        luck: 2,
        value: 8500
    },

    master_armor: {
        id: "master_armor",
        name: "Mistrzowski pancerz",
        rarity: "common",
        type: "armor",
        requiredLevel: 50,
        endurance: 52,
        strength: 8,
        value: 16000
    },

    dragon_armor: {
        id: "dragon_armor",
        name: "Smoczy pancerz",
        rarity: "legendary",
        type: "armor",
        requiredLevel: 50,
        endurance: 75,
        strength: 14,
        luck: 5,
        value: 32000
    },

    // SPODNIE

    leather_pants: {
        id: "leather_pants",
        name: "Skórzane spodnie",
        rarity: "common",
        type: "pants",
        requiredLevel: 1,
        endurance: 1,
        dexterity: 1,
        value: 45
    },

    tracker_pants: {
        id: "tracker_pants",
        name: "Spodnie tropiciela",
        rarity: "uncommon",
        type: "pants",
        requiredLevel: 1,
        endurance: 2,
        dexterity: 2,
        luck: 1,
        value: 130
    },

    iron_pants: {
        id: "iron_pants",
        name: "Żelazne nogawice",
        rarity: "common",
        type: "pants",
        requiredLevel: 5,
        endurance: 3,
        dexterity: 1,
        value: 180
    },

    kobold_pants: {
        id: "kobold_pants",
        name: "Nogawice kobolda",
        rarity: "rare",
        type: "pants",
        requiredLevel: 5,
        endurance: 5,
        dexterity: 2,
        strength: 1,
        value: 420
    },

    steel_pants: {
        id: "steel_pants",
        name: "Stalowe nogawice",
        rarity: "common",
        type: "pants",
        requiredLevel: 10,
        endurance: 7,
        dexterity: 2,
        value: 650
    },

    guardian_pants: {
        id: "guardian_pants",
        name: "Nogawice strażnika",
        rarity: "rare",
        type: "pants",
        requiredLevel: 10,
        endurance: 10,
        dexterity: 3,
        strength: 2,
        value: 1300
    },

    knight_pants: {
        id: "knight_pants",
        name: "Rycerskie nogawice",
        rarity: "common",
        type: "pants",
        requiredLevel: 25,
        endurance: 15,
        dexterity: 4,
        strength: 2,
        value: 2600
    },

    commander_pants: {
        id: "commander_pants",
        name: "Nogawice dowódcy",
        rarity: "epic",
        type: "pants",
        requiredLevel: 25,
        endurance: 21,
        dexterity: 6,
        strength: 4,
        luck: 2,
        value: 5600
    },

    master_pants: {
        id: "master_pants",
        name: "Mistrzowskie nogawice",
        rarity: "common",
        type: "pants",
        requiredLevel: 50,
        endurance: 32,
        dexterity: 8,
        strength: 5,
        value: 11000
    },

    dragon_pants: {
        id: "dragon_pants",
        name: "Smocze nogawice",
        rarity: "legendary",
        type: "pants",
        requiredLevel: 50,
        endurance: 46,
        dexterity: 12,
        strength: 8,
        luck: 5,
        value: 23000
    },

    // BUTY

    old_boots: {
        id: "old_boots",
        name: "Stare buty",
        rarity: "common",
        type: "boots",
        requiredLevel: 1,
        endurance: 1,
        dexterity: 1,
        value: 30
    },

    wolf_boots: {
        id: "wolf_boots",
        name: "Buty wilka",
        rarity: "uncommon",
        type: "boots",
        requiredLevel: 1,
        endurance: 2,
        dexterity: 3,
        luck: 1,
        value: 120
    },

    iron_boots: {
        id: "iron_boots",
        name: "Żelazne buty",
        rarity: "common",
        type: "boots",
        requiredLevel: 5,
        endurance: 3,
        dexterity: 2,
        value: 160
    },

    kobold_boots: {
        id: "kobold_boots",
        name: "Buty kobolda",
        rarity: "rare",
        type: "boots",
        requiredLevel: 5,
        endurance: 4,
        dexterity: 4,
        strength: 1,
        value: 380
    },

    steel_boots: {
        id: "steel_boots",
        name: "Stalowe buty",
        rarity: "common",
        type: "boots",
        requiredLevel: 10,
        endurance: 6,
        dexterity: 4,
        value: 600
    },

    guardian_boots: {
        id: "guardian_boots",
        name: "Buty strażnika",
        rarity: "rare",
        type: "boots",
        requiredLevel: 10,
        endurance: 8,
        dexterity: 6,
        strength: 2,
        value: 1200
    },

    knight_boots: {
        id: "knight_boots",
        name: "Rycerskie buty",
        rarity: "common",
        type: "boots",
        requiredLevel: 25,
        endurance: 12,
        dexterity: 8,
        strength: 2,
        value: 2400
    },

    commander_boots: {
        id: "commander_boots",
        name: "Buty dowódcy",
        rarity: "epic",
        type: "boots",
        requiredLevel: 25,
        endurance: 17,
        dexterity: 12,
        strength: 4,
        luck: 2,
        value: 5200
    },

    master_boots: {
        id: "master_boots",
        name: "Mistrzowskie buty",
        rarity: "common",
        type: "boots",
        requiredLevel: 50,
        endurance: 26,
        dexterity: 16,
        strength: 4,
        value: 10000
    },

    dragon_boots: {
        id: "dragon_boots",
        name: "Smocze buty",
        rarity: "legendary",
        type: "boots",
        requiredLevel: 50,
        endurance: 38,
        dexterity: 24,
        strength: 7,
        luck: 5,
        value: 21000
    },

    // RĘKAWICE

    leather_gloves: {
        id: "leather_gloves",
        name: "Skórzane rękawice",
        rarity: "common",
        type: "gloves",
        requiredLevel: 1,
        strength: 1,
        dexterity: 1,
        value: 35
    },

    wolf_gloves: {
        id: "wolf_gloves",
        name: "Rękawice wilka",
        rarity: "uncommon",
        type: "gloves",
        requiredLevel: 1,
        strength: 2,
        dexterity: 2,
        luck: 1,
        value: 120
    },

    iron_gloves: {
        id: "iron_gloves",
        name: "Żelazne rękawice",
        rarity: "common",
        type: "gloves",
        requiredLevel: 5,
        strength: 3,
        endurance: 1,
        value: 170
    },

    kobold_gloves: {
        id: "kobold_gloves",
        name: "Rękawice kobolda",
        rarity: "rare",
        type: "gloves",
        requiredLevel: 5,
        strength: 4,
        dexterity: 2,
        endurance: 1,
        value: 400
    },

    steel_gloves: {
        id: "steel_gloves",
        name: "Stalowe rękawice",
        rarity: "common",
        type: "gloves",
        requiredLevel: 10,
        strength: 6,
        endurance: 2,
        value: 620
    },

    guardian_gloves: {
        id: "guardian_gloves",
        name: "Rękawice strażnika",
        rarity: "rare",
        type: "gloves",
        requiredLevel: 10,
        strength: 8,
        endurance: 3,
        dexterity: 2,
        value: 1250
    },

    knight_gloves: {
        id: "knight_gloves",
        name: "Rycerskie rękawice",
        rarity: "common",
        type: "gloves",
        requiredLevel: 25,
        strength: 12,
        endurance: 4,
        dexterity: 3,
        value: 2500
    },

    commander_gloves: {
        id: "commander_gloves",
        name: "Rękawice dowódcy",
        rarity: "epic",
        type: "gloves",
        requiredLevel: 25,
        strength: 17,
        endurance: 6,
        dexterity: 5,
        luck: 2,
        value: 5400
    },

    master_gloves: {
        id: "master_gloves",
        name: "Mistrzowskie rękawice",
        rarity: "common",
        type: "gloves",
        requiredLevel: 50,
        strength: 26,
        endurance: 8,
        dexterity: 6,
        value: 10500
    },

    dragon_gloves: {
        id: "dragon_gloves",
        name: "Smocze rękawice",
        rarity: "legendary",
        type: "gloves",
        requiredLevel: 50,
        strength: 38,
        endurance: 12,
        dexterity: 10,
        luck: 5,
        value: 22000
    },

    // PIERŚCIENIE

    simple_ring: {
        id: "simple_ring",
        name: "Prosty pierścień",
        rarity: "common",
        type: "ring",
        requiredLevel: 1,
        luck: 1,
        value: 60
    },

    lucky_ring: {
        id: "lucky_ring",
        name: "Pierścień szczęścia",
        rarity: "uncommon",
        type: "ring",
        requiredLevel: 1,
        luck: 3,
        dexterity: 1,
        value: 180
    },

    iron_ring: {
        id: "iron_ring",
        name: "Żelazny pierścień",
        rarity: "common",
        type: "ring",
        requiredLevel: 5,
        strength: 1,
        endurance: 1,
        luck: 1,
        value: 220
    },

    kobold_ring: {
        id: "kobold_ring",
        name: "Pierścień kobolda",
        rarity: "rare",
        type: "ring",
        requiredLevel: 5,
        strength: 2,
        dexterity: 2,
        luck: 2,
        value: 520
    },

    steel_ring: {
        id: "steel_ring",
        name: "Stalowy pierścień",
        rarity: "common",
        type: "ring",
        requiredLevel: 10,
        strength: 2,
        endurance: 2,
        luck: 2,
        value: 850
    },

    guardian_ring: {
        id: "guardian_ring",
        name: "Pierścień strażnika",
        rarity: "rare",
        type: "ring",
        requiredLevel: 10,
        strength: 3,
        endurance: 3,
        luck: 3,
        value: 1700
    },

    knight_ring: {
        id: "knight_ring",
        name: "Rycerski pierścień",
        rarity: "common",
        type: "ring",
        requiredLevel: 25,
        strength: 4,
        endurance: 4,
        dexterity: 2,
        luck: 3,
        value: 3600
    },

    commander_ring: {
        id: "commander_ring",
        name: "Pierścień dowódcy",
        rarity: "epic",
        type: "ring",
        requiredLevel: 25,
        strength: 6,
        endurance: 6,
        dexterity: 4,
        luck: 6,
        value: 7800
    },

    master_ring: {
        id: "master_ring",
        name: "Mistrzowski pierścień",
        rarity: "common",
        type: "ring",
        requiredLevel: 50,
        strength: 8,
        endurance: 8,
        dexterity: 5,
        luck: 6,
        value: 15000
    },

    dragon_ring: {
        id: "dragon_ring",
        name: "Smoczy pierścień",
        rarity: "legendary",
        type: "ring",
        requiredLevel: 50,
        strength: 13,
        endurance: 13,
        dexterity: 9,
        luck: 12,
        value: 31000
    },

    // AMULETY

    simple_amulet: {
        id: "simple_amulet",
        name: "Prosty amulet",
        rarity: "common",
        type: "amulet",
        requiredLevel: 1,
        intelligence: 1,
        luck: 1,
        value: 70
    },

    mana_amulet: {
        id: "mana_amulet",
        name: "Amulet many",
        rarity: "uncommon",
        type: "amulet",
        requiredLevel: 1,
        intelligence: 3,
        luck: 1,
        value: 190
    },

    iron_amulet: {
        id: "iron_amulet",
        name: "Żelazny amulet",
        rarity: "common",
        type: "amulet",
        requiredLevel: 5,
        intelligence: 2,
        endurance: 1,
        luck: 1,
        value: 240
    },

    kobold_amulet: {
        id: "kobold_amulet",
        name: "Amulet kobolda",
        rarity: "rare",
        type: "amulet",
        requiredLevel: 5,
        intelligence: 4,
        dexterity: 1,
        luck: 2,
        value: 560
    },

    steel_amulet: {
        id: "steel_amulet",
        name: "Stalowy amulet",
        rarity: "common",
        type: "amulet",
        requiredLevel: 10,
        intelligence: 4,
        endurance: 2,
        luck: 2,
        value: 900
    },

    guardian_amulet: {
        id: "guardian_amulet",
        name: "Amulet strażnika",
        rarity: "rare",
        type: "amulet",
        requiredLevel: 10,
        intelligence: 6,
        endurance: 3,
        luck: 3,
        value: 1800
    },

    knight_amulet: {
        id: "knight_amulet",
        name: "Rycerski amulet",
        rarity: "common",
        type: "amulet",
        requiredLevel: 25,
        intelligence: 8,
        endurance: 4,
        strength: 2,
        luck: 3,
        value: 3800
    },

    commander_amulet: {
        id: "commander_amulet",
        name: "Amulet dowódcy",
        rarity: "epic",
        type: "amulet",
        requiredLevel: 25,
        intelligence: 12,
        endurance: 6,
        strength: 4,
        luck: 6,
        value: 8200
    },

    master_amulet: {
        id: "master_amulet",
        name: "Mistrzowski amulet",
        rarity: "common",
        type: "amulet",
        requiredLevel: 50,
        intelligence: 18,
        endurance: 8,
        strength: 5,
        luck: 6,
        value: 15500
    },

    dragon_amulet: {
        id: "dragon_amulet",
        name: "Smoczy amulet",
        rarity: "legendary",
        type: "amulet",
        requiredLevel: 50,
        intelligence: 28,
        endurance: 12,
        strength: 8,
        luck: 12,
        value: 33000
    },

    // TALIZMANY

    simple_talisman: {
        id: "simple_talisman",
        name: "Prosty talizman",
        rarity: "common",
        type: "talisman",
        requiredLevel: 1,
        luck: 2,
        value: 80
    },

    nature_talisman: {
        id: "nature_talisman",
        name: "Talizman natury",
        rarity: "uncommon",
        type: "talisman",
        requiredLevel: 1,
        luck: 4,
        intelligence: 1,
        value: 220
    },

    iron_talisman: {
        id: "iron_talisman",
        name: "Żelazny talizman",
        rarity: "common",
        type: "talisman",
        requiredLevel: 5,
        luck: 2,
        endurance: 2,
        value: 280
    },

    kobold_talisman: {
        id: "kobold_talisman",
        name: "Talizman kobolda",
        rarity: "rare",
        type: "talisman",
        requiredLevel: 5,
        luck: 4,
        dexterity: 2,
        intelligence: 2,
        value: 650
    },

    steel_talisman: {
        id: "steel_talisman",
        name: "Stalowy talizman",
        rarity: "common",
        type: "talisman",
        requiredLevel: 10,
        luck: 4,
        endurance: 3,
        value: 1000
    },

    guardian_talisman: {
        id: "guardian_talisman",
        name: "Talizman strażnika",
        rarity: "rare",
        type: "talisman",
        requiredLevel: 10,
        luck: 6,
        endurance: 4,
        intelligence: 3,
        value: 2000
    },

    knight_talisman: {
        id: "knight_talisman",
        name: "Rycerski talizman",
        rarity: "common",
        type: "talisman",
        requiredLevel: 25,
        luck: 6,
        strength: 3,
        endurance: 4,
        intelligence: 3,
        value: 4200
    },

    commander_talisman: {
        id: "commander_talisman",
        name: "Talizman dowódcy",
        rarity: "epic",
        type: "talisman",
        requiredLevel: 25,
        luck: 10,
        strength: 5,
        dexterity: 5,
        intelligence: 5,
        value: 9000
    },

    master_talisman: {
        id: "master_talisman",
        name: "Mistrzowski talizman",
        rarity: "common",
        type: "talisman",
        requiredLevel: 50,
        luck: 10,
        strength: 6,
        dexterity: 6,
        intelligence: 8,
        value: 17000
    },

    dragon_talisman: {
        id: "dragon_talisman",
        name: "Smoczy talizman",
        rarity: "legendary",
        type: "talisman",
        requiredLevel: 50,
        luck: 20,
        strength: 10,
        dexterity: 10,
        intelligence: 14,
        endurance: 8,
        value: 36000
    },

    // BRONIE DYSTANSOWE

    old_bow: {
        id: "old_bow",
        name: "Stary łuk",
        rarity: "common",
        type: "weapon",
        weaponType: "ranged",
        weaponClass: "bow",
        requiredLevel: 1,
        damage: 3,
        dexterity: 1,
        value: 50
    },

    hunter_bow: {
        id: "hunter_bow",
        name: "Łuk myśliwski",
        rarity: "common",
        type: "weapon",
        weaponType: "ranged",
        weaponClass: "bow",
        requiredLevel: 5,
        damage: 7,
        dexterity: 2,
        value: 140
    },

    steel_crossbow: {
        id: "steel_crossbow",
        name: "Stalowa kusza",
        rarity: "common",
        type: "weapon",
        weaponType: "ranged",
        weaponClass: "crossbow",
        requiredLevel: 10,
        damage: 14,
        dexterity: 4,
        value: 380
    },

    ranger_bow: {
        id: "ranger_bow",
        name: "Łuk zwiadowcy",
        rarity: "common",
        type: "weapon",
        weaponType: "ranged",
        weaponClass: "bow",
        requiredLevel: 25,
        damage: 32,
        dexterity: 8,
        luck: 2,
        value: 1400
    },

    master_bow: {
        id: "master_bow",
        name: "Mistrzowski łuk",
        rarity: "common",
        type: "weapon",
        weaponType: "ranged",
        weaponClass: "bow",
        requiredLevel: 50,
        damage: 75,
        dexterity: 18,
        luck: 4,
        value: 6000
    },

    forest_bow: {
        id: "forest_bow",
        name: "Leśny łuk",
        rarity: "uncommon",
        type: "weapon",
        weaponType: "ranged",
        weaponClass: "bow",
        requiredLevel: 1,
        damage: 6,
        dexterity: 2,
        luck: 1,
        value: 150
    },

    kobold_crossbow: {
        id: "kobold_crossbow",
        name: "Kusza koboldów",
        rarity: "rare",
        type: "weapon",
        weaponType: "ranged",
        weaponClass: "crossbow",
        requiredLevel: 5,
        damage: 12,
        dexterity: 3,
        endurance: 1,
        value: 300
    },

    guardian_bow: {
        id: "guardian_bow",
        name: "Łuk strażnika",
        rarity: "rare",
        type: "weapon",
        weaponType: "ranged",
        weaponClass: "bow",
        requiredLevel: 10,
        damage: 21,
        dexterity: 6,
        luck: 2,
        value: 850
    },

    shadow_crossbow: {
        id: "shadow_crossbow",
        name: "Kusza cienia",
        rarity: "epic",
        type: "weapon",
        weaponType: "ranged",
        weaponClass: "crossbow",
        requiredLevel: 25,
        damage: 48,
        dexterity: 12,
        luck: 5,
        value: 3200
    },

    dragon_bow: {
        id: "dragon_bow",
        name: "Smoczy łuk",
        rarity: "legendary",
        type: "weapon",
        weaponType: "ranged",
        weaponClass: "bow",
        requiredLevel: 50,
        damage: 115,
        dexterity: 28,
        luck: 8,
        value: 14000
    },

    // BRONIE MAGICZNE

    wooden_wand: {
        id: "wooden_wand",
        name: "Drewniana różdżka",
        rarity: "common",
        type: "weapon",
        weaponType: "magic",
        requiredLevel: 1,
        damage: 3,
        intelligence: 1,
        value: 50
    },

    apprentice_staff: {
        id: "apprentice_staff",
        name: "Kostur ucznia",
        rarity: "common",
        type: "weapon",
        weaponType: "magic",
        requiredLevel: 5,
        damage: 7,
        intelligence: 2,
        value: 140
    },

    arcane_wand: {
        id: "arcane_wand",
        name: "Arkaniczna różdżka",
        rarity: "common",
        type: "weapon",
        weaponType: "magic",
        requiredLevel: 10,
        damage: 14,
        intelligence: 4,
        value: 380
    },

    mage_staff: {
        id: "mage_staff",
        name: "Kostur maga",
        rarity: "common",
        type: "weapon",
        weaponType: "magic",
        requiredLevel: 25,
        damage: 32,
        intelligence: 8,
        luck: 2,
        value: 1400
    },

    master_staff: {
        id: "master_staff",
        name: "Mistrzowski kostur",
        rarity: "common",
        type: "weapon",
        weaponType: "magic",
        requiredLevel: 50,
        damage: 75,
        intelligence: 18,
        luck: 4,
        value: 6000
    },

    nature_wand: {
        id: "nature_wand",
        name: "Różdżka natury",
        rarity: "uncommon",
        type: "weapon",
        weaponType: "magic",
        requiredLevel: 1,
        damage: 6,
        intelligence: 2,
        luck: 1,
        value: 150
    },

    crystal_staff: {
        id: "crystal_staff",
        name: "Kryształowy kostur",
        rarity: "rare",
        type: "weapon",
        weaponType: "magic",
        requiredLevel: 5,
        damage: 12,
        intelligence: 3,
        endurance: 1,
        value: 300
    },

    guardian_staff: {
        id: "guardian_staff",
        name: "Kostur strażnika",
        rarity: "rare",
        type: "weapon",
        weaponType: "magic",
        requiredLevel: 10,
        damage: 21,
        intelligence: 6,
        endurance: 2,
        value: 850
    },

    shadow_wand: {
        id: "shadow_wand",
        name: "Różdżka cienia",
        rarity: "epic",
        type: "weapon",
        weaponType: "magic",
        requiredLevel: 25,
        damage: 48,
        intelligence: 12,
        luck: 5,
        value: 3200
    },

    dragon_staff: {
        id: "dragon_staff",
        name: "Smoczy kostur",
        rarity: "legendary",
        type: "weapon",
        weaponType: "magic",
        requiredLevel: 50,
        damage: 115,
        intelligence: 28,
        luck: 8,
        value: 14000
    },


    // SUROWCE Z KOPALNI

    stone: {
        id: "stone",
        name: "Kamień",
        rarity: "common",
        type: "crafting_material",
        value: 2
    },

    coal: {
        id: "coal",
        name: "Węgiel",
        rarity: "common",
        type: "crafting_material",
        value: 4
    },

    copper_ore: {
        id: "copper_ore",
        name: "Ruda miedzi",
        rarity: "common",
        type: "crafting_material",
        value: 6
    },

    tin_ore: {
        id: "tin_ore",
        name: "Ruda cyny",
        rarity: "uncommon",
        type: "crafting_material",
        value: 14
    },

    quartz: {
        id: "quartz",
        name: "Kwarc",
        rarity: "rare",
        type: "crafting_material",
        value: 20
    },

    mine_amber: {
        id: "mine_amber",
        name: "Bursztyn kopalniany",
        rarity: "epic",
        type: "crafting_material",
        value: 80
    },

    iron_ore: {
        id: "iron_ore",
        name: "Ruda żelaza",
        rarity: "common",
        type: "crafting_material",
        value: 10
    },

    silver_ore: {
        id: "silver_ore",
        name: "Ruda srebra",
        rarity: "uncommon",
        type: "crafting_material",
        value: 24
    },

    amethyst: {
        id: "amethyst",
        name: "Ametyst",
        rarity: "rare",
        type: "crafting_material",
        value: 38
    },

    pure_crystal: {
        id: "pure_crystal",
        name: "Czysty kryształ",
        rarity: "epic",
        type: "crafting_material",
        value: 120
    },

    gold_ore: {
        id: "gold_ore",
        name: "Ruda złota",
        rarity: "uncommon",
        type: "crafting_material",
        value: 42
    },

    sapphire: {
        id: "sapphire",
        name: "Szafir",
        rarity: "rare",
        type: "crafting_material",
        value: 65
    },

    ancient_fossil: {
        id: "ancient_fossil",
        name: "Starożytna skamielina",
        rarity: "epic",
        type: "crafting_material",
        value: 180
    },

    obsidian: {
        id: "obsidian",
        name: "Obsydian",
        rarity: "uncommon",
        type: "crafting_material",
        value: 55
    },

    ruby: {
        id: "ruby",
        name: "Rubin",
        rarity: "rare",
        type: "crafting_material",
        value: 85
    },

    platinum_ore: {
        id: "platinum_ore",
        name: "Ruda platyny",
        rarity: "rare",
        type: "crafting_material",
        value: 95
    },

    burning_crystal: {
        id: "burning_crystal",
        name: "Płonący kryształ",
        rarity: "epic",
        type: "crafting_material",
        value: 260
    },

    deep_coal: {
        id: "deep_coal",
        name: "Głęboki węgiel",
        rarity: "uncommon",
        type: "crafting_material",
        value: 75
    },

    mithril_ore: {
        id: "mithril_ore",
        name: "Ruda mithrilu",
        rarity: "rare",
        type: "crafting_material",
        value: 160
    },

    diamond: {
        id: "diamond",
        name: "Diament",
        rarity: "epic",
        type: "crafting_material",
        value: 220
    },

    earth_core_shard: {
        id: "earth_core_shard",
        name: "Odłamek rdzenia ziemi",
        rarity: "legendary",
        type: "crafting_material",
        value: 600
    },

    // ========================================
    // MATERIAŁY PRZETWORZONE
    // ========================================

    copper_ingot: {
        id: "copper_ingot",
        name: "Sztabka miedzi",
        rarity: "common",
        type: "processed_material",
        value: 18
    },

    tin_ingot: {
        id: "tin_ingot",
        name: "Sztabka cyny",
        rarity: "uncommon",
        type: "processed_material",
        value: 44
    },

    bronze_ingot: {
        id: "bronze_ingot",
        name: "Sztabka brązu",
        rarity: "uncommon",
        type: "processed_material",
        value: 35
    },

    iron_ingot: {
        id: "iron_ingot",
        name: "Sztabka żelaza",
        rarity: "common",
        type: "processed_material",
        value: 35
    },

    silver_ingot: {
        id: "silver_ingot",
        name: "Sztabka srebra",
        rarity: "uncommon",
        type: "processed_material",
        value: 76
    },

    gold_ingot: {
        id: "gold_ingot",
        name: "Sztabka złota",
        rarity: "uncommon",
        type: "processed_material",
        value: 130
    },

    platinum_ingot: {
        id: "platinum_ingot",
        name: "Sztabka platyny",
        rarity: "rare",
        type: "processed_material",
        value: 330
    },

    mithril_ingot: {
        id: "mithril_ingot",
        name: "Sztabka mithrilu",
        rarity: "rare",
        type: "processed_material",
        value: 580
    },

    whetstone: {
    id: "whetstone",
    name: "Kamień szlifierski",
    rarity: "common",
    type: "processed_material",
    value: 12
},

    tanned_sheep_leather: {
        id: "tanned_sheep_leather",
        name: "Garbowana skóra owcza",
        rarity: "common",
        type: "processed_material",
        value: 10
    },

    tanned_wolf_leather: {
        id: "tanned_wolf_leather",
        name: "Garbowana wilcza skóra",
        rarity: "uncommon",
        type: "processed_material",
        value: 16
    },

    wool_cloth: {
        id: "wool_cloth",
        name: "Tkanina wełniana",
        rarity: "common",
        type: "processed_material",
        value: 8
    },

    chitin_plate: {
        id: "chitin_plate",
        name: "Płyta chitynowa",
        rarity: "uncommon",
        type: "processed_material",
        value: 9
    },

    // ========================================
    // ZIELARSTWO — LEŚNA POLANA
    // ========================================

    mint_leaf: {
        id: "mint_leaf",
        name: "Liść mięty",
        rarity: "common",
        type: "herb",
        value: 3
    },

    chamomile: {
        id: "chamomile",
        name: "Rumianek",
        rarity: "common",
        type: "herb",
        value: 4
    },

    nettle: {
        id: "nettle",
        name: "Pokrzywa",
        rarity: "common",
        type: "herb",
        value: 4
    },

    blood_flower: {
        id: "blood_flower",
        name: "Krwawy kwiat",
        rarity: "rare",
        type: "herb",
        value: 15
    },

    silver_leaf: {
        id: "silver_leaf",
        name: "Srebrny liść",
        rarity: "rare",
        type: "herb",
        value: 18
    },

    nymph_tear: {
        id: "nymph_tear",
        name: "Łza leśnej nimfy",
        rarity: "epic",
        type: "herb",
        value: 60
    },

    // ========================================
    // ZIELARSTWO — WILGOTNE MOKRADŁA
    // ========================================

    swamp_moss: {
        id: "swamp_moss",
        name: "Bagienny mech",
        rarity: "common",
        type: "herb",
        value: 6
    },

    red_mushroom: {
        id: "red_mushroom",
        name: "Czerwony grzyb",
        rarity: "common",
        type: "herb",
        value: 7
    },

    calamus_root: {
        id: "calamus_root",
        name: "Korzeń tataraku",
        rarity: "common",
        type: "herb",
        value: 8
    },

    poison_cap: {
        id: "poison_cap",
        name: "Trujący kapelusz",
        rarity: "rare",
        type: "herb",
        value: 24
    },

    marsh_flower: {
        id: "marsh_flower",
        name: "Kwiat moczarów",
        rarity: "rare",
        type: "herb",
        value: 28
    },

    swamp_heart: {
        id: "swamp_heart",
        name: "Serce bagna",
        rarity: "epic",
        type: "herb",
        value: 90
    },

    // ========================================
    // ZIELARSTWO — GÓRSKIE ZBOCZE
    // ========================================

    mountain_sage: {
        id: "mountain_sage",
        name: "Górska szałwia",
        rarity: "common",
        type: "herb",
        value: 10
    },

    frostbloom: {
        id: "frostbloom",
        name: "Mróznik",
        rarity: "common",
        type: "herb",
        value: 11
    },

    stone_root: {
        id: "stone_root",
        name: "Kamienny korzeń",
        rarity: "common",
        type: "herb",
        value: 12
    },

    blue_saffron: {
        id: "blue_saffron",
        name: "Błękitny szafran",
        rarity: "rare",
        type: "herb",
        value: 35
    },

    wind_flower: {
        id: "wind_flower",
        name: "Kwiat wichru",
        rarity: "rare",
        type: "herb",
        value: 40
    },

    crystal_orchid: {
        id: "crystal_orchid",
        name: "Kryształowa orchidea",
        rarity: "epic",
        type: "herb",
        value: 130
    },

    // ========================================
    // ZIELARSTWO — PRADAWNY GAJ
    // ========================================

    ancient_bark: {
        id: "ancient_bark",
        name: "Starożytna kora",
        rarity: "common",
        type: "herb",
        value: 15
    },

    glowing_moss: {
        id: "glowing_moss",
        name: "Świetlisty mech",
        rarity: "common",
        type: "herb",
        value: 17
    },

    moon_leaf: {
        id: "moon_leaf",
        name: "Liść księżycowy",
        rarity: "common",
        type: "herb",
        value: 18
    },

    star_flower: {
        id: "star_flower",
        name: "Gwiezdny kwiat",
        rarity: "rare",
        type: "herb",
        value: 50
    },

    mandrake_root: {
        id: "mandrake_root",
        name: "Korzeń mandragory",
        rarity: "rare",
        type: "herb",
        value: 55
    },

    ancient_tree_seed: {
        id: "ancient_tree_seed",
        name: "Nasiono pradawnego drzewa",
        rarity: "epic",
        type: "herb",
        value: 175
    },

    // ========================================
    // ZIELARSTWO — SKAŻONE PUSTKOWIE
    // ========================================

    corrupted_thorn: {
        id: "corrupted_thorn",
        name: "Skażony cierń",
        rarity: "common",
        type: "herb",
        value: 22
    },

    ash_flower: {
        id: "ash_flower",
        name: "Popielny kwiat",
        rarity: "common",
        type: "herb",
        value: 24
    },

    toxic_root: {
        id: "toxic_root",
        name: "Toksyczny korzeń",
        rarity: "common",
        type: "herb",
        value: 26
    },

    shadow_fern: {
        id: "shadow_fern",
        name: "Cień paproci",
        rarity: "rare",
        type: "herb",
        value: 70
    },

    void_spore: {
        id: "void_spore",
        name: "Zarodnik pustki",
        rarity: "rare",
        type: "herb",
        value: 80
    },

    corruption_essence: {
        id: "corruption_essence",
        name: "Esencja spaczenia",
        rarity: "epic",
        type: "herb",
        value: 250
    },

    // ========================================
    // ALCHEMIA — MIKSTURY
    // ========================================

    mining_speed_potion: {
        id: "mining_speed_potion",
        name: "Mikstura górnika",

        description:
            "Zwiększa szybkość kopania o 15% przez 5 minut.",

        rarity: "uncommon",
        type: "potion",

        potionEffectId: "mining_speed",
        effectValue: 15,
        durationSeconds: 300,

        value: 45
    },

    herbalism_speed_potion: {
        id: "herbalism_speed_potion",
        name: "Mikstura zielarza",

        description:
            "Zwiększa szybkość zbierania ziół o 15% przez 5 minut.",

        rarity: "uncommon",
        type: "potion",

        potionEffectId: "herbalism_speed",
        effectValue: 15,
        durationSeconds: 300,

        value: 45
    },

    hunter_potion: {
        id: "hunter_potion",
        name: "Mikstura łowcy",

        description:
            "Zwiększa szansę na zdobycie łupu o 10% przez 5 minut.",

        rarity: "rare",
        type: "potion",

        potionEffectId: "hunter_luck",
        effectValue: 10,
        durationSeconds: 300,

        value: 75
    },

    strength_potion: {
        id: "strength_potion",
        name: "Mikstura siły",

        description:
            "Zwiększa obrażenia broni w zwarciu o 15% przez 5 minut.",

        rarity: "rare",
        type: "potion",

        potionEffectId: "melee_weapon_damage",
        effectValue: 15,
        durationSeconds: 300,

        value: 80
    },

    precision_potion: {
        id: "precision_potion",
        name: "Mikstura precyzji",

        description:
            "Zwiększa obrażenia łuków i kusz o 15% przez 5 minut.",

        rarity: "rare",
        type: "potion",

        potionEffectId: "ranged_weapon_damage",
        effectValue: 15,
        durationSeconds: 300,

        value: 80
    },

    arcane_weapon_potion: {
        id: "arcane_weapon_potion",
        name: "Mikstura arkanicznego oręża",

        description:
            "Zwiększa obrażenia zwykłych ataków różdżkami i kosturami o 15% przez 5 minut.",

        rarity: "rare",
        type: "potion",

        potionEffectId: "magic_weapon_damage",
        effectValue: 15,
        durationSeconds: 300,

        value: 85
    },

    magic_power_potion: {
        id: "magic_power_potion",
        name: "Mikstura mocy magicznej",

        description:
            "Zwiększa obrażenia czarów ofensywnych o 15% przez 5 minut.",

        rarity: "rare",
        type: "potion",

        potionEffectId: "spell_damage",
        effectValue: 15,
        durationSeconds: 300,

        value: 90
    },

    protection_potion: {
        id: "protection_potion",
        name: "Mikstura ochrony",

        description:
            "Zwiększa obronę bohatera o 20% przez 5 minut.",

        rarity: "rare",
        type: "potion",

        potionEffectId: "combat_defense",
        effectValue: 20,
        durationSeconds: 300,

        value: 80
    },

    focus_potion: {
        id: "focus_potion",
        name: "Mikstura skupienia",

        description:
            "Zwiększa regenerację many o 50% przez 5 minut.",

        rarity: "rare",
        type: "potion",

        potionEffectId: "mana_regeneration",
        effectValue: 50,
        durationSeconds: 300,

        value: 85
    },

};

const rarityNames = {
    common: "Zwykły",
    uncommon: "Niepospolity",
    rare: "Rzadki",
    epic: "Epicki",
    legendary: "Legendarny"
};

function getRarityName(rarity) {
    return rarityNames[rarity] || rarity;
}