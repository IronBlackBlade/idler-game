const pendingAttributeChanges = {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    endurance: 0,
    luck: 0
};

function getPendingAttributePointsTotal() {
    return Object.values(
        pendingAttributeChanges
    ).reduce(
        (total, value) => {
            return total + value;
        },
        0
    );
}

function getAvailablePendingAttributePoints() {
    return Math.max(
        0,
        player.attributePoints -
        getPendingAttributePointsTotal()
    );
}

function getPreviewAttributeValue(statName) {
    if (
        !player.stats ||
        player.stats[statName] === undefined
    ) {
        return 0;
    }

    return (
        player.stats[statName] +
        (
            pendingAttributeChanges[
            statName
            ] || 0
        )
    );
}

function addPendingAttributePoint(
    statName,
    requestedAmount = 1
) {
    if (
        !player.stats ||
        player.stats[statName] === undefined
    ) {
        console.warn(
            "Nieznany atrybut:",
            statName
        );

        return;
    }

    const availablePoints =
        getAvailablePendingAttributePoints();

    if (availablePoints <= 0) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Brak dostępnych punktów atrybutów.",
                "error"
            );
        }

        return;
    }

    const amount = Math.min(
        Math.max(
            1,
            Math.floor(
                requestedAmount || 1
            )
        ),
        availablePoints
    );

    pendingAttributeChanges[
        statName
    ] += amount;

    render();
}

function addMaximumPendingAttributePoints(
    statName
) {
    addPendingAttributePoint(
        statName,
        getAvailablePendingAttributePoints()
    );
}

function removePendingAttributePoint(
    statName,
    requestedAmount = 1
) {
    if (
        pendingAttributeChanges[
        statName
        ] === undefined
    ) {
        return;
    }

    const amount = Math.min(
        Math.max(
            1,
            Math.floor(
                requestedAmount || 1
            )
        ),
        pendingAttributeChanges[
        statName
        ]
    );

    pendingAttributeChanges[
        statName
    ] -= amount;

    render();
}

function resetPendingAttributeChanges(
    shouldRender = true
) {
    Object.keys(
        pendingAttributeChanges
    ).forEach(statName => {
        pendingAttributeChanges[
            statName
        ] = 0;
    });

    if (shouldRender) {
        render();
    }
}

function confirmPendingAttributeChanges() {
    const spentPoints =
        getPendingAttributePointsTotal();

    if (spentPoints <= 0) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Nie przydzielono żadnych punktów.",
                "error"
            );
        }

        return;
    }

    if (
        spentPoints >
        player.attributePoints
    ) {
        resetPendingAttributeChanges(false);

        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Nie masz wystarczającej liczby punktów.",
                "error"
            );
        }

        return;
    }

    Object.keys(
        pendingAttributeChanges
    ).forEach(statName => {
        player.stats[statName] +=
            pendingAttributeChanges[
            statName
            ];
    });

    player.attributePoints -=
        spentPoints;

    resetPendingAttributeChanges();

    const derived =
        getDerivedStats();

    player.hp = Math.min(
        player.hp,
        derived.maxHp
    );

    player.mana = Math.min(
        player.mana,
        derived.maxMana
    );

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Zatwierdzono punkty atrybutów.",
            "success"
        );
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "📊 Przydzielono " +
            spentPoints +
            " punktów atrybutów.",
            "attributes"
        );
    }

    saveGame();
    render();
}