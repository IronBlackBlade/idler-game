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

hp: 9000,
attack: 100,
gold: 1300,
exp: 2000,

firstKillReward: {
    gold: 1800,
    exp: 2800,
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

hp: 700,
attack: 37,

gold: 90,
exp: 145,

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

hp: 900,
attack: 43,

gold: 115,
exp: 185,

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

hp: 1150,
attack: 50,

gold: 150,
exp: 235,

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

hp: 1500,
attack: 58,

gold: 200,
exp: 310,

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

hp: 1900,
attack: 67,

gold: 270,
exp: 410,

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