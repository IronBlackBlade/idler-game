const ice = {
    id: "ice",

    name: "❄️ Lodowa Kraina",

    description:
        "Skuta lodem kraina zamieszkana przez mroźne duchy, olbrzymy i żywiołaki.",

    recommendedLevel: 35,
    requiredLevel: 35,

    boss: {
        id: "frost_queen",
        name: "👑 Królowa Mrozu",

        hp: 20000,
        attack: 140,

        gold: 2500,
        exp: 3600,

        firstKillReward: {
            gold: 3500,
            exp: 5000,

            items: [
                {
                    item:
                        "frost_crown_fragment",

                    quantity: 1
                }
            ]
        },

        loot: [
            {
                item:
                    "frost_crown_fragment",

                chance: 55
            },
            {
                item:
                    "ice_elemental_core",

                chance: 50
            },
            {
                item:
                    "frost_essence",

                chance: 45
            }
        ]
    },

    enemies: [
        {
            id: "frost_wisp",
            name: "Mroźny ognik",

            hp: 1500,
            attack: 62,

            gold: 220,
            exp: 340,

            loot: [
                {
                    item:
                        "frost_essence",

                    chance: 38
                },
                {
                    item:
                        "ice_elemental_core",

                    chance: 3
                }
            ]
        },

        {
            id: "ice_wolf",
            name: "Lodowy wilk",

            hp: 1900,
            attack: 70,

            gold: 280,
            exp: 430,

            loot: [
                {
                    item:
                        "ice_wolf_fur",

                    chance: 35
                },
                {
                    item:
                        "frost_essence",

                    chance: 12
                }
            ]
        },

        {
            id: "frozen_warrior",
            name: "Zamarznięty wojownik",

            hp: 2400,
            attack: 78,

            gold: 360,
            exp: 540,

            loot: [
                {
                    item:
                        "frozen_bone",

                    chance: 34
                },
                {
                    item:
                        "frozen_chain",

                    chance: 18
                },
                {
                    item:
                        "frost_essence",

                    chance: 8
                }
            ]
        },

        {
            id: "frost_giant",
            name: "Lodowy olbrzym",

            hp: 3100,
            attack: 88,

            gold: 470,
            exp: 690,

            loot: [
                {
                    item:
                        "frost_giant_shard",

                    chance: 32
                },
                {
                    item:
                        "frozen_chain",

                    chance: 14
                },
                {
                    item:
                        "ice_elemental_core",

                    chance: 6
                }
            ]
        },

        {
            id: "ice_elemental",
            name: "Żywiołak lodu",

            hp: 4000,
            attack: 100,

            gold: 620,
            exp: 900,

            loot: [
                {
                    item:
                        "ice_elemental_core",

                    chance: 25
                },
                {
                    item:
                        "frost_essence",

                    chance: 30
                },
                {
                    item:
                        "frost_giant_shard",

                    chance: 12
                }
            ]
        }
    ]
};