let herbalismIntervalId = null;

function getDefaultHerbalismState() {
    return {
        level: 1,
        exp: 0,
        expToNextLevel:
            getHerbalismExpToNextLevel(1),

        isGathering: false,

        selectedAreaId:
            "forest_clearing",

        activeAreaId: null,

        cycleStartedAt: 0,
        cycleDurationMs: 0,

        lastResult: null
    };
}

function ensureHerbalismState() {
    if (
        !player.herbalism ||
        typeof player.herbalism !==
            "object"
    ) {
        player.herbalism =
            getDefaultHerbalismState();
    }

    if (
        !Number.isFinite(
            player.herbalism.level
        ) ||
        player.herbalism.level < 1
    ) {
        player.herbalism.level = 1;
    }

    if (
        !Number.isFinite(
            player.herbalism.exp
        ) ||
        player.herbalism.exp < 0
    ) {
        player.herbalism.exp = 0;
    }

    if (
        !Number.isFinite(
            player.herbalism.expToNextLevel
        ) ||
        player.herbalism.expToNextLevel <= 0
    ) {
        player.herbalism.expToNextLevel =
            getHerbalismExpToNextLevel(
                player.herbalism.level
            );
    }

    if (
        !getHerbalismArea(
            player.herbalism.selectedAreaId
        )
    ) {
        player.herbalism.selectedAreaId =
            "forest_clearing";
    }

    if (
        player.herbalism.activeAreaId !==
            null &&
        !getHerbalismArea(
            player.herbalism.activeAreaId
        )
    ) {
        player.herbalism.activeAreaId =
            null;
    }

    if (
        typeof player.herbalism
            .isGathering !== "boolean"
    ) {
        player.herbalism.isGathering =
            false;
    }

    if (
        player.herbalism.isGathering &&
        !player.herbalism.activeAreaId
    ) {
        player.herbalism.activeAreaId =
            player.herbalism
                .selectedAreaId;
    }

    if (
        !Number.isFinite(
            player.herbalism
                .cycleStartedAt
        )
    ) {
        player.herbalism
            .cycleStartedAt = 0;
    }

    if (
        !Number.isFinite(
            player.herbalism
                .cycleDurationMs
        )
    ) {
        player.herbalism
            .cycleDurationMs = 0;
    }
}

function getHerbalismExpToNextLevel(
    level
) {
    return Math.floor(
        100 +
        (level - 1) * 45 +
        Math.pow(
            level - 1,
            1.25
        ) * 20
    );
}

function isHerbalismAreaUnlocked(
    area
) {
    ensureHerbalismState();

    return Boolean(
        area &&
        player.herbalism.level >=
            area.requiredHerbalismLevel
    );
}

function selectHerbalismArea(
    areaId
) {
    ensureHerbalismState();

    const area =
        getHerbalismArea(areaId);

    if (!area) {
        console.warn(
            "Nie znaleziono obszaru zielarstwa:",
            areaId
        );

        return;
    }

    if (
        !isHerbalismAreaUnlocked(
            area
        )
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Ta lokacja wymaga " +
                area.requiredHerbalismLevel +
                " poziomu zielarstwa.",
                "error"
            );
        }

        return;
    }

    player.herbalism.selectedAreaId =
        areaId;

    saveGame();
}

function openHerbalismScreen() {
    ensureHerbalismState();

    showScreen(
        "screen-herbalism-locations"
    );

    if (
        typeof renderHerbalism ===
        "function"
    ) {
        renderHerbalism();
    }
}

function enterHerbalismArea(
    areaId
) {
    ensureHerbalismState();

    const area =
        getHerbalismArea(areaId);

    if (!area) {
        console.warn(
            "Nie znaleziono lokacji zielarskiej:",
            areaId
        );

        return;
    }

    if (
        !isHerbalismAreaUnlocked(
            area
        )
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Ta lokacja wymaga " +
                area.requiredHerbalismLevel +
                " poziomu zielarstwa.",
                "error"
            );
        }

        return;
    }

    player.herbalism.selectedAreaId =
        areaId;

    saveGame();

    showScreen(
        "screen-herbalism-area"
    );

    if (
        typeof renderHerbalism ===
        "function"
    ) {
        renderHerbalism();
    }
}

function leaveHerbalismArea() {
    showScreen(
        "screen-herbalism-locations"
    );

    if (
        typeof renderHerbalism ===
        "function"
    ) {
        renderHerbalism();
    }
}

function startHerbalism() {
    ensureHerbalismState();

    const area =
        getHerbalismArea(
            player.herbalism
                .selectedAreaId
        );

    if (
        !area ||
        !isHerbalismAreaUnlocked(area)
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Najpierw wybierz odblokowaną lokację zielarską.",
                "error"
            );
        }

        return;
    }

    if (
        player.herbalism.isGathering ||
        herbalismIntervalId !== null
    ) {
        return;
    }

    if (
    typeof cancelAlchemyActivity ===
        "function"
) {
    cancelAlchemyActivity();
}

    if (
        typeof stopFight ===
            "function" &&
        typeof isFighting !==
            "undefined" &&
        isFighting
    ) {
        stopFight();
    }

    if (
        typeof stopMining ===
            "function" &&
        player.mining?.isMining
    ) {
        stopMining(false);
    }

    player.herbalism.isGathering =
        true;

    player.herbalism.activeAreaId =
        player.herbalism
            .selectedAreaId;

    beginHerbalismCycle(area);

    herbalismIntervalId =
        setInterval(
            updateHerbalism,
            100
        );

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "🌿 Rozpoczęto zbieranie ziół: " +
            area.name +
            ".",
            "herbalism"
        );
    }

    saveGame();

    if (
    typeof renderHerbalism ===
    "function"
) {
    renderHerbalism();
}
}

function stopHerbalism(
    writeLog = true
) {
    ensureHerbalismState();

    const wasGathering =
        player.herbalism
            .isGathering ||
        herbalismIntervalId !== null;

    player.herbalism.isGathering =
        false;

    player.herbalism.activeAreaId =
        null;

    player.herbalism.cycleStartedAt =
        0;

    player.herbalism.cycleDurationMs =
        0;

    if (
        herbalismIntervalId !== null
    ) {
        clearInterval(
            herbalismIntervalId
        );

        herbalismIntervalId = null;
    }

    if (
        wasGathering &&
        writeLog &&
        typeof addSystemLog ===
            "function"
    ) {
        addSystemLog(
            "⏹️ Zatrzymano zbieranie ziół.",
            "herbalism"
        );
    }

if (wasGathering) {
    saveGame();

    if (
        typeof renderHerbalism ===
        "function"
    ) {
        renderHerbalism();
    }
}
}

function toggleHerbalism() {
    ensureHerbalismState();

    if (
        player.herbalism.isGathering
    ) {
        stopHerbalism();
    } else {
        startHerbalism();
    }
}

function toggleHerbalismInViewedArea() {
    ensureHerbalismState();

    const isGatheringThisArea =
        player.herbalism.isGathering &&
        player.herbalism.activeAreaId ===
            player.herbalism.selectedAreaId;

    if (isGatheringThisArea) {
        stopHerbalism();
        return;
    }

    if (
        player.herbalism.isGathering
    ) {
        stopHerbalism(false);
    }

    startHerbalism();
}

function beginHerbalismCycle(
    area
) {
    const speedBonus =
        typeof getTimedEffectBonus ===
        "function"
            ? getTimedEffectBonus(
                "herbalismSpeedPercent",
                "herbalism"
            )
            : 0;

    const speedMultiplier =
        1 + speedBonus / 100;

    const baseDurationMs =
        area.durationSeconds * 1000;

    const finalDurationMs =
        baseDurationMs /
        speedMultiplier;

    player.herbalism
        .cycleStartedAt =
        Date.now();

    player.herbalism
        .cycleDurationMs =
        Math.max(
            1000,
            Math.round(
                finalDurationMs
            )
        );
}

function updateHerbalism() {
    ensureHerbalismState();

    if (
        !player.herbalism.isGathering
    ) {
        stopHerbalism(false);
        return;
    }

    const area =
        getHerbalismArea(
            player.herbalism
                .activeAreaId
        );

    if (
        !area ||
        !isHerbalismAreaUnlocked(
            area
        )
    ) {
        stopHerbalism(false);
        return;
    }

    const elapsed =
        Date.now() -
        player.herbalism
            .cycleStartedAt;

if (
    elapsed >=
    player.herbalism
        .cycleDurationMs
) {
    completeHerbalismCycle(
        area
    );

    beginHerbalismCycle(
        area
    );

    saveGame();

    const activityContainer =
        document.getElementById(
            "herbalism-activity"
        );

    if (
        activityContainer &&
        typeof renderHerbalismActivity ===
            "function"
    ) {
        renderHerbalismActivity(
            activityContainer
        );
    }

    return;
}

if (
    typeof updateHerbalismProgressUI ===
    "function"
) {
    updateHerbalismProgressUI();
}
}

function completeHerbalismCycle(
    area
) {
    const foundIngredients = [];

    const basicDrop =
        chooseWeightedHerbalismDrop(
            area.basicDrops
        );

    if (basicDrop) {
        foundIngredients.push({
            ...basicDrop,
            rarityGroup: "basic"
        });
    }

    if (
        Math.random() * 100 <
        (area.rareChance || 0)
    ) {
        const rareDrop =
            chooseWeightedHerbalismDrop(
                area.rareDrops
            );

        if (rareDrop) {
            foundIngredients.push({
                ...rareDrop,
                rarityGroup: "rare"
            });
        }
    }

    if (
        Math.random() * 100 <
        (
            area.exceptionalChance ||
            0
        )
    ) {
        const exceptionalDrop =
            chooseWeightedHerbalismDrop(
                area.exceptionalDrops
            );

        if (exceptionalDrop) {
            foundIngredients.push({
                ...exceptionalDrop,
                rarityGroup:
                    "exceptional"
            });
        }
    }

    let totalHerbalismExp = 0;

    foundIngredients.forEach(
        ingredient => {
            addItemToInventory(
                ingredient.itemId,
                1
            );

            totalHerbalismExp +=
                ingredient.herbalismExp ||
                0;
        }
    );

    addHerbalismExp(
        totalHerbalismExp
    );

    player.herbalism.lastResult = {
        time: Date.now(),

        totalHerbalismExp:
            totalHerbalismExp,

        resources:
            foundIngredients.map(
                ingredient => {
                    return {
                        itemId:
                            ingredient.itemId,

                        rarityGroup:
                            ingredient
                                .rarityGroup,

                        herbalismExp:
                            ingredient
                                .herbalismExp
                    };
                }
            )
    };

    logImportantHerbalismFinds(
        foundIngredients
    );

    if (
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
    }
}

function chooseWeightedHerbalismDrop(
    dropList
) {
    if (
        !Array.isArray(dropList) ||
        dropList.length === 0
    ) {
        return null;
    }

    const totalWeight =
        dropList.reduce(
            (sum, drop) => {
                return (
                    sum +
                    Math.max(
                        0,
                        drop.weight || 0
                    )
                );
            },
            0
        );

    if (totalWeight <= 0) {
        return dropList[0];
    }

    let roll =
        Math.random() *
        totalWeight;

    for (const drop of dropList) {
        roll -= Math.max(
            0,
            drop.weight || 0
        );

        if (roll <= 0) {
            return drop;
        }
    }

    return dropList[
        dropList.length - 1
    ];
}

function addHerbalismExp(
    amount
) {
    ensureHerbalismState();

    const gainedExp =
        Math.max(
            0,
            Math.floor(
                amount || 0
            )
        );

    if (gainedExp <= 0) {
        return;
    }

    player.herbalism.exp +=
        gainedExp;

    while (
        player.herbalism.exp >=
        player.herbalism
            .expToNextLevel
    ) {
        player.herbalism.exp -=
            player.herbalism
                .expToNextLevel;

        player.herbalism.level++;

        player.herbalism
            .expToNextLevel =
            getHerbalismExpToNextLevel(
                player.herbalism.level
            );

        if (
            typeof addSystemLog ===
            "function"
        ) {
            addSystemLog(
                "⬆️ Osiągnięto " +
                player.herbalism.level +
                " poziom zielarstwa.",
                "herbalism-level"
            );
        }

        const unlockedArea =
            herbalismAreas.find(
                currentArea => {
                    return (
                        currentArea
                            .requiredHerbalismLevel ===
                        player.herbalism
                            .level
                    );
                }
            );

        if (
            unlockedArea &&
            typeof addSystemLog ===
                "function"
        ) {
            addSystemLog(
                "🗺️ Odblokowano lokację zielarską: " +
                unlockedArea.name +
                ".",
                "herbalism-unlock"
            );
        }

        if (
            unlockedArea &&
            typeof showNotification ===
                "function"
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

function logImportantHerbalismFinds(
    foundIngredients
) {
    if (
        typeof addSystemLog !==
        "function"
    ) {
        return;
    }

    foundIngredients.forEach(
        ingredient => {
            if (
                ingredient.rarityGroup !==
                    "rare" &&
                ingredient.rarityGroup !==
                    "exceptional"
            ) {
                return;
            }

            const item =
                items[
                    ingredient.itemId
                ];

            const itemName =
                item?.name ||
                ingredient.itemId;

            if (
                ingredient.rarityGroup ===
                "exceptional"
            ) {
                addSystemLog(
                    "🌟 Znaleziono wyjątkowy składnik: " +
                    itemName +
                    ". +" +
                    ingredient.herbalismExp +
                    " EXP zielarstwa.",
                    "herbalism-exceptional"
                );
            } else {
                addSystemLog(
                    "🌿 Znaleziono rzadki składnik: " +
                    itemName +
                    ". +" +
                    ingredient.herbalismExp +
                    " EXP zielarstwa.",
                    "herbalism-rare"
                );
            }
        }
    );
}

function getHerbalismProgressPercent() {
    ensureHerbalismState();

    if (
        !player.herbalism
            .isGathering ||
        !player.herbalism
            .cycleStartedAt ||
        !player.herbalism
            .cycleDurationMs
    ) {
        return 0;
    }

    const elapsed =
        Date.now() -
        player.herbalism
            .cycleStartedAt;

    return Math.max(
        0,
        Math.min(
            100,
            elapsed /
            player.herbalism
                .cycleDurationMs *
            100
        )
    );
}

function resumeHerbalism() {
    ensureHerbalismState();

    /*
        Jeżeli zielarstwo nie było aktywne,
        nie uruchamiamy go ponownie.
    */
    if (
        !player.herbalism.isGathering
    ) {
        return;
    }

    const area =
        getHerbalismArea(
            player.herbalism.activeAreaId
        );

    /*
        Nieprawidłowa lub zablokowana lokacja
        oznacza bezpieczne zatrzymanie czynności.
    */
    if (
        !area ||
        !isHerbalismAreaUnlocked(area)
    ) {
        stopHerbalism(false);
        return;
    }

    /*
        Usuwamy ewentualny stary timer,
        żeby nie uruchomić dwóch naraz.
    */
    if (
        herbalismIntervalId !== null
    ) {
        clearInterval(
            herbalismIntervalId
        );
    }

    /*
        Starszy zapis może nie mieć pełnych
        informacji o rozpoczętym cyklu.
    */
    if (
        !player.herbalism
            .cycleStartedAt ||
        !player.herbalism
            .cycleDurationMs
    ) {
        beginHerbalismCycle(area);
    }

    /*
        Uruchamiamy ponownie aktualizację
        postępu zielarstwa.
    */
    herbalismIntervalId =
        setInterval(
            updateHerbalism,
            100
        );

    if (
        typeof renderHerbalism ===
        "function"
    ) {
        renderHerbalism();
    }
}