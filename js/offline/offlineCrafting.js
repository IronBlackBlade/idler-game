function addOfflineCraftingTotal(
    totals,
    itemId,
    quantity
) {
    const safeQuantity = Math.max(
        0,
        Math.floor(
            Number(quantity) || 0
        )
    );

    if (!itemId || safeQuantity <= 0) {
        return;
    }

    totals.set(
        itemId,
        (
            totals.get(itemId) || 0
        ) + safeQuantity
    );
}

function processOfflineCraftingProgress(
    savedAt,
    currentTime = Date.now()
) {
    if (
        typeof ensureCraftingState !==
            "function" ||
        typeof getActiveCraftingQueueJob !==
            "function" ||
        typeof completeCraftingQueueCycle !==
            "function"
    ) {
        return null;
    }

    ensureCraftingState();

    const safeCurrentTime = Math.max(
        0,
        Number(currentTime) || Date.now()
    );

    const safeSavedAt = Math.min(
        safeCurrentTime,
        Math.max(
            0,
            Number(savedAt) ||
                safeCurrentTime
        )
    );

    if (
        !Array.isArray(player.crafting.queue) ||
        player.crafting.queue.length === 0
    ) {
        return null;
    }

    const rewardTotals = new Map();
    const refundedMaterialTotals =
        new Map();

    const levelBefore =
        player.crafting.level;

    let completedCraftCount = 0;
    let completedJobCount = 0;
    let totalCraftingExp = 0;
    let processedJobs = 0;

    /*
     * Kolejka ma maksymalnie dziesięć
     * pozycji. Limit chroni zapis przed
     * nieskończoną pętlą, gdyby stary
     * lub uszkodzony zapis zawierał
     * niepoprawne dane czasu.
     */
    const processingLimit = Math.max(
        10,
        player.crafting.queue.length + 1
    );

    while (processedJobs < processingLimit) {
        const activeJob =
            getActiveCraftingQueueJob();

        if (!activeJob) {
            break;
        }

        const cycleNotStarted =
            activeJob.cycleStartedAt <= 0 ||
            activeJob.cycleFinishesAt <= 0;

        if (cycleNotStarted) {
            startNextCraftingQueueJob(
                safeSavedAt,
                {
                    persist: false
                }
            );
        }

        const dueCycleCount =
            getDueCraftingCycleCount(
                activeJob,
                safeCurrentTime
            );

        if (dueCycleCount <= 0) {
            break;
        }

        const cycleResult =
            completeCraftingQueueCycle(
                activeJob,
                dueCycleCount,
                {
                    notify: false,
                    persist: false,
                    render: false
                }
            );

        if (!cycleResult) {
            break;
        }

        completedCraftCount +=
            cycleResult.completedCycleCount;

        if (cycleResult.jobFinished) {
            completedJobCount++;
        }

        const completionResult =
            cycleResult.completionResult || {};

        totalCraftingExp += Math.max(
            0,
            Number(
                completionResult.finalCraftingExp
            ) || 0
        );

        addOfflineCraftingTotal(
            rewardTotals,
            cycleResult.resultItemId,
            completionResult.resultQuantity
        );

        const refundedMaterials =
            Array.isArray(
                completionResult.refundedMaterials
            )
                ? completionResult.refundedMaterials
                : [];

        refundedMaterials.forEach(
            material => {
                addOfflineCraftingTotal(
                    refundedMaterialTotals,
                    material.itemId,
                    material.quantity
                );
            }
        );

        processedJobs++;

        if (!cycleResult.jobFinished) {
            break;
        }
    }

    if (completedCraftCount <= 0) {
        return null;
    }

    const rewards = Array.from(
        rewardTotals.entries()
    ).map(([itemId, quantity]) => {
        return {
            itemId,
            quantity
        };
    });

    const refundedMaterialCount =
        Array.from(
            refundedMaterialTotals.values()
        ).reduce(
            (total, quantity) => {
                return total + quantity;
            },
            0
        );

    const remainingCraftCount =
        player.crafting.queue.reduce(
            (total, job) => {
                return total + Math.max(
                    0,
                    (
                        Number(job.totalCraftCount) ||
                        0
                    ) -
                    (
                        Number(job.completedCraftCount) ||
                        0
                    )
                );
            },
            0
        );

    const summaryStats = [
        {
            label: "Wytworzone sztuki",
            value: completedCraftCount
        },
        {
            label: "Ukończone zadania",
            value: completedJobCount
        },
        {
            label: "EXP wytwarzania",
            value: totalCraftingExp,
            prefix: "+"
        }
    ];

    if (refundedMaterialCount > 0) {
        summaryStats.push({
            label: "Odzyskane materiały",
            value: refundedMaterialCount,
            prefix: "+"
        });
    }

    if (remainingCraftCount > 0) {
        summaryStats.push({
            label:
                "Pozostało do wytworzenia",
            value: remainingCraftCount
        });
    }

    if (
        player.crafting.level >
        levelBefore
    ) {
        summaryStats.push({
            label:
                "Nowy poziom wytwarzania",
            value:
                player.crafting.level
        });
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "🌙 Wytwarzanie offline: wykonano " +
            completedCraftCount +
            " szt., ukończono " +
            completedJobCount +
            " zadań i zdobyto " +
            totalCraftingExp +
            " EXP wytwarzania.",
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
                icon: "🛠️",
                title: "Wytwarzanie",
                stats: summaryStats,
                items: rewards
            }
        ]
    };
}
