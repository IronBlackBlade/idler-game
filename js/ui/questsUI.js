const savedQuestLocationFilter =
    localStorage.getItem(
        "idler_quest_location_filter"
    );

let currentQuestLocationFilter =
    savedQuestLocationFilter ||
    "all";

function getQuestFilterId(
    quest
) {
    if (!quest) {
        return null;
    }

    if (quest.activityId) {
        return quest.activityId;
    }

    return getQuestLocationId(
        quest
    );
}

function setQuestLocationFilter(
    locationId
) {
    currentQuestLocationFilter =
        locationId ||
        "all";

    localStorage.setItem(
        "idler_quest_location_filter",
        currentQuestLocationFilter
    );

    renderQuests();
}

function updateQuestMenuHighlight() {
    /*
     * Najpierw pobieramy aktualne
     * zabójstwa z Dziennika.
     */
    quests.forEach(
        quest => {
            syncQuestProgressWithBestiary(
                quest
            );
        }
    );

    const questButton =
        document.getElementById(
            "menu-quests-button"
        );

    if (!questButton) {
        return;
    }

    const claimableQuestCount =
        quests.filter(quest => {
            const requiredLevel =
                Number(
                    quest.requiredLevel
                ) || 1;

            return (
                player.level >=
                requiredLevel &&
                isQuestUnlocked(
                    quest
                ) &&
                quest.completed &&
                !quest.claimed
            );
        }).length;

    const hasClaimableQuest =
        claimableQuestCount > 0;

    questButton.classList.toggle(
        "quest-reward-ready",
        hasClaimableQuest
    );

    if (hasClaimableQuest) {
        questButton.title =
            "Nagrody do odebrania: " +
            claimableQuestCount;
    } else {
        questButton.title =
            "";
    }
}

function updateQuestCard(
    quest
) {
    if (!quest) {
        return false;
    }

    const questCard =
        document.querySelector(
            '[data-quest-id="' +
            quest.id +
            '"]'
        );

    if (!questCard) {
        return false;
    }

    const progress =
        Math.max(
            0,
            Number(
                quest.currentKills
            ) || 0
        );

    const required =
        Math.max(
            1,
            Number(
                quest.requiredKills
            ) || 1
        );

    const progressPercent =
        Math.min(
            100,
            (
                progress /
                required
            ) * 100
        );

    const statusElement =
        questCard.querySelector(
            "[data-quest-status]"
        );

    const progressElement =
        questCard.querySelector(
            "[data-quest-progress]"
        );

    const progressFill =
        questCard.querySelector(
            "[data-quest-progress-fill]"
        );

    const actionElement =
        questCard.querySelector(
            "[data-quest-action]"
        );

    let statusText =
        "W trakcie";

    if (
        quest.completed &&
        !quest.claimed
    ) {
        statusText =
            "Gotowe";
    }

    if (quest.claimed) {
        statusText =
            "Ukończone ✅";
    }

    if (statusElement) {
        statusElement.textContent =
            statusText;
    }

    if (progressElement) {
        progressElement.textContent =
            progress +
            "/" +
            required;
    }

    if (progressFill) {
        progressFill.style.width =
            progressPercent +
            "%";
    }

    questCard.classList.toggle(
        "quest-completed",
        quest.completed &&
        !quest.claimed
    );

    questCard.classList.toggle(
        "quest-claimed",
        quest.claimed === true
    );

    if (actionElement) {
        if (
            quest.completed &&
            !quest.claimed
        ) {
            if (
                !actionElement
                    .querySelector(
                        "button"
                    )
            ) {
                actionElement.innerHTML = `
                    <button
                        onclick="claimQuestReward(
                            '${quest.id}'
                        )"
                    >
                        Odbierz nagrodę
                    </button>
                `;
            }
        } else {
            actionElement.innerHTML =
                "";
        }
    }

    return true;
}

function getQuestCompletionSummary(
    locationId = "all"
) {
    const matchingQuests =
        quests.filter(quest => {
            const requiredLevel =
                Number(
                    quest.requiredLevel
                ) || 1;

            if (
                player.level <
                requiredLevel
            ) {
                return false;
            }

            if (
                locationId ===
                "all"
            ) {
                return true;
            }

            return (
                getQuestFilterId(
                    quest
                ) ===
                locationId
            );
        });

    const completedStages =
        matchingQuests.filter(
            quest => {
                return (
                    quest.claimed ===
                    true
                );
            }
        ).length;

    const totalStages =
        matchingQuests.length;

    const completionPercent =
        totalStages > 0
            ? (
                completedStages /
                totalStages
            ) * 100
            : 0;

    return {
        completedStages,
        totalStages,
        completionPercent
    };
}

function renderQuests() {
    const container = document.getElementById("quests");
    if (!container) return;

    container.innerHTML = "";
    quests.forEach(
        quest => {
            syncQuestProgressWithBestiary(
                quest
            );
        }
    );

    const allQuestLocations =
        typeof locations !==
            "undefined"
            ? Object.values(
                locations
            )
            : [];

    const unlockedQuestLocations =
        allQuestLocations.filter(
            location => {
                const requiredLevel =
                    Number(
                        location.requiredLevel
                    ) || 1;

                return (
                    player.level >=
                    requiredLevel
                );
            }
        );

    const allowedLocationFilters = [
        "all",
        "mining",
        "herbalism",
        "alchemy",
        "crafting",

        ...unlockedQuestLocations.map(
            location => {
                return location.id;
            }
        )
    ];

    if (
        !allowedLocationFilters.includes(
            currentQuestLocationFilter
        )
    ) {
        currentQuestLocationFilter =
            "all";

        localStorage.setItem(
            "idler_quest_location_filter",
            "all"
        );
    }

    const visibleQuests =
        quests.filter(quest => {
            if (
                !isQuestUnlocked(
                    quest
                )
            ) {
                return false;
            }

            if (
                shouldHideClaimedQuestStage(
                    quest
                )
            ) {
                return false;
            }
            const requiredLevel =
                Number(
                    quest.requiredLevel
                ) || 1;

            if (
                player.level <
                requiredLevel
            ) {
                return false;
            }

            if (
                currentQuestLocationFilter ===
                "all"
            ) {
                return true;
            }

            return (
                getQuestFilterId(
                    quest
                ) ===
                currentQuestLocationFilter
            );
        });

    const claimableQuests =
        quests.filter(quest => {
            const requiredLevel =
                Number(
                    quest.requiredLevel
                ) || 1;

            return (
                player.level >=
                requiredLevel &&
                quest.completed &&
                !quest.claimed
            );
        });

    const actionsContainer =
        document.createElement("div");

    actionsContainer.className =
        "quest-actions";

    const claimAllButton =
        document.createElement("button");

    claimAllButton.className =
        "quest-claim-all-button";

    claimAllButton.type = "button";

    if (claimableQuests.length > 0) {
        claimAllButton.textContent =
            "🎁 Odbierz wszystkie (" +
            claimableQuests.length +
            ")";

        claimAllButton.disabled = false;
    } else {
        claimAllButton.textContent =
            "Brak nagród do odebrania";

        claimAllButton.disabled = true;
    }

    claimAllButton.addEventListener(
        "click",
        claimAllQuestRewards
    );

    actionsContainer.appendChild(
        claimAllButton
    );

    container.appendChild(
        actionsContainer
    );

    const filtersContainer =
        document.createElement(
            "div"
        );

    filtersContainer.className =
        "quest-location-filters";

    const filterDefinitions = [
        {
            id: "all",
            name: "📜 Wszystkie"
        },


        ...unlockedQuestLocations.map(
            location => {
                return {
                    id: location.id,
                    name: location.name
                };
            }
        )
        ,
        {
            id: "mining",
            name: "⛏️ Kopalnia"
        },
        {
            id: "herbalism",
            name: "🌿 Zielarstwo"
        },
        {
            id: "alchemy",
            name: "🧪 Alchemia"
        },
        {
            id: "crafting",
            name: "🛠️ Crafting"
        }
    ];

    filterDefinitions.forEach(
        filterDefinition => {
            const filterButton =
                document.createElement(
                    "button"
                );

            filterButton.type =
                "button";

            filterButton.className =
                "quest-location-filter-button";

            filterButton.textContent =
                filterDefinition.name;

            if (
                currentQuestLocationFilter ===
                filterDefinition.id
            ) {
                filterButton.classList.add(
                    "active"
                );
            }

            filterButton.addEventListener(
                "click",
                () => {
                    setQuestLocationFilter(
                        filterDefinition.id
                    );
                }
            );

            filtersContainer.appendChild(
                filterButton
            );
        }
    );

    container.appendChild(
        filtersContainer
    );

    const selectedQuestLocation =
        currentQuestLocationFilter ===
            "all"
            ? null
            : unlockedQuestLocations.find(
                location => {
                    return (
                        location.id ===
                        currentQuestLocationFilter
                    );
                }
            );

    const completionSummary =
        getQuestCompletionSummary(
            currentQuestLocationFilter
        );

    const completionSummaryContainer =
        document.createElement(
            "div"
        );

    completionSummaryContainer.className =
        "quest-completion-summary";

    const activityCompletionTitles = {
        mining: "⛏️ Kopalnia",
        herbalism: "🌿 Zielarstwo",
        alchemy: "🧪 Alchemia",
        crafting: "🛠️ Crafting"
    };

    const completionTitle =
        activityCompletionTitles[
        currentQuestLocationFilter
        ] ||
        selectedQuestLocation?.name ||
        "📜 Wszystkie zadania";

    const completionPercentText =
        Math.floor(
            completionSummary
                .completionPercent
        ) + "%";

    completionSummaryContainer.innerHTML = `
    <div
        class="
            quest-completion-summary-header
        "
    >
        <div>
            <strong>
                ${completionTitle}
            </strong>

            <span>
                Ukończone etapy zadań
            </span>
        </div>

        <div
            class="
                quest-completion-summary-result
            "
        >
            <strong>
                ${completionSummary.completedStages}
                /
                ${completionSummary.totalStages}
            </strong>

            <span>
                ${completionPercentText}
            </span>
        </div>
    </div>

    <div
        class="
            quest-completion-summary-track
        "
    >
        <div
            class="
                quest-completion-summary-fill
            "
            style="
                width:
                ${completionSummary.completionPercent}%
            "
        ></div>
    </div>
`;

    container.appendChild(
        completionSummaryContainer
    );

    const sortedQuests =
        [...visibleQuests].sort((a, b) => {
            const getQuestOrder = (quest) => {
                if (quest.completed && !quest.claimed) return 1;
                if (!quest.completed && !quest.claimed) return 2;
                if (quest.claimed) return 3;
                return 4;
            };

            return getQuestOrder(a) - getQuestOrder(b);
        });

    sortedQuests.forEach(quest => {
        const div = document.createElement("div");
        div.className = "quest";

        div.dataset.questId =
            quest.id;

        if (quest.completed && !quest.claimed) {
            div.classList.add("quest-completed");
        }

        if (quest.claimed) {
            div.classList.add("quest-claimed");
        }

        const questName = quest.name || quest.title || "Zadanie";
        const questDescription = quest.description || "";

        const progress =
            quest.progress ??
            quest.current ??
            quest.count ??
            quest.currentKills ??
            quest.kills ??
            0;

        const required =
            quest.required ??
            quest.target ??
            quest.requiredAmount ??
            quest.requiredKills ??
            quest.targetKills ??
            1;

        const rewardExp = quest.rewardExp ?? quest.expReward ?? 0;
        const rewardGold = quest.rewardGold ?? quest.goldReward ?? 0;
        const rewardActivityExp =
            Math.max(
                0,
                Number(
                    quest.rewardActivityExp
                ) || 0
            );

        const activityRewardData = {
            mining: {
                icon: "⛏️",
                label: "EXP kopania"
            },

            herbalism: {
                icon: "🌿",
                label: "EXP zielarstwa"
            },

            alchemy: {
                icon: "🧪",
                label: "EXP alchemii"
            },

            crafting: {
                icon: "🛠️",
                label: "EXP craftingu"
            }
        }[
            quest.activityId
        ];

        const activityRewardHtml =
            activityRewardData &&
                rewardActivityExp > 0
                ? `
            <span>
                ${activityRewardData.icon}
                ${rewardActivityExp}
                ${activityRewardData.label}
            </span>
        `
                : "";

        const progressPercent = Math.min(100, (progress / required) * 100);

        let statusText = "W trakcie";
        let buttonHtml = "";

        if (quest.completed && !quest.claimed) {
            statusText = "Gotowe";
            buttonHtml = `<button onclick="claimQuestReward('${quest.id}')">Odbierz nagrodę</button>`;
        }

        if (quest.claimed) {
            statusText = "Ukończone ✅";
        }

        div.innerHTML = `
            <h3>${questName}</h3>

            <p>${questDescription}</p>

<div class="quest-progress-text">
    <span data-quest-status>
        ${statusText}
    </span>

    <strong data-quest-progress>
        ${progress}/${required}
    </strong>
</div>
<div class="quest-progress-bar">
    <div
        class="quest-progress-fill"
        data-quest-progress-fill
        style="width: ${progressPercent}%"
    ></div>
</div>

<div class="quest-reward">
    <span>
        ⭐ ${rewardExp} EXP
    </span>

    <span>
        💰 ${rewardGold} złota
    </span>

    ${activityRewardHtml}
</div>

            <div
    class="quest-action"
    data-quest-action
>
    ${buttonHtml}
</div>
        `;

        container.appendChild(div);
    });
}