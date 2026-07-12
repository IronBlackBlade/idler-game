let activityHudIntervalId = null;

function getCurrentActivity() {
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
                    ? location.name + " — " + enemy.name
                    : "Trwa walka."
        };
    }

    return {
        type: "idle",
        icon: "💤",
        name: "Brak aktywności",
        details: "Bohater odpoczywa."
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

    iconElement.textContent = activity.icon;
    nameElement.textContent = activity.name;
    detailsElement.textContent =
        activity.details;

    if (activity.type === "combat") {
        timeElement.textContent = "Aktywna";
    } else {
        timeElement.textContent = "—";
    }

    const hud =
        document.getElementById(
            "activity-hud"
        );

    if (hud) {
        hud.dataset.activity =
            activity.type;
    }
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