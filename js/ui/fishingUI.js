function renderFishing() {
    ensureFishingState();

    const activityContainer =
        document.getElementById(
            "fishing-activity"
        );

    if (activityContainer) {
        renderFishingActivity(
            activityContainer
        );
    }
}

function getFishingDropNames(dropList) {
    return dropList
        .map(drop => {
            return (
                items[drop.itemId]?.name ||
                drop.itemId
            );
        })
        .join(", ");
}

function renderFishingAreas(container) {
    container.innerHTML = "";

    fishingAreas.forEach(area => {
        const isUnlocked =
            isFishingAreaUnlocked(area);
        const isSelected =
            player.fishing.selectedAreaId ===
            area.id;
        const isActive =
            player.fishing.isFishing &&
            player.fishing.activeAreaId ===
            area.id;

        const card =
            document.createElement("div");
        card.className =
            "fishing-area-card";

        if (!isUnlocked) {
            card.classList.add(
                "fishing-area-locked"
            );
        }
        if (isSelected) {
            card.classList.add(
                "fishing-area-selected"
            );
        }
        if (isActive) {
            card.classList.add(
                "fishing-area-active"
            );
        }

        let statusText = isUnlocked
            ? "Odblokowane"
            : "Zablokowane";
        if (isSelected) {
            statusText =
                "📍 Wybrane łowisko";
        }
        if (isActive) {
            statusText =
                "🎣 Trwa łowienie";
        }

        const buttonText = !isUnlocked
            ? "Wymaga poziomu łowienia " +
            area.requiredFishingLevel
            : isActive
                ? "🎣 Aktualnie łowisz tutaj"
                : isSelected
                    ? "✅ Wybrane łowisko"
                    : player.fishing.isFishing
                        ? "Przenieś łowienie tutaj"
                        : "Wybierz łowisko";

        card.innerHTML = `
            <div class="fishing-area-card-header">
                <div>
                    <span class="fishing-area-status">
                        ${statusText}
                    </span>
                    <h3>${area.name}</h3>
                </div>
                <div class="fishing-level-badge">
                    🎣 Lv. ${area.requiredFishingLevel}
                </div>
            </div>

            <p>${area.description}</p>

            <div class="fishing-area-info">
                <span>
                    Branie:
                    <strong>${area.durationSeconds} s</strong>
                </span>
                <span>
                    Rzadka ryba:
                    <strong>${area.rareChance}%</strong>
                </span>
                <span>
                    Skarb:
                    <strong>${area.treasureChance}%</strong>
                </span>
            </div>

            <div class="fishing-drop-groups">
                <div class="fishing-drop-group fishing-drop-basic">
                    <span>Ryby</span>
                    <strong>
                        ${getFishingDropNames(area.basicDrops)}
                    </strong>
                </div>
                <div class="fishing-drop-group fishing-drop-rare">
                    <span>Rzadkie</span>
                    <strong>
                        ${getFishingDropNames(area.rareDrops)}
                    </strong>
                </div>
                <div class="fishing-drop-group fishing-drop-treasure">
                    <span>Skarby</span>
                    <strong>
                        ${getFishingDropNames(area.treasureDrops)}
                    </strong>
                </div>
            </div>

            <button
                class="fishing-select-button"
                onclick="enterFishingArea('${area.id}')"
                ${!isUnlocked || isSelected
                ? "disabled"
                : ""}
            >
                ${buttonText}
            </button>
        `;

        container.appendChild(card);
    });
}

function renderFishingActivity(container) {
    const area = getFishingArea(
        player.fishing.selectedAreaId
    );

    if (!area) {
        container.innerHTML =
            "<p>Nie wybrano łowiska.</p>";
        return;
    }

    const state = player.fishing;
    const levelProgress =
        state.expToNextLevel > 0
            ? Math.min(
                100,
                state.exp /
                state.expToNextLevel *
                100
            )
            : 0;
    const isFishingHere =
        state.isFishing &&
        state.activeAreaId === area.id;
    const activeArea =
        state.isFishing &&
            state.activeAreaId !== area.id
            ? getFishingArea(
                state.activeAreaId
            )
            : null;
    const cycleProgress =
        isFishingHere
            ? getFishingProgressPercent()
            : 0;

    let statusText =
        "Wędka jest zwinięta";
    let buttonText =
        "ROZPOCZNIJ ŁOWIENIE 🎣";

    if (isFishingHere) {
        statusText =
            "Oczekiwanie na branie...";
        buttonText =
            "ZAKOŃCZ ŁOWIENIE ⏹️";
    } else if (activeArea) {
        statusText =
            "Łowienie trwa w: " +
            activeArea.name;
        buttonText =
            "PRZENIEŚ ŁOWIENIE TUTAJ";
    }

    container.innerHTML = `
    <div class="fishing-primary-panel">
    <div class="fishing-activity-header has-profession-tool-context">
        <div>
            <span>Aktualne łowisko</span>
            <h3>${area.name}</h3>
        </div>

        <div
            class="profession-tool-context-slot"
            data-profession-tool-panel="fishingRod"
        ></div>

        <div class="fishing-current-level">
            Poziom łowienia
            <strong>${state.level}</strong>
        </div>
    </div>

    <div class="fishing-dashboard">
        <section class="fishing-session-panel">
            <div class="fishing-section-heading">
                <div>
                    <small>AKTYWNOŚĆ</small>
                    <strong>🎣 Połów i postęp</strong>
                </div>
                <span>${area.durationSeconds} s na rzut</span>
            </div>

            <div class="fishing-statistics">
                <span>
                    Połowy
                    <strong>${state.statistics.totalFish}</strong>
                </span>
                <span>
                    Rzadkie ryby
                    <strong>${state.statistics.rareFish}</strong>
                </span>
                <span>
                    Skarby
                    <strong>${state.statistics.treasures}</strong>
                </span>
            </div>

            <div class="fishing-progress-stack">
                <div class="fishing-progress-block">
                    <div class="fishing-exp-label">
                        <span>EXP łowienia</span>
                        <strong>
                            ${Math.floor(state.exp)}/${state.expToNextLevel}
                        </strong>
                    </div>
                    <div class="fishing-exp-bar">
                        <div
                            class="fishing-exp-fill"
                            style="width: ${levelProgress}%"
                        ></div>
                    </div>
                </div>

                <div class="fishing-progress-block is-cycle">
                    <div class="fishing-cycle-label">
                        <span>${statusText}</span>
                        <strong>
                            ${Math.floor(cycleProgress)}%
                        </strong>
                    </div>
                    <div class="fishing-cycle-bar">
                        <div
                            class="fishing-cycle-fill"
                            style="width: ${cycleProgress}%"
                        ></div>
                    </div>
                </div>
            </div>

            <button
                class="fishing-toggle-button ${isFishingHere
            ? "fishing-stop-button"
            : ""
        }"
                onclick="toggleFishingInViewedArea()"
            >
                ${buttonText}
            </button>

            ${getFishingBaitsHtml()}
        </section>
    </div>
    </div>

    <section class="fishing-inline-areas fishing-content-section">
        <div class="fishing-inline-areas-header">
            <div>
                <small>WYBÓR MIEJSCA</small>
                <strong>🗺️ Łowiska</strong>
            </div>
            <span>
                Wybierz łowisko odpowiednie do swojego poziomu
            </span>
        </div>
        <div
            id="fishing-inline-areas-list"
            class="fishing-inline-areas-list"
        ></div>
    </section>

    <div class="fishing-summary-grid">
        ${getFishingRecordsHtml()}

        <div class="fishing-last-result">
            <div class="fishing-last-result-header">
                <small>NAJNOWSZY WYNIK</small>
                <h4>🐟 Ostatni połów</h4>
            </div>
            ${getFishingLastResultHtml()}
        </div>
    </div>

    ${getFishingOrdersHtml()}
`;
    const toolPanel =
        container.querySelector(
            "[data-profession-tool-panel='fishingRod']"
        );

    if (
        toolPanel &&
        typeof renderProfessionToolContextPanel ===
        "function"
    ) {
        renderProfessionToolContextPanel(
            toolPanel,
            "fishingRod"
        );
    }

    const inlineAreasContainer =
        document.getElementById(
            "fishing-inline-areas-list"
        );

    if (inlineAreasContainer) {
        renderFishingAreas(
            inlineAreasContainer
        );
    }
}

function updateFishingProgressUI() {
    const cycleFill =
        document.querySelector(
            ".fishing-cycle-fill"
        );
    const cyclePercent =
        document.querySelector(
            ".fishing-cycle-label strong"
        );
    const cycleStatus =
        document.querySelector(
            ".fishing-cycle-label span"
        );

    if (
        !cycleFill ||
        !cyclePercent ||
        !cycleStatus
    ) {
        return;
    }

    const progress =
        getFishingProgressPercent();
    cycleFill.style.width =
        progress + "%";
    cyclePercent.textContent =
        Math.floor(progress) + "%";
    cycleStatus.textContent =
        "Oczekiwanie na branie...";
}

function getFishingLastResultHtml() {
    const result =
        player.fishing.lastResult;

    if (
        !result ||
        !Array.isArray(result.resources) ||
        result.resources.length === 0
    ) {
        return `
            <p class="fishing-empty-result">
                Nie złowiono jeszcze żadnej ryby.
            </p>
        `;
    }

    const rows = result.resources
        .map(resource => {
            const item =
                items[resource.itemId];
            const rarityLabel =
                resource.rarityGroup ===
                    "treasure"
                    ? "Skarb"
                    : resource.rarityGroup ===
                        "rare"
                        ? "Rzadka ryba"
                        : "Połów";
            const sizeHtml =
                resource.sizeCm
                    ? `
                        <small class="fishing-catch-size">
                            📏 ${formatFishingSize(
                        resource.sizeCm
                    )}
                        </small>
                    `
                    : "";
            const recordHtml =
                resource.isNewRecord
                    ? `
                        <small class="fishing-new-record">
                            🏆 NOWY REKORD
                        </small>
                    `
                    : "";

            return `
                <div class="fishing-result-row fishing-result-${resource.rarityGroup}">
                    <span>
${item?.name || resource.itemId}

${Number(resource.quantity) > 1
                    ? `<strong class="profession-double-reward">
        x${resource.quantity} 🌾
       </strong>`
                    : ""
                }

${sizeHtml}
                    </span>
                    <strong>
                        +${resource.fishingExp} EXP
                        <small>${rarityLabel}</small>
                        ${recordHtml}
                    </strong>
                </div>
            `;
        })
        .join("");
    const usedBait = getFishingBait(
        result.baitItemId
    );
    const baitHtml = usedBait
        ? `
            <div class="fishing-result-bait">
                ${usedBait.icon}
                Użyta przynęta:
                <strong>
                    ${items[
            usedBait.itemId
        ]?.name ||
        usedBait.itemId}
                </strong>
            </div>
        `
        : "";

    return `
        ${baitHtml}
        <div class="fishing-result-list">
            ${rows}
        </div>
        <div class="fishing-result-total">
            Łącznie:
            <strong>
                +${result.totalFishingExp}
                EXP łowienia
            </strong>
        </div>
    `;
}

function getFishingBaitsHtml() {
    const selectedBaitId =
        player.fishing.selectedBaitId;
    const activeBaitId =
        player.fishing.activeBaitId;
    const noBaitSelected =
        !selectedBaitId;
    const baitCards = fishingBaits
        .map(bait => {
            const quantity =
                getFishingBaitQuantity(
                    bait.itemId
                );
            const isSelected =
                selectedBaitId ===
                bait.itemId;
            const isActive =
                activeBaitId ===
                bait.itemId &&
                player.fishing.isFishing;

            let statusText =
                quantity > 0
                    ? "Wybierz"
                    : "Brak — kup u kupca";
            if (isSelected) {
                statusText =
                    quantity > 0
                        ? "Wybrana na kolejne rzuty"
                        : "Wybrana, ale brak zapasu";
            }
            if (isActive) {
                statusText =
                    "Używana w tym rzucie";
            }

            return `
                <button
                    class="fishing-bait-card ${isSelected
                    ? "fishing-bait-selected"
                    : ""} ${isActive
                        ? "fishing-bait-active"
                        : ""}"
                    onclick="selectFishingBait('${bait.itemId}')"
                    ${quantity <= 0
                    ? "disabled"
                    : ""}
                >
                    <span class="fishing-bait-icon">
                        ${bait.icon}
                    </span>
                    <span class="fishing-bait-details">
                        <strong>
                            ${items[
                    bait.itemId
                ]?.name ||
                bait.itemId}
                        </strong>
                        <small>
                            ${bait.effectDescription}
                        </small>
                        <em>${statusText}</em>
                    </span>
                    <span class="fishing-bait-quantity">
                        ×${quantity}
                    </span>
                </button>
            `;
        })
        .join("");

    return `
        <div class="fishing-baits">
            <div class="fishing-baits-header">
                <strong>🪝 Przynęta</strong>
                <span>
                    1 sztuka na zakończony połów
                </span>
            </div>
            <div class="fishing-bait-grid">
                <button
                    class="fishing-bait-card fishing-bait-none ${noBaitSelected
            ? "fishing-bait-selected"
            : ""}"
                    onclick="selectFishingBait(null)"
                >
                    <span class="fishing-bait-icon">
                        ➖
                    </span>
                    <span class="fishing-bait-details">
                        <strong>Bez przynęty</strong>
                        <small>
                            Brak dodatkowej premii
                        </small>
                        <em>
                            ${noBaitSelected
            ? "Wybrane"
            : "Wybierz"}
                        </em>
                    </span>
                </button>
                ${baitCards}
            </div>
        </div>
    `;
}

function getFishingOrdersHtml() {
    const totalCompleted =
        player.fishing.statistics
            .totalOrdersCompleted || 0;
    const orderCards = fishingOrders
        .map(order => {
            const progress =
                getFishingOrderProgress(
                    order
                );
            const isUnlocked =
                player.fishing.level >=
                order.requiredFishingLevel;
            const isReady =
                isUnlocked &&
                canCompleteFishingOrder(
                    order.id
                );
            const tierProgress =
                progress.completedCount % 5;
            const requirementsHtml =
                progress.requirements
                    .map(requirement => {
                        const owned =
                            getInventoryItemQuantity(
                                requirement.itemId
                            );
                        const hasEnough =
                            owned >=
                            requirement.quantity;

                        return `
                            <div class="fishing-order-requirement ${hasEnough
                                ? "fishing-order-requirement-ready"
                                : ""}">
                                <span>
                                    ${items[
                                requirement.itemId
                            ]?.name ||
                            requirement.itemId}
                                </span>
                                <strong>
                                    ${owned}/${requirement.quantity}
                                </strong>
                            </div>
                        `;
                    })
                    .join("");

            return `
                <article class="fishing-order-card ${isReady
                    ? "fishing-order-ready"
                    : ""} ${!isUnlocked
                        ? "fishing-order-locked"
                        : ""}">
                    <div class="fishing-order-card-header">
                        <span class="fishing-order-icon">
                            ${order.icon}
                        </span>
                        <div>
                            <small>
                                ${isUnlocked
                    ? "Poziom zlecenia " +
                    progress.tier
                    : "Wymaga poziomu łowienia " +
                    order.requiredFishingLevel}
                            </small>
                            <h4>${order.name}</h4>
                        </div>
                    </div>

                    <p>${order.description}</p>

                    <div class="fishing-order-requirements">
                        ${requirementsHtml}
                    </div>

                    <div class="fishing-order-rewards">
                        <span>
                            💰 <strong>${progress.goldReward}</strong>
                        </span>
                        <span>
                            🎣 <strong>+${progress.fishingExpReward} EXP</strong>
                        </span>
                    </div>

                    <div class="fishing-order-tier-progress">
                        <span>
                            Do wyższego poziomu
                        </span>
                        <strong>
                            ${tierProgress}/5
                        </strong>
                    </div>
                    <div class="fishing-order-tier-bar">
                        <div style="width: ${tierProgress / 5 * 100}%"></div>
                    </div>

                    <button
                        class="fishing-order-complete-button"
                        onclick="completeFishingOrder('${order.id}')"
                        ${isReady ? "" : "disabled"}
                    >
                        ${!isUnlocked
                    ? "ZLECENIE ZABLOKOWANE"
                    : isReady
                        ? "ODDAJ RYBY I ODBIERZ NAGRODĘ"
                        : "BRAKUJE RYB"}
                    </button>
                </article>
            `;
        })
        .join("");

    return `
        <section class="fishing-orders">
            <div class="fishing-orders-header">
                <div>
                    <strong>⚓ Zlecenia z przystani</strong>
                    <small>
                        Oddawaj połowy za złoto i EXP łowienia
                    </small>
                </div>
                <span>
                    Wykonane: ${totalCompleted}
                </span>
            </div>
            <div class="fishing-orders-grid">
                ${orderCards}
            </div>
        </section>
    `;
}

function getFishingRecordsHtml() {
    const records =
        player.fishing.statistics
            .recordsByItem || {};
    const fishItemIds = [
        ...new Set(
            fishingAreas.flatMap(area => {
                return [
                    ...(area.basicDrops || []),
                    ...(area.rareDrops || [])
                ].map(drop => drop.itemId);
            })
        )
    ];
    const discoveredRecords =
        Object.entries(records)
            .filter(entry => {
                return (
                    Number(
                        entry[1]?.sizeCm
                    ) > 0
                );
            })
            .sort((first, second) => {
                return (
                    Number(
                        second[1]?.caughtAt
                    ) -
                    Number(
                        first[1]?.caughtAt
                    )
                );
            });

    if (discoveredRecords.length === 0) {
        return `
            <div class="fishing-record-book fishing-record-book-empty">
                <div class="fishing-record-book-header">
                    <strong>🏆 Księga rekordów</strong>
                    <span>0/${fishItemIds.length} gatunków</span>
                </div>
                <p>
                    Złów pierwszą rybę, aby ustanowić rekord.
                </p>
            </div>
        `;
    }

    const recordRows =
        discoveredRecords
            .map(([itemId, record]) => {
                const caughtCount =
                    player.fishing.statistics
                        .fishByItem[itemId] ||
                    0;

                return `
                    <div class="fishing-record-row">
                        <span>
                            ${items[itemId]?.name || itemId}
                            <small>
                                złowiono: ${caughtCount}
                            </small>
                        </span>
                        <strong>
                            ${formatFishingSize(
                    record.sizeCm
                )}
                        </strong>
                    </div>
                `;
            })
            .join("");

    return `
        <div class="fishing-record-book">
            <div class="fishing-record-book-header">
                <strong>🏆 Księga rekordów</strong>
                <span>
                    ${discoveredRecords.length}/${fishItemIds.length}
                    gatunków
                </span>
            </div>
            <div class="fishing-record-grid">
                ${recordRows}
            </div>
        </div>
    `;
}
