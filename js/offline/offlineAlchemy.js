function getOfflineAlchemyCraftingDuration(
    recipe
) {
    return Math.max(
        1000,
        (
            Number(
                recipe
                    ?.craftingDurationSeconds
            ) || 60
        ) * 1000
    );
}

function processOfflineAlchemyProgress(
    savedAt,
    currentTime = Date.now()
) {
    ensureAlchemyState();

    if (
        !player.alchemy.isCrafting ||
        !player.alchemy.activeRecipeId
    ) {
        return null;
    }

    const safeCurrentTime =
        Number(currentTime) ||
        Date.now();

    const safeSavedAt = Math.min(
        safeCurrentTime,
        Number(savedAt) ||
        safeCurrentTime
    );

    const activeRecipe =
        getAlchemyRecipe(
            player.alchemy
                .activeRecipeId
        );

    if (!activeRecipe) {
        return null;
    }

    const recipeDuration =
        getOfflineAlchemyCraftingDuration(
            activeRecipe
        );

    const activeDuration = Math.max(
        1000,
        Number(
            player.alchemy
                .craftingDurationMs
        ) || recipeDuration
    );

    const storedStartedAt =
        Number(
            player.alchemy
                .craftingStartedAt
        );

    const activeStartedAt =
        storedStartedAt > 0
            ? Math.min(
                storedStartedAt,
                safeCurrentTime
            )
            : safeSavedAt;

    const storedFinishesAt =
        Number(
            player.alchemy
                .craftingFinishesAt
        );

    const activeFinishesAt =
        storedFinishesAt >
            activeStartedAt
            ? storedFinishesAt
            : activeStartedAt +
            activeDuration;

    player.alchemy.craftingStartedAt =
        activeStartedAt;

    player.alchemy.craftingDurationMs =
        activeDuration;

    player.alchemy.craftingFinishesAt =
        activeFinishesAt;

    /*
     * Pierwsza mikstura nadal się warzy.
     * Niczego jeszcze nie przyznajemy.
     */
    if (
        activeFinishesAt >
        safeCurrentTime
    ) {
        return null;
    }

    const completedJobs = [
        {
            recipe: activeRecipe,
            completedAt:
                activeFinishesAt
        }
    ];

    let queueTimeline =
        activeFinishesAt;

    let nextActiveJob = null;

    while (
        player.alchemy.queue.length > 0
    ) {
        const queuedJob =
            player.alchemy.queue.shift();

        const queuedRecipe =
            getAlchemyRecipe(
                queuedJob.recipeId
            );

        if (!queuedRecipe) {
            continue;
        }

        const queuedDuration =
            getOfflineAlchemyCraftingDuration(
                queuedRecipe
            );

        const queuedFinishesAt =
            queueTimeline +
            queuedDuration;

        /*
         * Na tę miksturę nie wystarczyło
         * już czasu. Zostaje aktywna.
         */
        if (
            queuedFinishesAt >
            safeCurrentTime
        ) {
            nextActiveJob = {
                job: queuedJob,
                recipe: queuedRecipe,
                startedAt:
                    queueTimeline,
                duration:
                    queuedDuration,
                finishesAt:
                    queuedFinishesAt
            };

            break;
        }

        completedJobs.push({
            recipe: queuedRecipe,
            completedAt:
                queuedFinishesAt
        });

        queueTimeline =
            queuedFinishesAt;
    }

    if (nextActiveJob) {
        player.alchemy.isCrafting =
            true;

        player.alchemy.activeJobId =
            nextActiveJob.job.id;

        player.alchemy.activeRecipeId =
            nextActiveJob.recipe.id;

        player.alchemy
            .craftingQuantity = 1;

        player.alchemy
            .craftingStartedAt =
            nextActiveJob.startedAt;

        player.alchemy
            .craftingDurationMs =
            nextActiveJob.duration;

        player.alchemy
            .craftingFinishesAt =
            nextActiveJob.finishesAt;
    } else {
        /*
         * Cała kolejka została ukończona.
         */
        clearAlchemyCraftingState();
    }

    /*
     * Łączymy identyczne mikstury,
     * żeby modal nie pokazywał ich
     * w wielu osobnych wierszach.
     */
    const rewardTotals =
        new Map();

    let totalAlchemyExp = 0;
    let totalResultItems = 0;

    completedJobs.forEach(
        completedJob => {
            const recipe =
                completedJob.recipe;

            const resultQuantity =
                Math.max(
                    1,
                    Math.floor(
                        Number(
                            recipe
                                .resultQuantity
                        ) || 1
                    )
                );

            const existingReward =
                rewardTotals.get(
                    recipe.resultItemId
                ) || {
                    itemId:
                        recipe.resultItemId,
                    quantity: 0
                };

            existingReward.quantity +=
                resultQuantity;

            rewardTotals.set(
                recipe.resultItemId,
                existingReward
            );

            totalResultItems +=
                resultQuantity;

            totalAlchemyExp +=
                getAlchemyRecipeExp(
                    recipe
                );
        }
    );

    const rewards =
        Array.from(
            rewardTotals.values()
        );

    rewards.forEach(reward => {
        addItemToInventory(
            reward.itemId,
            reward.quantity
        );
    });

    const levelBefore =
        player.alchemy.level;

    addAlchemyExp(totalAlchemyExp);

    const lastCompletedJob =
        completedJobs[
        completedJobs.length - 1
        ];

    const lastRecipe =
        lastCompletedJob.recipe;

    player.alchemy.lastResult = {
        time:
            lastCompletedJob.completedAt,

        recipeId:
            lastRecipe.id,

        resultItemId:
            lastRecipe.resultItemId,

        resultQuantity:
            Math.max(
                1,
                Math.floor(
                    Number(
                        lastRecipe
                            .resultQuantity
                    ) || 1
                )
            ),

        alchemyExp:
            getAlchemyRecipeExp(
                lastRecipe
            )
    };

    const summaryStats = [
        {
            label:
                "Ukończone warzenia",

            value:
                completedJobs.length
        },
        {
            label: "EXP alchemii",
            value: totalAlchemyExp,
            prefix: "+"
        },
        {
            label:
                "Uwarzone mikstury",

            value: totalResultItems,
            prefix: "+"
        }
    ];

    const remainingJobs =
        player.alchemy.queue.length +
        (
            player.alchemy.isCrafting
                ? 1
                : 0
        );

    if (remainingJobs > 0) {
        summaryStats.push({
            label:
                "Pozostało w kolejce",

            value: remainingJobs
        });
    }

    if (
        player.alchemy.level >
        levelBefore
    ) {
        summaryStats.push({
            label:
                "Nowy poziom alchemii",

            value:
                player.alchemy.level
        });
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "🌙 Alchemia offline: ukończono " +
            completedJobs.length +
            " warzeń, uwarzono " +
            totalResultItems +
            " mikstur i zdobyto " +
            totalAlchemyExp +
            " EXP alchemii.",
            "offline"
        );
    }

    return {
        durationMilliseconds:
            Math.max(
                0,
                safeCurrentTime -
                safeSavedAt
            ),

        sections: [
            {
                icon: "🧪",
                title: "Alchemia",
                stats: summaryStats,
                items: rewards
            }
        ]
    };
}