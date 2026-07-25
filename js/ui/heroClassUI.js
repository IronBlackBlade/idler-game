function getHeroClassBonusesHtml(
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
            const statNames = {
                strength: "Siła",
                dexterity: "Zręczność",
                intelligence:
                    "Inteligencja",
                endurance:
                    "Wytrzymałość",
                luck: "Szczęście"
            };

            return `
                <span>
                    +${value}
                    ${statNames[statName] ||
                statName
                }
                </span>
            `;
        })
        .join("");
}

function renderCharacterClassSection() {
    const attributesGrid =
        document.querySelector(
            '[data-hero-panel="attributes"] .hero-attributes-grid'
        ) ||
        document.querySelector(
            ".hero-attributes-grid"
        );

    if (!attributesGrid) {
        return;
    }

    const attributeConfirmation =
        document.querySelector(
            '[data-hero-panel="attributes"] ' +
            ".hero-attribute-confirmation"
        );

    let section =
        document.getElementById(
            "hero-character-class-section"
        );

    if (!section) {
        section =
            document.createElement(
                "section"
            );

        section.id =
            "hero-character-class-section";

        section.className =
            "hero-class-section";
            
        attributesGrid.parentElement
            .insertBefore(
                section,
                attributeConfirmation ||
                attributesGrid
            );
    }

    const selectedClass =
        typeof getPlayerClassDefinition ===
            "function"
            ? getPlayerClassDefinition()
            : null;

    /*
     * Gracz ma już wybraną klasę.
     */
    if (selectedClass) {
        section.classList.add(
            "has-selected-class"
        );

        section.innerHTML = `
            <div class="hero-class-header">
                <div>
                    <strong>
                        Klasa postaci
                    </strong>

                    <span>
                        Wybrana specjalizacja bohatera
                    </span>
                </div>

                <span class="hero-class-selected-label">
                    Wybrano
                </span>
            </div>

            <div class="hero-selected-class">
                <div class="hero-selected-class-icon">
                    ${selectedClass.icon}
                </div>

                <div class="hero-selected-class-info">
                    <strong>
                        ${selectedClass.name}
                    </strong>

                    <p>
                        ${selectedClass.description}
                    </p>

                    <div class="hero-class-bonuses">
                        ${getHeroClassBonusesHtml(
            selectedClass
        )}
                    </div>
                </div>
            </div>
        `;

        return;
    }

    section.classList.remove(
        "has-selected-class"
    );

    const definitions =
        Object.values(
            characterClasses
        );

    const requiredLevel =
        definitions.length > 0
            ? Math.min(
                ...definitions.map(
                    definition => {
                        return (
                            definition
                                .unlockLevel
                        );
                    }
                )
            )
            : 10;

    const selectionUnlocked =
        player.level >=
        requiredLevel;

    const progressPercent =
        Math.min(
            100,
            (
                Math.max(
                    0,
                    player.level
                ) /
                requiredLevel
            ) *
            100
        );

    const classCardsHtml =
        definitions
            .map(classDefinition => {
                const isUnlocked =
                    player.level >=
                    classDefinition
                        .unlockLevel;

                return `
                    <article
                        class="
                            hero-class-card
                            ${isUnlocked
                        ? ""
                        : "locked"
                    }
                        "
                    >
                        <div class="hero-class-card-icon">
                            ${classDefinition.icon}
                        </div>

                        <strong class="hero-class-card-name">
                            ${classDefinition.name}
                        </strong>

                        <p>
                            ${classDefinition.description}
                        </p>

                        <div class="hero-class-bonuses">
                            ${getHeroClassBonusesHtml(
                        classDefinition
                    )}
                        </div>

                        <button
                            type="button"
                            onclick="
                                chooseCharacterClass(
                                    '${classDefinition.id}'
                                )
                            "
                            ${isUnlocked
                        ? ""
                        : "disabled"
                    }
                        >
                            ${isUnlocked
                        ? "Wybierz klasę"
                        : "Poziom " +
                        classDefinition
                            .unlockLevel
                    }
                        </button>
                    </article>
                `;
            })
            .join("");

    section.innerHTML = `
        <div class="hero-class-header">
            <div>
                <strong>
                    Wybór klasy postaci
                </strong>

                <span>
                    Klasa zapewnia stałe premie do wybranych atrybutów.
                </span>
            </div>

            <span
                class="
                    hero-class-status
                    ${selectionUnlocked
            ? "unlocked"
            : ""
        }
                "
            >
                ${selectionUnlocked
            ? "Dostępne"
            : "Poziom " +
            player.level +
            "/" +
            requiredLevel
        }
            </span>
        </div>

        ${selectionUnlocked
            ? `
                <div class="hero-class-unlocked-message">
                    Wybór klasy został odblokowany.
                    Przeczytaj premie i wybierz specjalizację bohatera.
                </div>
            `
            : `
                <div class="hero-class-progress">
                    <div class="hero-class-progress-info">
                        <span>
                            Postęp do odblokowania
                        </span>

                        <strong>
                            ${player.level}/${requiredLevel}
                        </strong>
                    </div>

                    <div class="hero-class-progress-track">
                        <div
                            class="hero-class-progress-fill"
                            style="
                                width:
                                ${progressPercent}%
                            "
                        ></div>
                    </div>
                </div>
            `
        }

        <div class="hero-class-grid">
            ${classCardsHtml}
        </div>
    `;
}

function renderHeroClassSummaryCard() {
    const summaryGrid =
        document.querySelector(
            '[data-hero-panel="summary"] .hero-summary-grid'
        ) ||
        document.querySelector(
            ".hero-summary-grid"
        );

    if (!summaryGrid) {
        return;
    }

    let classCard =
        document.getElementById(
            "hero-class-summary-card"
        );

    if (!classCard) {
        classCard =
            document.createElement(
                "div"
            );

        classCard.id =
            "hero-class-summary-card";

        summaryGrid.appendChild(
            classCard
        );
    }

    classCard.className =
        "hero-summary-card summary-class";

    const selectedClass =
        typeof getPlayerClassDefinition ===
            "function"
            ? getPlayerClassDefinition()
            : null;

    if (selectedClass) {
        classCard.innerHTML = `
            <div class="hero-summary-icon">
                ${selectedClass.icon}
            </div>

            <div class="hero-summary-content">
                <span>
                    Klasa postaci
                </span>

                <strong>
                    ${selectedClass.name}
                </strong>
            </div>
        `;

        return;
    }

    const isUnlocked =
        player.level >= 10;

    classCard.innerHTML = `
        <div class="hero-summary-icon">
            ${isUnlocked
            ? "🏛️"
            : "🔒"
        }
        </div>

        <div class="hero-summary-content">
            <span>
                Klasa postaci
            </span>

            <strong>
                ${isUnlocked
            ? "Wybierz klasę"
            : "Od 10. poziomu"
        }
            </strong>
        </div>
    `;
}

function openCharacterClassSelection() {
    if (
        typeof openHeroTab ===
        "function"
    ) {
        openHeroTab(
            "attributes"
        );
    }

    /*
     * Czekamy, aż zakładka Atrybuty
     * stanie się widoczna.
     */
    requestAnimationFrame(() => {
        const classSection =
            document.getElementById(
                "hero-character-class-section"
            );

        if (!classSection) {
            return;
        }

        classSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        classSection.classList.add(
            "hero-class-section-highlight"
        );

        setTimeout(() => {
            classSection.classList.remove(
                "hero-class-section-highlight"
            );
        }, 1200);
    });
}

function renderSideHeroClassHud() {
    const classElement =
        document.getElementById(
            "side-hero-class"
        );

    const classButton =
        document.getElementById(
            "side-hero-class-button"
        );

    if (
        !classElement ||
        !classButton
    ) {
        return;
    }

    const selectedClass =
        typeof getPlayerClassDefinition ===
            "function"
            ? getPlayerClassDefinition()
            : null;

    /*
     * Klasa została już wybrana.
     */
    if (selectedClass) {
        classElement.textContent =
            selectedClass.icon +
            " " +
            selectedClass.name;

        classElement.classList.add(
            "has-class"
        );

        classElement.classList.remove(
            "class-available"
        );

        classButton.hidden = true;

        return;
    }

    classElement.classList.remove(
        "has-class"
    );

    /*
     * Gracz osiągnął poziom 10,
     * ale nie wybrał jeszcze klasy.
     */
    if (
        Number(player.level) >= 10
    ) {
        classElement.textContent =
            "🏛️ Klasa niewybrana";

        classElement.classList.add(
            "class-available"
        );

        classButton.hidden = false;

        return;
    }

    /*
     * Klasa nie została jeszcze
     * odblokowana.
     */
    classElement.textContent =
        "🔒 Klasa od 10. poziomu";

    classElement.classList.remove(
        "class-available"
    );

    classButton.hidden = true;
}