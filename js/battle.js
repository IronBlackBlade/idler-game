var isFighting = false;
var intervalId = null;
var enemySlowUntil = 0;
var enemyAttackSkipChance = 0;
var isRespawning = false;
var respawnTimeLeft = 0;

var combatLogMessages = window.combatLogMessages || [];
window.combatLogMessages = combatLogMessages;

function addCombatLog(message) {
    combatLogMessages.push(message);

    if (combatLogMessages.length > 40) {
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

        if (message.includes("Krytyczne")) {
            div.classList.add("crit");
        } else if (message.includes("Zadałeś") || message.includes("zadaje")) {
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
}

function autoAttack() {
    if (isRespawning) {
        return;
    }

    const attackResult = calculatePlayerDamage();

    enemy.hp -= attackResult.damage;

    if (attackResult.isCritical) {
        addCombatLog("💥 Krytyczne trafienie! Zadałeś " + attackResult.damage + " obrażeń.");
    } else {
        addCombatLog("⚔️ Zadałeś " + attackResult.damage + " obrażeń.");
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
        player.gold += enemy.gold;
        player.exp += enemy.exp;

        addCombatLog("⭐ Zdobyto " + enemy.exp + " EXP i " + enemy.gold + " złota.");

        rollLoot(enemy);
        updateQuests(enemy.name);
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

        checkLevelUp();
        saveGame();
        render();

        return;
    }

    enemyAttackPlayer();

    saveGame();
    render();
}

function enemyAttackPlayer() {
    const derived = getDerivedStats();

    if (
        typeof castSelectedDefensiveSpell === "function"
    ) {
        castSelectedDefensiveSpell();
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

    const dodgeRoll = Math.random() * 100;
    const didDodge =
        dodgeRoll <= derived.dodgeChance;

    if (didDodge) {
        addCombatLog(
            "💨 Uniknąłeś ataku potwora."
        );

        return;
    }

const rawDamage = enemy.attack || 1;

let reducedDamage = Math.max(
    1,
    Math.floor(
        rawDamage - derived.defense
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

player.hp -= reducedDamage;

    if (barrierReduction > 0) {
    addCombatLog(
        "🛡️ Bariera pochłania część obrażeń. " +
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

    if (player.hp <= 0) {
        startRespawnCooldown();
    }
}

function startRespawnCooldown() {
    if (isRespawning) return;

    isRespawning = true;
    respawnTimeLeft = 10;

    player.hp = 0;

    addCombatLog("☠️ Bohater został pokonany.");
    addCombatLog("⏳ Odrodzenie za 10 sekund...");

    if (typeof addSystemLog === "function") {
    addSystemLog(
        "☠️ Bohater został pokonany. Odrodzenie za 10 sekund.",
        "death"
    );
}

    render();
    saveGame();

    const respawnInterval = setInterval(() => {
        respawnTimeLeft--;

        render();

        if (respawnTimeLeft <= 0) {
            clearInterval(respawnInterval);

            const derived = getDerivedStats();

            player.hp = derived.maxHp;
            player.mana = derived.maxMana;

            isRespawning = false;
            respawnTimeLeft = 0;

            addCombatLog("✨ Bohater odrodził się i wraca do walki.");

            if (typeof addSystemLog === "function") {
    addSystemLog(
        "✨ Bohater odrodził się z pełnym HP i maną.",
        "revive"
    );
}

            saveGame();
            render();
        }
    }, 1000);
}

function updateBossChanceAfterKill() {
    if (player.isBossFight) return;


    const progress = getCurrentLocationProgress();

    progress.bossKillsCounter++;

    const startAfterKills = 26;
    const chancePerKill = 0.5;
    const maxBossChance = 25;

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

    if (intervalId) return;

    if (
    typeof cancelAlchemyActivity ===
        "function"
) {
    cancelAlchemyActivity();
}

    if (
        typeof stopMining === "function" &&
        player.mining?.isMining
    ) {
        stopMining(false);
    }

    if (
    typeof stopHerbalism ===
        "function" &&
    player.herbalism?.isGathering
) {
    stopHerbalism(false);
}

    isFighting = true;
    player.isFighting = true;

    intervalId = setInterval(() => {
        autoAttack();
    }, 1000);

    saveGame();
    render();
}

function stopFight() {
    console.log("STOP");

    isFighting = false;
    player.isFighting = false;

    clearInterval(intervalId);
    intervalId = null;

    saveGame();
    render();
}

function toggleFight() {
    if (isFighting) {
        stopFight();
    } else {
        startFight();
    }

    render();
}

