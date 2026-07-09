const cave = {
    id: "cave",
    name: "⛰️ Jaskinia",
    description: "Ciemna jaskinia pełna niebezpiecznych stworzeń.",
    recommendedLevel: 5,
    requiredLevel: 5,

    boss: {
        id: "kobold_king",
        name: "👑 Król Koboldów",
        hp: 650,
        attack: 32,
        gold: 140,
        exp: 220,
        loot: [
            { item: "kobold_crown_fragment", chance: 60 },
            { item: "cave_crystal", chance: 45 },
            { item: "recipe_shadow_blade", chance: 10 }
        ]
    },

    enemies: [
        {
            id: "bat",
            name: "Nietoperz",
            hp: 120,
            attack: 14,
            gold: 18,
            exp: 32,
            loot: [
                { item: "bat_wing", chance: 35 },
                { item: "bat_fang", chance: 18 },
                { item: "dark_feather", chance: 8 },
                { item: "recipe_shadow_blade", chance: 1 }
            ]
        },
        {
            id: "cave_spider",
            name: "Pająk jaskiniowy",
            hp: 150,
            attack: 17,
            gold: 22,
            exp: 40,
            loot: [
                { item: "spider_leg", chance: 32 },
                { item: "spider_venom", chance: 16 },
                { item: "spider_silk", chance: 10 },
                { item: "recipe_shadow_blade", chance: 1 }
            ]
        },
        {
            id: "skeleton",
            name: "Szkielet",
            hp: 190,
            attack: 21,
            gold: 28,
            exp: 55,
            loot: [
                { item: "bone", chance: 35 },
                { item: "old_skull", chance: 14 },
                { item: "rusty_chain", chance: 10 },
                { item: "recipe_shadow_blade", chance: 1 }
            ]
        },
        {
            id: "kobold",
            name: "Kobold",
            hp: 240,
            attack: 25,
            gold: 38,
            exp: 70,
            loot: [
                { item: "kobold_ear", chance: 30 },
                { item: "kobold_pickaxe", chance: 12 },
                { item: "cave_crystal", chance: 8 },
                { item: "recipe_cave_sword", chance: 0.8 },
                { item: "recipe_shadow_blade", chance: 1 }
            ]
        },
        {
            id: "stone_golem",
            name: "Kamienny golem",
            hp: 340,
            attack: 30,
            gold: 55,
            exp: 95,
            loot: [
                { item: "stone_core", chance: 28 },
                { item: "heavy_rock", chance: 35 },
                { item: "cave_crystal", chance: 12 },
                { item: "recipe_cave_sword", chance: 1 },
                { item: "recipe_shadow_blade", chance: 1 }
            ]
        }
    ]
};