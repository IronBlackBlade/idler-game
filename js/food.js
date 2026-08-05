const ACTIVE_FOOD_EFFECT_ID = "active_food";
const MAX_FOOD_EFFECT_DURATION_MS =
    8 * 60 * 60 * 1000;
const COMBAT_FOOD_COOLDOWN_MS =
    10 * 1000;
const FOOD_HEALING_INTERVAL_MS =
    5 * 1000;

function getActiveFoodEffect() {
    if (typeof getTimedEffect !== "function") {
        return null;
    }

    return getTimedEffect(ACTIVE_FOOD_EFFECT_ID);
}

function getActiveFoodBonus(bonusName) {
    const effect = getActiveFoodEffect();
    return Math.max(0, Number(effect?.bonuses?.[bonusName]) || 0);
}

function getDefaultCombatFoodState() {
    return {
        selectedFoodId: null,
        cooldownUntil: 0
    };
}

function ensureCombatFoodState() {
    if (
        !player.combatFood ||
        typeof player.combatFood !==
        "object"
    ) {
        player.combatFood =
            getDefaultCombatFoodState();
    }

    const selectedFoodId =
        typeof player.combatFood
            .selectedFoodId ===
            "string"
            ? player.combatFood
                .selectedFoodId
            : null;

    const selectedFood =
        selectedFoodId
            ? items[selectedFoodId]
            : null;

    if (
        selectedFoodId &&
        (
            !selectedFood ||
            selectedFood.type !==
            "food"
        )
    ) {
        player.combatFood
            .selectedFoodId =
            null;
    }

    player.combatFood.cooldownUntil =
        Math.max(
            0,
            Number(
                player.combatFood
                    .cooldownUntil
            ) || 0
        );
}

function getFoodItems() {
    if (
        typeof items ===
        "undefined"
    ) {
        return [];
    }

    return Object.values(
        items
    )
        .filter(item => {
            return (
                item &&
                item.type === "food"
            );
        })
        .sort(
            (
                firstFood,
                secondFood
            ) => {
                const firstName =
                    firstFood.name || "";

                const secondName =
                    secondFood.name || "";

                return firstName.localeCompare(
                    secondName,
                    "pl"
                );
            }
        );
}

function setCombatFood(
    foodItemId
) {
    ensureCombatFoodState();

    const foodItem =
        foodItemId
            ? items[foodItemId]
            : null;

    player.combatFood
        .selectedFoodId =
        foodItem?.type === "food"
            ? foodItemId
            : null;

    if (
        typeof saveGame ===
        "function"
    ) {
        saveGame();
    }

    if (
        typeof renderCombatFoodPanel ===
        "function"
    ) {
        renderCombatFoodPanel();
    }
}

function getCombatFoodCooldownSecondsLeft() {
    ensureCombatFoodState();

    return Math.max(
        0,
        Math.ceil(
            (
                player.combatFood
                    .cooldownUntil -
                Date.now()
            ) /
            1000
        )
    );
}

function isCombatCurrentlyActive() {
    return (
        player.isFighting === true ||
        (
            typeof isFighting !==
            "undefined" &&
            isFighting === true
        )
    );
}

function getActiveFoodRemainingSeconds() {
    const activeFood =
        getActiveFoodEffect();

    if (!activeFood) {
        return 0;
    }

    return Math.max(
        0,
        Math.ceil(
            (
                Number(
                    activeFood.expiresAt
                ) -
                Date.now()
            ) /
            1000
        )
    );
}

function useSelectedCombatFood() {
    ensureCombatFoodState();

    const selectedFoodId =
        player.combatFood
            .selectedFoodId;

    if (!selectedFoodId) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Najpierw wybierz potrawę.",
                "error"
            );
        }

        return false;
    }

    const cooldownSeconds =
        getCombatFoodCooldownSecondsLeft();

    if (
        isCombatCurrentlyActive() &&
        cooldownSeconds > 0
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Możesz ponownie zjeść za " +
                cooldownSeconds +
                " s.",
                "error"
            );
        }

        return false;
    }

    const foodItem =
        items[selectedFoodId];

    const quantity =
        typeof getInventoryItemQuantity ===
            "function"
            ? getInventoryItemQuantity(
                selectedFoodId
            )
            : 0;

    if (
        !foodItem ||
        foodItem.type !== "food" ||
        quantity <= 0
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Nie masz wybranej potrawy w plecaku.",
                "error"
            );
        }

        if (
            typeof renderCombatFoodPanel ===
            "function"
        ) {
            renderCombatFoodPanel();
        }

        return false;
    }

    const foodWasUsed =
        useFood(
            selectedFoodId
        );

    if (!foodWasUsed) {
        return false;
    }

    /*
     * Poza walką potrawę można jeść
     * bez dodatkowego cooldownu.
     */
    if (
        isCombatCurrentlyActive()
    ) {
        player.combatFood
            .cooldownUntil =
            Date.now() +
            COMBAT_FOOD_COOLDOWN_MS;
    }

    if (
        typeof addCombatLog ===
        "function" &&
        isCombatCurrentlyActive()
    ) {
        addCombatLog(
            "🍲 Zjedzono: " +
            foodItem.name +
            "."
        );
    }

    if (
        typeof saveGame ===
        "function"
    ) {
        saveGame();
    }

    if (
        typeof renderCombatFoodPanel ===
        "function"
    ) {
        renderCombatFoodPanel();
    }

    return true;
}

function collectFoodRegenerationHealing() {
    const effect =
        getActiveFoodEffect();

    if (!effect) {
        return 0;
    }

    const healingPercentPerTick =
        Math.max(
            0,
            Number(
                effect.bonuses
                    ?.healthRegenerationPercentPerTick
            ) || 0
        );

    if (
        healingPercentPerTick <= 0
    ) {
        return 0;
    }

    if (
        Number(player.hp) <= 0
    ) {
        return 0;
    }

    const currentTime =
        Date.now();

    const effectExpiresAt =
        Math.max(
            0,
            Number(
                effect.expiresAt
            ) || 0
        );

    if (
        effectExpiresAt <=
        currentTime
    ) {
        return 0;
    }

    let nextTickAt =
        Math.max(
            0,
            Number(
                effect
                    .foodHealingNextTickAt
            ) || 0
        );

    if (nextTickAt <= 0) {
        nextTickAt =
            currentTime +
            FOOD_HEALING_INTERVAL_MS;

        effect.foodHealingNextTickAt =
            nextTickAt;

        return 0;
    }

    if (
        currentTime <
        nextTickAt
    ) {
        return 0;
    }

    /*
     * Obliczamy, ile pełnych cykli
     * minęło od ostatniego sprawdzenia.
     */
    const elapsedTicks =
        Math.max(
            1,
            Math.floor(
                (
                    currentTime -
                    nextTickAt
                ) /
                FOOD_HEALING_INTERVAL_MS
            ) +
            1
        );

    /*
     * Nie naliczamy cykli późniejszych
     * niż moment zakończenia posiłku.
     */
    const finalTickTime =
        Math.min(
            currentTime,
            effectExpiresAt
        );

    const availableTicks =
        Math.max(
            0,
            Math.floor(
                (
                    finalTickTime -
                    nextTickAt
                ) /
                FOOD_HEALING_INTERVAL_MS
            ) +
            1
        );

    const ticksToApply =
        Math.min(
            elapsedTicks,
            availableTicks
        );

    if (ticksToApply <= 0) {
        return 0;
    }

    effect.foodHealingNextTickAt =
        nextTickAt +
        ticksToApply *
        FOOD_HEALING_INTERVAL_MS;

    const derived =
        getDerivedStats();

    const maximumHp =
        Math.max(
            1,
            Number(
                derived.maxHp
            ) || 1
        );

    const hpBeforeHealing =
        Math.max(
            0,
            Number(player.hp) || 0
        );

    if (
        hpBeforeHealing >=
        maximumHp
    ) {
        return 0;
    }

    const healingPerTick =
        Math.max(
            1,
            Math.floor(
                maximumHp *
                healingPercentPerTick /
                100
            )
        );

    const requestedHealing =
        healingPerTick *
        ticksToApply;

    player.hp =
        Math.min(
            maximumHp,
            hpBeforeHealing +
            requestedHealing
        );

    return Math.max(
        0,
        player.hp -
        hpBeforeHealing
    );
}

function useFood(itemId) {
    const item = items[itemId];

    if (
        !item ||
        item.type !== "food" ||
        getInventoryItemQuantity(itemId) <= 0
    ) {
        if (typeof showNotification === "function") {
            showNotification("Nie masz tej potrawy.", "error");
        }
        return false;
    }

    const currentTime = Date.now();
    const existingEffect =
        getActiveFoodEffect();
    const isSameMeal =
        Boolean(existingEffect) &&
        (
            existingEffect.sourceItemId ===
            itemId ||
            (
                !existingEffect.sourceItemId &&
                existingEffect.name ===
                (
                    item.foodEffectName ||
                    item.name
                )
            )
        );
    const currentRemainingMilliseconds =
        isSameMeal
            ? Math.max(
                0,
                Number(
                    existingEffect.expiresAt
                ) -
                currentTime
            )
            : 0;

    if (
        isSameMeal &&
        currentRemainingMilliseconds >=
        MAX_FOOD_EFFECT_DURATION_MS
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Ten posiłek ma już maksymalny czas działania: 8 godzin.",
                "error"
            );
        }

        return false;
    }

    const mealDurationMilliseconds =
        Math.max(
            1,
            Number(
                item.durationSeconds
            ) || 1
        ) *
        1000;
    const nextDurationMilliseconds =
        isSameMeal
            ? Math.min(
                MAX_FOOD_EFFECT_DURATION_MS,
                currentRemainingMilliseconds +
                mealDurationMilliseconds
            )
            : Math.min(
                MAX_FOOD_EFFECT_DURATION_MS,
                mealDurationMilliseconds
            );

    const oldMaximumHp =
        typeof getDerivedStats === "function"
            ? getDerivedStats().maxHp
            : 0;

    removeItemFromInventory(itemId, 1);

    addTimedEffect({
        id: ACTIVE_FOOD_EFFECT_ID,
        name: item.foodEffectName || item.name,
        icon: item.foodIcon || "🍲",
        sourceItemId: itemId,
        foodHealingNextTickAt:
            isSameMeal &&
                Number(
                    existingEffect
                        .foodHealingNextTickAt
                ) > currentTime
                ? Number(
                    existingEffect
                        .foodHealingNextTickAt
                )
                : currentTime +
                FOOD_HEALING_INTERVAL_MS,
        startedAt:
            isSameMeal
                ? existingEffect.startedAt
                : currentTime,
        description:
            item.foodEffectDescription ||
            "Aktywny efekt posiłku.",
        activityType: "general",
        durationMilliseconds:
            nextDurationMilliseconds,
        bonuses: {
            ...(item.foodBonuses || {})
        },
        notificationMessage:
            isSameMeal
                ? "Wydłużono działanie: " +
                item.name +
                "."
                : null,
        logMessage:
            isSameMeal
                ? "🍲 Wydłużono działanie: " +
                item.name +
                "."
                : null
    });

    if (typeof getDerivedStats === "function") {
        const newMaximumHp = getDerivedStats().maxHp;

        if (newMaximumHp > oldMaximumHp) {
            player.hp += newMaximumHp - oldMaximumHp;
        }

        player.hp = Math.min(newMaximumHp, Math.max(0, player.hp));
    }

    saveGame();

    if (typeof renderInventory === "function") {
        renderInventory();
    }
    if (typeof render === "function") {
        render();
    }

    return true;
}
