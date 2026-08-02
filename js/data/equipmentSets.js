const equipmentSetDefinitions = [
    {
        id: "wilds_set",
        name: "Rynsztunek ostępów",
        icon: "🌿",
        theme: "wilds",
        itemIds: [
            "bark_shield",
            "beetle_helmet",
            "wolf_armor",
            "tracker_pants",
            "wolf_boots",
            "wolf_gloves"
        ],
        thresholds: [
            {
                pieces: 3,
                name: "Leśny kamuflaż",
                description: "+3% pancerza",
                bonuses: {
                    armorPercent: 3
                }
            },
            {
                pieces: 6,
                name: "Instynkt przetrwania",
                description:
                    "+4% maks. HP, +1 p.p. szansy na unik i +8% szybkości zielarstwa",
                bonuses: {
                    maxHpPercent: 4,
                    dodgeChance: 1,
                    herbalismSpeedPercent: 8
                }
            }
        ]
    },
    {
        id: "kobold_set",
        name: "Rynsztunek koboldów",
        icon: "👺",
        theme: "kobold",
        itemIds: [
            "kobold_shield",
            "kobold_helmet",
            "kobold_armor",
            "kobold_pants",
            "kobold_boots",
            "kobold_gloves"
        ],
        thresholds: [
            {
                pieces: 3,
                name: "Jaskiniowy szyk",
                description: "+5% pancerza",
                bonuses: {
                    armorPercent: 5
                }
            },
            {
                pieces: 6,
                name: "Podstępna zgraja",
                description:
                    "+7% maks. HP, +2 p.p. szansy na trafienie krytyczne i +8% szybkości kopania",
                bonuses: {
                    maxHpPercent: 7,
                    critChance: 2,
                    miningSpeedPercent: 8
                }
            }
        ]
    },
    {
        id: "guardian_set",
        name: "Rynsztunek strażnika",
        icon: "🪨",
        theme: "guardian",
        itemIds: [
            "guardian_shield",
            "guardian_helmet",
            "guardian_armor",
            "guardian_pants",
            "guardian_boots",
            "guardian_gloves"
        ],
        thresholds: [
            {
                pieces: 3,
                name: "Kamienna osłona",
                description: "+7% pancerza",
                bonuses: {
                    armorPercent: 7
                }
            },
            {
                pieces: 6,
                name: "Niewzruszona straż",
                description:
                    "+9% maks. HP, +3 p.p. szansy na unik i +8% szansy na łup z polowania",
                bonuses: {
                    maxHpPercent: 9,
                    dodgeChance: 3,
                    huntingLootBonusPercent: 8
                }
            }
        ]
    },
    {
        id: "commander_set",
        name: "Rynsztunek dowódcy",
        icon: "🛡️",
        theme: "commander",
        itemIds: [
            "commander_shield",
            "commander_helmet",
            "commander_armor",
            "commander_pants",
            "commander_boots",
            "commander_gloves"
        ],
        thresholds: [
            {
                pieces: 3,
                name: "Żelazna dyscyplina",
                description: "+10% pancerza",
                bonuses: {
                    armorPercent: 10
                }
            },
            {
                pieces: 6,
                name: "Niezłomny szyk",
                description:
                    "+12% maks. HP i +4 p.p. szansy na unik",
                uniqueEffect: {
                    id: "commander_unyielding_defense",
                    name: "Niezłomna obrona",
                    description:
                        "Po spadku poniżej 35% HP otrzymujesz o 20% mniej obrażeń przez 3 ataki przeciwnika (raz na walkę).",
                    hpThresholdPercent: 35,
                    damageReductionPercent: 20,
                    hitCount: 3
                },
                bonuses: {
                    maxHpPercent: 12,
                    dodgeChance: 4
                }
            }
        ]
    },
    {
        id: "dragon_set",
        name: "Smoczy rynsztunek",
        icon: "🐉",
        theme: "dragon",
        itemIds: [
            "dragon_shield",
            "dragon_helmet",
            "dragon_armor",
            "dragon_pants",
            "dragon_boots",
            "dragon_gloves"
        ],
        thresholds: [
            {
                pieces: 3,
                name: "Smocze łuski",
                description: "+15% pancerza",
                bonuses: {
                    armorPercent: 15
                }
            },
            {
                pieces: 6,
                name: "Serce pradawnego smoka",
                description:
                    "+18% maks. HP i +6 p.p. szansy na trafienie krytyczne",
                uniqueEffect: {
                    id: "dragon_wrath_burn",
                    name: "Smoczy gniew",
                    description:
                        "Trafienia krytyczne podpalają przeciwnika na 3 tury, zadając co turę 15% obrażeń trafienia krytycznego.",
                    damagePercentPerTick: 15,
                    tickCount: 3
                },
                bonuses: {
                    maxHpPercent: 18,
                    critChance: 6
                }
            }
        ]
    }
];

function getEquipmentSetDefinition(setId) {
    return (
        equipmentSetDefinitions.find(definition => {
            return definition.id === setId;
        }) || null
    );
}

function getEquipmentSetForItemId(itemId) {
    return (
        equipmentSetDefinitions.find(definition => {
            return definition.itemIds.includes(itemId);
        }) || null
    );
}

function getEquippedEquipmentSetPieceIds(
    definition,
    equipment = player.equipment
) {
    if (
        !definition ||
        !equipment ||
        typeof equipment !== "object"
    ) {
        return [];
    }

    const equippedItemIds = new Set(
        Object.values(equipment).filter(Boolean)
    );

    return definition.itemIds.filter(itemId => {
        return equippedItemIds.has(itemId);
    });
}

function getEquipmentSetProgress(
    definition,
    equipment = player.equipment
) {
    const equippedItemIds =
        getEquippedEquipmentSetPieceIds(
            definition,
            equipment
        );

    return {
        definition,
        equippedItemIds,
        equippedPieces: equippedItemIds.length,
        totalPieces: definition?.itemIds?.length || 0,
        thresholds: (definition?.thresholds || []).map(
            threshold => {
                return {
                    ...threshold,
                    active:
                        equippedItemIds.length >=
                        threshold.pieces
                };
            }
        )
    };
}

function getActiveEquipmentSetBonuses(
    equipment = player.equipment
) {
    const bonuses = {
        maxHpPercent: 0,
        armorPercent: 0,
        dodgeChance: 0,
        critChance: 0,
        miningSpeedPercent: 0,
        herbalismSpeedPercent: 0,
        huntingLootBonusPercent: 0
    };

    equipmentSetDefinitions.forEach(definition => {
        const progress =
            getEquipmentSetProgress(
                definition,
                equipment
            );

        progress.thresholds.forEach(threshold => {
            if (!threshold.active) {
                return;
            }

            Object.keys(bonuses).forEach(bonusKey => {
                bonuses[bonusKey] += Math.max(
                    0,
                    Number(
                        threshold.bonuses?.[bonusKey]
                    ) || 0
                );
            });
        });
    });

    return bonuses;
}

function getActiveEquipmentSetActivityBonus(
    bonusKey,
    equipment = player.equipment
) {
    const supportedBonusKeys = [
        "miningSpeedPercent",
        "herbalismSpeedPercent",
        "huntingLootBonusPercent"
    ];

    if (!supportedBonusKeys.includes(bonusKey)) {
        return 0;
    }

    return Math.max(
        0,
        Number(
            getActiveEquipmentSetBonuses(
                equipment
            )[bonusKey]
        ) || 0
    );
}

function getEquipmentSetThresholdFullDescription(
    threshold
) {
    if (!threshold) {
        return "";
    }

    const descriptions = [
        threshold.description
    ].filter(Boolean);

    if (threshold.uniqueEffect) {
        descriptions.push(
            threshold.uniqueEffect.name +
            ": " +
            threshold.uniqueEffect.description
        );
    }

    return descriptions.join(" · ");
}

function getActiveEquipmentSetUniqueEffect(
    effectId,
    equipment = player.equipment
) {
    const activeThreshold =
        getActiveEquipmentSetThresholds(
            equipment
        ).find(entry => {
            return (
                entry.threshold
                    .uniqueEffect?.id ===
                effectId
            );
        });

    return activeThreshold
        ? activeThreshold.threshold
            .uniqueEffect
        : null;
}

function getActiveEquipmentSetThresholds(
    equipment = player.equipment
) {
    return equipmentSetDefinitions.flatMap(
        definition => {
            const progress =
                getEquipmentSetProgress(
                    definition,
                    equipment
                );

            return progress.thresholds
                .filter(threshold => {
                    return threshold.active;
                })
                .map(threshold => {
                    return {
                        id:
                            definition.id +
                            ":" +
                            threshold.pieces,
                        definition,
                        threshold,
                        equippedPieces:
                            progress.equippedPieces,
                        totalPieces:
                            progress.totalPieces
                    };
                });
        }
    );
}

function getEquipmentSetThresholdChanges(
    previousEquipment,
    nextEquipment
) {
    const previousThresholds =
        getActiveEquipmentSetThresholds(
            previousEquipment
        );
    const nextThresholds =
        getActiveEquipmentSetThresholds(
            nextEquipment
        );
    const previousIds = new Set(
        previousThresholds.map(entry => {
            return entry.id;
        })
    );
    const nextIds = new Set(
        nextThresholds.map(entry => {
            return entry.id;
        })
    );

    return {
        activated:
            nextThresholds.filter(entry => {
                return !previousIds.has(
                    entry.id
                );
            }),
        deactivated:
            previousThresholds.filter(entry => {
                return !nextIds.has(
                    entry.id
                );
            })
    };
}

function notifyEquipmentSetThresholdChanges(
    previousEquipment,
    nextEquipment
) {
    const changes =
        getEquipmentSetThresholdChanges(
            previousEquipment,
            nextEquipment
        );

    changes.activated.forEach(entry => {
        const message =
            entry.definition.icon +
            " Aktywowano: " +
            entry.threshold.name +
            " — " +
            getEquipmentSetThresholdFullDescription(
                entry.threshold
            );

        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                message,
                "success"
            );
        }

        if (
            typeof addSystemLog ===
            "function"
        ) {
            addSystemLog(
                message +
                " (" +
                entry.definition.name +
                ")",
                "equipment"
            );
        }
    });

    changes.deactivated.forEach(entry => {
        const message =
            entry.definition.icon +
            " Utracono premię: " +
            entry.threshold.name +
            " — " +
            getEquipmentSetThresholdFullDescription(
                entry.threshold
            );

        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                message,
                "warning"
            );
        }

        if (
            typeof addSystemLog ===
            "function"
        ) {
            addSystemLog(
                message +
                " (" +
                entry.definition.name +
                ")",
                "equipment"
            );
        }
    });

    return changes;
}
