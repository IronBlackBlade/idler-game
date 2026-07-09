
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

if (!player.expToNextLevel || player.level === 1) {
    player.expToNextLevel = getExpToNextLevel(player.level);
}

if (player.skillPoints === undefined) {
    player.skillPoints = 0;
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
    localStorage.removeItem("idler_current_screen");

    resetPlayer();

    player.level = 1;
    player.exp = 0;
    player.expToNextLevel = 100;
    player.gold = 0;

    if (typeof resetEnemy === "function") {
        resetEnemy();
    }

    if (typeof resetQuests === "function") {
        resetQuests();
    }

    localStorage.setItem("idler_current_screen", "screen-hunting");

    saveGame();

    render();
    showScreen("screen-hunting");

    console.log("RESET:", {
        level: player.level,
        exp: player.exp,
        expToNextLevel: player.expToNextLevel
    });
}

    

function zapiszGre() {
    saveGame();
}

function wczytajGre() {
    loadGame();
}