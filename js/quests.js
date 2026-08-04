/*
 * Centralne mnożniki złota za zadania.
 *
 * Wartości zapisane w danych zadań
 * pozostają bez zmian. Tutaj ustalamy,
 * jaka część nagrody zostanie faktycznie
 * wypłacona graczowi.
 */
const QUEST_GOLD_MULTIPLIERS =
    Object.freeze({
        /*
         * Zadania bojowe.
         */
        hunting: 0.5,
        combat: 0.5,
        boss: 0.7,

        /*
         * Zadania podstawowych profesji.
         */
        mining: 0.3,
        herbalism: 0.3,
        fishing: 0.3,

        /*
         * Zadania produkcyjne.
         */
        alchemy: 0.2,
        crafting: 0.2,
        cooking: 0.2,

        /*
         * Zabezpieczenie dla nieznanego
         * rodzaju zadania.
         */
        default: 0.4
    });

function getQuestRawGoldReward(
    quest
) {
    if (!quest) {
        return 0;
    }

    return Math.max(
        0,
        Math.floor(
            Number(
                quest.rewardGold ??
                quest.goldReward ??
                0
            ) || 0
        )
    );
}

function isBossGoldQuest(
    quest
) {
    if (
        !quest ||
        !quest.targetEnemyName ||
        typeof locations ===
            "undefined"
    ) {
        return false;
    }

    return Object.values(
        locations
    ).some(location => {
        return (
            location?.boss?.name ===
            quest.targetEnemyName
        );
    });
}

function getQuestGoldMultiplier(
    quest
) {
    if (!quest) {
        return 0;
    }

    /*
     * Zadanie bossa ma pierwszeństwo
     * przed zwykłym mnożnikiem polowania.
     */
    if (
        isBossGoldQuest(
            quest
        )
    ) {
        return (
            QUEST_GOLD_MULTIPLIERS
                .boss
        );
    }

    /*
     * Zadania polowania zazwyczaj nie
     * mają activityId, dlatego używamy
     * "hunting" jako wartości domyślnej.
     */
    const activityId =
        quest.activityId ||
        "hunting";

    return (
        QUEST_GOLD_MULTIPLIERS[
            activityId
        ] ??
        QUEST_GOLD_MULTIPLIERS
            .default
    );
}

function getQuestBaseGoldReward(
    quest
) {
    const rawReward =
        getQuestRawGoldReward(
            quest
        );

    if (rawReward <= 0) {
        return 0;
    }

    const multiplier =
        getQuestGoldMultiplier(
            quest
        );

    /*
     * Jeżeli zadanie miało nagrodę,
     * gwarantujemy przynajmniej 1 złota.
     */
    return Math.max(
        1,
        Math.floor(
            rawReward *
            multiplier
        )
    );
}

function getFinalQuestGoldReward(
    quest
) {
    const baseReward =
        getQuestBaseGoldReward(
            quest
        );

    if (
        typeof getFinalTradeOrderGoldReward ===
        "function"
    ) {
        return getFinalTradeOrderGoldReward(
            baseReward
        );
    }
    return baseReward;
}

function getFinalQuestHeroExperience(
    quest
) {
    if (!quest) {
        return 0;
    }

    const baseExperience =
        Math.max(
            0,
            Math.floor(
                Number(
                    quest.rewardExp ??
                    quest.expReward ??
                    0
                ) || 0
            )
        );

    const bonus =
        typeof getQuestExperienceBonus ===
            "function"
            ? getQuestExperienceBonus()
            : 0;

    return Math.max(
        0,
        Math.floor(
            baseExperience *
            (
                1 +
                bonus /
                100
            )
        )
    );
}

function getFinalQuestActivityExperience(
    quest
) {
    if (!quest) {
        return 0;
    }

    const baseExperience =
        Math.max(
            0,
            Math.floor(
                Number(
                    quest.rewardActivityExp
                ) || 0
            )
        );

    const bonus =
        typeof getQuestExperienceBonus ===
            "function"
            ? getQuestExperienceBonus()
            : 0;

    return Math.max(
        0,
        Math.floor(
            baseExperience *
            (
                1 +
                bonus /
                100
            )
        )
    );
}

function getQuestTimelyCompletionResult(
    quest
) {
    const heroExperience =
        getFinalQuestHeroExperience(
            quest
        );

    const activityExperience =
        getFinalQuestActivityExperience(
            quest
        );

    /*
     * Jest to nagroda po doliczeniu
     * Renomy kupieckiej.
     */
    const goldReward =
        getFinalQuestGoldReward(
            quest
        );

    const chance =
        typeof getTimelyCompletionChance ===
            "function"
            ? getTimelyCompletionChance()
            : 0;

    const bonusTriggered =
        typeof rollTradeChance ===
            "function"
            ? rollTradeChance(
                chance
            )
            : false;

    const contractCapstoneActive =
        typeof isTradeCapstoneSelected ===
        "function" &&
        isTradeCapstoneSelected(
            "trade_orders_capstone"
        );

    const goldBonusTriggered =
        bonusTriggered &&
        contractCapstoneActive;

    return {
        heroExperience:
            bonusTriggered
                ? heroExperience * 2
                : heroExperience,

        activityExperience:
            bonusTriggered
                ? activityExperience * 2
                : activityExperience,

        goldReward:
            goldBonusTriggered
                ? goldReward * 2
                : goldReward,

        bonusTriggered:
            bonusTriggered,

        goldBonusTriggered:
            goldBonusTriggered,

        bonusHeroExperience:
            bonusTriggered
                ? heroExperience
                : 0,

        bonusActivityExperience:
            bonusTriggered
                ? activityExperience
                : 0,

        bonusGoldReward:
            goldBonusTriggered
                ? goldReward
                : 0
    };
}

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
        console.warn(
            "Nagroda została już odebrana:",
            quest.title
        );
        return;
    }
    const baseGoldReward =
        getQuestBaseGoldReward(
            quest
        );

    const timelyCompletionResult =
        getQuestTimelyCompletionResult(
            quest
        );

    const regularGoldReward =
        getFinalQuestGoldReward(
            quest
        );

    const finalGoldReward =
        timelyCompletionResult
            .goldReward;

    const tradeGoldBonus =
        Math.max(
            0,
            regularGoldReward -
            baseGoldReward
        );

    const finalHeroExpReward =
        timelyCompletionResult
            .heroExperience;

    const finalActivityExpReward =
        timelyCompletionResult
            .activityExperience;

    player.gold +=
        finalGoldReward;

    player.exp +=
        finalHeroExpReward;

    const activityExpReward =
        finalActivityExpReward;

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

    if (
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(
            "🎁 Odebrano nagrodę za zadanie: " +
            quest.title +
            "."
        );

        addCombatLog(
            "⭐ +" +
            finalHeroExpReward +
            " EXP, +" +
            finalGoldReward +
            " złota."
        );

        if (tradeGoldBonus > 0) {
            addCombatLog(
                "📜 Renoma kupiecka: +" +
                tradeGoldBonus +
                " dodatkowego złota."
            );
        }
    }
    if (
        timelyCompletionResult
            .bonusTriggered &&
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(
            timelyCompletionResult
                .goldBonusTriggered
                ? "👑 Mistrz kontraktów: EXP i złoto z zadania zostały podwojone."
                : "⏱️ Premia za terminowość: EXP z zadania zostało podwojone."
        );
    }
    if (
        timelyCompletionResult
            .goldBonusTriggered &&
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "👑 Mistrz kontraktów: +" +
            timelyCompletionResult
                .bonusGoldReward +
            " dodatkowego złota z zadania.",
            "quest"
        );
    }

    const questTitle =
        quest.title ||
        quest.name ||
        quest.description ||
        quest.id ||
        "Nieznane zadanie";

    const goldReward =
        finalGoldReward;

    if (typeof addSystemLog === "function") {
        addSystemLog(
            `📜 Ukończono zadanie: ${questTitle}. ` +
            `Otrzymano ${goldReward} złota i ${finalHeroExpReward} EXP.`,
            "quest"
        );
    }
    if (
        tradeGoldBonus > 0 &&
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "💰 Renoma kupiecka zwiększyła nagrodę o " +
            tradeGoldBonus +
            " złota.",
            "quest"
        );
    }
    if (
        timelyCompletionResult
            .bonusTriggered &&
        typeof addSystemLog ===
        "function"
    ) {
        let timelyMessage =
            "⏱️ Premia za terminowość: podwojono EXP z zadania. " +
            "Dodatkowo +" +
            timelyCompletionResult
                .bonusHeroExperience +
            " EXP bohatera";

        if (
            timelyCompletionResult
                .bonusActivityExperience >
            0
        ) {
            timelyMessage +=
                " oraz +" +
                timelyCompletionResult
                    .bonusActivityExperience +
                " EXP profesji";
        }

        timelyMessage += ".";

        addSystemLog(
            timelyMessage,
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
    let totalBaseGold = 0;
    let totalTradeGoldBonus = 0;

    let totalExp = 0;
    let totalMiningExp = 0;
    let totalHerbalismExp = 0;
    let totalAlchemyExp = 0;
    let totalCraftingExp = 0;
    let totalFishingExp = 0;
    let totalCookingExp = 0;
    let timelyCompletionCount = 0;
    let totalTimelyHeroExpBonus = 0;
    let totalTimelyActivityExpBonus = 0;
    let totalTimelyGoldBonus = 0;

    claimableQuests.forEach(quest => {
        const baseGoldReward =
            getQuestBaseGoldReward(
                quest
            );

        const timelyCompletionResult =
            getQuestTimelyCompletionResult(
                quest
            );

        const regularGoldReward =
            getFinalQuestGoldReward(
                quest
            );

        const goldReward =
            timelyCompletionResult
                .goldReward;

        const tradeGoldBonus =
            Math.max(
                0,
                regularGoldReward -
                baseGoldReward
            );

        const expReward =
            timelyCompletionResult
                .heroExperience;

        const activityExpReward =
            timelyCompletionResult
                .activityExperience;

        if (
            timelyCompletionResult
                .bonusTriggered
        ) {
            timelyCompletionCount++;

            totalTimelyHeroExpBonus +=
                timelyCompletionResult
                    .bonusHeroExperience;

            totalTimelyActivityExpBonus +=
                timelyCompletionResult
                    .bonusActivityExperience;

            totalTimelyGoldBonus +=
                timelyCompletionResult
                    .bonusGoldReward;
        }
        totalBaseGold +=
            baseGoldReward;

        totalTradeGoldBonus +=
            tradeGoldBonus;

        totalGold +=
            goldReward;

        totalExp +=
            expReward;

        if (
            quest.activityId ===
            "mining"
        ) {
            totalMiningExp +=
                activityExpReward;
        }

        if (
            quest.activityId ===
            "herbalism"
        ) {
            totalHerbalismExp +=
                activityExpReward;
        }

        if (
            quest.activityId ===
            "alchemy"
        ) {
            totalAlchemyExp +=
                activityExpReward;
        }

        if (
            quest.activityId ===
            "crafting"
        ) {
            totalCraftingExp +=
                activityExpReward;
        }
        if (
            quest.activityId ===
            "fishing"
        ) {
            totalFishingExp +=
                activityExpReward;
        }

        if (
            quest.activityId ===
            "cooking"
        ) {
            totalCookingExp +=
                activityExpReward;
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

    if (
        typeof addCombatLog ===
        "function"
    ) {
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

        if (
            totalTradeGoldBonus > 0
        ) {
            addCombatLog(
                "📜 Renoma kupiecka: +" +
                totalTradeGoldBonus +
                " dodatkowego złota."
            );
        }

        if (
            timelyCompletionCount > 0
        ) {
            addCombatLog(
                "⏱️ Premia za terminowość zadziałała dla " +
                timelyCompletionCount +
                (
                    timelyCompletionCount === 1
                        ? " zadania."
                        : " zadań."
                )
            );
        }
    }
    if (
        typeof addSystemLog ===
        "function"
    ) {
        let rewardMessage =
            "📜 Odebrano nagrody za " +
            claimableQuests.length +
            " zadań. Otrzymano " +
            totalGold +
            " złota i " +
            totalExp +
            " EXP.";

        if (
            totalTradeGoldBonus > 0
        ) {
            rewardMessage +=
                " Renoma kupiecka: +" +
                totalTradeGoldBonus +
                " złota.";
        }

        addSystemLog(
            rewardMessage,
            "quest"
        );
    }
    if (
        timelyCompletionCount > 0 &&
        typeof addSystemLog ===
        "function"
    ) {
        addSystemLog(
            "⏱️ Premia za terminowość zadziałała dla " +
            timelyCompletionCount +
            (
                timelyCompletionCount === 1
                    ? " zadania."
                    : " zadań."
            ) +
            " Dodatkowe EXP bohatera: +" +
            totalTimelyHeroExpBonus +
            ", profesji: +" +
            totalTimelyActivityExpBonus +
            (
                totalTimelyGoldBonus > 0
                    ? (
                        ", złoto: +" +
                        totalTimelyGoldBonus
                    )
                    : ""
            ) +
            ".",
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

