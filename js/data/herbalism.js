const herbalismAreas = [
    {
        id: "forest_clearing",
        name: "Leśna polana",
        description:
            "Spokojna polana pełna podstawowych ziół leczniczych.",

        requiredHerbalismLevel: 1,
        durationSeconds: 12,

        rareChance: 18,
        exceptionalChance: 2,

        basicDrops: [
            {
                itemId: "mint_leaf",
                weight: 40,
                herbalismExp: 3
            },
            {
                itemId: "chamomile",
                weight: 35,
                herbalismExp: 4
            },
            {
                itemId: "nettle",
                weight: 25,
                herbalismExp: 5
            }
        ],

        rareDrops: [
            {
                itemId: "blood_flower",
                weight: 55,
                herbalismExp: 12
            },
            {
                itemId: "silver_leaf",
                weight: 45,
                herbalismExp: 15
            }
        ],

        exceptionalDrops: [
            {
                itemId: "nymph_tear",
                weight: 100,
                herbalismExp: 50
            }
        ]
    },

    {
        id: "wetlands",
        name: "Wilgotne mokradła",
        description:
            "Bagienne tereny pełne grzybów, mchów i toksycznych roślin.",

        requiredHerbalismLevel: 5,
        durationSeconds: 15,

        rareChance: 16,
        exceptionalChance: 1.8,

        basicDrops: [
            {
                itemId: "swamp_moss",
                weight: 35,
                herbalismExp: 5
            },
            {
                itemId: "red_mushroom",
                weight: 35,
                herbalismExp: 6
            },
            {
                itemId: "calamus_root",
                weight: 30,
                herbalismExp: 7
            }
        ],

        rareDrops: [
            {
                itemId: "poison_cap",
                weight: 55,
                herbalismExp: 18
            },
            {
                itemId: "marsh_flower",
                weight: 45,
                herbalismExp: 22
            }
        ],

        exceptionalDrops: [
            {
                itemId: "swamp_heart",
                weight: 100,
                herbalismExp: 65
            }
        ]
    },

    {
        id: "mountain_slope",
        name: "Górskie zbocze",
        description:
            "Chłodne i wietrzne zbocze, na którym rosną odporne zioła.",

        requiredHerbalismLevel: 10,
        durationSeconds: 18,

        rareChance: 14,
        exceptionalChance: 1.5,

        basicDrops: [
            {
                itemId: "mountain_sage",
                weight: 35,
                herbalismExp: 8
            },
            {
                itemId: "frostbloom",
                weight: 35,
                herbalismExp: 9
            },
            {
                itemId: "stone_root",
                weight: 30,
                herbalismExp: 10
            }
        ],

        rareDrops: [
            {
                itemId: "blue_saffron",
                weight: 55,
                herbalismExp: 25
            },
            {
                itemId: "wind_flower",
                weight: 45,
                herbalismExp: 30
            }
        ],

        exceptionalDrops: [
            {
                itemId: "crystal_orchid",
                weight: 100,
                herbalismExp: 80
            }
        ]
    },

    {
        id: "ancient_grove",
        name: "Pradawny gaj",
        description:
            "Magiczne miejsce porośnięte roślinami pamiętającymi dawne czasy.",

        requiredHerbalismLevel: 15,
        durationSeconds: 21,

        rareChance: 12,
        exceptionalChance: 1.2,

        basicDrops: [
            {
                itemId: "ancient_bark",
                weight: 35,
                herbalismExp: 11
            },
            {
                itemId: "glowing_moss",
                weight: 35,
                herbalismExp: 13
            },
            {
                itemId: "moon_leaf",
                weight: 30,
                herbalismExp: 15
            }
        ],

        rareDrops: [
            {
                itemId: "star_flower",
                weight: 55,
                herbalismExp: 35
            },
            {
                itemId: "mandrake_root",
                weight: 45,
                herbalismExp: 40
            }
        ],

        exceptionalDrops: [
            {
                itemId: "ancient_tree_seed",
                weight: 100,
                herbalismExp: 100
            }
        ]
    },

    {
        id: "corrupted_wasteland",
        name: "Skażone pustkowie",
        description:
            "Niebezpieczna kraina pełna toksycznych i magicznie wypaczonych roślin.",

        requiredHerbalismLevel: 20,
        durationSeconds: 27,

        rareChance: 10,
        exceptionalChance: 1,

        basicDrops: [
            {
                itemId: "corrupted_thorn",
                weight: 35,
                herbalismExp: 16
            },
            {
                itemId: "ash_flower",
                weight: 35,
                herbalismExp: 18
            },
            {
                itemId: "toxic_root",
                weight: 30,
                herbalismExp: 20
            }
        ],

        rareDrops: [
            {
                itemId: "shadow_fern",
                weight: 55,
                herbalismExp: 50
            },
            {
                itemId: "void_spore",
                weight: 45,
                herbalismExp: 60
            }
        ],

        exceptionalDrops: [
            {
                itemId: "corruption_essence",
                weight: 100,
                herbalismExp: 150
            }
        ]
    },

    {
        id: "twilight_garden",
        name: "Ogród zmierzchu",
        description:
            "Ukryty ogród rozkwitający pomiędzy dniem a nocą, pełen roślin reagujących na sny i magię księżyca.",

        requiredHerbalismLevel: 35,
        durationSeconds: 32,

        rareChance: 9,
        exceptionalChance: 0.8,

        basicDrops: [
            {
                itemId: "dusk_leaf",
                weight: 40,
                herbalismExp: 22
            },
            {
                itemId: "dream_moss",
                weight: 35,
                herbalismExp: 24
            },
            {
                itemId: "silvervine",
                weight: 25,
                herbalismExp: 27
            }
        ],

        rareDrops: [
            {
                itemId: "spirit_bloom",
                weight: 55,
                herbalismExp: 65
            },
            {
                itemId: "witch_root",
                weight: 45,
                herbalismExp: 75
            }
        ],

        exceptionalDrops: [
            {
                itemId: "lunar_essence",
                weight: 100,
                herbalismExp: 180
            }
        ]
    },

    {
        id: "aether_sanctuary",
        name: "Eteryczne sanktuarium",
        description:
            "Sanktuarium poza zwykłym rytmem natury, gdzie pradawne rośliny czerpią siłę z eteru i czasu.",

        requiredHerbalismLevel: 50,
        durationSeconds: 38,

        rareChance: 8,
        exceptionalChance: 0.6,

        basicDrops: [
            {
                itemId: "aether_petals",
                weight: 40,
                herbalismExp: 32
            },
            {
                itemId: "phoenix_herb",
                weight: 35,
                herbalismExp: 35
            },
            {
                itemId: "worldroot_sprout",
                weight: 25,
                herbalismExp: 38
            }
        ],

        rareDrops: [
            {
                itemId: "celestial_lotus",
                weight: 55,
                herbalismExp: 90
            },
            {
                itemId: "time_bloom",
                weight: 45,
                herbalismExp: 105
            }
        ],

        exceptionalDrops: [
            {
                itemId: "life_essence",
                weight: 100,
                herbalismExp: 250
            }
        ]
    }
];

function getHerbalismArea(areaId) {
    return (
        herbalismAreas.find(area => {
            return area.id === areaId;
        }) || null
    );
}
