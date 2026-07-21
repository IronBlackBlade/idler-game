var miningIntervalId = null;

function getDefaultMiningState() {
    return {
        level: 1,
        exp: 0,
        expToNextLevel:
            getMiningExpToNextLevel(1),

        isMining: false,

        selectedAreaId: "upper_shaft",
        activeAreaId: null,

        cycleStartedAt: 0,
        cycleDurationMs: 0,

        lastResult: null
    };
}

function ensureMiningState() {
    if (!player.mining || typeof player.mining !== "object") {
        player.mining = getDefaultMiningState();
    }

    if (!Number.isFinite(player.mining.level) || player.mining.level < 1) {
        player.mining.level = 1;
    }

    if (!Number.isFinite(player.mining.exp) || player.mining.exp < 0) {
        player.mining.exp = 0;
    }

    if (!Number.isFinite(player.mining.expToNextLevel) || player.mining.expToNextLevel <= 0) {
        player.mining.expToNextLevel = getMiningExpToNextLevel(player.mining.level);
    }

    if (!getMiningArea(player.mining.selectedAreaId)) {
        player.mining.selectedAreaId = "upper_shaft";
    }

    if (
    player.mining.activeAreaId !== null &&
    !getMiningArea(player.mining.activeAreaId)
) {
    player.mining.activeAreaId = null;
}

if (
    player.mining.isMining &&
    !player.mining.activeAreaId
) {
    player.mining.activeAreaId =
        player.mining.selectedAreaId;
}

    if (typeof player.mining.isMining !== "boolean") {
        player.mining.isMining = false;
    }

    if (!Number.isFinite(player.mining.cycleStartedAt)) {
        player.mining.cycleStartedAt = 0;
    }

    if (!Number.isFinite(player.mining.cycleDurationMs)) {
        player.mining.cycleDurationMs = 0;
    }
}

function getMiningExpToNextLevel(level) {
    return Math.floor(
        100 +
        (level - 1) * 45 +
        Math.pow(level - 1, 1.25) * 20
    );
}

function isMiningAreaUnlocked(area) {
    ensureMiningState();

    return Boolean(
        area &&
        player.mining.level >= area.requiredMiningLevel
    );
}

function selectMiningArea(areaId) {
    ensureMiningState();

    const area = getMiningArea(areaId);

    if (!area) {
        console.warn("Nie znaleziono obszaru kopalni:", areaId);
        return;
    }

    if (!isMiningAreaUnlocked(area)) {
        if (typeof showNotification === "function") {
            showNotification(
                "Ten obszar wymaga " +
                area.requiredMiningLevel +
                " poziomu kopania.",
                "error"
            );
        }

        return;
    }

    if (player.mining.isMining) {
        stopMining(false);
    }

    player.mining.selectedAreaId = areaId;
    player.mining.lastResult = null;

    saveGame();
    render();

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "📍 Wybrano obszar kopalni: " +
            area.name +
            ".",
            "mining"
        );
    }
}


function openMiningScreen() {
    ensureMiningState();

    showScreen(
        "screen-mining-locations"
    );
}

function enterMiningArea(areaId) {
    ensureMiningState();

    const area = getMiningArea(areaId);

    if (!area) {
        console.warn(
            "Nie znaleziono obszaru kopalni:",
            areaId
        );

        return;
    }

    if (!isMiningAreaUnlocked(area)) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Ten obszar wymaga " +
                area.requiredMiningLevel +
                " poziomu kopania.",
                "error"
            );
        }

        return;
    }

player.mining.selectedAreaId =
    areaId;

    const shouldSwitchMiningArea =
  player.mining.isMining &&
  player.mining.activeAreaId !== areaId;
  
    if (shouldSwitchMiningArea) {
  player.mining.lastResult = null;
  startMining();
}

if (shouldSwitchMiningArea) {
  stopMining(false);
}

player.mining.lastResult =
    null;

saveGame();

if (
    typeof renderMining ===
        "function"
) {
    renderMining();
}
}

function leaveMiningArea() {
    showScreen(
        "screen-mining-locations"
    );
}

function startMining() {
    ensureMiningState();

    const area = getMiningArea(player.mining.selectedAreaId);

    if (!area || !isMiningAreaUnlocked(area)) {
        if (typeof showNotification === "function") {
            showNotification(
                "Najpierw wybierz odblokowany obszar kopalni.",
                "error"
            );
        }

        return;
    }

    if (player.mining.isMining || miningIntervalId) {
        return;
    }

    const activityCanStart =
        prepareActivityStart(
            ACTIVITY_TYPES.MINING
        );

    if (!activityCanStart) {
        return;
    }

player.mining.isMining = true;

player.mining.activeAreaId =
    player.mining.selectedAreaId;

beginMiningCycle(area);

    miningIntervalId = setInterval(updateMining, 100);

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "⛏️ Rozpoczęto kopanie: " +
            area.name +
            ".",
            "mining"
        );
    }

    saveGame();
    render();
}

function stopMining(writeLog = true) {
    ensureMiningState();

    const wasMining =
        player.mining.isMining ||
        miningIntervalId !== null;

        player.mining.isMining = false;
        player.mining.activeAreaId = null;

        player.mining.cycleStartedAt = 0;
        player.mining.cycleDurationMs = 0;

    if (miningIntervalId !== null) {
        clearInterval(miningIntervalId);
        miningIntervalId = null;
    }

    if (
        wasMining &&
        writeLog &&
        typeof addSystemLog === "function"
    ) {
        addSystemLog(
            "⏹️ Zatrzymano kopanie.",
            "mining"
        );
    }

    if (wasMining) {
        saveGame();
        render();
    }
}

function toggleMining() {
    ensureMiningState();

    if (player.mining.isMining) {
        stopMining();
    } else {
        startMining();
    }
}

function toggleMiningInViewedArea() {
    ensureMiningState();

    const isMiningThisArea =
        player.mining.isMining &&
        player.mining.activeAreaId ===
            player.mining.selectedAreaId;

    if (isMiningThisArea) {
        stopMining();
        return;
    }

    if (player.mining.isMining) {
        stopMining(false);
    }

    startMining();
}

function beginMiningCycle(area) {
    if (!area) {
        return;
    }

    const miningSpeedBonus =
        typeof getActivePotionEffectValue ===
        "function"
            ? getActivePotionEffectValue(
                "mining_speed"
            )
            : 0;

    const speedMultiplier =
        1 + miningSpeedBonus / 100;

    const baseDurationMilliseconds =
        Math.max(
            1000,
            Number(area.durationSeconds) *
                1000
        );

    const finalDurationMilliseconds =
        baseDurationMilliseconds /
        speedMultiplier;

    player.mining.cycleStartedAt =
        Date.now();

    player.mining.cycleDurationMs =
        Math.max(
            1000,
            Math.round(
                finalDurationMilliseconds
            )
        );
}

function updateMining() {
    ensureMiningState();

    if (!player.mining.isMining) {
        stopMining(false);
        return;
    }

    const area = getMiningArea(
        player.mining.activeAreaId
    );

    if (!area || !isMiningAreaUnlocked(area)) {
        stopMining(false);
        return;
    }

    const elapsed =
        Date.now() -
        player.mining.cycleStartedAt;

    if (
        elapsed >=
        player.mining.cycleDurationMs
    ) {
        completeMiningCycle(area);
        beginMiningCycle(area);

        saveGame();

        if (
            typeof renderMiningActivity ===
            "function"
        ) {
            const activityContainer =
                document.getElementById(
                    "mining-activity"
                );

            if (activityContainer) {
                renderMiningActivity(
                    activityContainer
                );
            }
        }

        return;
    }

    updateMiningProgressUI();
}

function completeMiningCycle(area) {
    const foundResources = [];

    const basicDrop =
        chooseWeightedMiningDrop(area.basicDrops);

    if (basicDrop) {
        foundResources.push({
            ...basicDrop,
            rarityGroup: "basic"
        });
    }

    if (
        Math.random() * 100 <
        (area.rareChance || 0)
    ) {
        const rareDrop =
            chooseWeightedMiningDrop(area.rareDrops);

        if (rareDrop) {
            foundResources.push({
                ...rareDrop,
                rarityGroup: "rare"
            });
        }
    }

    if (
        Math.random() * 100 <
        (area.exceptionalChance || 0)
    ) {
        const exceptionalDrop =
            chooseWeightedMiningDrop(
                area.exceptionalDrops
            );

        if (exceptionalDrop) {
            foundResources.push({
                ...exceptionalDrop,
                rarityGroup: "exceptional"
            });
        }
    }

    let totalMiningExp = 0;

    foundResources.forEach(resource => {
        addItemToInventory(resource.itemId, 1);
        totalMiningExp += resource.miningExp || 0;
    });

    addMiningExp(totalMiningExp);

    player.mining.lastResult = {
        time: Date.now(),
        totalMiningExp: totalMiningExp,
        resources: foundResources.map(resource => ({
            itemId: resource.itemId,
            rarityGroup: resource.rarityGroup,
            miningExp: resource.miningExp
        }))
    };

    logImportantMiningFinds(foundResources);

    if (typeof renderInventory === "function") {
        renderInventory();
    }
}

function chooseWeightedMiningDrop(dropList) {
    if (!Array.isArray(dropList) || dropList.length === 0) {
        return null;
    }

    const totalWeight = dropList.reduce(
        (sum, drop) => sum + Math.max(0, drop.weight || 0),
        0
    );

    if (totalWeight <= 0) {
        return dropList[0];
    }

    let roll = Math.random() * totalWeight;

    for (const drop of dropList) {
        roll -= Math.max(0, drop.weight || 0);

        if (roll <= 0) {
            return drop;
        }
    }

    return dropList[dropList.length - 1];
}

function addMiningExp(amount) {
    ensureMiningState();

    const gainedExp = Math.max(
        0,
        Math.floor(amount || 0)
    );

    if (gainedExp <= 0) {
        return;
    }

    player.mining.exp += gainedExp;

    while (
        player.mining.exp >=
        player.mining.expToNextLevel
    ) {
        player.mining.exp -=
            player.mining.expToNextLevel;

        player.mining.level++;

        player.mining.expToNextLevel =
            getMiningExpToNextLevel(
                player.mining.level
            );

        if (typeof addSystemLog === "function") {
            addSystemLog(
                "⬆️ Osiągnięto " +
                player.mining.level +
                " poziom kopania.",
                "mining-level"
            );
        }

        const unlockedArea =
            miningAreas.find(area => {
                return (
                    area.requiredMiningLevel ===
                    player.mining.level
                );
            });

        if (
            unlockedArea &&
            typeof addSystemLog === "function"
        ) {
            addSystemLog(
                "🗺️ Odblokowano obszar kopalni: " +
                unlockedArea.name +
                ".",
                "mining-unlock"
            );
        }

        if (
            unlockedArea &&
            typeof showNotification === "function"
        ) {
            showNotification(
                "Odblokowano: " +
                unlockedArea.name +
                "!",
                "success"
            );
        }
    }
}

function logImportantMiningFinds(foundResources) {
    if (typeof addSystemLog !== "function") {
        return;
    }

    foundResources.forEach(resource => {
        if (
            resource.rarityGroup !== "rare" &&
            resource.rarityGroup !== "exceptional"
        ) {
            return;
        }

        const item = items[resource.itemId];
        const itemName =
            item?.name || resource.itemId;

        if (resource.rarityGroup === "exceptional") {
            addSystemLog(
                "🌟 Znaleziono wyjątkowy surowiec: " +
                itemName +
                ". +" +
                resource.miningExp +
                " EXP kopania.",
                "mining-exceptional"
            );
        } else {
            addSystemLog(
                "💎 Znaleziono rzadki surowiec: " +
                itemName +
                ". +" +
                resource.miningExp +
                " EXP kopania.",
                "mining-rare"
            );
        }
    });
}

function getMiningProgressPercent() {
    ensureMiningState();

    if (
        !player.mining.isMining ||
        !player.mining.cycleStartedAt ||
        !player.mining.cycleDurationMs
    ) {
        return 0;
    }

    const elapsed =
        Date.now() - player.mining.cycleStartedAt;

    return Math.max(
        0,
        Math.min(
            100,
            elapsed /
            player.mining.cycleDurationMs *
            100
        )
    );
}

function resumeMining() {
    ensureMiningState();

    /*
        Jeżeli zapis mówi, że gracz nie kopał,
        nie mamy czego wznawiać.
    */
    if (!player.mining.isMining) {
        return;
    }

    /*
        Sprawdzamy obszar zapisany jako aktywny.
    */
    const area =
        getMiningArea(
            player.mining.activeAreaId
        );

    /*
        Jeżeli obszar nie istnieje albo nie jest
        odblokowany, bezpiecznie kończymy kopanie.
    */
    if (
        !area ||
        !isMiningAreaUnlocked(area)
    ) {
        stopMining(false);
        return;
    }

    /*
        Zabezpieczenie przed uruchomieniem
        drugiego identycznego interwału.
    */
    if (miningIntervalId !== null) {
        clearInterval(
            miningIntervalId
        );
    }

    /*
        Gdy w starszym zapisie brakuje czasu cyklu,
        rozpoczynamy nowy cykl.
    */
    if (
        !player.mining.cycleStartedAt ||
        !player.mining.cycleDurationMs
    ) {
        beginMiningCycle(area);
    }

    /*
        Ponownie uruchamiamy timer kopania.
    */
    miningIntervalId =
        setInterval(
            updateMining,
            100
        );

    if (
        typeof renderMining ===
        "function"
    ) {
        renderMining();
    }
}
