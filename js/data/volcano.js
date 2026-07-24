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

        hp: 65000,
        attack: 230,

        gold: 8000,
        exp: 11000,

        firstKillReward: {
            gold: 11000,
            exp: 15000,

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

            hp: 4800,
            attack: 110,

            gold: 760,
            exp: 1050,

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

            hp: 6000,
            attack: 122,

            gold: 950,
            exp: 1300,

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

            hp: 7600,
            attack: 135,

            gold: 1200,
            exp: 1650,

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

            hp: 9800,
            attack: 150,

            gold: 1550,
            exp: 2100,

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

            hp: 12500,
            attack: 168,

            gold: 2000,
            exp: 2700,

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