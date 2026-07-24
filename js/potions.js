const MAX_POTION_EFFECT_DURATION_MS =
    8 * 60 * 60 * 1000;


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