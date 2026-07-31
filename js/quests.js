



function getQuestLocationId(
    quest
) {
    if (
        !quest ||
        typeof locations ===
        "undefined"
    ) {
        return null;
    }

    const matchedLocation =
        Object.values(
            locations
        ).find(location => {
            const isBossQuest =
                location.boss?.name ===
                quest.targetEnemyName;

            const isEnemyQuest =
                Array.isArray(
                    location.enemies
                ) &&
                location.enemies.some(
                    enemyData => {
                        return (
                            enemyData.name ===
                            quest.targetEnemyName
                        );
                    }
                );

            return (
                isBossQuest ||
                isEnemyQuest
            );
        });

    return (
        matchedLocation?.id ||
        null
    );
}




function isQuestUnlocked(
    quest
) {
    if (!quest.previousQuestId) {
        return true;
    }

    const previousQuest =
        quests.find(
            questData => {
                return (
                    questData.id ===
                    quest.previousQuestId
                );
            }
        );

    return (
        previousQuest?.claimed ===
        true
    );
}

function shouldHideClaimedQuestStage(
    quest
) {
    if (!quest.claimed) {
        return false;
    }

    const hasNextStage =
        quests.some(
            questData => {
                return (
                    questData
                        .previousQuestId ===
                    quest.id
                );
            }
        );

    return hasNextStage;
}

function getQuestEnemyData(
    quest
) {
    if (
        !quest ||
        typeof locations ===
        "undefined"
    ) {
        return null;
    }

    for (
        const location of
        Object.values(locations)
    ) {
        if (
            location.boss?.name ===
            quest.targetEnemyName
        ) {
            return location.boss;
        }

        const matchedEnemy =
            Array.isArray(
                location.enemies
            )
                ? location.enemies.find(
                    enemyData => {
                        return (
                            enemyData.name ===
                            quest.targetEnemyName
                        );
                    }
                )
                : null;

        if (matchedEnemy) {
            return matchedEnemy;
        }
    }

    return null;
}

function getQuestTotalEnemyKills(
    quest
) {
    const enemyData =
        getQuestEnemyData(
            quest
        );

    if (!enemyData) {
        return null;
    }

    const bestiaryEntry =
        player.journal
            ?.bestiary
        ?.[enemyData.id];

    return Math.max(
        0,
        Math.floor(
            Number(
                bestiaryEntry?.kills
            ) || 0
        )
    );
}


function getMiningQuestProgress(
    quest
) {
    if (
        !quest ||
        quest.activityId !==
        "mining"
    ) {
        return null;
    }

    if (
        typeof ensureMiningState ===
        "function"
    ) {
        ensureMiningState();
    }

    const statistics =
        player.mining
            ?.statistics;

    if (!statistics) {
        return 0;
    }

    const progressSources = {
        totalResources:
            statistics.totalResources,

        totalCycles:
            statistics.totalCycles,

        rareResources:
            statistics.rareResources,

        exceptionalResources:
            statistics
                .exceptionalResources,

        areaCycles:
            statistics.cyclesByArea?.[
            quest.targetAreaId
            ],

        miningLevel:
            player.mining.level
    };

    return Math.max(
        0,
        Math.floor(
            Number(
                progressSources[
                quest.progressSource
                ]
            ) || 0
        )
    );
}

function getHerbalismQuestProgress(
    quest
) {
    if (
        !quest ||
        quest.activityId !==
        "herbalism"
    ) {
        return null;
    }

    if (
        typeof ensureHerbalismState ===
        "function"
    ) {
        ensureHerbalismState();
    }

    const statistics =
        player.herbalism
            ?.statistics;

    if (!statistics) {
        return 0;
    }

    const progressSources = {
        totalIngredients:
            statistics
                .totalIngredients,

        totalCycles:
            statistics.totalCycles,

        rareIngredients:
            statistics
                .rareIngredients,

        exceptionalIngredients:
            statistics
                .exceptionalIngredients,

        ingredientByItem:
            statistics.ingredientsByItem?.[
            quest.targetItemId
            ],

        areaCycles:
            statistics.cyclesByArea?.[
            quest.targetAreaId
            ],

        herbalismLevel:
            player.herbalism.level
    };

    return Math.max(
        0,
        Math.floor(
            Number(
                progressSources[
                quest.progressSource
                ]
            ) || 0
        )
    );
}

function getAlchemyQuestProgress(
    quest
) {
    if (
        !quest ||
        quest.activityId !==
        "alchemy"
    ) {
        return null;
    }

    if (
        typeof ensureAlchemyState ===
        "function"
    ) {
        ensureAlchemyState();
    }

    const progressSources = {
        totalCrafted:
            player.alchemy
                ?.statistics
                ?.totalCrafted,

        alchemyLevel:
            player.alchemy?.level
    };

    return Math.max(
        0,
        Math.floor(
            Number(
                progressSources[
                quest.progressSource
                ]
            ) || 0
        )
    );
}

function getCraftingQuestProgress(
    quest
) {
    if (
        !quest ||
        quest.activityId !==
        "crafting"
    ) {
        return null;
    }

    if (
        typeof ensureCraftingState ===
        "function"
    ) {
        ensureCraftingState();
    }

    const progressSources = {
        totalCrafted:
            player.crafting
                ?.statistics
                ?.totalCrafted,

        craftingLevel:
            player.crafting?.level
    };

    return Math.max(
        0,
        Math.floor(
            Number(
                progressSources[
                quest.progressSource
                ]
            ) || 0
        )
    );
}

function getFishingQuestProgress(
    quest
) {
    if (
        !quest ||
        quest.activityId !==
        "fishing"
    ) {
        return null;
    }

    if (
        typeof ensureFishingState ===
        "function"
    ) {
        ensureFishingState();
    }

    const statistics =
        player.fishing
            ?.statistics;

    const progressSources = {
        totalFish:
            statistics?.totalFish,

        rareFish:
            statistics?.rareFish,

        treasures:
            statistics?.treasures,

        totalOrdersCompleted:
            statistics
                ?.totalOrdersCompleted,

        fishByItem:
            statistics?.fishByItem?.[
                quest.targetItemId
            ],

        areaCycles:
            statistics?.cyclesByArea?.[
                quest.targetAreaId
            ],

        fishingLevel:
            player.fishing?.level
    };

    return Math.max(
        0,
        Math.floor(
            Number(
                progressSources[
                    quest.progressSource
                ]
            ) || 0
        )
    );
}

function getCookingQuestProgress(
    quest
) {
    if (
        !quest ||
        quest.activityId !==
        "cooking"
    ) {
        return null;
    }

    if (
        typeof ensureCookingState ===
        "function"
    ) {
        ensureCookingState();
    }

    const statistics =
        player.cooking
            ?.statistics;

    const progressSources = {
        totalMealsCooked:
            statistics
                ?.totalMealsCooked,

        mealsByItem:
            statistics?.mealsByItem?.[
                quest.targetItemId
            ],

        recipesById:
            statistics?.recipesById?.[
                quest.targetItemId
            ],

        tavernOrders:
            player.cooking
                ?.tavern
                ?.completedOrders,

        cookingLevel:
            player.cooking?.level
    };

    return Math.max(
        0,
        Math.floor(
            Number(
                progressSources[
                    quest.progressSource
                ]
            ) || 0
        )
    );
}

function syncQuestProgressWithBestiary(
    quest
) {
    if (
        !quest ||
        quest.claimed ||
        !isQuestUnlocked(
            quest
        )
    ) {
        return false;
    }

    const miningProgress =
        getMiningQuestProgress(
            quest
        );

    const herbalismProgress =
        getHerbalismQuestProgress(
            quest
        );

    const alchemyProgress =
        getAlchemyQuestProgress(
            quest
        );

    const craftingProgress =
        getCraftingQuestProgress(
            quest
        );

    const fishingProgress =
        getFishingQuestProgress(
            quest
        );

    const cookingProgress =
        getCookingQuestProgress(
            quest
        );

    const activityProgress =
        miningProgress !== null
            ? miningProgress
            : herbalismProgress !== null
                ? herbalismProgress
                : alchemyProgress !== null
                    ? alchemyProgress
                    : craftingProgress !== null
                        ? craftingProgress
                        : fishingProgress !== null
                            ? fishingProgress
                            : cookingProgress;

    const totalRecordedProgress =
        activityProgress !== null
            ? activityProgress
            : getQuestTotalEnemyKills(
                quest
            );

    if (
        totalRecordedProgress ===
        null
    ) {
        return false;
    }

    const requiredKills =
        Math.max(
            1,
            Number(
                quest.requiredKills
            ) || 1
        );

    const savedProgress =
        Math.max(
            0,
            Number(
                quest.currentKills
            ) || 0
        );

    const newProgress =
        Math.min(
            requiredKills,
            Math.max(
                savedProgress,
                totalRecordedProgress
            )
        );

    const wasChanged =
        quest.currentKills !==
        newProgress ||
        (
            newProgress >=
            requiredKills &&
            !quest.completed
        );

    quest.currentKills =
        newProgress;

    if (
        newProgress >=
        requiredKills
    ) {
        quest.completed = true;
    }

    return wasChanged;
}


function updateQuests(
    enemyName
) {
    const changedQuests = [];

    quests.forEach(
        quest => {

            if (
                !isQuestUnlocked(
                    quest
                )
            ) {
                return;
            }
            if (quest.claimed) {
                return;
            }

            if (quest.completed) {
                return;
            }

            if (
                quest.targetEnemyName !==
                enemyName
            ) {
                return;
            }

            quest.currentKills++;

            if (
                quest.currentKills >=
                quest.requiredKills
            ) {
                quest.currentKills =
                    quest.requiredKills;

                quest.completed =
                    true;

                if (
                    typeof addCombatLog ===
                    "function"
                ) {
                    addCombatLog(
                        "📜 Ukończono zadanie: " +
                        quest.title +
                        "."
                    );
                }
            }

            changedQuests.push(
                quest
            );
        }
    );


    if (
        changedQuests.length === 0
    ) {
        return;
    }

    updateQuestMenuHighlight();

    saveGame();

    let needsFullRefresh =
        false;

    changedQuests.forEach(
        quest => {
            const wasUpdated =
                updateQuestCard(
                    quest
                );

            if (!wasUpdated) {
                needsFullRefresh =
                    true;
            }
        }
    );

    /*
     * Awaryjne odświeżenie tylko wtedy,
     * gdy ekran jest otwarty, ale kafelka
     * z jakiegoś powodu jeszcze nie ma.
     */
    if (
        needsFullRefresh &&
        typeof refreshQuestsView ===
        "function"
    ) {
        refreshQuestsView();
    }
}



function claimQuestReward(questId) {
    const quest = quests.find(quest => quest.id === questId);

    if (!quest) {
        console.warn("Nie znaleziono zadania:", questId);
        return;
    }

    if (!quest.completed) {
        console.warn("Zadanie nie jest ukończone:", quest.title);
        return;
    }

    if (quest.claimed) {
        console.warn("Nagroda została już odebrana:", quest.title);
        return;
    }

    player.gold +=
        quest.rewardGold;

    player.exp +=
        quest.rewardExp;

    const activityExpReward =
        Math.max(
            0,
            Math.floor(
                Number(
                    quest.rewardActivityExp
                ) || 0
            )
        );

    if (
        quest.activityId ===
        "mining" &&
        activityExpReward > 0 &&
        typeof addMiningExp ===
        "function"
    ) {
        addMiningExp(
            activityExpReward
        );
    }
    if (
        quest.activityId ===
        "herbalism" &&
        activityExpReward > 0 &&
        typeof addHerbalismExp ===
        "function"
    ) {
        addHerbalismExp(
            activityExpReward
        );
    }
    if (
        quest.activityId ===
        "alchemy" &&
        activityExpReward > 0 &&
        typeof addAlchemyExp ===
        "function"
    ) {
        addAlchemyExp(
            activityExpReward
        );
    }

    if (
        quest.activityId ===
        "crafting" &&
        activityExpReward > 0 &&
        typeof addCraftingExp ===
        "function"
    ) {
        addCraftingExp(
            activityExpReward
        );
    }

    if (
        quest.activityId ===
        "fishing" &&
        activityExpReward > 0 &&
        typeof addFishingExp ===
        "function"
    ) {
        addFishingExp(
            activityExpReward
        );
    }

    if (
        quest.activityId ===
        "cooking" &&
        activityExpReward > 0 &&
        typeof addCookingExp ===
        "function"
    ) {
        addCookingExp(
            activityExpReward
        );
    }

    quest.claimed = true;

    updateQuestMenuHighlight();

    checkLevelUp();

    if (
        typeof checkJournalAchievements ===
        "function"
    ) {
        checkJournalAchievements();
    }

    if (typeof addCombatLog === "function") {
        addCombatLog("🎁 Odebrano nagrodę za zadanie: " + quest.title + ".");
        addCombatLog("⭐ +" + quest.rewardExp + " EXP, +" + quest.rewardGold + " złota.");
    }

    const questTitle =
        quest.title ||
        quest.name ||
        quest.description ||
        quest.id ||
        "Nieznane zadanie";

    const goldReward =
        quest.rewardGold ??
        quest.goldReward ??
        0;

    const expReward =
        quest.rewardExp ??
        quest.expReward ??
        0;

    if (typeof addSystemLog === "function") {
        addSystemLog(
            `📜 Ukończono zadanie: ${questTitle}. ` +
            `Otrzymano ${goldReward} złota i ${expReward} EXP.`,
            "quest"
        );
    }

    saveGame();
    render();

    if (
        typeof refreshQuestsView ===
        "function"
    ) {
        refreshQuestsView();
    }

}

function claimAllQuestRewards() {
    const claimableQuests = quests.filter(quest => {
        return quest.completed && !quest.claimed;
    });

    if (claimableQuests.length === 0) {
        if (typeof addSystemLog === "function") {
            addSystemLog(
                "📜 Brak ukończonych zadań do odebrania.",
                "quest"
            );
        }

        return;
    }

    let totalGold = 0;
    let totalExp = 0;
    let totalMiningExp = 0;
    let totalHerbalismExp = 0;
    let totalAlchemyExp = 0;
    let totalCraftingExp = 0;
    let totalFishingExp = 0;
    let totalCookingExp = 0;

    claimableQuests.forEach(quest => {
        const goldReward =
            quest.rewardGold ??
            quest.goldReward ??
            0;

        const expReward =
            quest.rewardExp ??
            quest.expReward ??
            0;

        totalGold += goldReward;
        totalExp += expReward;

        if (
            quest.activityId ===
            "mining"
        ) {
            totalMiningExp +=
                Math.max(
                    0,
                    Math.floor(
                        Number(
                            quest
                                .rewardActivityExp
                        ) || 0
                    )
                );
        }

        if (
            quest.activityId ===
            "herbalism"
        ) {
            totalHerbalismExp +=
                Math.max(
                    0,
                    Math.floor(
                        Number(
                            quest
                                .rewardActivityExp
                        ) || 0
                    )
                );
        }

        if (
            quest.activityId ===
            "alchemy"
        ) {
            totalAlchemyExp +=
                Math.max(
                    0,
                    Math.floor(
                        Number(
                            quest
                                .rewardActivityExp
                        ) || 0
                    )
                );
        }

        if (
            quest.activityId ===
            "crafting"
        ) {
            totalCraftingExp +=
                Math.max(
                    0,
                    Math.floor(
                        Number(
                            quest
                                .rewardActivityExp
                        ) || 0
                    )
                );
        }

        if (
            quest.activityId ===
            "fishing"
        ) {
            totalFishingExp +=
                Math.max(
                    0,
                    Math.floor(
                        Number(
                            quest
                                .rewardActivityExp
                        ) || 0
                    )
                );
        }

        if (
            quest.activityId ===
            "cooking"
        ) {
            totalCookingExp +=
                Math.max(
                    0,
                    Math.floor(
                        Number(
                            quest
                                .rewardActivityExp
                        ) || 0
                    )
                );
        }

        quest.claimed = true;
    });

    updateQuestMenuHighlight();

    player.gold += totalGold;
    player.exp += totalExp;

    if (
        totalMiningExp > 0 &&
        typeof addMiningExp ===
        "function"
    ) {
        addMiningExp(
            totalMiningExp
        );
    }

    if (
        totalHerbalismExp > 0 &&
        typeof addHerbalismExp ===
        "function"
    ) {
        addHerbalismExp(
            totalHerbalismExp
        );
    }

    if (
        totalAlchemyExp > 0 &&
        typeof addAlchemyExp ===
        "function"
    ) {
        addAlchemyExp(
            totalAlchemyExp
        );
    }

    if (
        totalCraftingExp > 0 &&
        typeof addCraftingExp ===
        "function"
    ) {
        addCraftingExp(
            totalCraftingExp
        );
    }

    if (
        totalFishingExp > 0 &&
        typeof addFishingExp ===
        "function"
    ) {
        addFishingExp(
            totalFishingExp
        );
    }

    if (
        totalCookingExp > 0 &&
        typeof addCookingExp ===
        "function"
    ) {
        addCookingExp(
            totalCookingExp
        );
    }

    if (typeof checkLevelUp === "function") {
        checkLevelUp();
    }

    if (
        typeof checkJournalAchievements ===
        "function"
    ) {
        checkJournalAchievements();
    }

    if (typeof addCombatLog === "function") {
        addCombatLog(
            "🎁 Odebrano nagrody za " +
            claimableQuests.length +
            " zadań."
        );

        addCombatLog(
            "⭐ +" +
            totalExp +
            " EXP, +" +
            totalGold +
            " złota."
        );
    }

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "📜 Odebrano nagrody za " +
            claimableQuests.length +
            " zadań. Otrzymano " +
            totalGold +
            " złota i " +
            totalExp +
            " EXP.",
            "quest"
        );
    }

    saveGame();

    if (
        typeof renderPlayerHud ===
        "function"
    ) {
        renderPlayerHud();
    }

    if (
        typeof refreshQuestsView ===
        "function"
    ) {
        refreshQuestsView();
    }
}

function resetQuests() {
    quests.forEach(quest => {
        quest.currentKills = 0;
        quest.completed = false;
        quest.claimed = false;
    });
}

