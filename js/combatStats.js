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

function getDerivedStats() {
    const stats = getTotalStats();

    return {
        maxHp: Math.floor(
            50 + stats.endurance * 10 + (player.level - 1) * 10
        ),

        maxMana: Math.floor(
            20 + stats.intelligence * 10
        ),

        generalDamage: 0,

        meleeDamage:
            stats.strength * 1.8,

        meleeCritDamageBonus:
            Math.min(
                30,
                stats.strength * 0.25
            ),

        rangedDamage:
            stats.dexterity * 1.8,

        magicDamage:
            stats.intelligence * 1.8,

        defense: stats.endurance * 0.5,

        dodgeChance: Math.min(
            40,
            stats.dexterity * 0.4
        ),

        critChance: Math.min(
            50,
            stats.luck * 0.4
        ),

        critDamage: 150 + stats.luck,

        lootBonus: stats.luck
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