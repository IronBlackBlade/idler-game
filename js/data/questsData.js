function createQuestFollowUpStages(
    config
) {
    const killRequirements =
        Array.isArray(
            config.requiredKills
        )
            ? config.requiredKills
            : [];

    const chainLength =
        killRequirements.length +
        1;

    return killRequirements.map(
        (
            requiredKills,
            index
        ) => {
            const stageNumber =
                index + 2;

            return {
                id:
                    config.idPrefix +
                    "_" +
                    stageNumber,

                previousQuestId:
                    config.idPrefix +
                    "_" +
                    (
                        stageNumber -
                        1
                    ),

                chainStage:
                    stageNumber,

                chainLength:
                    chainLength,

                title:
                    config.title +
                    " — etap " +
                    stageNumber,

                description:
                    config.descriptions[
                    index
                    ],

                targetEnemyName:
                    config
                        .targetEnemyName,
                        
                        activityId:
    config.activityId ||
    null,

progressSource:
    config.progressSource ||
    null,

                requiredLevel:
                    Number(
                        config
                            .requiredLevel
                    ) || 1,

                requiredKills:
                    requiredKills,

                currentKills: 0,

                rewardGold:
                    Number(
                        config.rewardGold[
                        index
                        ]
                    ) || 0,

                rewardExp:
                    Number(
                        config.rewardExp[
                        index
                        ]
                    ) || 0,
rewardActivityExp:
    Number(
        config
            .rewardActivityExp
            ?.[index]
    ) || 0,
                completed: false,
                claimed: false
            };
        }
    );
}

const quests = [
    {
        id: "kill_beetles_1",
        chainStage: 1,
        chainLength: 4,
        title: "Pierwsze polowanie",
        description: "Pokonaj 5 chrząszczy.",
        targetEnemyName: "Chrząszcz",
        requiredKills: 5,
        currentKills: 0,
        rewardGold: 20,
        rewardExp: 25,
        completed: false,
        claimed: false
    },

    {
        id: "kill_beetles_2",

        previousQuestId:
            "kill_beetles_1",

        chainStage: 2,
        chainLength: 4,

        title:
            "Chrząszcze: drugi etap",

        description:
            "Pokonaj 25 chrząszczy.",

        targetEnemyName:
            "Chrząszcz",

        requiredKills: 25,
        currentKills: 0,

        rewardGold: 80,
        rewardExp: 100,

        completed: false,
        claimed: false
    },
    {
        id: "kill_beetles_3",

        previousQuestId:
            "kill_beetles_2",

        chainStage: 3,
        chainLength: 4,

        title:
            "Chrząszcze: trzeci etap",

        description:
            "Pokonaj 50 chrząszczy.",

        targetEnemyName:
            "Chrząszcz",

        requiredKills: 50,
        currentKills: 0,

        rewardGold: 180,
        rewardExp: 220,

        completed: false,
        claimed: false
    },
    {
        id: "kill_beetles_4",

        previousQuestId:
            "kill_beetles_3",

        chainStage: 4,
        chainLength: 4,

        title:
            "Chrząszcze: ostatni etap",

        description:
            "Pokonaj 100 chrząszczy.",

        targetEnemyName:
            "Chrząszcz",

        requiredKills: 100,
        currentKills: 0,

        rewardGold: 450,
        rewardExp: 550,

        completed: false,
        claimed: false
    },

    {
        id: "kill_sheep_1",
        chainStage: 1,
        chainLength: 4,
        title: "Wełniany problem",
        description: "Pokonaj 5 owiec.",
        targetEnemyName: "Owca",
        requiredKills: 5,
        currentKills: 0,
        rewardGold: 25,
        rewardExp: 35,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_sheep",

        title:
            "Wełniany problem",

        targetEnemyName:
            "Owca",

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj 25 owiec.",
            "Pokonaj 50 owiec.",
            "Pokonaj 100 owiec."
        ],

        rewardGold: [
            100,
            220,
            500
        ],

        rewardExp: [
            130,
            280,
            650
        ]
    }),

    {
        id: "kill_rats_1",
        chainStage: 1,
        chainLength: 4,
        title: "Szczury w lesie",
        description: "Pokonaj 6 olbrzymich szczurów.",
        targetEnemyName: "Olbrzymi szczur",
        requiredKills: 6,
        currentKills: 0,
        rewardGold: 40,
        rewardExp: 55,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_rats",

        title:
            "Szczury w lesie",

        targetEnemyName:
            "Olbrzymi szczur",

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj 25 olbrzymich szczurów.",
            "Pokonaj 50 olbrzymich szczurów.",
            "Pokonaj 100 olbrzymich szczurów."
        ],

        rewardGold: [
            140,
            300,
            700
        ],

        rewardExp: [
            180,
            380,
            850
        ]
    }),

    {
        id: "kill_wolves_1",
        chainStage: 1,
        chainLength: 4,
        title: "Młode wilki",
        description: "Pokonaj 6 młodych wilków.",
        targetEnemyName: "Młody wilk",
        requiredKills: 6,
        currentKills: 0,
        rewardGold: 60,
        rewardExp: 80,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_wolves",

        title:
            "Młode wilki",

        targetEnemyName:
            "Młody wilk",

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj 25 młodych wilków.",
            "Pokonaj 50 młodych wilków.",
            "Pokonaj 100 młodych wilków."
        ],

        rewardGold: [
            190,
            420,
            950
        ],

        rewardExp: [
            250,
            540,
            1200
        ]
    }),

    {
        id: "kill_goblins_1",
        chainStage: 1,
        chainLength: 4,
        title: "Goblińskie kłopoty",
        description: "Pokonaj 8 goblinów.",
        targetEnemyName: "Goblin",
        requiredKills: 8,
        currentKills: 0,
        rewardGold: 100,
        rewardExp: 130,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_goblins",

        title:
            "Goblińskie kłopoty",

        targetEnemyName:
            "Goblin",

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj 25 goblinów.",
            "Pokonaj 50 goblinów.",
            "Pokonaj 100 goblinów."
        ],

        rewardGold: [
            300,
            700,
            1600
        ],

        rewardExp: [
            400,
            900,
            2000
        ]
    }),

    {
        id: "kill_forest_boss_1",
        chainStage: 1,
        chainLength: 3,
        title: "Władca lasu",
        description: "Pokonaj Gobliniego Herszta.",
        targetEnemyName: "👑 Goblini Herszt",
        requiredKills: 1,
        currentKills: 0,
        rewardGold: 250,
        rewardExp: 300,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_forest_boss",

        title:
            "Władca lasu",

        targetEnemyName:
            "👑 Goblini Herszt",

        requiredKills: [
            3,
            5
        ],

        descriptions: [
            "Pokonaj Gobliniego Herszta łącznie 3 razy.",
            "Pokonaj Gobliniego Herszta łącznie 5 razy."
        ],

        rewardGold: [
            800,
            1600
        ],

        rewardExp: [
            1000,
            2000
        ]
    }),

    {
        id: "kill_bats_1",
        chainStage: 1,
        chainLength: 4,
        title: "Cień pod sklepieniem",
        description: "Pokonaj 8 nietoperzy.",
        targetEnemyName: "Nietoperz",
        requiredKills: 8,
        requiredLevel: 10,
        currentKills: 0,
        rewardGold: 120,
        rewardExp: 180,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_bats",

        title:
            "Cień pod sklepieniem",

        targetEnemyName:
            "Nietoperz",

        requiredLevel: 10,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 nietoperzy.",
            "Pokonaj łącznie 50 nietoperzy.",
            "Pokonaj łącznie 100 nietoperzy."
        ],

        rewardGold: [
            400,
            900,
            2000
        ],

        rewardExp: [
            600,
            1300,
            2900
        ]
    }),

    {
        id: "kill_cave_spiders_1",
        chainStage: 1,
        chainLength: 4,
        title: "Pajęcza sieć",
        description: "Pokonaj 8 pająków jaskiniowych.",
        targetEnemyName: "Pająk jaskiniowy",
        requiredKills: 8,
        requiredLevel: 10,
        currentKills: 0,
        rewardGold: 150,
        rewardExp: 220,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_cave_spiders",

        title:
            "Pajęcza sieć",

        targetEnemyName:
            "Pająk jaskiniowy",

        requiredLevel: 10,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 pająków jaskiniowych.",
            "Pokonaj łącznie 50 pająków jaskiniowych.",
            "Pokonaj łącznie 100 pająków jaskiniowych."
        ],

        rewardGold: [
            500,
            1100,
            2500
        ],

        rewardExp: [
            700,
            1550,
            3400
        ]
    }),

    {
        id: "kill_skeletons_1",
        chainStage: 1,
        chainLength: 4,
        title: "Kości nie kłamią",
        description: "Pokonaj 10 szkieletów.",
        targetEnemyName: "Szkielet",
        requiredKills: 10,
        requiredLevel: 10,
        currentKills: 0,
        rewardGold: 200,
        rewardExp: 300,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_skeletons",

        title:
            "Kości nie kłamią",

        targetEnemyName:
            "Szkielet",

        requiredLevel: 10,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 szkieletów.",
            "Pokonaj łącznie 50 szkieletów.",
            "Pokonaj łącznie 100 szkieletów."
        ],

        rewardGold: [
            650,
            1450,
            3200
        ],

        rewardExp: [
            950,
            2100,
            4600
        ]
    }),

    {
        id: "kill_kobolds_1",
        chainStage: 1,
        chainLength: 4,
        title: "Problem z koboldami",
        description: "Pokonaj 10 koboldów.",
        targetEnemyName: "Kobold",
        requiredKills: 10,
        requiredLevel: 10,
        currentKills: 0,
        rewardGold: 260,
        rewardExp: 380,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_kobolds",

        title:
            "Problem z koboldami",

        targetEnemyName:
            "Kobold",

        requiredLevel: 10,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 koboldów.",
            "Pokonaj łącznie 50 koboldów.",
            "Pokonaj łącznie 100 koboldów."
        ],

        rewardGold: [
            800,
            1800,
            4000
        ],

        rewardExp: [
            1200,
            2600,
            5800
        ]
    }),

    {
        id: "kill_stone_golems_1",
        chainStage: 1,
        chainLength: 4,
        title: "Kamienne zagrożenie",
        description: "Pokonaj 6 kamiennych golemów.",
        targetEnemyName: "Kamienny golem",
        requiredKills: 6,
        requiredLevel: 10,
        currentKills: 0,
        rewardGold: 320,
        rewardExp: 480,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_stone_golems",

        title:
            "Kamienne zagrożenie",

        targetEnemyName:
            "Kamienny golem",

        requiredLevel: 10,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 kamiennych golemów.",
            "Pokonaj łącznie 50 kamiennych golemów.",
            "Pokonaj łącznie 100 kamiennych golemów."
        ],

        rewardGold: [
            1000,
            2300,
            5200
        ],

        rewardExp: [
            1500,
            3400,
            7500
        ]
    }),

    {
        id: "kill_cave_boss_1",
        chainStage: 1,
        chainLength: 3,
        title: "Król pod ziemią",
        description: "Pokonaj Króla Koboldów.",
        targetEnemyName: "👑 Król Koboldów",
        requiredKills: 1,
        requiredLevel: 10,
        currentKills: 0,
        rewardGold: 700,
        rewardExp: 900,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_cave_boss",

        title:
            "Król pod ziemią",

        targetEnemyName:
            "👑 Król Koboldów",

        requiredLevel: 10,

        requiredKills: [
            3,
            5
        ],

        descriptions: [
            "Pokonaj Króla Koboldów łącznie 3 razy.",
            "Pokonaj Króla Koboldów łącznie 5 razy."
        ],

        rewardGold: [
            2500,
            5500
        ],

        rewardExp: [
            3200,
            7000
        ]
    }),

    /* ========================================
   ZADANIA — ZAPOMNIANE RUINY
======================================== */

    {
        id: "kill_ruins_scarabs_1",
        chainStage: 1,
        chainLength: 4,
        title: "Chitynowa plaga",
        description:
            "Pokonaj 10 skarabeuszy ruin.",

        targetEnemyName:
            "Skarabeusz ruin",

        requiredLevel: 20,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 450,
        rewardExp: 700,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_ruins_scarabs",

        title:
            "Chitynowa plaga",

        targetEnemyName:
            "Skarabeusz ruin",

        requiredLevel: 20,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 skarabeuszy ruin.",
            "Pokonaj łącznie 50 skarabeuszy ruin.",
            "Pokonaj łącznie 100 skarabeuszy ruin."
        ],

        rewardGold: [
            1400,
            3200,
            7200
        ],

        rewardExp: [
            2100,
            4700,
            10500
        ]
    }),

    {
        id: "kill_ruin_scavengers_1",
        chainStage: 1,
        chainLength: 4,
        title: "Złodzieje przeszłości",
        description:
            "Pokonaj 10 zbieraczy z ruin.",

        targetEnemyName:
            "Zbieracz z ruin",

        requiredLevel: 20,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 575,
        rewardExp: 925,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_ruin_scavengers",

        title:
            "Złodzieje przeszłości",

        targetEnemyName:
            "Zbieracz z ruin",

        requiredLevel: 20,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 zbieraczy z ruin.",
            "Pokonaj łącznie 50 zbieraczy z ruin.",
            "Pokonaj łącznie 100 zbieraczy z ruin."
        ],

        rewardGold: [
            1800,
            4100,
            9200
        ],

        rewardExp: [
            2800,
            6300,
            14000
        ]
    }),

    {
        id: "kill_animated_armor_1",
        chainStage: 1,
        chainLength: 4,
        title: "Puste pancerze",
        description:
            "Pokonaj 10 ożywionych zbroi.",

        targetEnemyName:
            "Ożywiona zbroja",

        requiredLevel: 20,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 750,
        rewardExp: 1175,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_animated_armor",

        title:
            "Puste pancerze",

        targetEnemyName:
            "Ożywiona zbroja",

        requiredLevel: 20,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 ożywionych zbroi.",
            "Pokonaj łącznie 50 ożywionych zbroi.",
            "Pokonaj łącznie 100 ożywionych zbroi."
        ],

        rewardGold: [
            2300,
            5300,
            12000
        ],

        rewardExp: [
            3600,
            8200,
            18500
        ]
    }),

    {
        id: "kill_ruin_sentinels_1",
        chainStage: 1,
        chainLength: 4,
        title: "Strażnicy bez pana",
        description:
            "Pokonaj 8 strażników ruin.",

        targetEnemyName:
            "Strażnik ruin",

        requiredLevel: 20,
        requiredKills: 8,
        currentKills: 0,

        rewardGold: 800,
        rewardExp: 1240,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_ruin_sentinels",

        title:
            "Strażnicy bez pana",

        targetEnemyName:
            "Strażnik ruin",

        requiredLevel: 20,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 strażników ruin.",
            "Pokonaj łącznie 50 strażników ruin.",
            "Pokonaj łącznie 100 strażników ruin."
        ],

        rewardGold: [
            2600,
            5900,
            13500
        ],

        rewardExp: [
            4000,
            9000,
            20500
        ]
    }),

    {
        id: "kill_spectral_knights_1",
        chainStage: 1,
        chainLength: 4,
        title: "Rycerze zza grobu",
        description:
            "Pokonaj 8 widmowych rycerzy.",

        targetEnemyName:
            "Widmowy rycerz",

        requiredLevel: 20,
        requiredKills: 8,
        currentKills: 0,

        rewardGold: 1080,
        rewardExp: 1640,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_spectral_knights",

        title:
            "Rycerze zza grobu",

        targetEnemyName:
            "Widmowy rycerz",

        requiredLevel: 20,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 widmowych rycerzy.",
            "Pokonaj łącznie 50 widmowych rycerzy.",
            "Pokonaj łącznie 100 widmowych rycerzy."
        ],

        rewardGold: [
            3400,
            7800,
            17500
        ],

        rewardExp: [
            5100,
            11600,
            26000
        ]
    }),

    {
        id: "kill_ruins_boss_1",
        chainStage: 1,
        chainLength: 3,
        title: "Serce ruin",
        description:
            "Pokonaj Pradawnego Strażnika.",

        targetEnemyName:
            "👑 Pradawny Strażnik",

        requiredLevel: 20,
        requiredKills: 1,
        currentKills: 0,

        rewardGold: 2600,
        rewardExp: 4000,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_ruins_boss",

        title:
            "Serce ruin",

        targetEnemyName:
            "👑 Pradawny Strażnik",

        requiredLevel: 20,

        requiredKills: [
            3,
            5
        ],

        descriptions: [
            "Pokonaj Pradawnego Strażnika łącznie 3 razy.",
            "Pokonaj Pradawnego Strażnika łącznie 5 razy."
        ],

        rewardGold: [
            8500,
            19000
        ],

        rewardExp: [
            13000,
            29000
        ]
    }),

    /* ========================================
       ZADANIA — LODOWA KRAINA
    ======================================== */

    {
        id: "kill_frost_wisps_1",
        chainStage: 1,
        chainLength: 4,
        title: "Zgaszone ogniki",
        description:
            "Pokonaj 10 mroźnych ogników.",

        targetEnemyName:
            "Mroźny ognik",

        requiredLevel: 35,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 1750,
        rewardExp: 2600,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_frost_wisps",

        title:
            "Zgaszone ogniki",

        targetEnemyName:
            "Mroźny ognik",

        requiredLevel: 35,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 mroźnych ogników.",
            "Pokonaj łącznie 50 mroźnych ogników.",
            "Pokonaj łącznie 100 mroźnych ogników."
        ],

        rewardGold: [
            5400,
            12200,
            27500
        ],

        rewardExp: [
            8000,
            18000,
            40500
        ]
    }),

    {
        id: "kill_ice_wolves_1",
        chainStage: 1,
        chainLength: 4,
        title: "Wilki wiecznej zimy",
        description:
            "Pokonaj 10 lodowych wilków.",

        targetEnemyName:
            "Lodowy wilk",

        requiredLevel: 35,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 2150,
        rewardExp: 3250,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_ice_wolves",

        title:
            "Wilki wiecznej zimy",

        targetEnemyName:
            "Lodowy wilk",

        requiredLevel: 35,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 lodowych wilków.",
            "Pokonaj łącznie 50 lodowych wilków.",
            "Pokonaj łącznie 100 lodowych wilków."
        ],

        rewardGold: [
            6700,
            15200,
            34200
        ],

        rewardExp: [
            10000,
            22600,
            50800
        ]
    }),

    {
        id: "kill_frozen_warriors_1",
        chainStage: 1,
        chainLength: 4,
        title: "Armia pod lodem",
        description:
            "Pokonaj 10 zamarzniętych wojowników.",

        targetEnemyName:
            "Zamarznięty wojownik",

        requiredLevel: 35,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 2750,
        rewardExp: 4100,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_frozen_warriors",

        title:
            "Armia pod lodem",

        targetEnemyName:
            "Zamarznięty wojownik",

        requiredLevel: 35,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 zamarzniętych wojowników.",
            "Pokonaj łącznie 50 zamarzniętych wojowników.",
            "Pokonaj łącznie 100 zamarzniętych wojowników."
        ],

        rewardGold: [
            8500,
            19300,
            43500
        ],

        rewardExp: [
            12700,
            28700,
            64500
        ]
    }),

    {
        id: "kill_frost_giants_1",
        chainStage: 1,
        chainLength: 4,
        title: "Olbrzymy północy",
        description:
            "Pokonaj 8 lodowych olbrzymów.",

        targetEnemyName:
            "Lodowy olbrzym",

        requiredLevel: 35,
        requiredKills: 8,
        currentKills: 0,

        rewardGold: 2880,
        rewardExp: 4200,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_frost_giants",

        title:
            "Olbrzymy północy",

        targetEnemyName:
            "Lodowy olbrzym",

        requiredLevel: 35,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 lodowych olbrzymów.",
            "Pokonaj łącznie 50 lodowych olbrzymów.",
            "Pokonaj łącznie 100 lodowych olbrzymów."
        ],

        rewardGold: [
            9200,
            20800,
            46800
        ],

        rewardExp: [
            13500,
            30400,
            68500
        ]
    }),

    {
        id: "kill_ice_elementals_1",
        chainStage: 1,
        chainLength: 4,
        title: "Serce lodu",
        description:
            "Pokonaj 8 żywiołaków lodu.",

        targetEnemyName:
            "Żywiołak lodu",

        requiredLevel: 35,
        requiredKills: 8,
        currentKills: 0,

        rewardGold: 3800,
        rewardExp: 5520,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_ice_elementals",

        title:
            "Serce lodu",

        targetEnemyName:
            "Żywiołak lodu",

        requiredLevel: 35,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 żywiołaków lodu.",
            "Pokonaj łącznie 50 żywiołaków lodu.",
            "Pokonaj łącznie 100 żywiołaków lodu."
        ],

        rewardGold: [
            12000,
            27000,
            61000
        ],

        rewardExp: [
            17500,
            39500,
            89000
        ]
    }),

    {
        id: "kill_frost_queen_1",
        chainStage: 1,
        chainLength: 3,
        title: "Upadek królowej",
        description:
            "Pokonaj Królową Mrozu.",

        targetEnemyName:
            "👑 Królowa Mrozu",

        requiredLevel: 35,
        requiredKills: 1,
        currentKills: 0,

        rewardGold: 8000,
        rewardExp: 11500,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_frost_queen",

        title:
            "Upadek królowej",

        targetEnemyName:
            "👑 Królowa Mrozu",

        requiredLevel: 35,

        requiredKills: [
            3,
            5
        ],

        descriptions: [
            "Pokonaj Królową Mrozu łącznie 3 razy.",
            "Pokonaj Królową Mrozu łącznie 5 razy."
        ],

        rewardGold: [
            26000,
            58000
        ],

        rewardExp: [
            38000,
            85000
        ]
    }),

    /* ========================================
       ZADANIA — WULKANICZNE PUSTKOWIE
    ======================================== */

    {
        id: "kill_ash_scorpions_1",
        chainStage: 1,
        chainLength: 4,
        title: "Pełzające w popiele",
        description:
            "Pokonaj 10 popielnych skorpionów.",

        targetEnemyName:
            "Popielny skorpion",

        requiredLevel: 50,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 6500,
        rewardExp: 9250,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_ash_scorpions",

        title:
            "Pełzające w popiele",

        targetEnemyName:
            "Popielny skorpion",

        requiredLevel: 50,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 popielnych skorpionów.",
            "Pokonaj łącznie 50 popielnych skorpionów.",
            "Pokonaj łącznie 100 popielnych skorpionów."
        ],

        rewardGold: [
            20000,
            45000,
            102000
        ],

        rewardExp: [
            28500,
            64500,
            145000
        ]
    }),

    {
        id: "kill_lava_hounds_1",
        chainStage: 1,
        chainLength: 4,
        title: "Ogary z głębin",
        description:
            "Pokonaj 10 ogarów lawy.",

        targetEnemyName:
            "Ogar lawy",

        requiredLevel: 50,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 8250,
        rewardExp: 11750,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_lava_hounds",

        title:
            "Ogary z głębin",

        targetEnemyName:
            "Ogar lawy",

        requiredLevel: 50,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 ogarów lawy.",
            "Pokonaj łącznie 50 ogarów lawy.",
            "Pokonaj łącznie 100 ogarów lawy."
        ],

        rewardGold: [
            25500,
            58000,
            131000
        ],

        rewardExp: [
            36500,
            82500,
            185000
        ]
    }),

    {
        id: "kill_charred_skeletons_1",
        chainStage: 1,
        chainLength: 4,
        title: "Kości w ogniu",
        description:
            "Pokonaj 10 zwęglonych szkieletów.",

        targetEnemyName:
            "Zwęglony szkielet",

        requiredLevel: 50,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 10500,
        rewardExp: 15000,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_charred_skeletons",

        title:
            "Kości w ogniu",

        targetEnemyName:
            "Zwęglony szkielet",

        requiredLevel: 50,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 zwęglonych szkieletów.",
            "Pokonaj łącznie 50 zwęglonych szkieletów.",
            "Pokonaj łącznie 100 zwęglonych szkieletów."
        ],

        rewardGold: [
            32500,
            74000,
            167000
        ],

        rewardExp: [
            46500,
            105000,
            236000
        ]
    }),

    {
        id: "kill_magma_golems_1",
        chainStage: 1,
        chainLength: 4,
        title: "Kamień i magma",
        description:
            "Pokonaj 8 magmowych golemów.",

        targetEnemyName:
            "Magmowy golem",

        requiredLevel: 50,
        requiredKills: 8,
        currentKills: 0,

        rewardGold: 11000,
        rewardExp: 15600,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_magma_golems",

        title:
            "Kamień i magma",

        targetEnemyName:
            "Magmowy golem",

        requiredLevel: 50,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 magmowych golemów.",
            "Pokonaj łącznie 50 magmowych golemów.",
            "Pokonaj łącznie 100 magmowych golemów."
        ],

        rewardGold: [
            35000,
            79000,
            178000
        ],

        rewardExp: [
            50000,
            112000,
            252000
        ]
    }),

    {
        id: "kill_fire_elementals_1",
        chainStage: 1,
        chainLength: 4,
        title: "Żywy płomień",
        description:
            "Pokonaj 8 żywiołaków ognia.",

        targetEnemyName:
            "Żywiołak ognia",

        requiredLevel: 50,
        requiredKills: 8,
        currentKills: 0,

        rewardGold: 14400,
        rewardExp: 20400,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_fire_elementals",

        title:
            "Żywy płomień",

        targetEnemyName:
            "Żywiołak ognia",

        requiredLevel: 50,

        requiredKills: [
            25,
            50,
            100
        ],

        descriptions: [
            "Pokonaj łącznie 25 żywiołaków ognia.",
            "Pokonaj łącznie 50 żywiołaków ognia.",
            "Pokonaj łącznie 100 żywiołaków ognia."
        ],

        rewardGold: [
            45000,
            102000,
            230000
        ],

        rewardExp: [
            64000,
            144000,
            324000
        ]
    }),

    {
        id: "kill_volcanic_dragon_1",
        chainStage: 1,
        chainLength: 3,
        title: "Ostatni lot smoka",
        description:
            "Pokonaj Pradawnego Smoka Wulkanu.",

        targetEnemyName:
            "🐉 Pradawny Smok Wulkanu",

        requiredLevel: 50,
        requiredKills: 1,
        currentKills: 0,

        rewardGold: 22000,
        rewardExp: 32000,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "kill_volcanic_dragon",

        title:
            "Ostatni lot smoka",

        targetEnemyName:
            "🐉 Pradawny Smok Wulkanu",

        requiredLevel: 50,

        requiredKills: [
            3,
            5
        ],

        descriptions: [
            "Pokonaj Pradawnego Smoka Wulkanu łącznie 3 razy.",
            "Pokonaj Pradawnego Smoka Wulkanu łącznie 5 razy."
        ],

        rewardGold: [
            72000,
            162000
        ],

        rewardExp: [
            105000,
            236000
        ]
    }),

    /* ========================================
   ZADANIA — KOPALNIA
======================================== */

{
    id:
        "mine_resources_1",

    activityId:
        "mining",

    progressSource:
        "totalResources",

    chainStage: 1,
    chainLength: 4,

    title:
        "Bogactwo spod ziemi",

    description:
        "Wydobądź łącznie 25 surowców.",

    requiredLevel: 1,
    requiredKills: 25,
    currentKills: 0,

rewardGold: 100,
rewardExp: 60,
rewardActivityExp: 75,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "mine_resources",

    activityId:
        "mining",

    progressSource:
        "totalResources",

    title:
        "Bogactwo spod ziemi",

    requiredLevel: 1,

    requiredKills: [
        100,
        250,
        500
    ],

    descriptions: [
        "Wydobądź łącznie 100 surowców.",
        "Wydobądź łącznie 250 surowców.",
        "Wydobądź łącznie 500 surowców."
    ],

    rewardGold: [
        500,
        1500,
        4000
    ],

rewardExp: [
    300,
    1000,
    2750
],

rewardActivityExp: [
    350,
    1100,
    3000
]

}),

{
    id:
        "mine_rare_resources_1",

    activityId:
        "mining",

    progressSource:
        "rareResources",

    chainStage: 1,
    chainLength: 4,

    title:
        "Rzadkie znaleziska",

    description:
        "Wydobądź pierwszy rzadki surowiec.",

    requiredLevel: 1,
    requiredKills: 1,
    currentKills: 0,

    rewardGold: 150,
    rewardExp: 100,
    rewardActivityExp: 100,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "mine_rare_resources",

    activityId:
        "mining",

    progressSource:
        "rareResources",

    title:
        "Rzadkie znaleziska",

    requiredLevel: 1,

    requiredKills: [
        5,
        15,
        30
    ],

    descriptions: [
        "Wydobądź łącznie 5 rzadkich surowców.",
        "Wydobądź łącznie 15 rzadkich surowców.",
        "Wydobądź łącznie 30 rzadkich surowców."
    ],

    rewardGold: [
        800,
        2500,
        6000
    ],

    rewardExp: [
        400,
        1200,
        3000
    ],

    rewardActivityExp: [
        450,
        1300,
        3500
    ]
}),

{
    id:
        "mine_exceptional_resources_1",

    activityId:
        "mining",

    progressSource:
        "exceptionalResources",

    chainStage: 1,
    chainLength: 4,

    title:
        "Skarby głębin",

    description:
        "Wydobądź pierwszy wyjątkowy surowiec.",

    requiredLevel: 1,
    requiredKills: 1,
    currentKills: 0,

    rewardGold: 500,
    rewardExp: 250,
    rewardActivityExp: 300,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "mine_exceptional_resources",

    activityId:
        "mining",

    progressSource:
        "exceptionalResources",

    title:
        "Skarby głębin",

    requiredLevel: 1,

    requiredKills: [
        3,
        10,
        20
    ],

    descriptions: [
        "Wydobądź łącznie 3 wyjątkowe surowce.",
        "Wydobądź łącznie 10 wyjątkowych surowców.",
        "Wydobądź łącznie 20 wyjątkowych surowców."
    ],

    rewardGold: [
        1800,
        6500,
        15000
    ],

    rewardExp: [
        900,
        3200,
        7500
    ],

    rewardActivityExp: [
        1000,
        3500,
        8500
    ]
}),

{
    id:
        "reach_mining_level_1",

    activityId:
        "mining",

    progressSource:
        "miningLevel",

    chainStage: 1,
    chainLength: 4,

    title:
        "Doświadczony górnik",

    description:
        "Osiągnij 5. poziom kopania.",

    requiredLevel: 1,
    requiredKills: 5,
    currentKills: 0,

    rewardGold: 600,
    rewardExp: 300,
    rewardActivityExp: 250,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "reach_mining_level",

    activityId:
        "mining",

    progressSource:
        "miningLevel",

    title:
        "Doświadczony górnik",

    requiredLevel: 1,

    requiredKills: [
        10,
        20,
        30
    ],

    descriptions: [
        "Osiągnij 10. poziom kopania.",
        "Osiągnij 20. poziom kopania.",
        "Osiągnij 30. poziom kopania."
    ],

    rewardGold: [
        2500,
        9000,
        22000
    ],

    rewardExp: [
        1200,
        4500,
        11000
    ],

    rewardActivityExp: [
        800,
        2500,
        6000
    ]
}),

/* ========================================
   ZADANIA — ZIELARSTWO
======================================== */

{
    id:
        "gather_ingredients_1",

    activityId:
        "herbalism",

    progressSource:
        "totalIngredients",

    chainStage: 1,
    chainLength: 4,

    title:
        "Kosz pełen ziół",

    description:
        "Zbierz łącznie 25 składników.",

    requiredLevel: 1,
    requiredKills: 25,
    currentKills: 0,

    rewardGold: 100,
    rewardExp: 60,
    rewardActivityExp: 75,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "gather_ingredients",

    activityId:
        "herbalism",

    progressSource:
        "totalIngredients",

    title:
        "Kosz pełen ziół",

    requiredLevel: 1,

    requiredKills: [
        100,
        250,
        500
    ],

    descriptions: [
        "Zbierz łącznie 100 składników.",
        "Zbierz łącznie 250 składników.",
        "Zbierz łącznie 500 składników."
    ],

    rewardGold: [
        450,
        1400,
        3800
    ],

    rewardExp: [
        275,
        900,
        2500
    ],

    rewardActivityExp: [
        350,
        1100,
        3000
    ]
})

];
