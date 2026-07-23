const alchemyRecipes = [
    {
        id: "recipe_mining_speed_potion",
        category: "mining",
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
                itemId: "nettle",
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
        category: "gathering",
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
                itemId: "nettle",
                quantity: 1
            }
        ]
    },

    {
        id: "recipe_hunter_potion",
        category: "hunting",
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
                itemId: "red_mushroom",
                quantity: 2
            },
            {
                itemId: "swamp_moss",
                quantity: 1
            },
            {
                itemId: "wolf_fang",
                quantity: 2
            }
        ]
    },

    {
        id: "recipe_strength_potion",
        category: "hunting",
        name: "Mikstura siły",
        description:
            "Zwiększa obrażenia broni w zwarciu.",

        requiredAlchemyLevel: 8,
        craftingDurationSeconds: 180,

        resultItemId:
            "strength_potion",

        resultQuantity: 1,

        ingredients: [
            {
                itemId: "calamus_root",
                quantity: 2
            },
            {
                itemId: "blood_flower",
                quantity: 1
            },
            {
                itemId: "swamp_heart",
                quantity: 1
            }
        ]
    },

    {
        id: "recipe_protection_potion",
        category: "hunting",
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
                itemId: "frostbloom",
                quantity: 1
            },
            {
                itemId: "mountain_sage",
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
        category: "hunting",
        name: "Mikstura skupienia",
        description:
            "Mikstura przyspieszająca regenerację many.",

        requiredAlchemyLevel: 15,
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
                itemId: "mandrake_root",
                quantity: 1
            }
        ]
    },


    {
        id: "recipe_precision_potion",
        category: "hunting",
        name: "Mikstura precyzji",

        description:
            "Zwiększa obrażenia łuków i kusz.",

        requiredAlchemyLevel: 8,
        craftingDurationSeconds: 180,

        resultItemId:
            "precision_potion",

        resultQuantity: 1,

        ingredients: [
            {
                itemId: "marsh_flower",
                quantity: 2
            },
            {
                itemId: "poison_cap",
                quantity: 1
            },
            {
                itemId: "dark_feather",
                quantity: 1
            }
        ]
    },

    {
        id: "recipe_arcane_weapon_potion",
        category: "hunting",
        name: "Mikstura arkanicznego oręża",

        description:
            "Zwiększa obrażenia zwykłych ataków różdżkami i kosturami.",

        requiredAlchemyLevel: 10,
        craftingDurationSeconds: 240,

        resultItemId:
            "arcane_weapon_potion",

        resultQuantity: 1,

        ingredients: [
            {
                itemId: "blue_saffron",
                quantity: 2
            },
            {
                itemId: "wind_flower",
                quantity: 1
            },
            {
                itemId: "nymph_tear",
                quantity: 1
            },
            {
                itemId: "amethyst",
                quantity: 1
            }
        ]
    },

    {
        id: "recipe_magic_power_potion",
        category: "hunting",
        name: "Mikstura mocy magicznej",

        description:
            "Zwiększa obrażenia czarów ofensywnych.",

        requiredAlchemyLevel: 15,
        craftingDurationSeconds: 300,

        resultItemId:
            "magic_power_potion",

        resultQuantity: 1,

        ingredients: [
            {
                itemId: "star_flower",
                quantity: 2
            },
            {
                itemId: "crystal_orchid",
                quantity: 1
            },
            {
                itemId: "pure_crystal",
                quantity: 1
            }
        ]
    },

    {
        id:
            "recipe_ancient_protection_elixir",
        category: "hunting",

        name:
            "Eliksir pradawnej ochrony",

        description:
            "Potężny eliksir zmniejszający otrzymywane obrażenia.",

        requiredAlchemyLevel: 15,
        craftingDurationSeconds: 360,

        resultItemId:
            "ancient_protection_elixir",

        resultQuantity: 1,

        ingredients: [
            {
                itemId: "ancient_bark",
                quantity: 2
            },
            {
                itemId:
                    "ancient_tree_seed",
                quantity: 1
            },
            {
                itemId: "stone_root",
                quantity: 2
            }
        ]
    },

    {
        id:
            "recipe_corrupted_strength_elixir",
        category: "hunting",

        name:
            "Eliksir spaczonej siły",

        description:
            "Potężny eliksir wzmacniający broń w zwarciu.",

        requiredAlchemyLevel: 20,
        craftingDurationSeconds: 420,

        resultItemId:
            "corrupted_strength_elixir",

        resultQuantity: 1,

        ingredients: [
            {
                itemId:
                    "corrupted_thorn",
                quantity: 2
            },
            {
                itemId:
                    "ash_flower",
                quantity: 2
            },
            {
                itemId:
                    "toxic_root",
                quantity: 1
            }
        ]
    },

    {
        id:
            "recipe_corrupted_precision_elixir",
        category: "hunting",

        name:
            "Eliksir spaczonej precyzji",

        description:
            "Potężny eliksir wzmacniający łuki i kusze.",

        requiredAlchemyLevel: 20,
        craftingDurationSeconds: 420,

        resultItemId:
            "corrupted_precision_elixir",

        resultQuantity: 1,

        ingredients: [
            {
                itemId:
                    "toxic_root",
                quantity: 2
            },
            {
                itemId:
                    "shadow_fern",
                quantity: 2
            },
            {
                itemId:
                    "corrupted_thorn",
                quantity: 1
            }
        ]
    },

    {
        id:
            "recipe_corrupted_arcane_elixir",
        category: "hunting",

        name:
            "Eliksir spaczonego oręża",

        description:
            "Potężny eliksir wzmacniający różdżki i kostury.",

        requiredAlchemyLevel: 20,
        craftingDurationSeconds: 420,

        resultItemId:
            "corrupted_arcane_elixir",

        resultQuantity: 1,

        ingredients: [
            {
                itemId:
                    "void_spore",
                quantity: 2
            },
            {
                itemId:
                    "ash_flower",
                quantity: 1
            },
            {
                itemId:
                    "shadow_fern",
                quantity: 1
            }
        ]
    },

    {
        id:
            "recipe_void_power_elixir",
        category: "hunting",

        name:
            "Eliksir mocy pustki",

        description:
            "Legendarny eliksir wzmacniający czary ofensywne.",

        requiredAlchemyLevel: 20,
        craftingDurationSeconds: 480,

        resultItemId:
            "void_power_elixir",

        resultQuantity: 1,

        ingredients: [
            {
                itemId:
                    "corruption_essence",
                quantity: 1
            },
            {
                itemId:
                    "void_spore",
                quantity: 1
            },
            {
                itemId:
                    "shadow_fern",
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

    melee_weapon_damage: {
        id: "melee_weapon_damage",
        name: "Mikstura siły",
        icon: "⚔️",

        description:
            "+15% obrażeń broni w zwarciu",

        activityType: "combat",

        durationMilliseconds:
            5 * 60 * 1000,

        bonuses: {
            meleeWeaponDamagePercent: 15
        }
    },

    ranged_weapon_damage: {
        id: "ranged_weapon_damage",
        name: "Mikstura precyzji",
        icon: "🏹",

        description:
            "+15% obrażeń łuków i kusz",

        activityType: "combat",

        durationMilliseconds:
            5 * 60 * 1000,

        bonuses: {
            rangedWeaponDamagePercent: 15
        }
    },

    magic_weapon_damage: {
        id: "magic_weapon_damage",
        name: "Mikstura arkanicznego oręża",
        icon: "🪄",

        description:
            "+15% obrażeń różdżek i kosturów",

        activityType: "combat",

        durationMilliseconds:
            5 * 60 * 1000,

        bonuses: {
            magicWeaponDamagePercent: 15
        }
    },

    spell_damage: {
        id: "spell_damage",
        name: "Mikstura mocy magicznej",
        icon: "🔥",

        description:
            "+15% obrażeń czarów",

        activityType: "combat",

        durationMilliseconds:
            5 * 60 * 1000,

        bonuses: {
            spellDamagePercent: 15
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