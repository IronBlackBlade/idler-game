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
        id: "crafting",
        name: "⚒️ Rzemiosło",
        description: "Kowalstwo, alchemia, gotowanie i wytwarzanie."
    },
    {
        id: "trade",
        name: "💰 Handel",
        description: "Lepsze ceny kupna i sprzedaży."
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

