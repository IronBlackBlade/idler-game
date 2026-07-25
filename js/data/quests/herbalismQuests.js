const herbalismQuests = [
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
}),

{
    id:
        "gather_rare_ingredients_1",

    activityId:
        "herbalism",

    progressSource:
        "rareIngredients",

    chainStage: 1,
    chainLength: 4,

    title:
        "Rzadkie okazy",

    description:
        "Zbierz pierwszy rzadki składnik.",

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
        "gather_rare_ingredients",

    activityId:
        "herbalism",

    progressSource:
        "rareIngredients",

    title:
        "Rzadkie okazy",

    requiredLevel: 1,

    requiredKills: [
        5,
        15,
        30
    ],

    descriptions: [
        "Zbierz łącznie 5 rzadkich składników.",
        "Zbierz łącznie 15 rzadkich składników.",
        "Zbierz łącznie 30 rzadkich składników."
    ],

    rewardGold: [
        750,
        2300,
        5500
    ],

    rewardExp: [
        375,
        1100,
        2800
    ],

    rewardActivityExp: [
        425,
        1200,
        3200
    ]
}),

{
    id:
        "gather_exceptional_ingredients_1",

    activityId:
        "herbalism",

    progressSource:
        "exceptionalIngredients",

    chainStage: 1,
    chainLength: 4,

    title:
        "Dary pradawnej natury",

    description:
        "Zbierz pierwszy wyjątkowy składnik.",

    requiredLevel: 1,
    requiredKills: 1,
    currentKills: 0,

    rewardGold: 450,
    rewardExp: 225,
    rewardActivityExp: 275,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "gather_exceptional_ingredients",

    activityId:
        "herbalism",

    progressSource:
        "exceptionalIngredients",

    title:
        "Dary pradawnej natury",

    requiredLevel: 1,

    requiredKills: [
        3,
        10,
        20
    ],

    descriptions: [
        "Zbierz łącznie 3 wyjątkowe składniki.",
        "Zbierz łącznie 10 wyjątkowych składników.",
        "Zbierz łącznie 20 wyjątkowych składników."
    ],

    rewardGold: [
        1650,
        6000,
        14000
    ],

    rewardExp: [
        825,
        3000,
        7000
    ],

    rewardActivityExp: [
        900,
        3200,
        7800
    ]
}),

{
    id:
        "reach_herbalism_level_1",

    activityId:
        "herbalism",

    progressSource:
        "herbalismLevel",

    chainStage: 1,
    chainLength: 4,

    title:
        "Doświadczony zielarz",

    description:
        "Osiągnij 5. poziom zielarstwa.",

    requiredLevel: 1,
    requiredKills: 5,
    currentKills: 0,

    rewardGold: 550,
    rewardExp: 275,
    rewardActivityExp: 225,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "reach_herbalism_level",

    activityId:
        "herbalism",

    progressSource:
        "herbalismLevel",

    title:
        "Doświadczony zielarz",

    requiredLevel: 1,

    requiredKills: [
        10,
        20,
        30
    ],

    descriptions: [
        "Osiągnij 10. poziom zielarstwa.",
        "Osiągnij 20. poziom zielarstwa.",
        "Osiągnij 30. poziom zielarstwa."
    ],

    rewardGold: [
        2300,
        8500,
        20000
    ],

    rewardExp: [
        1100,
        4200,
        10000
    ],

    rewardActivityExp: [
        750,
        2300,
        5500
    ]
}),

{
    id:
        "complete_herbalism_cycles_1",

    activityId:
        "herbalism",

    progressSource:
        "totalCycles",

    chainStage: 1,
    chainLength: 4,

    title:
        "Wytrwały zbieracz",

    description:
        "Ukończ 10 wypraw zielarskich.",

    requiredLevel: 1,
    requiredKills: 10,
    currentKills: 0,

    rewardGold: 50,
    rewardExp: 30,
    rewardActivityExp: 50,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "complete_herbalism_cycles",

    activityId:
        "herbalism",

    progressSource:
        "totalCycles",

    title:
        "Wytrwały zbieracz",

    requiredLevel: 1,

    requiredKills: [
        50,
        150,
        300
    ],

    descriptions: [
        "Ukończ łącznie 50 wypraw zielarskich.",
        "Ukończ łącznie 150 wypraw zielarskich.",
        "Ukończ łącznie 300 wypraw zielarskich."
    ],

    rewardGold: [
        200,
        650,
        1800
    ],

    rewardExp: [
        120,
        400,
        1100
    ],

    rewardActivityExp: [
        180,
        550,
        1500
    ]
}),

{
    id:
        "explore_forest_clearing_1",

    activityId:
        "herbalism",

    progressSource:
        "areaCycles",

    targetAreaId:
        "forest_clearing",

    chainStage: 1,
    chainLength: 3,

    title:
        "Opiekun Leśnej polany",

    description:
        "Ukończ 10 cykli zielarstwa na Leśnej polanie.",

    requiredLevel: 1,
    requiredKills: 10,
    currentKills: 0,

    rewardGold: 30,
    rewardExp: 20,
    rewardActivityExp: 25,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "explore_forest_clearing",

    activityId:
        "herbalism",

    progressSource:
        "areaCycles",

    targetAreaId:
        "forest_clearing",

    title:
        "Opiekun Leśnej polany",

    requiredLevel: 1,

    requiredKills: [
        50,
        150
    ],

    descriptions: [
        "Ukończ łącznie 50 cykli zielarstwa na Leśnej polanie.",
        "Ukończ łącznie 150 cykli zielarstwa na Leśnej polanie."
    ],

    rewardGold: [
        120,
        400
    ],

    rewardExp: [
        70,
        250
    ],

    rewardActivityExp: [
        90,
        325
    ]
}),

{
    id:
        "explore_wetlands_1",

    activityId:
        "herbalism",

    progressSource:
        "areaCycles",

    targetAreaId:
        "wetlands",

    chainStage: 1,
    chainLength: 3,

    title:
        "Badacz Wilgotnych mokradeł",

    description:
        "Ukończ 10 cykli zielarstwa na Wilgotnych mokradłach.",

    requiredLevel: 1,
    requiredKills: 10,
    currentKills: 0,

    rewardGold: 45,
    rewardExp: 30,
    rewardActivityExp: 35,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "explore_wetlands",

    activityId:
        "herbalism",

    progressSource:
        "areaCycles",

    targetAreaId:
        "wetlands",

    title:
        "Badacz Wilgotnych mokradeł",

    requiredLevel: 1,

    requiredKills: [
        50,
        150
    ],

    descriptions: [
        "Ukończ łącznie 50 cykli zielarstwa na Wilgotnych mokradłach.",
        "Ukończ łącznie 150 cykli zielarstwa na Wilgotnych mokradłach."
    ],

    rewardGold: [
        180,
        600
    ],

    rewardExp: [
        110,
        360
    ],

    rewardActivityExp: [
        130,
        450
    ]
}),

{
    id:
        "explore_mountain_slope_1",

    activityId:
        "herbalism",

    progressSource:
        "areaCycles",

    targetAreaId:
        "mountain_slope",

    chainStage: 1,
    chainLength: 3,

    title:
        "Zielarz górskich szlaków",

    description:
        "Ukończ 10 cykli zielarstwa na Górskim zboczu.",

    requiredLevel: 1,
    requiredKills: 10,
    currentKills: 0,

    rewardGold: 60,
    rewardExp: 40,
    rewardActivityExp: 50,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "explore_mountain_slope",

    activityId:
        "herbalism",

    progressSource:
        "areaCycles",

    targetAreaId:
        "mountain_slope",

    title:
        "Zielarz górskich szlaków",

    requiredLevel: 1,

    requiredKills: [
        50,
        150
    ],

    descriptions: [
        "Ukończ łącznie 50 cykli zielarstwa na Górskim zboczu.",
        "Ukończ łącznie 150 cykli zielarstwa na Górskim zboczu."
    ],

    rewardGold: [
        240,
        800
    ],

    rewardExp: [
        150,
        480
    ],

    rewardActivityExp: [
        180,
        600
    ]
}),

{
    id:
        "explore_ancient_grove_1",

    activityId:
        "herbalism",

    progressSource:
        "areaCycles",

    targetAreaId:
        "ancient_grove",

    chainStage: 1,
    chainLength: 3,

    title:
        "Szept Pradawnego gaju",

    description:
        "Ukończ 10 cykli zielarstwa w Pradawnym gaju.",

    requiredLevel: 1,
    requiredKills: 10,
    currentKills: 0,

    rewardGold: 80,
    rewardExp: 55,
    rewardActivityExp: 65,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "explore_ancient_grove",

    activityId:
        "herbalism",

    progressSource:
        "areaCycles",

    targetAreaId:
        "ancient_grove",

    title:
        "Szept Pradawnego gaju",

    requiredLevel: 1,

    requiredKills: [
        50,
        150
    ],

    descriptions: [
        "Ukończ łącznie 50 cykli zielarstwa w Pradawnym gaju.",
        "Ukończ łącznie 150 cykli zielarstwa w Pradawnym gaju."
    ],

    rewardGold: [
        320,
        1100
    ],

    rewardExp: [
        200,
        650
    ],

    rewardActivityExp: [
        240,
        800
    ]
}),

{
    id:
        "explore_corrupted_wasteland_1",

    activityId:
        "herbalism",

    progressSource:
        "areaCycles",

    targetAreaId:
        "corrupted_wasteland",

    chainStage: 1,
    chainLength: 3,

    title:
        "Zbieracz skażonej ziemi",

    description:
        "Ukończ 10 cykli zielarstwa na Skażonym pustkowiu.",

    requiredLevel: 1,
    requiredKills: 10,
    currentKills: 0,

    rewardGold: 110,
    rewardExp: 75,
    rewardActivityExp: 90,

    completed: false,
    claimed: false
},

...createQuestFollowUpStages({
    idPrefix:
        "explore_corrupted_wasteland",

    activityId:
        "herbalism",

    progressSource:
        "areaCycles",

    targetAreaId:
        "corrupted_wasteland",

    title:
        "Zbieracz skażonej ziemi",

    requiredLevel: 1,

    requiredKills: [
        50,
        150
    ],

    descriptions: [
        "Ukończ łącznie 50 cykli zielarstwa na Skażonym pustkowiu.",
        "Ukończ łącznie 150 cykli zielarstwa na Skażonym pustkowiu."
    ],

    rewardGold: [
        450,
        1500
    ],

    rewardExp: [
        280,
        900
    ],

    rewardActivityExp: [
        340,
        1150
    ]
})

];
