function renderPlayerHud() {
    const derived = getDerivedStats();

    const playerHp = document.getElementById("player-hp");

    const playerGold = document.getElementById("player-gold");
    const playerExp = document.getElementById("player-exp");
    const playerLevel = document.getElementById("player-level");
    const playerExpNeeded = document.getElementById("player-exp-needed");

    const playerAttributePoints = document.getElementById("player-attribute-points");
    const playerSkillPoints = document.getElementById("player-skill-points");

    const hpFill = document.getElementById("hp-fill");
    const expFill = document.getElementById("exp-fill");

    if (playerHp) playerHp.textContent = player.hp + "/" + derived.maxHp;
    if (playerGold) playerGold.textContent = player.gold;
    if (playerExp) playerExp.textContent = player.exp;
    if (playerLevel) playerLevel.textContent = player.level;
    if (playerExpNeeded) playerExpNeeded.textContent = player.expToNextLevel;

   
    if (hpFill) {
        hpFill.style.width = Math.max(0, Math.min(100, (player.hp / derived.maxHp) * 100)) + "%";
    }

    if (expFill) {
        expFill.style.width = Math.max(0, Math.min(100, (player.exp / player.expToNextLevel) * 100)) + "%";
    }

    if (playerAttributePoints) {
    playerAttributePoints.textContent = player.attributePoints || 0;

    if ((player.attributePoints || 0) > 0) {
        playerAttributePoints.parentElement.classList.add("points-available");
    } else {
        playerAttributePoints.parentElement.classList.remove("points-available");
    }
}

if (playerSkillPoints) {
    playerSkillPoints.textContent = player.skillPoints || 0;

    if ((player.skillPoints || 0) > 0) {
        playerSkillPoints.parentElement.classList.add("points-available");
    } else {
        playerSkillPoints.parentElement.classList.remove("points-available");
    }
}
}