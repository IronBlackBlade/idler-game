let activityHudIntervalId = null;





function getMiningTimeRemaining() {
    if (
        !player.mining ||
        !player.mining.isMining ||
        !player.mining.cycleStartedAt ||
        !player.mining.cycleDurationMs
    ) {
        return 0;
    }

    const elapsed =
        Date.now() -
        player.mining.cycleStartedAt;

    const remainingMilliseconds =
        Math.max(
            0,
            player.mining.cycleDurationMs -
            elapsed
        );

    return Math.ceil(
        remainingMilliseconds / 1000
    );
}

function getHerbalismTimeRemaining() {
    if (
        !player.herbalism ||
        !player.herbalism.isGathering ||
        !player.herbalism.cycleStartedAt ||
        !player.herbalism.cycleDurationMs
    ) {
        return 0;
    }

    const elapsed =
        Date.now() -
        player.herbalism.cycleStartedAt;

    const remainingMilliseconds =
        Math.max(
            0,
            player.herbalism.cycleDurationMs -
            elapsed
        );

    return Math.ceil(
        remainingMilliseconds / 1000
    );
}

function getCurrentActivity() {
    
        if (
        player.alchemy &&
        player.alchemy.isCrafting
    ) {
        const activeRecipe =
            typeof getAlchemyRecipe === "function"
                ? getAlchemyRecipe(
                    player.alchemy.activeRecipeId
                )
                : null;

        const progress =
            typeof getAlchemyCraftingProgressPercent ===
            "function"
                ? getAlchemyCraftingProgressPercent()
                : 0;

        const timeRemaining =
            typeof getAlchemyTimeRemainingSeconds ===
            "function"
                ? getAlchemyTimeRemainingSeconds()
                : 0;

        const queuedPotions =
            Array.isArray(player.alchemy.queue)
                ? player.alchemy.queue.length
                : 0;

        let queueText = "";

        if (queuedPotions > 0) {
            queueText =
                " — w kolejce: " +
                queuedPotions;
        }

        return {
            type: "alchemy",
            icon: "🧪",
            name: "Warzenie mikstury",
            details:
                (activeRecipe?.name ||
                    "Nieznana mikstura") +
                " — postęp " +
                Math.floor(progress) +
                "%" +
                queueText,
            timeText:
                timeRemaining > 0
                    ? timeRemaining + " s"
                    : "Kończenie..."
        };
    }
    
    if (
        player.mining &&
        player.mining.isMining
    ) {
        const miningArea =
            typeof getMiningArea === "function"
                ? getMiningArea(
                    player.mining.activeAreaId
                )
                : null;

        const progress =
            typeof getMiningProgressPercent ===
            "function"
                ? getMiningProgressPercent()
                : 0;

        const timeRemaining =
            getMiningTimeRemaining();

        return {
            type: "mining",
            icon: "⛏️",
            name: "Kopanie",
            details:
                (miningArea?.name ||
                    "Nieznany szyb") +
                " — postęp " +
                Math.floor(progress) +
                "%",
            timeText:
                timeRemaining > 0
                    ? timeRemaining + " s"
                    : "Kończenie..."
        };
    }

    if (
    player.herbalism &&
    player.herbalism.isGathering
) {
    const herbalismArea =
        typeof getHerbalismArea ===
        "function"
            ? getHerbalismArea(
                player.herbalism.activeAreaId
            )
            : null;

    const progress =
        typeof getHerbalismProgressPercent ===
        "function"
            ? getHerbalismProgressPercent()
            : 0;

    const timeRemaining =
        getHerbalismTimeRemaining();

    return {
        type: "herbalism",
        icon: "🌿",
        name: "Zielarstwo",

        details:
            (
                herbalismArea?.name ||
                "Nieznana lokacja"
            ) +
            " — postęp " +
            Math.floor(progress) +
            "%",

        timeText:
            timeRemaining > 0
                ? timeRemaining + " s"
                : "Kończenie..."
    };
}

    if (
        typeof isFighting !== "undefined" &&
        isFighting
    ) {
        const location =
            typeof locations !== "undefined"
                ? locations[player.location]
                : null;

        return {
            type: "combat",
            icon: "⚔️",
            name: "Walka",
            details:
                location && enemy
                    ? location.name +
                      " — " +
                      enemy.name
                    : "Trwa walka.",
            timeText: "Aktywna"
        };
    }

    return {
        type: "idle",
        icon: "💤",
        name: "Brak aktywności",
        details: "Bohater odpoczywa.",
        timeText: "—"
    };
}

function formatPotionEffectTime(
    remainingMilliseconds
) {
    const totalSeconds = Math.max(
        0,
        Math.ceil(
            remainingMilliseconds / 1000
        )
    );

    const minutes = Math.floor(
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

function getPotionEffectDisplayData(
    effectId,
    effectValue
) {
    const value =
        Number(effectValue) || 0;

    const displayData = {
        mining_speed: {
            icon: "⛏️",
            description:
                "+" +
                value +
                "% szybkości kopania"
        },

        herbalism_speed: {
            icon: "🌿",
            description:
                "+" +
                value +
                "% szybkości zielarstwa"
        },

        hunter_luck: {
            icon: "🍀",
            description:
                "+" +
                value +
                "% szansy na łup"
        },

melee_weapon_damage: {
    icon: "⚔️",
    description:
        "+" +
        value +
        "% obrażeń w zwarciu"
},

ranged_weapon_damage: {
    icon: "🏹",
    description:
        "+" +
        value +
        "% obrażeń dystansowych"
},

magic_weapon_damage: {
    icon: "🪄",
    description:
        "+" +
        value +
        "% obrażeń różdżek"
},

spell_damage: {
    icon: "🔥",
    description:
        "+" +
        value +
        "% obrażeń czarów"
},

        combat_defense: {
            icon: "🛡️",
            description:
                "+" +
                value +
                "% obrony"
        },

        mana_regeneration: {
            icon: "🔷",
            description:
                "+" +
                value +
                "% regeneracji many"
        }
    };

    return (
        displayData[effectId] || {
            icon: "🧪",
            description:
                "Aktywny efekt mikstury"
        }
    );
}

function renderActivePotionEffects() {
    const container =
        document.getElementById(
            "potion-effects-container"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const potionEffects =
        player.activeEffects
            ?.potionEffects;

    if (
        !potionEffects ||
        typeof potionEffects !== "object"
    ) {
        container.style.display = "none";
        return;
    }

    const currentTime = Date.now();

    let removedExpiredEffect = false;

    Object.entries(
        potionEffects
    ).forEach(
        ([effectId, effect]) => {
            if (
                !effect ||
                effect.expiresAt <= currentTime
            ) {
                delete potionEffects[effectId];

                removedExpiredEffect = true;
                return;
            }

            const potionItem =
                typeof items !== "undefined"
                    ? items[effect.itemId]
                    : null;

            const displayData =
                getPotionEffectDisplayData(
                    effectId,
                    effect.value
                );

            const remainingMilliseconds =
                effect.expiresAt -
                currentTime;

            const effectElement =
                document.createElement("div");

            effectElement.className =
                "potion-effect";

            const iconElement =
                document.createElement("div");

            iconElement.className =
                "potion-effect-icon";

            iconElement.textContent =
                displayData.icon;

            const infoElement =
                document.createElement("div");

            infoElement.className =
                "potion-effect-info";

            const nameElement =
                document.createElement("strong");

            nameElement.textContent =
                potionItem?.name ||
                "Aktywna mikstura";

            const descriptionElement =
                document.createElement("span");

            descriptionElement.textContent =
                displayData.description;

            infoElement.appendChild(
                nameElement
            );

            infoElement.appendChild(
                descriptionElement
            );

            const timeElement =
                document.createElement("span");

            timeElement.className =
                "potion-effect-time";

            timeElement.textContent =
                formatPotionEffectTime(
                    remainingMilliseconds
                );

            effectElement.appendChild(
                iconElement
            );

            effectElement.appendChild(
                infoElement
            );

            effectElement.appendChild(
                timeElement
            );

            container.appendChild(
                effectElement
            );
        }
    );

    const activeEffectCount =
        Object.keys(potionEffects).length;

    container.style.display =
        activeEffectCount > 0
            ? "flex"
            : "none";

    if (
        removedExpiredEffect &&
        typeof saveGame === "function"
    ) {
        saveGame();
    }
}

function renderActivityHud() {
    const iconElement =
        document.getElementById(
            "activity-hud-icon"
        );

    const nameElement =
        document.getElementById(
            "activity-hud-name"
        );

    const detailsElement =
        document.getElementById(
            "activity-hud-details"
        );

    const timeElement =
        document.getElementById(
            "activity-hud-time"
        );

    if (
        !iconElement ||
        !nameElement ||
        !detailsElement ||
        !timeElement
    ) {
        return;
    }

    const activity = getCurrentActivity();

    const progressFill =
    document.getElementById(
        "activity-hud-progress-fill"
    );

    if (progressFill) {
        let progress = 0;

        if (
            activity.type === "mining" &&
            typeof getMiningProgressPercent ===
                "function"
        ) {
            progress =
                getMiningProgressPercent();
        }

        if (
            activity.type === "herbalism" &&
            typeof getHerbalismProgressPercent ===
                "function"
        ) {
            progress =
                getHerbalismProgressPercent();
        }

        if (
            activity.type === "alchemy" &&
            typeof getAlchemyCraftingProgressPercent ===
                "function"
        ) {
            progress =
                getAlchemyCraftingProgressPercent();
        }

        progressFill.style.width =
            Math.max(
                0,
                Math.min(100, progress)
            ) + "%";
    }

    iconElement.textContent = activity.icon;
    nameElement.textContent = activity.name;
    detailsElement.textContent =
        activity.details;

timeElement.textContent =
    activity.timeText || "—";

    const hud =
        document.getElementById(
            "activity-hud"
        );

    if (hud) {
        hud.dataset.activity =
            activity.type;
    }

    
    renderActivePotionEffects();
    renderTimedEffects();
    
}

function renderTimedEffects() {
    const container =
        document.getElementById(
            "timed-effects-container"
        );

    if (!container) {
        return;
    }

    const activeEffects =
        typeof getActiveTimedEffects ===
        "function"
            ? getActiveTimedEffects()
            : [];

    container.innerHTML = "";

if (activeEffects.length === 0) {
    const potionEffects =
        player.activeEffects
            ?.potionEffects || {};

    const hasActivePotionEffect =
        Object.values(
            potionEffects
        ).some(effect => {
            return (
                effect &&
                effect.expiresAt >
                    Date.now()
            );
        });

    /*
     * Jeśli mikstura jest już widoczna
     * w HUD-zie, ukrywamy mylący napis
     * o braku efektów.
     */
    if (hasActivePotionEffect) {
        container.hidden = true;
        return;
    }

    container.hidden = false;

    container.innerHTML = `
        <div class="timed-effects-empty">
            Brak aktywnych efektów czasowych.
        </div>
    `;

    return;
}

container.hidden = false;

    activeEffects.forEach(effect => {
        const effectElement =
            document.createElement("div");

        effectElement.className =
            "timed-effect";

        effectElement.dataset.activityType =
            effect.activityType ||
            "general";

        const iconElement =
            document.createElement("span");

        iconElement.className =
            "timed-effect-icon";

        iconElement.textContent =
            effect.icon || "✨";

        const contentElement =
            document.createElement("div");

        contentElement.className =
            "timed-effect-content";

        const nameElement =
            document.createElement("strong");

        nameElement.className =
            "timed-effect-name";

        nameElement.textContent =
            effect.name;

        const descriptionElement =
            document.createElement("span");

        descriptionElement.className =
            "timed-effect-description";

        descriptionElement.textContent =
            effect.description;

        const timeElement =
            document.createElement("span");

        timeElement.className =
            "timed-effect-time";

        timeElement.textContent =
            typeof formatTimedEffectRemainingTime ===
            "function"
                ? formatTimedEffectRemainingTime(
                    effect
                )
                : "00:00";

        contentElement.appendChild(
            nameElement
        );

        contentElement.appendChild(
            descriptionElement
        );

        effectElement.appendChild(
            iconElement
        );

        effectElement.appendChild(
            contentElement
        );

        effectElement.appendChild(
            timeElement
        );

        container.appendChild(
            effectElement
        );
    });
}

function startActivityHudUpdates() {
    if (activityHudIntervalId) {
        return;
    }

    renderActivityHud();

    activityHudIntervalId =
        setInterval(() => {
            renderActivityHud();
        }, 1000);
}