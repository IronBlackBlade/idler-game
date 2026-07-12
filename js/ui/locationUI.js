function renderLocations() {
    const container = document.getElementById("locations-list");
    if (!container) return;

    container.innerHTML = "";

    Object.values(locations).forEach(location => {
        const requiredLevel = location.requiredLevel || 1;
        const isUnlocked = player.level >= requiredLevel;
        const isCurrentLocation = player.location === location.id;

        const progress = player.locationProgress?.[location.id] || {
            bossKillsCounter: 0,
            bossChance: 0
        };

        const bossChance = progress.bossChance || 0;
        const bossChanceText = Number.isInteger(bossChance)
            ? bossChance + "%"
            : bossChance.toFixed(1) + "%";

        const div = document.createElement("div");
        div.className = "location-card";

        if (!isUnlocked) {
            div.classList.add("location-locked");
        }

        if (isCurrentLocation) {
            div.classList.add("location-current");
        }

        div.innerHTML = `
            <div class="location-card-top">
                <div>
                    <div class="location-status">
                        ${isCurrentLocation ? "📍 Aktualna lokacja" : isUnlocked ? "Odblokowana" : "Zablokowana"}
                    </div>

                    <h3>${location.name}</h3>
                </div>

                <div class="location-level-badge">
                    Lv. ${requiredLevel}
                </div>
            </div>

            <p class="location-description">${location.description}</p>

            <div class="location-info-grid">
                <div class="location-info-box">
                    <span>Zalecany poziom</span>
                    <strong>${location.recommendedLevel || requiredLevel}</strong>
                </div>

                <div class="location-info-box">
                    <span>Szansa bossa</span>
                    <strong>${bossChanceText}</strong>
                </div>

                <div class="location-info-box">
                    <span>Zabici</span>
                    <strong>${progress.bossKillsCounter || 0}</strong>
                </div>
            </div>

            <button 
                class="location-enter-btn"
                onclick="enterLocation('${location.id}')"
                ${isUnlocked ? "" : "disabled"}
            >
                ${isUnlocked ? "Wejdź do lokacji" : "Wymaga poziomu " + requiredLevel}
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

    if (typeof addSystemLog === "function") {
    addSystemLog(
        "📍 Przeniesiono do lokacji: " +
        location.name +
        ".",
        "location"
    );
}

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