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

function getEquipmentFlatBonuses() {
    const bonuses = {
        armor: 0,
        critChance: 0,
        critDamage: 0,
        dodgeChance: 0,
        lootBonus: 0
    };

    if (!player.equipment) {
        return bonuses;
    }

    Object.values(
        player.equipment
    ).forEach(itemId => {
        if (!itemId) return;

        const item = items[itemId];

        if (!item) return;

        Object.keys(bonuses)
            .forEach(statKey => {
                bonuses[statKey] +=
                    Number(
                        item[statKey]
                    ) || 0;
            });
    });

    return bonuses;
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

    const foodMaxHpBonus =
        typeof getActiveFoodBonus === "function"
            ? getActiveFoodBonus("maxHpPercent")
            : 0;
    const foodArmorBonus =
        typeof getActiveFoodBonus === "function"
            ? getActiveFoodBonus("armorPercent")
            : 0;
    const foodDodgeBonus =
        typeof getActiveFoodBonus === "function"
            ? getActiveFoodBonus("dodgeChance")
            : 0;
    const foodCritBonus =
        typeof getActiveFoodBonus === "function"
            ? getActiveFoodBonus("critChance")
            : 0;

    const equipmentSetBonuses =
        typeof getActiveEquipmentSetBonuses ===
            "function"
            ? getActiveEquipmentSetBonuses()
            : {
                maxHpPercent: 0,
                armorPercent: 0,
                dodgeChance: 0,
                critChance: 0,
                huntingLootBonusPercent: 0
            };

    const equipmentFlatBonuses =
        getEquipmentFlatBonuses();

    const baseMaximumHp =
        getMaximumHpFromEndurance(
            stats.endurance
        );

    const maximumHpSkillBonus =
        typeof getSkillEffectValue ===
            "function"
            ? getSkillEffectValue(
                "maxHpPercentPerLevel"
            )
            : 0;
    const bowDodgeChanceBonus =
        typeof getBowDodgeChanceSkillBonus ===
            "function"
            ? getBowDodgeChanceSkillBonus()
            : 0;

    const crossbowCritChanceBonus =
        typeof getCrossbowCritChanceSkillBonus ===
            "function"
            ? getCrossbowCritChanceSkillBonus()
            : 0;

    const staffMaxManaBonus =
        typeof getStaffMaxManaSkillBonus ===
            "function"
            ? getStaffMaxManaSkillBonus()
            : 0;
    const bowCapstoneDodgeBonus =
        typeof getBowCapstoneDodgeBonus ===
            "function"
            ? getBowCapstoneDodgeBonus()
            : 0;
    return {
        maxHp:
            Math.max(
                1,
                Math.floor(
                    baseMaximumHp *
                    (
                        1 +
                        (
                            maximumHpSkillBonus +
                            foodMaxHpBonus +
                            equipmentSetBonuses
                                .maxHpPercent
                        ) /
                        100
                    )
                )
            ),

        maxMana:
            Math.max(
                0,
                Math.floor(
                    getMaximumManaFromIntelligence(
                        stats.intelligence
                    ) *
                    (
                        1 +
                        (
                            (
                                typeof getSkillEffectValue ===
                                    "function"
                                    ? getSkillEffectValue(
                                        "maxManaPercentPerLevel"
                                    )
                                    : 0
                            ) +
                            staffMaxManaBonus
                        ) /
                        100
                    )
                )
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

        armor:
            Math.max(
                0,
                Math.floor(
                    equipmentFlatBonuses.armor *
                    (
                        100 +
                        (
                            typeof getSkillEffectValue ===
                                "function"
                                ? getSkillEffectValue(
                                    "armorPercentPerLevel"
                                )
                                : 0
                        ) +
                        foodArmorBonus +
                        equipmentSetBonuses
                            .armorPercent
                    ) /
                    100
                )
            ),

        defense:
            getDamageReductionFromEndurance(
                stats.endurance
            ),

        dodgeChance:
            Math.max(
                0,
                Math.min(
                    75,
                    getDodgeChanceFromDexterity(
                        stats.dexterity
                    ) +
                    equipmentFlatBonuses
                        .dodgeChance +
                    (
                        typeof getSkillEffectValue ===
                            "function"
                            ? getSkillEffectValue(
                                "dodgeChancePercentPerLevel"
                            )
                            : 0
                    ) +
                    foodDodgeBonus +
                    equipmentSetBonuses
                        .dodgeChance +
                    bowDodgeChanceBonus +
                    bowCapstoneDodgeBonus
                )
            ),

        critChance:
            Math.max(
                0,
                Math.min(
                    75,
                    getCritChanceFromLuck(
                        stats.luck
                    ) +
                    equipmentFlatBonuses
                        .critChance +
                    (
                        typeof getSkillEffectValue ===
                            "function"
                            ? getSkillEffectValue(
                                "critChancePercentPerLevel"
                            )
                            : 0
                    ) +
                    foodCritBonus +
                    equipmentSetBonuses
                        .critChance +
                    (
                        typeof isHunterRangedAttack ===
                            "function" &&
                            isHunterRangedAttack()
                            ? getSkillEffectValue(
                                "rangedCritChancePercentPerLevel"
                            )
                            : 0
                    ) +
                    crossbowCritChanceBonus
                )
            ),

        critDamage:
            Math.max(
                100,
                getCritDamageFromLuck(
                    stats.luck
                ) +
                equipmentFlatBonuses
                    .critDamage +
                (
                    typeof getSkillEffectValue ===
                        "function"
                        ? getSkillEffectValue(
                            "critDamagePercentPerLevel"
                        )
                        : 0
                )
            ),

        lootBonus:
            Math.max(
                0,
                getLootBonusFromLuck(
                    stats.luck
                ) +
                equipmentFlatBonuses
                    .lootBonus +
                equipmentSetBonuses
                    .huntingLootBonusPercent
            )
    };
}

const weaponCombatSettings = {
    default: {
        attackIntervalMs: 1000,
        damageMultiplier: 1,
        label: "Standardowa"
    },

    slashing: {
        attackIntervalMs: 1000,
        damageMultiplier: 1,
        label: "Broń sieczna"
    },

    blunt: {
        attackIntervalMs: 1000,
        damageMultiplier: 1,
        label: "Broń obuchowa"
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

    const baseSettings =
        weaponCombatSettings[
        weaponClass
        ] ||
        weaponCombatSettings.default;

    /*
     * Premie przyspieszające.
     */
    const bowAttackSpeedBonus =
        typeof getBowAttackSpeedSkillBonus ===
            "function"
            ? getBowAttackSpeedSkillBonus(
                weapon
            )
            : 0;
    const bowCapstoneAttackSpeedBonus =
        typeof getBowCapstoneAttackSpeedBonus ===
            "function"
            ? getBowCapstoneAttackSpeedBonus(
                weapon
            )
            : 0;

    const slashingAttackSpeedBonus =
        typeof getSlashingAttackSpeedSkillBonus ===
            "function"
            ? getSlashingAttackSpeedSkillBonus(
                weapon
            )
            : 0;

    /*
     * Kara do szybkości broni obuchowej.
     */
    const bluntAttackSpeedPenalty =
        typeof getBluntAttackSpeedPenaltySkillBonus ===
            "function"
            ? getBluntAttackSpeedPenaltySkillBonus(
                weapon
            )
            : 0;

    const crossbowCapstoneAttackPenalty =
        typeof getCrossbowCapstoneAttackIntervalPenalty ===
            "function"
            ? getCrossbowCapstoneAttackIntervalPenalty(
                weapon
            )
            : 0;

    const totalAttackSpeedBonus =
        Math.max(
            0,
            bowAttackSpeedBonus +
            bowCapstoneAttackSpeedBonus +
            slashingAttackSpeedBonus
        );

    let attackIntervalMs =
        Math.max(
            100,
            Number(
                baseSettings.attackIntervalMs
            ) || 1000
        );

    /*
     * Większa szybkość oznacza
     * krótszy odstęp między atakami.
     */
    if (
        totalAttackSpeedBonus > 0
    ) {
        attackIntervalMs /=
            1 +
            totalAttackSpeedBonus /
            100;
    }

    const totalAttackIntervalPenalty =
        Math.max(
            0,
            bluntAttackSpeedPenalty +
            crossbowCapstoneAttackPenalty
        );

    if (
        totalAttackIntervalPenalty > 0
    ) {
        attackIntervalMs *=
            1 +
            totalAttackIntervalPenalty /
            100;
    }

    return {
        ...baseSettings,

        attackIntervalMs:
            Math.max(
                100,
                Math.floor(
                    attackIntervalMs
                )
            )
    };
}

function isSlashingWeapon(
    weapon
) {
    return (
        weapon?.weaponType ===
        "melee" &&
        weapon?.weaponClass ===
        "slashing"
    );
}

function isBluntWeapon(
    weapon
) {
    return (
        weapon?.weaponType ===
        "melee" &&
        weapon?.weaponClass ===
        "blunt"
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

        const slashingFlatDamageBonus =
            typeof getSlashingFlatDamageSkillBonus ===
                "function"
                ? getSlashingFlatDamageSkillBonus(
                    weapon
                )
                : 0;
        const bluntDamageBonus =
            typeof getBluntDamageSkillBonus ===
                "function"
                ? getBluntDamageSkillBonus(
                    weapon
                )
                : 0;

        const baseDamage =
            (weapon.damage || 0) +
            derived.meleeDamage +
            slashingFlatDamageBonus;

        damage = Math.floor(
            baseDamage *
            (
                1 +
                meleeBonus / 100
            ) *
            (
                1 +
                bluntDamageBonus / 100
            )
        );

    } else if (
        weapon.weaponType === "ranged"
    ) {
        const rangedBonus =
            typeof getRangedDamageSkillBonus ===
                "function"
                ? getRangedDamageSkillBonus()
                : 0;
        const crossbowCapstoneDamageBonus =
            typeof getCrossbowCapstoneDamageBonus ===
                "function"
                ? getCrossbowCapstoneDamageBonus(
                    weapon
                )
                : 0;

        const baseDamage =
            (weapon.damage || 0) +
            derived.rangedDamage;

        const combatSettings =
            getWeaponCombatSettings(
                weapon
            );

        damage = Math.floor(
            baseDamage *
            (
                1 +
                rangedBonus / 100
            ) *
            combatSettings.damageMultiplier *
            (
                1 +
                crossbowCapstoneDamageBonus /
                100
            )
        );

    } else if (
        weapon.weaponType === "magic"
    ) {
        const magicBonus =
            typeof getMagicDamageSkillBonus ===
                "function"
                ? getMagicDamageSkillBonus()
                : 0;

        const staffManaDamageBonus =
            typeof getStaffManaDamageSkillBonus ===
                "function"
                ? getStaffManaDamageSkillBonus(
                    weapon,
                    derived.maxMana
                )
                : 0;

        const staffCapstoneManaDamageBonus =
            typeof getStaffCapstoneManaDamageBonus ===
                "function"
                ? getStaffCapstoneManaDamageBonus(
                    weapon,
                    derived.maxMana
                )
                : 0;

        const baseDamage =
            (weapon.damage || 0) +
            derived.magicDamage +
            staffManaDamageBonus +
            staffCapstoneManaDamageBonus;
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
    const isMeleeAttack =
        !weapon ||
        weapon.weaponType ===
        "melee";


    const weaponCritChanceBonus =
        typeof getCombatWeaponCritChanceBonus ===
            "function"
            ? getCombatWeaponCritChanceBonus(
                weapon
            )
            : 0;

    const totalCritChance =
        Math.max(
            0,
            Math.min(
                75,
                derived.critChance +
                weaponCritChanceBonus
            )
        );

    const critRoll =
        Math.random() * 100;

    const criticalHitsDisabled =
        typeof shouldDisableCombatCapstoneCriticalHits ===
            "function"
            ? shouldDisableCombatCapstoneCriticalHits(
                weapon
            )
            : false;

    const isCritical =
        !criticalHitsDisabled &&
        critRoll <=
        totalCritChance;

    let attackResult;

    if (isCritical) {
        const meleeCritBonus =
            isMeleeAttack
                ? derived
                    .meleeCritDamageBonus
                : 0;

        const crossbowCritDamageBonus =
            typeof getCrossbowCritDamageSkillBonus ===
                "function"
                ? getCrossbowCritDamageSkillBonus(
                    weapon
                )
                : 0;

        const totalCritDamage =
            derived.critDamage +
            meleeCritBonus +
            crossbowCritDamageBonus;


        const weaponCritDamageBonus =
            typeof getCombatWeaponCritDamageBonus ===
                "function"
                ? getCombatWeaponCritDamageBonus(
                    weapon
                )
                : 0;

        damage = Math.floor(
            damage *
            (
                totalCritDamage /
                100
            )
        );

        attackResult = {
            damage: damage,
            isCritical: true
        };
    } else {
        const bluntDamageBonus =
            typeof getBluntNonCriticalDamageSkillBonus ===
                "function"
                ? getBluntNonCriticalDamageSkillBonus(
                    weapon
                )
                : 0;

        damage = Math.floor(
            damage *
            (
                1 +
                bluntDamageBonus / 100
            )
        );

        attackResult = {
            damage: damage,
            isCritical: false
        };
    }
    if (
        typeof applyCombatWeaponCapstoneAttackModifiers ===
        "function"
    ) {
        attackResult =
            applyCombatWeaponCapstoneAttackModifiers(
                attackResult,
                weapon
            );
    }
    if (
        typeof applyWarriorAttackModifiers ===
        "function"
    ) {
        attackResult =
            applyWarriorAttackModifiers(
                attackResult
            );
    }

    if (
        typeof applyHunterAttackModifiers ===
        "function"
    ) {
        attackResult =
            applyHunterAttackModifiers(
                attackResult
            );
    }

    if (
        typeof applyRogueAttackModifiers ===
        "function"
    ) {
        attackResult =
            applyRogueAttackModifiers(
                attackResult
            );
    }

    return attackResult;
}
