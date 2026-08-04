const MINIMUM_OFFLINE_SUMMARY_DURATION_MS =
    60 * 1000;

function shouldDisplayOfflineSummary(
    summary,
    offlineSeconds = 0
) {
    if (
        !summary ||
        !Array.isArray(summary.sections) ||
        summary.sections.length === 0
    ) {
        return false;
    }

    const summaryDuration = Math.max(
        0,
        Number(
            summary.durationMilliseconds
        ) || 0
    );

    const fallbackDuration = Math.max(
        0,
        Number(offlineSeconds) || 0
    ) * 1000;

    return Math.max(
        summaryDuration,
        fallbackDuration
    ) >= MINIMUM_OFFLINE_SUMMARY_DURATION_MS;
}

function simulateOfflineProgress(
    offlineSeconds,
    activityType =
        getCurrentActivityTypeForSave(),
    offlineStartedAt =
        Date.now() -
        offlineSeconds * 1000
) {
    const offlineFinishedAt =
        Date.now();

    let activitySummary = null;

    if (
        activityType === "mining" &&
        typeof processOfflineMiningProgress ===
        "function"
    ) {
        activitySummary = processOfflineMiningProgress(
            offlineStartedAt,
            offlineFinishedAt
        );
    }

    if (
        activityType === "herbalism" &&
        typeof processOfflineHerbalismProgress ===
        "function"
    ) {
        activitySummary = processOfflineHerbalismProgress(
            offlineStartedAt,
            offlineFinishedAt
        );
    }

    if (
        activityType === "fishing" &&
        typeof processOfflineFishingProgress ===
        "function"
    ) {
        activitySummary = processOfflineFishingProgress(
            offlineStartedAt,
            offlineFinishedAt
        );
    }


    if (
        activityType === "combat" &&
        typeof processOfflineCombatProgress ===
        "function"
    ) {
        activitySummary = processOfflineCombatProgress(
            offlineStartedAt,
            offlineFinishedAt
        );
    }

    const alchemySummary =
        typeof processOfflineAlchemyProgress ===
            "function"
            ? processOfflineAlchemyProgress(
                offlineStartedAt,
                offlineFinishedAt
            )
            : null;
    const craftingSummary =
        typeof processOfflineCraftingProgress ===
            "function"
            ? processOfflineCraftingProgress(
                offlineStartedAt,
                offlineFinishedAt
            )
            : null;

    const summaries = [
        activitySummary,
        alchemySummary,
        craftingSummary
    ].filter(summary => {
        return (
            summary &&
            Array.isArray(summary.sections) &&
            summary.sections.length > 0
        );
    });

    if (summaries.length === 0) {
        return null;
    }

    return {
        durationMilliseconds:
            Math.max(
                0,
                ...summaries.map(
                    summary => {
                        return Number(
                            summary.durationMilliseconds
                        ) || 0;
                    }
                )
            ),
        sections: summaries.flatMap(
            summary => {
                return summary.sections;
            }
        )
    };
}
