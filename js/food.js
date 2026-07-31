const ACTIVE_FOOD_EFFECT_ID = "active_food";
const MAX_FOOD_EFFECT_DURATION_MS =
    8 * 60 * 60 * 1000;

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
