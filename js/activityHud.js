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

    progressFill.style.width =
        progress + "%";
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
        container.innerHTML = `
            <div class="timed-effects-empty">
                Brak aktywnych efektów czasowych.
            </div>
        `;

        return;
    }

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