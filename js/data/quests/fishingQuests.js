const fishingQuests = [
    {
        id: "fishing_total_fish_1",
        chainStage: 1,
        chainLength: 4,
        title: "Pierwszy połów",
        description: "Złów łącznie 10 ryb.",
        activityId: "fishing",
        progressSource: "totalFish",
        requiredLevel: 1,
        requiredKills: 10,
        currentKills: 0,
        rewardGold: 120,
        rewardExp: 80,
        rewardActivityExp: 100,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix: "fishing_total_fish",
        title: "Pełne sieci",
        activityId: "fishing",
        progressSource: "totalFish",
        requiredLevel: 1,
        requiredKills: [50, 150, 400],
        descriptions: [
            "Złów łącznie 50 ryb.",
            "Złów łącznie 150 ryb.",
            "Złów łącznie 400 ryb."
        ],
        rewardGold: [500, 1500, 4000],
        rewardExp: [300, 900, 2400],
        rewardActivityExp: [400, 1200, 3200]
    }),

    {
        id: "fishing_rare_fish_1",
        chainStage: 1,
        chainLength: 4,
        title: "Niezwykły okaz",
        description: "Złów pierwszą rzadką rybę.",
        activityId: "fishing",
        progressSource: "rareFish",
        requiredLevel: 1,
        requiredKills: 1,
        currentKills: 0,
        rewardGold: 180,
        rewardExp: 120,
        rewardActivityExp: 140,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix: "fishing_rare_fish",
        title: "Łowca rzadkich okazów",
        activityId: "fishing",
        progressSource: "rareFish",
        requiredLevel: 1,
        requiredKills: [5, 15, 40],
        descriptions: [
            "Złów łącznie 5 rzadkich ryb.",
            "Złów łącznie 15 rzadkich ryb.",
            "Złów łącznie 40 rzadkich ryb."
        ],
        rewardGold: [750, 2200, 6000],
        rewardExp: [450, 1300, 3400],
        rewardActivityExp: [550, 1600, 4200]
    }),

    {
        id: "fishing_treasures_1",
        chainStage: 1,
        chainLength: 3,
        title: "Coś więcej niż ryba",
        description: "Wyłów pierwszy skarb.",
        activityId: "fishing",
        progressSource: "treasures",
        requiredLevel: 1,
        requiredKills: 1,
        currentKills: 0,
        rewardGold: 350,
        rewardExp: 180,
        rewardActivityExp: 200,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix: "fishing_treasures",
        title: "Skarby z głębin",
        activityId: "fishing",
        progressSource: "treasures",
        requiredLevel: 1,
        requiredKills: [3, 8],
        descriptions: [
            "Wyłów łącznie 3 skarby.",
            "Wyłów łącznie 8 skarbów."
        ],
        rewardGold: [1200, 3500],
        rewardExp: [600, 1700],
        rewardActivityExp: [700, 2100]
    }),

    {
        id: "fishing_orders_1",
        chainStage: 1,
        chainLength: 4,
        title: "Pierwsze zlecenia",
        description: "Zrealizuj 3 zlecenia wędkarskie.",
        activityId: "fishing",
        progressSource: "totalOrdersCompleted",
        requiredLevel: 1,
        requiredKills: 3,
        currentKills: 0,
        rewardGold: 220,
        rewardExp: 120,
        rewardActivityExp: 140,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix: "fishing_orders",
        title: "Zaufany dostawca",
        activityId: "fishing",
        progressSource: "totalOrdersCompleted",
        requiredLevel: 1,
        requiredKills: [10, 25, 60],
        descriptions: [
            "Zrealizuj łącznie 10 zleceń wędkarskich.",
            "Zrealizuj łącznie 25 zleceń wędkarskich.",
            "Zrealizuj łącznie 60 zleceń wędkarskich."
        ],
        rewardGold: [850, 2400, 6500],
        rewardExp: [450, 1300, 3500],
        rewardActivityExp: [550, 1600, 4300]
    }),

    {
        id: "fishing_level_1",
        chainStage: 1,
        chainLength: 4,
        title: "Początkujący wędkarz",
        description: "Osiągnij 5. poziom łowienia.",
        activityId: "fishing",
        progressSource: "fishingLevel",
        requiredLevel: 1,
        requiredKills: 5,
        currentKills: 0,
        rewardGold: 400,
        rewardExp: 220,
        rewardActivityExp: 180,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix: "fishing_level",
        title: "Mistrz wędki",
        activityId: "fishing",
        progressSource: "fishingLevel",
        requiredLevel: 1,
        requiredKills: [10, 20, 35],
        descriptions: [
            "Osiągnij 10. poziom łowienia.",
            "Osiągnij 20. poziom łowienia.",
            "Osiągnij 35. poziom łowienia."
        ],
        rewardGold: [1300, 4500, 12000],
        rewardExp: [700, 2300, 6500],
        rewardActivityExp: [600, 1900, 5200]
    })
];
