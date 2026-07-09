function renderCombat() {
    const currentLocationName = document.getElementById("current-location-name");

    const enemyName = document.getElementById("enemy-name");
    const enemyHp = document.getElementById("enemy-hp");
    const enemyAttack = document.getElementById("enemy-attack");
    const enemyFill = document.getElementById("enemy-fill");

    const bossChance = document.getElementById("boss-chance");
    const bossKillsCounter = document.getElementById("boss-kills-counter");
    const bossLabel = document.getElementById("boss-label");
    const enemyCard = document.getElementById("enemy-card");

    const fightButton = document.getElementById("fight-btn");
    const respawnTimer = document.getElementById("respawn-timer");

    if (currentLocationName && locations[player.location]) {
        currentLocationName.textContent = locations[player.location].name;
    }

    if (enemyName) enemyName.textContent = enemy.name;
    if (enemyHp) enemyHp.textContent = enemy.hp + "/" + enemy.maxHp;
    if (enemyAttack) enemyAttack.textContent = enemy.attack || 0;

    if (enemyFill) {
        const enemyHpPercent = Math.max(
            0,
            Math.min(100, (enemy.hp / enemy.maxHp) * 100)
        );

        enemyFill.style.width = enemyHpPercent + "%";
    }

    const progress = getCurrentLocationProgress();

    if (bossChance) {
        const chance = progress.bossChance || 0;
        bossChance.textContent = Number.isInteger(chance)
            ? chance + "%"
            : chance.toFixed(1) + "%";
    }

    if (bossKillsCounter) {
        bossKillsCounter.textContent = progress.bossKillsCounter || 0;
    }

    if (bossLabel) {
        bossLabel.textContent = player.isBossFight ? "👑 BOSS" : "";
    }

    if (enemyCard) {
        if (player.isBossFight) {
            enemyCard.classList.add("boss-card");
        } else {
            enemyCard.classList.remove("boss-card");
        }
    }

    if (fightButton) {
        fightButton.textContent = isFighting ? "STOP WALKI ⏸️" : "START WALKI ▶️";
    }

    if (respawnTimer) {
        if (isRespawning) {
            respawnTimer.textContent = "⏳ Odrodzenie za: " + respawnTimeLeft + "s";
        } else {
            respawnTimer.textContent = "";
        }
    }
}