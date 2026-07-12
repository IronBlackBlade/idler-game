function renderPlayerHud() {
    const derived = getDerivedStats();

    const playerHp = document.getElementById("player-hp");
    const playerMana = document.getElementById("player-mana");

    const playerGold = document.getElementById("player-gold");
    const playerExp = document.getElementById("player-exp");
    const playerLevel = document.getElementById("player-level");
    const playerExpNeeded = document.getElementById("player-exp-needed");

    const playerAttributePoints = document.getElementById("player-attribute-points");
    const playerSkillPoints = document.getElementById("player-skill-points");

    const hpFill = document.getElementById("hp-fill");
    const manaFill = document.getElementById("mana-fill");
    const expFill = document.getElementById("exp-fill");

    if (playerHp) {
        playerHp.textContent = player.hp + "/" + derived.maxHp;
    }

    if (playerMana) {
        playerMana.textContent = player.mana + "/" + derived.maxMana;
    }

    if (playerGold) playerGold.textContent = player.gold;
    if (playerExp) playerExp.textContent = player.exp;
    if (playerLevel) playerLevel.textContent = player.level;
    if (playerExpNeeded) playerExpNeeded.textContent = player.expToNextLevel;

    if (playerAttributePoints) {
        playerAttributePoints.textContent = player.attributePoints || 0;

        playerAttributePoints.parentElement.classList.toggle(
            "points-available",
            (player.attributePoints || 0) > 0
        );
    }

    if (playerSkillPoints) {
        playerSkillPoints.textContent = player.skillPoints || 0;

        playerSkillPoints.parentElement.classList.toggle(
            "points-available",
            (player.skillPoints || 0) > 0
        );
    }

    if (hpFill) {
        const hpPercent = Math.max(
            0,
            Math.min(100, (player.hp / derived.maxHp) * 100)
        );

        hpFill.style.width = hpPercent + "%";
    }

    if (manaFill) {
        const manaPercent = Math.max(
            0,
            Math.min(100, (player.mana / derived.maxMana) * 100)
        );

        manaFill.style.width = manaPercent + "%";
    }

    if (expFill) {
        const expPercent = Math.max(
            0,
            Math.min(100, (player.exp / player.expToNextLevel) * 100)
        );

        expFill.style.width = expPercent + "%";
    }
}