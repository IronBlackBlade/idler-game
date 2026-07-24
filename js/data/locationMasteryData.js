const LOCATION_MASTERY_REQUIRED_KILLS =
    200;

const LOCATION_MASTERY_THRESHOLDS = [
    25,
    50,
    75,
    100
];

const LOCATION_MASTERY_REWARDS = [
    {
        threshold: 25,
        label: "Złoto +5%",

        bonuses: {
            goldBonus: 5
        }
    },
    {
        threshold: 50,
        label: "EXP +5%",

        bonuses: {
            experienceBonus: 5
        }
    },
    {
        threshold: 75,
        label: "Skrzynie +15%",

        bonuses: {
            chestChanceBonus: 15
        }
    },
    {
        threshold: 100,
        label: "Łup +10%",

        bonuses: {
            lootChanceBonus: 10
        }
    }
];