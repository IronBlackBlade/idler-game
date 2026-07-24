function getPlayerClassDefinition() {
    if (!player.classId) {
        return null;
    }

    return (
        characterClasses[
        player.classId
        ] || null
    );
}

function getPlayerClassBonuses() {
    const emptyBonuses = {
        strength: 0,
        dexterity: 0,
        intelligence: 0,
        endurance: 0,
        luck: 0
    };

    const classDefinition =
        getPlayerClassDefinition();

    if (!classDefinition) {
        return emptyBonuses;
    }

    return {
        ...emptyBonuses,
        ...classDefinition.bonuses
    };
}

function getCharacterClassStatName(
    statName
) {
    const statNames = {
        strength: "Siły",
        dexterity: "Zręczności",
        intelligence: "Inteligencji",
        endurance: "Wytrzymałości",
        luck: "Szczęścia"
    };

    return (
        statNames[statName] ||
        statName
    );
}

function getCharacterClassBonusSummary(
    classDefinition
) {
    if (
        !classDefinition ||
        !classDefinition.bonuses
    ) {
        return "";
    }

    return Object.entries(
        classDefinition.bonuses
    )
        .map(([statName, value]) => {
            return (
                "+" +
                value +
                " " +
                getCharacterClassStatName(
                    statName
                )
            );
        })
        .join(", ");
}

function chooseCharacterClass(
    classId
) {
    const classDefinition =
        characterClasses[classId];

    if (!classDefinition) {
        console.warn(
            "Nieznana klasa:",
            classId
        );

        return;
    }

    const currentClass =
        getPlayerClassDefinition();

    if (currentClass) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Klasa postaci została już wybrana.",
                "error"
            );
        }

        return;
    }

    if (
        player.level <
        classDefinition.unlockLevel
    ) {
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Wybór klasy odblokowuje się na poziomie " +
                classDefinition.unlockLevel +
                ".",
                "error"
            );
        }

        return;
    }

    const bonusSummary =
        getCharacterClassBonusSummary(
            classDefinition
        );

    const shouldChoose =
        window.confirm(
            "Czy na pewno wybierasz klasę " +
            classDefinition.name +
            "?\n\n" +
            "Premie: " +
            bonusSummary +
            "\n\n" +
            "Na tym etapie wybór klasy jest stały."
        );

    if (!shouldChoose) {
        return;
    }

    player.classId =
        classDefinition.id;

    /*
     * Po wybraniu klasy odnawiamy HP
     * i manę do nowych maksymalnych
     * wartości.
     */
    const derived =
        getDerivedStats();

    player.hp =
        derived.maxHp;

    player.mana =
        derived.maxMana;

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Wybrano klasę: " +
            classDefinition.name +
            ".",
            "success"
        );
    }

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            classDefinition.icon +
            " Bohater wybrał klasę " +
            classDefinition.name +
            ". Premie: " +
            bonusSummary +
            ".",
            "class"
        );
    }

    if (
        typeof saveGame ===
        "function"
    ) {
        saveGame();
    }

    if (
        typeof renderHero ===
        "function"
    ) {
        renderHero();
    }

    if (
        typeof renderPlayerHud ===
        "function"
    ) {
        renderPlayerHud();
    }
}
