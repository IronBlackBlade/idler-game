const forest = {
    id: "forest",
    name: "🌳 Las",
    description: "Spokojny las pełen słabych stworzeń.",
    recommendedLevel: 1,
    requiredLevel: 1,

boss: {
    id: "goblin_chief",
    name: "👑 Goblini Herszt",
    hp: 250,
    attack: 18,
    gold: 50,
    exp: 80,
    loot: [
        { item: "goblin_blade_fragment", chance: 60 },
        { item: "coin_pouch", chance: 50 },
        { item: "recipe_goblin_dagger", chance: 20 }
    ]
},

    enemies: [
        {
            id: "beetle",
            name: "Chrząszcz",
            hp: 18,
            attack: 3,
            gold: 2,
            exp: 4,
           loot: [
    { item: "beetle_shell", chance: 35 },
    { item: "beetle_wing", chance: 18 },
    { item: "small_spike", chance: 8 },
    { item: "recipe_goblin_dagger", chance: 0.2 }
]
        },
        
        {
            id: "sheep",
            name: "Owca",
            hp: 28,
            attack: 4,
            gold: 3,
            exp: 6,
loot: [
    { item: "wool", chance: 35 },
    { item: "sheep_skin", chance: 20 },
    { item: "ram_horn", chance: 6 },
    { item: "recipe_goblin_dagger", chance: 0.3 }
]
        },
        {
            id: "rat",
            name: "Olbrzymi szczur",
            hp: 40,
            attack: 5,
            gold: 5,
            exp: 9,
loot: [
    { item: "rat_tail", chance: 30 },
    { item: "sharp_tooth", chance: 15 },
    { item: "old_coin", chance: 5 },
    { item: "recipe_goblin_dagger", chance: 0.5 }
]
        },
        {
            id: "wolf",
            name: "Młody wilk",
            hp: 60,
            attack: 7,
            gold: 8,
            exp: 14,
loot: [
    { item: "wolf_fur", chance: 28 },
    { item: "wolf_fang", chance: 14 },
    { item: "wolf_claw", chance: 8 },
    { item: "recipe_goblin_dagger", chance: 0.8 }
]
        },
        {
            id: "goblin",
            name: "Goblin",
            hp: 85,
            attack: 9,
            gold: 12,
            exp: 20,
loot: [
    { item: "goblin_blade_fragment", chance: 12 },
    { item: "broken_shield", chance: 8 },
    { item: "coin_pouch", chance: 25 },
    { item: "recipe_goblin_dagger", chance: 1 }
]
        }
    ]


    
};


