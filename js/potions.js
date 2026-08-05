const MAX_POTION_EFFECT_DURATION_MS =
    8 * 60 * 60 * 1000;

const AUTO_HEALING_COOLDOWN_MS =
    25 * 1000;
const AUTO_HEALING_STRONGEST_MODE =
    "__strongest_available__";

const AUTO_HEALING_THRESHOLDS = [
    30,
    40,
    50
];

function getDefaultAutoHealingState() {
    return {
        selectedPotionId: null,
        thresholdPercent: 40,
        cooldownUntil: 0
    };
}

function ensureAutoHealingState() {
    if (
        !player.autoHealing ||
        typeof player.autoHealing !==
        "object"
    ) {
        player.autoHealing =
            getDefaultAutoHealingState();
    }

    const selectedPotionId =
        typeof player.autoHealing
            .selectedPotionId ===
            "string"
            ? player.autoHealing
                .selectedPotionId
            : null;

    const automaticModeSelected =
        selectedPotionId ===
        AUTO_HEALING_STRONGEST_MODE;

    const selectedPotion =
        selectedPotionId &&
            !automaticModeSelected
            ? items[selectedPotionId]
            : null;

    if (
        selectedPotionId &&
        !automaticModeSelected &&
        (
            !selectedPotion ||
            selectedPotion.type !==
            "potion" ||
            Number(
                selectedPotion
                    .healingPercent
            ) <= 0
        )
    ) {
        player.autoHealing
            .selectedPotionId =
            null;
    }

    const thresholdPercent =
        Number(
            player.autoHealing
                .thresholdPercent
        );

    if (
        !AUTO_HEALING_THRESHOLDS
            .includes(
                thresholdPercent
            )
    ) {
        player.autoHealing
            .thresholdPercent = 40;
    }

    player.autoHealing.cooldownUntil =
        Math.max(
            0,
            Number(
                player.autoHealing
                    .cooldownUntil
            ) || 0
        );
}

function getHealingPotionItems() {
    if (
        typeof items ===
        "undefined"
    ) {
        return [];
    }

    return Object.values(
        items
    )
        .filter(item => {
            return (
                item?.type ===
                "potion" &&
                Number(
                    item.healingPercent
                ) > 0
            );
        })
        .sort(
            (
                firstPotion,
                secondPotion
            ) => {
                return (
                    Number(
                        firstPotion
                            .healingPercent
                    ) -
                    Number(
                        secondPotion
                            .healingPercent
                    )
                );
            }
        );
}

function getStrongestAvailableHealingPotion() {
    const healingPotions =
        getHealingPotionItems();

    return healingPotions
        .filter(potionItem => {
            return (
                getInventoryItemQuantity(
                    potionItem.id
                ) > 0
            );
        })
        .sort(
            (
                firstPotion,
                secondPotion
            ) => {
                return (
                    Number(
                        secondPotion
                            .healingPercent
                    ) -
                    Number(
                        firstPotion
                            .healingPercent
                    )
                );
            }
        )[0] || null;
}

function getSelectedAutoHealingPotion() {
    ensureAutoHealingState();

    const selectedPotionId =
        player.autoHealing
            .selectedPotionId;

    if (
        selectedPotionId ===
        AUTO_HEALING_STRONGEST_MODE
    ) {
        return (
            getStrongestAvailableHealingPotion()
        );
    }

    const potionItem =
        selectedPotionId
            ? items[selectedPotionId]
            : null;

    if (
        !potionItem ||
        potionItem.type !==
        "potion" ||
        Number(
            potionItem
                .healingPercent
        ) <= 0
    ) {
        return null;
    }

    return potionItem;
}

function getAutoHealingCooldownSecondsLeft() {
    ensureAutoHealingState();

    return Math.max(
        0,
        Math.ceil(
            (
                player.autoHealing
                    .cooldownUntil -
                Date.now()
            ) /
            1000
        )
    );
}

function isAutoHealingConfigurationLocked() {
    return (
        player.isFighting ===
        true ||
        (
            typeof isFighting !==
            "undefined" &&
            isFighting === true
        )
    );
}

function setAutoHealingPotion(
    potionItemId
) {
    ensureAutoHealingState();

    const strongestModeSelected =
        potionItemId ===
        AUTO_HEALING_STRONGEST_MODE;

    const potionItem =
        potionItemId &&
            !strongestModeSelected
            ? items[potionItemId]
            : null;

    const validHealingPotion =
        Boolean(
            potionItem &&
            potionItem.type ===
            "potion" &&
            Number(
                potionItem
                    .healingPercent
            ) > 0
        );

    player.autoHealing
        .selectedPotionId =
        strongestModeSelected
            ? AUTO_HEALING_STRONGEST_MODE
            : validHealingPotion
                ? potionItemId
                : null;

    if (
        typeof saveGame ===
        "function"
    ) {
        saveGame();
    }

    if (
        typeof renderAutoHealingPanel ===
        "function"
    ) {
        renderAutoHealingPanel();
    }
}

function setAutoHealingThreshold(
    thresholdPercent
) {
    ensureAutoHealingState();

    if (
        isAutoHealingConfigurationLocked()
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Próg leczenia można zmienić tylko poza walką.",
                "error"
            );
        }

        if (
            typeof renderAutoHealingPanel ===
            "function"
        ) {
            renderAutoHealingPanel();
        }

        return;
    }

    const safeThreshold =
        Number(
            thresholdPercent
        );

    player.autoHealing
        .thresholdPercent =
        AUTO_HEALING_THRESHOLDS
            .includes(
                safeThreshold
            )
            ? safeThreshold
            : 40;

    if (
        typeof saveGame ===
        "function"
    ) {
        saveGame();
    }

    if (
        typeof renderAutoHealingPanel ===
        "function"
    ) {
        renderAutoHealingPanel();
    }
}

function useHealingPotion(
    potionItemId,
    automatic = false
) {
    ensureAutoHealingState();

    const potionItem =
        items[potionItemId];

    if (
        !potionItem ||
        potionItem.type !==
        "potion" ||
        Number(
            potionItem.healingPercent
        ) <= 0
    ) {
        return {
            used: false,
            healing: 0
        };
    }

    /*
     * Mikstura nie może uratować
     * bohatera po śmiertelnym ciosie.
     */
    if (
        Number(player.hp) <= 0
    ) {
        return {
            used: false,
            healing: 0
        };
    }

    const cooldownSeconds =
        getAutoHealingCooldownSecondsLeft();

    if (cooldownSeconds > 0) {
        if (
            !automatic &&
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Mikstura leczenia będzie gotowa za " +
                cooldownSeconds +
                " s.",
                "error"
            );
        }

        return {
            used: false,
            healing: 0
        };
    }

    const inventoryEntry =
        player.inventory.find(
            entry => {
                return (
                    entry.itemId ===
                    potionItemId
                );
            }
        );

    if (
        !inventoryEntry ||
        inventoryEntry.quantity <= 0
    ) {
        if (
            !automatic &&
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Nie posiadasz tej mikstury.",
                "error"
            );
        }

        return {
            used: false,
            healing: 0
        };
    }

    const derived =
        getDerivedStats();

    const maximumHp =
        Math.max(
            1,
            Number(
                derived.maxHp
            ) || 1
        );

    const previousHp =
        Math.max(
            0,
            Number(player.hp) || 0
        );

    if (previousHp >= maximumHp) {
        if (
            !automatic &&
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Bohater ma już pełne zdrowie.",
                "error"
            );
        }

        return {
            used: false,
            healing: 0
        };
    }

    const requestedHealing =
        Math.max(
            1,
            Math.floor(
                maximumHp *
                Number(
                    potionItem
                        .healingPercent
                ) /
                100
            )
        );

    player.hp =
        Math.min(
            maximumHp,
            previousHp +
            requestedHealing
        );

    const actualHealing =
        player.hp -
        previousHp;

    inventoryEntry.quantity -= 1;

    if (
        inventoryEntry.quantity <= 0
    ) {
        player.inventory =
            player.inventory.filter(
                entry => {
                    return (
                        entry.itemId !==
                        potionItemId
                    );
                }
            );
    }

    player.autoHealing
        .cooldownUntil =
        Date.now() +
        AUTO_HEALING_COOLDOWN_MS;

    const remainingQuantity =
        Math.max(
            0,
            Number(
                inventoryEntry.quantity
            ) || 0
        );

    if (
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(
            "🧪 " +
            potionItem.name +
            " przywraca " +
            actualHealing +
            " HP. Pozostało: " +
            remainingQuantity +
            "."
        );
    }

    if (
        !automatic &&
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Przywrócono " +
            actualHealing +
            " HP.",
            "success"
        );
    }

    /*
     * Podczas automatycznej walki
     * zapis wykona battle.js.
     */
    if (
        !automatic &&
        typeof saveGame ===
        "function"
    ) {
        saveGame();
    }

    if (
        !automatic &&
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
    }

    if (
        typeof renderAutoHealingPanel ===
        "function"
    ) {
        renderAutoHealingPanel();
    }

    return {
        used: true,
        healing: actualHealing,
        remainingQuantity:
            remainingQuantity
    };
}

function tryUseAutoHealingPotion() {
    ensureAutoHealingState();

    const potionItem =
        getSelectedAutoHealingPotion();

    const selectedPotionId =
        potionItem?.id || null;

    if (
        !potionItem ||
        !selectedPotionId
    ) {
        return false;
    }

    /*
     * Nie leczymy po śmiertelnym
     * uderzeniu przeciwnika.
     */
    if (
        Number(player.hp) <= 0
    ) {
        return false;
    }

    const derived =
        getDerivedStats();

    const maximumHp =
        Math.max(
            1,
            Number(
                derived.maxHp
            ) || 1
        );

    const currentHpPercent =
        Math.max(
            0,
            Number(player.hp) || 0
        ) /
        maximumHp *
        100;

    if (
        currentHpPercent >
        player.autoHealing
            .thresholdPercent
    ) {
        return false;
    }

    if (
        getAutoHealingCooldownSecondsLeft() >
        0
    ) {
        return false;
    }

    const result =
        useHealingPotion(
            selectedPotionId,
            true
        );

    return result.used === true;
}


function usePotion(potionItemId) {
    const potionItem =
        items[potionItemId];

    if (
        !potionItem ||
        potionItem.type !== "potion"
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Ten przedmiot nie jest miksturą.",
                "error"
            );
        }

        return;
    }

    /*
     * Mikstury lecznicze nie tworzą
     * efektu czasowego.
     */
    if (
        Number(
            potionItem.healingPercent
        ) > 0
    ) {
        useHealingPotion(
            potionItemId,
            false
        );

        return;
    }

    const inventoryEntry =
        player.inventory.find(entry => {
            return (
                entry.itemId ===
                potionItemId
            );
        });

    if (
        !inventoryEntry ||
        inventoryEntry.quantity <= 0
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Nie posiadasz tej mikstury.",
                "error"
            );
        }

        renderInventory();
        return;
    }

    if (!potionItem.potionEffectId) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Ta mikstura nie ma przypisanego efektu.",
                "error"
            );
        }

        return;
    }

    if (
        !player.activeEffects ||
        typeof player.activeEffects !==
        "object"
    ) {
        player.activeEffects = {};
    }

    if (
        !player.activeEffects.potionEffects ||
        typeof player.activeEffects
            .potionEffects !== "object"
    ) {
        player.activeEffects.potionEffects =
            {};
    }

    const currentTime = Date.now();

    const durationSeconds =
        Math.max(
            1,
            Number(
                potionItem.durationSeconds
            ) || 300
        );

    const existingEffect =
        player.activeEffects.potionEffects[
        potionItem.potionEffectId
        ];

    const wasAlreadyActive =
        existingEffect &&
        existingEffect.expiresAt >
        currentTime;

    const newEffectValue =
        Number(
            potionItem.effectValue
        ) || 0;

    const existingEffectValue =
        Number(
            existingEffect?.value
        ) || 0;

    if (
        wasAlreadyActive &&
        existingEffectValue >
        newEffectValue
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Masz już aktywny silniejszy efekt tego rodzaju.",
                "error"
            );
        }

        return;
    }

    const effectWasUpgraded =
        wasAlreadyActive &&
        newEffectValue >
        existingEffectValue;

    const effectCanStack =
        wasAlreadyActive &&
        newEffectValue ===
        existingEffectValue;

    const potionDurationMs =
        durationSeconds * 1000;

    const currentRemainingMs =
        wasAlreadyActive
            ? Math.max(
                0,
                Number(
                    existingEffect.expiresAt
                ) -
                currentTime
            )
            : 0;

    /*
     * Przy pełnych 8 godzinach
     * nie zużywamy kolejnej mikstury.
     */
    if (
        effectCanStack &&
        currentRemainingMs >=
        MAX_POTION_EFFECT_DURATION_MS
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Ten efekt ma już maksymalny czas działania: 8 godzin.",
                "error"
            );
        }

        return;
    }

    const nextExpiresAt =
        effectCanStack
            ? Math.min(
                currentTime +
                MAX_POTION_EFFECT_DURATION_MS,

                Number(
                    existingEffect.expiresAt
                ) +
                potionDurationMs
            )
            : currentTime +
            Math.min(
                potionDurationMs,
                MAX_POTION_EFFECT_DURATION_MS
            );

    player.activeEffects.potionEffects[
        potionItem.potionEffectId
    ] = {
        itemId: potionItemId,
        value: newEffectValue,

        /*
         * Przy stackowaniu zachowujemy
         * pierwotny moment aktywacji.
         */
        startedAt:
            effectCanStack
                ? (
                    Number(
                        existingEffect.startedAt
                    ) ||
                    currentTime
                )
                : currentTime,

        expiresAt:
            nextExpiresAt
    };

    inventoryEntry.quantity -= 1;

    if (inventoryEntry.quantity <= 0) {
        player.inventory =
            player.inventory.filter(
                entry => {
                    return (
                        entry.itemId !==
                        potionItemId
                    );
                }
            );
    }



    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            (
                effectWasUpgraded
                    ? "Wzmocniono efekt: "
                    : effectCanStack
                        ? "Wydłużono działanie: "
                        : "Użyto: "
            ) +
            potionItem.name +
            ".",
            "success"
        );
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "🧪 " +
            (
                effectWasUpgraded
                    ? "Wzmocniono działanie "
                    : effectCanStack
                        ? "Wydłużono działanie "
                        : "Użyto mikstury "
            ) +
            potionItem.name +
            ".",
            "potion"
        );
    }

    if (
        typeof saveGame === "function"
    ) {
        saveGame();
    }

    renderInventory();

    if (
        typeof renderActivityHud ===
        "function"
    ) {
        renderActivityHud();
    }
}