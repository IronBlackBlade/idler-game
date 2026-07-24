function ensureJournalState() {
    if (
        !player.journal ||
        typeof player.journal !==
            "object"
    ) {
        player.journal = {};
    }

    if (
        !player.journal.bestiary ||
        typeof player.journal.bestiary !==
            "object"
    ) {
        player.journal.bestiary = {};
    }
player.journal.achievementPoints =
    Math.max(
        0,
        Math.floor(
            Number(
                player.journal
                    .achievementPoints
            ) || 0
        )
    );

player.journal.totalAchievementPoints =
    Math.max(
        player.journal
            .achievementPoints,

        Math.floor(
            Number(
                player.journal
                    .totalAchievementPoints
            ) || 0
        )
    );

if (
    !player.journal
        .unlockedAchievements ||
    typeof player.journal
        .unlockedAchievements !==
        "object" ||
    Array.isArray(
        player.journal
            .unlockedAchievements
    )
) {
    player.journal
        .unlockedAchievements = {};
}
    return player.journal;
}

function getJournalBestiaryCounter(
    entry,
    counterName
) {
    return Math.max(
        0,
        Math.floor(
            Number(
                entry?.[counterName]
            ) || 0
        )
    );
}

function createDefaultBestiaryEntry(
    enemyData,
    locationId
) {
    return {
        enemyId: enemyData.id,

        name:
            enemyData.baseName ||
            enemyData.name ||
            enemyData.id,

        encountered: true,

        locationIds: locationId
            ? [locationId]
            : [],

        kills: 0,

        normalKills: 0,
        strongKills: 0,
        eliteKills: 0,
        bossKills: 0,

        discoveredLoot: []
    };
}

function ensureBestiaryEntry(
    enemyData,
    locationId = player.location
) {
    if (
        !enemyData ||
        !enemyData.id
    ) {
        return null;
    }

    const journal =
        ensureJournalState();

    if (
        !journal.bestiary[
            enemyData.id
        ]
    ) {
        journal.bestiary[
            enemyData.id
        ] =
            createDefaultBestiaryEntry(
                enemyData,
                locationId
            );
    }

    const entry =
        journal.bestiary[
            enemyData.id
        ];

    entry.enemyId =
        enemyData.id;

    entry.name =
        enemyData.baseName ||
        enemyData.name ||
        entry.name ||
        enemyData.id;

    entry.encountered = true;

    if (
        !Array.isArray(
            entry.locationIds
        )
    ) {
        entry.locationIds = [];
    }

    if (
        locationId &&
        !entry.locationIds.includes(
            locationId
        )
    ) {
        entry.locationIds.push(
            locationId
        );
    }

    const counterNames = [
        "kills",
        "normalKills",
        "strongKills",
        "eliteKills",
        "bossKills"
    ];

    counterNames.forEach(
        counterName => {
            entry[counterName] =
                Math.max(
                    0,
                    Math.floor(
                        Number(
                            entry[
                                counterName
                            ]
                        ) || 0
                    )
                );
        }
    );

    if (
        !Array.isArray(
            entry.discoveredLoot
        )
    ) {
        entry.discoveredLoot = [];
    }

    return entry;
}

function recordBestiaryEncounter(
    enemyData,
    locationId = player.location
) {
    const entry =
        ensureBestiaryEntry(
            enemyData,
            locationId
        );

    if (
        typeof refreshBestiaryInterface ===
            "function"
    ) {
        refreshBestiaryInterface();
    }

    return entry;
}

function recordBestiaryKills(
    enemyData,
    encounterType = "normal",
    quantity = 1,
    locationId = player.location
) {
    const entry =
        ensureBestiaryEntry(
            enemyData,
            locationId
        );

    if (!entry) {
        return;
    }

    const safeQuantity =
        Math.max(
            0,
            Math.floor(
                Number(quantity) || 0
            )
        );

    if (safeQuantity <= 0) {
        return;
    }

    const counterByEncounterType = {
        normal: "normalKills",
        strong: "strongKills",
        elite: "eliteKills",
        boss: "bossKills"
    };

    const safeEncounterType =
        counterByEncounterType[
            encounterType
        ]
            ? encounterType
            : "normal";

    const counterName =
        counterByEncounterType[
            safeEncounterType
        ];

    entry.kills +=
        safeQuantity;

    entry[counterName] +=
        safeQuantity;

    if (
        typeof refreshBestiaryInterface ===
            "function"
    ) {
        refreshBestiaryInterface();
    }
}

function recordBestiaryKill(
    enemyData,
    encounterType = "normal",
    locationId = player.location
) {
    recordBestiaryKills(
        enemyData,
        encounterType,
        1,
        locationId
    );
}

function recordBestiaryLootDiscovery(
    enemyData,
    itemId,
    locationId = player.location
) {
    if (
        !enemyData ||
        !enemyData.id ||
        !itemId
    ) {
        return false;
    }

    const entry =
        ensureBestiaryEntry(
            enemyData,
            locationId
        );

    if (!entry) {
        return false;
    }

    if (
        entry.discoveredLoot.includes(
            itemId
        )
    ) {
        return false;
    }

    entry.discoveredLoot.push(
        itemId
    );

    if (
        typeof refreshBestiaryInterface ===
            "function"
    ) {
        refreshBestiaryInterface();
    }

    return true;
}

ensureJournalState();