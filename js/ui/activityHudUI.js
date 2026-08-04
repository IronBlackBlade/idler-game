let activityHudIntervalId = null;

function formatPotionEffectTime(
    remainingMilliseconds
) {
    const totalSeconds = Math.max(
        0,
        Math.ceil(
            remainingMilliseconds / 1000
        )
    );

    const hours = Math.floor(
        totalSeconds / 3600
    );

    const minutes = Math.floor(
        (
            totalSeconds % 3600
        ) / 60
    );

    const seconds =
        totalSeconds % 60;

    if (hours > 0) {
        return (
            String(hours).padStart(2, "0") +
            ":" +
            String(minutes).padStart(2, "0") +
            ":" +
            String(seconds).padStart(2, "0")
        );
    }

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

function ensureActivityHudOverview() {
    const hud =
        document.getElementById(
            "activity-hud"
        );

    const mainActivity =
        hud?.querySelector(
            ".activity-hud-main"
        );

    if (
        !hud ||
        !mainActivity
    ) {
        return null;
    }

    let overview =
        hud.querySelector(
            ".activity-hud-overview"
        );

    /*
     * Przy pierwszym uruchomieniu tworzymy
     * kontener na dwie połowy HUD-u.
     */
    if (!overview) {
        overview =
            document.createElement(
                "div"
            );

        overview.className =
            "activity-hud-overview";

        hud.insertBefore(
            overview,
            mainActivity
        );

        overview.appendChild(
            mainActivity
        );
    }

    let backgroundPanel =
        overview.querySelector(
            ".activity-hud-background"
        );

    if (!backgroundPanel) {
        backgroundPanel =
            document.createElement(
                "section"
            );

        backgroundPanel.className =
            "activity-hud-background";

        backgroundPanel.innerHTML = `
    <div
        class="activity-hud-background-list"
        data-background-work-list
    ></div>
`;

        overview.appendChild(
            backgroundPanel
        );
    }

    return backgroundPanel.querySelector(
        "[data-background-work-list]"
    );
}

function renderBackgroundWorkHud() {
    const list =
        ensureActivityHudOverview();

    if (!list) {
        return;
    }

    const backgroundWorks =
        typeof getCurrentBackgroundWorks ===
            "function"
            ? getCurrentBackgroundWorks()
            : [];

    list.innerHTML = "";
    list.classList.toggle(
        "single-background-work",
        backgroundWorks.length === 1
    );

    if (
        backgroundWorks.length === 0
    ) {
        list.innerHTML = `
            <div class="activity-hud-background-empty">
                <span>💤</span>

                <div>
                    <strong>
                        Brak prac w tle
                    </strong>

                    <small>
                        Wytwarzanie i Alchemia są bezczynne.
                    </small>
                </div>
            </div>
        `;

        return;
    }

    backgroundWorks.forEach(
        work => {
            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "activity-hud-work-row";

            row.dataset.workType =
                work.type;

            const formattedTime =
                work.remainingSeconds > 0
                    ? formatPotionEffectTime(
                        work.remainingSeconds *
                        1000
                    )
                    : "Kończenie...";

            row.innerHTML = `
                <div class="activity-hud-work-main">
                    <div class="activity-hud-work-icon">
                        ${work.icon}
                    </div>

                    <div class="activity-hud-work-info">
                        <span class="activity-hud-work-label">
                            AKTUALNA PRACA
                        </span>

                        <strong>
                            ${work.name}
                        </strong>

                        <span class="activity-hud-work-description">
                            ${work.details}
                            — postęp
                            ${Math.floor(
                work.progress
            )}%
                            — kolejka:
                            ${work.queueCount}
                        </span>
                    </div>

                    <span class="activity-hud-work-time">
                        ${formattedTime}
                    </span>
                </div>

                <div class="activity-hud-work-progress">
                    <div
                        class="activity-hud-work-progress-fill"
                        style="width: ${work.progress}%;"
                    ></div>
                </div>
            `;

            list.appendChild(
                row
            );
        }
    );
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
            activity.type === "fishing" &&
            typeof getFishingProgressPercent ===
            "function"
        ) {
            progress =
                getFishingProgressPercent();
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

    renderBackgroundWorkHud();

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
