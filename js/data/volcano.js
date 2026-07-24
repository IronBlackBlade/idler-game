const volcano = {
    id: "volcano",

    name: "🌋 Wulkaniczne Pustkowie",

    description:
        "Spalona kraina pełna lawy, ognistych bestii i rozgrzanych żywiołaków.",

    recommendedLevel: 50,
    requiredLevel: 50,

    boss: {
        id: "volcanic_dragon",
        name: "🐉 Pradawny Smok Wulkanu",

        hp: 75000,
        attack: 240,

        gold: 9000,
        exp: 13000,
        firstKillReward: {
            gold: 12000,
            exp: 18000,

            items: [
                {
                    item:
                        "volcanic_heart_fragment",

                    quantity: 1
                }
            ]
        },

        loot: [
            {
                item:
                    "volcanic_heart_fragment",

                chance: 55
            },
            {
                item:
                    "magma_core",

                chance: 50
            },
            {
                item:
                    "obsidian_shard",

                chance: 40
            }
        ]
    },

    enemies: [
        {
            id: "ash_scorpion",
            name: "Popielny skorpion",

            hp: 8500,
            attack: 140,

            gold: 1300,
            exp: 1850,

            loot: [
                {
                    item:
                        "ember_essence",

                    chance: 36
                },
                {
                    item:
                        "obsidian_shard",

                    chance: 10
                }
            ]
        },

        {
            id: "lava_hound",
            name: "Ogar lawy",

            hp: 10500,
            attack: 152,

            gold: 1650,
            exp: 2350,

            loot: [
                {
                    item:
                        "lava_hound_hide",

                    chance: 35
                },
                {
                    item:
                        "ember_essence",

                    chance: 15
                }
            ]
        },

        {
            id: "charred_skeleton",
            name: "Zwęglony szkielet",

            hp: 13000,
            attack: 165,

            gold: 2100,
            exp: 3000,

            loot: [
                {
                    item:
                        "charred_bone",

                    chance: 34
                },
                {
                    item:
                        "obsidian_shard",

                    chance: 18
                },
                {
                    item:
                        "ember_essence",

                    chance: 8
                }
            ]
        },

        {
            id: "magma_golem",
            name: "Magmowy golem",

            hp: 16500,
            attack: 180,

            gold: 2750,
            exp: 3900,

            loot: [
                {
                    item:
                        "magma_golem_plate",

                    chance: 32
                },
                {
                    item:
                        "obsidian_shard",

                    chance: 16
                },
                {
                    item:
                        "magma_core",

                    chance: 6
                }
            ]
        },

        {
            id: "fire_elemental",
            name: "Żywiołak ognia",

            hp: 21000,
            attack: 198,

            gold: 3600,
            exp: 5100,

            loot: [
                {
                    item:
                        "magma_core",

                    chance: 25
                },
                {
                    item:
                        "ember_essence",

                    chance: 30
                },
                {
                    item:
                        "magma_golem_plate",

                    chance: 12
                }
            ]
        }
    ]
};