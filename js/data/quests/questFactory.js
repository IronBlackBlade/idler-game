function createQuestFollowUpStages(
    config
) {
    const killRequirements =
        Array.isArray(
            config.requiredKills
        )
            ? config.requiredKills
            : [];

    const chainLength =
        killRequirements.length +
        1;

    return killRequirements.map(
        (
            requiredKills,
            index
        ) => {
            const stageNumber =
                index + 2;

            return {
                id:
                    config.idPrefix +
                    "_" +
                    stageNumber,

                previousQuestId:
                    config.idPrefix +
                    "_" +
                    (
                        stageNumber -
                        1
                    ),

                chainStage:
                    stageNumber,

                chainLength:
                    chainLength,

                title:
                    config.title +
                    " — etap " +
                    stageNumber,

                description:
                    config.descriptions[
                    index
                    ],

                targetEnemyName:
                    config
                        .targetEnemyName,

                activityId:
                    config.activityId ||
                    null,

                progressSource:
                    config.progressSource ||
                    null,

                targetItemId:
                    config.targetItemId ||
                    null,
                    targetAreaId:
    config.targetAreaId ||
    null,

                requiredLevel:
                    Number(
                        config
                            .requiredLevel
                    ) || 1,

                requiredKills:
                    requiredKills,

                currentKills: 0,

                rewardGold:
                    Number(
                        config.rewardGold[
                        index
                        ]
                    ) || 0,

                rewardExp:
                    Number(
                        config.rewardExp[
                        index
                        ]
                    ) || 0,
                rewardActivityExp:
                    Number(
                        config
                            .rewardActivityExp
                        ?.[index]
                    ) || 0,
                completed: false,
                claimed: false
            };
        }
    );
}
