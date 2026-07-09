const enemy = {
    id: "beetle",
    name: "Chrząszcz",
    hp: 20,
    maxHp: 20,
    attack: 3,
    gold: 2,
    exp: 4,
    loot: []
};

function spawnEnemy() {
    const currentLocation = locations[player.location];
    const list = currentLocation.enemies;

    const randomEnemy = list[Math.floor(Math.random() * list.length)];

    enemy.id = randomEnemy.id;
    enemy.name = randomEnemy.name;
    enemy.hp = randomEnemy.hp;
    enemy.maxHp = randomEnemy.hp;
    enemy.attack = randomEnemy.attack;
    enemy.gold = randomEnemy.gold;
    enemy.exp = randomEnemy.exp;
    enemy.loot = randomEnemy.loot;
}

function spawnBoss() {
    const currentLocation = locations[player.location];

    if (!currentLocation.boss) {
        console.warn("This location has no boss:", player.location);
        spawnEnemy();
        return;
    }

    const boss = currentLocation.boss;

    enemy.id = boss.id;
    enemy.name = boss.name;
    enemy.hp = boss.hp;
    enemy.maxHp = boss.hp;
    enemy.attack = boss.attack;
    enemy.gold = boss.gold;
    enemy.exp = boss.exp;
    enemy.loot = boss.loot;

    player.isBossFight = true;

    if (typeof addCombatLog === "function") {
        addCombatLog("👑 Pojawił się boss: " + boss.name + "!");
    }

    saveGame();
    render();
}

function resetEnemy() {
    spawnEnemy();
}