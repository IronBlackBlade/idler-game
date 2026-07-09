function renderLocations() {
    const container = document.getElementById("locations-list");

    if (!container) return;

    container.innerHTML = "";

    Object.values(locations).forEach(location => {
        const div = document.createElement("div");
        div.className = "location-card";

        const requiredLevel = location.requiredLevel || 1;
        const isUnlocked = player.level >= requiredLevel;

        if (!isUnlocked) {
            div.classList.add("location-locked");
        }

        div.innerHTML = `
            <h3>${location.name}</h3>
            <p>${location.description}</p>
            <p>Zalecany poziom: ${location.recommendedLevel}</p>
            <p>Wymagany poziom: ${requiredLevel}</p>

            <button 
                onclick="enterLocation('${location.id}')"
                ${isUnlocked ? "" : "disabled"}
            >
                ${isUnlocked ? "Wejdź" : "Zablokowane"}
            </button>
        `;

        container.appendChild(div);
    });
}

function enterLocation(locationId) {
    const location = locations[locationId];
const requiredLevel = location.requiredLevel || 1;

if (player.level < requiredLevel) {
    if (typeof addCombatLog === "function") {
        addCombatLog("🔒 Ta lokacja wymaga poziomu " + requiredLevel + ".");
    }

    console.warn("Za niski poziom do lokacji:", location.name);
    return;
}
    
    if (!locations[locationId]) {
        console.warn("Nie znaleziono lokacji:", locationId);
        return;
    }

    if (typeof stopFight === "function") {
        stopFight();
    }

    player.location = locationId;
    player.isBossFight = false;

    if (!player.locationProgress) {
        player.locationProgress = {};
    }

    if (!player.locationProgress[locationId]) {
        player.locationProgress[locationId] = {
            bossKillsCounter: 0,
            bossChance: 0
        };
    }

    const progress = player.locationProgress[locationId];

    player.bossKillsCounter = progress.bossKillsCounter;
    player.bossChance = progress.bossChance;

    spawnEnemy();

    if (typeof clearCombatLog === "function") {
        clearCombatLog();
    }

    if (typeof addCombatLog === "function") {
        addCombatLog("📍 Przeniesiono do lokacji: " + locations[locationId].name + ".");
        addCombatLog("👹 Pojawił się przeciwnik: " + enemy.name + ".");
    }

    saveGame();
    showScreen("screen-combat");
    render();
}

function openHuntingScreen() {
    if (isFighting) {
        showScreen("screen-combat");
        return;
    }

    showScreen("screen-hunting");
}