function renderMining() {
    ensureMiningState();

    const areasContainer =
        document.getElementById(
            "mining-areas-list"
        );

    const activityContainer =
        document.getElementById(
            "mining-activity"
        );

    if (areasContainer) {
        renderMiningAreas(
            areasContainer
        );
    }

    if (activityContainer) {
        renderMiningActivity(
            activityContainer
        );
    }
}

function updateMiningProgressUI() {
    const cycleFill =
        document.querySelector(
            ".mining-cycle-fill"
        );

    const cyclePercent =
        document.querySelector(
            ".mining-cycle-label strong"
        );

    const cycleStatus =
        document.querySelector(
            ".mining-cycle-label span"
        );

    if (
        !cycleFill ||
        !cyclePercent ||
        !cycleStatus
    ) {
        return;
    }

    const progress =
        getMiningProgressPercent();

    cycleFill.style.width =
        progress + "%";

    cyclePercent.textContent =
        Math.floor(progress) + "%";

    cycleStatus.textContent =
        player.mining.isMining
            ? "Trwa wydobycie..."
            : "Kopanie zatrzymane";
}

function renderMiningAreas(container) {
    container.innerHTML = "";

    miningAreas.forEach(area => {
        const isUnlocked =
            isMiningAreaUnlocked(area);

        const isSelected =
            player.mining.selectedAreaId ===
            area.id;

        const card = document.createElement("div");

        card.className = "mining-area-card";

        if (!isUnlocked) {
            card.classList.add(
                "mining-area-locked"
            );
        }

        if (isSelected) {
            card.classList.add(
                "mining-area-selected"
            );
        }

        const basicNames =
            getMiningDropNames(area.basicDrops);

        const rareNames =
            getMiningDropNames(area.rareDrops);

        const exceptionalNames =
            getMiningDropNames(
                area.exceptionalDrops
            );

        card.innerHTML = `
            <div class="mining-area-card-header">
                <div>
                    <span class="mining-area-status">
                        ${
                            isSelected
                                ? "📍 Wybrany obszar"
                                : isUnlocked
                                    ? "Odblokowany"
                                    : "Zablokowany"
                        }
                    </span>

                    <h3>${area.name}</h3>
                </div>

                <div class="mining-level-badge">
                    ⛏️ Lv. ${area.requiredMiningLevel}
                </div>
            </div>

            <p>${area.description}</p>

            <div class="mining-area-info">
                <span>
                    Czas wydobycia:
                    <strong>${area.durationSeconds} s</strong>
                </span>

                <span>
                    Rzadki surowiec:
                    <strong>${area.rareChance}%</strong>
                </span>

                <span>
                    Wyjątkowy:
                    <strong>${area.exceptionalChance}%</strong>
                </span>
            </div>

            <div class="mining-drop-groups">
                <div class="mining-drop-group mining-drop-basic">
                    <span>Podstawowe</span>
                    <strong>${basicNames}</strong>
                </div>

                <div class="mining-drop-group mining-drop-rare">
                    <span>Rzadkie</span>
                    <strong>${rareNames}</strong>
                </div>

                <div class="mining-drop-group mining-drop-exceptional">
                    <span>Wyjątkowe</span>
                    <strong>${exceptionalNames}</strong>
                </div>
            </div>

<button
    class="mining-select-button"
    onclick="enterMiningArea('${area.id}')"
    ${isUnlocked ? "" : "disabled"}
>
    ${
        isUnlocked
            ? "Wejdź do szybu"
            : "Wymaga poziomu kopania " +
              area.requiredMiningLevel
    }
</button>
        `;

        container.appendChild(card);
    });
}

function renderMiningActivity(container) {
    const area =
        getMiningArea(
            player.mining.selectedAreaId
        );

    if (!area) {
        container.innerHTML =
            "<p>Nie wybrano obszaru.</p>";
        return;
    }

    const miningLevel =
        player.mining.level;

    const miningExp =
        player.mining.exp;

    const expNeeded =
        player.mining.expToNextLevel;

    const levelProgress =
        expNeeded > 0
            ? Math.min(
                100,
                miningExp / expNeeded * 100
            )
            : 0;

    const cycleProgress =
        getMiningProgressPercent();

const isMiningThisArea =
    player.mining.isMining &&
    player.mining.activeAreaId === area.id;

const isMiningOtherArea =
    player.mining.isMining &&
    player.mining.activeAreaId !== area.id;

let buttonText =
    "ROZPOCZNIJ KOPANIE ⛏️";

if (isMiningThisArea) {
    buttonText =
        "ZATRZYMAJ KOPANIE ⏹️";
}

if (isMiningOtherArea) {
    const activeArea =
        getMiningArea(
            player.mining.activeAreaId
        );

    buttonText =
        "PRZERWIJ " +
        (activeArea?.name || "AKTUALNE KOPANIE") +
        " I KOP TUTAJ";
}

    const lastResultHtml =
        getMiningLastResultHtml();

    container.innerHTML = `
        <div class="mining-activity-header">
            <div>
                <span>Aktualny obszar</span>
                <h3>${area.name}</h3>
            </div>

            <div class="mining-current-level">
                Poziom kopania
                <strong>${miningLevel}</strong>
            </div>
        </div>

        <div class="mining-exp-label">
            <span>EXP kopania</span>
            <strong>${miningExp}/${expNeeded}</strong>
        </div>

        <div class="mining-exp-bar">
            <div
                class="mining-exp-fill"
                style="width: ${levelProgress}%"
            ></div>
        </div>

        <div class="mining-cycle-label">
            <span>
                ${
                    player.mining.isMining
                        ? "Trwa wydobycie..."
                        : "Kopanie zatrzymane"
                }
            </span>

            <strong>
                ${Math.floor(cycleProgress)}%
            </strong>
        </div>

        <div class="mining-cycle-bar">
            <div
                class="mining-cycle-fill"
                style="width: ${cycleProgress}%"
            ></div>
        </div>

        <button
            class="mining-toggle-button ${
                player.mining.isMining
                    ? "mining-stop-button"
                    : ""
            }"
            onclick="toggleMiningInViewedArea()"
        >
            ${buttonText}
        </button>

        <div class="mining-last-result">
            <h4>Ostatnie wydobycie</h4>
            ${lastResultHtml}
        </div>
    `;
}

function getMiningDropNames(dropList) {
    return dropList
        .map(drop => {
            return (
                items[drop.itemId]?.name ||
                drop.itemId
            );
        })
        .join(", ");
}

function getMiningLastResultHtml() {
    const result =
        player.mining.lastResult;

    if (
        !result ||
        !Array.isArray(result.resources) ||
        result.resources.length === 0
    ) {
        return `
            <p class="mining-empty-result">
                Nie wydobyto jeszcze żadnego surowca.
            </p>
        `;
    }

    const resourceRows =
        result.resources.map(resource => {
            const item =
                items[resource.itemId];

            const rarityLabel =
                resource.rarityGroup === "exceptional"
                    ? "Wyjątkowy"
                    : resource.rarityGroup === "rare"
                        ? "Rzadki"
                        : "Podstawowy";

            return `
                <div class="mining-result-row mining-result-${resource.rarityGroup}">
                    <span>
                        ${item?.name || resource.itemId}
                    </span>

                    <strong>
                        +${resource.miningExp} EXP
                        <small>${rarityLabel}</small>
                    </strong>
                </div>
            `;
        })
        .join("");

    return `
        <div class="mining-result-list">
            ${resourceRows}
        </div>

        <div class="mining-result-total">
            Łącznie:
            <strong>
                +${result.totalMiningExp} EXP kopania
            </strong>
        </div>
    `;
}
