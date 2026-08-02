const cookingRecipes = [
    {
        id: "mint_carp_broth_recipe",
        name: "Karp w miętowym wywarze",
        description:
            "Lekka potrawa wzmacniająca żywotność bohatera.",
        icon: "🍲",
        resultItemId: "mint_carp_broth",
        requiredCookingLevel: 1,
        cookingExp: 45,
        ingredients: [
            { itemId: "small_carp", quantity: 2 },
            { itemId: "mint_leaf", quantity: 2 }
        ]
    },
    {
        id: "cave_eel_stew_recipe",
        name: "Gulasz z kamiennego węgorza",
        description:
            "Gęsty gulasz utwardzający ciało niczym jaskiniowa skała.",
        icon: "🥘",
        resultItemId: "cave_eel_stew",
        requiredCookingLevel: 5,
        cookingExp: 90,
        ingredients: [
            { itemId: "stone_eel", quantity: 2 },
            { itemId: "red_mushroom", quantity: 2 },
            { itemId: "calamus_root", quantity: 1 }
        ]
    },
    {
        id: "sage_tuna_steak_recipe",
        name: "Stek z lazurowego tuńczyka",
        description:
            "Aromatyczny stek wyostrzający zmysły i precyzję.",
        icon: "🥩",
        resultItemId: "sage_tuna_steak",
        requiredCookingLevel: 10,
        cookingExp: 160,
        ingredients: [
            { itemId: "azure_tuna", quantity: 2 },
            { itemId: "mountain_sage", quantity: 2 },
            { itemId: "stone_root", quantity: 1 }
        ]
    },
    {
        id: "frost_salmon_plate_recipe",
        name: "Wędzony śnieżny łosoś",
        description:
            "Chłodny posiłek poprawiający lekkość ruchów.",
        icon: "🍣",
        resultItemId: "frost_salmon_plate",
        requiredCookingLevel: 15,
        cookingExp: 260,
        ingredients: [
            { itemId: "snow_salmon", quantity: 2 },
            { itemId: "frostbloom", quantity: 2 },
            { itemId: "moon_leaf", quantity: 1 }
        ]
    },
    {
        id: "phoenix_koi_feast_recipe",
        name: "Uczta z koi feniksa",
        description:
            "Legendarna uczta łącząca ogień wulkanu z pradawnymi ziołami.",
        icon: "🔥",
        resultItemId: "phoenix_koi_feast",
        requiredCookingLevel: 20,
        cookingExp: 500,
        ingredients: [
            { itemId: "phoenix_koi", quantity: 1 },
            { itemId: "ash_flower", quantity: 3 },
            { itemId: "moon_leaf", quantity: 2 },
            { itemId: "star_flower", quantity: 1 }
        ]
    },
    {
        id: "twilight_cod_plate_recipe",
        name: "Mroźny dorsz o zmierzchu",
        description:
            "Ekspercka potrawa łącząca chłód przerębla z ziołami ogrodu zmierzchu.",
        icon: "🌙",
        resultItemId: "twilight_cod_plate",
        requiredCookingLevel: 35,
        cookingExp: 650,
        ingredients: [
            { itemId: "frost_cod", quantity: 2 },
            { itemId: "dusk_leaf", quantity: 2 },
            { itemId: "dream_moss", quantity: 1 }
        ]
    },
    {
        id: "aether_magma_feast_recipe",
        name: "Eteryczna uczta z magmowej płaszczki",
        description:
            "Mistrzowska uczta splatająca żar wulkanu z roślinami eterycznego sanktuarium.",
        icon: "✨",
        resultItemId: "aether_magma_feast",
        requiredCookingLevel: 50,
        cookingExp: 1100,
        ingredients: [
            { itemId: "magma_ray", quantity: 2 },
            { itemId: "phoenix_herb", quantity: 3 },
            { itemId: "aether_petals", quantity: 2 },
            { itemId: "time_bloom", quantity: 1 }
        ]
    }
];

const tavernOrderTemplates = [
    {
        id: "woodcutters_supper",
        name: "Kolacja dla drwali",
        description: "Leśna brygada zamawia ciepły posiłek po całym dniu pracy.",
        icon: "🪓",
        requiredCookingLevel: 1,
        requiredTavernLevel: 1,
        goldMultiplier: 2.4,
        reputationReward: 1,
        requirements: [
            { itemId: "mint_carp_broth", minQuantity: 2, maxQuantity: 3 }
        ]
    },
    {
        id: "fishermens_table",
        name: "Stół dla wędkarzy",
        description: "Stali bywalcy proszą o większy zapas miętowego wywaru.",
        icon: "🎣",
        requiredCookingLevel: 1,
        requiredTavernLevel: 1,
        goldMultiplier: 2.55,
        reputationReward: 1,
        requirements: [
            { itemId: "mint_carp_broth", minQuantity: 4, maxQuantity: 5 }
        ]
    },
    {
        id: "miners_stew",
        name: "Posiłek dla górników",
        description: "Górnicy potrzebują sycącego gulaszu przed zejściem pod ziemię.",
        icon: "⛏️",
        requiredCookingLevel: 5,
        requiredTavernLevel: 2,
        goldMultiplier: 2.45,
        reputationReward: 1,
        requirements: [
            { itemId: "cave_eel_stew", minQuantity: 2, maxQuantity: 4 }
        ]
    },
    {
        id: "travellers_feast",
        name: "Uczta dla podróżnych",
        description: "Zmęczeni podróżni chcą spróbować dwóch miejscowych potraw.",
        icon: "🧳",
        requiredCookingLevel: 5,
        requiredTavernLevel: 2,
        goldMultiplier: 2.6,
        reputationReward: 1,
        requirements: [
            { itemId: "mint_carp_broth", minQuantity: 2, maxQuantity: 3 },
            { itemId: "cave_eel_stew", minQuantity: 1, maxQuantity: 2 }
        ]
    },
    {
        id: "explorers_steaks",
        name: "Zapasy dla odkrywców",
        description: "Ekspedycja zamawia steki, które pomogą zachować czujność.",
        icon: "🧭",
        requiredCookingLevel: 10,
        requiredTavernLevel: 3,
        goldMultiplier: 2.55,
        reputationReward: 2,
        requirements: [
            { itemId: "sage_tuna_steak", minQuantity: 2, maxQuantity: 3 }
        ]
    },
    {
        id: "guild_banquet",
        name: "Bankiet gildii",
        description: "Gildia zamawia urozmaicony stół na spotkanie swoich mistrzów.",
        icon: "🛡️",
        requiredCookingLevel: 10,
        requiredTavernLevel: 3,
        goldMultiplier: 2.7,
        reputationReward: 2,
        requirements: [
            { itemId: "cave_eel_stew", minQuantity: 2, maxQuantity: 3 },
            { itemId: "sage_tuna_steak", minQuantity: 2, maxQuantity: 3 }
        ]
    },
    {
        id: "northern_reception",
        name: "Przyjęcie z północy",
        description: "Przybysze z lodowej krainy tęsknią za wędzonym łososiem.",
        icon: "❄️",
        requiredCookingLevel: 15,
        requiredTavernLevel: 4,
        goldMultiplier: 2.65,
        reputationReward: 2,
        requirements: [
            { itemId: "frost_salmon_plate", minQuantity: 2, maxQuantity: 3 }
        ]
    },
    {
        id: "royal_table",
        name: "Królewski stół",
        description: "Dworscy wysłannicy oczekują potraw godnych królewskiej uczty.",
        icon: "👑",
        requiredCookingLevel: 20,
        requiredTavernLevel: 5,
        goldMultiplier: 2.8,
        reputationReward: 3,
        requirements: [
            { itemId: "frost_salmon_plate", minQuantity: 2, maxQuantity: 3 },
            { itemId: "phoenix_koi_feast", minQuantity: 1, maxQuantity: 1 }
        ]
    },
    {
        id: "twilight_conclave",
        name: "Uczta konklawe zmierzchu",
        description:
            "Magowie zmierzchu zamawiają chłodne dania na całonocne obrady.",
        icon: "🌙",
        requiredCookingLevel: 35,
        requiredTavernLevel: 7,
        goldMultiplier: 3.05,
        reputationReward: 4,
        requirements: [
            { itemId: "twilight_cod_plate", minQuantity: 2, maxQuantity: 3 },
            { itemId: "frost_salmon_plate", minQuantity: 1, maxQuantity: 2 }
        ]
    },
    {
        id: "aetheric_banquet",
        name: "Bankiet mistrzów eteru",
        description:
            "Najznamienitsi goście oczekują uczty złożonej z arcydzieł kuchni.",
        icon: "✨",
        requiredCookingLevel: 50,
        requiredTavernLevel: 10,
        goldMultiplier: 3.3,
        reputationReward: 5,
        requirements: [
            { itemId: "aether_magma_feast", minQuantity: 1, maxQuantity: 2 },
            { itemId: "twilight_cod_plate", minQuantity: 1, maxQuantity: 2 }
        ]
    }
];

const tavernTipRewards = [
    { itemId: "worm_bait", minQuantity: 2, maxQuantity: 4, weight: 35, requiredTavernLevel: 1 },
    { itemId: "mint_leaf", minQuantity: 2, maxQuantity: 4, weight: 30, requiredTavernLevel: 1 },
    { itemId: "red_mushroom", minQuantity: 2, maxQuantity: 3, weight: 22, requiredTavernLevel: 2 },
    { itemId: "royal_grub", minQuantity: 1, maxQuantity: 2, weight: 18, requiredTavernLevel: 3 },
    { itemId: "mountain_sage", minQuantity: 1, maxQuantity: 2, weight: 16, requiredTavernLevel: 3 },
    { itemId: "frostbloom", minQuantity: 1, maxQuantity: 2, weight: 12, requiredTavernLevel: 4 },
    { itemId: "magnetic_lure", minQuantity: 1, maxQuantity: 1, weight: 8, requiredTavernLevel: 5 },
    { itemId: "ash_flower", minQuantity: 1, maxQuantity: 2, weight: 7, requiredTavernLevel: 5 }
];

function getCookingRecipe(recipeId) {
    return (
        cookingRecipes.find(recipe => {
            return recipe.id === recipeId;
        }) || null
    );
}

function getTavernOrderTemplate(templateId) {
    return (
        tavernOrderTemplates.find(template => {
            return template.id === templateId;
        }) || null
    );
}
