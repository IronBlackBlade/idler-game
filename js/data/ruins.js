const ruins = {
    id: "ruins",

    name:
        "🏛️ Zapomniane Ruiny",

    description:
        "Pozostałości pradawnej twierdzy, strzeżone przez ożywione zbroje i niespokojne duchy.",

    recommendedLevel: 20,
    requiredLevel: 20,

    boss: {
        id: "ancient_guardian",

        name:
            "👑 Pradawny Strażnik",

        hp: 4800,
        attack: 75,

        gold: 650,
        exp: 1050,

        firstKillReward: {
            gold: 900,
            exp: 1400,

            items: [
                {
                    item:
                        "guardian_emblem",

                    quantity: 1
                }
            ]
        },

        loot: [
            {
                item:
                    "guardian_emblem",

                chance: 55
            },
            {
                item:
                    "guardian_core",

                chance: 50
            },
            {
                item:
                    "spectral_essence",

                chance: 40
            }
        ]
    },

    enemies: [
        {
            id: "ruins_scarab",
            name: "Skarabeusz ruin",

            hp: 420,
            attack: 34,

            gold: 65,
            exp: 110,

            loot: [
                {
                    item:
                        "ancient_chitin",

                    chance: 35
                },
                {
                    item:
                        "ancient_rune_fragment",

                    chance: 12
                },
                {
                    item:
                        "spectral_essence",

                    chance: 4
                }
            ]
        },

        {
            id: "ruin_scavenger",
            name: "Zbieracz z ruin",

            hp: 520,
            attack: 38,

            gold: 78,
            exp: 135,

            loot: [
                {
                    item:
                        "torn_guardian_cloth",

                    chance: 35
                },
                {
                    item:
                        "rusted_guardian_plate",

                    chance: 18
                },
                {
                    item:
                        "old_coin",

                    chance: 12
                }
            ]
        },

        {
            id: "animated_armor",
            name: "Ożywiona zbroja",

            hp: 650,
            attack: 43,

            gold: 100,
            exp: 165,

            loot: [
                {
                    item:
                        "rusted_guardian_plate",

                    chance: 32
                },
                {
                    item:
                        "ancient_rune_fragment",

                    chance: 16
                },
                {
                    item:
                        "spectral_essence",

                    chance: 8
                }
            ]
        },

        {
            id: "ruin_sentinel",
            name: "Strażnik ruin",

            hp: 820,
            attack: 49,

            gold: 130,
            exp: 210,

            loot: [
                {
                    item:
                        "rusted_guardian_plate",

                    chance: 28
                },
                {
                    item:
                        "guardian_core",

                    chance: 15
                },
                {
                    item:
                        "ancient_rune_fragment",

                    chance: 14
                }
            ]
        },

        {
            id: "spectral_knight",
            name: "Widmowy rycerz",

            hp: 1050,
            attack: 56,

            gold: 170,
            exp: 270,

            loot: [
                {
                    item:
                        "spectral_essence",

                    chance: 30
                },
                {
                    item:
                        "guardian_core",

                    chance: 12
                },
                {
                    item:
                        "ancient_rune_fragment",

                    chance: 20
                }
            ]
        }
    ]
};