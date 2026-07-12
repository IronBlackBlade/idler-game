function renderHerbalism() {
    ensureHerbalismState();

    const areasContainer =
        document.getElementById(
            "herbalism-areas-list"
        );

    const activityContainer =
        document.getElementById(
            "herbalism-activity"
        );

    if (areasContainer) {
        renderHerbalismAreas(
            areasContainer
        );
    }

    if (activityContainer) {
        renderHerbalismActivity(
            activityContainer
        );
    }
}

function renderHerbalismAreas(
    container
) {
    container.innerHTML = "";

    herbalismAreas.forEach(area => {
        const isUnlocked =
            isHerbalismAreaUnlocked(
                area
            );

        const isSelected =
            player.herbalism
                .selectedAreaId ===
            area.id;

        const isActive =
            player.herbalism
                .isGathering &&
            player.herbalism
                .activeAreaId ===
            area.id;

        const card =
            document.createElement(
                "div"
            );

        card.className =
            "herbalism-area-card";

        if (!isUnlocked) {
            card.classList.add(
                "herbalism-area-locked"
            );
        }

        if (isSelected) {
            card.classList.add(
                "herbalism-area-selected"
            );
        }

        if (isActive) {
            card.classList.add(
                "herbalism-area-active"
            );
        }

        const basicNames =
            getHerbalismDropNames(
                area.basicDrops
            );

        const rareNames =
            getHerbalismDropNames(
                area.rareDrops
            );

        const exceptionalNames =
            getHerbalismDropNames(
                area.exceptionalDrops
            );

        let statusText =
            isUnlocked
                ? "Odblokowana"
                : "Zablokowana";

        if (isSelected) {
            statusText =
                "📍 Ostatnio odwiedzona";
        }

        if (isActive) {
            statusText =
                "🌿 Trwa zbieranie";
        }

        card.innerHTML = `
            <div class="herbalism-area-card-header">
                <div>
                    <span class="herbalism-area-status">
                        ${statusText}
                    </span>

                    <h3>${area.name}</h3>
                </div>

                <div class="herbalism-level-badge">
                    🌿 Lv. ${area.requiredHerbalismLevel}
                </div>
            </div>

            <p>${area.description}</p>

            <div class="herbalism-area-info">
                <span>
                    Czas zbierania:
                    <strong>
                        ${area.durationSeconds} s
                    </strong>
                </span>

                <span>
                    Rzadki składnik:
                    <strong>
                        ${area.rareChance}%
                    </strong>
                </span>

                <span>
                    Wyjątkowy:
                    <strong>
                        ${area.exceptionalChance}%
                    </strong>
                </span>
            </div>

            <div class="herbalism-drop-groups">
                <div class="herbalism-drop-group herbalism-drop-basic">
                    <span>Podstawowe</span>
                    <strong>${basicNames}</strong>
                </div>

                <div class="herbalism-drop-group herbalism-drop-rare">
                    <span>Rzadkie</span>
                    <strong>${rareNames}</strong>
                </div>

                <div class="herbalism-drop-group herbalism-drop-exceptional">
                    <span>Wyjątkowe</span>
                    <strong>${exceptionalNames}</strong>
                </div>
            </div>

            <button
                class="herbalism-select-button"
                onclick="enterHerbalismArea('${area.id}')"
                ${isUnlocked ? "" : "disabled"}
            >
                ${
                    isUnlocked
                        ? "Wejdź do lokacji"
                        : "Wymaga poziomu zielarstwa " +
                          area.requiredHerbalismLevel
                }
            </button>
        `;

        container.appendChild(
            card
        );
    });
}

function renderHerbalismActivity(
    container
) {
    const area =
        getHerbalismArea(
            player.herbalism
                .selectedAreaId
        );

    if (!area) {
        container.innerHTML =
            "<p>Nie wybrano lokacji.</p>";

        return;
    }

    const herbalismLevel =
        player.herbalism.level;

    const herbalismExp =
        player.herbalism.exp;

    const expNeeded =
        player.herbalism
            .expToNextLevel;

    const levelProgress =
        expNeeded > 0
            ? Math.min(
                100,
                herbalismExp /
                    expNeeded *
                    100
            )
            : 0;

    const isGatheringThisArea =
        player.herbalism
            .isGathering &&
        player.herbalism
            .activeAreaId ===
        area.id;

    const isGatheringOtherArea =
        player.herbalism
            .isGathering &&
        player.herbalism
            .activeAreaId !==
        area.id;

    const activeArea =
        isGatheringOtherArea
            ? getHerbalismArea(
                player.herbalism
                    .activeAreaId
            )
            : null;

    const cycleProgress =
        isGatheringThisArea
            ? getHerbalismProgressPercent()
            : 0;

    let buttonText =
        "ROZPOCZNIJ ZBIERANIE 🌿";

    if (isGatheringThisArea) {
        buttonText =
            "ZATRZYMAJ ZBIERANIE ⏹️";
    }

    if (isGatheringOtherArea) {
        buttonText =
            "PRZERWIJ " +
            (
                activeArea?.name ||
                "AKTUALNE ZBIERANIE"
            ) +
            " I ZBIERAJ TUTAJ";
    }

    let statusText =
        "Zbieranie zatrzymane";

    if (isGatheringThisArea) {
        statusText =
            "Trwa zbieranie...";
    }

    if (isGatheringOtherArea) {
        statusText =
            "Zbieranie trwa w: " +
            (
                activeArea?.name ||
                "innej lokacji"
            );
    }

    const lastResultHtml =
        getHerbalismLastResultHtml();

    container.innerHTML = `
        <div class="herbalism-activity-header">
            <div>
                <span>Aktualna lokacja</span>
                <h3>${area.name}</h3>
            </div>

            <div class="herbalism-current-level">
                Poziom zielarstwa
                <strong>
                    ${herbalismLevel}
                </strong>
            </div>
        </div>

        <p class="herbalism-area-description">
            ${area.description}
        </p>

        <div class="herbalism-exp-label">
            <span>EXP zielarstwa</span>

            <strong>
                ${herbalismExp}/${expNeeded}
            </strong>
        </div>

        <div class="herbalism-exp-bar">
            <div
                class="herbalism-exp-fill"
                style="width: ${levelProgress}%"
            ></div>
        </div>

        <div class="herbalism-cycle-label">
            <span>
                ${statusText}
            </span>

            <strong>
                ${Math.floor(cycleProgress)}%
            </strong>
        </div>

        <div class="herbalism-cycle-bar">
            <div
                class="herbalism-cycle-fill"
                style="width: ${cycleProgress}%"
            ></div>
        </div>

        <button
            class="herbalism-toggle-button ${
                isGatheringThisArea
                    ? "herbalism-stop-button"
                    : ""
            }"
            onclick="toggleHerbalismInViewedArea()"
        >
            ${buttonText}
        </button>

        <div class="herbalism-last-result">
            <h4>Ostatnie zbiory</h4>

            ${lastResultHtml}
        </div>
    `;
}

function updateHerbalismProgressUI() {
    const area =
        getHerbalismArea(
            player.herbalism
                .selectedAreaId
        );

    if (!area) {
        return;
    }

    const isGatheringThisArea =
        player.herbalism
            .isGathering &&
        player.herbalism
            .activeAreaId ===
        area.id;

    if (!isGatheringThisArea) {
        return;
    }

    const cycleFill =
        document.querySelector(
            ".herbalism-cycle-fill"
        );

    const cyclePercent =
        document.querySelector(
            ".herbalism-cycle-label strong"
        );

    const cycleStatus =
        document.querySelector(
            ".herbalism-cycle-label span"
        );

    if (
        !cycleFill ||
        !cyclePercent ||
        !cycleStatus
    ) {
        return;
    }

    const progress =
        getHerbalismProgressPercent();

    cycleFill.style.width =
        progress + "%";

    cyclePercent.textContent =
        Math.floor(progress) + "%";

    cycleStatus.textContent =
        "Trwa zbieranie...";
}

function getHerbalismDropNames(
    dropList
) {
    return dropList
        .map(drop => {
            return (
                items[drop.itemId]?.name ||
                drop.itemId
            );
        })
        .join(", ");
}

function getHerbalismLastResultHtml() {
    const result =
        player.herbalism
            .lastResult;

    if (
        !result ||
        !Array.isArray(
            result.resources
        ) ||
        result.resources.length === 0
    ) {
        return `
            <p class="herbalism-empty-result">
                Nie zebrano jeszcze żadnych składników.
            </p>
        `;
    }

    const resourceRows =
        result.resources
            .map(resource => {
                const item =
                    items[
                        resource.itemId
                    ];

                const rarityLabel =
                    resource.rarityGroup ===
                    "exceptional"
                        ? "Wyjątkowy"
                        : resource.rarityGroup ===
                          "rare"
                            ? "Rzadki"
                            : "Podstawowy";

                return `
                    <div class="herbalism-result-row herbalism-result-${resource.rarityGroup}">
                        <span>
                            ${
                                item?.name ||
                                resource.itemId
                            }
                        </span>

                        <strong>
                            +${resource.herbalismExp} EXP

                            <small>
                                ${rarityLabel}
                            </small>
                        </strong>
                    </div>
                `;
            })
            .join("");

    return `
        <div class="herbalism-result-list">
            ${resourceRows}
        </div>

        <div class="herbalism-result-total">
            Łącznie:

            <strong>
                +${result.totalHerbalismExp}
                EXP zielarstwa
            </strong>
        </div>
    `;
}