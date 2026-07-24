function getLocationMasteryRank(
    masteryPercent
) {
    if (masteryPercent >= 100) {
        return "Mistrz lokacji";
    }

    if (masteryPercent >= 75) {
        return "Łowca lokacji";
    }

    if (masteryPercent >= 50) {
        return "Doświadczony";
    }

    if (masteryPercent >= 25) {
        return "Obeznany";
    }

    return "Początkujący";
}

function getLocationMasteryMilestonesHtml(
    masteryPercent
) {
    const rewards =
        LOCATION_MASTERY_REWARDS;

    return rewards
        .map(reward => {
            const isUnlocked =
                masteryPercent >=
                reward.threshold;

            return `
                <span
                    class="
                        location-mastery-milestone
                        ${isUnlocked
                    ? "unlocked"
                    : ""
                }
                    "
                >
                    ${isUnlocked
                    ? "✓"
                    : "🔒"
                }

                    <strong>
                        ${reward.threshold}%
                    </strong>

                    <small>
                        ${reward.label}
                    </small>
                </span>
            `;
        })
        .join("");
}

function getLocationBossPanelHtml(
    location,
    progress
) {
    const boss =
        location?.boss;

    if (!boss) {
        return "";
    }

    const bossKills =
        Math.max(
            0,
            Number(
                progress?.bossKills
            ) || 0
        );

    const reward =
        boss.firstKillReward;

    const rewardClaimed =
        progress
            ?.firstBossRewardClaimed ===
        true;

    const rewardParts = [];

    if (reward) {
        if (Number(reward.gold) > 0) {
            rewardParts.push(
                "<span>💰 +" +
                reward.gold +
                " złota</span>"
            );
        }

        if (Number(reward.exp) > 0) {
            rewardParts.push(
                "<span>⭐ +" +
                reward.exp +
                " EXP</span>"
            );
        }

        const rewardItems =
            Array.isArray(reward.items)
                ? reward.items
                : [];

        rewardItems.forEach(
            rewardItem => {
                const item =
                    items[
                        rewardItem.item
                    ];

                rewardParts.push(
                    "<span>🎒 " +
                    (
                        item?.name ||
                        rewardItem.item
                    ) +
                    " x" +
                    (
                        rewardItem
                            .quantity || 1
                    ) +
                    "</span>"
                );
            }
        );
    }

    const possibleLoot =
        Array.isArray(boss.loot)
            ? boss.loot
                .map(drop => {
                    const item =
                        items[drop.item];

                    const chance =
                        Number(
                            drop.chance
                        ) || 0;

                    return `
                        <div
                            class="
                                location-boss-loot-item
                            "
                        >
                            <span>
                                ${item?.name ||
                                drop.item}
                            </span>

                            <strong>
                                ${chance
                                    .toString()
                                    .replace(
                                        ".",
                                        ","
                                    )
                                }%
                            </strong>
                        </div>
                    `;
                })
                .join("")
            : "";

    return `
        <div
            class="
                location-boss-panel
                ${rewardClaimed
                    ? "reward-claimed"
                    : ""
                }
            "
        >
            <div class="location-boss-header">
                <div>
                    <span>
                        Boss lokacji
                    </span>

                    <strong>
                        ${boss.name}
                    </strong>
                </div>

                <span
                    class="
                        location-boss-kill-badge
                    "
                >
                    Pokonano: ${bossKills}
                </span>
            </div>

            ${reward
                ? `
                    <div
                        class="
                            location-first-boss-reward
                        "
                    >
                        <div
                            class="
                                location-first-reward-header
                            "
                        >
                            <strong>
                                Pierwsza nagroda
                            </strong>

                            <span>
                                ${rewardClaimed
                                    ? "✅ Odebrana"
                                    : "🏆 Dostępna"
                                }
                            </span>
                        </div>

                        <div
                            class="
                                location-first-reward-list
                            "
                        >
                            ${rewardParts.join("")}
                        </div>
                    </div>
                `
                : ""
            }

            <div class="location-boss-loot">
                <strong>
                    Możliwy łup
                </strong>

                <div
                    class="
                        location-boss-loot-list
                    "
                >
                    ${possibleLoot}
                </div>
            </div>
        </div>
    `;
}

function renderLocations() {
    const container = document.getElementById("locations-list");
    if (!container) return;

    container.innerHTML = "";

    Object.values(locations).forEach(location => {
        const requiredLevel = location.requiredLevel || 1;
        const isUnlocked = player.level >= requiredLevel;
        const isCurrentLocation = player.location === location.id;

        const progress =
            typeof ensureLocationProgress ===
                "function"
                ? ensureLocationProgress(
                    location.id
                )
                : {
                    bossKillsCounter: 0,
                    bossChance: 0,
                    totalKills: 0,
                    eliteKills: 0,
                    bossKills: 0
                };

        const eliteKills =
            Number(
                progress.eliteKills
            ) || 0;

        const chestsFound =
            Number(
                progress.chestsFound
            ) || 0;

        const totalKills =
            Number(
                progress.totalKills
            ) || 0;

        const bossKills =
            Number(
                progress.bossKills
            ) || 0;

        const masteryPercent =
            typeof getLocationMasteryPercent ===
                "function"
                ? getLocationMasteryPercent(
                    location.id
                )
                : 0;

        const masteryPercentText =
            Math.floor(
                masteryPercent
            ) +
            "%";

        const masteryKills =
            Math.min(
                totalKills,
                typeof LOCATION_MASTERY_REQUIRED_KILLS !==
                    "undefined"
                    ? LOCATION_MASTERY_REQUIRED_KILLS
                    : 200
            );

        const requiredMasteryKills =
            typeof LOCATION_MASTERY_REQUIRED_KILLS !==
                "undefined"
                ? LOCATION_MASTERY_REQUIRED_KILLS
                : 200;

        const masteryRank =
            getLocationMasteryRank(
                masteryPercent
            );

        const bossChance = progress.bossChance || 0;
        const bossChanceText = Number.isInteger(bossChance)
            ? bossChance + "%"
            : bossChance.toFixed(1) + "%";

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "location-card";

        div.dataset.locationId =
            location.id;

        if (!isUnlocked) {
            div.classList.add("location-locked");
        }

        if (isCurrentLocation) {
            div.classList.add("location-current");
        }

        div.innerHTML = `
            <div class="location-card-top">
                <div>
                    <div class="location-status">
                        ${isCurrentLocation ? "📍 Aktualna lokacja" : isUnlocked ? "Odblokowana" : "Zablokowana"}
                    </div>

                    <h3>${location.name}</h3>
                </div>

                <div class="location-level-badge">
                    Lv. ${requiredLevel}
                </div>
            </div>

            <p class="location-description">${location.description}</p>

<div class="location-info-grid">
    <div class="location-info-box">
        <span>Zalecany poziom</span>

        <strong>
            ${location.recommendedLevel ||
            requiredLevel
            }
        </strong>
    </div>

<div class="location-info-box">
    <span>Pokonani</span>

    <strong
        class="location-total-kills"
    >
        ${totalKills}
    </strong>
</div>

<div class="location-info-box">
    <span>Bossowie</span>

    <strong
        class="location-boss-kills"
    >
        ${bossKills}
    </strong>
</div>

<div class="location-info-box">
    <span>Szansa bossa</span>

    <strong
        class="location-boss-chance"
    >
        ${bossChanceText}
    </strong>
</div>

<div class="location-info-box">
    <span>Elity</span>

    <strong
        class="location-elite-kills"
    >
        ${eliteKills}
    </strong>
</div>

<div class="location-info-box">
    <span>Skrzynie</span>

    <strong
        class="location-chests-found"
    >
        ${chestsFound}
    </strong>
</div>
</div>

<div class="location-mastery-panel">
    <div class="location-mastery-header">
        <div>
            <span>
                🏹 Opanowanie lokacji
            </span>

<strong
    class="location-mastery-rank"
>
    ${masteryRank}
</strong>
        </div>

        <strong
            class="
                location-mastery-percent
            "
        >
            ${masteryPercentText}
        </strong>
    </div>

    <div class="location-mastery-track">
        <div
            class="
                location-mastery-fill
            "
            style="
                width:
                ${masteryPercent}%
            "
        ></div>
    </div>

    <div class="location-mastery-footer">
<span
    class="location-mastery-kills"
>
    ${masteryKills}
    /
    ${requiredMasteryKills}
    zwycięstw
</span>

        <span>
            Następny etap polowania
        </span>
    </div>

    <div
        class="
            location-mastery-milestones
        "
    >
        ${getLocationMasteryMilestonesHtml(
                masteryPercent
            )}
    </div>


</div>
${getLocationBossPanelHtml(
    location,
    progress
)}
            <button 
                class="location-enter-btn"
                onclick="enterLocation('${location.id}')"
                ${isUnlocked ? "" : "disabled"}
            >
                ${isUnlocked ? "Wejdź do lokacji" : "Wymaga poziomu " + requiredLevel}
            </button>
        `;

        container.appendChild(div);
    });
}

function refreshLocationProgressInterface(
    locationId = player.location
) {
    const locationCard = Array
        .from(
            document.querySelectorAll(
                ".location-card"
            )
        )
        .find(card => {
            return (
                card.dataset
                    .locationId ===
                locationId
            );
        });

    /*
     * Kafelki nie zostały jeszcze
     * utworzone albo ekran nie istnieje.
     */
    if (!locationCard) {
        return;
    }

    const progress =
        typeof ensureLocationProgress ===
            "function"
            ? ensureLocationProgress(
                locationId
            )
            : null;

    if (!progress) {
        return;
    }

    const location =
    locations[locationId];

    const totalKills =
        Math.max(
            0,
            Number(
                progress.totalKills
            ) || 0
        );

    const bossKills =
        Math.max(
            0,
            Number(
                progress.bossKills
            ) || 0
        );

    const eliteKills =
        Math.max(
            0,
            Number(
                progress.eliteKills
            ) || 0
        );

    const chestsFound =
        Math.max(
            0,
            Number(
                progress.chestsFound
            ) || 0
        );

    const bossChance =
        Math.max(
            0,
            Number(
                progress.bossChance
            ) || 0
        );

    const masteryPercent =
        typeof getLocationMasteryPercent ===
            "function"
            ? getLocationMasteryPercent(
                locationId
            )
            : 0;

    const requiredKills =
        typeof LOCATION_MASTERY_REQUIRED_KILLS !==
            "undefined"
            ? LOCATION_MASTERY_REQUIRED_KILLS
            : 200;

    const masteryKills =
        Math.min(
            totalKills,
            requiredKills
        );

    const totalKillsElement =
        locationCard.querySelector(
            ".location-total-kills"
        );

    const bossKillsElement =
        locationCard.querySelector(
            ".location-boss-kills"
        );

    const bossChanceElement =
        locationCard.querySelector(
            ".location-boss-chance"
        );


    const eliteKillsElement =
        locationCard.querySelector(
            ".location-elite-kills"
        );

    const chestsFoundElement =
        locationCard.querySelector(
            ".location-chests-found"
        );

    const masteryRankElement =
        locationCard.querySelector(
            ".location-mastery-rank"
        );

    const masteryPercentElement =
        locationCard.querySelector(
            ".location-mastery-percent"
        );

    const masteryFillElement =
        locationCard.querySelector(
            ".location-mastery-fill"
        );

    const masteryKillsElement =
        locationCard.querySelector(
            ".location-mastery-kills"
        );

    const milestonesElement =
        locationCard.querySelector(
            ".location-mastery-milestones"
        );
    const bossPanelElement =
    locationCard.querySelector(
        ".location-boss-panel"
    );
    if (totalKillsElement) {
        totalKillsElement.textContent =
            totalKills;
    }

    if (bossKillsElement) {
        bossKillsElement.textContent =
            bossKills;
    }

    if (bossChanceElement) {
        bossChanceElement.textContent =
            Number.isInteger(
                bossChance
            )
                ? bossChance + "%"
                : bossChance
                    .toFixed(1)
                    .replace(".", ",") +
                "%";
    }
    if (eliteKillsElement) {
        eliteKillsElement.textContent =
            eliteKills;
    }

    if (chestsFoundElement) {
        chestsFoundElement.textContent =
            chestsFound;
    }
    if (masteryRankElement) {
        masteryRankElement.textContent =
            getLocationMasteryRank(
                masteryPercent
            );
    }

    if (masteryPercentElement) {
        masteryPercentElement.textContent =
            Math.floor(
                masteryPercent
            ) +
            "%";
    }

    if (masteryFillElement) {
        masteryFillElement.style.width =
            masteryPercent +
            "%";
    }

    if (masteryKillsElement) {
        masteryKillsElement.textContent =
            masteryKills +
            " / " +
            requiredKills +
            " zwycięstw";
    }

    if (milestonesElement) {
        milestonesElement.innerHTML =
            getLocationMasteryMilestonesHtml(
                masteryPercent
            );
    }
    if (
    bossPanelElement &&
    location
) {
    bossPanelElement.outerHTML =
        getLocationBossPanelHtml(
            location,
            progress
        );
}

}

function enterLocation(locationId) {
    const location =
        locations[locationId];

    /*
     * Najpierw sprawdzamy, czy
     * lokacja rzeczywiście istnieje.
     */
    if (!location) {
        console.warn(
            "Nie znaleziono lokacji:",
            locationId
        );

        return;
    }

    const requiredLevel =
        location.requiredLevel || 1;

    if (
        player.level <
        requiredLevel
    ) {
        if (
            typeof addCombatLog ===
            "function"
        ) {
            addCombatLog(
                "🔒 Ta lokacja wymaga poziomu " +
                requiredLevel +
                "."
            );
        }

        console.warn(
            "Za niski poziom do lokacji:",
            location.name
        );

        return;
    }

    const changingLocation =
        player.location !== locationId;


    if (
        changingLocation &&
        typeof stopFight ===
        "function"
    ) {
        stopFight();
    }

    player.location =
        locationId;

    player.isBossFight =
        false;

    if (
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "📍 Przeniesiono do lokacji: " +
            location.name +
            ".",
            "location"
        );
    }

    /*
     * Tylko jedna deklaracja progress.
     */
    const progress =
        ensureLocationProgress(
            locationId
        );

    player.bossKillsCounter =
        progress.bossKillsCounter;

    player.bossChance =
        progress.bossChance;

    if (
        changingLocation ||
        !player.currentEnemy
    ) {
        spawnEnemy();
    }

    if (
        typeof clearCombatLog ===
        "function"
    ) {
        clearCombatLog();
    }

    if (
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(
            "📍 Przeniesiono do lokacji: " +
            location.name +
            "."
        );

        addCombatLog(
            "👹 Pojawił się przeciwnik: " +
            enemy.name +
            "."
        );
    }

    saveGame();

    showScreen(
        "screen-combat"
    );

    render();
}

function openHuntingScreen() {
    if (
        player.isFighting === true
    ) {
        showScreen(
            "screen-combat"
        );

        return;
    }

    showScreen(
        "screen-hunting"
    );

    if (
        typeof renderLocations ===
        "function"
    ) {
        renderLocations();
    }
}
function openHuntingScreen() {
    if (isFighting) {
        showScreen("screen-combat");
        return;
    }

    showScreen("screen-hunting");
}

function openHuntingScreen() {
    if (
        player.isFighting === true
    ) {
        showScreen(
            "screen-combat"
        );

        return;
    }

    showScreen(
        "screen-hunting"
    );

    if (
        typeof renderLocations ===
        "function"
    ) {
        renderLocations();
    }
}

function showHuntingLocationsScreen() {
    showScreen(
        "screen-hunting"
    );

    if (
        typeof renderLocations ===
        "function"
    ) {
        renderLocations();
    }

    /*
     * Jeżeli walka trwa,
     * odświeżamy tylko wygląd lokacji.
     * Nie zatrzymujemy walki.
     */
    if (
        typeof refreshLocationProgressInterface ===
        "function"
    ) {
        refreshLocationProgressInterface(
            player.location
        );
    }
}