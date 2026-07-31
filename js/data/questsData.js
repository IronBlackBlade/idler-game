function scaleQuestReward(
    value,
    multiplier
) {
    const safeValue =
        Math.max(
            0,
            Number(value) || 0
        );

    if (safeValue === 0) {
        return 0;
    }

    return Math.max(
        1,
        Math.round(
            safeValue *
            multiplier
        )
    );
}

function balanceCombatQuestRewards(
    questList
) {
    return questList.map(quest => {
        return {
            ...quest,

            rewardGold:
                scaleQuestReward(
                    quest.rewardGold,
                    0.15
                ),

            rewardExp:
                scaleQuestReward(
                    quest.rewardExp,
                    0.5
                )
        };
    });
}

function balanceProfessionQuestRewards(
    questList
) {
    return questList.map(quest => {
        const isAreaQuest =
            quest.progressSource ===
            "areaCycles";

        const goldMultiplier =
            isAreaQuest
                ? 0.7
                : 0.4;

        const heroExpMultiplier =
            isAreaQuest
                ? 0.2
                : 0.12;

        const activityExpMultiplier =
            isAreaQuest
                ? 0.5
                : 0.1;

        return {
            ...quest,

            rewardGold:
                scaleQuestReward(
                    quest.rewardGold,
                    goldMultiplier
                ),

            rewardExp:
                scaleQuestReward(
                    quest.rewardExp,
                    heroExpMultiplier
                ),

            rewardActivityExp:
                scaleQuestReward(
                    quest.rewardActivityExp,
                    activityExpMultiplier
                )
        };
    });
}

const quests = [
    ...balanceCombatQuestRewards(
        combatQuests
    ),

    ...balanceProfessionQuestRewards(
        miningQuests
    ),

    ...balanceProfessionQuestRewards(
        herbalismQuests
    ),

    ...balanceProfessionQuestRewards(
        alchemyQuests
    ),

    ...balanceProfessionQuestRewards(
        craftingQuests
    ),

    ...balanceProfessionQuestRewards(
        fishingQuests
    ),

    ...balanceProfessionQuestRewards(
        cookingQuests
    )
];
