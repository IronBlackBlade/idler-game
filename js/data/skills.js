const skillTrees = [
    {
        id: "magic",
        name: "🔮 Magia",
        description: "Czary, mana i obrażenia magiczne."
    },
    {
        id: "exploration",
        name: "🧭 Eksploracja",
        description: "Łup, przetrwanie i pozyskiwanie surowców."
    },
    {
        id: "combat",
        name: "⚔️ Walka",
        description: "Rozwój stylów walki i typów uzbrojenia."
    },
    {
        id: "warrior",
        name: "🩸 Wojownik",
        description:
            "Droga Żelaza: furia, krwawienie i wytrzymałość.",
        requiredClass: "warrior"
    },
    {
        id: "hunter",
        name: "🏹 Łowca",
        description:
            "Droga Łowów: precyzja, grad strzał i przetrwanie.",
        requiredClass: "hunter"
    },
    {
        id: "mage",
        name: "🧙 Mag",
        description:
            "Droga Arkanów: zniszczenie, mana i ochrona.",
        requiredClass: "mage"
    },
    {
        id: "guardian",
        name: "🛡️ Strażnik",
        description:
            "Droga Bastionu: pancerz, odwet i niezłomność.",
        requiredClass: "guardian"
    },
    {
        id: "rogue",
        name: "🗡️ Łotrzyk",
        description:
            "Droga Cienia: zabójstwo, zwinność i trucizny.",
        requiredClass: "rogue"
    },
    {
        id: "crafting",
        name: "⚒️ Rzemiosło",
        description:
            "Szybkość, koszty i doskonalenie wytwarzania."
    },
    {
        id: "trade",
        name: "💰 Handel",
        description:
            "Lepsze ceny kupna i sprzedaży."
    }
];

const skills = {
    arcane_knowledge: {
        /*
         * Zachowujemy stare ID, aby poziomy
         * z istniejących zapisów nie zniknęły.
         */
        id: "arcane_knowledge",
        name: "Adept zniszczenia",

        description:
            "Zwiększa obrażenia zaklęć ofensywnych. Łączny bonus na kolejnych poziomach: 1%, 3%, 5%, 7% i 10%.",

        tree: "magic",
        branch: "general",
        type: "passive",

        requiredLevel: 2,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            100,
            250,
            600,
            1500,
            4000
        ],

        prerequisite: null,

        effect: {
            offensiveSpellDamageByLevel: [
                1,
                3,
                5,
                7,
                10
            ]
        }
    },

    protection_adept: {
        id: "protection_adept",
        name: "Adept ochrony",

        description:
            "Zwiększa siłę zaklęć ochronnych. Łączny bonus na kolejnych poziomach: 1%, 3%, 5%, 7% i 10%.",

        tree: "magic",
        branch: "general",
        type: "passive",

        requiredLevel: 2,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            100,
            250,
            600,
            1500,
            4000
        ],

        prerequisite: null,

        effect: {
            defensiveSpellPowerByLevel: [
                1,
                3,
                5,
                7,
                10
            ]
        }
    },

    fireball: {
        id: "fireball",
        name: "Kula ognia",
        description:
            "Automatycznie rzuca kulę ognia, która zadaje obrażenia magiczne.",

        tree: "magic",
        branch: "offensive_spells",

        type: "active",
        spellType: "offensive",

        requiredLevel: 3,
        maxLevel: 5,
        costPerLevel: 1,
        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisites: [
            {
                skillId: "arcane_knowledge",
                requiredSkillLevel: 3
            },
            {
                skillId: "protection_adept",
                requiredSkillLevel: 1
            }
        ],

        effect: {
            baseManaCost: 14,
            manaCostReductionPerLevel: 1,

            baseCooldownSeconds: 8,
            cooldownReductionSecondsPerLevel: 0.6,

            baseDamageMultiplier: 1.3,
            damageMultiplierPerLevel: 0.25
        }
    },

    frost_bolt: {
        id: "frost_bolt",
        name: "Lodowy pocisk",
        description:
            "Automatycznie zadaje obrażenia magiczne i spowalnia ataki przeciwnika.",

        tree: "magic",
        branch: "offensive_spells",

        type: "active",
        spellType: "offensive",

        requiredLevel: 4,
        maxLevel: 5,
        costPerLevel: 1,
        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "fireball",
            requiredSkillLevel: 3
        },

        effect: {
            baseManaCost: 9,
            manaCostReductionPerLevel: 0.5,

            baseCooldownSeconds: 5.5,
            cooldownReductionSecondsPerLevel: 0.4,

            baseDamageMultiplier: 0.85,
            damageMultiplierPerLevel: 0.15,

            baseSlowDurationSeconds: 3,
            slowDurationSecondsPerLevel: 0.5,

            enemyAttackSkipChance: 50
        }
    },

    arcane_missiles: {
        id: "arcane_missiles",
        name: "Magiczne pociski",
        description:
            "Automatycznie wystrzeliwuje trzy szybkie pociski zadające osobne obrażenia magiczne.",

        tree: "magic",
        branch: "offensive_spells",

        type: "active",
        spellType: "offensive",

        requiredLevel: 7,
        maxLevel: 5,
        costPerLevel: 1,
        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],


        prerequisite: {
            skillId: "frost_bolt",
            requiredSkillLevel: 3
        },

        effect: {
            baseManaCost: 10,
            manaCostReductionPerLevel: 0.5,

            baseCooldownSeconds: 4.5,
            cooldownReductionSecondsPerLevel: 0.25,

            projectileCount: 3,
            baseDamageMultiplierPerProjectile: 0.32,
            damageMultiplierPerProjectilePerLevel: 0.05
        }
    },

    ignite: {
        id: "ignite",
        name: "Podpalenie",
        description:
            "Zadaje obrażenia początkowe, a następnie podpala przeciwnika na 5 sekund.",

        tree: "magic",
        branch: "offensive_spells",

        type: "active",
        spellType: "offensive",

        requiredLevel: 12,
        maxLevel: 5,
        costPerLevel: 1,
        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "arcane_missiles",
            requiredSkillLevel: 3
        },

        effect: {
            baseManaCost: 16,
            manaCostReductionPerLevel: 1,

            baseCooldownSeconds: 10,
            cooldownReductionSecondsPerLevel: 0.5,

            baseDamageMultiplier: 0.45,
            damageMultiplierPerLevel: 0.08,

            durationSeconds: 5,
            tickSeconds: 1,
            baseTickDamageMultiplier: 0.22,
            tickDamageMultiplierPerLevel: 0.04
        }
    },

    meteor: {
        id: "meteor",
        name: "Meteor",
        description:
            "Przyzywa meteor zadający ogromne obrażenia kosztem dużej ilości many i długiego czasu odnowienia.",

        tree: "magic",
        branch: "offensive_spells",

        type: "active",
        spellType: "offensive",

        requiredLevel: 20,
        maxLevel: 5,
        costPerLevel: 1,
        goldCosts: [
            10000,
            25000,
            60000,
            140000,
            300000
        ],

        prerequisite: {
            skillId: "ignite",
            requiredSkillLevel: 5
        },

        effect: {
            baseManaCost: 32,
            manaCostReductionPerLevel: 2,

            baseCooldownSeconds: 18,
            cooldownReductionSecondsPerLevel: 1,

            baseDamageMultiplier: 2.8,
            damageMultiplierPerLevel: 0.45
        }
    },
    destruction_mastery: {
        id: "destruction_mastery",
        name: "Mistrz zniszczenia",

        description:
            "Zwiększa końcowe obrażenia wszystkich czarów ofensywnych o 20%.",

        tree: "magic",
        branch: "offensive_spells",
        type: "passive",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            300000
        ],

        prerequisite: {
            skillId: "meteor",
            requiredSkillLevel: 5
        },

        effect: {
            offensiveSpellDamagePercentPerLevel: 20
        }
    },

    healing: {
        id: "healing",
        name: "Uzdrowienie",
        description:
            "Automatycznie przywraca zdrowie, gdy HP bohatera spadnie do 50% lub mniej.",

        tree: "magic",
        branch: "defensive_spells",

        type: "active",
        spellType: "defensive",

        requiredLevel: 5,
        maxLevel: 5,
        costPerLevel: 1,
        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisites: [
            {
                skillId: "protection_adept",
                requiredSkillLevel: 3
            },
            {
                skillId: "arcane_knowledge",
                requiredSkillLevel: 1
            }
        ],
        effect: {
            baseManaCost: 18,
            manaCostReductionPerLevel: 1,

            baseCooldownSeconds: 14,
            cooldownReductionSecondsPerLevel: 1,

            baseHealingPercent: 18,
            healingPercentPerLevel: 4,

            triggerHpPercent: 50
        }
    },

    arcane_barrier: {
        id: "arcane_barrier",
        name: "Magiczna bariera",
        description:
            "Automatycznie tworzy barierę zmniejszającą otrzymywane obrażenia.",

        tree: "magic",
        branch: "defensive_spells",

        type: "active",
        spellType: "defensive",

        requiredLevel: 4,
        maxLevel: 5,
        costPerLevel: 1,
        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "healing",
            requiredSkillLevel: 3
        },

        effect: {
            baseManaCost: 16,
            manaCostReductionPerLevel: 1,

            baseCooldownSeconds: 12,
            cooldownReductionSecondsPerLevel: 0.8,

            durationSeconds: 5,

            baseDamageReductionPercent: 20,
            damageReductionPercentPerLevel: 5
        }
    },

    mana_shield: {
        id: "mana_shield",
        name: "Tarcza many",
        description:
            "Poniżej 70% HP przekierowuje część otrzymywanych obrażeń na manę przez 6 sekund.",

        tree: "magic",
        branch: "defensive_spells",

        type: "active",
        spellType: "defensive",

        requiredLevel: 10,
        maxLevel: 5,
        costPerLevel: 1,
        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "arcane_barrier",
            requiredSkillLevel: 3
        },

        effect: {
            baseManaCost: 12,
            manaCostReductionPerLevel: 0.5,

            baseCooldownSeconds: 14,
            cooldownReductionSecondsPerLevel: 0.75,

            durationSeconds: 6,
            triggerHpPercent: 70,

            baseRedirectDamagePercent: 30,
            redirectDamagePercentPerLevel: 5,
            manaPerAbsorbedDamage: 0.5,
            offlineManaDrainPerActiveSecond: 1.5
        }
    },

    regeneration: {
        id: "regeneration",
        name: "Regeneracja",
        description:
            "Poniżej 70% HP stopniowo przywraca zdrowie przez 6 sekund.",

        tree: "magic",
        branch: "defensive_spells",

        type: "active",
        spellType: "defensive",

        requiredLevel: 12,
        maxLevel: 5,
        costPerLevel: 1,
        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "mana_shield",
            requiredSkillLevel: 3
        },

        effect: {
            baseManaCost: 14,
            manaCostReductionPerLevel: 1,

            baseCooldownSeconds: 14,
            cooldownReductionSecondsPerLevel: 0.75,

            durationSeconds: 6,
            tickSeconds: 1,
            triggerHpPercent: 70,

            baseTotalHealingPercent: 15,
            totalHealingPercentPerLevel: 3
        }
    },

    mirror_image: {
        id: "mirror_image",
        name: "Lustrzane odbicie",
        description:
            "Poniżej 45% HP tworzy odbicia pozwalające całkowicie uniknąć kolejnych ataków.",

        tree: "magic",
        branch: "defensive_spells",

        type: "active",
        spellType: "defensive",

        requiredLevel: 18,
        maxLevel: 5,
        costPerLevel: 1,
        goldCosts: [
            10000,
            25000,
            60000,
            140000,
            300000
        ],

        prerequisite: {
            skillId: "regeneration",
            requiredSkillLevel: 5
        },

        effect: {
            baseManaCost: 22,
            manaCostReductionPerLevel: 1,

            baseCooldownSeconds: 18,
            cooldownReductionSecondsPerLevel: 1,

            durationSeconds: 8,
            triggerHpPercent: 45,

            baseDodgeCharges: 1,
            additionalDodgeChargeAtLevel: 4
        }
    },

    protection_mastery: {
        id: "protection_mastery",
        name: "Mistrz ochrony",

        description:
            "Zwiększa siłę wszystkich czarów defensywnych o 20%.",

        tree: "magic",
        branch: "defensive_spells",
        type: "passive",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            300000
        ],

        prerequisite: {
            skillId: "mirror_image",
            requiredSkillLevel: 5
        },

        effect: {
            defensiveSpellPowerPercentPerLevel: 20
        }
    },

    keen_eye: {
        id: "keen_eye",
        name: "Bystre oko",
        description: "Zwiększa szansę na zdobycie przedmiotów o 2% za każdy poziom.",
        tree: "exploration",
        branch: "exploration_core",
        type: "passive",

        requiredLevel: 2,
        maxLevel: 5,
        costPerLevel: 1,
        goldCosts: [100, 250, 600, 1500, 4000],

        prerequisite: null,

        effect: {
            lootChancePercentPerLevel: 2
        }
    },

    treasure_hunter: {
        id: "treasure_hunter",
        name: "Poszukiwacz skarbów",
        description:
            "Zwiększa szansę na znalezienie skrzyni o 6% za każdy poziom.",

        tree: "exploration",
        branch: "loot",
        type: "passive",

        requiredLevel: 6,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "keen_eye",
            requiredSkillLevel: 3
        },

        effect: {
            chestChancePercentPerLevel: 6
        }
    },

    rarity_expert: {
        id: "rarity_expert",
        name: "Znawca rzadkości",

        description:
            "Zwiększa szansę na niepospolite i rzadsze łupy z polowania o 4% za każdy poziom.",

        tree: "exploration",
        branch: "loot",
        type: "passive",

        requiredLevel: 12,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "treasure_hunter",
            requiredSkillLevel: 3
        },

        effect: {
            rareHuntingLootChancePercentPerLevel: 4
        }
    },

    lucky_find: {
        id: "lucky_find",
        name: "Szczęśliwe znalezisko",

        description:
            "Daje 10% szansy na podwojenie materiału zdobytego bezpośrednio z przeciwnika.",

        tree: "exploration",
        branch: "loot",
        type: "passive",

        requiredLevel: 20,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            150000
        ],

        prerequisite: {
            skillId: "rarity_expert",
            requiredSkillLevel: 5
        },

        effect: {
            monsterMaterialDoubleChancePercentPerLevel: 10
        }
    },

    experienced_gatherer: {
        id: "experienced_gatherer",
        name: "Doświadczony zbieracz",

        description:
            "Zwiększa doświadczenie zdobywane w kopalni, zielarstwie i łowieniu o 3% za każdy poziom.",

        tree: "exploration",
        branch: "gathering",
        type: "passive",

        requiredLevel: 6,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "keen_eye",
            requiredSkillLevel: 3
        },

        effect: {
            professionExperiencePercentPerLevel: 3
        }
    },

    skilled_hands: {
        id: "skilled_hands",
        name: "Sprawne ręce",

        description:
            "Zwiększa szybkość kopania, zielarstwa i łowienia o 2% za każdy poziom.",

        tree: "exploration",
        branch: "gathering",
        type: "passive",

        requiredLevel: 12,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "experienced_gatherer",
            requiredSkillLevel: 3
        },

        effect: {
            gatheringSpeedPercentPerLevel: 2
        }
    },

    bountiful_harvest: {
        id: "bountiful_harvest",
        name: "Obfite zbiory",

        description:
            "Daje 10% szansy na zdobycie dodatkowego surowca w kopalni, zielarstwie i łowieniu.",

        tree: "exploration",
        branch: "gathering",
        type: "passive",

        requiredLevel: 20,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            150000
        ],

        prerequisite: {
            skillId: "skilled_hands",
            requiredSkillLevel: 5
        },

        effect: {
            bountifulHarvestChancePercentPerLevel: 10
        }
    },

    enduring_traveler: {
        id: "enduring_traveler",
        name: "Wytrzymały podróżnik",

        description:
            "Zwiększa maksymalne zdrowie o 2% za każdy poziom.",

        tree: "exploration",
        branch: "survival",
        type: "passive",

        requiredLevel: 6,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "keen_eye",
            requiredSkillLevel: 3
        },

        effect: {
            maxHpPercentPerLevel: 2
        }
    },

    swift_return: {
        id: "swift_return",
        name: "Szybki powrót",

        description:
            "Skraca czas odrodzenia po śmierci o 5% za każdy poziom.",

        tree: "exploration",
        branch: "survival",
        type: "passive",

        requiredLevel: 12,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "enduring_traveler",
            requiredSkillLevel: 3
        },

        effect: {
            respawnTimeReductionPercentPerLevel: 5
        }
    },

    unyielding_explorer: {
        id: "unyielding_explorer",
        name: "Nieugięty odkrywca",

        description:
            "Po każdym odrodzeniu zapewnia tarczę równą 30% maksymalnego zdrowia.",

        tree: "exploration",
        branch: "survival",
        type: "passive",

        requiredLevel: 20,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            150000
        ],

        prerequisite: {
            skillId: "swift_return",
            requiredSkillLevel: 5
        },

        effect: {
            respawnShieldMaxHpPercentPerLevel: 30
        }
    },

    sword_mastery: {

        id: "sword_mastery",
        name: "Szkolenie w walce wręcz",

        description:
            "Zwiększa obrażenia podstawowych ataków wszystkimi rodzajami broni do walki wręcz. Łączny bonus na kolejnych poziomach: 1%, 3%, 5%, 7% i 10%.",
        tree: "combat",
        branch: "melee",
        type: "passive",

        requiredLevel: 2,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            100,
            250,
            600,
            1500,
            4000
        ],

        prerequisite: null,

        effect: {
            meleeDamageByLevel: [
                1,
                3,
                5,
                7,
                10
            ]
        }
    },

    sharpened_edge: {
        id: "sharpened_edge",
        name: "Naostrzone ostrze",

        description:
            "Dodaje stałe obrażenia do podstawowych ataków bronią sieczną. Łączny bonus na kolejnych poziomach: 1, 2, 3, 5 i 8 obrażeń.",

        tree: "combat",
        branch: "slashing",
        type: "passive",

        requiredLevel: 8,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "sword_mastery",
            requiredSkillLevel: 3
        },

        effect: {
            slashingFlatDamageByLevel: [
                1,
                2,
                3,
                5,
                8
            ]
        }
    },

    blade_rhythm: {
        id: "blade_rhythm",
        name: "Rytm ostrza",

        description:
            "Zwiększa szybkość podstawowych ataków bronią sieczną o 2% za każdy poziom.",

        tree: "combat",
        branch: "slashing",
        type: "passive",

        requiredLevel: 15,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "sharpened_edge",
            requiredSkillLevel: 3
        },

        effect: {
            slashingAttackSpeedPercentPerLevel: 2
        }
    },

    slashing_capstone: {
        id: "slashing_capstone",
        name: "Nieustające ostrze",

        description:
            "Co czwarty podstawowy atak bronią sieczną zadaje o 60% więcej obrażeń. Odblokowanie tej umiejętności trwale blokuje pozostałe finały Walki.",

        tree: "combat",
        branch: "slashing",
        type: "reactive",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            300000
        ],

        prerequisite: {
            skillId: "blade_rhythm",
            requiredSkillLevel: 5
        },

        effect: {
            slashingCapstoneAttackInterval: 4,
            slashingCapstoneBonusDamagePercent: 60
        }
    },

    crushing_force: {
        id: "crushing_force",
        name: "Miażdżąca siła",

        description:
            "Zwiększa obrażenia niekrytycznych podstawowych ataków bronią obuchową o 3% za każdy poziom.",

        tree: "combat",
        branch: "blunt",
        type: "passive",

        requiredLevel: 8,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "sword_mastery",
            requiredSkillLevel: 3
        },

        effect: {
            bluntNonCriticalDamagePercentPerLevel: 3
        }
    },

    heavy_swing: {
        id: "heavy_swing",
        name: "Ciężki zamach",

        description:
            "Zwiększa obrażenia podstawowych ataków bronią obuchową o 3% za każdy poziom, ale wydłuża czas pomiędzy atakami o 1% za każdy poziom.",

        tree: "combat",
        branch: "blunt",
        type: "passive",

        requiredLevel: 15,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "crushing_force",
            requiredSkillLevel: 3
        },

        effect: {
            bluntDamagePercentPerLevel: 3,
            bluntAttackSpeedPenaltyPercentPerLevel: 1
        }
    },

    blunt_capstone: {
        id: "blunt_capstone",
        name: "Niepowstrzymana siła",

        description:
            "Podstawowe ataki bronią obuchową nie mogą być trafieniami krytycznymi, ale zadają o 30% więcej obrażeń. Odblokowanie tej umiejętności trwale blokuje pozostałe finały Walki.",

        tree: "combat",
        branch: "blunt",
        type: "passive",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            300000
        ],

        prerequisite: {
            skillId: "heavy_swing",
            requiredSkillLevel: 5
        },

        effect: {
            bluntCapstoneDamagePercent: 30,
            bluntCapstoneDisablesCriticalHits: 1
        }
    },

    ranged_mastery: {
        id: "ranged_mastery",
        name: "Mistrzostwo broni dystansowej",

        description:
            "Zwiększa obrażenia podstawowych ataków łukami i kuszami. Łączny bonus na kolejnych poziomach: 1%, 3%, 5%, 7% i 10%.",

        tree: "combat",
        branch: "ranged",
        type: "passive",

        requiredLevel: 2,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            100,
            250,
            600,
            1500,
            4000
        ],

        prerequisite: null,

        effect: {
            rangedDamageByLevel: [
                1,
                3,
                5,
                7,
                10
            ]
        }
    },

    rapid_draw: {
        id: "rapid_draw",
        name: "Płynne naciągnięcie",

        description:
            "Zwiększa szybkość podstawowych ataków łukiem o 2% za każdy poziom.",

        tree: "combat",
        branch: "bow",
        type: "passive",

        requiredLevel: 8,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "ranged_mastery",
            requiredSkillLevel: 3
        },

        effect: {
            bowAttackSpeedPercentPerLevel: 2
        }
    },

    evasive_archery: {
        id: "evasive_archery",
        name: "Lekki krok",

        description:
            "Podczas używania łuku zwiększa szansę na unik o 1% za każdy poziom.",

        tree: "combat",
        branch: "bow",
        type: "passive",

        requiredLevel: 15,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "rapid_draw",
            requiredSkillLevel: 3
        },

        effect: {
            bowDodgeChancePercentPerLevel: 1
        }
    },

    bow_capstone: {
        id: "bow_capstone",
        name: "Wicher strzał",

        description:
            "Podczas używania łuku zwiększa szybkość podstawowych ataków o 25% i szansę na unik o 8%. Odblokowanie tej umiejętności trwale blokuje pozostałe finały Walki.",

        tree: "combat",
        branch: "bow",
        type: "passive",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            300000
        ],

        prerequisite: {
            skillId: "evasive_archery",
            requiredSkillLevel: 5
        },

        effect: {
            bowCapstoneAttackSpeedPercent: 25,
            bowCapstoneDodgeChancePercent: 8
        }
    },

    heavy_bolt: {
        id: "heavy_bolt",
        name: "Ciężki bełt",

        description:
            "Zwiększa obrażenia trafień krytycznych kuszą o 4% za każdy poziom.",

        tree: "combat",
        branch: "crossbow",
        type: "passive",

        requiredLevel: 8,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "ranged_mastery",
            requiredSkillLevel: 3
        },

        effect: {
            crossbowCritDamagePercentPerLevel: 4
        }
    },

    steady_mechanism: {
        id: "steady_mechanism",
        name: "Stabilny mechanizm",

        description:
            "Podczas używania kuszy zwiększa szansę na trafienie krytyczne o 1% za każdy poziom.",

        tree: "combat",
        branch: "crossbow",
        type: "passive",

        requiredLevel: 15,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "heavy_bolt",
            requiredSkillLevel: 3
        },

        effect: {
            crossbowCritChancePercentPerLevel: 1
        }
    },

    crossbow_capstone: {
        id: "crossbow_capstone",
        name: "Mechanizm oblężniczy",

        description:
            "Zwiększa obrażenia podstawowych ataków kuszą o 45%, ale wydłuża czas pomiędzy atakami o 20%. Odblokowanie tej umiejętności trwale blokuje pozostałe finały Walki.",

        tree: "combat",
        branch: "crossbow",
        type: "passive",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            300000
        ],

        prerequisite: {
            skillId: "steady_mechanism",
            requiredSkillLevel: 5
        },

        effect: {
            crossbowCapstoneDamagePercent: 45,
            crossbowCapstoneAttackIntervalPenaltyPercent: 20
        }
    },

    magic_weapon_mastery: {
        id: "magic_weapon_mastery",
        name: "Mistrzostwo broni magicznej",

        description:
            "Zwiększa obrażenia podstawowych ataków różdżkami i kosturami. Łączny bonus na kolejnych poziomach: 1%, 3%, 5%, 7% i 10%.",

        tree: "combat",
        branch: "magic_weapon",
        type: "passive",

        requiredLevel: 2,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            100,
            250,
            600,
            1500,
            4000
        ],

        prerequisite: null,

        effect: {
            magicWeaponDamageByLevel: [
                1,
                3,
                5,
                7,
                10
            ]
        }
    },

    arcane_conduit: {
        id: "arcane_conduit",
        name: "Przewodnik arkanów",

        description:
            "Podczas używania różdżki skraca czas odnowienia wszystkich zaklęć o 2% za każdy poziom.",

        tree: "combat",
        branch: "wand",
        type: "passive",

        requiredLevel: 8,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "magic_weapon_mastery",
            requiredSkillLevel: 3
        },

        effect: {
            wandSpellCooldownReductionPercentPerLevel: 2
        }
    },

    mana_weaving: {
        id: "mana_weaving",
        name: "Splot many",

        description:
            "Podczas używania różdżki zwiększa regenerację many o 0,2 punktu na sekundę za każdy poziom.",

        tree: "combat",
        branch: "wand",
        type: "passive",

        requiredLevel: 15,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "arcane_conduit",
            requiredSkillLevel: 3
        },

        effect: {
            wandManaRegenerationPerSecondPerLevel:
                0.2
        }
    },

    wand_capstone: {
        id: "wand_capstone",
        name: "Wieczny splot",

        description:
            "Podczas używania różdżki zmniejsza koszt wszystkich czarów o 20% i dodatkowo skraca ich czas odnowienia o 15%. Odblokowanie tej umiejętności trwale blokuje pozostałe finały Walki.",

        tree: "combat",
        branch: "wand",
        type: "passive",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            300000
        ],

        prerequisite: {
            skillId: "mana_weaving",
            requiredSkillLevel: 5
        },

        effect: {
            wandCapstoneManaCostReductionPercent:
                20,

            wandCapstoneCooldownReductionPercent:
                15
        }
    },

    mana_resonance: {
        id: "mana_resonance",
        name: "Rezonans many",

        description:
            "Podstawowe ataki kosturem otrzymują dodatkowe obrażenia zależne od maksymalnej many. Kolejne poziomy dodają 0,5%, 1%, 1,5%, 2% i 2,5% maksymalnej many jako obrażenia.",

        tree: "combat",
        branch: "staff",
        type: "passive",

        requiredLevel: 8,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "magic_weapon_mastery",
            requiredSkillLevel: 3
        },

        effect: {
            staffMaxManaDamagePercentByLevel: [
                0.5,
                1,
                1.5,
                2,
                2.5
            ]
        }
    },

    deep_reserves: {
        id: "deep_reserves",
        name: "Głębokie rezerwy",

        description:
            "Podczas używania kostura zwiększa maksymalną manę o 3% za każdy poziom.",

        tree: "combat",
        branch: "staff",
        type: "passive",

        requiredLevel: 15,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "mana_resonance",
            requiredSkillLevel: 3
        },

        effect: {
            staffMaxManaPercentPerLevel: 3
        }
    },

    staff_capstone: {
        id: "staff_capstone",
        name: "Serce arkanów",

        description:
            "Podstawowe ataki kosturem otrzymują dodatkowe obrażenia równe 8% maksymalnej many postaci. Odblokowanie tej umiejętności trwale blokuje pozostałe finały Walki.",

        tree: "combat",
        branch: "staff",
        type: "passive",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            300000
        ],

        prerequisite: {
            skillId: "deep_reserves",
            requiredSkillLevel: 5
        },

        effect: {
            staffCapstoneMaxManaDamagePercent:
                8
        }
    },

    warrior_training: {
        id: "warrior_training",
        name: "Szkolenie wojownika",
        description:
            "Zwiększa obrażenia bronią białą o 2% i maksymalne HP o 1% za każdy poziom.",
        tree: "warrior",
        branch: "warrior_core",
        type: "passive",
        requiredClass: "warrior",

        requiredLevel: 10,
        maxLevel: 5,
        costPerLevel: 1,

        prerequisite: null,

        effect: {
            meleeDamagePercentPerLevel: 2,
            maxHpPercentPerLevel: 1
        }
    },

    power_strike: {
        id: "power_strike",
        name: "Potężne uderzenie",
        description:
            "Atak bronią białą ma 8% szansy za poziom zadać dodatkowe 40% obrażeń.",
        tree: "warrior",
        branch: "warrior_fury",
        type: "reactive",
        requiredClass: "warrior",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "warrior_training",
            requiredSkillLevel: 2
        },

        effect: {
            powerStrikeChancePercentPerLevel: 8,
            powerStrikeBonusDamagePercent: 40
        }
    },

    battle_momentum: {
        id: "battle_momentum",
        name: "Bojowy impet",
        description:
            "Trafienie krytyczne zwiększa obrażenia następnych trzech ataków o 4% za poziom.",
        tree: "warrior",
        branch: "warrior_fury",
        type: "reactive",
        requiredClass: "warrior",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "power_strike",
            requiredSkillLevel: 3
        },

        effect: {
            battleMomentumDamagePercentPerLevel: 4,
            battleMomentumAttackCount: 3
        }
    },

    berserker: {
        id: "berserker",
        name: "Berserker",
        description:
            "Poniżej 35% HP zwiększa obrażenia o 25% i szybkość ataku o 15%.",
        tree: "warrior",
        branch: "warrior_fury",
        type: "reactive",
        requiredClass: "warrior",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 2,

        prerequisite: {
            skillId: "battle_momentum",
            requiredSkillLevel: 3
        },

        effect: {
            berserkerHpThresholdPercent: 35,
            berserkerDamagePercent: 25,
            berserkerAttackSpeedPercent: 15
        }
    },

    serrated_blade: {
        id: "serrated_blade",
        name: "Ząbkowane ostrze",
        description:
            "Atak bronią białą ma 8% szansy za poziom wywołać krwawienie przez 3 sekundy.",
        tree: "warrior",
        branch: "warrior_bleeding",
        type: "reactive",
        requiredClass: "warrior",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "warrior_training",
            requiredSkillLevel: 2
        },

        effect: {
            bleedChancePercentPerLevel: 8,
            bleedDamagePercentPerTick: 20,
            bleedDurationSeconds: 3,
            bleedTickSeconds: 1
        }
    },

    deep_wounds: {
        id: "deep_wounds",
        name: "Głębokie rany",
        description:
            "Zwiększa obrażenia krwawienia o 25% za każdy poziom.",
        tree: "warrior",
        branch: "warrior_bleeding",
        type: "passive",
        requiredClass: "warrior",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "serrated_blade",
            requiredSkillLevel: 3
        },

        effect: {
            bleedDamageBonusPercentPerLevel: 25
        }
    },

    hemorrhage: {
        id: "hemorrhage",
        name: "Krwotok",
        description:
            "Krwawienie może kumulować się trzykrotnie, a nowa rana odświeża wszystkie aktywne krwawienia.",
        tree: "warrior",
        branch: "warrior_bleeding",
        type: "reactive",
        requiredClass: "warrior",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 2,

        prerequisite: {
            skillId: "deep_wounds",
            requiredSkillLevel: 3
        },

        effect: {
            maximumBleedStacks: 3
        }
    },

    hardiness: {
        id: "hardiness",
        name: "Hart ciała",
        description:
            "Zwiększa maksymalne HP o 5% za każdy poziom.",
        tree: "warrior",
        branch: "warrior_defense",
        type: "passive",
        requiredClass: "warrior",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "warrior_training",
            requiredSkillLevel: 2
        },

        effect: {
            maxHpPercentPerLevel: 5
        }
    },

    iron_skin: {
        id: "iron_skin",
        name: "Żelazna skóra",
        description:
            "Zmniejsza otrzymywane obrażenia o 2% za każdy poziom.",
        tree: "warrior",
        branch: "warrior_defense",
        type: "passive",
        requiredClass: "warrior",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "hardiness",
            requiredSkillLevel: 3
        },

        effect: {
            receivedDamageReductionPercentPerLevel: 2
        }
    },

    second_wind: {
        id: "second_wind",
        name: "Drugi oddech",
        description:
            "Raz podczas ciągłej walki, po spadku do 30% HP, automatycznie odzyskuje 20% maksymalnego HP.",
        tree: "warrior",
        branch: "warrior_defense",
        type: "reactive",
        requiredClass: "warrior",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 2,

        prerequisite: {
            skillId: "iron_skin",
            requiredSkillLevel: 3
        },

        effect: {
            secondWindTriggerHpPercent: 30,
            secondWindHealingPercent: 20
        }
    },

    hunter_training: {
        id: "hunter_training",
        name: "Szkolenie łowcy",
        description:
            "Zwiększa obrażenia broni dystansowej o 2% i szansę na trafienie krytyczne o 1% za każdy poziom.",
        tree: "hunter",
        branch: "hunter_core",
        type: "passive",
        requiredClass: "hunter",

        requiredLevel: 10,
        maxLevel: 5,
        costPerLevel: 1,

        prerequisite: null,

        effect: {
            rangedDamagePercentPerLevel: 2,
            critChancePercentPerLevel: 1
        }
    },

    steady_aim: {
        id: "steady_aim",
        name: "Pewna ręka",
        description:
            "Zwiększa szansę na trafienie krytyczne bronią dystansową o 2% za każdy poziom.",
        tree: "hunter",
        branch: "hunter_precision",
        type: "passive",
        requiredClass: "hunter",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "hunter_training",
            requiredSkillLevel: 2
        },

        effect: {
            rangedCritChancePercentPerLevel: 2
        }
    },

    weak_spot: {
        id: "weak_spot",
        name: "Słaby punkt",
        description:
            "Zwiększa obrażenia dystansowych trafień krytycznych o 8% za każdy poziom.",
        tree: "hunter",
        branch: "hunter_precision",
        type: "passive",
        requiredClass: "hunter",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "steady_aim",
            requiredSkillLevel: 3
        },

        effect: {
            rangedCritDamagePercentPerLevel: 8
        }
    },

    sniper: {
        id: "sniper",
        name: "Snajper",
        description:
            "Co szósty atak dystansowy jest trafieniem krytycznym i zadaje dodatkowo 5% obrażeń.",
        tree: "hunter",
        branch: "hunter_precision",
        type: "reactive",
        requiredClass: "hunter",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 2,

        prerequisite: {
            skillId: "weak_spot",
            requiredSkillLevel: 3
        },

        effect: {
            sniperAttackInterval: 6,
            sniperBonusDamagePercent: 5
        }
    },

    quick_draw: {
        id: "quick_draw",
        name: "Szybkie dobycie",
        description:
            "Zwiększa szybkość ataku bronią dystansową o 3% za każdy poziom.",
        tree: "hunter",
        branch: "hunter_volley",
        type: "passive",
        requiredClass: "hunter",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "hunter_training",
            requiredSkillLevel: 2
        },

        effect: {
            rangedAttackSpeedPercentPerLevel: 3
        }
    },

    double_shot: {
        id: "double_shot",
        name: "Podwójny strzał",
        description:
            "Atak dystansowy ma 5% szansy za poziom wystrzelić dodatkowy pocisk zadający 70% obrażeń.",
        tree: "hunter",
        branch: "hunter_volley",
        type: "reactive",
        requiredClass: "hunter",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "quick_draw",
            requiredSkillLevel: 3
        },

        effect: {
            doubleShotChancePercentPerLevel: 5,
            additionalArrowDamagePercent: 70
        }
    },

    arrow_storm: {
        id: "arrow_storm",
        name: "Grad strzał",
        description:
            "Podwójny strzał wystrzeliwuje jeszcze jeden dodatkowy pocisk, również zadający 70% obrażeń.",
        tree: "hunter",
        branch: "hunter_volley",
        type: "reactive",
        requiredClass: "hunter",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 2,

        prerequisite: {
            skillId: "double_shot",
            requiredSkillLevel: 3
        },

        effect: {
            arrowStormAdditionalArrows: 1
        }
    },

    hunter_reflexes: {
        id: "hunter_reflexes",
        name: "Refleks łowcy",
        description:
            "Zwiększa szansę na unik o 2% za każdy poziom.",
        tree: "hunter",
        branch: "hunter_survival",
        type: "passive",
        requiredClass: "hunter",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "hunter_training",
            requiredSkillLevel: 2
        },

        effect: {
            dodgeChancePercentPerLevel: 2
        }
    },

    counter_shot: {
        id: "counter_shot",
        name: "Strzał odwetowy",
        description:
            "Po udanym uniku następny atak dystansowy zadaje o 8% więcej obrażeń za każdy poziom.",
        tree: "hunter",
        branch: "hunter_survival",
        type: "reactive",
        requiredClass: "hunter",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "hunter_reflexes",
            requiredSkillLevel: 3
        },

        effect: {
            counterShotDamagePercentPerLevel: 8,
            counterShotCharges: 1
        }
    },

    tracker: {
        id: "tracker",
        name: "Tropiciel",
        description:
            "Po udanym uniku trzy następne ataki dystansowe zadają o 45% więcej obrażeń.",
        tree: "hunter",
        branch: "hunter_survival",
        type: "reactive",
        requiredClass: "hunter",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 2,

        prerequisite: {
            skillId: "counter_shot",
            requiredSkillLevel: 3
        },

        effect: {
            trackerCounterCharges: 3,
            trackerCounterDamagePercent: 45
        }
    },

    mage_training: {
        id: "mage_training",
        name: "Szkolenie maga",
        description:
            "Zwiększa obrażenia magiczne i maksymalną manę o 2% za każdy poziom.",
        tree: "mage",
        branch: "mage_core",
        type: "passive",
        requiredClass: "mage",

        requiredLevel: 10,
        maxLevel: 5,
        costPerLevel: 1,

        prerequisite: null,

        effect: {
            magicDamagePercentPerLevel: 2,
            maxManaPercentPerLevel: 2
        }
    },

    spell_focus: {
        id: "spell_focus",
        name: "Skupienie zaklęć",
        description:
            "Zwiększa obrażenia magiczne o 4% za każdy poziom.",
        tree: "mage",
        branch: "mage_destruction",
        type: "passive",
        requiredClass: "mage",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "mage_training",
            requiredSkillLevel: 2
        },

        effect: {
            magicDamagePercentPerLevel: 4
        }
    },

    elemental_echo: {
        id: "elemental_echo",
        name: "Echo żywiołów",
        description:
            "Czar ofensywny ma 8% szansy za poziom powtórzyć połowę swoich bezpośrednich obrażeń.",
        tree: "mage",
        branch: "mage_destruction",
        type: "reactive",
        requiredClass: "mage",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "spell_focus",
            requiredSkillLevel: 3
        },

        effect: {
            elementalEchoChancePercentPerLevel: 8,
            elementalEchoDamagePercent: 50
        }
    },

    overload: {
        id: "overload",
        name: "Przeciążenie",
        description:
            "Echo żywiołów powtarza 100% bezpośrednich obrażeń zamiast 50%.",
        tree: "mage",
        branch: "mage_destruction",
        type: "reactive",
        requiredClass: "mage",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 3,

        prerequisite: {
            skillId: "elemental_echo",
            requiredSkillLevel: 3
        },

        effect: {
            overloadEchoDamagePercent: 100
        }
    },

    mana_reservoir: {
        id: "mana_reservoir",
        name: "Rezerwuar many",
        description:
            "Zwiększa maksymalną manę o 5% za każdy poziom.",
        tree: "mage",
        branch: "mage_arcana",
        type: "passive",
        requiredClass: "mage",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "mage_training",
            requiredSkillLevel: 2
        },

        effect: {
            maxManaPercentPerLevel: 5
        }
    },

    arcane_efficiency: {
        id: "arcane_efficiency",
        name: "Wydajność arkanów",
        description:
            "Zmniejsza koszt many wszystkich czarów o 4% za każdy poziom.",
        tree: "mage",
        branch: "mage_arcana",
        type: "passive",
        requiredClass: "mage",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "mana_reservoir",
            requiredSkillLevel: 3
        },

        effect: {
            spellManaCostReductionPercentPerLevel: 4
        }
    },

    mana_overflow: {
        id: "mana_overflow",
        name: "Przepełnienie many",
        description:
            "Powyżej 75% many czary zadają o 20% więcej obrażeń.",
        tree: "mage",
        branch: "mage_arcana",
        type: "reactive",
        requiredClass: "mage",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 3,

        prerequisite: {
            skillId: "arcane_efficiency",
            requiredSkillLevel: 3
        },

        effect: {
            manaOverflowThresholdPercent: 75,
            manaOverflowDamagePercent: 20
        }
    },

    mystic_resilience: {
        id: "mystic_resilience",
        name: "Mistyczna odporność",
        description:
            "Zwiększa maksymalne HP o 3% za każdy poziom.",
        tree: "mage",
        branch: "mage_protection",
        type: "passive",
        requiredClass: "mage",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "mage_training",
            requiredSkillLevel: 2
        },

        effect: {
            maxHpPercentPerLevel: 3
        }
    },

    protective_magic: {
        id: "protective_magic",
        name: "Magia ochronna",
        description:
            "Zwiększa siłę leczenia, barier i tarcz o 6% za każdy poziom.",
        tree: "mage",
        branch: "mage_protection",
        type: "passive",
        requiredClass: "mage",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "mystic_resilience",
            requiredSkillLevel: 3
        },

        effect: {
            defensiveSpellPowerPercentPerLevel: 6
        }
    },

    arcane_rebirth: {
        id: "arcane_rebirth",
        name: "Arkaniczne odrodzenie",
        description:
            "Raz podczas ciągłej walki śmiertelny cios zużywa 30% maksymalnej many i przywraca 25% maksymalnego HP.",
        tree: "mage",
        branch: "mage_protection",
        type: "reactive",
        requiredClass: "mage",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 3,

        prerequisite: {
            skillId: "protective_magic",
            requiredSkillLevel: 3
        },

        effect: {
            arcaneRebirthManaCostPercent: 30,
            arcaneRebirthHealingPercent: 25
        }
    },

    guardian_training: {
        id: "guardian_training",
        name: "Szkolenie strażnika",
        description:
            "Zwiększa obrażenia bronią białą i maksymalne HP o 2% za każdy poziom.",
        tree: "guardian",
        branch: "guardian_core",
        type: "passive",
        requiredClass: "guardian",

        requiredLevel: 10,
        maxLevel: 5,
        costPerLevel: 1,

        effect: {
            meleeDamagePercentPerLevel: 2,
            maxHpPercentPerLevel: 2
        }
    },

    reinforced_armor: {
        id: "reinforced_armor",
        name: "Wzmocniony pancerz",
        description:
            "Zwiększa pancerz z wyposażenia o 5% za każdy poziom.",
        tree: "guardian",
        branch: "guardian_bastion",
        type: "passive",
        requiredClass: "guardian",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "guardian_training",
            requiredSkillLevel: 2
        },

        effect: {
            armorPercentPerLevel: 5
        }
    },

    steadfast: {
        id: "steadfast",
        name: "Niewzruszony",
        description:
            "Zmniejsza otrzymywane obrażenia o 2% za każdy poziom.",
        tree: "guardian",
        branch: "guardian_bastion",
        type: "passive",
        requiredClass: "guardian",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "reinforced_armor",
            requiredSkillLevel: 3
        },

        effect: {
            guardianDamageReductionPercentPerLevel: 2
        }
    },

    fortress: {
        id: "fortress",
        name: "Żywa forteca",
        description:
            "Poniżej 50% HP otrzymujesz o 15% mniej obrażeń.",
        tree: "guardian",
        branch: "guardian_bastion",
        type: "reactive",
        requiredClass: "guardian",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 2,

        prerequisite: {
            skillId: "steadfast",
            requiredSkillLevel: 3
        },

        effect: {
            fortressHpThresholdPercent: 50,
            fortressDamageReductionPercent: 15
        }
    },

    retaliatory_strike: {
        id: "retaliatory_strike",
        name: "Cios odwetowy",
        description:
            "Po otrzymaniu ciosu masz 8% szansy za poziom odpowiedzieć atakiem zadającym 50% obrażeń.",
        tree: "guardian",
        branch: "guardian_retribution",
        type: "reactive",
        requiredClass: "guardian",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "guardian_training",
            requiredSkillLevel: 2
        },

        effect: {
            guardianRetaliationChancePercentPerLevel: 8,
            guardianRetaliationDamagePercent: 50
        }
    },

    vengeful_force: {
        id: "vengeful_force",
        name: "Siła odwetu",
        description:
            "Zwiększa obrażenia ciosu odwetowego o 15% za każdy poziom.",
        tree: "guardian",
        branch: "guardian_retribution",
        type: "passive",
        requiredClass: "guardian",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "retaliatory_strike",
            requiredSkillLevel: 3
        },

        effect: {
            guardianRetaliationDamagePercentPerLevel: 15
        }
    },

    spiked_bulwark: {
        id: "spiked_bulwark",
        name: "Kolczasty bastion",
        description:
            "Co trzeci otrzymany cios zawsze wywołuje odwet.",
        tree: "guardian",
        branch: "guardian_retribution",
        type: "reactive",
        requiredClass: "guardian",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 2,

        prerequisite: {
            skillId: "vengeful_force",
            requiredSkillLevel: 3
        },

        effect: {
            spikedBulwarkHitInterval: 3
        }
    },

    guardian_vitality: {
        id: "guardian_vitality",
        name: "Hart ciała",
        description:
            "Zwiększa maksymalne HP o 4% za każdy poziom.",
        tree: "guardian",
        branch: "guardian_resolve",
        type: "passive",
        requiredClass: "guardian",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "guardian_training",
            requiredSkillLevel: 2
        },

        effect: {
            maxHpPercentPerLevel: 4
        }
    },

    battle_recovery: {
        id: "battle_recovery",
        name: "Bojowa regeneracja",
        description:
            "Co piąty otrzymany cios przywraca 2% maksymalnego HP za każdy poziom.",
        tree: "guardian",
        branch: "guardian_resolve",
        type: "reactive",
        requiredClass: "guardian",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "guardian_vitality",
            requiredSkillLevel: 3
        },

        effect: {
            battleRecoveryHitInterval: 5,
            battleRecoveryHealingPercentPerLevel: 2
        }
    },

    unyielding: {
        id: "unyielding",
        name: "Niezłomność",
        description:
            "Raz podczas ciągłej walki śmiertelny cios przywraca 15% maksymalnego HP, a trzy kolejne ciosy zadają o połowę mniej obrażeń.",
        tree: "guardian",
        branch: "guardian_resolve",
        type: "reactive",
        requiredClass: "guardian",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 2,

        prerequisite: {
            skillId: "battle_recovery",
            requiredSkillLevel: 3
        },

        effect: {
            unyieldingHealingPercent: 15,
            unyieldingGuardCharges: 3,
            unyieldingDamageReductionPercent: 50
        }
    },

    rogue_training: {
        id: "rogue_training",
        name: "Szkolenie łotrzyka",
        description:
            "Zwiększa obrażenia bronią białą o 2% i szansę na unik o 1% za każdy poziom.",
        tree: "rogue",
        branch: "rogue_core",
        type: "passive",
        requiredClass: "rogue",

        requiredLevel: 10,
        maxLevel: 5,
        costPerLevel: 1,

        effect: {
            meleeDamagePercentPerLevel: 2,
            dodgeChancePercentPerLevel: 1
        }
    },

    precise_cut: {
        id: "precise_cut",
        name: "Precyzyjne cięcie",
        description:
            "Zwiększa szansę na trafienie krytyczne o 3% za każdy poziom.",
        tree: "rogue",
        branch: "rogue_assassination",
        type: "passive",
        requiredClass: "rogue",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "rogue_training",
            requiredSkillLevel: 2
        },

        effect: {
            critChancePercentPerLevel: 3
        }
    },

    fatal_precision: {
        id: "fatal_precision",
        name: "Śmiertelna precyzja",
        description:
            "Zwiększa obrażenia trafień krytycznych o 10% za każdy poziom.",
        tree: "rogue",
        branch: "blunt",
        type: "passive",
        requiredClass: "rogue",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "precise_cut",
            requiredSkillLevel: 3
        },

        effect: {
            critDamagePercentPerLevel: 10
        }
    },

    executioner: {
        id: "executioner",
        name: "Egzekutor",
        description:
            "Ataki przeciwko przeciwnikom mającym nie więcej niż 30% HP zadają o 30% więcej obrażeń.",
        tree: "rogue",
        branch: "rogue_assassination",
        type: "reactive",
        requiredClass: "rogue",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 2,

        prerequisite: {
            skillId: "fatal_precision",
            requiredSkillLevel: 3
        },

        effect: {
            executionerEnemyHpThresholdPercent: 30,
            executionerDamagePercent: 30
        }
    },

    quick_blades: {
        id: "quick_blades",
        name: "Szybkie ostrza",
        description:
            "Zwiększa szybkość ataku bronią białą o 4% za każdy poziom.",
        tree: "rogue",
        branch: "rogue_agility",
        type: "passive",
        requiredClass: "rogue",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "rogue_training",
            requiredSkillLevel: 2
        },

        effect: {
            rogueAttackSpeedPercentPerLevel: 4
        }
    },

    shadowstep: {
        id: "shadowstep",
        name: "Krok cienia",
        description:
            "Po uniku następny atak zadaje o 12% więcej obrażeń za każdy poziom.",
        tree: "rogue",
        branch: "rogue_agility",
        type: "reactive",
        requiredClass: "rogue",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "quick_blades",
            requiredSkillLevel: 3
        },

        effect: {
            shadowstepDamagePercentPerLevel: 12
        }
    },

    blade_dance: {
        id: "blade_dance",
        name: "Taniec ostrzy",
        description:
            "Co czwarty atak trafia ponownie, zadając dodatkowe 40% obrażeń.",
        tree: "rogue",
        branch: "rogue_agility",
        type: "reactive",
        requiredClass: "rogue",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 2,

        prerequisite: {
            skillId: "shadowstep",
            requiredSkillLevel: 3
        },

        effect: {
            bladeDanceAttackInterval: 4,
            bladeDanceAdditionalDamagePercent: 40
        }
    },

    poisoned_blade: {
        id: "poisoned_blade",
        name: "Zatrute ostrze",
        description:
            "Atak ma 8% szansy za poziom zatruć przeciwnika na trzy sekundy. Każdy tik zadaje 12% obrażeń ataku.",
        tree: "rogue",
        branch: "rogue_poison",
        type: "reactive",
        requiredClass: "rogue",

        requiredLevel: 12,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "rogue_training",
            requiredSkillLevel: 2
        },

        effect: {
            poisonChancePercentPerLevel: 8,
            poisonDurationSeconds: 3,
            poisonTickSeconds: 1,
            poisonDamagePercentPerTick: 12
        }
    },

    toxin_mastery: {
        id: "toxin_mastery",
        name: "Mistrzostwo toksyn",
        description:
            "Zwiększa obrażenia trucizn o 15% za każdy poziom.",
        tree: "rogue",
        branch: "rogue_poison",
        type: "passive",
        requiredClass: "rogue",

        requiredLevel: 20,
        maxLevel: 3,
        costPerLevel: 1,

        prerequisite: {
            skillId: "poisoned_blade",
            requiredSkillLevel: 3
        },

        effect: {
            poisonDamageBonusPercentPerLevel: 15
        }
    },

    deadly_venom: {
        id: "deadly_venom",
        name: "Śmiercionośny jad",
        description:
            "Trucizna może kumulować się do trzech razy i zadaje o 50% więcej obrażeń.",
        tree: "rogue",
        branch: "rogue_poison",
        type: "reactive",
        requiredClass: "rogue",

        requiredLevel: 30,
        maxLevel: 1,
        costPerLevel: 2,

        prerequisite: {
            skillId: "toxin_mastery",
            requiredSkillLevel: 3
        },

        effect: {
            deadlyVenomMaximumStacks: 3,
            deadlyVenomDamagePercent: 50
        }
    },

    crafting_fundamentals: {
        id: "crafting_fundamentals",
        name: "Podstawy warsztatu",

        description:
            "Zwiększa szybkość wytwarzania i zdobywane doświadczenie Rzemiosła o 1% za każdy poziom.",

        tree: "crafting",
        branch: "crafting_core",
        type: "passive",

        requiredLevel: 2,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            100,
            250,
            600,
            1500,
            4000
        ],

        prerequisite: null,

        effect: {
            craftingSpeedPercentPerLevel: 1,
            craftingExperiencePercentPerLevel: 1
        }
    },
    efficient_workshop: {
        id: "efficient_workshop",
        name: "Sprawny warsztat",

        description:
            "Zwiększa szybkość wytwarzania o 2% za każdy poziom.",

        tree: "crafting",
        branch: "crafting_efficiency",
        type: "passive",

        requiredLevel: 6,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "crafting_fundamentals",
            requiredSkillLevel: 3
        },

        effect: {
            craftingSpeedPercentPerLevel: 2
        }
    },

    batch_production: {
        id: "batch_production",
        name: "Produkcja seryjna",

        description:
            "Każde ukończone wykonanie ma 2% szansy za każdy poziom na natychmiastowe ukończenie jednego dodatkowego cyklu.",

        tree: "crafting",
        branch: "crafting_efficiency",
        type: "passive",

        requiredLevel: 15,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "efficient_workshop",
            requiredSkillLevel: 3
        },

        effect: {
            craftingInstantCycleChancePercentPerLevel:
                2
        }
    },

    automated_line: {
        id: "automated_line",
        name: "Zautomatyzowana linia",

        description:
            "Gdy Produkcja seryjna zapewni darmowy cykl, istnieje 20% szansy za każdy poziom na wykonanie jeszcze jednego darmowego cyklu.",

        tree: "crafting",
        branch: "crafting_efficiency",
        type: "passive",

        requiredLevel: 25,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            10000,
            25000,
            60000,
            150000,
            350000
        ],

        prerequisite: {
            skillId: "batch_production",
            requiredSkillLevel: 5
        },

        effect: {
            craftingSecondInstantCycleChancePercentPerLevel:
                20
        }
    },

    crafting_mass_production_capstone: {
        id: "crafting_mass_production_capstone",
        name: "Masowa produkcja",

        description:
            "Darmowe cykle mogą uruchamiać kolejne darmowe cykle. Z jednego normalnego wykonania można uzyskać maksymalnie 5 darmowych cykli. Odblokowanie tej umiejętności trwale blokuje pozostałe finały Rzemiosła.",

        tree: "crafting",
        branch: "crafting_efficiency",
        type: "passive",

        requiredLevel: 40,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            500000
        ],

        prerequisite: {
            skillId: "automated_line",
            requiredSkillLevel: 5
        },

        effect: {
            craftingMassProductionChainEnabled:
                1,

            craftingMassProductionMaximumBonusCycles:
                5
        }
    },

    efficient_forging: {
        id: "efficient_forging",
        name: "Oszczędne rzemiosło",

        description:
            "Zmniejsza koszt złota wszystkich receptur wytwarzania o 3% za każdy poziom.",

        tree: "crafting",
        branch: "crafting_savings",
        type: "passive",

        requiredLevel: 6,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "crafting_fundamentals",
            requiredSkillLevel: 3
        },

        effect: {
            craftingGoldReductionPercentPerLevel: 3
        }
    },

    material_recovery: {
        id: "material_recovery",
        name: "Odzysk materiałów",

        description:
            "Każde ukończone wykonanie ma 2% szansy za każdy poziom na zwrócenie jednej sztuki każdego użytego materiału.",

        tree: "crafting",
        branch: "crafting_savings",
        type: "passive",

        requiredLevel: 15,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "efficient_forging",
            requiredSkillLevel: 3
        },

        effect: {
            craftingMaterialRecoveryChancePercentPerLevel:
                2
        }
    },

    complete_recovery: {
        id: "complete_recovery",
        name: "Pełny odzysk",

        description:
            "Gdy zadziała Odzysk materiałów, istnieje 20% szansy za każdy poziom na zwrócenie pełnej liczby użytych materiałów zamiast jednej sztuki każdego rodzaju.",

        tree: "crafting",
        branch: "crafting_savings",
        type: "passive",

        requiredLevel: 25,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            10000,
            25000,
            60000,
            150000,
            350000
        ],

        prerequisite: {
            skillId: "material_recovery",
            requiredSkillLevel: 5
        },

        effect: {
            craftingFullRecoveryChancePercentPerLevel:
                20
        }
    },

    crafting_lossless_workshop_capstone: {
        id: "crafting_lossless_workshop_capstone",
        name: "Warsztat bez strat",

        description:
            "Każde ukończone wykonanie ma niezależne 20% szansy na zwrócenie pełnego kosztu wszystkich użytych materiałów. Odblokowanie tej umiejętności trwale blokuje pozostałe finały Rzemiosła.",

        tree: "crafting",
        branch: "crafting_savings",
        type: "passive",

        requiredLevel: 40,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            500000
        ],

        prerequisite: {
            skillId: "complete_recovery",
            requiredSkillLevel: 5
        },

        effect: {
            craftingLosslessWorkshopChancePercent:
                20
        }
    },

    crafting_practice: {
        id: "crafting_practice",
        name: "Praktyka rzemieślnicza",

        description:
            "Zwiększa doświadczenie zdobywane podczas wytwarzania o 3% za każdy poziom.",

        tree: "crafting",
        branch: "crafting_quality",
        type: "passive",

        requiredLevel: 6,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "crafting_fundamentals",
            requiredSkillLevel: 3
        },

        effect: {
            craftingExperiencePercentPerLevel: 3
        }
    },

    quality_control: {
        id: "quality_control",
        name: "Kontrola jakości",

        description:
            "Każde ukończone wykonanie ma 2% szansy za każdy poziom na stworzenie jednej dodatkowej sztuki rezultatu.",

        tree: "crafting",
        branch: "crafting_quality",
        type: "passive",

        requiredLevel: 15,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "crafting_practice",
            requiredSkillLevel: 3
        },

        effect: {
            craftingExtraResultChancePercentPerLevel:
                2
        }
    },

    perfect_batch: {
        id: "perfect_batch",
        name: "Doskonała partia",

        description:
            "Zwiększa liczbę dodatkowych rezultatów otrzymywanych po zadziałaniu Kontroli jakości. Kolejne poziomy dają 1, 1, 2, 2 i 3 dodatkowe sztuki.",

        tree: "crafting",
        branch: "crafting_quality",
        type: "passive",

        requiredLevel: 25,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            10000,
            25000,
            60000,
            150000,
            350000
        ],

        prerequisite: {
            skillId: "quality_control",
            requiredSkillLevel: 5
        },

        effect: {
            craftingExtraResultQuantityByLevel: [
                1,
                1,
                2,
                2,
                3
            ]
        }
    },

    crafting_masterpiece_capstone: {
        id: "crafting_masterpiece_capstone",
        name: "Arcydzieło",

        description:
            "Każde ukończone wykonanie ma 5% szansy na stworzenie Arcydzieła. Materiały i przedmioty stosowalne otrzymują 5 dodatkowych sztuk. Wyposażenie otrzymuje wersję Arcydzieło z podstawowymi statystykami zwiększonymi o 10%. Odblokowanie tej umiejętności trwale blokuje pozostałe finały Rzemiosła.",

        tree: "crafting",
        branch: "crafting_quality",
        type: "passive",

        requiredLevel: 40,
        maxLevel: 1,
        costPerLevel: 3,

        goldCosts: [
            500000
        ],

        prerequisite: {
            skillId: "perfect_batch",
            requiredSkillLevel: 5
        },

        effect: {
            craftingMasterpieceChancePercent:
                5,

            craftingMasterpieceStackBonusQuantity:
                5,

            craftingMasterpieceEquipmentStatPercent:
                10
        }
    },

    trade_fundamentals: {
        id: "trade_fundamentals",
        name: "Podstawy handlu",

        description:
            "Zmniejsza ceny zakupu i zwiększa ceny sprzedaży o 1% za każdy poziom.",

        tree: "trade",
        branch: "trade_core",
        type: "passive",

        requiredLevel: 2,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            100,
            250,
            600,
            1500,
            4000
        ],

        prerequisite: null,

        effect: {
            buyPriceReductionPercentPerLevel:
                1,

            sellPricePercentPerLevel:
                1
        }
    },

    discount_purchases: {
        id: "discount_purchases",
        name: "Tanie zakupy",

        description:
            "Zmniejsza ceny przedmiotów kupowanych w sklepach o 2% za każdy poziom.",

        tree: "trade",
        branch: "trade_buying",
        type: "passive",

        requiredLevel: 6,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "trade_fundamentals",
            requiredSkillLevel: 3
        },

        effect: {
            buyPriceReductionPercentPerLevel:
                2
        }
    },

    bulk_purchasing: {
        id: "bulk_purchasing",
        name: "Zakupy hurtowe",

        description:
            "Przy zakupie co najmniej 10 sztuk tego samego przedmiotu otrzymujesz dodatkowe 2% zniżki za każdy poziom.",

        tree: "trade",
        branch: "trade_buying",
        type: "passive",

        requiredLevel: 15,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "discount_purchases",
            requiredSkillLevel: 3
        },

        effect: {
            bulkPurchaseReductionPercentPerLevel:
                2
        }
    },

    merchant_refund: {
        id: "merchant_refund",
        name: "Zwrot kupiecki",

        description:
            "Każda transakcja zakupu ma 2% szansy za każdy poziom na zwrócenie 50% wydanego złota.",

        tree: "trade",
        branch: "trade_buying",
        type: "passive",

        requiredLevel: 25,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            10000,
            25000,
            60000,
            150000,
            350000
        ],

        prerequisite: {
            skillId: "bulk_purchasing",
            requiredSkillLevel: 5
        },

        effect: {
            merchantRefundChancePercentPerLevel:
                2
        }
    },

    bargaining: {
        /*
         * Zachowujemy stare ID, aby poziom
         * ze starszego zapisu nie zniknął.
         */
        id: "bargaining",
        name: "Targowanie",

        description:
            "Zwiększa cenę sprzedaży przedmiotów o 3% za każdy poziom.",

        tree: "trade",
        branch: "trade_selling",
        type: "passive",

        requiredLevel: 6,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "trade_fundamentals",
            requiredSkillLevel: 3
        },

        effect: {
            sellPricePercentPerLevel:
                3
        }
    },

    expert_appraisal: {
        id: "expert_appraisal",
        name: "Wycena eksperta",

        description:
            "Zwiększa cenę sprzedaży broni, pancerzy, biżuterii i narzędzi profesji o dodatkowe 3% za każdy poziom.",

        tree: "trade",
        branch: "trade_selling",
        type: "passive",

        requiredLevel: 15,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "bargaining",
            requiredSkillLevel: 3
        },

        effect: {
            equipmentSellPricePercentPerLevel:
                3
        }
    },

    hot_merchandise: {
        id: "hot_merchandise",
        name: "Gorący towar",

        description:
            "Każda sprzedawana sztuka ma 2% szansy za każdy poziom na przyniesienie podwójnej ceny sprzedaży.",

        tree: "trade",
        branch: "trade_selling",
        type: "passive",

        requiredLevel: 25,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            10000,
            25000,
            60000,
            150000,
            350000
        ],

        prerequisite: {
            skillId: "expert_appraisal",
            requiredSkillLevel: 5
        },

        effect: {
            hotMerchandiseChancePercentPerLevel:
                2
        }
    },

    merchant_reputation: {
        id: "merchant_reputation",
        name: "Renoma kupiecka",

        description:
            "Zwiększa nagrody w złocie za zlecenia handlowe o 3% za każdy poziom.",

        tree: "trade",
        branch: "trade_orders",
        type: "passive",

        requiredLevel: 6,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            500,
            1200,
            3000,
            7500,
            18000
        ],

        prerequisite: {
            skillId: "trade_fundamentals",
            requiredSkillLevel: 3
        },

        effect: {
            tradeOrderGoldRewardPercentPerLevel:
                3
        }
    },

    experienced_contractor: {
        id: "experienced_contractor",
        name: "Doświadczony zleceniobiorca",

        description:
            "Zwiększa doświadczenie bohatera oraz doświadczenie profesji otrzymywane z zadań o 2% za każdy poziom.",

        tree: "trade",
        branch: "trade_orders",
        type: "passive",

        requiredLevel: 15,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            2500,
            6000,
            15000,
            35000,
            80000
        ],

        prerequisite: {
            skillId: "merchant_reputation",
            requiredSkillLevel: 3
        },

        effect: {
            questExperiencePercentPerLevel:
                2
        }
    },

    timely_completion_bonus: {
        id: "timely_completion_bonus",
        name: "Premia za terminowość",

        description:
            "Każde odebrane zadanie ma 2% szansy za każdy poziom na podwojenie doświadczenia bohatera i profesji.",

        tree: "trade",
        branch: "trade_orders",
        type: "passive",

        requiredLevel: 25,
        maxLevel: 5,
        costPerLevel: 1,

        goldCosts: [
            10000,
            25000,
            60000,
            150000,
            350000
        ],

        prerequisite: {
            skillId: "experienced_contractor",
            requiredSkillLevel: 5
        },

        effect: {
            timelyCompletionChancePercentPerLevel:
                2
        }
    },

    trade_purchase_capstone: {
        id: "trade_purchase_capstone",
        name: "Magnat zakupów",

        description:
            "Zwrot kupiecki zwraca 100% wydanego złota zamiast 50%. Odblokowanie tej umiejętności blokuje pozostałe finały Handlu.",

        tree: "trade",
        branch: "trade_buying",
        type: "passive",

        requiredLevel: 40,
        maxLevel: 1,
        costPerLevel: 5,

        goldCosts: [
            1000000
        ],

        prerequisite: {
            skillId: "merchant_refund",
            requiredSkillLevel: 5
        },

        effect: {
            fullMerchantRefund:
                1
        }
    },

    trade_selling_capstone: {
        id: "trade_selling_capstone",
        name: "Król rynku",

        description:
            "Gorący towar zapewnia potrójną cenę sprzedaży zamiast podwójnej. Odblokowanie tej umiejętności blokuje pozostałe finały Handlu.",

        tree: "trade",
        branch: "trade_selling",
        type: "passive",

        requiredLevel: 40,
        maxLevel: 1,
        costPerLevel: 5,

        goldCosts: [
            1000000
        ],

        prerequisite: {
            skillId: "hot_merchandise",
            requiredSkillLevel: 5
        },

        effect: {
            tripleHotMerchandisePrice:
                1
        }
    },

    trade_orders_capstone: {
    id: "trade_orders_capstone",
    name: "Mistrz kontraktów",

    description:
        "Premia za terminowość podwaja również złoto otrzymywane z zadania. Odblokowanie tej umiejętności blokuje pozostałe finały Handlu.",

    tree: "trade",
    branch: "trade_orders",
    type: "passive",

    requiredLevel: 40,
    maxLevel: 1,
    costPerLevel: 5,

    goldCosts: [
        1000000
    ],

    prerequisite: {
        skillId: "timely_completion_bonus",
        requiredSkillLevel: 5
    },

    effect: {
        timelyCompletionDoubleGold:
            1
    }
},

};

