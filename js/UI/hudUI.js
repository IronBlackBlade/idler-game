function renderPlayerHud() {
    const derived = getDerivedStats();

    const playerHp = document.getElementById("player-hp");
    const playerMana = document.getElementById("player-mana");

    const playerGold = document.getElementById("player-gold");
    const playerExp = document.getElementById("player-exp");
    const playerLevel = document.getElementById("player-level");
    const playerExpNeeded = document.getElementById("player-exp-needed");

    const hpFill = document.getElementById("hp-fill");
    const manaFill = document.getElementById("mana-fill");
    const expFill = document.getElementById("exp-fill");

    if (playerHp) {
        playerHp.textContent = player.hp + "/" + derived.maxHp;
    }

    if (playerMana) {
        playerMana.textContent = player.mana + "/" + derived.maxMana;
    }

    if (playerGold) {
        playerGold.textContent = player.gold;
    }

    if (playerExp) {
        playerExp.textContent = player.exp;
    }

    if (playerLevel) {
        playerLevel.textContent = player.level;
    }

    if (playerExpNeeded) {
        playerExpNeeded.textContent = player.expToNextLevel;
    }

    if (hpFill) {
        hpFill.style.width = (player.hp / derived.maxHp) * 100 + "%";
    }

    if (manaFill) {
        manaFill.style.width = (player.mana / derived.maxMana) * 100 + "%";
    }

    if (expFill) {
        expFill.style.width = (player.exp / player.expToNextLevel) * 100 + "%";
    }
}