const BOSS_CHANCE_START_KILL =
    26;

const BOSS_CHANCE_PER_KILL =
    0.25;

const BOSS_CHANCE_MAX =
    20;

function formatBossChance(
    value
) {
    const safeValue =
        Math.max(
            0,
            Number(value) || 0
        );

    return safeValue
        .toFixed(2)
        .replace(/\.?0+$/, "")
        .replace(".", ",") +
        "%";
}

function renderCombat() {
    const currentLocationName = document.getElementById("current-location-name");

    const enemyName = 
    document.getElementById(
        "enemy-name"
    );

const enemyIcon =
    document.getElementById(
        "enemy-icon"
    );
    const enemyModifierDescription =
    document.getElementById(
        "enemy-modifier-description"
    );
    const enemyHp = document.getElementById("enemy-hp");
    const enemyAttack = document.getElementById("enemy-attack");
    const enemyFill = document.getElementById("enemy-fill");

    const bossChance = document.getElementById("boss-chance");
    const bossKillsCounter = document.getElementById("boss-kills-counter");
    const bossChanceProgress =
    document.getElementById(
        "boss-chance-progress"
    );

const bossChanceFill =
    document.getElementById(
        "boss-chance-fill"
    );

const bossChanceMessage =
    document.getElementById(
        "boss-chance-message"
    );
    const bossLabel = document.getElementById("boss-label");
    const enemyCard = document.getElementById("enemy-card");

    const fightButton = document.getElementById("fight-btn");
    const respawnTimer = document.getElementById("respawn-timer");

    if (currentLocationName && locations[player.location]) {
        currentLocationName.textContent = locations[player.location].name;
    }

    if (enemyName) enemyName.textContent = enemy.name;
if (enemyIcon) {
    enemyIcon.textContent =
        typeof getEnemyIcon ===
            "function"
            ? getEnemyIcon(
                enemy.id
            )
            : "👹";
}

    if (enemyHp) enemyHp.textContent = enemy.hp + "/" + enemy.maxHp;
    if (enemyAttack) enemyAttack.textContent = enemy.attack || 0;

    if (enemyFill) {
        const enemyHpPercent = Math.max(
            0,
            Math.min(100, (enemy.hp / enemy.maxHp) * 100)
        );

        enemyFill.style.width = enemyHpPercent + "%";
    }

const progress =
    getCurrentLocationProgress();

const currentBossChance =
    Math.max(
        0,
        Number(
            progress.bossChance
        ) || 0
    );

const currentBossKills =
    Math.max(
        0,
        Math.floor(
            Number(
                progress
                    .bossKillsCounter
            ) || 0
        )
    );

const bossChanceFillPercent =
    Math.min(
        100,
        (
            currentBossChance /
            BOSS_CHANCE_MAX
        ) * 100
    );

if (bossChance) {
    bossChance.textContent =
        formatBossChance(
            currentBossChance
        );
}

if (bossKillsCounter) {
    bossKillsCounter.textContent =
        currentBossKills;
}

if (bossChanceProgress) {
    bossChanceProgress.textContent =
        formatBossChance(
            currentBossChance
        ) +
        " / " +
        formatBossChance(
            BOSS_CHANCE_MAX
        );
}

if (bossChanceFill) {
    bossChanceFill.style.width =
        bossChanceFillPercent +
        "%";

    bossChanceFill.classList.toggle(
        "has-chance",
        currentBossChance > 0
    );
}

if (bossChanceMessage) {
    if (player.isBossFight) {
        bossChanceMessage.textContent =
            "👑 Boss pojawił się w walce!";
    } else if (
        currentBossKills <
        BOSS_CHANCE_START_KILL
    ) {
        bossChanceMessage.textContent =
            "Pierwszy wzrost szansy: " +
            currentBossKills +
            "/" +
            BOSS_CHANCE_START_KILL +
            " zwycięstw.";
    } else if (
        currentBossChance >=
        BOSS_CHANCE_MAX
    ) {
        bossChanceMessage.textContent =
            "Osiągnięto maksymalną szansę 20%.";
    } else {
        bossChanceMessage.textContent =
            "Każde kolejne zwycięstwo: +" +
            formatBossChance(
                BOSS_CHANCE_PER_KILL
            ) +
            " szansy.";
    }
}

    const encounterType =
        player.isBossFight
            ? "boss"
            : (
                enemy.encounterType ||
                "normal"
            );

    if (bossLabel) {
        if (encounterType === "boss") {
            bossLabel.textContent =
                "👑 BOSS";
        } else if (
            encounterType === "elite"
        ) {
            bossLabel.textContent =
                "💠 ELITA" +
                (
                    enemy.eliteModifierLabel
                        ? " · " +
                        enemy.eliteModifierLabel
                        : ""
                );

            bossLabel.title =
                enemy
                    .eliteModifierDescription ||
                "";
        } else if (
            encounterType === "strong"
        ) {
            bossLabel.textContent =
                "⭐ SILNY";
        } else {
            bossLabel.textContent = "";
        }
        if (encounterType !== "elite") {
            bossLabel.title = "";
        }
    }
if (enemyModifierDescription) {
    const shouldShowModifier =
        encounterType === "elite" &&
        Boolean(
            enemy
                .eliteModifierDescription
        );

    enemyModifierDescription.hidden =
        !shouldShowModifier;

    enemyModifierDescription.textContent =
        shouldShowModifier
            ? enemy
                .eliteModifierDescription
            : "";
}
    if (enemyCard) {
        enemyCard.classList.remove(
            "boss-card",
            "strong-card",
            "elite-card"
        );

        if (encounterType === "boss") {
            enemyCard.classList.add(
                "boss-card"
            );
        } else if (
            encounterType === "elite"
        ) {
            enemyCard.classList.add(
                "elite-card"
            );
        } else if (
            encounterType === "strong"
        ) {
            enemyCard.classList.add(
                "strong-card"
            );
        }
    }

if (fightButton) {
    const cooldownSeconds =
        typeof getCombatCooldownSecondsLeft ===
            "function"
            ? getCombatCooldownSecondsLeft()
            : 0;

    if (isFighting) {
        fightButton.textContent =
            "STOP WALKI ⏸️";

        fightButton.disabled =
            false;
    } else if (
        cooldownSeconds > 0
    ) {
        fightButton.textContent =
            "START ZA " +
            cooldownSeconds +
            " s";

        fightButton.disabled =
            true;
    } else {
        fightButton.textContent =
            "START WALKI ▶️";

        fightButton.disabled =
            false;
    }

    fightButton.classList.toggle(
        "fight-active",
        isFighting === true
    );

    fightButton.classList.toggle(
        "fight-cooldown",
        !isFighting &&
        cooldownSeconds > 0
    );
}

    if (respawnTimer) {
        if (isRespawning) {
            respawnTimer.textContent = "⏳ Odrodzenie za: " + respawnTimeLeft + "s";
        } else {
            respawnTimer.textContent = "";
        }
    }
}