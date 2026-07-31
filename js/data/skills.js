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
        description: "Kowalstwo, alchemia, gotowanie i wytwarzanie."
    },
    {
        id: "trade",
        name: "💰 Handel",
        description: "Lepsze ceFny kupna i sprzedaży."
    }
];

const skills = {
    arcane_knowledge: {
        id: "arcane_knowledge",
        name: "Wiedza tajemna",
        description: "Zwiększa obrażenia magiczne o 3% za każdy poziom.",
        tree: "magic",
        branch: "general",
        type: "passive",

        requiredLevel: 2,
        maxLevel: 5,
        costPerLevel: 1,

        prerequisite: null,

        effect: {
            magicDamagePercentPerLevel: 3
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

    prerequisite: {
        skillId: "arcane_knowledge",
        requiredSkillLevel: 1
    },

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

    prerequisite: {
        skillId: "arcane_knowledge",
        requiredSkillLevel: 1
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

    prerequisite: {
        skillId: "arcane_knowledge",
        requiredSkillLevel: 2
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

    prerequisite: {
        skillId: "fireball",
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

    prerequisite: {
        skillId: "ignite",
        requiredSkillLevel: 3
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

    prerequisite: {
        skillId: "arcane_knowledge",
        requiredSkillLevel: 1
    },

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

    prerequisite: {
        skillId: "arcane_knowledge",
        requiredSkillLevel: 1
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

    prerequisite: {
        skillId: "arcane_barrier",
        requiredSkillLevel: 2
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

    prerequisite: {
        skillId: "healing",
        requiredSkillLevel: 2
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

    prerequisite: {
        skillId: "mana_shield",
        requiredSkillLevel: 3
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

    keen_eye: {
        id: "keen_eye",
        name: "Bystre oko",
        description: "Zwiększa szansę na zdobycie przedmiotów o 2% za każdy poziom.",
        tree: "exploration",
        branch: "loot",
        type: "passive",

        requiredLevel: 2,
        maxLevel: 5,
        costPerLevel: 1,

        prerequisite: null,

        effect: {
            lootChancePercentPerLevel: 2
        }
    },

    sword_mastery: {
        id: "sword_mastery",
        name: "Mistrzostwo broni białej",
        description: "Zwiększa obrażenia bronią białą o 3% za każdy poziom.",
        tree: "combat",
        branch: "melee",
        type: "passive",

        requiredLevel: 2,
        maxLevel: 10,
        costPerLevel: 1,

        prerequisite: null,

        effect: {
            meleeDamagePercentPerLevel: 3
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
        costPerLevel: 2,

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
        costPerLevel: 2,

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
        costPerLevel: 2,

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
        branch: "rogue_assassination",
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

    efficient_forging: {
        id: "efficient_forging",
        name: "Wydajne kucie",
        description: "Zmniejsza koszt złota u kowala o 3% za każdy poziom.",
        tree: "crafting",
        branch: "blacksmithing",
        type: "passive",

        requiredLevel: 3,
        maxLevel: 5,
        costPerLevel: 1,

        prerequisite: null,

        effect: {
            craftingGoldReductionPercentPerLevel: 3
        }
    },

    

    bargaining: {
        id: "bargaining",
        name: "Targowanie",
        description: "Zwiększa cenę sprzedaży przedmiotów o 3% za każdy poziom.",
        tree: "trade",
        branch: "selling",
        type: "passive",

        requiredLevel: 3,
        maxLevel: 5,
        costPerLevel: 1,

        prerequisite: null,

        effect: {
            sellPricePercentPerLevel: 3
        }
    }
};

