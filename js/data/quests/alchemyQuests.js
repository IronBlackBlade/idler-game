const alchemyQuests = [
    {
        id: "alchemy_brewing_1",

        chainStage: 1,
        chainLength: 4,

        title: "Pierwsze wywary",
        description:
            "Uwarz 5 mikstur.",

        targetEnemyName:
            "Uwarzone mikstury",

        activityId: "alchemy",
        progressSource:
            "totalCrafted",

        requiredKills: 5,
        currentKills: 0,

        rewardGold: 100,
        rewardExp: 100,
        rewardActivityExp: 50,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "alchemy_brewing",

        title:
            "Sztuka warzenia",

        targetEnemyName:
            "Uwarzone mikstury",

        activityId: "alchemy",
        progressSource:
            "totalCrafted",

        requiredKills: [
            25,
            75,
            200
        ],

        descriptions: [
            "Uwarz łącznie 25 mikstur.",
            "Uwarz łącznie 75 mikstur.",
            "Uwarz łącznie 200 mikstur."
        ],

        rewardGold: [
            400,
            1000,
            2500
        ],

        rewardExp: [
            300,
            700,
            1500
        ],

        rewardActivityExp: [
            150,
            350,
            800
        ]
    }),

    {
        id: "alchemy_level_1",

        chainStage: 1,
        chainLength: 4,

        title:
            "Początkujący alchemik",

        description:
            "Osiągnij 5 poziom alchemii.",

        targetEnemyName:
            "Poziom alchemii",

        activityId: "alchemy",
        progressSource:
            "alchemyLevel",

        requiredKills: 5,
        currentKills: 0,

        rewardGold: 300,
        rewardExp: 200,
        rewardActivityExp: 100,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "alchemy_level",

        title:
            "Droga alchemika",

        targetEnemyName:
            "Poziom alchemii",

        activityId: "alchemy",
        progressSource:
            "alchemyLevel",

        requiredKills: [
            10,
            15,
            20
        ],

        descriptions: [
            "Osiągnij 10 poziom alchemii.",
            "Osiągnij 15 poziom alchemii.",
            "Osiągnij 20 poziom alchemii."
        ],

        rewardGold: [
            800,
            1800,
            4000
        ],

        rewardExp: [
            500,
            1000,
            2200
        ],

        rewardActivityExp: [
            250,
            500,
            1000
        ]
    })
];