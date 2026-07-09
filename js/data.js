const locations = {
    las: {
        name: "🌳 Las",
        description: "Spokojna, zielona kraina pełna słabszych stworzeń.",
        enemies: [
            { name: "Slime", hp: 30, gold: 2, exp: 5 },
            { name: "Goblin", hp: 50, gold: 5, exp: 10 },
            { name: "Wilk", hp: 70, gold: 7, exp: 12 },
            { name: "Dzik", hp: 90, gold: 9, exp: 16 },
            { name: "Ent", hp: 140, gold: 15, exp: 30 }
        ]
    },

    jaskinia: {
        name: "🪨 Jaskinia",
        description: "Ciemne tunele zamieszkane przez potężniejsze bestie.",
        enemies: [
            { name: "Nietoperz", hp: 60, gold: 6, exp: 12 },
            { name: "Pająk", hp: 80, gold: 8, exp: 15 },
            { name: "Szkielet", hp: 100, gold: 10, exp: 20 },
            { name: "Troll", hp: 160, gold: 18, exp: 35 },
            { name: "Kamienny Golem", hp: 220, gold: 25, exp: 45 }
        ]
    }
};