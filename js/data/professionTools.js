const PROFESSION_TOOL_MAX_TIER = 5;

const professionToolTierConfig = Object.freeze([
    Object.freeze({
        tier: 1,
        idPrefix: "simple",
        name: "Podstawowe",
        rarity: "common",
        requiredProfessionLevel: 1,
        primaryBonus: 2,
        secondaryBonus: 1,
        value: 50,
        shopPrice: 100
    }),
    Object.freeze({
        tier: 2,
        idPrefix: "improved",
        name: "Ulepszone",
        rarity: "uncommon",
        requiredProfessionLevel: 10,
        primaryBonus: 5,
        secondaryBonus: 2,
        value: 140,
        shopPrice: 280
    }),
    Object.freeze({
        tier: 3,
        idPrefix: "advanced",
        name: "Zaawansowane",
        rarity: "rare",
        requiredProfessionLevel: 20,
        primaryBonus: 9,
        secondaryBonus: 4,
        value: 380,
        shopPrice: 850
    }),
    Object.freeze({
        tier: 4,
        idPrefix: "expert",
        name: "Eksperckie",
        rarity: "epic",
        requiredProfessionLevel: 35,
        primaryBonus: 14,
        secondaryBonus: 7,
        value: 1400,
        shopPrice: 3200
    }),
    Object.freeze({
        tier: 5,
        idPrefix: "master",
        name: "Mistrzowskie",
        rarity: "legendary",
        requiredProfessionLevel: 50,
        primaryBonus: 20,
        secondaryBonus: 10,
        value: 6000,
        shopPrice: 12000
    })
]);

const professionToolTypeConfig = Object.freeze([
    Object.freeze({
        toolType: "pickaxe",
        idSuffix: "pickaxe",
        professionName: "Kopalnia",
        icon: "⛏️",
        names: Object.freeze([
            "Prosty kilof",
            "Ulepszony kilof",
            "Zaawansowany kilof",
            "Ekspercki kilof",
            "Mistrzowski kilof"
        ]),
        primaryBonusKey: "miningSpeedPercent",
        secondaryBonusKey: "extraOreChancePercent"
    }),
    Object.freeze({
        toolType: "sickle",
        idSuffix: "sickle",
        professionName: "Zielarstwo",
        icon: "🌿",
        names: Object.freeze([
            "Prosty sierp",
            "Ulepszony sierp",
            "Zaawansowany sierp",
            "Ekspercki sierp",
            "Mistrzowski sierp"
        ]),
        primaryBonusKey: "herbalismSpeedPercent",
        secondaryBonusKey: "extraHerbChancePercent"
    }),
    Object.freeze({
        toolType: "fishingRod",
        idSuffix: "fishing_rod",
        professionName: "Łowienie",
        icon: "🎣",
        names: Object.freeze([
            "Prosta wędka",
            "Ulepszona wędka",
            "Zaawansowana wędka",
            "Ekspercka wędka",
            "Mistrzowska wędka"
        ]),
        primaryBonusKey: "fishingSpeedPercent",
        secondaryBonusKey: "rareFishChancePercent"
    }),
    Object.freeze({
        toolType: "alchemyKit",
        idSuffix: "alchemy_kit",
        professionName: "Alchemia",
        icon: "⚗️",
        names: Object.freeze([
            "Prosty zestaw alchemika",
            "Ulepszony zestaw alchemika",
            "Zaawansowany zestaw alchemika",
            "Ekspercki zestaw alchemika",
            "Mistrzowski zestaw alchemika"
        ]),
        primaryBonusKey: "alchemySpeedPercent",
        secondaryBonusKey: "extraPotionChancePercent"
    }),
    Object.freeze({
        toolType: "cookingTools",
        idSuffix: "cooking_tools",
        professionName: "Gotowanie",
        icon: "🍳",
        names: Object.freeze([
            "Proste przybory kuchenne",
            "Ulepszone przybory kuchenne",
            "Zaawansowane przybory kuchenne",
            "Eksperckie przybory kuchenne",
            "Mistrzowskie przybory kuchenne"
        ]),
        primaryBonusKey: "cookingExpPercent",
        secondaryBonusKey: "extraMealChancePercent"
    }),
    Object.freeze({
        toolType: "craftingHammer",
        idSuffix: "crafting_hammer",
        professionName: "Wytwarzanie",
        icon: "🔨",
        names: Object.freeze([
            "Prosty młot rzemieślniczy",
            "Ulepszony młot rzemieślniczy",
            "Zaawansowany młot rzemieślniczy",
            "Ekspercki młot rzemieślniczy",
            "Mistrzowski młot rzemieślniczy"
        ]),
        primaryBonusKey: "craftingExpPercent",
        secondaryBonusKey: "materialRefundChancePercent"
    })
]);

const professionToolUpgradeMaterialConfig = Object.freeze({
    pickaxe: Object.freeze({
        2: Object.freeze([
            Object.freeze({ itemId: "iron_ingot", quantity: 4 }),
            Object.freeze({ itemId: "whetstone", quantity: 1 })
        ]),
        3: Object.freeze([
            Object.freeze({ itemId: "gold_ingot", quantity: 4 }),
            Object.freeze({ itemId: "amethyst", quantity: 2 })
        ]),
        4: Object.freeze([
            Object.freeze({ itemId: "platinum_ingot", quantity: 4 }),
            Object.freeze({ itemId: "prismatic_gem", quantity: 2 })
        ]),
        5: Object.freeze([
            Object.freeze({ itemId: "mithril_ingot", quantity: 8 }),
            Object.freeze({ itemId: "astral_diamond", quantity: 2 }),
            Object.freeze({ itemId: "titan_core", quantity: 1 })
        ])
    }),
    sickle: Object.freeze({
        2: Object.freeze([
            Object.freeze({ itemId: "iron_ingot", quantity: 3 }),
            Object.freeze({ itemId: "tanned_wolf_leather", quantity: 2 })
        ]),
        3: Object.freeze([
            Object.freeze({ itemId: "gold_ingot", quantity: 3 }),
            Object.freeze({ itemId: "silver_leaf", quantity: 3 })
        ]),
        4: Object.freeze([
            Object.freeze({ itemId: "platinum_ingot", quantity: 3 }),
            Object.freeze({ itemId: "lunar_essence", quantity: 1 })
        ]),
        5: Object.freeze([
            Object.freeze({ itemId: "mithril_ingot", quantity: 5 }),
            Object.freeze({ itemId: "celestial_lotus", quantity: 2 }),
            Object.freeze({ itemId: "life_essence", quantity: 1 })
        ])
    }),
    fishingRod: Object.freeze({
        2: Object.freeze([
            Object.freeze({ itemId: "bronze_ingot", quantity: 3 }),
            Object.freeze({ itemId: "spider_silk", quantity: 2 })
        ]),
        3: Object.freeze([
            Object.freeze({ itemId: "gold_ingot", quantity: 2 }),
            Object.freeze({ itemId: "crystal_fish", quantity: 2 })
        ]),
        4: Object.freeze([
            Object.freeze({ itemId: "platinum_ingot", quantity: 3 }),
            Object.freeze({ itemId: "crystal_sturgeon", quantity: 2 })
        ]),
        5: Object.freeze([
            Object.freeze({ itemId: "mithril_ingot", quantity: 5 }),
            Object.freeze({ itemId: "diamond", quantity: 2 }),
            Object.freeze({ itemId: "phoenix_koi", quantity: 1 })
        ])
    }),
    alchemyKit: Object.freeze({
        2: Object.freeze([
            Object.freeze({ itemId: "copper_ingot", quantity: 3 }),
            Object.freeze({ itemId: "quartz", quantity: 2 })
        ]),
        3: Object.freeze([
            Object.freeze({ itemId: "silver_ingot", quantity: 3 }),
            Object.freeze({ itemId: "mandrake_root", quantity: 3 }),
            Object.freeze({ itemId: "cave_crystal", quantity: 1 })
        ]),
        4: Object.freeze([
            Object.freeze({ itemId: "platinum_ingot", quantity: 2 }),
            Object.freeze({ itemId: "spectral_essence", quantity: 2 }),
            Object.freeze({ itemId: "crystal_orchid", quantity: 2 })
        ]),
        5: Object.freeze([
            Object.freeze({ itemId: "mithril_ingot", quantity: 4 }),
            Object.freeze({ itemId: "diamond", quantity: 2 }),
            Object.freeze({ itemId: "volcanic_heart_fragment", quantity: 1 })
        ])
    }),
    cookingTools: Object.freeze({
        2: Object.freeze([
            Object.freeze({ itemId: "iron_ingot", quantity: 3 }),
            Object.freeze({ itemId: "coal", quantity: 5 })
        ]),
        3: Object.freeze([
            Object.freeze({ itemId: "gold_ingot", quantity: 3 }),
            Object.freeze({ itemId: "golden_trout", quantity: 2 })
        ]),
        4: Object.freeze([
            Object.freeze({ itemId: "platinum_ingot", quantity: 3 }),
            Object.freeze({ itemId: "royal_lionfish", quantity: 2 })
        ]),
        5: Object.freeze([
            Object.freeze({ itemId: "mithril_ingot", quantity: 4 }),
            Object.freeze({ itemId: "diamond", quantity: 2 }),
            Object.freeze({ itemId: "magma_ray", quantity: 2 })
        ])
    }),
    craftingHammer: Object.freeze({
        2: Object.freeze([
            Object.freeze({ itemId: "iron_ingot", quantity: 5 }),
            Object.freeze({ itemId: "whetstone", quantity: 2 })
        ]),
        3: Object.freeze([
            Object.freeze({ itemId: "mithril_ingot", quantity: 4 }),
            Object.freeze({ itemId: "stone_core", quantity: 2 })
        ]),
        4: Object.freeze([
            Object.freeze({ itemId: "mithril_ingot", quantity: 5 }),
            Object.freeze({ itemId: "guardian_core", quantity: 2 })
        ]),
        5: Object.freeze([
            Object.freeze({ itemId: "mithril_ingot", quantity: 8 }),
            Object.freeze({ itemId: "diamond", quantity: 2 }),
            Object.freeze({ itemId: "volcanic_heart_fragment", quantity: 1 })
        ])
    })
});

function getProfessionToolItemId(
    toolDefinition,
    tierDefinition
) {
    return (
        tierDefinition.idPrefix +
        "_" +
        toolDefinition.idSuffix
    );
}

function getProfessionToolTierDefinition(
    toolOrTier
) {
    const tier = Math.max(
        1,
        Math.min(
            PROFESSION_TOOL_MAX_TIER,
            Math.floor(
                Number(
                    typeof toolOrTier === "object"
                        ? toolOrTier?.toolTier
                        : toolOrTier
                ) || 1
            )
        )
    );

    return professionToolTierConfig[
        tier - 1
    ];
}

function getProfessionToolTierLabel(
    toolOrTier
) {
    const tierDefinition =
        getProfessionToolTierDefinition(
            toolOrTier
        );

    return (
        tierDefinition.tier +
        "/" +
        PROFESSION_TOOL_MAX_TIER +
        " · " +
        tierDefinition.name
    );
}

function isProfessionToolUpgradeRecipe(
    recipe
) {
    return (
        recipe?.upgradeType ===
        "profession_tool"
    );
}

const professionToolItems = Object.fromEntries(
    professionToolTypeConfig.flatMap(
        toolDefinition => {
            return professionToolTierConfig.map(
                tierDefinition => {
                    const itemId =
                        getProfessionToolItemId(
                            toolDefinition,
                            tierDefinition
                        );

                    return [
                        itemId,
                        {
                            id: itemId,
                            name:
                                toolDefinition.names[
                                    tierDefinition.tier - 1
                                ],
                            description:
                                "Narzędzie profesji: " +
                                toolDefinition.professionName +
                                ". Ranga: " +
                                tierDefinition.name +
                                ".",
                            rarity:
                                tierDefinition.rarity,
                            type: "profession_tool",
                            toolType:
                                toolDefinition.toolType,
                            toolTier:
                                tierDefinition.tier,
                            toolTierName:
                                tierDefinition.name,
                            icon:
                                toolDefinition.icon,
                            requiredProfessionLevel:
                                tierDefinition
                                    .requiredProfessionLevel,
                            bonuses: {
                                [toolDefinition
                                    .primaryBonusKey]:
                                    tierDefinition
                                        .primaryBonus,
                                [toolDefinition
                                    .secondaryBonusKey]:
                                    tierDefinition
                                        .secondaryBonus
                            },
                            value:
                                tierDefinition.value,
                            shopPrice:
                                tierDefinition.shopPrice
                        }
                    ];
                }
            );
        }
    )
);

const professionToolUpgradeRecipes =
    professionToolTypeConfig.flatMap(
        toolDefinition => {
            return professionToolTierConfig
                .filter(
                    tierDefinition => {
                        return (
                            tierDefinition.tier > 1
                        );
                    }
                )
                .map(tierDefinition => {
                    const previousTierDefinition =
                        professionToolTierConfig[
                            tierDefinition.tier - 2
                        ];

                    const resultItemId =
                        getProfessionToolItemId(
                            toolDefinition,
                            tierDefinition
                        );

                    const previousItemId =
                        getProfessionToolItemId(
                            toolDefinition,
                            previousTierDefinition
                        );

                    const additionalMaterials =
                        professionToolUpgradeMaterialConfig[
                            toolDefinition.toolType
                        ][tierDefinition.tier];

                    const tierIndex =
                        tierDefinition.tier - 2;

                    return {
                        id:
                            resultItemId +
                            "_recipe",
                        name:
                            toolDefinition.names[
                                tierDefinition.tier - 1
                            ],
                        category:
                            "profession_tools",
                        subcategory:
                            toolDefinition.toolType,
                        upgradeType:
                            "profession_tool",
                        upgradeFromItemId:
                            previousItemId,
                        targetToolTier:
                            tierDefinition.tier,
                        resultItemId:
                            resultItemId,
                        requiredCraftingLevel:
                            tierDefinition
                                .requiredProfessionLevel,
                        craftingExp:
                            [75, 250, 800, 2500][
                                tierIndex
                            ],
                        craftingTimeSeconds:
                            [15, 30, 60, 120][
                                tierIndex
                            ],
                        requiresScroll: false,
                        unlockCost: 0,
                        goldCost:
                            [50, 250, 1200, 5000][
                                tierIndex
                            ],
                        materials: [
                            {
                                itemId:
                                    previousItemId,
                                quantity: 1
                            },
                            ...additionalMaterials.map(
                                material => {
                                    return {
                                        ...material
                                    };
                                }
                            )
                        ]
                    };
                });
        }
    );
