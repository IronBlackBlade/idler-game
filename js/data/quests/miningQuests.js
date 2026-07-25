const miningQuests = [
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


    {
        id: "explore_upper_shaft_1",
        activityId: "mining",
        progressSource: "areaCycles",
        targetAreaId: "upper_shaft",

        chainStage: 1,
        chainLength: 3,

        title: "Górnik Górnego szybu",
        description:
            "Ukończ 10 cykli wydobycia w Górnym szybie.",

        requiredLevel: 1,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 35,
        rewardExp: 25,
        rewardActivityExp: 30,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix: "explore_upper_shaft",
        activityId: "mining",
        progressSource: "areaCycles",
        targetAreaId: "upper_shaft",

        title: "Górnik Górnego szybu",
        requiredLevel: 1,

        requiredKills: [
            50,
            150
        ],

        descriptions: [
            "Ukończ łącznie 50 cykli wydobycia w Górnym szybie.",
            "Ukończ łącznie 150 cykli wydobycia w Górnym szybie."
        ],

        rewardGold: [
            140,
            450
        ],

        rewardExp: [
            80,
            280
        ],

        rewardActivityExp: [
            100,
            360
        ]
    }),

    {
        id: "explore_middle_mine_1",
        activityId: "mining",
        progressSource: "areaCycles",
        targetAreaId: "middle_mine",

        chainStage: 1,
        chainLength: 3,

        title: "Badacz środka kopalni",
        description:
            "Ukończ 10 cykli wydobycia w Środku kopalni.",

        requiredLevel: 1,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 50,
        rewardExp: 35,
        rewardActivityExp: 40,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix: "explore_middle_mine",
        activityId: "mining",
        progressSource: "areaCycles",
        targetAreaId: "middle_mine",

        title: "Badacz środka kopalni",
        requiredLevel: 1,

        requiredKills: [
            50,
            150
        ],

        descriptions: [
            "Ukończ łącznie 50 cykli wydobycia w Środku kopalni.",
            "Ukończ łącznie 150 cykli wydobycia w Środku kopalni."
        ],

        rewardGold: [
            200,
            650
        ],

        rewardExp: [
            120,
            400
        ],

        rewardActivityExp: [
            150,
            500
        ]
    }),

    {
        id: "explore_left_shaft_1",
        activityId: "mining",
        progressSource: "areaCycles",
        targetAreaId: "left_shaft",

        chainStage: 1,
        chainLength: 3,

        title: "Znawca Lewego szybu",
        description:
            "Ukończ 10 cykli wydobycia w Lewym szybie.",

        requiredLevel: 1,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 70,
        rewardExp: 45,
        rewardActivityExp: 55,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix: "explore_left_shaft",
        activityId: "mining",
        progressSource: "areaCycles",
        targetAreaId: "left_shaft",

        title: "Znawca Lewego szybu",
        requiredLevel: 1,

        requiredKills: [
            50,
            150
        ],

        descriptions: [
            "Ukończ łącznie 50 cykli wydobycia w Lewym szybie.",
            "Ukończ łącznie 150 cykli wydobycia w Lewym szybie."
        ],

        rewardGold: [
            270,
            900
        ],

        rewardExp: [
            170,
            550
        ],

        rewardActivityExp: [
            200,
            680
        ]
    }),

    {
        id: "explore_right_shaft_1",
        activityId: "mining",
        progressSource: "areaCycles",
        targetAreaId: "right_shaft",

        chainStage: 1,
        chainLength: 3,

        title: "Znawca Prawego szybu",
        description:
            "Ukończ 10 cykli wydobycia w Prawym szybie.",

        requiredLevel: 1,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 90,
        rewardExp: 60,
        rewardActivityExp: 70,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix: "explore_right_shaft",
        activityId: "mining",
        progressSource: "areaCycles",
        targetAreaId: "right_shaft",

        title: "Znawca Prawego szybu",
        requiredLevel: 1,

        requiredKills: [
            50,
            150
        ],

        descriptions: [
            "Ukończ łącznie 50 cykli wydobycia w Prawym szybie.",
            "Ukończ łącznie 150 cykli wydobycia w Prawym szybie."
        ],

        rewardGold: [
            360,
            1200
        ],

        rewardExp: [
            220,
            720
        ],

        rewardActivityExp: [
            270,
            900
        ]
    }),

    {
        id: "explore_deep_tunnels_1",
        activityId: "mining",
        progressSource: "areaCycles",
        targetAreaId: "deep_tunnels",

        chainStage: 1,
        chainLength: 3,

        title: "Zdobywca Głębokich tuneli",
        description:
            "Ukończ 10 cykli wydobycia w Głębokich tunelach.",

        requiredLevel: 1,
        requiredKills: 10,
        currentKills: 0,

        rewardGold: 120,
        rewardExp: 80,
        rewardActivityExp: 95,

        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix: "explore_deep_tunnels",
        activityId: "mining",
        progressSource: "areaCycles",
        targetAreaId: "deep_tunnels",

        title: "Zdobywca Głębokich tuneli",
        requiredLevel: 1,

        requiredKills: [
            50,
            150
        ],

        descriptions: [
            "Ukończ łącznie 50 cykli wydobycia w Głębokich tunelach.",
            "Ukończ łącznie 150 cykli wydobycia w Głębokich tunelach."
        ],

        rewardGold: [
            480,
            1600
        ],

        rewardExp: [
            300,
            960
        ],

        rewardActivityExp: [
            360,
            1200
        ]
    })
];