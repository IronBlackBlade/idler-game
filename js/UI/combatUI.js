function renderCombat() {
    const enemyName = document.getElementById("enemy-name");
    const enemyHp = document.getElementById("enemy-hp");
    const enemyFill = document.getElementById("enemy-fill");
    const enemyAttack = document.getElementById("enemy-attack");
    const fightBtn = document.getElementById("fight-btn");
    const locationTitle = document.getElementById("current-location-name");

    const bossChance = document.getElementById("boss-chance");
    const bossKillsCounter = document.getElementById("boss-kills-counter");
    const respawnTimer = document.getElementById("respawn-timer");
    const enemyCard = document.getElementById("enemy-card");
    const bossLabel = document.getElementById("boss-label");

    if (enemyName) enemyName.textContent = enemy.name;

    if (enemyHp) {
        enemyHp.textContent = enemy.hp + "/" + enemy.maxHp;
    }

    if (enemyFill) {
        enemyFill.style.width = (enemy.hp / enemy.maxHp) * 100 + "%";
    }

    if (enemyAttack) {
        enemyAttack.textContent = enemy.attack || 0;
    }

    if (fightBtn) {
        fightBtn.textContent = isFighting ? "STOP WALKI ⛔" : "START WALKI ▶️";
    }

    if (locationTitle && locations[player.location]) {
        locationTitle.textContent = locations[player.location].name;
    }

const progress = getCurrentLocationProgress();

if (bossChance) {
    const chance = progress.bossChance || 0;
    bossChance.textContent = Number.isInteger(chance) ? chance + "%" : chance.toFixed(1) + "%";
}

if (bossKillsCounter) {
    bossKillsCounter.textContent = progress.bossKillsCounter || 0;
}

    if (respawnTimer) {
        if (isRespawning) {
            respawnTimer.textContent = "⏳ Odrodzenie za: " + respawnTimeLeft + "s";
        } else {
            respawnTimer.textContent = "";
        }
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

}