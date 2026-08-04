
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

function getFishingTimeRemaining() {
    if (
        !player.fishing ||
        !player.fishing.isFishing ||
        !player.fishing.cycleStartedAt ||
        !player.fishing.cycleDurationMs
    ) {
        return 0;
    }

    const elapsed =
        Date.now() -
        player.fishing.cycleStartedAt;
    const remainingMilliseconds =
        Math.max(
            0,
            player.fishing.cycleDurationMs -
            elapsed
        );

    return Math.ceil(
        remainingMilliseconds / 1000
    );
}

function getCurrentBackgroundWorks() {
    const backgroundWorks = [];

    /*
     * WYTWARZANIE
     */
    const craftingJob =
        typeof getActiveCraftingQueueJob ===
            "function"
            ? getActiveCraftingQueueJob()
            : null;

    if (craftingJob) {
        const recipe =
            typeof getCraftingRecipeById ===
                "function"
                ? getCraftingRecipeById(
                    craftingJob.recipeId
                )
                : null;

        const resultItem =
            recipe &&
            typeof items !==
                "undefined"
                ? items[
                    recipe.resultItemId
                ]
                : null;

        const progress =
            typeof getCraftingQueueProgressPercent ===
                "function"
                ? getCraftingQueueProgressPercent()
                : 0;

        const remainingSeconds =
            typeof getCraftingTotalQueueRemainingSeconds ===
                "function"
                ? getCraftingTotalQueueRemainingSeconds()
                : (
                    typeof getCraftingQueueRemainingSeconds ===
                        "function"
                        ? getCraftingQueueRemainingSeconds()
                        : 0
                );

        const queue =
            typeof getCraftingQueue ===
                "function"
                ? getCraftingQueue()
                : player.crafting?.queue;

        const queueCount =
            Array.isArray(queue)
                ? queue.length
                : 0;

        backgroundWorks.push({
            type: "crafting",
            icon: "⚒️",
            name: "Wytwarzanie",

            details:
                resultItem?.name ||
                recipe?.name ||
                "Aktywna praca",

            queueCount:
                queueCount,

            progress:
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(progress) || 0
                    )
                ),

            remainingSeconds:
                Math.max(
                    0,
                    Number(
                        remainingSeconds
                    ) || 0
                )
        });
    }

    /*
     * ALCHEMIA
     */
    if (
        player.alchemy?.isCrafting
    ) {
        const recipe =
            typeof getAlchemyRecipe ===
                "function"
                ? getAlchemyRecipe(
                    player.alchemy
                        .activeRecipeId
                )
                : null;

        const resultItem =
            recipe &&
            typeof items !==
                "undefined"
                ? items[
                    recipe.resultItemId
                ]
                : null;

        const progress =
            typeof getAlchemyCraftingProgressPercent ===
                "function"
                ? getAlchemyCraftingProgressPercent()
                : 0;

        const remainingSeconds =
            typeof getAlchemyTotalQueueRemainingSeconds ===
                "function"
                ? getAlchemyTotalQueueRemainingSeconds()
                : (
                    typeof getAlchemyTimeRemainingSeconds ===
                        "function"
                        ? getAlchemyTimeRemainingSeconds()
                        : 0
                );

        /*
         * Aktywna mikstura nie znajduje się
         * już w tablicy queue, dlatego
         * dodajemy do liczby kolejki 1.
         */
        const waitingCount =
            Array.isArray(
                player.alchemy.queue
            )
                ? player.alchemy
                    .queue.length
                : 0;

        backgroundWorks.push({
            type: "alchemy",
            icon: "🧪",
            name: "Alchemia",

            details:
                resultItem?.name ||
                recipe?.name ||
                "Warzenie mikstury",

            queueCount:
                waitingCount + 1,

            progress:
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(progress) || 0
                    )
                ),

            remainingSeconds:
                Math.max(
                    0,
                    Number(
                        remainingSeconds
                    ) || 0
                )
        });
    }

    return backgroundWorks;
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
        player.fishing &&
        player.fishing.isFishing
    ) {
        const fishingArea =
            typeof getFishingArea ===
                "function"
                ? getFishingArea(
                    player.fishing.activeAreaId
                )
                : null;
        const progress =
            typeof getFishingProgressPercent ===
                "function"
                ? getFishingProgressPercent()
                : 0;
        const timeRemaining =
            getFishingTimeRemaining();

        return {
            type: "fishing",
            icon: "🎣",
            name: "Łowienie",
            details:
                (fishingArea?.name ||
                    "Nieznane łowisko") +
                " — postęp " +
                Math.floor(progress) +
                "%",
            timeText:
                timeRemaining > 0
                    ? timeRemaining + " s"
                    : "Branie..."
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

