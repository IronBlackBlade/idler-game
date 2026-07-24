const cave = {
    id: "cave",
    name: "⛰️ Jaskinia",
    description: "Ciemna jaskinia pełna niebezpiecznych stworzeń.",
    recommendedLevel: 10,
    requiredLevel: 10,

    boss: {
        id: "kobold_king",
        name: "👑 Król Koboldów",
hp: 2600,
attack: 52,
gold: 360,
exp: 560,
firstKillReward: {
    gold: 500,
    exp: 750,

            items: [
                {
                    item:
                        "kobold_crown_fragment",

                    quantity: 1
                }
            ]
        },
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
hp: 180,
attack: 15,
gold: 22,
exp: 36,
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
hp: 230,
attack: 18,
gold: 28,
exp: 46,
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
hp: 300,
attack: 23,
gold: 36,
exp: 62,
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
hp: 410,
attack: 28,
gold: 48,
exp: 82,
            loot: [
                { item: "kobold_ear", chance: 30 },
                { item: "kobold_pickaxe", chance: 12 },
                { item: "cave_crystal", chance: 8 },
                { item: "recipe_shadow_blade", chance: 1 }
            ]
        },
        {
            id: "stone_golem",
            name: "Kamienny golem",
hp: 560,
attack: 34,
gold: 70,
exp: 118,
            loot: [
                { item: "stone_core", chance: 28 },
                { item: "heavy_rock", chance: 35 },
                { item: "cave_crystal", chance: 12 },
                { item: "recipe_shadow_blade", chance: 1 }
            ]
        }
    ]
};