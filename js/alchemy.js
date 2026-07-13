let alchemyTimeoutId = null;
let alchemyUiIntervalId = null;

function startAlchemyUiUpdates() {
    stopAlchemyUiUpdates();

    alchemyUiIntervalId =
        setInterval(() => {
            if (
                typeof updateAlchemyProgressUI ===
                "function"
            ) {
                updateAlchemyProgressUI();
            }
        }, 250);
}

function stopAlchemyUiUpdates() {
    if (
        alchemyUiIntervalId !== null
    ) {
        clearInterval(
            alchemyUiIntervalId
        );

        alchemyUiIntervalId = null;
    }
}

function getDefaultAlchemyState() {
    return {
        level: 1,
        exp: 0,
        expToNextLevel:
            getAlchemyExpToNextLevel(1),

        isCrafting: false,

        queue: [],
        activeJobId: null,
        activeRecipeId: null,
        craftingQuantity: 1,

        craftingStartedAt: 0,
        craftingDurationMs: 0,
        craftingFinishesAt: 0,

        lastResult: null
    };
}

function ensureAlchemyState() {
    if (
        !player.alchemy ||
        typeof player.alchemy !== "object"
    ) {
        player.alchemy =
            getDefaultAlchemyState();
    }

    if (
        !Number.isFinite(
            player.alchemy.level
        ) ||
        player.alchemy.level < 1
    ) {
        player.alchemy.level = 1;
    }

    if (
        !Number.isFinite(
            player.alchemy.exp
        ) ||
        player.alchemy.exp < 0
    ) {
        player.alchemy.exp = 0;
    }

    if (
        !Number.isFinite(
            player.alchemy.expToNextLevel
        ) ||
        player.alchemy.expToNextLevel <= 0
    ) {
        player.alchemy.expToNextLevel =
            getAlchemyExpToNextLevel(
                player.alchemy.level
            );
    }

    if (
        typeof player.alchemy.isCrafting !==
        "boolean"
    ) {
        player.alchemy.isCrafting = false;
    }

    if (
        !Number.isFinite(
            player.alchemy.craftingStartedAt
        )
    ) {
        player.alchemy.craftingStartedAt = 0;
    }

    if (
        !Number.isFinite(
            player.alchemy.craftingDurationMs
        )
    ) {
        player.alchemy.craftingDurationMs = 0;
    }

    if (
        !Number.isFinite(
            player.alchemy.craftingFinishesAt
        )
    ) {
        player.alchemy.craftingFinishesAt = 0;
    }

    if (
    !Number.isFinite(
        player.alchemy.craftingQuantity
    ) ||
    player.alchemy.craftingQuantity < 1
) {
    player.alchemy.craftingQuantity = 1;
}

if (!Array.isArray(player.alchemy.queue)) {
    player.alchemy.queue = [];
}

if (
    typeof player.alchemy.activeJobId !==
    "string"
) {
    player.alchemy.activeJobId = null;
}

}

function openAlchemyScreen() {
    ensureAlchemyState();

    showScreen(
        "screen-alchemy"
    );

    requestAnimationFrame(() => {
        if (
            typeof renderAlchemy ===
            "function"
        ) {
            renderAlchemy();
        }
    });
}

function getAlchemyExpToNextLevel(level) {
    return Math.floor(
        100 +
        (level - 1) * 50 +
        Math.pow(
            level - 1,
            1.25
        ) * 25
    );
}

function isAlchemyRecipeUnlocked(recipe) {
    ensureAlchemyState();

    return Boolean(
        recipe &&
        player.alchemy.level >=
            recipe.requiredAlchemyLevel
    );
}

function getInventoryItemQuantity(itemId) {
    if (!Array.isArray(player.inventory)) {
        return 0;
    }

    const inventoryItem =
        player.inventory.find(entry => {
            return entry.itemId === itemId;
        });

    return inventoryItem
        ? inventoryItem.quantity || 0
        : 0;
}

function hasAlchemyIngredients(
    recipe,
    quantity = 1
) {
    if (
        !recipe ||
        !Array.isArray(recipe.ingredients)
    ) {
        return false;
    }

    const safeQuantity =
        Math.max(
            1,
            Math.floor(quantity || 1)
        );

    return recipe.ingredients.every(
        ingredient => {
            const requiredQuantity =
                ingredient.quantity *
                safeQuantity;

            return (
                getInventoryItemQuantity(
                    ingredient.itemId
                ) >= requiredQuantity
            );
        }
    );
}
function removeAlchemyIngredient(
    itemId,
    quantity
) {
    if (!Array.isArray(player.inventory)) {
        return false;
    }

    const inventoryItem =
        player.inventory.find(entry => {
            return entry.itemId === itemId;
        });

    if (
        !inventoryItem ||
        inventoryItem.quantity < quantity
    ) {
        return false;
    }

    inventoryItem.quantity -= quantity;

    if (inventoryItem.quantity <= 0) {
        player.inventory =
            player.inventory.filter(entry => {
                return entry.itemId !== itemId;
            });
    }

    return true;
}

function consumeAlchemyIngredients(
    recipe,
    quantity = 1
) {
    const safeQuantity =
        Math.max(
            1,
            Math.floor(quantity || 1)
        );

    if (
        !hasAlchemyIngredients(
            recipe,
            safeQuantity
        )
    ) {
        return false;
    }

    recipe.ingredients.forEach(
        ingredient => {
            removeAlchemyIngredient(
                ingredient.itemId,
                ingredient.quantity *
                    safeQuantity
            );
        }
    );

    return true;
}

function stopOtherActivitiesBeforeAlchemy() {
    if (
        typeof stopFight === "function" &&
        typeof isFighting !== "undefined" &&
        isFighting
    ) {
        stopFight();
    }

    if (
        typeof stopMining === "function" &&
        player.mining?.isMining
    ) {
        stopMining(false);
    }

    if (
        typeof stopHerbalism === "function" &&
        player.herbalism?.isGathering
    ) {
        stopHerbalism(false);
    }
}

function startAlchemyCrafting(
    recipeId,
    requestedQuantity = 1
) {
    ensureAlchemyState();

    const recipe =
        getAlchemyRecipe(recipeId);

    if (!recipe) {
        console.warn(
            "Nie znaleziono receptury:",
            recipeId
        );

        return;
    }

    if (!isAlchemyRecipeUnlocked(recipe)) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Ta receptura wymaga " +
                recipe.requiredAlchemyLevel +
                " poziomu alchemii.",
                "error"
            );
        }

        return;
    }

    const quantity =
        Math.max(
            1,
            Math.floor(
                Number(requestedQuantity) ||
                1
            )
        );

    if (
        !hasAlchemyIngredients(
            recipe,
            quantity
        )
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Brakuje składników do dodania mikstur do kolejki.",
                "error"
            );
        }

        return;
    }

    stopOtherActivitiesBeforeAlchemy();

    const ingredientsConsumed =
        consumeAlchemyIngredients(
            recipe,
            quantity
        );

    if (!ingredientsConsumed) {
        return;
    }

    for (
        let index = 0;
        index < quantity;
        index++
    ) {
        player.alchemy.queue.push({
            id: createAlchemyJobId(),
            recipeId: recipe.id,
            addedAt: Date.now()
        });
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "🧪 Dodano do kolejki: " +
            recipe.name +
            " x" +
            quantity +
            ".",
            "alchemy"
        );
    }

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Dodano do kolejki: " +
            recipe.name +
            " x" +
            quantity +
            ".",
            "success"
        );
    }

    startNextAlchemyJob();

    saveGame();

    if (
        typeof renderAlchemy ===
        "function"
    ) {
        renderAlchemy();
    }

    if (
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
    }
}
function scheduleAlchemyCompletion() {
    ensureAlchemyState();

    if (alchemyTimeoutId !== null) {
        clearTimeout(alchemyTimeoutId);
        alchemyTimeoutId = null;
    }

    if (
        !player.alchemy.isCrafting ||
        !player.alchemy.activeRecipeId
    ) {
        return;
    }

    const remainingMilliseconds =
        Math.max(
            0,
            player.alchemy.craftingFinishesAt -
                Date.now()
        );

    alchemyTimeoutId =
        setTimeout(() => {
            completeAlchemyCrafting();
        }, remainingMilliseconds);
}

function completeAlchemyCrafting() {
    ensureAlchemyState();

    if (!player.alchemy.isCrafting) {
        return;
    }

    const recipe =
        getAlchemyRecipe(
            player.alchemy.activeRecipeId
        );

    if (!recipe) {
        clearAlchemyCraftingState();
        startNextAlchemyJob();
        return;
    }

    const resultQuantity =
        recipe.resultQuantity || 1;

    addItemToInventory(
        recipe.resultItemId,
        resultQuantity
    );

    const gainedExp =
        getAlchemyRecipeExp(recipe);

    addAlchemyExp(gainedExp);

    player.alchemy.lastResult = {
        time: Date.now(),
        recipeId: recipe.id,
        resultItemId:
            recipe.resultItemId,
        resultQuantity:
            resultQuantity,
        alchemyExp: gainedExp
    };

    const resultItem =
        items[recipe.resultItemId];

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "🧪 Uwarzono: " +
            (
                resultItem?.name ||
                recipe.name
            ) +
            ". +" +
            gainedExp +
            " EXP alchemii.",
            "alchemy"
        );
    }

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Uwarzono: " +
            (
                resultItem?.name ||
                recipe.name
            ) +
            ".",
            "success"
        );
    }

    clearAlchemyCraftingState();

    saveGame();

    if (
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
    }

    if (
        typeof renderAlchemy ===
        "function"
    ) {
        renderAlchemy();
    }

    startNextAlchemyJob();
}

function clearAlchemyCraftingState() {
    if (alchemyTimeoutId !== null) {
        clearTimeout(alchemyTimeoutId);
        alchemyTimeoutId = null;
    }

    stopAlchemyUiUpdates();

    player.alchemy.isCrafting = false;
    player.alchemy.activeJobId = null;
    player.alchemy.activeRecipeId = null;
    player.alchemy.craftingQuantity = 1;

    player.alchemy.craftingStartedAt = 0;
    player.alchemy.craftingDurationMs = 0;
    player.alchemy.craftingFinishesAt = 0;
}

function cancelAlchemyCrafting(
    writeLog = true
) {
    return cancelAlchemyActivity(
        writeLog
    );
}
function resumeAlchemyCrafting() {
    ensureAlchemyState();

    if (player.alchemy.isCrafting) {
        const activeRecipe =
            getAlchemyRecipe(
                player.alchemy.activeRecipeId
            );

        if (!activeRecipe) {
            clearAlchemyCraftingState();
            startNextAlchemyJob();

            if (
                typeof renderAlchemy ===
                "function"
            ) {
                renderAlchemy();
            }

            return;
        }

        if (
            player.alchemy
                .craftingFinishesAt <=
            Date.now()
        ) {
            completeAlchemyCrafting();
            return;
        }

        startAlchemyUiUpdates();
        scheduleAlchemyCompletion();

        if (
            typeof renderAlchemy ===
                "function"
        ) {
            renderAlchemy();
        }

        return;
    }

    if (
        Array.isArray(
            player.alchemy.queue
        ) &&
        player.alchemy.queue.length > 0
    ) {
        startNextAlchemyJob();
    }

    if (
        typeof renderAlchemy ===
        "function"
    ) {
        renderAlchemy();
    }
}

function getAlchemyRecipeExp(recipe) {
    if (!recipe) {
        return 0;
    }

    return Math.max(
        5,
        Math.floor(
            8 +
            recipe.requiredAlchemyLevel * 3 +
            recipe.craftingDurationSeconds
        )
    );
}

function addAlchemyExp(amount) {
    ensureAlchemyState();

    const gainedExp =
        Math.max(
            0,
            Math.floor(amount || 0)
        );

    if (gainedExp <= 0) {
        return;
    }

    player.alchemy.exp += gainedExp;

    while (
        player.alchemy.exp >=
        player.alchemy.expToNextLevel
    ) {
        player.alchemy.exp -=
            player.alchemy.expToNextLevel;

        player.alchemy.level++;

        player.alchemy.expToNextLevel =
            getAlchemyExpToNextLevel(
                player.alchemy.level
            );

        if (
            typeof addSystemLog ===
            "function"
        ) {
            addSystemLog(
                "⬆️ Osiągnięto " +
                player.alchemy.level +
                " poziom alchemii.",
                "alchemy-level"
            );
        }

        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Poziom alchemii: " +
                player.alchemy.level +
                "!",
                "success"
            );
        }
    }
}

function getAlchemyCraftingProgressPercent() {
    ensureAlchemyState();

    if (
        !player.alchemy.isCrafting ||
        !player.alchemy.craftingStartedAt ||
        !player.alchemy.craftingDurationMs
    ) {
        return 0;
    }

    const elapsed =
        Date.now() -
        player.alchemy.craftingStartedAt;

    return Math.max(
        0,
        Math.min(
            100,
            elapsed /
                player.alchemy
                    .craftingDurationMs *
                100
        )
    );
}

function getAlchemyTimeRemainingSeconds() {
    ensureAlchemyState();

    if (!player.alchemy.isCrafting) {
        return 0;
    }

    return Math.max(
        0,
        Math.ceil(
            (
                player.alchemy
                    .craftingFinishesAt -
                Date.now()
            ) / 1000
        )
    );
}

function getMaxCraftableAlchemyQuantity(
    recipe
) {
    if (
        !recipe ||
        !Array.isArray(recipe.ingredients) ||
        recipe.ingredients.length === 0
    ) {
        return 0;
    }

    const possibleQuantities =
        recipe.ingredients.map(
            ingredient => {
                const ownedQuantity =
                    getInventoryItemQuantity(
                        ingredient.itemId
                    );

                return Math.floor(
                    ownedQuantity /
                    ingredient.quantity
                );
            }
        );

    return Math.max(
        0,
        Math.min(
            ...possibleQuantities
        )
    );
}

function createAlchemyJobId() {
    return (
        "alchemy_job_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .slice(2, 9)
    );
}

function startNextAlchemyJob() {
    ensureAlchemyState();

    if (player.alchemy.isCrafting) {
        return;
    }

    if (player.alchemy.queue.length === 0) {
        return;
    }

    const nextJob =
        player.alchemy.queue.shift();

    const recipe =
        getAlchemyRecipe(
            nextJob.recipeId
        );

    if (!recipe) {
        startNextAlchemyJob();
        return;
    }

    const durationMilliseconds =
        Math.max(
            1000,
            (
                recipe
                    .craftingDurationSeconds ||
                60
            ) * 1000
        );

    const now = Date.now();

    player.alchemy.isCrafting = true;
    player.alchemy.activeJobId =
        nextJob.id;

    player.alchemy.activeRecipeId =
        recipe.id;

    player.alchemy.craftingStartedAt =
        now;

    player.alchemy.craftingDurationMs =
        durationMilliseconds;

    player.alchemy.craftingFinishesAt =
        now + durationMilliseconds;

    scheduleAlchemyCompletion();
    startAlchemyUiUpdates();

    saveGame();

    if (
        typeof renderAlchemy ===
        "function"
    ) {
        renderAlchemy();
    }
}

function refundAlchemyIngredients(
    recipe,
    quantity = 1
) {
    if (
        !recipe ||
        !Array.isArray(recipe.ingredients)
    ) {
        return;
    }

    recipe.ingredients.forEach(
        ingredient => {
            addItemToInventory(
                ingredient.itemId,
                ingredient.quantity *
                    quantity
            );
        }
    );
}

function cancelActiveAlchemyJob(
    writeLog = true
) {
    ensureAlchemyState();

    if (
        !player.alchemy.isCrafting ||
        !player.alchemy.activeRecipeId
    ) {
        return false;
    }

    const activeRecipe =
        getAlchemyRecipe(
            player.alchemy.activeRecipeId
        );

    /*
        Zwracamy składniki tylko aktualnie
        warzonej mikstury.
    */
    if (activeRecipe) {
        refundAlchemyIngredients(
            activeRecipe,
            1
        );
    }

    /*
        Zatrzymujemy timer i czyścimy
        aktywne warzenie.
    */
    clearAlchemyCraftingState();

    if (
        writeLog &&
        typeof addSystemLog === "function"
    ) {
        addSystemLog(
            "↩️ Anulowano aktualne warzenie: " +
                (
                    activeRecipe?.name ||
                    "nieznana mikstura"
                ) +
                ". Składniki zostały zwrócone.",
            "alchemy"
        );
    }

    if (
        writeLog &&
        typeof showNotification ===
            "function"
    ) {
        showNotification(
            "Anulowano aktualną miksturę. Składniki wróciły do plecaka.",
            "success"
        );
    }

    /*
        Uruchamiamy następną miksturę,
        jeżeli jakaś czeka w kolejce.
    */
    startNextAlchemyJob();

    saveGame();

    if (
        typeof renderAlchemy ===
        "function"
    ) {
        renderAlchemy();
    }

    if (
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
    }

    return true;
}

function refundAllAlchemyIngredients() {
    ensureAlchemyState();

    let refundedPotionsCount = 0;

    /*
        Aktywna mikstura została już wyjęta
        z kolejki przez startNextAlchemyJob().
    */
    if (
        player.alchemy.isCrafting &&
        player.alchemy.activeRecipeId
    ) {
        const activeRecipe =
            getAlchemyRecipe(
                player.alchemy.activeRecipeId
            );

        if (activeRecipe) {
            refundAlchemyIngredients(
                activeRecipe,
                1
            );

            refundedPotionsCount++;
        }
    }

    /*
        Zwracamy składniki wszystkich mikstur,
        które nadal oczekują w kolejce.
    */
    player.alchemy.queue.forEach(job => {
        const recipe =
            getAlchemyRecipe(
                job.recipeId
            );

        if (!recipe) {
            return;
        }

        refundAlchemyIngredients(
            recipe,
            1
        );

        refundedPotionsCount++;
    });

    return refundedPotionsCount;
}

function cancelAlchemyActivity(
    writeLog = true
) {
    ensureAlchemyState();

    const hasActivePotion =
        player.alchemy.isCrafting;

    const hasQueuedPotions =
        player.alchemy.queue.length > 0;

    if (
        !hasActivePotion &&
        !hasQueuedPotions
    ) {
        return false;
    }

    const refundedPotionsCount =
        refundAllAlchemyIngredients();

    /*
        Zatrzymujemy timer aktywnej mikstury
        i czyścimy dane aktualnego warzenia.
    */
    clearAlchemyCraftingState();

    /*
        Usuwamy wszystkie oczekujące pozycje.
    */
    player.alchemy.queue = [];

    if (
        writeLog &&
        typeof addSystemLog === "function"
    ) {
        addSystemLog(
            "↩️ Anulowano alchemię. Zwrócono składniki za " +
                refundedPotionsCount +
                " mikstur.",
            "alchemy"
        );
    }

    if (
        writeLog &&
        typeof showNotification ===
            "function"
    ) {
        showNotification(
            "Alchemia została anulowana. Składniki wróciły do plecaka.",
            "success"
        );
    }

    saveGame();

    if (
        typeof renderAlchemy ===
        "function"
    ) {
        renderAlchemy();
    }

    if (
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
    }

    return true;
}

function removeAlchemyQueueItem(jobId) {
    ensureAlchemyState();

    const jobIndex =
        player.alchemy.queue.findIndex(
            job => job.id === jobId
        );

    if (jobIndex === -1) {
        return;
    }

    const removedJob =
        player.alchemy.queue[
            jobIndex
        ];

    const recipe =
        getAlchemyRecipe(
            removedJob.recipeId
        );

    player.alchemy.queue.splice(
        jobIndex,
        1
    );

    if (recipe) {
        refundAlchemyIngredients(
            recipe,
            1
        );
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "↩️ Usunięto z kolejki: " +
            (
                recipe?.name ||
                removedJob.recipeId
            ) +
            ". Składniki zostały zwrócone.",
            "alchemy"
        );
    }

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Usunięto jedną miksturę z kolejki.",
            "success"
        );
    }

    saveGame();

    if (
        typeof renderAlchemy ===
        "function"
    ) {
        renderAlchemy();
    }

    if (
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
    }
}