function getTotalStats() {
    const stats = {
        strength: player.stats.strength,
        dexterity: player.stats.dexterity,
        intelligence: player.stats.intelligence,
        endurance: player.stats.endurance,
        luck: player.stats.luck
    };

    const classBonuses =
        getPlayerClassBonuses();

    stats.strength +=
        classBonuses.strength;

    stats.dexterity +=
        classBonuses.dexterity;

    stats.intelligence +=
        classBonuses.intelligence;

    stats.endurance +=
        classBonuses.endurance;

    stats.luck +=
        classBonuses.luck;

    if (!player.equipment) return stats;

    Object.keys(player.equipment).forEach(slot => {
        const itemId = player.equipment[slot];

        if (!itemId) return;

        const item = items[itemId];

        if (!item) return;

        if (item.strength) stats.strength += item.strength;
        if (item.dexterity) stats.dexterity += item.dexterity;
        if (item.intelligence) stats.intelligence += item.intelligence;
        if (item.endurance) stats.endurance += item.endurance;
        if (item.luck) stats.luck += item.luck;
    });

    return stats;
}

function getSafeAttributeValue(
    value
) {
    return Math.max(
        0,
        Number(value) || 0
    );
}

function getSoftCappedAttributeBonus(
    value,
    maximumValue,
    halfwayPoint
) {
    const safeValue =
        getSafeAttributeValue(value);

    if (safeValue <= 0) {
        return 0;
    }

    return (
        maximumValue *
        safeValue /
        (
            safeValue +
            halfwayPoint
        )
    );
}

function getMaximumHpFromEndurance(
    endurance,
    level = player.level
) {
    const safeEndurance =
        getSafeAttributeValue(
            endurance
        );

    const safeLevel = Math.max(
        1,
        Math.floor(
            Number(level) || 1
        )
    );

    return Math.floor(
        50 +
        safeEndurance * 6 +
        (safeLevel - 1) * 10
    );
}

function getMaximumManaFromIntelligence(
    intelligence
) {
    return Math.floor(
        50 +
        getSoftCappedAttributeBonus(
            intelligence,
            600,
            150
        )
    );
}

function getMeleeCritDamageBonusFromStrength(
    strength
) {
    return getSoftCappedAttributeBonus(
        strength,
        25,
        200
    );
}

function getDodgeChanceFromDexterity(
    dexterity
) {
    return getSoftCappedAttributeBonus(
        dexterity,
        35,
        250
    );
}

function getDamageReductionFromEndurance(
    endurance
) {
    return getSoftCappedAttributeBonus(
        endurance,
        45,
        300
    );
}

function getCritChanceFromLuck(
    luck
) {
    return getSoftCappedAttributeBonus(
        luck,
        35,
        150
    );
}

function getCritDamageFromLuck(
    luck
) {
    return (
        150 +
        getSoftCappedAttributeBonus(
            luck,
            75,
            200
        )
    );
}

function getLootBonusFromLuck(
    luck
) {
    return getSoftCappedAttributeBonus(
        luck,
        75,
        250
    );
}

function getDerivedStats() {
    const stats = getTotalStats();

    return {
        maxHp:
            getMaximumHpFromEndurance(
                stats.endurance
            ),

        maxMana:
            getMaximumManaFromIntelligence(
                stats.intelligence
            ),

        generalDamage: 0,

        meleeDamage:
            stats.strength * 0.8,

        meleeCritDamageBonus:
            getMeleeCritDamageBonusFromStrength(
                stats.strength
            ),

        rangedDamage:
            stats.dexterity * 0.8,

        magicDamage:
            stats.intelligence * 0.8,

        defense:
            getDamageReductionFromEndurance(
                stats.endurance
            ),

        dodgeChance:
            getDodgeChanceFromDexterity(
                stats.dexterity
            ),

        critChance:
            getCritChanceFromLuck(
                stats.luck
            ),

        critDamage:
            getCritDamageFromLuck(
                stats.luck
            ),

        lootBonus:
            getLootBonusFromLuck(
                stats.luck
            )
    };
}

const weaponCombatSettings = {
    default: {
        attackIntervalMs: 1000,
        damageMultiplier: 1,
        label: "Standardowa"
    },

    bow: {
        attackIntervalMs: 800,
        damageMultiplier: 1,
        label: "Łuk"
    },

    crossbow: {
        attackIntervalMs: 1400,
        damageMultiplier: 1.75,
        label: "Kusza"
    },

    crossbow: {
        attackIntervalMs: 1400,
        damageMultiplier: 1.75,
        label: "Kusza"
    },

    wand: {
        attackIntervalMs: 850,
        damageMultiplier: 1,
        label: "Różdżka"
    },

    staff: {
        attackIntervalMs: 1300,
        damageMultiplier: 1.5,
        label: "Kostur"
    }
};

function getWeaponCombatSettings(
    weapon
) {
    const weaponClass =
        weapon?.weaponClass ||
        "default";

    return (
        weaponCombatSettings[
        weaponClass
        ] ||
        weaponCombatSettings.default
    );
}

function getWeaponCombatLabels(
    weapon
) {
    if (!weapon?.weaponClass) {
        return [];
    }

    const settings =
        getWeaponCombatSettings(
            weapon
        );

    const attackTime =
        (
            settings.attackIntervalMs /
            1000
        )
            .toFixed(1)
            .replace(".", ",");

    const labels = [
        "Rodzaj: " + settings.label,
        "Atak co: " + attackTime + " s"
    ];

    const damageBonus =
        Math.round(
            (
                settings.damageMultiplier -
                1
            ) *
            100
        );

    if (damageBonus > 0) {
        labels.push(
            "Siła trafienia: +" +
            damageBonus +
            "%"
        );
    }

    return labels;
}

function getAttack() {
    const derived =
        getDerivedStats();

    const weaponId =
        player.equipment.weapon;

    const weapon =
        weaponId
            ? items[weaponId]
            : null;

    let damage = 0;

    if (!weapon) {
        const meleeBonus =
            typeof getMeleeDamageSkillBonus ===
                "function"
                ? getMeleeDamageSkillBonus()
                : 0;

        const baseDamage =
            derived.meleeDamage;

        damage = Math.floor(
            baseDamage *
            (
                1 +
                meleeBonus / 100
            )
        );
    } else if (
        weapon.weaponType === "melee"
    ) {
        const meleeBonus =
            typeof getMeleeDamageSkillBonus ===
                "function"
                ? getMeleeDamageSkillBonus()
                : 0;

        const baseDamage =
            (weapon.damage || 0) +
            derived.meleeDamage;

        damage = Math.floor(
            baseDamage *
            (
                1 +
                meleeBonus / 100
            )
        );

    } else if (
        weapon.weaponType === "ranged"
    ) {
        const baseDamage =
            (weapon.damage || 0) +
            derived.rangedDamage;

        const combatSettings =
            getWeaponCombatSettings(
                weapon
            );

        damage = Math.floor(
            baseDamage *
            combatSettings.damageMultiplier
        );

    } else if (
        weapon.weaponType === "magic"
    ) {
        const magicBonus =
            typeof getMagicDamageSkillBonus ===
                "function"
                ? getMagicDamageSkillBonus()
                : 0;

        const baseDamage =
            (weapon.damage || 0) +
            derived.magicDamage;
        const combatSettings =
            getWeaponCombatSettings(
                weapon
            );
        damage = Math.floor(
            baseDamage *
            (
                1 +
                magicBonus / 100
            ) *
            combatSettings.damageMultiplier
        );
    } else {
        damage = Math.floor(
            (weapon.damage || 0) +
            derived.meleeDamage
        );
    }

    return applyWeaponDamagePotionBonus(
        damage,
        weapon
    );
}

function applySpellDamagePotionBonus(
    damage
) {
    const safeDamage =
        Math.max(
            0,
            Number(damage) || 0
        );

    const potionBonus =
        getActivePotionEffectValue(
            "spell_damage"
        );

    const damageMultiplier =
        1 + potionBonus / 100;

    return Math.floor(
        safeDamage *
        damageMultiplier
    );
}

function getActivePotionEffectValue(
    effectId
) {
    const potionEffects =
        player.activeEffects
            ?.potionEffects;

    if (
        !potionEffects ||
        typeof potionEffects !== "object"
    ) {
        return 0;
    }

    const effect =
        potionEffects[effectId];

    if (!effect) {
        return 0;
    }

    const expiresAt =
        Number(effect.expiresAt) || 0;

    if (expiresAt <= Date.now()) {
        return 0;
    }

    return Math.max(
        0,
        Number(effect.value) || 0
    );
}

function applyCombatDefensePotionReduction(
    damage
) {
    const safeDamage =
        Math.max(
            0,
            Number(damage) || 0
        );

    const potionReduction =
        getActivePotionEffectValue(
            "combat_defense"
        );

    const damageMultiplier =
        1 - potionReduction / 100;

    return Math.max(
        1,
        Math.floor(
            safeDamage *
            damageMultiplier
        )
    );
}

function getWeaponPotionEffectId(
    weapon
) {
    if (
        !weapon ||
        weapon.weaponType === "melee"
    ) {
        return "melee_weapon_damage";
    }

    if (
        weapon.weaponType === "ranged"
    ) {
        return "ranged_weapon_damage";
    }

    if (
        weapon.weaponType === "magic"
    ) {
        return "magic_weapon_damage";
    }

    return null;
}

function applyWeaponDamagePotionBonus(
    damage,
    weapon
) {
    const safeDamage =
        Math.max(
            0,
            Number(damage) || 0
        );

    const effectId =
        getWeaponPotionEffectId(
            weapon
        );

    if (!effectId) {
        return Math.floor(
            safeDamage
        );
    }

    const potionBonus =
        getActivePotionEffectValue(
            effectId
        );

    const damageMultiplier =
        1 + potionBonus / 100;

    return Math.floor(
        safeDamage *
        damageMultiplier
    );
}

function calculatePlayerDamage() {
    const derived =
        getDerivedStats();

    let damage =
        getAttack();

    const weaponId =
        player.equipment
            ?.weapon;

    const weapon =
        weaponId
            ? items[weaponId]
            : null;

    /*
     * Brak broni traktujemy jak
     * podstawowy atak w zwarciu.
     */
    const isMeleeAttack =
        !weapon ||
        weapon.weaponType ===
        "melee";

    const critRoll =
        Math.random() * 100;

    const isCritical =
        critRoll <=
        derived.critChance;

    if (isCritical) {
        const meleeCritBonus =
            isMeleeAttack
                ? derived
                    .meleeCritDamageBonus
                : 0;

        const totalCritDamage =
            derived.critDamage +
            meleeCritBonus;

        damage = Math.floor(
            damage *
            (
                totalCritDamage /
                100
            )
        );

        return {
            damage: damage,
            isCritical: true
        };
    }

    return {
        damage: damage,
        isCritical: false
    };
}