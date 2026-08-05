var isFighting = false;
var intervalId = null;
var enemyIntervalId = null;
var enemySlowUntil = 0;
var enemyAttackSkipChance = 0;
var isRespawning = false;
var respawnTimeLeft = 0;
var explorationRespawnShieldHp = 0;

const COMBAT_REENTRY_COOLDOWN_MS =
    15 * 1000;

function resetExplorationRespawnShield() {
    explorationRespawnShieldHp = 0;
}

function grantExplorationRespawnShield(
    maximumHp
) {
    const safeMaximumHp = Math.max(
        0,
        Number(maximumHp) || 0
    );

    const shieldPercent =
        typeof getExplorationRespawnShieldPercent ===
            "function"
            ? getExplorationRespawnShieldPercent()
            : 0;

    const shieldHp = Math.max(
        0,
        Math.floor(
            safeMaximumHp *
            shieldPercent /
            100
        )
    );

    explorationRespawnShieldHp =
        shieldHp;

    return shieldHp;
}

function absorbExplorationRespawnShieldDamage(
    damage
) {
    const safeDamage = Math.max(
        0,
        Math.floor(
            Number(damage) || 0
        )
    );

    const safeShield = Math.max(
        0,
        Math.floor(
            Number(
                explorationRespawnShieldHp
            ) || 0
        )
    );

    const absorbedDamage = Math.min(
        safeDamage,
        safeShield
    );

    explorationRespawnShieldHp =
        safeShield -
        absorbedDamage;

    return {
        damage:
            safeDamage -
            absorbedDamage,

        absorbedDamage,

        remainingShield:
            explorationRespawnShieldHp
    };
}

function getCombatCooldownMillisecondsLeft() {
    const cooldownUntil =
        Number(
            player.combatCooldownUntil
        ) || 0;

    return Math.max(
        0,
        cooldownUntil -
        Date.now()
    );
}

function getCombatCooldownSecondsLeft() {
    return Math.ceil(
        getCombatCooldownMillisecondsLeft() /
        1000
    );
}

function startCombatReentryCooldown() {
    player.combatCooldownUntil =
        Date.now() +
        COMBAT_REENTRY_COOLDOWN_MS;
}

var combatLogMessages = window.combatLogMessages || [];
window.combatLogMessages = combatLogMessages;

function addCombatLog(message) {
    combatLogMessages.push(message);

    if (
        combatLogMessages.length > 30
    ) {
        combatLogMessages.shift();
    }

    renderCombatLog();
}

function renderCombatLog() {
    const logContainer = document.getElementById("combat-log");
    if (!logContainer) return;

    logContainer.innerHTML = "";

    combatLogMessages.forEach(message => {
        const div = document.createElement("div");
        div.className = "combat-log-entry";

        if (
            message.includes(
                "Niezłomna obrona"
            ) ||
            message.includes(
                "Smoczy gniew"
            )
        ) {
            div.classList.add(
                "set-effect"
            );
        } else if (message.includes("Krytyczne")) {
            div.classList.add("crit");
        } else if (
            message.includes(
                "Zadałeś"
            ) ||
            message.includes(
                "zadaje"
            ) ||
            message.includes(
                "zadają"
            ) ||
            message.includes(
                "uderza za"
            )
        ) {
            div.classList.add("damage");
        } else if (message.includes("EXP") || message.includes("złota") || message.includes("Awans")) {
            div.classList.add("reward");
        } else if (message.includes("Zdobyto przedmiot")) {
            div.classList.add("loot");
        } else if (message.includes("pokonany") || message.includes("Odrodzenie")) {
            div.classList.add("death");
        } else if (message.includes("Boss") || message.includes("boss") || message.includes("👑")) {
            div.classList.add("boss");
        } else {
            div.classList.add("system");
        }

        div.textContent = message;

        logContainer.appendChild(div);
    });

    logContainer.scrollTop = logContainer.scrollHeight;
}

function clearCombatLog() {
    combatLogMessages = [];
    window.combatLogMessages = combatLogMessages;

    renderCombatLog();

    if (
        typeof saveGame ===
        "function"
    ) {
        saveGame();
    }
}

function ensureGoblinHideoutKeyProgress() {
    if (
        !player.dungeonKeyProgress ||
        typeof player.dungeonKeyProgress !==
        "object" ||
        Array.isArray(
            player.dungeonKeyProgress
        )
    ) {
        player.dungeonKeyProgress = {};
    }

    if (
        !player.dungeonKeyProgress
            .goblinHideout ||
        typeof player
            .dungeonKeyProgress
            .goblinHideout !==
        "object"
    ) {
        player.dungeonKeyProgress
            .goblinHideout = {
            firstKeyGranted: false,
            bossKillsSinceKey: 0
        };
    }

    const progress =
        player.dungeonKeyProgress
            .goblinHideout;

    progress.firstKeyGranted =
        progress.firstKeyGranted ===
        true;

    progress.bossKillsSinceKey =
        Math.max(
            0,
            Math.floor(
                Number(
                    progress
                        .bossKillsSinceKey
                ) || 0
            )
        );

    return progress;
}

function getGoblinHideoutKeyDropChance(
    bossKillsSinceKey
) {
    const safeBossKills =
        Math.max(
            1,
            Math.floor(
                Number(
                    bossKillsSinceKey
                ) || 1
            )
        );

    if (safeBossKills <= 5) {
        return 5;
    }

    if (safeBossKills <= 10) {
        return 10;
    }

    if (safeBossKills <= 15) {
        return 25;
    }

    return 50;
}

function tryGrantGoblinHideoutKey(
    defeatedEnemy,
    locationId = player.location
) {
    if (
        locationId !== "forest" ||
        defeatedEnemy?.id !==
        "goblin_chief"
    ) {
        return null;
    }

    const progress =
        ensureGoblinHideoutKeyProgress();

    /*
     * Pierwszy klucz jest zawsze
     * gwarantowany.
     */
    if (
        progress.firstKeyGranted !==
        true
    ) {
        const itemGranted =
            addItemToInventory(
                "goblin_hideout_key",
                1
            );

        if (!itemGranted) {
            return null;
        }

        progress.firstKeyGranted =
            true;

        progress.bossKillsSinceKey =
            0;

        const message =
            "🗝️ Pierwsze zwycięstwo nad Goblinim Hersztem zapewniło Klucz do Kryjówki Goblinów!";

        if (
            typeof addCombatLog ===
            "function"
        ) {
            addCombatLog(message);
        }

        if (
            typeof addSystemLog ===
            "function"
        ) {
            addSystemLog(
                message,
                "dungeon"
            );
        }

        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Zdobyto Klucz do Kryjówki Goblinów!",
                "success"
            );
        }

        return {
            granted: true,
            guaranteed: true,
            chance: 100
        };
    }

    /*
     * Każdy kolejny pokonany Herszt
     * zwiększa licznik.
     */
    progress.bossKillsSinceKey++;

    const chance =
        getGoblinHideoutKeyDropChance(
            progress.bossKillsSinceKey
        );

    const roll =
        Math.random() * 100;

    if (roll > chance) {
        const nextChance =
            getGoblinHideoutKeyDropChance(
                progress
                    .bossKillsSinceKey +
                1
            );

        addCombatLog(
            "🗝️ Goblini Herszt nie pozostawił klucza. " +
            "Szansa wynosiła " +
            chance +
            "%. Szansa przy następnym bossie: " +
            nextChance +
            "%."
        );

        return {
            granted: false,
            guaranteed: false,
            chance: chance,
            roll: roll
        };
    }

    const itemGranted =
        addItemToInventory(
            "goblin_hideout_key",
            1
        );

    if (!itemGranted) {
        return null;
    }

    progress.bossKillsSinceKey =
        0;

    const message =
        "🗝️ Goblini Herszt pozostawił Klucz do Kryjówki Goblinów! Szansa wynosiła " +
        chance +
        "%.";

    if (
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(message);
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            message,
            "dungeon"
        );
    }

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Zdobyto Klucz do Kryjówki Goblinów!",
            "success"
        );
    }

    return {
        granted: true,
        guaranteed: false,
        chance: chance,
        roll: roll
    };
}

function applyEnemySlow(durationSeconds, skipChance) {
    enemySlowUntil =
        Date.now() + durationSeconds * 1000;

    enemyAttackSkipChance = Math.max(
        0,
        Math.min(90, skipChance || 0)
    );
}

function isEnemySlowed() {
    return enemySlowUntil > Date.now();
}

function shouldSlowedEnemySkipAttack() {
    if (!isEnemySlowed()) {
        return false;
    }

    const roll = Math.random() * 100;

    return roll <= enemyAttackSkipChance;
}

function clearEnemyCombatEffects() {
    enemySlowUntil = 0;
    enemyAttackSkipChance = 0;

    if (
        typeof clearEquipmentSetEnemyEffects ===
        "function"
    ) {
        clearEquipmentSetEnemyEffects();
    }

    if (
        typeof clearWarriorBleeds ===
        "function"
    ) {
        clearWarriorBleeds();
    }

    if (
        typeof clearIgnite ===
        "function"
    ) {
        clearIgnite();
    }

    if (
        typeof clearRoguePoisons ===
        "function"
    ) {
        clearRoguePoisons();
    }
}

function getPlayerAttackIntervalMs(
    includeWarriorBonuses = true
) {
    const weaponId =
        player.equipment.weapon;

    const weapon =
        weaponId
            ? items[weaponId]
            : null;

    const combatSettings =
        getWeaponCombatSettings(
            weapon
        );

    const warriorAttackSpeed =
        includeWarriorBonuses &&
            typeof getWarriorBerserkerAttackSpeedPercent ===
            "function"
            ? getWarriorBerserkerAttackSpeedPercent()
            : 0;

    const hunterAttackSpeed =
        includeWarriorBonuses &&
            typeof getHunterAttackSpeedPercent ===
            "function"
            ? getHunterAttackSpeedPercent()
            : 0;

    const rogueAttackSpeed =
        includeWarriorBonuses &&
            typeof getRogueAttackSpeedPercent ===
            "function"
            ? getRogueAttackSpeedPercent()
            : 0;

    return Math.max(
        100,
        Math.floor(
            combatSettings.attackIntervalMs /
            (
                1 +
                (
                    warriorAttackSpeed +
                    hunterAttackSpeed +
                    rogueAttackSpeed
                ) /
                100
            )
        )
    );
}

function schedulePlayerAttack() {
    if (!isFighting) {
        return;
    }

    const attackInterval =
        getPlayerAttackIntervalMs();

    intervalId = setTimeout(() => {
        if (!isFighting) {
            return;
        }

        autoAttack();
        schedulePlayerAttack();
    }, attackInterval);
}

function autoAttack() {
    if (isRespawning) {
        return;
    }

    const attackResult = calculatePlayerDamage();

    const bleedDamage =
        typeof collectWarriorBleedDamage ===
            "function"
            ? collectWarriorBleedDamage()
            : 0;

    const igniteDamage =
        typeof collectIgniteDamage ===
            "function"
            ? collectIgniteDamage()
            : 0;

    const poisonDamage =
        typeof collectRoguePoisonDamage ===
            "function"
            ? collectRoguePoisonDamage()
            : 0;

    const dragonBurnDamage =
        typeof collectDragonWrathBurnDamage ===
            "function"
            ? collectDragonWrathBurnDamage()
            : 0;

    enemy.hp -=
        attackResult.damage +
        bleedDamage +
        igniteDamage +
        poisonDamage +
        dragonBurnDamage;

    if (attackResult.isCritical) {
        addCombatLog("💥 Krytyczne trafienie! Zadałeś " + attackResult.damage + " obrażeń.");
    } else {
        addCombatLog("⚔️ Zadałeś " + attackResult.damage + " obrażeń.");
    }

    if (
        attackResult
            .warriorPowerStrike
    ) {
        addCombatLog(
            "💪 Potężne uderzenie zwiększyło obrażenia!"
        );
    }

    if (
        attackResult
            .hunterSniperShot
    ) {
        addCombatLog(
            "🎯 Snajper: precyzyjny strzał trafił w słaby punkt!"
        );
    }

    if (
        attackResult
            .hunterDoubleShot
    ) {
        addCombatLog(
            "🏹 " +
            (
                attackResult
                    .hunterAdditionalArrowCount >
                    1
                    ? "Grad strzał"
                    : "Podwójny strzał"
            ) +
            " zadał dodatkowo " +
            attackResult
                .hunterAdditionalArrowDamage +
            " obrażeń."
        );
    }

    if (
        attackResult
            .hunterCounterShot
    ) {
        addCombatLog(
            "💨 Strzał odwetowy zwiększył obrażenia."
        );
    }

    if (
        attackResult
            .rogueShadowstep
    ) {
        addCombatLog(
            "💨 Krok cienia wzmocnił atak."
        );
    }

    if (
        attackResult
            .rogueExecutioner
    ) {
        addCombatLog(
            "🗡️ Egzekutor zwiększył obrażenia przeciwko osłabionemu przeciwnikowi."
        );
    }

    if (
        attackResult
            .rogueBladeDance
    ) {
        addCombatLog(
            "⚔️ Taniec ostrzy zadał dodatkowo " +
            attackResult
                .rogueBladeDanceDamage +
            " obrażeń."
        );
    }

    if (bleedDamage > 0) {
        addCombatLog(
            "🩸 Krwawienie zadało " +
            bleedDamage +
            " obrażeń."
        );
    }

    if (igniteDamage > 0) {
        addCombatLog(
            "🔥 Podpalenie zadało " +
            igniteDamage +
            " obrażeń."
        );
    }

    if (poisonDamage > 0) {
        addCombatLog(
            "☠️ Trucizna zadała " +
            poisonDamage +
            " obrażeń."
        );
    }

    if (dragonBurnDamage > 0) {
        addCombatLog(
            "🔥 Smoczy gniew zadaje " +
            dragonBurnDamage +
            " obrażeń od podpalenia."
        );
    }

    if (
        enemy.hp > 0 &&
        typeof tryApplyWarriorBleed ===
        "function" &&
        tryApplyWarriorBleed(
            attackResult.damage
        )
    ) {
        addCombatLog(
            "🩸 Przeciwnik zaczyna krwawić."
        );
    }

    if (
        enemy.hp > 0 &&
        typeof tryApplyRoguePoison ===
        "function" &&
        tryApplyRoguePoison(
            attackResult.damage
        )
    ) {
        addCombatLog(
            "☠️ Ostrze zatruło przeciwnika."
        );
    }

    if (
        enemy.hp > 0 &&
        attackResult.isCritical &&
        typeof applyDragonWrathBurn ===
        "function"
    ) {
        const dragonBurnResult =
            applyDragonWrathBurn(
                attackResult.damage
            );

        if (dragonBurnResult.applied) {
            addCombatLog(
                "🔥 Smoczy gniew " +
                (
                    dragonBurnResult.refreshed
                        ? "odnawia podpalenie"
                        : "podpala przeciwnika"
                ) +
                " na " +
                dragonBurnResult
                    .ticksRemaining +
                " tury (" +
                dragonBurnResult
                    .damagePerTick +
                " obrażeń na turę)."
            );
        }
    }

    if (
        enemy.hp > 0 &&
        typeof castSelectedOffensiveSpell === "function"
    ) {
        castSelectedOffensiveSpell();
    }

    if (enemy.hp <= 0) {
        clearEnemyCombatEffects();

        addCombatLog(
            "☠️ Pokonałeś: " +
            enemy.name +
            "."
        );

        player.gold +=
            enemy.gold;

        player.exp +=
            enemy.exp;

        addCombatLog(
            "⭐ Zdobyto " +
            enemy.exp +
            " EXP i " +
            enemy.gold +
            " złota."
        );

        const defeatedEnemyWasBoss =
            player.isBossFight === true;

        const defeatedEnemyType =
            defeatedEnemyWasBoss
                ? "boss"
                : (
                    enemy.encounterType ||
                    "normal"
                );

        if (
            typeof recordBestiaryKill ===
            "function"
        ) {
            recordBestiaryKill(
                enemy,
                defeatedEnemyType,
                player.location
            );
        }

        rollLoot(enemy);

        if (
            typeof tryOpenAutomaticHuntingChest ===
            "function"
        ) {
            tryOpenAutomaticHuntingChest(
                enemy,
                defeatedEnemyType
            );
        }

        if (
            defeatedEnemyWasBoss &&
            typeof grantFirstBossKillReward ===
            "function"
        ) {
            grantFirstBossKillReward(
                player.location
            );
        }

        if (
            defeatedEnemyWasBoss &&
            typeof tryGrantGoblinHideoutKey ===
            "function"
        ) {
            tryGrantGoblinHideoutKey(
                enemy,
                player.location
            );
        }

        updateQuests(enemy.name);

        if (
            typeof updateLocationMasteryAfterKill ===
            "function"
        ) {
            updateLocationMasteryAfterKill(
                defeatedEnemyWasBoss,
                defeatedEnemyType
            );
        }

        if (player.isBossFight) {
            const defeatedBossName = enemy.name;
            const progress = getCurrentLocationProgress();

            progress.bossKillsCounter = 0;
            progress.bossChance = 0;

            player.isBossFight = false;
            player.bossKillsCounter = 0;
            player.bossChance = 0;

            addCombatLog("👑 Boss został pokonany!");
            spawnEnemy();
            addCombatLog("👹 Pojawił się nowy przeciwnik: " + enemy.name + ".");
        } else {
            updateBossChanceAfterKill();

            const bossSpawned = trySpawnBoss();

            if (!bossSpawned) {
                spawnEnemy();
                addCombatLog("👹 Pojawił się nowy przeciwnik: " + enemy.name + ".");
            }
        }
        if (
            typeof refreshLocationProgressInterface ===
            "function"
        ) {
            refreshLocationProgressInterface(
                player.location
            );
        }

        if (
            typeof refreshJournalLocationInterface ===
            "function"
        ) {
            refreshJournalLocationInterface();
        }

        checkLevelUp();
        saveGame();
        refreshCombatInterface();

        return;
    }


    saveGame();
    refreshCombatInterface();
}

function autoEnemyAttack() {
    if (
        !isFighting ||
        isRespawning
    ) {
        return;
    }

    if (
        !enemy ||
        enemy.hp <= 0
    ) {
        return;
    }

    enemyAttackPlayer();

    saveGame();
    refreshCombatInterface();
}

function enemyAttackPlayer() {
    const derived = getDerivedStats();

    if (
        typeof castSelectedDefensiveSpell === "function"
    ) {
        castSelectedDefensiveSpell();
    }

    const regenerationHealing =
        typeof collectRegenerationHealing ===
            "function"
            ? collectRegenerationHealing()
            : 0;

    if (regenerationHealing > 0) {
        addCombatLog(
            "🌿 Regeneracja przywraca " +
            regenerationHealing +
            " HP."
        );
    }

    const foodRegenerationHealing =
        typeof collectFoodRegenerationHealing ===
            "function"
            ? collectFoodRegenerationHealing()
            : 0;

    if (
        foodRegenerationHealing > 0
    ) {
        addCombatLog(
            "🍲 Aktywny posiłek przywraca " +
            foodRegenerationHealing +
            " HP."
        );
    }

    if (
        typeof shouldSlowedEnemySkipAttack === "function" &&
        shouldSlowedEnemySkipAttack()
    ) {
        addCombatLog(
            "❄️ Spowolniony przeciwnik nie zdążył zaatakować."
        );

        return;
    }

    if (
        typeof consumeMirrorImageCharge ===
        "function" &&
        consumeMirrorImageCharge()
    ) {
        addCombatLog(
            "🪞 Lustrzane odbicie przyjęło atak przeciwnika."
        );

        return;
    }

    const dodgeRoll = Math.random() * 100;
    const didDodge =
        dodgeRoll <= derived.dodgeChance;

    if (didDodge) {
        addCombatLog(
            "💨 Uniknąłeś ataku potwora."
        );

        const counterCharges =
            typeof registerHunterDodge ===
                "function"
                ? registerHunterDodge()
                : 0;

        if (counterCharges > 0) {
            addCombatLog(
                "🏹 Unik przygotował " +
                (
                    counterCharges === 1
                        ? "strzał odwetowy."
                        : counterCharges +
                        " strzały odwetowe."
                )
            );
        }

        const shadowstepCharges =
            typeof registerRogueDodge ===
                "function"
                ? registerRogueDodge()
                : 0;

        if (shadowstepCharges > 0) {
            addCombatLog(
                "💨 Unik przygotował Krok cienia."
            );
        }

        return;
    }

    const rawDamage =
        enemy.attack || 1;

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
            rawDamage - flatArmor
        );

    const enduranceDamageReduction =
        Math.max(
            0,
            Math.min(
                95,
                Number(
                    derived.defense
                ) || 0
            )
        );

    let reducedDamage = Math.max(
        1,
        Math.floor(
            damageAfterArmor *
            (
                1 -
                enduranceDamageReduction /
                100
            )
        )
    );

    const barrierReduction =
        typeof getArcaneBarrierDamageReduction ===
            "function"
            ? getArcaneBarrierDamageReduction()
            : 0;

    if (barrierReduction > 0) {
        reducedDamage = Math.max(
            1,
            Math.floor(
                reducedDamage *
                (1 - barrierReduction / 100)
            )
        );
    }

    const potionDefenseReduction =
        typeof getActivePotionEffectValue ===
            "function"
            ? getActivePotionEffectValue(
                "combat_defense"
            )
            : 0;

    if (
        potionDefenseReduction > 0 &&
        typeof applyCombatDefensePotionReduction ===
        "function"
    ) {
        reducedDamage =
            applyCombatDefensePotionReduction(
                reducedDamage
            );
    }

    const warriorDamageReduction =
        typeof getWarriorReceivedDamageReduction ===
            "function"
            ? getWarriorReceivedDamageReduction()
            : 0;

    if (
        warriorDamageReduction > 0
    ) {
        reducedDamage = Math.max(
            1,
            Math.floor(
                reducedDamage *
                (
                    1 -
                    warriorDamageReduction /
                    100
                )
            )
        );
    }

    const guardianDamageReduction =
        typeof getGuardianReceivedDamageReduction ===
            "function"
            ? getGuardianReceivedDamageReduction()
            : 0;

    if (
        guardianDamageReduction > 0
    ) {
        reducedDamage = Math.max(
            1,
            Math.floor(
                reducedDamage *
                (
                    1 -
                    guardianDamageReduction /
                    100
                )
            )
        );
    }

    const commanderDefenseResult =
        typeof applyCommanderDefenseToDamage ===
            "function"
            ? applyCommanderDefenseToDamage(
                reducedDamage,
                derived.maxHp
            )
            : {
                damage: reducedDamage,
                triggered: false,
                active: false,
                reducedBy: 0,
                chargesRemaining: 0
            };

    reducedDamage =
        commanderDefenseResult.damage;

    if (commanderDefenseResult.triggered) {
        addCombatLog(
            "🛡️ Niezłomna obrona aktywowała się: obrażenia -20% przez 3 ataki przeciwnika."
        );
    }

    const manaShieldResult =
        typeof applyManaShieldToDamage ===
            "function"
            ? applyManaShieldToDamage(
                reducedDamage
            )
            : {
                damage:
                    reducedDamage,
                absorbed:
                    0,
                manaSpent:
                    0
            };

    reducedDamage =
        manaShieldResult.damage;

    const explorationShieldResult =
        typeof absorbExplorationRespawnShieldDamage ===
            "function"
            ? absorbExplorationRespawnShieldDamage(
                reducedDamage
            )
            : {
                damage:
                    reducedDamage,

                absorbedDamage:
                    0,

                remainingShield:
                    0
            };

    reducedDamage =
        explorationShieldResult.damage;

    if (
        explorationShieldResult
            .absorbedDamage > 0
    ) {
        addCombatLog(
            "🧭 Tarcza odkrywcy pochłonęła " +
            explorationShieldResult
                .absorbedDamage +
            " obrażeń." +
            (
                explorationShieldResult
                    .remainingShield > 0
                    ? " Pozostało " +
                    explorationShieldResult
                        .remainingShield +
                    " punktów tarczy."
                    : " Tarcza została zniszczona."
            )
        );
    }

    player.hp -= reducedDamage;

    if (
        typeof consumeGuardianGuardCharge ===
        "function"
    ) {
        consumeGuardianGuardCharge();
    }

    const guardianHitResult =
        typeof resolveGuardianReceivedHit ===
            "function"
            ? resolveGuardianReceivedHit()
            : {
                retaliationTriggered:
                    false,
                retaliationDamage:
                    0,
                healing:
                    0
            };

    if (
        guardianHitResult.healing > 0
    ) {
        addCombatLog(
            "💚 Bojowa regeneracja przywraca " +
            guardianHitResult.healing +
            " HP."
        );
    }

    if (
        guardianHitResult
            .retaliationTriggered &&
        enemy
    ) {
        enemy.hp -=
            guardianHitResult
                .retaliationDamage;

        addCombatLog(
            (
                guardianHitResult
                    .forcedRetaliation
                    ? "🛡️ Kolczasty bastion"
                    : "⚔️ Cios odwetowy"
            ) +
            " zadaje " +
            guardianHitResult
                .retaliationDamage +
            " obrażeń."
        );
    }

    const activeProtections = [];

    if (barrierReduction > 0) {
        activeProtections.push(
            "Magiczna bariera"
        );
    }

    if (potionDefenseReduction > 0) {
        activeProtections.push(
            "Mikstura ochrony"
        );
    }

    if (warriorDamageReduction > 0) {
        activeProtections.push(
            "Żelazna skóra"
        );
    }

    if (guardianDamageReduction > 0) {
        activeProtections.push(
            "Obrona Strażnika"
        );
    }

    if (
        commanderDefenseResult.active
    ) {
        activeProtections.push(
            "Niezłomna obrona (" +
            commanderDefenseResult
                .chargesRemaining +
            " pozostałe)"
        );
    }

    if (
        manaShieldResult.absorbed >
        0
    ) {
        activeProtections.push(
            "Tarcza many"
        );

        addCombatLog(
            "🔷 Tarcza many pochłonęła " +
            manaShieldResult.absorbed +
            " obrażeń. Mana: -" +
            manaShieldResult.manaSpent +
            "."
        );
    }

    if (activeProtections.length > 0) {
        addCombatLog(
            "🛡️ " +
            activeProtections.join(" + ") +
            ": " +
            enemy.name +
            " zadaje " +
            reducedDamage +
            " obrażeń."
        );
    } else {
        addCombatLog(
            "👹 " +
            enemy.name +
            " zadaje " +
            reducedDamage +
            " obrażeń."
        );
    }

    const secondWindHealing =
        typeof tryTriggerWarriorSecondWind ===
            "function"
            ? tryTriggerWarriorSecondWind()
            : 0;

    if (secondWindHealing > 0) {
        addCombatLog(
            "❤️ Drugi oddech przywrócił " +
            secondWindHealing +
            " HP."
        );
    }

    const arcaneRebirth =
        typeof tryTriggerMageArcaneRebirth ===
            "function"
            ? tryTriggerMageArcaneRebirth()
            : {
                triggered:
                    false
            };

    if (arcaneRebirth.triggered) {
        addCombatLog(
            "💠 Arkaniczne odrodzenie przywróciło " +
            arcaneRebirth.healing +
            " HP kosztem " +
            arcaneRebirth.manaSpent +
            " many."
        );
    }

    const guardianUnyielding =
        typeof tryTriggerGuardianUnyielding ===
            "function"
            ? tryTriggerGuardianUnyielding()
            : {
                triggered:
                    false
            };

    if (guardianUnyielding.triggered) {
        addCombatLog(
            "🛡️ Niezłomność przywróciła " +
            guardianUnyielding.healing +
            " HP i wzmocniła obronę na " +
            guardianUnyielding.guardCharges +
            " kolejne ciosy."
        );
    }

    if (
        player.hp > 0 &&
        typeof tryUseAutoHealingPotion ===
        "function"
    ) {
        tryUseAutoHealingPotion();
    }

    if (player.hp <= 0) {
        startRespawnCooldown();
    }
}

function handleBossEscapeAfterPlayerDefeat() {
    if (
        player.isBossFight !== true
    ) {
        return;
    }

    const escapedBossName =
        enemy.name;

    const progress =
        getCurrentLocationProgress();

    /*
     * Zerujemy wyłącznie postęp
     * prowadzący do kolejnego bossa.
     */
    progress.bossKillsCounter = 0;
    progress.bossChance = 0;

    player.bossKillsCounter = 0;
    player.bossChance = 0;
    player.isBossFight = false;

    if (
        typeof clearEnemyCombatEffects ===
        "function"
    ) {
        clearEnemyCombatEffects();
    }

    addCombatLog(
        "💨 " +
        escapedBossName +
        " uciekł po pokonaniu bohatera!"
    );

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "💨 Boss " +
            escapedBossName +
            " uciekł. Licznik i szansa bossa zostały wyzerowane.",
            "boss"
        );
    }

    spawnEnemy();

    addCombatLog(
        "👹 Pojawił się nowy przeciwnik: " +
        enemy.name +
        "."
    );

    if (
        typeof refreshLocationProgressInterface ===
        "function"
    ) {
        refreshLocationProgressInterface(
            player.location
        );
    }

    if (
        typeof refreshJournalLocationInterface ===
        "function"
    ) {
        refreshJournalLocationInterface();
    }
}

function startRespawnCooldown() {
    if (isRespawning) return;

    isRespawning = true;

    const respawnDurationSeconds =
        typeof getPlayerRespawnDurationSeconds ===
            "function"
            ? getPlayerRespawnDurationSeconds(10)
            : 10;

    const respawnDurationMs =
        respawnDurationSeconds * 1000;

    const respawnEndsAt =
        Date.now() + respawnDurationMs;

    const respawnDurationText =
        String(respawnDurationSeconds)
            .replace(".", ",");

    respawnTimeLeft =
        respawnDurationSeconds;

    player.hp = 0;

    addCombatLog("☠️ Bohater został pokonany.");
    handleBossEscapeAfterPlayerDefeat();
    addCombatLog(
        "⏳ Odrodzenie za " +
        respawnDurationText +
        " sekundy..."
    );

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "☠️ Bohater został pokonany. Odrodzenie za " +
            respawnDurationText +
            " sekundy.",
            "death"
        );
    }

    refreshCombatInterface();
    saveGame();

    const respawnInterval = setInterval(() => {
        const millisecondsLeft = Math.max(
            0,
            respawnEndsAt - Date.now()
        );

        respawnTimeLeft =
            Math.ceil(
                millisecondsLeft / 100
            ) / 10;

        refreshCombatInterface();

        if (millisecondsLeft <= 0) {
            clearInterval(respawnInterval);

            const derived = getDerivedStats();

            player.hp = derived.maxHp;
            player.mana = derived.maxMana;
            const respawnShieldHp =
                typeof grantExplorationRespawnShield ===
                    "function"
                    ? grantExplorationRespawnShield(
                        derived.maxHp
                    )
                    : 0;

            if (
                typeof resetWarriorAfterRespawn ===
                "function"
            ) {
                resetWarriorAfterRespawn();
            }

            if (
                typeof resetHunterAfterRespawn ===
                "function"
            ) {
                resetHunterAfterRespawn();
            }

            if (
                typeof resetMageAfterRespawn ===
                "function"
            ) {
                resetMageAfterRespawn();
            }

            if (
                typeof resetGuardianAfterRespawn ===
                "function"
            ) {
                resetGuardianAfterRespawn();
            }

            if (
                typeof resetRogueAfterRespawn ===
                "function"
            ) {
                resetRogueAfterRespawn();
            }

            if (
                typeof resetSpellCombatState ===
                "function"
            ) {
                resetSpellCombatState();
            }

            if (
                typeof resetEquipmentSetCombatState ===
                "function"
            ) {
                resetEquipmentSetCombatState();
            }

            isRespawning = false;
            respawnTimeLeft = 0;

            addCombatLog("✨ Bohater odrodził się i wraca do walki.");
            if (respawnShieldHp > 0) {
                addCombatLog(
                    "🧭 Nieugięty odkrywca zapewnia tarczę o wartości " +
                    respawnShieldHp +
                    " HP."
                );
            }

            if (typeof addSystemLog === "function") {
                addSystemLog(
                    "✨ Bohater odrodził się z pełnym HP i maną.",
                    "revive"
                );
            }

            saveGame();
            refreshCombatInterface();
        }
    }, 100);
}

function updateBossChanceAfterKill() {
    if (player.isBossFight) return;


    const progress = getCurrentLocationProgress();

    progress.bossKillsCounter++;

    const startAfterKills = 26;
    const chancePerKill = 0.25;
    const maxBossChance = 20;

    if (progress.bossKillsCounter < startAfterKills) {
        progress.bossChance = 0;
    } else {
        progress.bossChance = Math.min(
            maxBossChance,
            (progress.bossKillsCounter - startAfterKills + 1) * chancePerKill
        );
    }

    player.bossKillsCounter = progress.bossKillsCounter;
    player.bossChance = progress.bossChance;
}


function trySpawnBoss() {
    if (player.isBossFight) return false;

    const progress = getCurrentLocationProgress();

    if (progress.bossChance <= 0) return false;

    const roll = Math.random() * 100;

    if (roll <= progress.bossChance) {
        spawnBoss();
        return true;
    }

    return false;
}

function startFight() {
    console.log("START");
    const cooldownSeconds =
        getCombatCooldownSecondsLeft();

    if (cooldownSeconds > 0) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Możesz rozpocząć walkę za " +
                cooldownSeconds +
                " s.",
                "error"
            );
        }

        refreshCombatInterface();

        return;
    }

    if (
        intervalId ||
        enemyIntervalId
    ) {
        return;
    }

    const activityCanStart =
        prepareActivityStart(
            ACTIVITY_TYPES.COMBAT
        );

    if (!activityCanStart) {
        return;
    }

    if (
        typeof resetWarriorCombatState ===
        "function"
    ) {
        resetWarriorCombatState();
    }

    if (
        typeof resetHunterCombatState ===
        "function"
    ) {
        resetHunterCombatState();
    }

    if (
        typeof resetMageCombatState ===
        "function"
    ) {
        resetMageCombatState();
    }

    if (
        typeof resetGuardianCombatState ===
        "function"
    ) {
        resetGuardianCombatState();
    }

    if (
        typeof resetRogueCombatState ===
        "function"
    ) {
        resetRogueCombatState();
    }

    if (
        typeof resetSpellCombatState ===
        "function"
    ) {
        resetSpellCombatState();
    }

    if (
        typeof resetEquipmentSetCombatState ===
        "function"
    ) {
        resetEquipmentSetCombatState();
    }
    if (
        typeof resetExplorationRespawnShield ===
        "function"
    ) {
        resetExplorationRespawnShield();
    }

    isFighting = true;
    player.isFighting = true;

    schedulePlayerAttack();

    enemyIntervalId =
        setInterval(() => {
            autoEnemyAttack();
        }, 1000);

    saveGame();
    refreshCombatInterface();
}

function stopFight(
    resetCurrentEnemy = true
) {
    console.log("STOP");

    const stoppedEnemyName =
        enemy?.name ||
        "przeciwnik";

    const stoppedEnemyWasBoss =
        player.isBossFight ===
        true;

    isFighting = false;
    player.isFighting = false;

    clearTimeout(
        intervalId
    );

    clearInterval(
        enemyIntervalId
    );

    intervalId = null;
    enemyIntervalId = null;

    if (
        typeof resetWarriorCombatState ===
        "function"
    ) {
        resetWarriorCombatState();
    }

    if (
        typeof resetHunterCombatState ===
        "function"
    ) {
        resetHunterCombatState();
    }

    if (
        typeof resetMageCombatState ===
        "function"
    ) {
        resetMageCombatState();
    }

    if (
        typeof resetGuardianCombatState ===
        "function"
    ) {
        resetGuardianCombatState();
    }

    if (
        typeof resetRogueCombatState ===
        "function"
    ) {
        resetRogueCombatState();
    }

    if (
        typeof resetSpellCombatState ===
        "function"
    ) {
        resetSpellCombatState();
    }

    if (
        typeof resetEquipmentSetCombatState ===
        "function"
    ) {
        resetEquipmentSetCombatState();
    }
    if (
        typeof resetExplorationRespawnShield ===
        "function"
    ) {
        resetExplorationRespawnShield();
    }

    if (resetCurrentEnemy) {

        if (stoppedEnemyWasBoss) {
            const progress =
                getCurrentLocationProgress();

            progress.bossKillsCounter =
                0;

            progress.bossChance =
                0;

            player.bossKillsCounter =
                0;

            player.bossChance =
                0;

            player.isBossFight =
                false;

            addCombatLog(
                "💨 " +
                stoppedEnemyName +
                " uciekł po przerwaniu walki!"
            );

            if (
                typeof addSystemLog ===
                "function"
            ) {
                addSystemLog(
                    "💨 Przerwano walkę z bossem " +
                    stoppedEnemyName +
                    ". Licznik i szansa bossa zostały wyzerowane.",
                    "boss"
                );
            }

            if (
                typeof refreshLocationProgressInterface ===
                "function"
            ) {
                refreshLocationProgressInterface(
                    player.location
                );
            }
        } else {
            addCombatLog(
                "⏹️ Przerwano walkę z przeciwnikiem: " +
                stoppedEnemyName +
                "."
            );
        }

        if (
            typeof clearEnemyCombatEffects ===
            "function"
        ) {
            clearEnemyCombatEffects();
        }

        /*
         * Tworzymy świeżego przeciwnika
         * z pełnym HP.
         */
        spawnEnemy();

        addCombatLog(
            "👹 Przygotowano nowego przeciwnika: " +
            enemy.name +
            "."
        );
        startCombatReentryCooldown();
    }

    saveGame();
    refreshCombatInterface();
}

function toggleFight() {
    if (isFighting) {
        stopFight();
    } else {
        startFight();
    }

    refreshCombatInterface();
}
