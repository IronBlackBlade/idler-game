
// pierwsze wyświetlenie
render();


function saveGame() {
    const questProgress = quests.map(quest => {
        return {
            id: quest.id,
            currentKills: quest.currentKills || 0,
            completed: quest.completed === true,
            claimed: quest.claimed === true
        };
    });

    const saveData = {
        player: player,
        enemy: enemy,
        quests: questProgress,
        time: Date.now(),
        isFighting: isFighting
    };

    localStorage.setItem(
        "idler_save",
        JSON.stringify(saveData)
    );

    console.log("💾 Gra zapisana");
}
function loadGame() {
    const savedJson = localStorage.getItem("idler_save");

    if (!savedJson) {
        return;
    }

    let saveData;

    try {
        saveData = JSON.parse(savedJson);
    } catch (error) {
        console.error("Nie udało się odczytać zapisu gry:", error);
        return;
    }

    if (saveData.player) {
        Object.assign(player, saveData.player);
    }

    if (saveData.enemy) {
        Object.assign(enemy, saveData.enemy);
    }

    if (!Array.isArray(player.systemLog)) {
        player.systemLog = [];
    }

    if (typeof ensureMiningState === "function") {
        ensureMiningState();

        // Po ponownym uruchomieniu kopanie jest zatrzymane,
        // ale poziom, EXP i wybrany obszar pozostają zapisane.
        player.mining.isMining = false;
        player.mining.cycleStartedAt = 0;
        player.mining.cycleDurationMs = 0;
    }

    isFighting = saveData.isFighting === true;

    // Przywracanie postępu zadań
    if (Array.isArray(saveData.quests)) {
        saveData.quests.forEach(savedQuest => {
            const currentQuest = quests.find(quest => {
                return quest.id === savedQuest.id;
            });

            if (!currentQuest) {
                return;
            }

            currentQuest.currentKills =
                savedQuest.currentKills || 0;

            currentQuest.completed =
                savedQuest.completed === true;

            currentQuest.claimed =
                savedQuest.claimed === true;

            if (
                currentQuest.currentKills >
                currentQuest.requiredKills
            ) {
                currentQuest.currentKills =
                    currentQuest.requiredKills;
            }
        });
    }

    // Zgodność ze starszymi zapisami
    if (player.skillPoints === undefined) {
        player.skillPoints = 0;
    }

    if (player.attributePoints === undefined) {
        player.attributePoints = 0;
    }

    if (!player.skills) {
        player.skills = {};
    }

    if (!player.selectedSpells) {
        player.selectedSpells = {
            offensive: null,
            defensive: null
        };
    }

    if (!player.spellCooldowns) {
    player.spellCooldowns = {};
}

if (!player.activeEffects) {
    player.activeEffects = {
        arcaneBarrierUntil: 0
    };
}

if (player.activeEffects.arcaneBarrierUntil === undefined) {
    player.activeEffects.arcaneBarrierUntil = 0;
}

    if (!player.inventory) {
        player.inventory = [];
    }

    if (!player.unlockedRecipes) {
        player.unlockedRecipes = [];
    }

    if (!player.locationProgress) {
        player.locationProgress = {};
    }

    if (!player.expToNextLevel) {
        player.expToNextLevel =
            getExpToNextLevel(player.level || 1);
    }

    const derived = getDerivedStats();

    if (player.hp === undefined) {
        player.hp = derived.maxHp;
    }

    if (player.hp > derived.maxHp) {
        player.hp = derived.maxHp;
    }

    if (player.mana === undefined) {
        player.mana = derived.maxMana;
    }

    if (player.mana > derived.maxMana) {
        player.mana = derived.maxMana;
    }

    const saveTime = saveData.time || Date.now();

    const offlineSeconds = Math.max(
        0,
        Math.floor(
            (Date.now() - saveTime) / 1000
        )
    );

    if (offlineSeconds > 0) {
        symulujOffline(offlineSeconds);
    }

    render();
}

function startAutoSave() {
    setInterval(() => {
        saveGame();
    }, 5000);
}

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

        if (
        typeof addSystemLog === "function" &&
        (gold > 0 || exp > 0)
    ) {
        const minutesOffline =
            Math.max(
                1,
                Math.floor(sekundy / 60)
            );

        addSystemLog(
            "🌙 Postęp offline za około " +
            minutesOffline +
            " min: +" +
            gold +
            " złota i +" +
            exp +
            " EXP.",
            "offline"
        );
    }

    console.log("💰 Offline: +" + gold + " złota, +" + exp + " EXP");
}

function resetGame() {
    if (typeof stopMining === "function") {
        stopMining(false);
    }

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