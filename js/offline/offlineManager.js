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

    if (
        activityType === "mining" &&
        typeof processOfflineMiningProgress ===
        "function"
    ) {
        return processOfflineMiningProgress(
            offlineStartedAt,
            offlineFinishedAt
        );
    }

    if (
        activityType === "herbalism" &&
        typeof processOfflineHerbalismProgress ===
        "function"
    ) {
        return processOfflineHerbalismProgress(
            offlineStartedAt,
            offlineFinishedAt
        );
    }

    if (
        activityType === "fishing" &&
        typeof processOfflineFishingProgress ===
        "function"
    ) {
        return processOfflineFishingProgress(
            offlineStartedAt,
            offlineFinishedAt
        );
    }

    if (
        activityType === "alchemy" &&
        typeof processOfflineAlchemyProgress ===
        "function"
    ) {
        return processOfflineAlchemyProgress(
            offlineStartedAt,
            offlineFinishedAt
        );
    }

    if (
        activityType === "combat" &&
        typeof processOfflineCombatProgress ===
        "function"
    ) {
        return processOfflineCombatProgress(
            offlineStartedAt,
            offlineFinishedAt
        );
    }

    return null;
}
