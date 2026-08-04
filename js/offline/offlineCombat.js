function getOfflineEffectOverlapDuration(
    effect,
    savedAt,
    currentTime
) {
    if (!effect) {
        return 0;
    }

    const safeSavedAt = Math.min(
        currentTime,
        Number(savedAt) || currentTime
    );

    const effectStartedAt =
        Number(effect.startedAt) ||
        safeSavedAt;

    const effectExpiresAt =
        Number(effect.expiresAt) || 0;

    const overlapStartedAt = Math.max(
        safeSavedAt,
        effectStartedAt
    );

    const overlapFinishedAt = Math.min(
        currentTime,
        effectExpiresAt
    );

    return Math.max(
        0,
        overlapFinishedAt -
        overlapStartedAt
    );
}

function getOfflineCombatDefensePotionData(
    savedAt,
    currentTime
) {
    const defaultData = {
        damageReduction: 0,
        activeDuration: 0
    };

    const safeCurrentTime =
        Number(currentTime) ||
        Date.now();

    const safeSavedAt = Math.min(
        safeCurrentTime,
        Number(savedAt) ||
        safeCurrentTime
    );

    const offlineDuration = Math.max(
        0,
        safeCurrentTime -
        safeSavedAt
    );

    if (offlineDuration <= 0) {
        return defaultData;
    }

    const effect =
        player.activeEffects
            ?.potionEffects
            ?.combat_defense ||
        null;

    const potionReduction = Math.max(
        0,
        Math.min(
            95,
            Number(effect?.value) || 0
        )
    );

    const activeDuration =
        getOfflineEffectOverlapDuration(
            effect,
            safeSavedAt,
            safeCurrentTime
        );

    if (
        potionReduction <= 0 ||
        activeDuration <= 0
    ) {
        return defaultData;
    }

    const uptime = Math.max(
        0,
        Math.min(
            1,
            activeDuration /
            offlineDuration
        )
    );

    return {
        damageReduction:
            potionReduction * uptime,

        activeDuration:
            activeDuration
    };
}


function getOfflineCombatSurvivalData(
    offlineDuration,
    defensiveSpellData = null,
    frostSlowData = null,
    combatDefensePotionData = null
) {
    const safeDuration = Math.max(
        0,
        Number(offlineDuration) || 0
    );

    const defaultData = {
        activeDuration: safeDuration,

        combatEfficiency:
            safeDuration > 0
                ? 1
                : 0,

        deathCount: 0,

        commanderDefenseEffectiveHp: 0
    };

    if (safeDuration <= 0) {
        return defaultData;
    }

    const location =
        locations[player.location];

    if (
        !location ||
        !Array.isArray(
            location.enemies
        ) ||
        location.enemies.length === 0
    ) {
        return defaultData;
    }

    const derived =
        getDerivedStats();

    const averageEnemyAttack =
        location.enemies.reduce(
            (
                total,
                enemyData
            ) => {
                return (
                    total +
                    Math.max(
                        1,
                        Number(
                            enemyData.attack
                        ) || 1
                    )
                );
            },
            0
        ) /
        location.enemies.length;

    const flatArmor =
        Math.max(
            0,
            Number(
                derived.armor
            ) || 0
        );

    const damageAfterArmor =
        Math.max(
            1,
            averageEnemyAttack -
            flatArmor
        );

    const damageReduction =
        Math.max(
            0,
            Math.min(
                95,
                Number(
                    derived.defense
                ) || 0
            )
        );

    const dodgeChance =
        Math.max(
            0,
            Math.min(
                95,
                Number(
                    derived.dodgeChance
                ) || 0
            )
        );

    const damageAfterReduction =
        Math.max(
            1,
            damageAfterArmor *
            (
                1 -
                damageReduction / 100
            )
        );

    const spellDamageReduction =
        Math.max(
            0,
            Math.min(
                95,
                Number(
                    defensiveSpellData
                        ?.damageReduction
                ) || 0
            )
        );

    const damageAfterDefensiveSpell =
        damageAfterReduction *
        (
            1 -
            spellDamageReduction /
            100
        );
    const potionDamageReduction =
        Math.max(
            0,
            Math.min(
                95,
                Number(
                    combatDefensePotionData
                        ?.damageReduction
                ) || 0
            )
        );

    const damageAfterDefensePotion =
        damageAfterDefensiveSpell *
        (
            1 -
            potionDamageReduction / 100
        );

    const warriorDamageReduction =
        typeof getWarriorReceivedDamageReduction ===
            "function"
            ? Math.max(
                0,
                Math.min(
                    95,
                    getWarriorReceivedDamageReduction()
                )
            )
            : 0;

    const damageAfterWarriorSkills =
        damageAfterDefensePotion *
        (
            1 -
            warriorDamageReduction /
            100
        );

    const guardianBaseReduction =
        player.classId === "guardian" &&
            typeof getSkillEffectValue ===
            "function"
            ? getSkillEffectValue(
                "guardianDamageReductionPercentPerLevel"
            )
            : 0;

    const guardianFortressReduction =
        player.classId === "guardian" &&
            typeof isGuardianCapstoneSelected ===
            "function" &&
            isGuardianCapstoneSelected(
                "fortress"
            ) &&
            typeof getUnlockedSkillEffectValue ===
            "function"
            ? getUnlockedSkillEffectValue(
                "fortress",
                "fortressDamageReductionPercent"
            ) *
            0.5
            : 0;

    const guardianDamageReduction =
        Math.max(
            0,
            Math.min(
                80,
                guardianBaseReduction +
                guardianFortressReduction
            )
        );

    const damageAfterGuardianSkills =
        damageAfterWarriorSkills *
        (
            1 -
            guardianDamageReduction /
            100
        );

    const frostAttackReduction =
        Math.max(
            0,
            Math.min(
                95,
                Number(
                    frostSlowData
                        ?.enemyAttackReduction
                ) || 0
            )
        );

    const damageBeforeHealing =
        damageAfterGuardianSkills *
        (
            1 -
            dodgeChance / 100
        ) *
        (
            1 -
            frostAttackReduction / 100
        );

    const defensiveSpellHealingPerSecond =
        Math.max(
            0,
            Number(
                defensiveSpellData
                    ?.healingPerSecond
            ) || 0
        );

    const guardianRecoveryPercent =
        player.classId === "guardian" &&
            typeof getSkillEffectValue ===
            "function"
            ? getSkillEffectValue(
                "battleRecoveryHealingPercentPerLevel"
            )
            : 0;

    const guardianRecoveryInterval =
        typeof getUnlockedSkillEffectValue ===
            "function"
            ? Math.max(
                1,
                getUnlockedSkillEffectValue(
                    "battle_recovery",
                    "battleRecoveryHitInterval"
                )
            )
            : 1;

    const guardianHealingPerSecond =
        guardianRecoveryPercent > 0
            ? (
                Number(derived.maxHp) ||
                0
            ) *
            guardianRecoveryPercent /
            100 /
            guardianRecoveryInterval
            : 0;

    const healingPerSecond =
        defensiveSpellHealingPerSecond +
        guardianHealingPerSecond;

    const averageDamagePerSecond =
        Math.max(
            0,
            damageBeforeHealing -
            healingPerSecond
        );

    if (
        averageDamagePerSecond <= 0
    ) {
        return defaultData;
    }

    const maximumHp = Math.max(
        1,
        Number(
            derived.maxHp
        ) || 1
    );

    const currentHp =
        Number(player.hp);

    const startingHp =
        Number.isFinite(currentHp) &&
            currentHp > 0
            ? Math.min(
                maximumHp,
                currentHp
            )
            : maximumHp;

    const secondWindHealingPercent =
        typeof getWarriorSecondWindHealingPercent ===
            "function"
            ? Math.max(
                0,
                getWarriorSecondWindHealingPercent()
            )
            : 0;

    const secondWindHealing =
        maximumHp *
        secondWindHealingPercent /
        100;

    const arcaneRebirthManaCostPercent =
        typeof getUnlockedSkillEffectValue ===
            "function"
            ? Math.max(
                0,
                getUnlockedSkillEffectValue(
                    "arcane_rebirth",
                    "arcaneRebirthManaCostPercent"
                )
            )
            : 0;

    const arcaneRebirthHealingPercent =
        typeof getUnlockedSkillEffectValue ===
            "function"
            ? Math.max(
                0,
                getUnlockedSkillEffectValue(
                    "arcane_rebirth",
                    "arcaneRebirthHealingPercent"
                )
            )
            : 0;

    const arcaneRebirthManaCost =
        derived.maxMana *
        arcaneRebirthManaCostPercent /
        100;

    const arcaneRebirthHealing =
        player.classId === "mage" &&
            typeof isMageCapstoneSelected ===
            "function" &&
            isMageCapstoneSelected(
                "arcane_rebirth"
            ) &&
            (
                Number(player.mana) ||
                0
            ) >= arcaneRebirthManaCost
            ? maximumHp *
            arcaneRebirthHealingPercent /
            100
            : 0;

    const guardianUnyieldingHealing =
        player.classId === "guardian" &&
            typeof isGuardianCapstoneSelected ===
            "function" &&
            isGuardianCapstoneSelected(
                "unyielding"
            ) &&
            typeof getUnlockedSkillEffectValue ===
            "function"
            ? maximumHp *
            getUnlockedSkillEffectValue(
                "unyielding",
                "unyieldingHealingPercent"
            ) /
            100
            : 0;

    const guardianUnyieldingGuardEffectiveHp =
        guardianUnyieldingHealing > 0
            ? damageBeforeHealing *
            getUnlockedSkillEffectValue(
                "unyielding",
                "unyieldingGuardCharges"
            ) *
            getUnlockedSkillEffectValue(
                "unyielding",
                "unyieldingDamageReductionPercent"
            ) /
            100
            : 0;

    const commanderDefenseEffectiveHp =
        typeof getOfflineCommanderDefenseEffectiveHp ===
            "function"
            ? getOfflineCommanderDefenseEffectiveHp(
                damageAfterGuardianSkills
            )
            : 0;
    const explorationRespawnShieldPercent =
        typeof getExplorationRespawnShieldPercent ===
            "function"
            ? Math.max(
                0,
                Number(
                    getExplorationRespawnShieldPercent()
                ) || 0
            )
            : 0;

    const explorationRespawnShieldEffectiveHp =
        maximumHp *
        explorationRespawnShieldPercent /
        100;

    const firstLifetimeSeconds =
        (
            startingHp +
            secondWindHealing +
            arcaneRebirthHealing +
            guardianUnyieldingHealing +
            guardianUnyieldingGuardEffectiveHp +
            commanderDefenseEffectiveHp
        ) /
        averageDamagePerSecond;

    const fullLifetimeSeconds =
        (
            maximumHp +
            secondWindHealing +
            arcaneRebirthHealing +
            guardianUnyieldingHealing +
            guardianUnyieldingGuardEffectiveHp +
            commanderDefenseEffectiveHp +
            explorationRespawnShieldEffectiveHp
        ) /
        averageDamagePerSecond;

    const respawnSeconds =
        typeof getPlayerRespawnDurationSeconds ===
            "function"
            ? getPlayerRespawnDurationSeconds(10)
            : 10;

    let remainingSeconds =
        safeDuration / 1000;

    let activeSeconds = 0;
    let deathCount = 0;

    const firstActiveSeconds =
        Math.min(
            remainingSeconds,
            firstLifetimeSeconds
        );

    activeSeconds +=
        firstActiveSeconds;

    remainingSeconds -=
        firstActiveSeconds;

    if (remainingSeconds > 0) {
        deathCount++;

        const firstRespawnSeconds =
            Math.min(
                remainingSeconds,
                respawnSeconds
            );

        remainingSeconds -=
            firstRespawnSeconds;
    }

    if (remainingSeconds > 0) {
        const fullCycleSeconds =
            fullLifetimeSeconds +
            respawnSeconds;

        const fullCycles =
            Math.floor(
                remainingSeconds /
                fullCycleSeconds
            );

        activeSeconds +=
            fullCycles *
            fullLifetimeSeconds;

        deathCount +=
            fullCycles;

        remainingSeconds -=
            fullCycles *
            fullCycleSeconds;

        const finalActiveSeconds =
            Math.min(
                remainingSeconds,
                fullLifetimeSeconds
            );

        activeSeconds +=
            finalActiveSeconds;

        remainingSeconds -=
            finalActiveSeconds;

        if (remainingSeconds > 0) {
            deathCount++;
        }
    }

    const activeDuration =
        Math.max(
            0,
            Math.min(
                safeDuration,
                Math.floor(
                    activeSeconds *
                    1000
                )
            )
        );

    return {
        activeDuration:

            activeDuration,

        combatEfficiency:
            safeDuration > 0
                ? activeDuration /
                safeDuration
                : 0,

        deathCount:
            deathCount,

        commanderDefenseEffectiveHp:
            commanderDefenseEffectiveHp
    };
}

function getOfflineDefensiveSpellData(
    savedAt,
    currentTime
) {
    const safeCurrentTime =
        Number(currentTime) ||
        Date.now();

    const safeSavedAt = Math.min(
        safeCurrentTime,
        Number(savedAt) ||
        safeCurrentTime
    );

    const offlineDuration =
        Math.max(
            0,
            safeCurrentTime -
            safeSavedAt
        );

    const offlineSeconds =
        offlineDuration / 1000;

    const derived =
        getDerivedStats();

    const maximumMana = Math.max(
        0,
        Number(
            derived.maxMana
        ) || 0
    );

    const currentMana = Math.max(
        0,
        Math.min(
            maximumMana,
            Number(player.mana) || 0
        )
    );

    const baseManaRegeneration =
        typeof baseManaRegenerationPerSecond !==
            "undefined"
            ? Math.max(
                0,
                Number(
                    baseManaRegenerationPerSecond
                ) || 0
            )
            : 1;
    const wandManaRegenerationBonus =
        typeof getWandManaRegenerationSkillBonus ===
            "function"
            ? getWandManaRegenerationSkillBonus()
            : 0;

    const totalBaseManaRegeneration =
        baseManaRegeneration +
        wandManaRegenerationBonus;

    const manaEffect =
        player.activeEffects
            ?.potionEffects
            ?.mana_regeneration ||
        null;

    const manaEffectValue =
        Math.max(
            0,
            Number(
                manaEffect?.value
            ) || 0
        );

    const manaBoostedDuration =
        getOfflineEffectOverlapDuration(
            manaEffect,
            safeSavedAt,
            safeCurrentTime
        );

    const regeneratedMana =
        baseManaRegeneration *
        offlineSeconds +
        baseManaRegeneration *
        (
            manaEffectValue / 100
        ) *
        (
            manaBoostedDuration / 1000
        );

    const availableMana =
        currentMana +
        regeneratedMana;

    const defaultData = {
        castCount: 0,
        manaSpent: 0,
        damageReduction: 0,
        healingPerSecond: 0,
        totalHealing: 0,
        spellName: ""
    };

    if (
        offlineSeconds <= 0 ||
        typeof getSelectedSpell !==
        "function"
    ) {
        return defaultData;
    }

    const spell =
        getSelectedSpell(
            "defensive"
        );

    if (
        !spell ||
        ![
            "arcane_barrier",
            "healing",
            "mana_shield",
            "regeneration",
            "mirror_image"
        ].includes(
            spell.id
        )
    ) {
        return defaultData;
    }

    const manaCost =
        typeof getSpellManaCost ===
            "function"
            ? Math.max(
                0,
                Number(
                    getSpellManaCost(
                        spell
                    )
                ) || 0
            )
            : 0;

    const cooldownMilliseconds =
        typeof getSpellCooldownMilliseconds ===
            "function"
            ? Math.max(
                1000,
                Number(
                    getSpellCooldownMilliseconds(
                        spell
                    )
                ) || 1000
            )
            : 1000;

    const castsAllowedByCooldown =
        Math.max(
            0,
            Math.ceil(
                offlineDuration /
                cooldownMilliseconds
            )
        );

    const castsAllowedByMana =
        manaCost <= 0
            ? castsAllowedByCooldown
            : (
                maximumMana >= manaCost
                    ? Math.floor(
                        availableMana /
                        manaCost
                    )
                    : 0
            );

    const castCount = Math.max(
        0,
        Math.min(
            castsAllowedByCooldown,
            castsAllowedByMana
        )
    );

    if (castCount <= 0) {
        return defaultData;
    }

    const spellLevel =
        typeof getSkillLevel ===
            "function"
            ? Math.max(
                1,
                Number(
                    getSkillLevel(
                        spell.id
                    )
                ) || 1
            )
            : 1;

    const mageDefensiveSpellPower =
        typeof getMageDefensiveSpellPowerPercent ===
            "function"
            ? Math.max(
                0,
                getMageDefensiveSpellPowerPercent()
            )
            : 0;

    const mageDefensiveSpellMultiplier =
        1 +
        mageDefensiveSpellPower /
        100;

    let damageReduction = 0;
    let healingPerSecond = 0;
    let totalHealing = 0;
    let manaSpent =
        castCount *
        manaCost;

    if (
        spell.id ===
        "arcane_barrier"
    ) {
        const barrierDuration =
            Math.max(
                0,
                Number(
                    spell.effect
                        ?.durationSeconds
                ) || 0
            );

        const baseReduction =
            Number(
                spell.effect
                    ?.baseDamageReductionPercent
            ) || 0;

        const reductionPerLevel =
            Number(
                spell.effect
                    ?.damageReductionPercentPerLevel
            ) || 0;

        const barrierReduction =
            (
                baseReduction +
                reductionPerLevel *
                Math.max(
                    0,
                    spellLevel - 1
                )
            ) *
            mageDefensiveSpellMultiplier;

        const barrierUptime =
            Math.max(
                0,
                Math.min(
                    1,
                    (
                        castCount *
                        barrierDuration
                    ) /
                    offlineSeconds
                )
            );

        damageReduction =
            Math.max(
                0,
                Math.min(
                    95,
                    barrierReduction *
                    barrierUptime
                )
            );
    }

    if (
        spell.id ===
        "healing"
    ) {
        const baseHealingPercent =
            Number(
                spell.effect
                    ?.baseHealingPercent
            ) || 0;

        const healingPerLevel =
            Number(
                spell.effect
                    ?.healingPercentPerLevel
            ) || 0;

        const healingPercent =
            baseHealingPercent +
            healingPerLevel *
            Math.max(
                0,
                spellLevel - 1
            );

        const healingPerCast =
            Math.max(
                1,
                Math.floor(
                    derived.maxHp *
                    healingPercent /
                    100 *
                    mageDefensiveSpellMultiplier
                )
            );

        totalHealing =
            healingPerCast *
            castCount;

        healingPerSecond =
            totalHealing /
            offlineSeconds;
    }

    if (
        spell.id ===
        "mana_shield"
    ) {
        const shieldDuration =
            Math.max(
                0,
                Number(
                    spell.effect
                        ?.durationSeconds
                ) || 0
            );

        const baseRedirect =
            Number(
                spell.effect
                    ?.baseRedirectDamagePercent
            ) || 0;

        const redirectPerLevel =
            Number(
                spell.effect
                    ?.redirectDamagePercentPerLevel
            ) || 0;

        const redirectPercent =
            (
                baseRedirect +
                redirectPerLevel *
                Math.max(
                    0,
                    spellLevel - 1
                )
            ) *
            mageDefensiveSpellMultiplier;

        const activeShieldSeconds =
            Math.min(
                offlineSeconds,
                castCount *
                shieldDuration
            );

        const shieldUptime =
            offlineSeconds > 0
                ? activeShieldSeconds /
                offlineSeconds
                : 0;

        damageReduction =
            Math.max(
                0,
                Math.min(
                    95,
                    redirectPercent *
                    shieldUptime
                )
            );

        const maintenanceMana =
            activeShieldSeconds *
            Math.max(
                0,
                Number(
                    spell.effect
                        ?.offlineManaDrainPerActiveSecond
                ) || 0
            );

        manaSpent =
            Math.min(
                availableMana,
                manaSpent +
                maintenanceMana
            );
    }

    if (
        spell.id ===
        "regeneration"
    ) {
        const baseHealingPercent =
            Number(
                spell.effect
                    ?.baseTotalHealingPercent
            ) || 0;

        const healingPerLevel =
            Number(
                spell.effect
                    ?.totalHealingPercentPerLevel
            ) || 0;

        const healingPercent =
            baseHealingPercent +
            healingPerLevel *
            Math.max(
                0,
                spellLevel - 1
            );

        const healingPerCast =
            Math.max(
                1,
                Math.floor(
                    derived.maxHp *
                    healingPercent /
                    100 *
                    mageDefensiveSpellMultiplier
                )
            );

        totalHealing =
            healingPerCast *
            castCount;

        healingPerSecond =
            totalHealing /
            offlineSeconds;
    }

    if (
        spell.id ===
        "mirror_image"
    ) {
        const baseCharges =
            Math.max(
                1,
                Math.floor(
                    Number(
                        spell.effect
                            ?.baseDodgeCharges
                    ) || 1
                )
            );

        const additionalChargeAtLevel =
            Math.max(
                1,
                Math.floor(
                    Number(
                        spell.effect
                            ?.additionalDodgeChargeAtLevel
                    ) || 4
                )
            );

        const chargesPerCast =
            baseCharges +
            (
                spellLevel >=
                    additionalChargeAtLevel
                    ? 1
                    : 0
            );

        const avoidedAttacks =
            castCount *
            chargesPerCast;

        const effectiveAvoidedAttacks =
            avoidedAttacks *
            mageDefensiveSpellMultiplier;

        damageReduction =
            Math.max(
                0,
                Math.min(
                    95,
                    effectiveAvoidedAttacks /
                    offlineSeconds *
                    100
                )
            );
    }

    return {
        castCount:
            castCount,

        manaSpent:
            Math.max(
                0,
                Math.floor(
                    manaSpent
                )
            ),

        damageReduction:
            damageReduction,

        healingPerSecond:
            healingPerSecond,

        totalHealing:
            totalHealing,

        spellName:
            spell.name || spell.id
    };
}

function getOfflineFrostSlowData(
    savedAt,
    currentTime,
    reservedMana = 0,
    activeCombatDuration = null
) {
    const defaultData = {
        castCount: 0,
        slowUptime: 0,
        enemyAttackReduction: 0
    };

    const safeCurrentTime =
        Number(currentTime) ||
        Date.now();

    const safeSavedAt = Math.min(
        safeCurrentTime,
        Number(savedAt) ||
        safeCurrentTime
    );

    const offlineDuration = Math.max(
        0,
        safeCurrentTime -
        safeSavedAt
    );

    if (
        offlineDuration <= 0 ||
        typeof getSelectedSpell !==
        "function"
    ) {
        return defaultData;
    }

    const spell =
        getSelectedSpell(
            "offensive"
        );

    if (
        !spell ||
        spell.id !== "frost_bolt"
    ) {
        return defaultData;
    }

    const spellData =
        getOfflineOffensiveSpellData(
            safeSavedAt,
            safeCurrentTime,
            Number.MAX_SAFE_INTEGER,
            1,
            0,
            1,
            reservedMana
        );

    const cooldownMilliseconds =
        typeof getSpellCooldownMilliseconds ===
            "function"
            ? Math.max(
                1000,
                Number(
                    getSpellCooldownMilliseconds(
                        spell
                    )
                ) || 1000
            )
            : 1000;

    const safeActiveDuration =
        activeCombatDuration === null
            ? offlineDuration
            : Math.max(
                0,
                Math.min(
                    offlineDuration,
                    Number(
                        activeCombatDuration
                    ) || 0
                )
            );

    const activeSeconds =
        safeActiveDuration / 1000;

    if (activeSeconds <= 0) {
        return defaultData;
    }

    const castsAllowedByCombatTime =
        Math.max(
            0,
            Math.ceil(
                safeActiveDuration /
                cooldownMilliseconds
            )
        );

    const castCount = Math.min(
        spellData.castCount,
        castsAllowedByCombatTime
    );

    if (castCount <= 0) {
        return defaultData;
    }

    const spellLevel =
        typeof getSkillLevel ===
            "function"
            ? Math.max(
                1,
                Number(
                    getSkillLevel(
                        spell.id
                    )
                ) || 1
            )
            : 1;

    const slowDuration =
        Math.max(
            0,
            Number(
                spell.effect
                    ?.baseSlowDurationSeconds
            ) || 0
        ) +
        Math.max(
            0,
            Number(
                spell.effect
                    ?.slowDurationSecondsPerLevel
            ) || 0
        ) *
        Math.max(
            0,
            spellLevel - 1
        );

    const attackSkipChance =
        Math.max(
            0,
            Math.min(
                90,
                Number(
                    spell.effect
                        ?.enemyAttackSkipChance
                ) || 0
            )
        );

    const slowUptime =
        Math.max(
            0,
            Math.min(
                1,
                castCount *
                slowDuration /
                activeSeconds
            )
        );

    return {
        castCount:
            castCount,

        slowUptime:
            slowUptime,

        enemyAttackReduction:
            attackSkipChance *
            slowUptime
    };
}


function getOfflineOffensiveSpellData(
    savedAt,
    currentTime,
    totalAttacks,
    baseAttackDamage,
    criticalChance,
    criticalMultiplier,
    reservedMana = 0
) {
    const safeCurrentTime =
        Number(currentTime) ||
        Date.now();

    const safeSavedAt = Math.min(
        safeCurrentTime,
        Number(savedAt) ||
        safeCurrentTime
    );

    const offlineDuration =
        Math.max(
            0,
            safeCurrentTime -
            safeSavedAt
        );

    const derived =
        getDerivedStats();

    const maximumMana = Math.max(
        0,
        Number(
            derived.maxMana
        ) || 0
    );

    const currentMana = Math.max(
        0,
        Math.min(
            maximumMana,
            Number(player.mana) || 0
        )
    );

    const baseManaRegeneration =
        typeof baseManaRegenerationPerSecond !==
            "undefined"
            ? Math.max(
                0,
                Number(
                    baseManaRegenerationPerSecond
                ) || 0
            )
            : 1;

    const wandManaRegenerationBonus =
        typeof getWandManaRegenerationSkillBonus ===
            "function"
            ? getWandManaRegenerationSkillBonus()
            : 0;

    const totalBaseManaRegeneration =
        baseManaRegeneration +
        wandManaRegenerationBonus;

    const manaEffect =
        player.activeEffects
            ?.potionEffects
            ?.mana_regeneration ||
        null;

    const manaEffectValue =
        Math.max(
            0,
            Number(
                manaEffect?.value
            ) || 0
        );

    const manaBoostedDuration =
        getOfflineEffectOverlapDuration(
            manaEffect,
            safeSavedAt,
            safeCurrentTime
        );

    const regeneratedMana =
        totalBaseManaRegeneration *
        (
            offlineDuration / 1000
        ) +
        totalBaseManaRegeneration *
        (
            manaEffectValue / 100
        ) *
        (
            manaBoostedDuration / 1000
        );

    const availableMana =
        currentMana +
        regeneratedMana;

    const usableMana = Math.max(
        0,
        availableMana -
        Math.max(
            0,
            Number(
                reservedMana
            ) || 0
        )
    );

    const defaultData = {
        damage: 0,
        castCount: 0,
        manaSpent: 0,

        finalMana:
            Math.floor(
                Math.min(
                    maximumMana,
                    usableMana
                )
            ),

        spellName: ""
    };

    const safeTotalAttacks =
        Math.max(
            0,
            Math.floor(
                Number(totalAttacks) || 0
            )
        );

    if (
        safeTotalAttacks <= 0 ||
        typeof getSelectedSpell !==
        "function"
    ) {
        return defaultData;
    }

    const spell =
        getSelectedSpell(
            "offensive"
        );

    if (
        !spell ||
        ![
            "fireball",
            "frost_bolt",
            "arcane_missiles",
            "ignite",
            "meteor"
        ].includes(
            spell.id
        )
    ) {
        return defaultData;
    }

    const location =
        locations[player.location];

    if (
        !location ||
        !Array.isArray(
            location.enemies
        ) ||
        location.enemies.length === 0
    ) {
        return defaultData;
    }

    const averageBaseEnemyHp =
        location.enemies.reduce(
            (
                total,
                enemyData
            ) => {
                return (
                    total +
                    Math.max(
                        1,
                        Number(
                            enemyData.hp
                        ) || 1
                    )
                );
            },
            0
        ) /
        location.enemies.length;

    const masteryPercent =
        typeof getLocationMasteryPercent ===
            "function"
            ? getLocationMasteryPercent(
                player.location
            )
            : 0;

    const encounterHpMultiplier =
        typeof getOfflineAverageEncounterHpMultiplier ===
            "function"
            ? getOfflineAverageEncounterHpMultiplier(
                masteryPercent
            )
            : 1;

    const averageEnemyHp =
        averageBaseEnemyHp *
        encounterHpMultiplier;

    const safeCriticalChance =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    criticalChance
                ) || 0
            )
        );

    const safeCriticalMultiplier =
        Math.max(
            1,
            Number(
                criticalMultiplier
            ) || 1
        );

    const averageAttackDamage =
        Math.max(
            1,
            Number(
                baseAttackDamage
            ) || 1
        ) *
        (
            1 +
            (
                safeCriticalChance /
                100
            ) *
            (
                safeCriticalMultiplier -
                1
            )
        );

    const estimatedAttacksPerEnemy =
        Math.max(
            1,
            Math.ceil(
                averageEnemyHp /
                averageAttackDamage
            )
        );

    const spellOpportunityRatio =
        estimatedAttacksPerEnemy > 1
            ? (
                estimatedAttacksPerEnemy -
                1
            ) /
            estimatedAttacksPerEnemy
            : 0;

    const spellOpportunities =
        Math.max(
            0,
            Math.floor(
                safeTotalAttacks *
                spellOpportunityRatio
            )
        );

    if (spellOpportunities <= 0) {
        return defaultData;
    }

    const manaCost =
        typeof getSpellManaCost ===
            "function"
            ? Math.max(
                0,
                Number(
                    getSpellManaCost(
                        spell
                    )
                ) || 0
            )
            : 0;

    const cooldownMilliseconds =
        typeof getSpellCooldownMilliseconds ===
            "function"
            ? Math.max(
                1000,
                Number(
                    getSpellCooldownMilliseconds(
                        spell
                    )
                ) || 1000
            )
            : 1000;

    const castsAllowedByCooldown =
        Math.max(
            0,
            Math.ceil(
                offlineDuration /
                cooldownMilliseconds
            )
        );

    const castsAllowedByMana =
        manaCost <= 0
            ? spellOpportunities
            : (
                maximumMana >= manaCost
                    ? Math.floor(
                        usableMana /
                        manaCost
                    )
                    : 0
            );

    const castCount = Math.max(
        0,
        Math.min(
            spellOpportunities,
            castsAllowedByCooldown,
            castsAllowedByMana
        )
    );

    if (castCount <= 0) {
        return defaultData;
    }

    const spellLevel =
        typeof getSkillLevel ===
            "function"
            ? Math.max(
                1,
                Number(
                    getSkillLevel(
                        spell.id
                    )
                ) || 1
            )
            : 1;

    let spellMultiplier =
        (
            Number(
                spell.effect
                    ?.baseDamageMultiplier
            ) || 1
        ) +
        (
            Number(
                spell.effect
                    ?.damageMultiplierPerLevel
            ) || 0
        ) *
        Math.max(
            0,
            spellLevel - 1
        );

    let directDamageMultiplier =
        spellMultiplier;

    if (
        spell.id ===
        "arcane_missiles"
    ) {
        const projectileCount =
            Math.max(
                1,
                Math.floor(
                    Number(
                        spell.effect
                            ?.projectileCount
                    ) || 1
                )
            );

        const projectileMultiplier =
            (
                Number(
                    spell.effect
                        ?.baseDamageMultiplierPerProjectile
                ) || 0
            ) +
            (
                Number(
                    spell.effect
                        ?.damageMultiplierPerProjectilePerLevel
                ) || 0
            ) *
            Math.max(
                0,
                spellLevel - 1
            );

        spellMultiplier =
            projectileMultiplier *
            projectileCount;

        directDamageMultiplier =
            spellMultiplier;
    }

    if (spell.id === "ignite") {
        const initialMultiplier =
            (
                Number(
                    spell.effect
                        ?.baseDamageMultiplier
                ) || 0
            ) +
            (
                Number(
                    spell.effect
                        ?.damageMultiplierPerLevel
                ) || 0
            ) *
            Math.max(
                0,
                spellLevel - 1
            );

        const tickMultiplier =
            (
                Number(
                    spell.effect
                        ?.baseTickDamageMultiplier
                ) || 0
            ) +
            (
                Number(
                    spell.effect
                        ?.tickDamageMultiplierPerLevel
                ) || 0
            ) *
            Math.max(
                0,
                spellLevel - 1
            );

        const tickCount =
            Math.max(
                1,
                Math.floor(
                    (
                        Number(
                            spell.effect
                                ?.durationSeconds
                        ) || 0
                    ) /
                    Math.max(
                        0.1,
                        Number(
                            spell.effect
                                ?.tickSeconds
                        ) || 1
                    )
                )
            );

        spellMultiplier =
            initialMultiplier +
            tickMultiplier *
            tickCount;

        directDamageMultiplier =
            initialMultiplier;
    }

    const offensiveSpellBonus =
        typeof getOffensiveSpellDamageSkillBonus ===
            "function"
            ? Math.max(
                0,
                Number(
                    getOffensiveSpellDamageSkillBonus()
                ) || 0
            )
            : 0;
    const mageManaOverflowBonus =
        typeof getMageManaOverflowDamagePercent ===
            "function"
            ? Math.max(
                0,
                getMageManaOverflowDamagePercent()
            )
            : 0;

    const mageEchoChance =
        typeof getSkillEffectValue ===
            "function"
            ? Math.max(
                0,
                Math.min(
                    100,
                    getSkillEffectValue(
                        "elementalEchoChancePercentPerLevel"
                    )
                )
            )
            : 0;

    const mageEchoDamagePercent =
        mageEchoChance > 0 &&
            typeof getUnlockedSkillEffectValue ===
            "function"
            ? (
                typeof isMageCapstoneSelected ===
                    "function" &&
                    isMageCapstoneSelected(
                        "overload"
                    )
                    ? getUnlockedSkillEffectValue(
                        "overload",
                        "overloadEchoDamagePercent"
                    )
                    : getUnlockedSkillEffectValue(
                        "elemental_echo",
                        "elementalEchoDamagePercent"
                    )
            )
            : 0;

    const directDamageRatio =
        spellMultiplier > 0
            ? Math.max(
                0,
                Math.min(
                    1,
                    directDamageMultiplier /
                    spellMultiplier
                )
            )
            : 0;

    const mageExpectedEchoMultiplier =
        1 +
        directDamageRatio *
        mageEchoChance /
        100 *
        Math.max(
            0,
            mageEchoDamagePercent
        ) /
        100;

    const baseSpellDamage =
        Math.max(
            1,
            Math.floor(
                derived.magicDamage *
                spellMultiplier *
                (
                    1 +
                    offensiveSpellBonus /
                    100
                ) *
                (
                    1 +
                    mageManaOverflowBonus /
                    100
                ) *
                mageExpectedEchoMultiplier
            )
        );

    const spellDamageEffect =
        player.activeEffects
            ?.potionEffects
            ?.spell_damage ||
        null;

    const spellDamageEffectValue =
        Math.max(
            0,
            Number(
                spellDamageEffect?.value
            ) || 0
        );

    const spellBoostedDuration =
        getOfflineEffectOverlapDuration(
            spellDamageEffect,
            safeSavedAt,
            safeCurrentTime
        );

    const boostedCastCount =
        Math.min(
            castCount,
            Math.ceil(
                spellBoostedDuration /
                cooldownMilliseconds
            )
        );

    const normalCastCount =
        castCount -
        boostedCastCount;

    const boostedSpellDamage =
        Math.max(
            1,
            Math.floor(
                baseSpellDamage *
                (
                    1 +
                    spellDamageEffectValue /
                    100
                )
            )
        );

    const totalSpellDamage =
        normalCastCount *
        baseSpellDamage +
        boostedCastCount *
        boostedSpellDamage;

    const manaSpent =
        castCount *
        manaCost;

    const finalMana =
        Math.floor(
            Math.max(
                0,
                Math.min(
                    maximumMana,
                    usableMana -
                    manaSpent
                )
            )
        );

    return {
        damage:
            totalSpellDamage,

        castCount:
            castCount,

        manaSpent:
            manaSpent,

        finalMana:
            finalMana,

        spellName:
            spell.name || spell.id
    };
}

function calculateOfflineCombatDamage(
    savedAt,
    currentTime
) {
    const offlineDuration = Math.max(
        0,
        currentTime - savedAt
    );
    const combatDefensePotionData =
        getOfflineCombatDefensePotionData(
            savedAt,
            currentTime
        );

    const defensiveSpellData =
        getOfflineDefensiveSpellData(
            savedAt,
            currentTime
        );

    const survivalWithoutFrost =
        getOfflineCombatSurvivalData(
            offlineDuration,
            defensiveSpellData,
            null,
            combatDefensePotionData
        );

    const frostSlowData =
        getOfflineFrostSlowData(
            savedAt,
            currentTime,
            defensiveSpellData
                .manaSpent,
            survivalWithoutFrost
                .activeDuration
        );

    const survivalData =
        getOfflineCombatSurvivalData(
            offlineDuration,
            defensiveSpellData,
            frostSlowData,
            combatDefensePotionData
        );

    const activeCombatDuration =
        survivalData.activeDuration;

    const baseAttackInterval = Math.max(
        100,
        Number(
            getPlayerAttackIntervalMs(
                false
            )
        ) || 1000
    );

    const offlineBerserkerUptime =
        typeof isWarriorMeleeAttack ===
            "function" &&
            isWarriorMeleeAttack()
            ? Math.max(
                0,
                Math.min(
                    1,
                    (
                        typeof getWarriorBerserkerHpThreshold ===
                            "function"
                            ? getWarriorBerserkerHpThreshold()
                            : 0
                    ) /
                    100
                )
            )
            : 0;

    const offlineBerserkerSpeed =
        typeof getUnlockedSkillEffectValue ===
            "function"
            ? getUnlockedSkillEffectValue(
                "berserker",
                "berserkerAttackSpeedPercent"
            ) *
            offlineBerserkerUptime
            : 0;

    const offlineHunterSpeed =
        typeof getHunterAttackSpeedPercent ===
            "function"
            ? getHunterAttackSpeedPercent()
            : 0;

    const attackInterval = Math.max(
        100,
        Math.floor(
            baseAttackInterval /
            (
                1 +
                (
                    offlineBerserkerSpeed +
                    offlineHunterSpeed
                ) /
                100
            )
        )
    );

    const totalAttacks = Math.max(
        0,
        Math.floor(
            activeCombatDuration /
            attackInterval
        )
    );

    if (totalAttacks <= 0) {
        const spellData =
            getOfflineOffensiveSpellData(
                savedAt,
                currentTime,
                0,
                0,
                0,
                1,
                defensiveSpellData
                    .manaSpent
            );

        return {
            damage: 0,
            attackCount: 0,

            combatEfficiency:
                survivalData
                    .combatEfficiency,

            deathCount:
                survivalData
                    .deathCount,

            offensiveSpellDamage: 0,
            offensiveSpellCasts: 0,
            offensiveSpellName: "",
            defensiveSpellCasts:
                defensiveSpellData
                    .castCount,

            defensiveSpellName:
                defensiveSpellData
                    .spellName,

            defensiveHealing:
                defensiveSpellData
                    .totalHealing,

            defensiveDamageReduction:
                defensiveSpellData
                    .damageReduction,

            frostAttackReduction:
                frostSlowData
                    .enemyAttackReduction,

            defensePotionReduction:
                combatDefensePotionData
                    .damageReduction,

            commanderDefenseEffectiveHp:
                survivalData
                    .commanderDefenseEffectiveHp,

            equipmentSetBurnDamage: 0,

            finalMana:
                spellData.finalMana
        };
    }

    const weaponId =
        player.equipment?.weapon;

    const weapon =
        weaponId
            ? items[weaponId]
            : null;

    const damageEffectId =
        typeof getWeaponPotionEffectId ===
            "function"
            ? getWeaponPotionEffectId(
                weapon
            )
            : null;

    const damageEffect =
        damageEffectId
            ? player.activeEffects
                ?.potionEffects
            ?.[damageEffectId]
            : null;

    const effectValue = Math.max(
        0,
        Number(
            damageEffect?.value
        ) || 0
    );

    const currentAttackDamage = Math.max(
        0,
        Math.floor(
            Number(getAttack()) || 0
        )
    );

    /*
     * getAttack() zawiera premię aktywnej
     * obecnie mikstury. Cofamy tę premię,
     * aby otrzymać bazowe obrażenia.
     */
    const effectIsActiveNow =
        effectValue > 0 &&
        Number(
            damageEffect?.expiresAt
        ) > Date.now();

    const baseAttackDamage =
        effectIsActiveNow
            ? Math.max(
                0,
                Math.round(
                    currentAttackDamage /
                    (
                        1 +
                        effectValue / 100
                    )
                )
            )
            : currentAttackDamage;

    const boostedAttackDamage = Math.max(
        0,
        Math.floor(
            baseAttackDamage *
            (
                1 +
                effectValue / 100
            )
        )
    );

    const boostedDuration =
        getOfflineEffectOverlapDuration(
            damageEffect,
            savedAt,
            currentTime
        );

    const boostedAttacks = Math.min(
        totalAttacks,
        Math.floor(
            boostedDuration /
            attackInterval
        )
    );

    const normalAttacks =
        totalAttacks -
        boostedAttacks;

    const derived =
        getDerivedStats();

    const isMeleeAttack =
        !weapon ||
        weapon.weaponType ===
        "melee";

    const isRangedAttack =
        weapon?.weaponType ===
        "ranged";

    const slashingCapstoneActive =
        weapon?.weaponType ===
        "melee" &&
        weapon?.weaponClass ===
        "slashing" &&
        typeof isCombatCapstoneSelected ===
        "function" &&
        isCombatCapstoneSelected(
            "slashing_capstone"
        );

    const bluntCapstoneActive =
        weapon?.weaponType ===
        "melee" &&
        weapon?.weaponClass ===
        "blunt" &&
        typeof isCombatCapstoneSelected ===
        "function" &&
        isCombatCapstoneSelected(
            "blunt_capstone"
        );

    const slashingCapstoneInterval =
        slashingCapstoneActive &&
            typeof getUnlockedSkillEffectValue ===
            "function"
            ? Math.max(
                1,
                getUnlockedSkillEffectValue(
                    "slashing_capstone",
                    "slashingCapstoneAttackInterval"
                )
            )
            : 1;

    const slashingCapstoneBonus =
        slashingCapstoneActive &&
            typeof getUnlockedSkillEffectValue ===
            "function"
            ? getUnlockedSkillEffectValue(
                "slashing_capstone",
                "slashingCapstoneBonusDamagePercent"
            )
            : 0;

    /*
     * Co czwarty atak +60% oznacza
     * średnio +15% obrażeń:
     *
     * 60 / 4 = 15
     */
    const slashingCapstoneMultiplier =
        slashingCapstoneActive
            ? (
                1 +
                (
                    slashingCapstoneBonus /
                    slashingCapstoneInterval
                ) /
                100
            )
            : 1;

    const bluntCapstoneBonus =
        bluntCapstoneActive &&
            typeof getUnlockedSkillEffectValue ===
            "function"
            ? getUnlockedSkillEffectValue(
                "blunt_capstone",
                "bluntCapstoneDamagePercent"
            )
            : 0;

    const bluntCapstoneMultiplier =
        bluntCapstoneActive
            ? (
                1 +
                bluntCapstoneBonus /
                100
            )
            : 1;

    const combatCapstoneDamageMultiplier =
        slashingCapstoneMultiplier *
        bluntCapstoneMultiplier;

    const meleeCritDamageBonus =
        isMeleeAttack
            ? Math.max(
                0,
                Number(
                    derived
                        .meleeCritDamageBonus
                ) || 0
            )
            : 0;

    const weaponCritChanceBonus =
        typeof getCombatWeaponCritChanceBonus ===
            "function"
            ? getCombatWeaponCritChanceBonus(
                weapon
            )
            : 0;

    const criticalChance =
        bluntCapstoneActive
            ? 0
            : Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        derived.critChance
                    ) || 0
                )
            );
    const rangedCriticalDamageBonus =
        isRangedAttack &&
            player.classId === "hunter" &&
            typeof getSkillEffectValue ===
            "function"
            ? getSkillEffectValue(
                "rangedCritDamagePercentPerLevel"
            )
            : 0;

    const weaponCritDamageBonus =
        typeof getCombatWeaponCritDamageBonus ===
            "function"
            ? getCombatWeaponCritDamageBonus(
                weapon
            )
            : 0;
    const crossbowCritDamageBonus =
        typeof getCrossbowCritDamageSkillBonus ===
            "function"
            ? getCrossbowCritDamageSkillBonus(
                weapon
            )
            : 0;

    const criticalMultiplier =
        Math.max(
            1,
            (
                (
                    Number(
                        derived.critDamage
                    ) || 100
                ) +
                meleeCritDamageBonus +
                crossbowCritDamageBonus
            ) /
            100
        ) *
        (
            1 +
            rangedCriticalDamageBonus /
            100
        );

    function calculateAttackGroupDamage(
        attackCount,
        attackDamage
    ) {
        if (
            attackCount <= 0 ||
            attackDamage <= 0
        ) {
            return {
                damage: 0,
                criticalHits: 0,
                criticalDamage: 0
            };
        }

        /*
         * Finały Walki zwiększają bazę
         * każdego symulowanego ataku.
         */
        const capstoneAttackDamage =
            Math.max(
                1,
                Math.floor(
                    attackDamage *
                    combatCapstoneDamageMultiplier
                )
            );

        const criticalHits =
            getOfflineOccurrenceCount(
                attackCount,
                criticalChance
            );

        const normalHits =
            attackCount -
            criticalHits;

        /*
         * Zachowujemy wcześniejszą
         * Miażdżącą siłę, która wzmacnia
         * wyłącznie trafienia niekrytyczne.
         */
        const offlineBluntNonCriticalBonus =
            typeof getBluntNonCriticalDamageSkillBonus ===
                "function"
                ? getBluntNonCriticalDamageSkillBonus(
                    weapon
                )
                : 0;

        const normalAttackDamage =
            Math.max(
                1,
                Math.floor(
                    capstoneAttackDamage *
                    (
                        1 +
                        offlineBluntNonCriticalBonus /
                        100
                    )
                )
            );

        const criticalDamage =
            Math.floor(
                capstoneAttackDamage *
                criticalMultiplier
            );

        return {
            damage:
                normalHits *
                normalAttackDamage +
                criticalHits *
                criticalDamage,

            criticalHits:
                criticalHits,

            criticalDamage:
                criticalDamage
        };
    }

    const normalAttackGroup =
        calculateAttackGroupDamage(
            normalAttacks,
            baseAttackDamage
        );
    const boostedAttackGroup =
        calculateAttackGroupDamage(
            boostedAttacks,
            boostedAttackDamage
        );
    const basicAttackDamage =
        normalAttackGroup.damage +
        boostedAttackGroup.damage;
    const equipmentSetBurnDamage =
        typeof getOfflineDragonWrathBurnDamage ===
            "function"
            ? Math.floor(
                getOfflineDragonWrathBurnDamage(
                    normalAttackGroup
                        .criticalHits,
                    normalAttackGroup
                        .criticalDamage
                ) +
                getOfflineDragonWrathBurnDamage(
                    boostedAttackGroup
                        .criticalHits,
                    boostedAttackGroup
                        .criticalDamage
                )
            )
            : 0;

    let warriorBasicAttackDamage =
        basicAttackDamage;

    let warriorBleedDamage = 0;

    if (
        isMeleeAttack &&
        player.classId === "warrior" &&
        totalAttacks > 0
    ) {
        const powerStrikeChance =
            Math.max(
                0,
                Math.min(
                    1,
                    (
                        typeof getSkillEffectValue ===
                            "function"
                            ? getSkillEffectValue(
                                "powerStrikeChancePercentPerLevel"
                            )
                            : 0
                    ) /
                    100
                )
            );

        const powerStrikeBonus =
            typeof getUnlockedSkillEffectValue ===
                "function"
                ? getUnlockedSkillEffectValue(
                    "power_strike",
                    "powerStrikeBonusDamagePercent"
                )
                : 0;

        const powerStrikeMultiplier =
            1 +
            powerStrikeChance *
            powerStrikeBonus /
            100;

        const momentumBonus =
            typeof getSkillEffectValue ===
                "function"
                ? getSkillEffectValue(
                    "battleMomentumDamagePercentPerLevel"
                )
                : 0;

        const momentumAttackCount =
            typeof getUnlockedSkillEffectValue ===
                "function"
                ? getUnlockedSkillEffectValue(
                    "battle_momentum",
                    "battleMomentumAttackCount"
                )
                : 0;

        const criticalProbability =
            criticalChance / 100;

        const momentumUptime =
            momentumAttackCount > 0
                ? 1 -
                Math.pow(
                    1 -
                    criticalProbability,
                    momentumAttackCount
                )
                : 0;

        const momentumMultiplier =
            1 +
            momentumUptime *
            momentumBonus /
            100;

        const berserkerDamageBonus =
            typeof getUnlockedSkillEffectValue ===
                "function"
                ? getUnlockedSkillEffectValue(
                    "berserker",
                    "berserkerDamagePercent"
                )
                : 0;

        const berserkerMultiplier =
            1 +
            offlineBerserkerUptime *
            berserkerDamageBonus /
            100;

        warriorBasicAttackDamage =
            Math.floor(
                basicAttackDamage *
                powerStrikeMultiplier *
                momentumMultiplier *
                berserkerMultiplier
            );

        const bleedChance =
            Math.max(
                0,
                Math.min(
                    1,
                    (
                        typeof getSkillEffectValue ===
                            "function"
                            ? getSkillEffectValue(
                                "bleedChancePercentPerLevel"
                            )
                            : 0
                    ) /
                    100
                )
            );

        if (bleedChance > 0) {
            const bleedDuration =
                getUnlockedSkillEffectValue(
                    "serrated_blade",
                    "bleedDurationSeconds"
                );

            const bleedTickSeconds =
                Math.max(
                    0.1,
                    getUnlockedSkillEffectValue(
                        "serrated_blade",
                        "bleedTickSeconds"
                    )
                );

            const bleedDamagePerTick =
                getUnlockedSkillEffectValue(
                    "serrated_blade",
                    "bleedDamagePercentPerTick"
                );

            const deepWoundsBonus =
                getSkillEffectValue(
                    "bleedDamageBonusPercentPerLevel"
                );

            const maximumBleedStacks =
                isWarriorCapstoneSelected(
                    "hemorrhage"
                )
                    ? Math.max(
                        1,
                        getUnlockedSkillEffectValue(
                            "hemorrhage",
                            "maximumBleedStacks"
                        )
                    )
                    : 1;

            const attacksDuringBleed =
                bleedDuration *
                1000 /
                attackInterval;

            const averageBleedStacks =
                Math.min(
                    maximumBleedStacks,
                    bleedChance *
                    attacksDuringBleed
                );

            const averageAttackDamage =
                warriorBasicAttackDamage /
                totalAttacks;

            const averageBleedTickDamage =
                averageAttackDamage *
                bleedDamagePerTick /
                100 *
                (
                    1 +
                    deepWoundsBonus /
                    100
                );

            warriorBleedDamage =
                Math.max(
                    0,
                    Math.floor(
                        averageBleedStacks *
                        averageBleedTickDamage *
                        (
                            activeCombatDuration /
                            1000
                        ) /
                        bleedTickSeconds
                    )
                );
        }
    }

    let classBasicAttackDamage =
        warriorBasicAttackDamage;

    if (
        isRangedAttack &&
        player.classId === "hunter" &&
        totalAttacks > 0
    ) {
        const doubleShotChance =
            Math.max(
                0,
                Math.min(
                    1,
                    (
                        typeof getSkillEffectValue ===
                            "function"
                            ? getSkillEffectValue(
                                "doubleShotChancePercentPerLevel"
                            )
                            : 0
                    ) /
                    100
                )
            );

        const additionalArrowDamage =
            typeof getUnlockedSkillEffectValue ===
                "function"
                ? getUnlockedSkillEffectValue(
                    "double_shot",
                    "additionalArrowDamagePercent"
                )
                : 0;

        const additionalArrowCount =
            1 +
            (
                typeof isHunterCapstoneSelected ===
                    "function" &&
                    isHunterCapstoneSelected(
                        "arrow_storm"
                    )
                    ? getUnlockedSkillEffectValue(
                        "arrow_storm",
                        "arrowStormAdditionalArrows"
                    )
                    : 0
            );

        const volleyMultiplier =
            1 +
            doubleShotChance *
            additionalArrowDamage /
            100 *
            additionalArrowCount;

        let sniperMultiplier = 1;

        if (
            typeof isHunterCapstoneSelected ===
            "function" &&
            isHunterCapstoneSelected(
                "sniper"
            )
        ) {
            const sniperInterval =
                Math.max(
                    1,
                    getUnlockedSkillEffectValue(
                        "sniper",
                        "sniperAttackInterval"
                    )
                );

            const sniperBonus =
                getUnlockedSkillEffectValue(
                    "sniper",
                    "sniperBonusDamagePercent"
                );

            const expectedCriticalMultiplier =
                1 +
                criticalChance /
                100 *
                (
                    criticalMultiplier -
                    1
                );

            const sniperAttackMultiplier =
                criticalMultiplier *
                (
                    1 +
                    sniperBonus / 100
                );

            sniperMultiplier =
                1 +
                (
                    sniperAttackMultiplier -
                    expectedCriticalMultiplier
                ) /
                expectedCriticalMultiplier /
                sniperInterval;
        }

        const counterCharges =
            typeof isHunterCapstoneSelected ===
                "function" &&
                isHunterCapstoneSelected(
                    "tracker"
                )
                ? getUnlockedSkillEffectValue(
                    "tracker",
                    "trackerCounterCharges"
                )
                : getUnlockedSkillEffectValue(
                    "counter_shot",
                    "counterShotCharges"
                );

        const counterDamageBonus =
            typeof isHunterCapstoneSelected ===
                "function" &&
                isHunterCapstoneSelected(
                    "tracker"
                )
                ? getUnlockedSkillEffectValue(
                    "tracker",
                    "trackerCounterDamagePercent"
                )
                : (
                    typeof getSkillEffectValue ===
                        "function"
                        ? getSkillEffectValue(
                            "counterShotDamagePercentPerLevel"
                        )
                        : 0
                );

        const counterAttackUptime =
            Math.min(
                1,
                (
                    Number(
                        derived.dodgeChance
                    ) || 0
                ) /
                100 *
                Math.max(
                    0,
                    counterCharges
                ) *
                attackInterval /
                1000
            );

        const counterMultiplier =
            1 +
            counterAttackUptime *
            counterDamageBonus /
            100;

        classBasicAttackDamage =
            Math.floor(
                basicAttackDamage *
                volleyMultiplier *
                sniperMultiplier *
                counterMultiplier
            );
    }

    let roguePoisonDamage = 0;

    if (
        isMeleeAttack &&
        player.classId === "rogue" &&
        totalAttacks > 0 &&
        typeof getSkillEffectValue ===
        "function"
    ) {
        const shadowstepBonus =
            getSkillEffectValue(
                "shadowstepDamagePercentPerLevel"
            );

        const shadowstepUptime =
            Math.min(
                1,
                (
                    Number(
                        derived.dodgeChance
                    ) || 0
                ) /
                100 *
                attackInterval /
                1000
            );

        const shadowstepMultiplier =
            1 +
            shadowstepUptime *
            shadowstepBonus /
            100;

        const executionerThreshold =
            typeof isRogueCapstoneSelected ===
                "function" &&
                isRogueCapstoneSelected(
                    "executioner"
                )
                ? getUnlockedSkillEffectValue(
                    "executioner",
                    "executionerEnemyHpThresholdPercent"
                )
                : 0;

        const executionerBonus =
            executionerThreshold > 0
                ? getUnlockedSkillEffectValue(
                    "executioner",
                    "executionerDamagePercent"
                )
                : 0;

        const executionerMultiplier =
            1 +
            executionerThreshold /
            100 *
            executionerBonus /
            100;

        const bladeDanceInterval =
            typeof isRogueCapstoneSelected ===
                "function" &&
                isRogueCapstoneSelected(
                    "blade_dance"
                )
                ? Math.max(
                    1,
                    getUnlockedSkillEffectValue(
                        "blade_dance",
                        "bladeDanceAttackInterval"
                    )
                )
                : 0;

        const bladeDanceBonus =
            bladeDanceInterval > 0
                ? getUnlockedSkillEffectValue(
                    "blade_dance",
                    "bladeDanceAdditionalDamagePercent"
                )
                : 0;

        const bladeDanceMultiplier =
            1 +
            (
                bladeDanceInterval > 0
                    ? bladeDanceBonus /
                    100 /
                    bladeDanceInterval
                    : 0
            );

        classBasicAttackDamage =
            Math.floor(
                basicAttackDamage *
                shadowstepMultiplier *
                executionerMultiplier *
                bladeDanceMultiplier
            );

        const poisonChance =
            Math.max(
                0,
                Math.min(
                    1,
                    getSkillEffectValue(
                        "poisonChancePercentPerLevel"
                    ) /
                    100
                )
            );

        if (poisonChance > 0) {
            const poisonDuration =
                getUnlockedSkillEffectValue(
                    "poisoned_blade",
                    "poisonDurationSeconds"
                );

            const poisonTickSeconds =
                Math.max(
                    0.1,
                    getUnlockedSkillEffectValue(
                        "poisoned_blade",
                        "poisonTickSeconds"
                    )
                );

            const poisonDamagePerTick =
                getUnlockedSkillEffectValue(
                    "poisoned_blade",
                    "poisonDamagePercentPerTick"
                );

            const toxinBonus =
                getSkillEffectValue(
                    "poisonDamageBonusPercentPerLevel"
                ) +
                getUnlockedSkillEffectValue(
                    "deadly_venom",
                    "deadlyVenomDamagePercent"
                );

            const maximumPoisonStacks =
                typeof isRogueCapstoneSelected ===
                    "function" &&
                    isRogueCapstoneSelected(
                        "deadly_venom"
                    )
                    ? Math.max(
                        1,
                        getUnlockedSkillEffectValue(
                            "deadly_venom",
                            "deadlyVenomMaximumStacks"
                        )
                    )
                    : 1;

            const attacksDuringPoison =
                poisonDuration *
                1000 /
                attackInterval;

            const averagePoisonStacks =
                maximumPoisonStacks > 1
                    ? Math.min(
                        maximumPoisonStacks,
                        poisonChance *
                        attacksDuringPoison
                    )
                    : (
                        1 -
                        Math.pow(
                            1 -
                            poisonChance,
                            attacksDuringPoison
                        )
                    );

            const averageAttackDamage =
                classBasicAttackDamage /
                totalAttacks;

            const averagePoisonTickDamage =
                averageAttackDamage *
                poisonDamagePerTick /
                100 *
                (
                    1 +
                    toxinBonus /
                    100
                );

            roguePoisonDamage =
                Math.max(
                    0,
                    Math.floor(
                        averagePoisonStacks *
                        averagePoisonTickDamage *
                        (
                            activeCombatDuration /
                            1000
                        ) /
                        poisonTickSeconds
                    )
                );
        }
    }

    let guardianRetaliationDamage = 0;

    if (
        isMeleeAttack &&
        player.classId === "guardian" &&
        typeof getSkillEffectValue ===
        "function"
    ) {
        const retaliationChance =
            Math.max(
                0,
                Math.min(
                    1,
                    getSkillEffectValue(
                        "guardianRetaliationChancePercentPerLevel"
                    ) /
                    100
                )
            );

        const spikedInterval =
            typeof isGuardianCapstoneSelected ===
                "function" &&
                isGuardianCapstoneSelected(
                    "spiked_bulwark"
                )
                ? Math.max(
                    1,
                    getUnlockedSkillEffectValue(
                        "spiked_bulwark",
                        "spikedBulwarkHitInterval"
                    )
                )
                : 0;

        const effectiveRetaliationChance =
            spikedInterval > 0
                ? retaliationChance +
                (
                    1 -
                    retaliationChance
                ) /
                spikedInterval
                : retaliationChance;

        const retaliationDamagePercent =
            getUnlockedSkillEffectValue(
                "retaliatory_strike",
                "guardianRetaliationDamagePercent"
            ) +
            getSkillEffectValue(
                "guardianRetaliationDamagePercentPerLevel"
            );

        const estimatedReceivedHits =
            activeCombatDuration /
            1000 *
            (
                1 -
                Math.max(
                    0,
                    Math.min(
                        95,
                        Number(
                            derived.dodgeChance
                        ) || 0
                    )
                ) /
                100
            ) *
            (
                1 -
                Math.max(
                    0,
                    Math.min(
                        95,
                        Number(
                            frostSlowData
                                ?.enemyAttackReduction
                        ) || 0
                    )
                ) /
                100
            );

        guardianRetaliationDamage =
            Math.max(
                0,
                Math.floor(
                    estimatedReceivedHits *
                    effectiveRetaliationChance *
                    baseAttackDamage *
                    retaliationDamagePercent /
                    100
                )
            );
    }

    const offensiveSpellData =
        getOfflineOffensiveSpellData(
            savedAt,
            currentTime,
            totalAttacks,
            baseAttackDamage,
            criticalChance,
            criticalMultiplier,
            defensiveSpellData
                .manaSpent
        );

    return {
        attackCount:
            totalAttacks,

        damage:
            classBasicAttackDamage +
            warriorBleedDamage +
            guardianRetaliationDamage +
            roguePoisonDamage +
            equipmentSetBurnDamage +
            offensiveSpellData.damage,

        combatEfficiency:
            survivalData
                .combatEfficiency,

        deathCount:
            survivalData
                .deathCount,

        offensiveSpellDamage:
            offensiveSpellData.damage,

        offensiveSpellCasts:
            offensiveSpellData.castCount,

        offensiveSpellName:
            offensiveSpellData.spellName,

        defensiveSpellCasts:
            defensiveSpellData
                .castCount,

        defensiveSpellName:
            defensiveSpellData
                .spellName,

        defensiveHealing:
            defensiveSpellData
                .totalHealing,

        defensiveDamageReduction:
            defensiveSpellData
                .damageReduction,

        frostAttackReduction:
            frostSlowData
                .enemyAttackReduction,

        defensePotionReduction:
            combatDefensePotionData
                .damageReduction,

        commanderDefenseEffectiveHp:
            survivalData
                .commanderDefenseEffectiveHp,

        equipmentSetBurnDamage:
            equipmentSetBurnDamage,

        finalMana:
            offensiveSpellData.finalMana
    };
}

function distributeOfflineEnemyKills(
    enemyList,
    killCount
) {
    const safeKillCount = Math.max(
        0,
        Math.floor(
            Number(killCount) || 0
        )
    );

    if (
        !Array.isArray(enemyList) ||
        enemyList.length === 0 ||
        safeKillCount <= 0
    ) {
        return [];
    }

    /*
     * Rozdzielamy zabójstwa pomiędzy
     * przeciwników z aktualnej lokacji.
     */
    const baseQuantity = Math.floor(
        safeKillCount /
        enemyList.length
    );

    let remainingKills =
        safeKillCount -
        baseQuantity *
        enemyList.length;

    const results =
        enemyList.map(enemyData => {
            return {
                enemy: enemyData,
                quantity: baseQuantity
            };
        });

    /*
     * Pozostałe zabójstwa rozdzielamy
     * losowo bez wykonywania pętli
     * dla każdego pokonanego potwora.
     */
    const availableIndexes =
        enemyList.map(
            (enemyData, index) => {
                return index;
            }
        );

    while (
        remainingKills > 0 &&
        availableIndexes.length > 0
    ) {
        const randomIndex =
            Math.floor(
                Math.random() *
                availableIndexes.length
            );

        const resultIndex =
            availableIndexes.splice(
                randomIndex,
                1
            )[0];

        results[resultIndex]
            .quantity++;

        remainingKills--;
    }

    return results.filter(result => {
        return result.quantity > 0;
    });
}

function createOfflineEncounterEnemyData(
    enemyData,
    encounterType = "normal",
    eliteModifierId = null
) {
    const variant =
        enemyEncounterVariants[
        encounterType
        ] ||
        enemyEncounterVariants.normal;
    const masteryBonuses =
        getLocationMasteryBonuses(
            player.location
        );
    const encounterEnemy = {
        ...enemyData,

        hp: Math.max(
            1,
            Math.round(
                enemyData.hp *
                variant.hpMultiplier
            )
        ),

        attack: Math.max(
            1,
            Math.round(
                enemyData.attack *
                variant.attackMultiplier
            )
        ),

        gold: Math.max(
            0,
            Math.round(
                enemyData.gold *
                variant.rewardMultiplier *
                (
                    1 +
                    masteryBonuses
                        .goldBonus /
                    100
                )
            )
        ),

        exp: Math.max(
            0,
            Math.round(
                enemyData.exp *
                variant.rewardMultiplier *
                (
                    1 +
                    masteryBonuses
                        .experienceBonus /
                    100
                )
            )
        ),

        encounterType:
            variant.id,

        lootChanceMultiplier:
            variant.lootChanceMultiplier *
            (
                1 +
                masteryBonuses
                    .lootChanceBonus /
                100
            )
    };

    if (variant.id === "elite") {
        return applyEliteEnemyModifierToData(
            encounterEnemy,
            eliteModifierId ||
            rollEliteEnemyModifierId()
        );
    }

    return {
        ...encounterEnemy,
        eliteModifierId: null,
        eliteModifierLabel: "",
        eliteModifierDescription: ""
    };
}

function getOfflineEncounterDistribution(
    killCount,
    masteryPercent
) {
    const safeKillCount = Math.max(
        0,
        Math.floor(
            Number(killCount) || 0
        )
    );

    const chances =
        getEnemyEncounterChances(
            masteryPercent
        );

    const eliteKills = Math.min(
        safeKillCount,
        getOfflineOccurrenceCount(
            safeKillCount,
            chances.elite
        )
    );

    const remainingKills =
        safeKillCount -
        eliteKills;

    const nonEliteChance =
        100 -
        chances.elite;

    const strongChanceAmongRemaining =
        nonEliteChance > 0
            ? (
                chances.strong /
                nonEliteChance
            ) * 100
            : 0;

    const strongKills = Math.min(
        remainingKills,
        getOfflineOccurrenceCount(
            remainingKills,
            strongChanceAmongRemaining
        )
    );

    return {
        normal:
            remainingKills -
            strongKills,

        strong:
            strongKills,

        elite:
            eliteKills
    };
}


function applyOfflineEncounterDistribution(
    enemyKills,
    masteryPercent
) {
    const results = [];

    enemyKills.forEach(enemyKill => {
        const distribution =
            getOfflineEncounterDistribution(
                enemyKill.quantity,
                masteryPercent
            );

        Object.entries(
            distribution
        ).forEach(
            ([
                encounterType,
                quantity
            ]) => {
                if (quantity <= 0) {
                    return;
                }
                if (
                    encounterType ===
                    "elite"
                ) {
                    const modifierIds =
                        Object.keys(
                            eliteEnemyModifiers
                        );

                    const baseQuantity =
                        Math.floor(
                            quantity /
                            modifierIds.length
                        );

                    let remainingQuantity =
                        quantity -
                        baseQuantity *
                        modifierIds.length;

                    modifierIds.forEach(
                        modifierId => {
                            const modifierQuantity =
                                baseQuantity +
                                (
                                    remainingQuantity > 0
                                        ? 1
                                        : 0
                                );

                            if (remainingQuantity > 0) {
                                remainingQuantity--;
                            }

                            if (modifierQuantity <= 0) {
                                return;
                            }

                            results.push({
                                enemy:
                                    createOfflineEncounterEnemyData(
                                        enemyKill.enemy,
                                        "elite",
                                        modifierId
                                    ),

                                quantity:
                                    modifierQuantity
                            });
                        }
                    );

                    return;
                }
                results.push({
                    enemy:
                        createOfflineEncounterEnemyData(
                            enemyKill.enemy,
                            encounterType
                        ),

                    quantity: quantity
                });
            }
        );
    });

    return results;
}

function getOfflineAverageEncounterHpMultiplier(
    masteryPercent
) {
    const chances =
        getEnemyEncounterChances(
            masteryPercent
        );

    const normalChance =
        Math.max(
            0,
            100 -
            chances.strong -
            chances.elite
        );

    const eliteModifiers =
        Object.values(
            eliteEnemyModifiers
        );

    const averageEliteModifierHp =
        eliteModifiers.length > 0
            ? eliteModifiers.reduce(
                (
                    total,
                    modifier
                ) => {
                    return (
                        total +
                        (
                            Number(
                                modifier
                                    .hpMultiplier
                            ) || 1
                        )
                    );
                },
                0
            ) /
            eliteModifiers.length
            : 1;

    return (
        normalChance *
        enemyEncounterVariants
            .normal
            .hpMultiplier +

        chances.strong *
        enemyEncounterVariants
            .strong
            .hpMultiplier +

        chances.elite *
        enemyEncounterVariants
            .elite
            .hpMultiplier *
        averageEliteModifierHp
    ) / 100;
}

function getOfflineCombatLootChance(
    baseChance,
    lootBonus
) {
    const safeBaseChance = Math.max(
        0,
        Math.min(
            100,
            Number(baseChance) || 0
        )
    );

    const safeLootBonus = Math.max(
        0,
        Number(lootBonus) || 0
    );

    return Math.min(
        100,
        safeBaseChance *
        (
            1 +
            safeLootBonus / 100
        )
    );
}

function collectOfflineCombatLoot(
    enemyKills,
    savedAt,
    currentTime
) {
    const rewardTotals =
        new Map();

    const derived =
        getDerivedStats();

    const luckBonus = Math.max(
        0,
        Number(
            derived.lootBonus
        ) || 0
    );

    const skillBonus =
        typeof getLootChanceSkillBonus ===
            "function"
            ? Math.max(
                0,
                Number(
                    getLootChanceSkillBonus()
                ) || 0
            )
            : 0;

    const baseLootBonus =
        luckBonus +
        skillBonus;

    const hunterEffect =
        player.activeEffects
            ?.potionEffects
            ?.hunter_luck || null;

    const hunterEffectValue = Math.max(
        0,
        Number(
            hunterEffect?.value
        ) || 0
    );

    const offlineDuration = Math.max(
        0,
        currentTime - savedAt
    );

    const hunterDuration =
        getOfflineEffectOverlapDuration(
            hunterEffect,
            savedAt,
            currentTime
        );

    const hunterTimePercent =
        offlineDuration > 0
            ? Math.min(
                100,
                hunterDuration /
                offlineDuration *
                100
            )
            : 0;

    enemyKills.forEach(
        enemyKill => {
            const enemyData =
                enemyKill.enemy;

            const encounterLootMultiplier =
                Math.max(
                    1,
                    Number(
                        enemyData
                            .lootChanceMultiplier
                    ) || 1
                );

            if (
                !Array.isArray(
                    enemyData.loot
                )
            ) {
                return;
            }

            /*
             * Część przeciwników została
             * pokonana podczas działania
             * Mikstury łowcy.
             */
            const boostedKills =
                hunterEffectValue > 0
                    ? getOfflineOccurrenceCount(
                        enemyKill.quantity,
                        hunterTimePercent
                    )
                    : 0;

            const normalKills =
                enemyKill.quantity -
                boostedKills;

            enemyData.loot.forEach(
                drop => {
                    const rarityLootBonus =
                        typeof getRareHuntingLootChanceBonus ===
                            "function"
                            ? getRareHuntingLootChanceBonus(
                                drop.item
                            )
                            : 0;
                    const normalDropCount =
                        getOfflineOccurrenceCount(
                            normalKills,

                            getOfflineCombatLootChance(
                                drop.chance *
                                encounterLootMultiplier,

                                baseLootBonus +
                                rarityLootBonus
                            )
                        );

                    const boostedDropCount =
                        getOfflineOccurrenceCount(
                            boostedKills,

                            getOfflineCombatLootChance(
                                drop.chance *
                                encounterLootMultiplier,

                                baseLootBonus +
                                hunterEffectValue +
                                rarityLootBonus
                            )
                        );

                    const dropCount =
                        normalDropCount +
                        boostedDropCount;

                    if (dropCount <= 0) {
                        return;
                    }
                    const luckyFindChance =
                        typeof isLuckyFindEligibleHuntingLoot ===
                            "function" &&
                            typeof getLuckyFindDoubleDropChance ===
                            "function" &&
                            isLuckyFindEligibleHuntingLoot(
                                drop.item
                            )
                            ? getLuckyFindDoubleDropChance()
                            : 0;

                    const luckyFindBonusCount =
                        getOfflineOccurrenceCount(
                            dropCount,
                            luckyFindChance
                        );

                    const finalDropCount =
                        dropCount +
                        luckyFindBonusCount;
                    if (
                        typeof recordBestiaryLootDiscovery ===
                        "function"
                    ) {
                        recordBestiaryLootDiscovery(
                            enemyData,
                            drop.item,
                            player.location
                        );
                    }
                    /*
                     * Identyczne przedmioty
                     * łączymy w jeden wpis.
                     */
                    const existingReward =
                        rewardTotals.get(
                            drop.item
                        ) || {
                            itemId:
                                drop.item,

                            quantity: 0
                        };

                    existingReward.quantity +=
                        finalDropCount;

                    rewardTotals.set(
                        drop.item,
                        existingReward
                    );
                }
            );
        }
    );

    return Array.from(
        rewardTotals.values()
    );
}

function getOfflineHuntingChestTypeDistribution(
    chestCount,
    encounterType
) {
    const safeChestCount = Math.max(
        0,
        Math.floor(
            Number(chestCount) || 0
        )
    );

    const chances =
        getHuntingChestTypeChances(
            encounterType
        );

    const eliteChests = Math.min(
        safeChestCount,
        getOfflineOccurrenceCount(
            safeChestCount,
            chances.elite
        )
    );

    const remainingChests =
        safeChestCount -
        eliteChests;

    const nonEliteChance =
        100 -
        chances.elite;

    const rareChanceAmongRemaining =
        nonEliteChance > 0
            ? (
                chances.rare /
                nonEliteChance
            ) * 100
            : 0;

    const rareChests = Math.min(
        remainingChests,
        getOfflineOccurrenceCount(
            remainingChests,
            rareChanceAmongRemaining
        )
    );

    return {
        common:
            remainingChests -
            rareChests,

        rare:
            rareChests,

        elite:
            eliteChests
    };
}

function collectOfflineHuntingChestRewards(
    enemyKills
) {
    const chestCounts = {
        common: 0,
        rare: 0,
        elite: 0
    };

    const itemTotals =
        new Map();

    const goldMultiplier =
        getHuntingChestLocationGoldMultiplier();

    let totalGold = 0;

    enemyKills.forEach(enemyKill => {
        const encounterType =
            enemyKill.enemy
                .encounterType ||
            "normal";

        const chestCount =
            getOfflineOccurrenceCount(
                enemyKill.quantity,
                getHuntingChestChance(
                    encounterType
                )
            );

        if (chestCount <= 0) {
            return;
        }

        const distribution =
            getOfflineHuntingChestTypeDistribution(
                chestCount,
                encounterType
            );

        Object.entries(
            distribution
        ).forEach(
            ([
                chestTypeId,
                quantity
            ]) => {
                if (quantity <= 0) {
                    return;
                }

                const chest =
                    huntingChestTypes[
                    chestTypeId
                    ];

                chestCounts[
                    chestTypeId
                ] += quantity;

                const averageGold =
                    (
                        chest.minimumGold +
                        chest.maximumGold
                    ) / 2;

                totalGold += Math.round(
                    averageGold *
                    goldMultiplier *
                    quantity
                );

                const lootRollCount =
                    quantity *
                    chest.lootRolls;

                const enemyLoot =
                    Array.isArray(
                        enemyKill.enemy.loot
                    )
                        ? enemyKill.enemy.loot
                        : [];

                const weightedLoot =
                    enemyLoot
                        .filter(drop => {
                            return (
                                items[drop.item] &&
                                Number(
                                    drop.chance
                                ) > 0
                            );
                        })
                        .map(drop => {
                            return {
                                itemId:
                                    drop.item,

                                weight:
                                    typeof getHuntingChestDropWeight ===
                                        "function"
                                        ? getHuntingChestDropWeight(
                                            drop
                                        )
                                        : Number(
                                            drop.chance
                                        ),

                                chestExperience: 0
                            };
                        });

                const distributedLoot =
                    distributeOfflineDrops(
                        weightedLoot,
                        lootRollCount,
                        "chest",
                        "chestExperience"
                    );

                distributedLoot.forEach(
                    reward => {
                        itemTotals.set(
                            reward.itemId,
                            (
                                itemTotals.get(
                                    reward.itemId
                                ) || 0
                            ) +
                            reward.quantity
                        );
                    }
                );
            }
        );
    });

    const itemsFound =
        Array.from(
            itemTotals.entries()
        ).map(
            ([
                itemId,
                quantity
            ]) => {
                return {
                    itemId: itemId,
                    quantity: quantity
                };
            }
        );

    return {
        totalChests:
            chestCounts.common +
            chestCounts.rare +
            chestCounts.elite,

        commonChests:
            chestCounts.common,

        rareChests:
            chestCounts.rare,

        eliteChests:
            chestCounts.elite,

        gold: totalGold,
        items: itemsFound
    };
}


function updateOfflineCombatQuests(
    enemyKills
) {
    if (
        typeof quests === "undefined" ||
        !Array.isArray(quests)
    ) {
        return 0;
    }

    /*
     * Łączymy liczbę zabójstw
     * według nazwy przeciwnika.
     */
    const killsByEnemyName =
        new Map();

    enemyKills.forEach(enemyKill => {
        const enemyName =
            enemyKill.enemy?.name;

        if (!enemyName) {
            return;
        }

        const previousKills =
            killsByEnemyName.get(
                enemyName
            ) || 0;

        killsByEnemyName.set(
            enemyName,
            previousKills +
            enemyKill.quantity
        );
    });

    let completedQuestCount = 0;

    quests.forEach(quest => {
        if (
            typeof isQuestUnlocked ===
            "function" &&
            !isQuestUnlocked(
                quest
            )
        ) {
            return;
        }
        if (
            quest.claimed ||
            quest.completed
        ) {
            return;
        }

        const gainedKills =
            killsByEnemyName.get(
                quest.targetEnemyName
            ) || 0;

        if (gainedKills <= 0) {
            return;
        }

        const requiredKills = Math.max(
            1,
            Number(
                quest.requiredKills
            ) || 1
        );

        const currentKills = Math.max(
            0,
            Number(
                quest.currentKills
            ) || 0
        );

        quest.currentKills = Math.min(
            requiredKills,
            currentKills +
            gainedKills
        );

        if (
            quest.currentKills >=
            requiredKills
        ) {
            quest.completed = true;
            completedQuestCount++;
        }
    });

    return completedQuestCount;
}

function setOfflineCombatEnemy(
    enemyData,
    progressFraction = 0
) {
    const safeMaxHp = Math.max(
        1,
        Number(enemyData.hp) || 1
    );

    /*
     * Maksymalnie 99,9999% obrażeń,
     * ponieważ żywy przeciwnik musi
     * mieć przynajmniej 1 HP.
     */
    const safeProgress = Math.max(
        0,
        Math.min(
            0.999999,
            Number(
                progressFraction
            ) || 0
        )
    );

    enemy.id =
        enemyData.id;

    enemy.name =
        enemyData.name;

    enemy.maxHp =
        safeMaxHp;

    enemy.hp = Math.max(
        1,
        Math.ceil(
            safeMaxHp *
            (
                1 -
                safeProgress
            )
        )
    );

    enemy.attack =
        Number(enemyData.attack) || 1;

    enemy.gold =
        Number(enemyData.gold) || 0;

    enemy.exp =
        Number(enemyData.exp) || 0;

    enemy.loot =
        Array.isArray(enemyData.loot)
            ? enemyData.loot
            : [];

    enemy.baseName =
        enemyData.name;

    enemy.encounterType =
        enemyData.encounterType ||
        "normal";

    enemy.encounterLabel =
        enemyEncounterVariants[
            enemy.encounterType
        ]?.label ||
        "Zwykły przeciwnik";

    enemy.lootChanceMultiplier =
        Math.max(
            1,
            Number(
                enemyData
                    .lootChanceMultiplier
            ) || 1
        );
    enemy.eliteModifierId =
        enemyData.eliteModifierId ||
        null;

    enemy.eliteModifierLabel =
        enemyData.eliteModifierLabel ||
        "";

    enemy.eliteModifierDescription =
        enemyData
            .eliteModifierDescription ||
        "";
}

function processOfflineCombatProgress(
    savedAt,
    currentTime = Date.now()
) {
    if (
        !isFighting &&
        !player.isFighting
    ) {
        return null;
    }

    const safeCurrentTime =
        Number(currentTime) ||
        Date.now();

    const safeSavedAt = Math.min(
        safeCurrentTime,
        Number(savedAt) ||
        safeCurrentTime
    );

    const location =
        locations[player.location];

    if (
        !location ||
        !Array.isArray(
            location.enemies
        ) ||
        location.enemies.length === 0
    ) {
        return null;
    }

    if (
        typeof resetWarriorCombatState ===
        "function"
    ) {
        resetWarriorCombatState();
    }

    if (
    typeof resetCombatWeaponCapstoneState ===
    "function"
) {
    resetCombatWeaponCapstoneState();
}

    const combatDamage =
        calculateOfflineCombatDamage(
            safeSavedAt,
            safeCurrentTime
        );
    if (
        Number.isFinite(
            Number(
                combatDamage.finalMana
            )
        )
    ) {
        const derived =
            getDerivedStats();

        player.mana = Math.max(
            0,
            Math.min(
                derived.maxMana,
                Number(
                    combatDamage.finalMana
                )
            )
        );
    }

    if (
        combatDamage.attackCount <= 0 ||
        combatDamage.damage <= 0
    ) {
        return null;
    }

    const currentEnemyHp = Math.max(
        1,
        Number(enemy.hp) ||
        Number(enemy.maxHp) ||
        1
    );

    /*
     * Jeżeli aktualny przeciwnik przeżył,
     * zmniejszamy tylko jego HP.
     */
    if (
        combatDamage.damage <
        currentEnemyHp
    ) {
        enemy.hp =
            currentEnemyHp -
            combatDamage.damage;

        return {
            durationMilliseconds:
                Math.max(
                    0,
                    safeCurrentTime -
                    safeSavedAt
                ),

            sections: [
                {
                    icon: "⚔️",

                    title:
                        "Polowanie — " +
                        location.name,

                    stats: [
                        {
                            label:
                                "Czas aktywnej walki",

                            value:
                                Math.round(
                                    combatDamage
                                        .combatEfficiency *
                                    100
                                ) +
                                "%"
                        },
                        {
                            label:
                                "Wykonane ataki",

                            value:
                                combatDamage
                                    .attackCount
                        },
                        {
                            label:
                                "Zadane obrażenia",

                            value:
                                combatDamage
                                    .damage
                        },
                        {
                            label:
                                "Pozostałe HP przeciwnika",

                            value:
                                enemy.hp
                        },
                        {
                            label:
                                "Pokonani przeciwnicy",

                            value: 0
                        },
                        {
                            label:
                                "EXP bohatera",

                            value: 0,

                            prefix: "+"
                        },
                        {
                            label:
                                "Złoto",

                            value: 0,

                            prefix: "+"
                        }
                    ],

                    items: []
                }
            ]
        };
    }
    /*
     * Zapamiętujemy aktualnego przeciwnika,
     * ponieważ jest pierwszą ofiarą.
     */
    const currentEnemyData = {
        id: enemy.id,
        name: enemy.name,

        hp: Math.max(
            1,
            Number(enemy.maxHp) ||
            currentEnemyHp
        ),

        attack:
            Number(enemy.attack) || 1,

        gold:
            Number(enemy.gold) || 0,

        exp:
            Number(enemy.exp) || 0,

        loot:
            Array.isArray(enemy.loot)
                ? enemy.loot
                : [],

        encounterType:
            player.isBossFight === true
                ? "boss"
                : (
                    enemy.encounterType ||
                    "normal"
                ),

        lootChanceMultiplier:
            Math.max(
                1,
                Number(
                    enemy
                        .lootChanceMultiplier
                ) || 1
            )
        ,
        eliteModifierId:
            enemy.eliteModifierId ||
            null,

        eliteModifierLabel:
            enemy.eliteModifierLabel ||
            "",

        eliteModifierDescription:
            enemy
                .eliteModifierDescription ||
            ""
    };

    const currentEnemyWasBoss =
        player.isBossFight === true;

    let remainingDamage =
        combatDamage.damage -
        currentEnemyHp;

    const masteryPercentBefore =
        getLocationMasteryPercent(
            player.location
        );

    /*
     * Po pierwszym przeciwniku korzystamy
     * ze średniego HP potworów lokacji.
     */
    const averageBaseEnemyHp =
        location.enemies.reduce(
            (total, enemyData) => {
                return (
                    total +
                    Math.max(
                        1,
                        Number(
                            enemyData.hp
                        ) || 1
                    )
                );
            },
            0
        ) /
        location.enemies.length;

    const averageEnemyHp =
        averageBaseEnemyHp *
        getOfflineAverageEncounterHpMultiplier(
            masteryPercentBefore
        );

    const additionalKills = Math.max(
        0,
        Math.floor(
            remainingDamage /
            averageEnemyHp
        )
    );

    remainingDamage -=
        additionalKills *
        averageEnemyHp;

    /*
     * Łączymy zabójstwa tego samego
     * rodzaju przeciwnika.
     */
    const enemyKillTotals =
        new Map();

    function addEnemyKills(
        enemyData,
        quantity
    ) {
        const safeQuantity = Math.max(
            0,
            Math.floor(
                Number(quantity) || 0
            )
        );

        if (safeQuantity <= 0) {
            return;
        }

        const enemyKey =
            (
                enemyData.id ||
                enemyData.name
            ) +
            ":" +
            (
                enemyData.encounterType ||
                "normal"
            ) +
            ":" +
            (
                enemyData.eliteModifierId ||
                "none"
            );
        const existingKills =
            enemyKillTotals.get(
                enemyKey
            ) || {
                enemy: enemyData,
                quantity: 0
            };

        existingKills.quantity +=
            safeQuantity;

        enemyKillTotals.set(
            enemyKey,
            existingKills
        );
    }

    /*
     * Aktualny przeciwnik został
     * pokonany jako pierwszy.
     */
    addEnemyKills(
        currentEnemyData,
        1
    );

    const baseEnemyKills =
        distributeOfflineEnemyKills(
            location.enemies,
            additionalKills
        );

    const variantEnemyKills =
        applyOfflineEncounterDistribution(
            baseEnemyKills,
            masteryPercentBefore
        );

    variantEnemyKills.forEach(
        enemyKill => {
            addEnemyKills(
                enemyKill.enemy,
                enemyKill.quantity
            );
        }
    );

    const enemyKills =
        Array.from(
            enemyKillTotals.values()
        );

    if (
        typeof recordBestiaryKills ===
        "function"
    ) {
        enemyKills.forEach(
            enemyKill => {
                recordBestiaryKills(
                    enemyKill.enemy,

                    enemyKill.enemy
                        .encounterType ||
                    "normal",

                    enemyKill.quantity,

                    player.location
                );
            }
        );
    }

    const totalKills =
        1 + additionalKills;

    const strongKills =
        enemyKills.reduce(
            (total, enemyKill) => {
                return (
                    total +
                    (
                        enemyKill.enemy
                            .encounterType ===
                            "strong"
                            ? enemyKill.quantity
                            : 0
                    )
                );
            },
            0
        );

    const eliteKills =
        enemyKills.reduce(
            (total, enemyKill) => {
                return (
                    total +
                    (
                        enemyKill.enemy
                            .encounterType ===
                            "elite"
                            ? enemyKill.quantity
                            : 0
                    )
                );
            },
            0
        );

    let totalGold = 0;
    let totalExperience = 0;

    enemyKills.forEach(enemyKill => {
        totalGold +=
            Math.max(
                0,
                Number(
                    enemyKill.enemy.gold
                ) || 0
            ) *
            enemyKill.quantity;

        totalExperience +=
            Math.max(
                0,
                Number(
                    enemyKill.enemy.exp
                ) || 0
            ) *
            enemyKill.quantity;
    });

    const lootRewards =
        collectOfflineCombatLoot(
            enemyKills,
            safeSavedAt,
            safeCurrentTime
        );

    const chestRewards =
        collectOfflineHuntingChestRewards(
            enemyKills
        );

    lootRewards.forEach(reward => {
        addItemToInventory(
            reward.itemId,
            reward.quantity
        );
    });


    chestRewards.items.forEach(
        reward => {
            addItemToInventory(
                reward.itemId,
                reward.quantity
            );
        }
    );

    const completedQuestCount =
        updateOfflineCombatQuests(
            enemyKills
        );

    player.gold +=
        totalGold +
        chestRewards.gold;
    player.exp += totalExperience;
    let firstBossReward =
        null;

    if (
        currentEnemyWasBoss &&
        typeof grantFirstBossKillReward ===
        "function"
    ) {
        firstBossReward =
            grantFirstBossKillReward(
                player.location
            );
    }
    const levelBefore =
        player.level;

    if (
        typeof checkLevelUp ===
        "function"
    ) {
        checkLevelUp();
    }

    /*
     * Bossów nie losujemy offline.
     * Jeżeli aktywny boss został pokonany,
     * jego licznik zaczyna się od zera.
     */
    const normalKillCount = Math.max(
        0,
        totalKills -
        (
            currentEnemyWasBoss
                ? 1
                : 0
        )
    );

    const progress =
        getCurrentLocationProgress();
    progress.totalKills +=
        totalKills;

    progress.eliteKills +=
        eliteKills;

    if (currentEnemyWasBoss) {
        progress.bossKills += 1;
    }

    progress.chestsFound +=
        chestRewards.totalChests;

    progress.commonChestsFound +=
        chestRewards.commonChests;

    progress.rareChestsFound +=
        chestRewards.rareChests;

    progress.eliteChestsFound +=
        chestRewards.eliteChests;

    const masteryPercentAfter =
        getLocationMasteryPercent(
            player.location
        );

    LOCATION_MASTERY_THRESHOLDS
        .filter(threshold => {
            return (
                masteryPercentAfter >=
                threshold &&
                !progress
                    .masteryUnlockedMilestones
                    .includes(
                        threshold
                    )
            );
        })
        .forEach(threshold => {
            progress
                .masteryUnlockedMilestones
                .push(
                    threshold
                );
        });

    progress
        .masteryUnlockedMilestones
        .sort(
            (
                firstValue,
                secondValue
            ) => {
                return (
                    firstValue -
                    secondValue
                );
            }
        );
    const previousKillCounter =
        currentEnemyWasBoss
            ? 0
            : Math.max(
                0,
                Number(
                    progress
                        .bossKillsCounter
                ) || 0
            );

    progress.bossKillsCounter =
        previousKillCounter +
        normalKillCount;

    if (
        progress.bossKillsCounter < 26
    ) {
        progress.bossChance = 0;
    } else {
        progress.bossChance =
            Math.min(
                20,
                (
                    progress
                        .bossKillsCounter -
                    26 +
                    1
                ) *
                0.25
            );
    }

    player.bossKillsCounter =
        progress.bossKillsCounter;

    player.bossChance =
        progress.bossChance;

    player.isBossFight = false;

    if (
        typeof clearEnemyCombatEffects ===
        "function"
    ) {
        clearEnemyCombatEffects();
    }

    /*
     * Wybieramy przeciwnika, którego
     * gracz zastanie po powrocie.
     */
    const nextBaseEnemy =
        location.enemies[
        Math.floor(
            Math.random() *
            location.enemies.length
        )
        ];

    const nextEncounterType =
        rollEnemyEncounterType();

    const nextEnemy =
        createOfflineEncounterEnemyData(
            nextBaseEnemy,
            nextEncounterType
        );

    const nextEnemyProgress =
        nextEnemy.hp > 0
            ? remainingDamage /
            nextEnemy.hp
            : 0;

    setOfflineCombatEnemy(
        nextEnemy,
        nextEnemyProgress
    );

    if (
        typeof recordBestiaryEncounter ===
        "function"
    ) {
        recordBestiaryEncounter(
            nextEnemy,
            player.location
        );
    }

    const totalLootItems =
        lootRewards.reduce(
            (total, reward) => {
                return (
                    total +
                    reward.quantity
                );
            },
            0
        );

    const summaryStats = [
        {
            label:
                "Czas aktywnej walki",

            value:
                Math.round(
                    combatDamage
                        .combatEfficiency *
                    100
                ) +
                "%"
        },
        {
            label:
                "Symulowane odrodzenia",

            value:
                combatDamage
                    .deathCount
        },
        {
            label:
                combatDamage
                    .offensiveSpellName
                    ? (
                        "Zaklęcie: " +
                        combatDamage
                            .offensiveSpellName
                    )
                    : "Zaklęcia ofensywne",

            value:
                combatDamage
                    .offensiveSpellCasts
        },
        {
            label:
                "Obrażenia zaklęć",

            value:
                combatDamage
                    .offensiveSpellDamage
        },
        ...(
            combatDamage
                .equipmentSetBurnDamage > 0
                ? [
                    {
                        label:
                            "Obrażenia Smoczego gniewu",

                        value:
                            Math.floor(
                                combatDamage
                                    .equipmentSetBurnDamage
                            )
                    }
                ]
                : []
        ),
        ...(
            combatDamage
                .commanderDefenseEffectiveHp > 0
                ? [
                    {
                        label:
                            "Ochrona Niezłomnej obrony",

                        value:
                            Math.floor(
                                combatDamage
                                    .commanderDefenseEffectiveHp
                            ) +
                            " efektywnego HP"
                    }
                ]
                : []
        ),

        {
            label:
                combatDamage
                    .defensiveSpellName
                    ? (
                        "Obrona: " +
                        combatDamage
                            .defensiveSpellName
                    )
                    : "Zaklęcia defensywne",

            value:
                combatDamage
                    .defensiveSpellCasts
        },
        {
            label:
                "Leczenie offline",

            value:
                Math.floor(
                    combatDamage
                        .defensiveHealing ||
                    0
                )
        },
        {
            label:
                "Redukcja z bariery",

            value:
                (
                    Number(
                        combatDamage
                            .defensiveDamageReduction
                    ) || 0
                ).toFixed(1) +
                "%"
        },

        {
            label:
                "Średnia redukcja z mikstury",

            value:
                (
                    Number(
                        combatDamage
                            .defensePotionReduction
                    ) || 0
                ).toFixed(1) +
                "%"
        },


        {
            label:
                "Mniej ataków dzięki mrozowi",

            value:
                (
                    Number(
                        combatDamage
                            .frostAttackReduction
                    ) || 0
                ).toFixed(1) +
                "%"
        },

        {
            label:
                "Pokonani przeciwnicy",

            value: totalKills
        },

        {
            label:
                "Silni przeciwnicy",

            value: strongKills
        },
        {
            label:
                "Elitarni przeciwnicy",

            value: eliteKills
        },
        {
            label:
                "Opanowanie lokacji",

            value:
                Math.floor(
                    masteryPercentAfter
                ) +
                "%"
        },
        {
            label: "EXP bohatera",
            value: totalExperience,
            prefix: "+"
        },
        {
            label: "Złoto",
            value: totalGold,
            prefix: "+"
        },
        {
            label:
                "Zdobyte przedmioty",

            value: totalLootItems,
            prefix: "+"
        }
    ];

    if (
        player.level >
        levelBefore
    ) {
        summaryStats.push({
            label:
                "Nowy poziom bohatera",

            value: player.level
        });
    }

    if (completedQuestCount > 0) {
        summaryStats.push({
            label:
                "Ukończone zadania",

            value:
                completedQuestCount
        });
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "🌙 Polowanie offline: pokonano " +
            totalKills +
            " przeciwników, zdobyto +" +
            totalExperience +
            " EXP, +" +
            totalGold +
            " złota i +" +
            totalLootItems +
            " przedmiotów.",
            "offline"
        );
        if (
            chestRewards.totalChests > 0
        ) {
            addSystemLog(
                "📦 Polowanie offline: automatycznie otwarto " +
                chestRewards.totalChests +
                " skrzyń i zdobyto z nich " +
                chestRewards.gold +
                " złota.",
                "offline"
            );
        }

    }
    const summarySections = [
        {
            icon: "⚔️",

            title:
                "Polowanie — " +
                location.name,

            stats: summaryStats,
            items: lootRewards
        }
    ];
    if (firstBossReward) {
        summarySections.push({
            icon: "🏆",

            title:
                "Pierwsze zwycięstwo nad bossem",

            stats: [
                {
                    label: "Dodatkowe złoto",

                    value:
                        firstBossReward.gold,

                    prefix: "+"
                },
                {
                    label: "Dodatkowe EXP",

                    value:
                        firstBossReward
                            .experience,

                    prefix: "+"
                }
            ],

            items:
                firstBossReward.items
        });
    }
    if (
        chestRewards.totalChests > 0
    ) {
        summarySections.push({
            icon: "📦",

            title:
                "Automatycznie otwarte skrzynie",

            stats: [
                {
                    label:
                        "Wszystkie skrzynie",

                    value:
                        chestRewards
                            .totalChests
                },
                {
                    label: "Zwykłe",

                    value:
                        chestRewards
                            .commonChests
                },
                {
                    label: "Rzadkie",

                    value:
                        chestRewards
                            .rareChests
                },
                {
                    label: "Elitarne",

                    value:
                        chestRewards
                            .eliteChests
                },
                {
                    label:
                        "Złoto ze skrzyń",

                    value:
                        chestRewards.gold,

                    prefix: "+"
                }
            ],

            items:
                chestRewards.items
        });
    }
    return {
        durationMilliseconds:
            Math.max(
                0,
                safeCurrentTime -
                safeSavedAt
            ),

        sections:
            summarySections
    };
}
