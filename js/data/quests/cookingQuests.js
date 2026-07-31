const cookingQuests = [
    {
        id: "cooking_total_meals_1",
        chainStage: 1,
        chainLength: 4,
        title: "Pierwszy posiłek",
        description: "Ugotuj łącznie 5 porcji jedzenia.",
        activityId: "cooking",
        progressSource: "totalMealsCooked",
        requiredLevel: 1,
        requiredKills: 5,
        currentKills: 0,
        rewardGold: 120,
        rewardExp: 80,
        rewardActivityExp: 100,
        completed: false,
        claimed: false
    },

    ...createQuestFollowUpStages({
        idPrefix: "cooking_total_meals",
        title: "Pełna spiżarnia",
        activityId: "cooking",
        progressSource: "totalMealsCooked",
        requiredLevel: 1,
        requiredKills: [25, 75, 200],
        descriptions: [
            "Ugotuj łącznie 25 porcji jedzenia.",
            "Ugotuj łącznie 75 porcji jedzenia.",
            "Ugotuj łącznie 200 porcji jedzenia."
        ],
        rewardGold: [500, 1500, 4200],
        rewardExp: [300, 900, 2500],
        rewardActivityExp: [400, 1200, 3300]
    }),

    {
        id: "cooking_tavern_orders_1",
        chainStage: 1,
        chainLength: 4,
        title: "Pomocnik karczmarza",
        description: "Zrealizuj 3 zamówienia w karczmie.",
        activityId: "cooking",
        progressSource: "tavernOrders",
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
        idPrefix: "cooking_tavern_orders",
        title: "Renoma Złotego Karpia",
        activityId: "cooking",
        progressSource: "tavernOrders",
        requiredLevel: 1,
        requiredKills: [10, 25, 60],
        descriptions: [
            "Zrealizuj łącznie 10 zamówień w karczmie.",
            "Zrealizuj łącznie 25 zamówień w karczmie.",
            "Zrealizuj łącznie 60 zamówień w karczmie."
        ],
        rewardGold: [850, 2500, 7000],
        rewardExp: [450, 1350, 3800],
        rewardActivityExp: [550, 1700, 4600]
    }),

    {
        id: "cooking_level_1",
        chainStage: 1,
        chainLength: 4,
        title: "Początkujący kucharz",
        description: "Osiągnij 5. poziom gotowania.",
        activityId: "cooking",
        progressSource: "cookingLevel",
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
        idPrefix: "cooking_level",
        title: "Mistrz kuchni",
        activityId: "cooking",
        progressSource: "cookingLevel",
        requiredLevel: 1,
        requiredKills: [10, 15, 20],
        descriptions: [
            "Osiągnij 10. poziom gotowania.",
            "Osiągnij 15. poziom gotowania.",
            "Osiągnij 20. poziom gotowania."
        ],
        rewardGold: [1400, 3500, 8500],
        rewardExp: [750, 1900, 4700],
        rewardActivityExp: [650, 1600, 3900]
    })
];
