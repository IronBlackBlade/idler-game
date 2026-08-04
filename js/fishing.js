let fishingIntervalId = null;

function getFishingExpToNextLevel(level) {
    const normalizedLevel = Math.max(
        1,
        Math.floor(Number(level) || 1)
    );
    const levelIndex = normalizedLevel - 1;
    return Math.floor(
        175 +
        levelIndex * 19 +
        Math.pow(levelIndex, 1.72) * 12.3
    );
}

function getDefaultFishingStatistics() {
    return {
        totalCycles: 0,
        totalFish: 0,
        rareFish: 0,
        treasures: 0,
        totalOrdersCompleted: 0,
        fishByItem: {},
        recordsByItem: {},
        ordersCompletedById: {},
        cyclesByArea: {}
    };
}

function getDefaultFishingState() {
    return {
        level: 1,
        exp: 0,
        expToNextLevel:
            getFishingExpToNextLevel(1),
        isFishing: false,
        selectedAreaId: "forest_pond",
        activeAreaId: null,
        cycleStartedAt: 0,
        cycleDurationMs: 0,
        statistics:
            getDefaultFishingStatistics(),
        lastResult: null
    };
}

function ensureFishingState() {
    if (
        !player.fishing ||
        typeof player.fishing !== "object"
    ) {
        player.fishing =
            getDefaultFishingState();
    }

    const state = player.fishing;

    state.level = Math.max(
        1,
        Math.floor(Number(state.level) || 1)
    );
    state.exp = Math.max(
        0,
        Number(state.exp) || 0
    );
    state.expToNextLevel =
        getFishingExpToNextLevel(state.level);

    while (
        state.exp >= state.expToNextLevel
    ) {
        state.exp -= state.expToNextLevel;
        state.level++;
        state.expToNextLevel =
            getFishingExpToNextLevel(
                state.level
            );
    }

    state.isFishing =
        state.isFishing === true;

    if (!getFishingArea(state.selectedAreaId)) {
        state.selectedAreaId = "forest_pond";
    }

    if (
        state.activeAreaId !== null &&
        !getFishingArea(state.activeAreaId)
    ) {
        state.activeAreaId = null;
    }

    if (
        state.isFishing &&
        !state.activeAreaId
    ) {
        state.activeAreaId =
            state.selectedAreaId;
    }

    if (
        state.selectedBaitId &&
        !getFishingBait(
            state.selectedBaitId
        )
    ) {
        state.selectedBaitId = null;
    }

    if (
        state.activeBaitId &&
        !getFishingBait(
            state.activeBaitId
        )
    ) {
        state.activeBaitId = null;
    }

    state.cycleStartedAt =
        Number.isFinite(state.cycleStartedAt)
            ? state.cycleStartedAt
            : 0;
    state.cycleDurationMs =
        Number.isFinite(state.cycleDurationMs)
            ? state.cycleDurationMs
            : 0;

    if (
        !state.statistics ||
        typeof state.statistics !== "object"
    ) {
        state.statistics =
            getDefaultFishingStatistics();
    }

    const statistics = state.statistics;
    [
        "totalCycles",
        "totalFish",
        "rareFish",
        "treasures",
        "totalOrdersCompleted"
    ].forEach(key => {
        statistics[key] = Math.max(
            0,
            Math.floor(Number(statistics[key]) || 0)
        );
    });

    if (
        !statistics.fishByItem ||
        typeof statistics.fishByItem !== "object" ||
        Array.isArray(statistics.fishByItem)
    ) {
        statistics.fishByItem = {};
    }

    if (
        !statistics.recordsByItem ||
        typeof statistics.recordsByItem !==
        "object" ||
        Array.isArray(
            statistics.recordsByItem
        )
    ) {
        statistics.recordsByItem = {};
    }

    if (
        !statistics.ordersCompletedById ||
        typeof statistics.ordersCompletedById !==
        "object" ||
        Array.isArray(
            statistics.ordersCompletedById
        )
    ) {
        statistics.ordersCompletedById = {};
    }

    if (
        !statistics.cyclesByArea ||
        typeof statistics.cyclesByArea !== "object" ||
        Array.isArray(statistics.cyclesByArea)
    ) {
        statistics.cyclesByArea = {};
    }
}

function isFishingAreaUnlocked(area) {
    ensureFishingState();

    return Boolean(
        area &&
        player.fishing.level >=
        area.requiredFishingLevel
    );
}

function getFishingBaitQuantity(itemId) {
    if (!itemId) {
        return 0;
    }

    if (
        typeof getInventoryItemQuantity ===
        "function"
    ) {
        return getInventoryItemQuantity(
            itemId
        );
    }

    const inventoryEntry =
        Array.isArray(player.inventory)
            ? player.inventory.find(entry => {
                return (
                    entry.itemId === itemId
                );
            })
            : null;

    return Math.max(
        0,
        Number(inventoryEntry?.quantity) || 0
    );
}

function selectFishingBait(itemId = null) {
    ensureFishingState();

    if (itemId === null) {
        player.fishing.selectedBaitId =
            null;
    } else {
        const bait = getFishingBait(itemId);

        if (!bait) {
            return;
        }

        if (
            getFishingBaitQuantity(
                itemId
            ) <= 0
        ) {
            if (
                typeof showNotification ===
                "function"
            ) {
                showNotification(
                    "Nie masz tej przynęty. Możesz kupić ją u kupca.",
                    "error"
                );
            }
            return;
        }

        player.fishing.selectedBaitId =
            itemId;
    }

    saveGame();

    if (typeof renderFishing === "function") {
        renderFishing();
    }
}

function getUsableSelectedFishingBait() {
    ensureFishingState();

    const bait = getFishingBait(
        player.fishing.selectedBaitId
    );

    if (
        !bait ||
        getFishingBaitQuantity(
            bait.itemId
        ) <= 0
    ) {
        return null;
    }

    return bait;
}

function getFishingOrderProgress(order) {
    ensureFishingState();

    if (!order) {
        return null;
    }

    const completedCount = Math.max(
        0,
        Math.floor(
            Number(
                player.fishing.statistics
                    .ordersCompletedById[
                order.id
                ]
            ) || 0
        )
    );
    const tier =
        1 + Math.floor(completedCount / 5);
    const tierIndex = tier - 1;
    const requirements =
        order.requirements.map(
            requirement => {
                const tierIncrease =
                    Math.max(
                        1,
                        Math.ceil(
                            requirement.quantity *
                            0.25
                        )
                    );

                return {
                    itemId:
                        requirement.itemId,
                    quantity:
                        requirement.quantity +
                        tierIncrease *
                        tierIndex
                };
            }
        );

    return {
        order: order,
        tier: tier,
        completedCount: completedCount,
        completionsToNextTier:
            5 - completedCount % 5,
        requirements: requirements,
        goldReward: Math.round(
            order.goldReward *
            (1 + tierIndex * 0.35)
        ),
        fishingExpReward: Math.round(
            order.fishingExpReward *
            (1 + tierIndex * 0.25)
        )
    };
}

function canCompleteFishingOrder(orderId) {
    const order = getFishingOrder(orderId);
    const progress =
        getFishingOrderProgress(order);

    if (
        !order ||
        !progress ||
        player.fishing.level <
        order.requiredFishingLevel
    ) {
        return false;
    }

    return progress.requirements.every(
        requirement => {
            return (
                getInventoryItemQuantity(
                    requirement.itemId
                ) >= requirement.quantity
            );
        }
    );
}

function completeFishingOrder(orderId) {
    ensureFishingState();

    const order = getFishingOrder(orderId);
    const progress =
        getFishingOrderProgress(order);

    if (!order || !progress) {
        return;
    }

    if (
        player.fishing.level <
        order.requiredFishingLevel
    ) {
        showNotification(
            "To zlecenie wymaga " +
            order.requiredFishingLevel +
            " poziomu łowienia.",
            "error"
        );
        return;
    }

    if (!canCompleteFishingOrder(orderId)) {
        showNotification(
            "Nie masz jeszcze wszystkich ryb potrzebnych do realizacji zlecenia.",
            "error"
        );
        return;
    }

    progress.requirements.forEach(
        requirement => {
            removeItemFromInventory(
                requirement.itemId,
                requirement.quantity
            );
        }
    );

    player.gold += progress.goldReward;
    player.fishing.statistics
        .totalOrdersCompleted++;
    player.fishing.statistics
        .ordersCompletedById[order.id] =
        progress.completedCount + 1;
    addFishingExp(
        progress.fishingExpReward
    );

    const reachedNextTier =
        (progress.completedCount + 1) % 5 ===
        0;

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "⚓ Zrealizowano zlecenie: " +
            order.name +
            ". +" +
            progress.goldReward +
            " złota i +" +
            progress.fishingExpReward +
            " EXP łowienia." +
            (
                reachedNextTier
                    ? " Zlecenie awansowało na wyższy poziom!"
                    : ""
            ),
            "fishing-order"
        );
    }

    showNotification(
        reachedNextTier
            ? "Zlecenie wykonane — odblokowano wyższy poziom!"
            : "Zlecenie wykonane!",
        "success"
    );
    saveGame();

    if (typeof render === "function") {
        render();
    } else {
        if (
            typeof renderFishing ===
            "function"
        ) {
            renderFishing();
        }
        if (
            typeof renderInventory ===
            "function"
        ) {
            renderInventory();
        }
    }
}

function consumeFishingBait(itemId) {
    if (
        !itemId ||
        getFishingBaitQuantity(itemId) <= 0
    ) {
        return false;
    }

    if (
        typeof removeItemFromInventory ===
        "function"
    ) {
        removeItemFromInventory(itemId, 1);
        return true;
    }

    const inventoryEntry =
        player.inventory.find(entry => {
            return entry.itemId === itemId;
        });

    if (!inventoryEntry) {
        return false;
    }

    inventoryEntry.quantity--;
    if (inventoryEntry.quantity <= 0) {
        player.inventory =
            player.inventory.filter(entry => {
                return (
                    entry.itemId !== itemId
                );
            });
    }

    return true;
}

function openFishingScreen() {
    ensureFishingState();
    showScreen("screen-fishing-locations");

    if (typeof renderFishing === "function") {
        renderFishing();
    }
}

function enterFishingArea(areaId) {
    ensureFishingState();

    const area = getFishingArea(areaId);
    if (!area) {
        console.warn(
            "Nie znaleziono łowiska:",
            areaId
        );
        return;
    }

    if (!isFishingAreaUnlocked(area)) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "To łowisko wymaga " +
                area.requiredFishingLevel +
                " poziomu łowienia.",
                "error"
            );
        }
        return;
    }

    const shouldSwitch =
        player.fishing.isFishing &&
        player.fishing.activeAreaId !== areaId;

    player.fishing.selectedAreaId = areaId;
    player.fishing.lastResult = null;

    if (shouldSwitch) {
        stopFishing(false);
        startFishing();
        return;
    }

    saveGame();

    if (typeof renderFishing === "function") {
        renderFishing();
    }
}

function startFishing() {
    ensureFishingState();

    const area = getFishingArea(
        player.fishing.selectedAreaId
    );

    if (
        !area ||
        !isFishingAreaUnlocked(area)
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Najpierw wybierz odblokowane łowisko.",
                "error"
            );
        }
        return;
    }

    if (
        player.fishing.isFishing ||
        fishingIntervalId !== null
    ) {
        return;
    }

    if (
        !prepareActivityStart(
            ACTIVITY_TYPES.FISHING
        )
    ) {
        return;
    }

    player.fishing.isFishing = true;
    player.fishing.activeAreaId = area.id;
    beginFishingCycle(area);

    fishingIntervalId = setInterval(
        updateFishing,
        100
    );

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "🎣 Rozpoczęto łowienie: " +
            area.name +
            ".",
            "fishing"
        );
    }

    saveGame();

    if (typeof renderFishing === "function") {
        renderFishing();
    }
}

function stopFishing(writeLog = true) {
    ensureFishingState();

    const wasFishing =
        player.fishing.isFishing ||
        fishingIntervalId !== null;

    player.fishing.isFishing = false;
    player.fishing.activeAreaId = null;
    player.fishing.activeBaitId = null;
    player.fishing.cycleStartedAt = 0;
    player.fishing.cycleDurationMs = 0;

    if (fishingIntervalId !== null) {
        clearInterval(fishingIntervalId);
        fishingIntervalId = null;
    }

    if (
        wasFishing &&
        writeLog &&
        typeof addSystemLog === "function"
    ) {
        addSystemLog(
            "⏹️ Zakończono łowienie.",
            "fishing"
        );
    }

    if (wasFishing) {
        saveGame();
        if (
            typeof renderFishing ===
            "function"
        ) {
            renderFishing();
        }
    }
}

function toggleFishingInViewedArea() {
    ensureFishingState();

    const isFishingHere =
        player.fishing.isFishing &&
        player.fishing.activeAreaId ===
        player.fishing.selectedAreaId;

    if (isFishingHere) {
        stopFishing();
        return;
    }

    if (player.fishing.isFishing) {
        stopFishing(false);
    }

    startFishing();
}

function beginFishingCycle(area) {
    if (!area) {
        return;
    }

    /*
     * Premia do szybkości
     * z aktywnej wędki.
     */
    const toolFishingSpeedBonus =
        typeof getProfessionToolBonus ===
            "function"
            ? getProfessionToolBonus(
                "fishingRod",
                "fishingSpeedPercent"
            )
            : 0;

    const safeFishingSpeedBonus =
        Math.max(
            0,
            Number(
                toolFishingSpeedBonus
            ) || 0
        );
    const skillGatheringSpeedBonus =
        typeof getGatheringSpeedSkillBonus ===
            "function"
            ? Math.max(
                0,
                Number(
                    getGatheringSpeedSkillBonus()
                ) || 0
            )
            : 0;

    const totalFishingSpeedBonus =
        safeFishingSpeedBonus +
        skillGatheringSpeedBonus;

    const speedMultiplier =
        1 +
        totalFishingSpeedBonus /
        100;

    const baseDurationMilliseconds =
        Math.max(
            1000,
            (
                Number(
                    area.durationSeconds
                ) || 1
            ) * 1000
        );

    const finalDurationMilliseconds =
        baseDurationMilliseconds /
        speedMultiplier;

    player.fishing.cycleStartedAt =
        Date.now();

    /*
     * Przynęta jest zapamiętywana
     * na początku konkretnego cyklu.
     */
    player.fishing.activeBaitId =
        getUsableSelectedFishingBait()
            ?.itemId || null;

    player.fishing.cycleDurationMs =
        Math.max(
            1000,
            Math.round(
                finalDurationMilliseconds
            )
        );
}

function updateFishing() {
    ensureFishingState();

    if (!player.fishing.isFishing) {
        stopFishing(false);
        return;
    }

    const area = getFishingArea(
        player.fishing.activeAreaId
    );

    if (
        !area ||
        !isFishingAreaUnlocked(area)
    ) {
        stopFishing(false);
        return;
    }

    const elapsed =
        Date.now() -
        player.fishing.cycleStartedAt;

    if (
        elapsed >=
        player.fishing.cycleDurationMs
    ) {
        completeFishingCycle(area);
        beginFishingCycle(area);
        saveGame();

        const container =
            document.getElementById(
                "fishing-activity"
            );
        if (
            container &&
            typeof renderFishingActivity ===
            "function"
        ) {
            renderFishingActivity(container);
        }
        return;
    }

    if (
        typeof updateFishingProgressUI ===
        "function"
    ) {
        updateFishingProgressUI();
    }
}

function chooseWeightedFishingDrop(dropList) {
    if (
        !Array.isArray(dropList) ||
        dropList.length === 0
    ) {
        return null;
    }

    const totalWeight = dropList.reduce(
        (sum, drop) =>
            sum + Math.max(0, Number(drop.weight) || 0),
        0
    );

    if (totalWeight <= 0) {
        return dropList[0];
    }

    let roll = Math.random() * totalWeight;
    for (const drop of dropList) {
        roll -= Math.max(
            0,
            Number(drop.weight) || 0
        );
        if (roll <= 0) {
            return drop;
        }
    }

    return dropList[dropList.length - 1];
}

function getFishingDropDefinition(
    itemId,
    preferredArea = null
) {
    const areas = preferredArea
        ? [
            preferredArea,
            ...fishingAreas.filter(area => {
                return area.id !==
                    preferredArea.id;
            })
        ]
        : fishingAreas;

    for (const area of areas) {
        const drop = [
            ...(area.basicDrops || []),
            ...(area.rareDrops || [])
        ].find(currentDrop => {
            return (
                currentDrop.itemId ===
                itemId
            );
        });

        if (drop) {
            return drop;
        }
    }

    return null;
}

function rollFishingSize(
    drop,
    sampleCount = 1
) {
    const minimumSize = Math.max(
        0.1,
        Number(drop?.minSize) || 1
    );
    const maximumSize = Math.max(
        minimumSize,
        Number(drop?.maxSize) ||
        minimumSize
    );
    const safeSampleCount = Math.max(
        1,
        Math.floor(Number(sampleCount) || 1)
    );

    /*
     * Dla wielu połowów naraz losujemy
     * największy okaz z całej grupy.
     */
    const recordRoll = Math.pow(
        Math.random(),
        1 / safeSampleCount
    );
    const size =
        minimumSize +
        (maximumSize - minimumSize) *
        recordRoll;

    return Math.round(size * 10) / 10;
}

function formatFishingSize(sizeCm) {
    const normalizedSize =
        Math.max(0, Number(sizeCm) || 0);

    if (normalizedSize >= 100) {
        return (
            (normalizedSize / 100)
                .toFixed(2) +
            " m"
        );
    }

    return (
        normalizedSize.toFixed(1) +
        " cm"
    );
}

function completeFishingCycle(area) {
    const catches = [];
    const activeBait = getFishingBait(
        player.fishing.activeBaitId
    );
    const usedBait =
        activeBait &&
            getFishingBaitQuantity(
                activeBait.itemId
            ) > 0
            ? activeBait
            : null;
    const toolRareFishChance =
        typeof getProfessionToolBonus ===
            "function"
            ? getProfessionToolBonus(
                "fishingRod",
                "rareFishChancePercent"
            )
            : 0;

    const rareChance =
        Math.max(
            0,
            Number(
                area.rareChance
            ) || 0
        ) +
        Math.max(
            0,
            Number(
                usedBait?.rareChanceBonus
            ) || 0
        ) +
        Math.max(
            0,
            Number(
                toolRareFishChance
            ) || 0
        );
    const treasureChance =
        (area.treasureChance || 0) +
        (usedBait?.treasureChanceBonus ||
            0);
    const sizeMultiplier =
        1 +
        (usedBait?.sizeBonus || 0) /
        100;
    const basicDrop =
        chooseWeightedFishingDrop(
            area.basicDrops
        );

    if (basicDrop) {
        catches.push({
            ...basicDrop,
            rarityGroup: "basic"
        });
    }

    if (
        Math.random() * 100 <
        rareChance
    ) {
        const rareDrop =
            chooseWeightedFishingDrop(
                area.rareDrops
            );
        if (rareDrop) {
            catches.push({
                ...rareDrop,
                rarityGroup: "rare"
            });
        }
    }

    if (
        Math.random() * 100 <
        treasureChance
    ) {
        const treasureDrop =
            chooseWeightedFishingDrop(
                area.treasureDrops
            );
        if (treasureDrop) {
            catches.push({
                ...treasureDrop,
                rarityGroup: "treasure"
            });
        }
    }

    catches.forEach(catchItem => {
        if (
            catchItem.rarityGroup !==
            "treasure"
        ) {
            catchItem.sizeCm =
                Math.round(
                    rollFishingSize(
                        catchItem
                    ) *
                    sizeMultiplier *
                    10
                ) / 10;
        }
    });

    if (usedBait) {
        consumeFishingBait(
            usedBait.itemId
        );
    }

    let totalFishingExp = 0;

    catches.forEach(catchItem => {
        /*
         * Obfite zbiory podwajają ryby,
         * ale nie podwajają skarbów.
         */
        const catchQuantity =
            catchItem.rarityGroup ===
                "treasure"
                ? 1
                : (
                    typeof rollBountifulHarvestAmount ===
                        "function"
                        ? rollBountifulHarvestAmount(1)
                        : 1
                );

        catchItem.quantity =
            catchQuantity;

        addItemToInventory(
            catchItem.itemId,
            catchQuantity
        );

        /*
         * Nawet przy dwóch rybach
         * doświadczenie otrzymujemy raz.
         */
        totalFishingExp +=
            catchItem.fishingExp || 0;
    });

    recordFishingProgress(
        catches,
        1,
        area.id
    );
    addFishingExp(totalFishingExp);

    player.fishing.lastResult = {
        time: Date.now(),
        baitItemId:
            usedBait?.itemId || null,
        totalFishingExp: totalFishingExp,
        resources: catches.map(catchItem => {
            return {
                itemId: catchItem.itemId,

                rarityGroup:
                    catchItem.rarityGroup,

                fishingExp:
                    catchItem.fishingExp,

                quantity:
                    Math.max(
                        1,
                        Number(
                            catchItem.quantity
                        ) || 1
                    ),

                sizeCm:
                    catchItem.sizeCm || null,

                isNewRecord:
                    catchItem.isNewRecord ===
                    true,

                previousRecordSize:
                    catchItem
                        .previousRecordSize ||
                    0
            };
        })
    };

    logImportantFishingFinds(catches);

    if (
        typeof renderInventory === "function"
    ) {
        renderInventory();
    }
}

function recordFishingProgress(
    catches,
    completedCycles = 0,
    areaId = null
) {
    ensureFishingState();

    const statistics =
        player.fishing.statistics;
    const safeCycles = Math.max(
        0,
        Math.floor(Number(completedCycles) || 0)
    );

    statistics.totalCycles += safeCycles;

    if (areaId && safeCycles > 0) {
        statistics.cyclesByArea[areaId] =
            (statistics.cyclesByArea[areaId] || 0) +
            safeCycles;
    }

    (Array.isArray(catches)
        ? catches
        : []
    ).forEach(catchItem => {
        const quantity = Math.max(
            0,
            Math.floor(
                Number(catchItem.quantity) || 1
            )
        );
        statistics.fishByItem[
            catchItem.itemId
        ] =
            (statistics.fishByItem[
                catchItem.itemId
            ] || 0) + quantity;

        if (
            catchItem.rarityGroup ===
            "treasure"
        ) {
            statistics.treasures += quantity;
        } else {
            statistics.totalFish += quantity;
            if (
                catchItem.rarityGroup ===
                "rare"
            ) {
                statistics.rareFish +=
                    quantity;
            }

            const candidateSize =
                Math.max(
                    0,
                    Number(
                        catchItem.sizeCm ||
                        catchItem.recordSizeCm
                    ) || 0
                );
            const currentRecord =
                statistics.recordsByItem[
                catchItem.itemId
                ];
            const currentRecordSize =
                Math.max(
                    0,
                    Number(
                        currentRecord?.sizeCm
                    ) || 0
                );

            if (
                candidateSize >
                currentRecordSize
            ) {
                statistics.recordsByItem[
                    catchItem.itemId
                ] = {
                    sizeCm: candidateSize,
                    caughtAt: Date.now(),
                    areaId: areaId
                };
                catchItem.isNewRecord = true;
                catchItem.previousRecordSize =
                    currentRecordSize;
            }
        }
    });

    if (
        typeof updateQuestMenuHighlight ===
        "function"
    ) {
        updateQuestMenuHighlight();
    }
}

function addFishingExp(amount) {
    ensureFishingState();

    const gainedExp =
        typeof applyProfessionExperienceBonus ===
            "function"
            ? applyProfessionExperienceBonus(
                amount
            )
            : Math.max(
                0,
                Number(amount) || 0
            );
    if (gainedExp <= 0) {
        return;
    }

    player.fishing.exp += gainedExp;

    while (
        player.fishing.exp >=
        player.fishing.expToNextLevel
    ) {
        player.fishing.exp -=
            player.fishing.expToNextLevel;
        player.fishing.level++;
        player.fishing.expToNextLevel =
            getFishingExpToNextLevel(
                player.fishing.level
            );

        if (
            typeof addSystemLog ===
            "function"
        ) {
            addSystemLog(
                "⬆️ Osiągnięto " +
                player.fishing.level +
                " poziom łowienia.",
                "fishing-level"
            );
        }

        const unlockedArea =
            fishingAreas.find(area => {
                return (
                    area.requiredFishingLevel ===
                    player.fishing.level
                );
            });

        if (unlockedArea) {
            if (
                typeof addSystemLog ===
                "function"
            ) {
                addSystemLog(
                    "🗺️ Odblokowano łowisko: " +
                    unlockedArea.name +
                    ".",
                    "fishing-unlock"
                );
            }
            if (
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
}

function logImportantFishingFinds(catches) {
    if (
        typeof addSystemLog !== "function"
    ) {
        return;
    }

    catches.forEach(catchItem => {
        if (catchItem.isNewRecord) {
            const recordItemName =
                items[catchItem.itemId]?.name ||
                catchItem.itemId;

            addSystemLog(
                "🏆 Nowy rekord: " +
                recordItemName +
                " — " +
                formatFishingSize(
                    catchItem.sizeCm ||
                    catchItem.recordSizeCm
                ) +
                ".",
                "fishing-record"
            );
        }

        if (
            catchItem.rarityGroup !== "rare" &&
            catchItem.rarityGroup !== "treasure"
        ) {
            return;
        }

        const itemName =
            items[catchItem.itemId]?.name ||
            catchItem.itemId;
        const isTreasure =
            catchItem.rarityGroup ===
            "treasure";

        addSystemLog(
            (isTreasure
                ? "🧰 Wyłowiono skarb: "
                : "✨ Złowiono rzadką rybę: ") +
            itemName +
            ". +" +
            catchItem.fishingExp +
            " EXP łowienia.",
            isTreasure
                ? "fishing-treasure"
                : "fishing-rare"
        );
    });
}

function getFishingProgressPercent() {
    ensureFishingState();

    if (
        !player.fishing.isFishing ||
        !player.fishing.cycleStartedAt ||
        !player.fishing.cycleDurationMs
    ) {
        return 0;
    }

    const elapsed =
        Date.now() -
        player.fishing.cycleStartedAt;

    return Math.max(
        0,
        Math.min(
            100,
            elapsed /
            player.fishing.cycleDurationMs *
            100
        )
    );
}

function resumeFishing() {
    ensureFishingState();

    if (!player.fishing.isFishing) {
        return;
    }

    const area = getFishingArea(
        player.fishing.activeAreaId
    );

    if (
        !area ||
        !isFishingAreaUnlocked(area)
    ) {
        stopFishing(false);
        return;
    }

    if (fishingIntervalId !== null) {
        clearInterval(fishingIntervalId);
    }

    if (
        !player.fishing.cycleStartedAt ||
        !player.fishing.cycleDurationMs
    ) {
        beginFishingCycle(area);
    }

    fishingIntervalId = setInterval(
        updateFishing,
        100
    );

    if (typeof renderFishing === "function") {
        renderFishing();
    }
}
