
// pierwsze wyświetlenie
render();


function saveGame() {
const dane = {
    player: player,
    enemy: enemy,
    time: Date.now(),
    isFighting: isFighting
};
    localStorage.setItem("idler_save", JSON.stringify(dane));

    console.log("💾 Gra zapisana");
}

function loadGame() {
    const zapis = localStorage.getItem("idler_save");

    if (!zapis) return;

    const dane = JSON.parse(zapis);

    const teraz = Date.now();
    const czasOffline = Math.floor((teraz - dane.time) / 1000);

    Object.assign(player, dane.player);
    Object.assign(enemy, dane.enemy);
    isFighting = dane.isFighting;

    if (czasOffline > 0) {
        symulujOffline(czasOffline);
    }

if (isFighting) {
    startFight();
}

    render();
}

function startAutoSave() {
    setInterval(() => {
        saveGame();
    }, 5000);
}

startAutoSave();

function symulujOffline(sekundy) {
    const dmgNaSekunde = getAttack();

    let hp = enemy.hp;
    let gold = 0;
    let exp = 0;

    for (let i = 0; i < sekundy; i++) {
        hp -= dmgNaSekunde;

        if (hp <= 0) {
            gold += enemy.gold;
            exp += enemy.exp;

            spawnEnemy();
            hp = enemy.hp;
        }
    }

    player.gold += gold;
    player.exp += exp;

    console.log("💰 Offline: +" + gold + " złota, +" + exp + " EXP");
}

function resetGame() {
    stopFight();

    localStorage.removeItem("idler_save");
    localStorage.setItem("idler_current_screen", "screen-hunting");

    resetPlayer();

    if (typeof resetEnemy === "function") {
        resetEnemy();
    }

    if (typeof resetQuests === "function") {
        resetQuests();
    }

    saveGame();
    render();

    showScreen("screen-hunting");

    console.log("GAME RESET COMPLETE");
}

function zapiszGre() {
    saveGame();
}

function wczytajGre() {
    loadGame();
}