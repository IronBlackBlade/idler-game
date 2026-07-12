function ensureTimedEffects() {
    if (!Array.isArray(player.timedEffects)) {
        player.timedEffects = [];
    }
}

function addTimedEffect(effectData) {
    ensureTimedEffects();

    if (
        !effectData ||
        !effectData.id ||
        !effectData.name
    ) {
        console.warn(
            "Nieprawidłowe dane efektu czasowego:",
            effectData
        );

        return;
    }

    const durationMilliseconds =
        Math.max(
            1000,
            Number(
                effectData.durationMilliseconds
            ) || 0
        );

    const now = Date.now();

    const newEffect = {
        id: effectData.id,
        name: effectData.name,
        icon: effectData.icon || "✨",
        description:
            effectData.description ||
            "Aktywny efekt czasowy.",

        activityType:
            effectData.activityType ||
            "general",

        startedAt: now,
        expiresAt:
            now +
            durationMilliseconds,

        bonuses: {
            ...(effectData.bonuses || {})
        }
    };

    const existingEffectIndex =
        player.timedEffects.findIndex(
            effect => {
                return (
                    effect.id ===
                    newEffect.id
                );
            }
        );

    if (existingEffectIndex >= 0) {
        player.timedEffects[
            existingEffectIndex
        ] = newEffect;
    } else {
        player.timedEffects.push(
            newEffect
        );
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            newEffect.icon +
            " Aktywowano efekt: " +
            newEffect.name +
            ".",
            "effect"
        );
    }

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Aktywowano: " +
            newEffect.name +
            ".",
            "success"
        );
    }

    saveGame();

    if (
        typeof renderActivityHud ===
        "function"
    ) {
        renderActivityHud();
    }
}

function removeTimedEffect(
    effectId,
    writeLog = false
) {
    ensureTimedEffects();

    const effect =
        player.timedEffects.find(
            currentEffect => {
                return (
                    currentEffect.id ===
                    effectId
                );
            }
        );

    if (!effect) {
        return;
    }

    player.timedEffects =
        player.timedEffects.filter(
            currentEffect => {
                return (
                    currentEffect.id !==
                    effectId
                );
            }
        );

    if (
        writeLog &&
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "⌛ Zakończył się efekt: " +
            effect.name +
            ".",
            "effect-expired"
        );
    }

    saveGame();
}

function removeExpiredTimedEffects() {
    ensureTimedEffects();

    const now = Date.now();

    const expiredEffects =
        player.timedEffects.filter(
            effect => {
                return (
                    !effect.expiresAt ||
                    effect.expiresAt <= now
                );
            }
        );

    if (expiredEffects.length === 0) {
        return;
    }

    expiredEffects.forEach(effect => {
        removeTimedEffect(
            effect.id,
            true
        );
    });
}

function getActiveTimedEffects() {
    ensureTimedEffects();
    removeExpiredTimedEffects();

    return player.timedEffects;
}

function getTimedEffect(
    effectId
) {
    return getActiveTimedEffects()
        .find(effect => {
            return (
                effect.id ===
                effectId
            );
        }) || null;
}

function hasTimedEffect(
    effectId
) {
    return Boolean(
        getTimedEffect(effectId)
    );
}

function getTimedEffectRemainingMilliseconds(
    effect
) {
    if (!effect || !effect.expiresAt) {
        return 0;
    }

    return Math.max(
        0,
        effect.expiresAt -
        Date.now()
    );
}

function formatTimedEffectRemainingTime(
    effect
) {
    const remainingMilliseconds =
        getTimedEffectRemainingMilliseconds(
            effect
        );

    const totalSeconds =
        Math.ceil(
            remainingMilliseconds / 1000
        );

    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const seconds =
        totalSeconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}

function getTimedEffectBonus(
    bonusName,
    activityType = null
) {
    const activeEffects =
        getActiveTimedEffects();

    return activeEffects.reduce(
        (total, effect) => {
            if (
                activityType &&
                effect.activityType !==
                    "general" &&
                effect.activityType !==
                    activityType
            ) {
                return total;
            }

            const bonusValue =
                effect.bonuses?.[
                    bonusName
                ];

            if (
                typeof bonusValue !==
                "number"
            ) {
                return total;
            }

            return total + bonusValue;
        },
        0
    );
}