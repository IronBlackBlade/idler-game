const alchemyRecipes = [
    {
        id: "recipe_mining_speed_potion",
        name: "Mikstura górnika",
        description:
            "Mikstura zwiększająca szybkość kopania.",

        requiredAlchemyLevel: 1,
        craftingDurationSeconds: 60,

        resultItemId:
            "mining_speed_potion",

        resultQuantity: 1,

        ingredients: [
            {
                itemId: "mint_leaf",
                quantity: 2
            },
            {
                itemId: "stone_root",
                quantity: 1
            },
            {
                itemId: "coal",
                quantity: 1
            }
        ]
    },

    {
        id: "recipe_herbalism_speed_potion",
        name: "Mikstura zielarza",
        description:
            "Mikstura zwiększająca szybkość zbierania ziół.",

        requiredAlchemyLevel: 1,
        craftingDurationSeconds: 60,

        resultItemId:
            "herbalism_speed_potion",

        resultQuantity: 1,

        ingredients: [
            {
                itemId: "chamomile",
                quantity: 2
            },
            {
                itemId: "silver_leaf",
                quantity: 1
            },
            {
                itemId: "swamp_moss",
                quantity: 1
            }
        ]
    },

    {
        id: "recipe_hunter_potion",
        name: "Mikstura łowcy",
        description:
            "Mikstura zwiększająca szansę na zdobycie dodatkowego łupu.",

        requiredAlchemyLevel: 5,
        craftingDurationSeconds: 120,

        resultItemId:
            "hunter_potion",

        resultQuantity: 1,

        ingredients: [
            {
                itemId: "blood_flower",
                quantity: 1
            },
            {
                itemId: "wolf_fang",
                quantity: 2
            },
            {
                itemId: "quartz",
                quantity: 1
            }
        ]
    },

    {
        id: "recipe_strength_potion",
        name: "Mikstura siły",
        description:
            "Mikstura zwiększająca zadawane obrażenia.",

        requiredAlchemyLevel: 8,
        craftingDurationSeconds: 180,

        resultItemId:
            "strength_potion",

        resultQuantity: 1,

        ingredients: [
            {
                itemId: "mountain_sage",
                quantity: 2
            },
            {
                itemId: "blood_flower",
                quantity: 1
            },
            {
                itemId: "sharp_tooth",
                quantity: 2
            }
        ]
    },

    {
        id: "recipe_protection_potion",
        name: "Mikstura ochrony",
        description:
            "Mikstura zwiększająca obronę bohatera.",

        requiredAlchemyLevel: 10,
        craftingDurationSeconds: 240,

        resultItemId:
            "protection_potion",

        resultQuantity: 1,

        ingredients: [
            {
                itemId: "stone_root",
                quantity: 2
            },
            {
                itemId: "ancient_bark",
                quantity: 1
            },
            {
                itemId: "iron_ore",
                quantity: 1
            }
        ]
    },

    {
        id: "recipe_focus_potion",
        name: "Mikstura skupienia",
        description:
            "Mikstura przyspieszająca regenerację many.",

        requiredAlchemyLevel: 12,
        craftingDurationSeconds: 300,

        resultItemId:
            "focus_potion",

        resultQuantity: 1,

        ingredients: [
            {
                itemId: "moon_leaf",
                quantity: 2
            },
            {
                itemId: "glowing_moss",
                quantity: 1
            },
            {
                itemId: "amethyst",
                quantity: 1
            }
        ]
    }
];

const potionEffects = {
    mining_speed: {
        id: "mining_speed",
        name: "Mikstura górnika",
        icon: "⛏️",
        description:
            "+15% szybkości kopania",

        activityType: "mining",
        durationMilliseconds:
            5 * 60 * 1000,

        bonuses: {
            miningSpeedPercent: 15
        }
    },

    herbalism_speed: {
        id: "herbalism_speed",
        name: "Mikstura zielarza",
        icon: "🌿",
        description:
            "+15% szybkości zbierania",

        activityType: "herbalism",
        durationMilliseconds:
            5 * 60 * 1000,

        bonuses: {
            herbalismSpeedPercent: 15
        }
    },

    hunter_luck: {
        id: "hunter_luck",
        name: "Mikstura łowcy",
        icon: "🎯",
        description:
            "+10% szansy na łup",

        activityType: "combat",
        durationMilliseconds:
            5 * 60 * 1000,

        bonuses: {
            lootBonusPercent: 10
        }
    },

    combat_damage: {
        id: "combat_damage",
        name: "Mikstura siły",
        icon: "💪",
        description:
            "+15% zadawanych obrażeń",

        activityType: "combat",
        durationMilliseconds:
            5 * 60 * 1000,

        bonuses: {
            damagePercent: 15
        }
    },

    combat_defense: {
        id: "combat_defense",
        name: "Mikstura ochrony",
        icon: "🛡️",
        description:
            "+20% obrony",

        activityType: "combat",
        durationMilliseconds:
            5 * 60 * 1000,

        bonuses: {
            defensePercent: 20
        }
    },

    mana_regeneration: {
        id: "mana_regeneration",
        name: "Mikstura skupienia",
        icon: "🔵",
        description:
            "+50% regeneracji many",

        activityType: "general",
        durationMilliseconds:
            5 * 60 * 1000,

        bonuses: {
            manaRegenerationPercent: 50
        }
    }
};

function getAlchemyRecipe(
    recipeId
) {
    return (
        alchemyRecipes.find(
            recipe => {
                return (
                    recipe.id ===
                    recipeId
                );
            }
        ) || null
    );
}

function getPotionEffect(
    effectId
) {
    return (
        potionEffects[
            effectId
        ] || null
    );
}