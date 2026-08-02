function createEquipmentSetCombatState() {
    return {
        commanderDefenseTriggered: false,
        commanderDefenseCharges: 0,
        dragonBurnDamagePerTick: 0,
        dragonBurnTicksRemaining: 0
    };
}

var equipmentSetCombatState =
    createEquipmentSetCombatState();

function resetEquipmentSetCombatState() {
    equipmentSetCombatState =
        createEquipmentSetCombatState();
}

function clearEquipmentSetEnemyEffects() {
    equipmentSetCombatState
        .dragonBurnDamagePerTick = 0;
    equipmentSetCombatState
        .dragonBurnTicksRemaining = 0;
}

function getEquipmentSetCombatState() {
    return {
        ...equipmentSetCombatState
    };
}

function applyCommanderDefenseToDamage(
    incomingDamage,
    maximumHp
) {
    const safeDamage = Math.max(
        0,
        Math.floor(
            Number(incomingDamage) || 0
        )
    );
    const effect =
        typeof getActiveEquipmentSetUniqueEffect ===
            "function"
            ? getActiveEquipmentSetUniqueEffect(
                "commander_unyielding_defense"
            )
            : null;

    if (!effect || safeDamage <= 0) {
        equipmentSetCombatState
            .commanderDefenseCharges = 0;

        return {
            damage: safeDamage,
            triggered: false,
            active: false,
            reducedBy: 0,
            chargesRemaining: 0
        };
    }

    let triggered = false;

    if (
        !equipmentSetCombatState
            .commanderDefenseTriggered &&
        equipmentSetCombatState
            .commanderDefenseCharges <= 0
    ) {
        const safeMaximumHp = Math.max(
            1,
            Number(maximumHp) || 1
        );
        const activationHp =
            safeMaximumHp *
            effect.hpThresholdPercent /
            100;
        const projectedHp =
            (Number(player.hp) || 0) -
            safeDamage;

        if (projectedHp <= activationHp) {
            equipmentSetCombatState
                .commanderDefenseTriggered =
                true;
            equipmentSetCombatState
                .commanderDefenseCharges =
                Math.max(
                    1,
                    Number(effect.hitCount) || 1
                );
            triggered = true;
        }
    }

    if (
        equipmentSetCombatState
            .commanderDefenseCharges <= 0
    ) {
        return {
            damage: safeDamage,
            triggered: false,
            active: false,
            reducedBy: 0,
            chargesRemaining: 0
        };
    }

    const reducedDamage = Math.max(
        1,
        Math.floor(
            safeDamage *
            (
                1 -
                effect.damageReductionPercent /
                100
            )
        )
    );

    equipmentSetCombatState
        .commanderDefenseCharges--;

    return {
        damage: reducedDamage,
        triggered,
        active: true,
        reducedBy:
            safeDamage -
            reducedDamage,
        chargesRemaining:
            equipmentSetCombatState
                .commanderDefenseCharges,
        effect
    };
}

function applyDragonWrathBurn(
    criticalDamage
) {
    const effect =
        typeof getActiveEquipmentSetUniqueEffect ===
            "function"
            ? getActiveEquipmentSetUniqueEffect(
                "dragon_wrath_burn"
            )
            : null;
    const safeCriticalDamage = Math.max(
        0,
        Math.floor(
            Number(criticalDamage) || 0
        )
    );

    if (!effect || safeCriticalDamage <= 0) {
        return {
            applied: false,
            refreshed: false,
            damagePerTick: 0,
            ticksRemaining: 0
        };
    }

    const refreshed =
        equipmentSetCombatState
            .dragonBurnTicksRemaining > 0;
    const damagePerTick = Math.max(
        1,
        Math.floor(
            safeCriticalDamage *
            effect.damagePercentPerTick /
            100
        )
    );

    equipmentSetCombatState
        .dragonBurnDamagePerTick =
        Math.max(
            equipmentSetCombatState
                .dragonBurnDamagePerTick,
            damagePerTick
        );
    equipmentSetCombatState
        .dragonBurnTicksRemaining =
        Math.max(
            1,
            Number(effect.tickCount) || 1
        );

    return {
        applied: true,
        refreshed,
        damagePerTick:
            equipmentSetCombatState
                .dragonBurnDamagePerTick,
        ticksRemaining:
            equipmentSetCombatState
                .dragonBurnTicksRemaining,
        effect
    };
}

function collectDragonWrathBurnDamage() {
    const effect =
        typeof getActiveEquipmentSetUniqueEffect ===
            "function"
            ? getActiveEquipmentSetUniqueEffect(
                "dragon_wrath_burn"
            )
            : null;

    if (
        !effect ||
        equipmentSetCombatState
            .dragonBurnTicksRemaining <= 0
    ) {
        clearEquipmentSetEnemyEffects();
        return 0;
    }

    const damage = Math.max(
        0,
        Math.floor(
            equipmentSetCombatState
                .dragonBurnDamagePerTick
        )
    );

    equipmentSetCombatState
        .dragonBurnTicksRemaining--;

    if (
        equipmentSetCombatState
            .dragonBurnTicksRemaining <= 0
    ) {
        equipmentSetCombatState
            .dragonBurnDamagePerTick = 0;
    }

    return damage;
}

function getOfflineCommanderDefenseEffectiveHp(
    damagePerHit
) {
    const effect =
        typeof getActiveEquipmentSetUniqueEffect ===
            "function"
            ? getActiveEquipmentSetUniqueEffect(
                "commander_unyielding_defense"
            )
            : null;

    if (!effect) {
        return 0;
    }

    return Math.max(
        0,
        Number(damagePerHit) || 0
    ) *
        effect.damageReductionPercent /
        100 *
        effect.hitCount;
}

function getOfflineDragonWrathBurnDamage(
    criticalHitCount,
    criticalDamage
) {
    const effect =
        typeof getActiveEquipmentSetUniqueEffect ===
            "function"
            ? getActiveEquipmentSetUniqueEffect(
                "dragon_wrath_burn"
            )
            : null;

    if (!effect) {
        return 0;
    }

    return Math.floor(
        Math.max(
            0,
            Math.floor(
                Number(criticalHitCount) || 0
            )
        ) *
            Math.max(
                0,
                Math.floor(
                    Number(criticalDamage) || 0
                )
            ) *
            effect.damagePercentPerTick /
            100 *
            effect.tickCount
    );
}
