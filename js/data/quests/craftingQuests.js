const craftingQuests = [
    {
        id: "crafting_total_1",

        chainStage: 1,
        chainLength: 4,

        title: "Pierwsze dzieło",
        description:
            "Ukończ 10 cykli craftingu.",

        targetEnemyName:
            "Ukończone wytworzenia",

        activityId: "crafting",
        progressSource:
            "totalCrafted",

        requiredKills: 10,
        currentKills: 0,

        rewardGold: 150,
        rewardExp: 120,
        rewardActivityExp: 60,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix:
            "crafting_total",

        title:
            "Praca rzemieślnika",

        targetEnemyName:
            "Ukończone wytworzenia",

        activityId: "crafting",
        progressSource:
            "totalCrafted",

        requiredKills: [
            50,
            150,
            500
        ],

        descriptions: [
            "Ukończ łącznie 50 cykli craftingu.",
            "Ukończ łącznie 150 cykli craftingu.",
            "Ukończ łącznie 500 cykli craftingu."
        ],

        rewardGold: [
            500,
            1400,
            3500
        ],

        rewardExp: [
            350,
            850,
            1800
        ],

        rewardActivityExp: [
            175,
            425,
            900
        ]
    }),

    {
        id: "crafting_level_1",

        chainStage: 1,
        chainLength: 4,

        title:
            "Początkujący rzemieślnik",

        description:
            "Osiągnij 5 poziom craftingu.",

        targetEnemyName:
            "Poziom craftingu",

        activityId: "crafting",
        progressSource:
            "craftingLevel",

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
            "crafting_level",

        title:
            "Droga rzemieślnika",

        targetEnemyName:
            "Poziom craftingu",

        activityId: "crafting",
        progressSource:
            "craftingLevel",

        requiredKills: [
            10,
            15,
            20
        ],

        descriptions: [
            "Osiągnij 10 poziom craftingu.",
            "Osiągnij 15 poziom craftingu.",
            "Osiągnij 20 poziom craftingu."
        ],

        rewardGold: [
            900,
            2000,
            4500
        ],

        rewardExp: [
            550,
            1100,
            2400
        ],

        rewardActivityExp: [
            275,
            550,
            1100
        ]
    })
];