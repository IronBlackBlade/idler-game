const characterClasses = {
    warrior: {
        id: "warrior",
        name: "Wojownik",
        icon: "⚔️",

        description:
            "Mistrz walki w zwarciu, który łączy wysokie obrażenia z większą wytrzymałością.",

        unlockLevel: 10,

        bonuses: {
            strength: 5,
            endurance: 2
        }
    },

    hunter: {
        id: "hunter",
        name: "Łowca",
        icon: "🏹",

        description:
            "Specjalista od łuków i kusz, polegający na zręczności oraz szczęściu.",

        unlockLevel: 10,

        bonuses: {
            dexterity: 5,
            luck: 2
        }
    },

    mage: {
        id: "mage",
        name: "Mag",
        icon: "🪄",

        description:
            "Włada bronią magiczną i czarami, korzystając z wysokiej inteligencji.",

        unlockLevel: 10,

        bonuses: {
            intelligence: 5,
            luck: 2
        }
    },

    guardian: {
        id: "guardian",
        name: "Strażnik",
        icon: "🛡️",

        description:
            "Wytrzymały obrońca z dużą liczbą punktów życia i większą siłą.",

        unlockLevel: 10,

        bonuses: {
            endurance: 5,
            strength: 2
        }
    },

    rogue: {
        id: "rogue",
        name: "Łotrzyk",
        icon: "🗡️",

        description:
            "Szybki wojownik opierający się na unikach, zręczności i trafieniach krytycznych.",

        unlockLevel: 10,

        bonuses: {
            dexterity: 4,
            luck: 3
        }
    }
};
