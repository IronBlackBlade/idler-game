const questCategoryIds = [
    "all",
    "hunting",
    "mining",
    "herbalism",
    "fishing",
    "alchemy",
    "cooking",
    "crafting"
];

const legacyQuestFilter =
    localStorage.getItem(
        "idler_quest_location_filter"
    );

const savedQuestCategoryFilter =
    localStorage.getItem(
        "idler_quest_category_filter"
    );

const savedHuntingLocationFilter =
    localStorage.getItem(
        "idler_quest_hunting_location_filter"
    );

let currentQuestCategoryFilter =
    questCategoryIds.includes(
        savedQuestCategoryFilter
    )
        ? savedQuestCategoryFilter
        : questCategoryIds.includes(
            legacyQuestFilter
        )
            ? legacyQuestFilter
            : legacyQuestFilter &&
                legacyQuestFilter !== "all"
                ? "hunting"
                : "all";

let currentQuestHuntingLocationFilter =
    savedHuntingLocationFilter ||
    (
        legacyQuestFilter &&
            !questCategoryIds.includes(
                legacyQuestFilter
            )
            ? legacyQuestFilter
            : "all"
    );

function getQuestCategoryId(quest) {
    if (!quest) {
        return null;
    }

    return quest.activityId ||
        "hunting";
}

function setQuestCategoryFilter(
    categoryId
) {
    currentQuestCategoryFilter =
        questCategoryIds.includes(
            categoryId
        )
            ? categoryId
            : "all";

    localStorage.setItem(
        "idler_quest_category_filter",
        currentQuestCategoryFilter
    );

    renderQuests();
}

function setQuestHuntingLocationFilter(
    locationId
) {
    currentQuestHuntingLocationFilter =
        locationId ||
        "all";

    localStorage.setItem(
        "idler_quest_hunting_location_filter",
        currentQuestHuntingLocationFilter
    );

    renderQuests();
}

function doesQuestMatchFilters(
    quest,
    categoryId =
        currentQuestCategoryFilter,
    huntingLocationId =
        currentQuestHuntingLocationFilter
) {
    if (
        categoryId === "all"
    ) {
        return true;
    }

    if (
        getQuestCategoryId(quest) !==
        categoryId
    ) {
        return false;
    }

    if (
        categoryId !== "hunting" ||
        huntingLocationId === "all"
    ) {
        return true;
    }

    return (
        getQuestLocationId(quest) ===
        huntingLocationId
    );
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

    const characterCategory =
        questButton.closest(
            "[data-menu-category]"
        );

    if (characterCategory) {
        characterCategory.classList.toggle(
            "has-claimable-quest",
            hasClaimableQuest
        );

        const categoryToggle =
            characterCategory.querySelector(
                ".menu-category-toggle"
            );

        if (categoryToggle) {
            categoryToggle.title =
                hasClaimableQuest
                    ? "Nagrody za zadania do odebrania: " +
                    claimableQuestCount
                    : "";
        }
    }

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
    categoryId = "all",
    huntingLocationId = "all"
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

            return doesQuestMatchFilters(
                quest,
                categoryId,
                huntingLocationId
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

    const allowedHuntingLocationFilters = [
        "all",
        ...unlockedQuestLocations.map(
            location => {
                return location.id;
            }
        )
    ];

    if (
        !allowedHuntingLocationFilters.includes(
            currentQuestHuntingLocationFilter
        )
    ) {
        currentQuestHuntingLocationFilter =
            "all";

        localStorage.setItem(
            "idler_quest_hunting_location_filter",
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

            return doesQuestMatchFilters(
                quest,
                currentQuestCategoryFilter,
                currentQuestHuntingLocationFilter
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

    const categoryTabs =
        document.createElement("div");

    categoryTabs.className =
        "quest-category-tabs";

    const categoryDefinitions = [
        {
            id: "all",
            icon: "📜",
            name: "Wszystkie"
        },
        {
            id: "hunting",
            icon: "⚔️",
            name: "Polowanie"
        },
        {
            id: "mining",
            icon: "⛏️",
            name: "Kopalnia"
        },
        {
            id: "herbalism",
            icon: "🌿",
            name: "Zielarstwo"
        },
        {
            id: "fishing",
            icon: "🎣",
            name: "Łowienie"
        },
        {
            id: "alchemy",
            icon: "🧪",
            name: "Alchemia"
        },
        {
            id: "cooking",
            icon: "🍳",
            name: "Gotowanie"
        },
        {
            id: "crafting",
            icon: "🛠️",
            name: "Wytwarzanie"
        }
    ];

    categoryDefinitions.forEach(
        definition => {
            const summary =
                getQuestCompletionSummary(
                    definition.id,
                    "all"
                );
            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";
            button.className =
                "quest-category-tab-button";
            button.innerHTML = `
                <span>
                    ${definition.icon}
                    ${definition.name}
                </span>
                <small>
                    ${summary.completedStages}/${summary.totalStages}
                </small>
            `;

            if (
                currentQuestCategoryFilter ===
                definition.id
            ) {
                button.classList.add("active");
            }

            button.addEventListener(
                "click",
                () => {
                    setQuestCategoryFilter(
                        definition.id
                    );
                }
            );

            categoryTabs.appendChild(button);
        }
    );

    container.appendChild(categoryTabs);

    if (
        currentQuestCategoryFilter ===
        "hunting"
    ) {
        const locationSubtabs =
            document.createElement("div");

        locationSubtabs.className =
            "quest-location-subtabs";

        const locationDefinitions = [
            {
                id: "all",
                name: "Wszystkie lokacje"
            },
            ...unlockedQuestLocations.map(
                location => {
                    return {
                        id: location.id,
                        name: location.name
                    };
                }
            )
        ];

        locationDefinitions.forEach(
            definition => {
                const button =
                    document.createElement(
                        "button"
                    );

                button.type = "button";
                button.className =
                    "quest-location-subtab-button";
                button.textContent =
                    definition.name;

                if (
                    currentQuestHuntingLocationFilter ===
                    definition.id
                ) {
                    button.classList.add(
                        "active"
                    );
                }

                button.addEventListener(
                    "click",
                    () => {
                        setQuestHuntingLocationFilter(
                            definition.id
                        );
                    }
                );

                locationSubtabs.appendChild(
                    button
                );
            }
        );

        container.appendChild(
            locationSubtabs
        );
    }

    const completionSummary =
        getQuestCompletionSummary(
            currentQuestCategoryFilter,
            currentQuestHuntingLocationFilter
        );

    const completionSummaryContainer =
        document.createElement(
            "div"
        );

    completionSummaryContainer.className =
        "quest-completion-summary";

    const completionTitles = {
        all: "📜 Wszystkie zadania",
        hunting: "⚔️ Polowanie",
        mining: "⛏️ Kopalnia",
        herbalism: "🌿 Zielarstwo",
        fishing: "🎣 Łowienie",
        alchemy: "🧪 Alchemia",
        cooking: "🍳 Gotowanie",
        crafting: "🛠️ Wytwarzanie"
    };

    const selectedQuestLocation =
        currentQuestCategoryFilter ===
            "hunting" &&
            currentQuestHuntingLocationFilter !==
            "all"
            ? unlockedQuestLocations.find(
                location => {
                    return (
                        location.id ===
                        currentQuestHuntingLocationFilter
                    );
                }
            )
            : null;

    const completionTitle =
        selectedQuestLocation?.name ||
        completionTitles[
        currentQuestCategoryFilter
        ];

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

    if (sortedQuests.length === 0) {
        const emptyState =
            document.createElement("div");

        emptyState.className =
            "quest-empty-state";
        emptyState.innerHTML = `
            <span>📜</span>
            <strong>Brak zadań w tej sekcji</strong>
            <p>
                Kolejne zadania pojawią się po odblokowaniu
                następnego etapu lub lokacji.
            </p>
        `;

        container.appendChild(emptyState);
    }

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

        const baseRewardExp =
            Math.max(
                0,
                Number(
                    quest.rewardExp ??
                    quest.expReward ??
                    0
                ) || 0
            );

        const rewardExp =
            typeof getFinalQuestHeroExperience ===
                "function"
                ? getFinalQuestHeroExperience(
                    quest
                )
                : baseRewardExp;

        const baseRewardActivityExp =
            Math.max(
                0,
                Number(
                    quest.rewardActivityExp
                ) || 0
            );

        const rewardActivityExp =
            typeof getFinalQuestActivityExperience ===
                "function"
                ? getFinalQuestActivityExperience(
                    quest
                )
                : baseRewardActivityExp;

        const hasQuestExperienceBonus =
            rewardExp >
            baseRewardExp ||
            rewardActivityExp >
            baseRewardActivityExp;
        const baseRewardGold =
            typeof getQuestBaseGoldReward ===
                "function"
                ? getQuestBaseGoldReward(
                    quest
                )
                : Math.max(
                    0,
                    Number(
                        quest.rewardGold ??
                        quest.goldReward ??
                        0
                    ) || 0
                );

        const rewardGold =
            typeof getFinalQuestGoldReward ===
                "function"
                ? getFinalQuestGoldReward(
                    quest
                )
                : baseRewardGold;

        const hasTradeRewardBonus =
            rewardGold >
            baseRewardGold;

        const tradeRewardBonus =
            Math.max(
                0,
                rewardGold -
                baseRewardGold
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
            },

            fishing: {
                icon: "🎣",
                label: "EXP łowienia"
            },

            cooking: {
                icon: "🍳",
                label: "EXP gotowania"
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
<span
    class="
        ${hasTradeRewardBonus
                ? "quest-gold-reward-bonus"
                : ""
            }
    "
>
    💰

    ${hasTradeRewardBonus
                ? `
            <del>
                ${baseRewardGold.toLocaleString(
                    "pl-PL"
                )}
            </del>

            <strong>
                ${rewardGold.toLocaleString(
                    "pl-PL"
                )} złota
            </strong>
        `
                : `
            ${rewardGold.toLocaleString(
                    "pl-PL"
                )} złota
        `
            }
</span>

${hasQuestExperienceBonus
    ? `
        <span class="quest-experience-reward-bonus">
            📚 Doświadczony zleceniobiorca:
            +${getQuestExperienceBonus()}% EXP
        </span>
    `
    : ""
}

${hasTradeRewardBonus
                ? `
        <span class="quest-trade-reward-bonus">
            📜 Renoma kupiecka:
            +${tradeRewardBonus.toLocaleString(
                    "pl-PL"
                )} złota
        </span>
    `
                : ""
            }
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
