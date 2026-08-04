let manaRegenerationIntervalId = null;
let manaRegenerationAccumulator = 0;

const baseManaRegenerationPerSecond = 1;

const warriorCombatState = {
    momentumCharges: 0,
    secondWindUsed: false,
    bleeds: []
};

const hunterCombatState = {
    attacksSinceSniperShot: 0,
    counterShotCharges: 0
};

const mageCombatState = {
    arcaneRebirthUsed: false
};

const guardianCombatState = {
    receivedHits: 0,
    unyieldingUsed: false,
    unyieldingGuardCharges: 0
};

const rogueCombatState = {
    shadowstepCharges: 0,
    attacksSinceBladeDance: 0,
    poisons: []
};

const combatWeaponCapstoneState = {
    slashingAttackCount: 0
};

const spellCombatState = {
    ignite: null
};

const warriorCapstoneSkillIds = [
    "berserker",
    "hemorrhage",
    "second_wind"
];

const hunterCapstoneSkillIds = [
    "sniper",
    "arrow_storm",
    "tracker"
];

const mageCapstoneSkillIds = [
    "overload",
    "mana_overflow",
    "arcane_rebirth"
];

const guardianCapstoneSkillIds = [
    "fortress",
    "spiked_bulwark",
    "unyielding"
];

const rogueCapstoneSkillIds = [
    "executioner",
    "blade_dance",
    "deadly_venom"
];

const combatCapstoneSkillIds = [
    "slashing_capstone",
    "blunt_capstone",
    "bow_capstone",
    "crossbow_capstone",
    "wand_capstone",
    "staff_capstone"
];

const tradeCapstoneSkillIds = [
    "trade_purchase_capstone",
    "trade_selling_capstone",
    "trade_orders_capstone"
];

const craftingCapstoneSkillIds = [
    "crafting_mass_production_capstone",
    "crafting_lossless_workshop_capstone",
    "crafting_masterpiece_capstone"
];

function getManaRegenerationPerSecond() {
    const potionBonus =
        typeof getActivePotionEffectValue ===
            "function"
            ? getActivePotionEffectValue(
                "mana_regeneration"
            )
            : 0;

    const wandRegenerationBonus =
        typeof getWandManaRegenerationSkillBonus ===
            "function"
            ? getWandManaRegenerationSkillBonus()
            : 0;

    /*
     * Najpierw dodajemy stałą regenerację
     * z różdżki.
     */
    const baseRegeneration =
        baseManaRegenerationPerSecond +
        wandRegenerationBonus;

    /*
     * Następnie mikstura zwiększa całą
     * regenerację procentowo.
     */
    const regenerationMultiplier =
        1 +
        potionBonus / 100;

    return (
        baseRegeneration *
        regenerationMultiplier
    );
}

function regenerateManaTick() {
    if (
        typeof getDerivedStats !==
        "function"
    ) {
        return;
    }

    const derived =
        getDerivedStats();

    const maxMana =
        Math.max(
            0,
            Number(derived.maxMana) || 0
        );

    if (!Number.isFinite(player.mana)) {
        player.mana = 0;
    }

    if (player.mana >= maxMana) {
        player.mana = maxMana;

        manaRegenerationAccumulator = 0;

        return;
    }

    const manaRegeneration =
        getManaRegenerationPerSecond();

    manaRegenerationAccumulator +=
        manaRegeneration;

    const restoredMana =
        Math.floor(
            manaRegenerationAccumulator
        );

    if (restoredMana <= 0) {
        return;
    }

    manaRegenerationAccumulator -=
        restoredMana;

    player.mana = Math.min(
        maxMana,
        player.mana + restoredMana
    );

    if (
        typeof renderPlayerHud ===
        "function"
    ) {
        renderPlayerHud();
    }

    if (
        typeof renderCombatSpellSlots ===
        "function"
    ) {
        renderCombatSpellSlots();
    }
}

function startManaRegeneration() {
    if (
        manaRegenerationIntervalId !==
        null
    ) {
        clearInterval(
            manaRegenerationIntervalId
        );
    }

    manaRegenerationIntervalId =
        setInterval(() => {
            regenerateManaTick();
        }, 1000);
}

function normalizeSwordMasteryLevel() {
    if (
        !player.skills ||
        typeof player.skills !==
        "object"
    ) {
        return 0;
    }

    const savedLevel = Math.max(
        0,
        Math.floor(
            Number(
                player.skills
                    .sword_mastery
            ) || 0
        )
    );

    const maximumLevel =
        skills?.sword_mastery
            ?.maxLevel || 5;

    if (
        savedLevel <=
        maximumLevel
    ) {
        return 0;
    }

    const excessLevels =
        savedLevel -
        maximumLevel;

    player.skills.sword_mastery =
        maximumLevel;

    player.skillPoints =
        Math.max(
            0,
            Number(
                player.skillPoints
            ) || 0
        ) +
        excessLevels;

    return excessLevels;
}

function getSkillLevel(skillId) {
    if (!player.skills) {
        player.skills = {};
    }

    /*
     * Migrację sprawdzamy tylko przy
     * odczytywaniu Mistrzostwa broni białej.
     */
    if (
        skillId ===
        "sword_mastery"
    ) {
        normalizeSwordMasteryLevel();
    }

    return Math.max(
        0,
        Math.floor(
            Number(
                player.skills[skillId]
            ) || 0
        )
    );
}

function getSkillGoldCost(
    skillId,
    currentLevel = getSkillLevel(skillId)
) {
    const skill = skills[skillId];

    if (
        !skill ||
        !Array.isArray(skill.goldCosts)
    ) {
        return 0;
    }

    const normalizedLevel = Math.max(
        0,
        Math.floor(
            Number(currentLevel) || 0
        )
    );

    return Math.max(
        0,
        Math.floor(
            Number(
                skill.goldCosts[normalizedLevel]
            ) || 0
        )
    );
}

function isCombatCapstoneSkill(
    skillId
) {
    return combatCapstoneSkillIds
        .includes(skillId);
}

function getLockedCombatCapstone() {
    return (
        combatCapstoneSkillIds
            .find(skillId => {
                return (
                    getSkillLevel(
                        skillId
                    ) > 0
                );
            }) ||
        null
    );
}

function isCombatCapstoneSelected(
    skillId
) {
    return (
        getLockedCombatCapstone() ===
        skillId
    );
}

function isCombatCapstoneLocked(
    skillId
) {
    if (
        !isCombatCapstoneSkill(
            skillId
        )
    ) {
        return false;
    }

    const lockedCapstoneId =
        getLockedCombatCapstone();

    return (
        lockedCapstoneId !== null &&
        lockedCapstoneId !== skillId
    );
}

function isWarriorCapstoneSkill(
    skillId
) {
    return warriorCapstoneSkillIds
        .includes(skillId);
}

function getSelectedWarriorCapstone() {
    const selectedId =
        player.selectedWarriorCapstone;

    if (
        player.classId !== "warrior" ||
        !isWarriorCapstoneSkill(
            selectedId
        ) ||
        getSkillLevel(selectedId) <= 0
    ) {
        return null;
    }

    return selectedId;
}

function isWarriorCapstoneSelected(
    skillId
) {
    return (
        getSelectedWarriorCapstone() ===
        skillId
    );
}

function selectWarriorCapstone(
    skillId
) {
    if (
        player.classId !== "warrior"
    ) {
        showSkillError(
            "Specjalizacje Wojownika są dostępne tylko dla klasy Wojownik."
        );
        return;
    }

    if (
        !isWarriorCapstoneSkill(
            skillId
        ) ||
        getSkillLevel(skillId) <= 0
    ) {
        showSkillError(
            "Najpierw odblokuj tę umiejętność końcową."
        );
        return;
    }

    const combatIsActive =
        player.isFighting === true ||
        (
            typeof isFighting !==
            "undefined" &&
            isFighting === true
        );

    if (combatIsActive) {
        showSkillError(
            "Specjalizację można zmienić tylko poza walką."
        );
        return;
    }

    const wasSelected =
        isWarriorCapstoneSelected(
            skillId
        );

    player.selectedWarriorCapstone =
        wasSelected
            ? null
            : skillId;

    resetWarriorCombatState();

    const skill = skills[skillId];

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            wasSelected
                ? "Wyłączono specjalizację: " +
                skill.name +
                "."
                : "Aktywna specjalizacja: " +
                skill.name +
                ".",
            "success"
        );
    }

    saveGame();
    render();

    if (
        typeof refreshSkillsView ===
        "function"
    ) {
        refreshSkillsView();
    }
}

function isHunterCapstoneSkill(
    skillId
) {
    return hunterCapstoneSkillIds
        .includes(skillId);
}

function getSelectedHunterCapstone() {
    const selectedId =
        player.selectedHunterCapstone;

    if (
        player.classId !== "hunter" ||
        !isHunterCapstoneSkill(
            selectedId
        ) ||
        getSkillLevel(selectedId) <= 0
    ) {
        return null;
    }

    return selectedId;
}

function isHunterCapstoneSelected(
    skillId
) {
    return (
        getSelectedHunterCapstone() ===
        skillId
    );
}

function selectHunterCapstone(
    skillId
) {
    if (
        player.classId !== "hunter"
    ) {
        showSkillError(
            "Specjalizacje Łowcy są dostępne tylko dla klasy Łowca."
        );
        return;
    }

    if (
        !isHunterCapstoneSkill(
            skillId
        ) ||
        getSkillLevel(skillId) <= 0
    ) {
        showSkillError(
            "Najpierw odblokuj tę umiejętność końcową."
        );
        return;
    }

    const combatIsActive =
        player.isFighting === true ||
        (
            typeof isFighting !==
            "undefined" &&
            isFighting === true
        );

    if (combatIsActive) {
        showSkillError(
            "Specjalizację można zmienić tylko poza walką."
        );
        return;
    }

    const wasSelected =
        isHunterCapstoneSelected(
            skillId
        );

    player.selectedHunterCapstone =
        wasSelected
            ? null
            : skillId;

    resetHunterCombatState();

    const skill = skills[skillId];

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            wasSelected
                ? "Wyłączono specjalizację: " +
                skill.name +
                "."
                : "Aktywna specjalizacja: " +
                skill.name +
                ".",
            "success"
        );
    }

    saveGame();
    render();

    if (
        typeof refreshSkillsView ===
        "function"
    ) {
        refreshSkillsView();
    }
}

function isMageCapstoneSkill(
    skillId
) {
    return mageCapstoneSkillIds
        .includes(skillId);
}

function getSelectedMageCapstone() {
    const selectedId =
        player.selectedMageCapstone;

    if (
        player.classId !== "mage" ||
        !isMageCapstoneSkill(
            selectedId
        ) ||
        getSkillLevel(selectedId) <= 0
    ) {
        return null;
    }

    return selectedId;
}

function isMageCapstoneSelected(
    skillId
) {
    return (
        getSelectedMageCapstone() ===
        skillId
    );
}

function selectMageCapstone(
    skillId
) {
    if (
        player.classId !== "mage"
    ) {
        showSkillError(
            "Specjalizacje Maga są dostępne tylko dla klasy Mag."
        );
        return;
    }

    if (
        !isMageCapstoneSkill(
            skillId
        ) ||
        getSkillLevel(skillId) <= 0
    ) {
        showSkillError(
            "Najpierw odblokuj tę umiejętność końcową."
        );
        return;
    }

    const combatIsActive =
        player.isFighting === true ||
        (
            typeof isFighting !==
            "undefined" &&
            isFighting === true
        );

    if (combatIsActive) {
        showSkillError(
            "Specjalizację można zmienić tylko poza walką."
        );
        return;
    }

    const wasSelected =
        isMageCapstoneSelected(
            skillId
        );

    player.selectedMageCapstone =
        wasSelected
            ? null
            : skillId;

    resetMageCombatState();

    const skill = skills[skillId];

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            wasSelected
                ? "Wyłączono specjalizację: " +
                skill.name +
                "."
                : "Aktywna specjalizacja: " +
                skill.name +
                ".",
            "success"
        );
    }

    saveGame();
    render();

    if (
        typeof refreshSkillsView ===
        "function"
    ) {
        refreshSkillsView();
    }
}

function isGuardianCapstoneSkill(
    skillId
) {
    return guardianCapstoneSkillIds
        .includes(skillId);
}

function getSelectedGuardianCapstone() {
    const selectedId =
        player.selectedGuardianCapstone;

    if (
        player.classId !== "guardian" ||
        !isGuardianCapstoneSkill(
            selectedId
        ) ||
        getSkillLevel(selectedId) <= 0
    ) {
        return null;
    }

    return selectedId;
}

function isGuardianCapstoneSelected(
    skillId
) {
    return (
        getSelectedGuardianCapstone() ===
        skillId
    );
}

function selectGuardianCapstone(
    skillId
) {
    if (
        player.classId !== "guardian"
    ) {
        showSkillError(
            "Specjalizacje Strażnika są dostępne tylko dla klasy Strażnik."
        );
        return;
    }

    if (
        !isGuardianCapstoneSkill(
            skillId
        ) ||
        getSkillLevel(skillId) <= 0
    ) {
        showSkillError(
            "Najpierw odblokuj tę umiejętność końcową."
        );
        return;
    }

    const combatIsActive =
        player.isFighting === true ||
        (
            typeof isFighting !==
            "undefined" &&
            isFighting === true
        );

    if (combatIsActive) {
        showSkillError(
            "Specjalizację można zmienić tylko poza walką."
        );
        return;
    }

    const wasSelected =
        isGuardianCapstoneSelected(
            skillId
        );

    player.selectedGuardianCapstone =
        wasSelected
            ? null
            : skillId;

    resetGuardianCombatState();

    const skill = skills[skillId];

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            wasSelected
                ? "Wyłączono specjalizację: " +
                skill.name +
                "."
                : "Aktywna specjalizacja: " +
                skill.name +
                ".",
            "success"
        );
    }

    saveGame();
    render();

    if (
        typeof refreshSkillsView ===
        "function"
    ) {
        refreshSkillsView();
    }
}

function isRogueCapstoneSkill(
    skillId
) {
    return rogueCapstoneSkillIds
        .includes(skillId);
}

function getSelectedRogueCapstone() {
    const selectedId =
        player.selectedRogueCapstone;

    if (
        player.classId !== "rogue" ||
        !isRogueCapstoneSkill(
            selectedId
        ) ||
        getSkillLevel(selectedId) <= 0
    ) {
        return null;
    }

    return selectedId;
}

function isRogueCapstoneSelected(
    skillId
) {
    return (
        getSelectedRogueCapstone() ===
        skillId
    );
}

function selectRogueCapstone(
    skillId
) {
    if (
        player.classId !== "rogue"
    ) {
        showSkillError(
            "Specjalizacje Łotrzyka są dostępne tylko dla klasy Łotrzyk."
        );
        return;
    }

    if (
        !isRogueCapstoneSkill(
            skillId
        ) ||
        getSkillLevel(skillId) <= 0
    ) {
        showSkillError(
            "Najpierw odblokuj tę umiejętność końcową."
        );
        return;
    }

    const combatIsActive =
        player.isFighting === true ||
        (
            typeof isFighting !==
            "undefined" &&
            isFighting === true
        );

    if (combatIsActive) {
        showSkillError(
            "Specjalizację można zmienić tylko poza walką."
        );
        return;
    }

    const wasSelected =
        isRogueCapstoneSelected(
            skillId
        );

    player.selectedRogueCapstone =
        wasSelected
            ? null
            : skillId;

    resetRogueCombatState();

    const skill = skills[skillId];

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            wasSelected
                ? "Wyłączono specjalizację: " +
                skill.name +
                "."
                : "Aktywna specjalizacja: " +
                skill.name +
                ".",
            "success"
        );
    }

    saveGame();
    render();

    if (
        typeof refreshSkillsView ===
        "function"
    ) {
        refreshSkillsView();
    }
}

function isCraftingCapstoneSkill(
    skillId
) {
    return craftingCapstoneSkillIds
        .includes(skillId);
}


function getLockedCraftingCapstone() {
    return (
        craftingCapstoneSkillIds
            .find(skillId => {
                return (
                    getSkillLevel(
                        skillId
                    ) > 0
                );
            }) ||
        null
    );
}

function isCraftingCapstoneSelected(
    skillId
) {
    return (
        getLockedCraftingCapstone() ===
        skillId
    );
}

function isCraftingCapstoneLocked(
    skillId
) {
    if (
        !isCraftingCapstoneSkill(
            skillId
        )
    ) {
        return false;
    }

    const lockedCapstoneId =
        getLockedCraftingCapstone();

    return (
        lockedCapstoneId !== null &&
        lockedCapstoneId !== skillId
    );
}

function isTradeCapstoneSkill(
    skillId
) {
    return tradeCapstoneSkillIds
        .includes(
            skillId
        );
}

function getLockedTradeCapstone() {
    return (
        tradeCapstoneSkillIds
            .find(skillId => {
                return (
                    getSkillLevel(
                        skillId
                    ) > 0
                );
            }) ||
        null
    );
}

function isTradeCapstoneSelected(
    skillId
) {
    return (
        getLockedTradeCapstone() ===
        skillId
    );
}

function isTradeCapstoneLocked(
    skillId
) {
    if (
        !isTradeCapstoneSkill(
            skillId
        )
    ) {
        return false;
    }

    const lockedCapstoneId =
        getLockedTradeCapstone();

    return (
        lockedCapstoneId !== null &&
        lockedCapstoneId !==
        skillId
    );
}

function isSkillMaxLevel(skillId) {
    const skill = skills[skillId];

    if (!skill) {
        return false;
    }

    return getSkillLevel(skillId) >= skill.maxLevel;
}

function getSkillPrerequisites(skill) {
    if (!skill) {
        return [];
    }

    /*
     * Nowy system wielu wymagań.
     */
    if (
        Array.isArray(
            skill.prerequisites
        )
    ) {
        return skill.prerequisites.filter(
            prerequisite => {
                return (
                    prerequisite &&
                    prerequisite.skillId &&
                    Number(
                        prerequisite
                            .requiredSkillLevel
                    ) > 0
                );
            }
        );
    }

    /*
     * Zgodność ze starszymi
     * umiejętnościami, które nadal
     * mają pojedyncze prerequisite.
     */
    if (skill.prerequisite) {
        return [
            skill.prerequisite
        ];
    }

    return [];
}

function isSkillPrerequisiteMet(skill) {
    const prerequisites =
        getSkillPrerequisites(skill);

    return prerequisites.every(
        prerequisite => {
            const requiredSkillLevel =
                getSkillLevel(
                    prerequisite.skillId
                );

            return (
                requiredSkillLevel >=
                prerequisite
                    .requiredSkillLevel
            );
        }
    );
}

function isSkillClassRequirementMet(skill) {
    if (
        !skill ||
        !skill.requiredClass
    ) {
        return true;
    }

    return (
        player.classId ===
        skill.requiredClass
    );
}

function canUpgradeSkill(
    skillId
) {
    const skill =
        skills[skillId];

    if (!skill) {
        return false;
    }

    if (
        isCombatCapstoneLocked(
            skillId
        )
    ) {
        return false;
    }
    if (
        isCraftingCapstoneLocked(
            skillId
        )
    ) {
        return false;
    }
    if (
        isTradeCapstoneLocked(
            skillId
        )
    ) {
        return false;
    }

    const currentLevel =
        getSkillLevel(skillId);

    if (currentLevel >= skill.maxLevel) {
        return false;
    }

    if (player.level < skill.requiredLevel) {
        return false;
    }

    if (
        !isSkillClassRequirementMet(
            skill
        )
    ) {
        return false;
    }

    if ((player.skillPoints || 0) < skill.costPerLevel) {
        return false;
    }

    const goldCost = getSkillGoldCost(
        skillId,
        currentLevel
    );

    if (
        (Number(player.gold) || 0) <
        goldCost
    ) {
        return false;
    }

    if (!isSkillPrerequisiteMet(skill)) {
        return false;
    }

    return true;
}

function upgradeSkill(
    skillId
) {
    const skill = skills[skillId];

    if (!skill) {
        console.warn(
            "Nie znaleziono umiejętności:",
            skillId
        );
        return;
    }
    if (
        isCombatCapstoneLocked(
            skillId
        )
    ) {
        const lockedCapstoneId =
            getLockedCombatCapstone();

        const lockedSkill =
            skills[
            lockedCapstoneId
            ];

        showSkillError(
            "Wybrano już trwałą specjalizację: " +
            (
                lockedSkill?.name ||
                "inna specjalizacja broni"
            ) +
            ". Zmiana wymaga pełnego resetu postaci."
        );

        return;
    }
    if (
        isCraftingCapstoneLocked(
            skillId
        )
    ) {
        const lockedCapstoneId =
            getLockedCraftingCapstone();

        const lockedSkill =
            skills[
            lockedCapstoneId
            ];

        showSkillError(
            "Wybrano już trwałą specjalizację Rzemiosła: " +
            (
                lockedSkill?.name ||
                "inna specjalizacja"
            ) +
            ". Zmiana wymaga pełnego resetu postaci."
        );

        return;
    }

    if (
        isTradeCapstoneLocked(
            skillId
        )
    ) {
        const lockedCapstoneId =
            getLockedTradeCapstone();

        const lockedSkill =
            skills[
            lockedCapstoneId
            ];

        showSkillError(
            "Wybrano już specjalizację Handlu: " +
            (
                lockedSkill?.name ||
                "inna specjalizacja"
            ) +
            ". Zmiana wymaga resetu umiejętności."
        );

        return;
    }

    const currentLevel = getSkillLevel(skillId);

    if (currentLevel >= skill.maxLevel) {
        showSkillError(
            "Umiejętność ma już maksymalny poziom."
        );
        return;
    }

    if (player.level < skill.requiredLevel) {
        showSkillError(
            "Ta umiejętność wymaga poziomu " +
            skill.requiredLevel +
            "."
        );
        return;
    }

    if (
        !isSkillClassRequirementMet(
            skill
        )
    ) {
        const requiredClass =
            typeof characterClasses !==
                "undefined"
                ? characterClasses[
                skill.requiredClass
                ]
                : null;

        showSkillError(
            "Ta umiejętność jest dostępna tylko dla klasy " +
            (
                requiredClass?.name ||
                skill.requiredClass
            ) +
            "."
        );
        return;
    }

    if (
        (player.skillPoints || 0) <
        skill.costPerLevel
    ) {
        showSkillError(
            "Nie masz wystarczająco punktów umiejętności."
        );
        return;
    }
    const goldCost = getSkillGoldCost(
        skillId,
        currentLevel
    );

    if (
        (Number(player.gold) || 0) <
        goldCost
    ) {
        showSkillError(
            "Nie masz wystarczająco złota. Potrzebujesz " +
            goldCost +
            " złota."
        );
        return;
    }

    if (!isSkillPrerequisiteMet(skill)) {
        showSkillError(
            "Najpierw rozwiń wymaganą umiejętność."
        );
        return;
    }

    player.skillPoints -= skill.costPerLevel;

    player.gold =
        Math.max(
            0,
            Number(player.gold) || 0
        ) -
        goldCost;

    player.skillGoldSpent =
        Math.max(
            0,
            Number(
                player.skillGoldSpent
            ) || 0
        ) +
        goldCost;

    player.skills[skillId] = currentLevel + 1;

    if (
        isWarriorCapstoneSkill(
            skillId
        ) &&
        !getSelectedWarriorCapstone()
    ) {
        player.selectedWarriorCapstone =
            skillId;
    }

    if (
        isHunterCapstoneSkill(
            skillId
        ) &&
        !getSelectedHunterCapstone()
    ) {
        player.selectedHunterCapstone =
            skillId;
    }

    if (
        isMageCapstoneSkill(
            skillId
        ) &&
        !getSelectedMageCapstone()
    ) {
        player.selectedMageCapstone =
            skillId;
    }

    if (
        isGuardianCapstoneSkill(
            skillId
        ) &&
        !getSelectedGuardianCapstone()
    ) {
        player.selectedGuardianCapstone =
            skillId;
    }

    if (
        isRogueCapstoneSkill(
            skillId
        ) &&
        !getSelectedRogueCapstone()
    ) {
        player.selectedRogueCapstone =
            skillId;
    }

    if (typeof addSystemLog === "function") {
        addSystemLog(
            "✨ Rozwinięto umiejętność: " +
            skill.name +
            " do poziomu " +
            player.skills[skillId] +
            ".",
            "skill"
        );
    }

    if (typeof showNotification === "function") {
        showNotification(
            `Rozwinięto: ${skill.name} — poziom ${player.skills[skillId]}.`,
            "success"
        );
    }

    if (typeof addCombatLog === "function") {
        addCombatLog(
            "✨ Rozwinięto umiejętność: " +
            skill.name +
            " do poziomu " +
            player.skills[skillId] +
            "."
        );
    }

    saveGame();
    render();

    if (
        typeof refreshSkillsView ===
        "function"
    ) {
        refreshSkillsView();
    }

}

function showSkillError(message) {
    if (typeof showNotification === "function") {
        showNotification(message, "error");
    } else {
        console.warn(message);
    }
}

function getSkillLevelEffectValue(
    skillId,
    effectName
) {
    const skill = skills?.[skillId];

    if (!skill?.effect) {
        return 0;
    }

    const effectValues =
        skill.effect[effectName];

    if (!Array.isArray(effectValues)) {
        return 0;
    }

    const currentLevel = Math.max(
        0,
        Math.floor(
            Number(
                getSkillLevel(skillId)
            ) || 0
        )
    );

    if (currentLevel <= 0) {
        return 0;
    }

    const valueIndex = Math.min(
        currentLevel,
        effectValues.length
    ) - 1;

    return Math.max(
        0,
        Number(
            effectValues[valueIndex]
        ) || 0
    );
}

function getSkillEffectValue(effectName) {
    if (typeof skills === "undefined") {
        return 0;
    }

    let totalEffect = 0;

    Object.values(skills).forEach(skill => {
        if (
            !skill.effect ||
            !isSkillClassRequirementMet(
                skill
            )
        ) {
            return;
        }

        const valuePerLevel =
            skill.effect[effectName];

        if (typeof valuePerLevel !== "number") {
            return;
        }

        const skillLevel =
            getSkillLevel(skill.id);

        totalEffect +=
            valuePerLevel * skillLevel;
    });

    return totalEffect;
}

function getMeleeDamageSkillBonus() {
    /*
     * Nieregularny bonus Mistrzostwa:
     * 1%, 3%, 5%, 7%, 10%.
     */
    const swordMasteryBonus =
        getSkillLevelEffectValue(
            "sword_mastery",
            "meleeDamageByLevel"
        );

    /*
     * Pozostałe bonusy nadal są liczone
     * standardowo, na przykład:
     *
     * - Szkolenie wojownika,
     * - Szkolenie łotrzyka,
     * - inne przyszłe umiejętności.
     */
    const otherMeleeBonuses =
        getSkillEffectValue(
            "meleeDamagePercentPerLevel"
        );

    return Math.max(
        0,
        swordMasteryBonus +
        otherMeleeBonuses
    );
}

function getSlashingFlatDamageSkillBonus(
    weapon
) {
    if (
        weapon?.weaponType !==
        "melee" ||
        weapon?.weaponClass !==
        "slashing"
    ) {
        return 0;
    }

    return Math.max(
        0,
        getSkillLevelEffectValue(
            "sharpened_edge",
            "slashingFlatDamageByLevel"
        )
    );
}

function getBluntNonCriticalDamageSkillBonus(
    weapon
) {
    if (
        weapon?.weaponType !==
        "melee" ||
        weapon?.weaponClass !==
        "blunt"
    ) {
        return 0;
    }

    return Math.max(
        0,
        getSkillEffectValue(
            "bluntNonCriticalDamagePercentPerLevel"
        )
    );
}

function getRangedDamageSkillBonus() {
    /*
     * Bonus Mistrzostwa broni dystansowej:
     * 1%, 3%, 5%, 7%, 10%.
     */
    const rangedMasteryBonus =
        getSkillLevelEffectValue(
            "ranged_mastery",
            "rangedDamageByLevel"
        );

    /*
     * Pozostałe bonusy dystansowe,
     * na przykład ze szkolenia Łowcy.
     */
    const otherRangedBonuses =
        getSkillEffectValue(
            "rangedDamagePercentPerLevel"
        );

    return Math.max(
        0,
        rangedMasteryBonus +
        otherRangedBonuses
    );
}

function getMagicDamageSkillBonus() {
    /*
     * Bonus wyłącznie dla podstawowych
     * ataków różdżkami i kosturami.
     */
    const magicWeaponMasteryBonus =
        getSkillLevelEffectValue(
            "magic_weapon_mastery",
            "magicWeaponDamageByLevel"
        );

    /*
     * Pozostałe premie magiczne,
     * na przykład ze szkolenia klasy Mag.
     */
    const otherMagicBonuses =
        getSkillEffectValue(
            "magicDamagePercentPerLevel"
        );

    return Math.max(
        0,
        magicWeaponMasteryBonus +
        otherMagicBonuses
    );
}

function getCombatWeaponCritChanceBonus(
    weapon
) {
    if (
        weapon?.weaponType !==
        "ranged"
    ) {
        return 0;
    }

    return Math.max(
        0,
        getSkillEffectValue(
            "combatRangedCritChancePercentPerLevel"
        )
    );
}

function getCombatSkillWeapon(
    providedWeapon = null
) {
    if (providedWeapon) {
        return providedWeapon;
    }

    const weaponId =
        player.equipment?.weapon;

    return weaponId
        ? items[weaponId]
        : null;
}

function isCombatWeaponClass(
    weapon,
    weaponClass
) {
    return (
        weapon?.weaponType ===
        "melee" &&
        weapon?.weaponClass ===
        weaponClass
    );
}

function shouldDisableCombatCapstoneCriticalHits(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        !isCombatWeaponClass(
            weapon,
            "blunt"
        )
    ) {
        return false;
    }

    if (
        !isCombatCapstoneSelected(
            "blunt_capstone"
        )
    ) {
        return false;
    }

    return (
        getUnlockedSkillEffectValue(
            "blunt_capstone",
            "bluntCapstoneDisablesCriticalHits"
        ) >
        0
    );
}

function applyCombatWeaponCapstoneAttackModifiers(
    attackResult,
    providedWeapon = null
) {
    if (!attackResult) {
        return attackResult;
    }

    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    let damage =
        Math.max(
            0,
            Number(
                attackResult.damage
            ) || 0
        );

    let isCritical =
        attackResult.isCritical ===
        true;

    let slashingCapstoneTriggered =
        false;

    let bluntCapstoneActive =
        false;

    /*
     * Finał broni siecznej.
     */
    const slashingCapstoneActive =
        isCombatWeaponClass(
            weapon,
            "slashing"
        ) &&
        isCombatCapstoneSelected(
            "slashing_capstone"
        );

    if (slashingCapstoneActive) {
        combatWeaponCapstoneState
            .slashingAttackCount++;

        const attackInterval =
            Math.max(
                1,
                Math.floor(
                    getUnlockedSkillEffectValue(
                        "slashing_capstone",
                        "slashingCapstoneAttackInterval"
                    )
                )
            );

        if (
            combatWeaponCapstoneState
                .slashingAttackCount >=
            attackInterval
        ) {
            const bonusDamagePercent =
                getUnlockedSkillEffectValue(
                    "slashing_capstone",
                    "slashingCapstoneBonusDamagePercent"
                );

            damage *=
                1 +
                bonusDamagePercent /
                100;

            combatWeaponCapstoneState
                .slashingAttackCount = 0;

            slashingCapstoneTriggered =
                true;
        }
    } else {
        /*
         * Zmiana broni lub finału
         * przerywa serię cięć.
         */
        combatWeaponCapstoneState
            .slashingAttackCount = 0;
    }

    /*
     * Finał broni obuchowej.
     */
    bluntCapstoneActive =
        isCombatWeaponClass(
            weapon,
            "blunt"
        ) &&
        isCombatCapstoneSelected(
            "blunt_capstone"
        );

    if (bluntCapstoneActive) {
        const damageBonus =
            getUnlockedSkillEffectValue(
                "blunt_capstone",
                "bluntCapstoneDamagePercent"
            );

        damage *=
            1 +
            damageBonus /
            100;

        /*
         * Dodatkowe zabezpieczenie.
         * Krytyk powinien być wyłączony
         * już wcześniej w combatStats.js.
         */
        isCritical = false;
    }

    return {
        ...attackResult,

        damage:
            Math.max(
                1,
                Math.floor(damage)
            ),

        isCritical:
            isCritical,

        combatSlashingCapstone:
            slashingCapstoneTriggered,

        combatBluntCapstone:
            bluntCapstoneActive
    };
}

function getBowAttackSpeedSkillBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "ranged" ||
        weapon?.weaponClass !==
        "bow"
    ) {
        return 0;
    }

    return Math.max(
        0,
        getSkillEffectValue(
            "bowAttackSpeedPercentPerLevel"
        )
    );
}

function getCrossbowCritDamageSkillBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "ranged" ||
        weapon?.weaponClass !==
        "crossbow"
    ) {
        return 0;
    }

    return Math.max(
        0,
        getSkillEffectValue(
            "crossbowCritDamagePercentPerLevel"
        )
    );
}

function getWandSpellCooldownReductionSkillBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "magic" ||
        weapon?.weaponClass !==
        "wand"
    ) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            50,
            getSkillEffectValue(
                "wandSpellCooldownReductionPercentPerLevel"
            )
        )
    );
}

function getStaffManaDamageSkillBonus(
    weapon,
    maximumMana
) {
    if (
        weapon?.weaponType !==
        "magic" ||
        weapon?.weaponClass !==
        "staff"
    ) {
        return 0;
    }

    const manaDamagePercent =
        getSkillLevelEffectValue(
            "mana_resonance",
            "staffMaxManaDamagePercentByLevel"
        );

    return Math.max(
        0,
        Math.floor(
            (
                Number(maximumMana) ||
                0
            ) *
            manaDamagePercent /
            100
        )
    );
}

function getSlashingAttackSpeedSkillBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "melee" ||
        weapon?.weaponClass !==
        "slashing"
    ) {
        return 0;
    }

    return Math.max(
        0,
        getSkillEffectValue(
            "slashingAttackSpeedPercentPerLevel"
        )
    );
}

function getBluntDamageSkillBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "melee" ||
        weapon?.weaponClass !==
        "blunt"
    ) {
        return 0;
    }

    return Math.max(
        0,
        getSkillEffectValue(
            "bluntDamagePercentPerLevel"
        )
    );
}

function getBluntAttackSpeedPenaltySkillBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "melee" ||
        weapon?.weaponClass !==
        "blunt"
    ) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            50,
            getSkillEffectValue(
                "bluntAttackSpeedPenaltyPercentPerLevel"
            )
        )
    );
}

function getBowDodgeChanceSkillBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "ranged" ||
        weapon?.weaponClass !==
        "bow"
    ) {
        return 0;
    }

    return Math.max(
        0,
        getSkillEffectValue(
            "bowDodgeChancePercentPerLevel"
        )
    );
}

function getBowCapstoneAttackSpeedBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "ranged" ||
        weapon?.weaponClass !==
        "bow"
    ) {
        return 0;
    }

    if (
        !isCombatCapstoneSelected(
            "bow_capstone"
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        getUnlockedSkillEffectValue(
            "bow_capstone",
            "bowCapstoneAttackSpeedPercent"
        )
    );
}

function getBowCapstoneDodgeBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "ranged" ||
        weapon?.weaponClass !==
        "bow"
    ) {
        return 0;
    }

    if (
        !isCombatCapstoneSelected(
            "bow_capstone"
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        getUnlockedSkillEffectValue(
            "bow_capstone",
            "bowCapstoneDodgeChancePercent"
        )
    );
}

function getCrossbowCritChanceSkillBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "ranged" ||
        weapon?.weaponClass !==
        "crossbow"
    ) {
        return 0;
    }

    return Math.max(
        0,
        getSkillEffectValue(
            "crossbowCritChancePercentPerLevel"
        )
    );
}

function getCrossbowCapstoneDamageBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "ranged" ||
        weapon?.weaponClass !==
        "crossbow"
    ) {
        return 0;
    }

    if (
        !isCombatCapstoneSelected(
            "crossbow_capstone"
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        getUnlockedSkillEffectValue(
            "crossbow_capstone",
            "crossbowCapstoneDamagePercent"
        )
    );
}

function getCrossbowCapstoneAttackIntervalPenalty(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "ranged" ||
        weapon?.weaponClass !==
        "crossbow"
    ) {
        return 0;
    }

    if (
        !isCombatCapstoneSelected(
            "crossbow_capstone"
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        getUnlockedSkillEffectValue(
            "crossbow_capstone",
            "crossbowCapstoneAttackIntervalPenaltyPercent"
        )
    );
}

function getWandManaRegenerationSkillBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "magic" ||
        weapon?.weaponClass !==
        "wand"
    ) {
        return 0;
    }

    return Math.max(
        0,
        getSkillEffectValue(
            "wandManaRegenerationPerSecondPerLevel"
        )
    );
}

function getWandCapstoneManaCostReduction(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "magic" ||
        weapon?.weaponClass !==
        "wand"
    ) {
        return 0;
    }

    if (
        !isCombatCapstoneSelected(
            "wand_capstone"
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        getUnlockedSkillEffectValue(
            "wand_capstone",
            "wandCapstoneManaCostReductionPercent"
        )
    );
}

function getWandCapstoneCooldownReduction(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "magic" ||
        weapon?.weaponClass !==
        "wand"
    ) {
        return 0;
    }

    if (
        !isCombatCapstoneSelected(
            "wand_capstone"
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        getUnlockedSkillEffectValue(
            "wand_capstone",
            "wandCapstoneCooldownReductionPercent"
        )
    );
}

function getStaffMaxManaSkillBonus(
    providedWeapon = null
) {
    const weapon =
        getCombatSkillWeapon(
            providedWeapon
        );

    if (
        weapon?.weaponType !==
        "magic" ||
        weapon?.weaponClass !==
        "staff"
    ) {
        return 0;
    }

    return Math.max(
        0,
        getSkillEffectValue(
            "staffMaxManaPercentPerLevel"
        )
    );
}

function getStaffCapstoneManaDamageBonus(
    weapon,
    maximumMana
) {
    if (
        weapon?.weaponType !==
        "magic" ||
        weapon?.weaponClass !==
        "staff"
    ) {
        return 0;
    }

    if (
        !isCombatCapstoneSelected(
            "staff_capstone"
        )
    ) {
        return 0;
    }

    const damagePercent =
        getUnlockedSkillEffectValue(
            "staff_capstone",
            "staffCapstoneMaxManaDamagePercent"
        );

    return Math.max(
        0,
        Math.floor(
            (
                Number(maximumMana) ||
                0
            ) *
            damagePercent /
            100
        )
    );
}

function getCombatWeaponCritDamageBonus(
    weapon
) {
    /*
     * Brak broni traktujemy jak
     * walkę wręcz.
     */
    const weaponType =
        weapon?.weaponType ||
        "melee";

    if (
        weaponType ===
        "melee"
    ) {
        return Math.max(
            0,
            getSkillEffectValue(
                "combatMeleeCritDamagePercentPerLevel"
            )
        );
    }

    if (
        weaponType ===
        "magic"
    ) {
        return Math.max(
            0,
            getSkillEffectValue(
                "combatMagicWeaponCritDamagePercentPerLevel"
            )
        );
    }

    return 0;
}

function getOffensiveSpellDamageSkillBonus() {
    const destructionAdeptBonus =
        getSkillLevelEffectValue(
            "arcane_knowledge",
            "offensiveSpellDamageByLevel"
        );
    const offensiveSpellBonuses =
        getSkillEffectValue(
            "offensiveSpellDamagePercentPerLevel"
        );
    const mageMagicBonuses =
        getSkillEffectValue(
            "magicDamagePercentPerLevel"
        );

    return Math.max(
        0,
        destructionAdeptBonus +
        offensiveSpellBonuses +
        mageMagicBonuses
    );
}

function getLootChanceSkillBonus() {
    return getSkillEffectValue(
        "lootChancePercentPerLevel"
    );
}

function getHuntingChestChanceSkillBonus() {
    return getSkillEffectValue(
        "chestChancePercentPerLevel"
    );
}

function getRareHuntingLootChanceSkillBonus() {
    return Math.max(
        0,
        getSkillEffectValue(
            "rareHuntingLootChancePercentPerLevel"
        )
    );
}

function getLuckyFindDoubleDropChance() {
    return Math.max(
        0,
        Math.min(
            100,
            getSkillEffectValue(
                "monsterMaterialDoubleChancePercentPerLevel"
            )
        )
    );
}

function getProfessionExperienceSkillBonus() {
    return Math.max(
        0,
        getSkillEffectValue(
            "professionExperiencePercentPerLevel"
        )
    );
}

function getGatheringSpeedSkillBonus() {
    return Math.max(
        0,
        getSkillEffectValue(
            "gatheringSpeedPercentPerLevel"
        )
    );
}

function getBountifulHarvestChance() {
    return Math.max(
        0,
        Math.min(
            100,
            getSkillEffectValue(
                "bountifulHarvestChancePercentPerLevel"
            )
        )
    );
}

function rollBountifulHarvestAmount(
    baseAmount = 1
) {
    const safeBaseAmount = Math.max(
        1,
        Math.floor(
            Number(baseAmount) || 1
        )
    );

    const doubleChance =
        getBountifulHarvestChance();

    if (
        Math.random() * 100 >=
        doubleChance
    ) {
        return safeBaseAmount;
    }

    return safeBaseAmount * 2;
}

function getRespawnTimeReductionSkillBonus() {
    return Math.max(
        0,
        getSkillEffectValue(
            "respawnTimeReductionPercentPerLevel"
        )
    );
}

function getPlayerRespawnDurationSeconds(
    baseDurationSeconds = 10
) {
    const safeBaseDuration = Math.max(
        1,
        Number(baseDurationSeconds) || 10
    );

    const reductionPercent = Math.min(
        90,
        getRespawnTimeReductionSkillBonus()
    );

    const finalDuration =
        safeBaseDuration *
        (1 - reductionPercent / 100);

    /*
     * Zaokrąglenie do jednej cyfry
     * po przecinku, np. 9,5 sekundy.
     */
    return Math.max(
        1,
        Math.round(finalDuration * 10) / 10
    );
}

function getExplorationRespawnShieldPercent() {
    return Math.max(
        0,
        Math.min(
            100,
            getSkillEffectValue(
                "respawnShieldMaxHpPercentPerLevel"
            )
        )
    );
}

function applyProfessionExperienceBonus(amount) {
    const baseExperience = Math.max(
        0,
        Number(amount) || 0
    );

    const bonusPercent =
        getProfessionExperienceSkillBonus();

    const experienceWithBonus =
        baseExperience *
        (1 + bonusPercent / 100);

    /*
     * Zaokrąglamy tylko do czterech miejsc,
     * żeby uniknąć błędów typu:
     * 3.089999999999999.
     */
    return Math.round(
        experienceWithBonus * 10000
    ) / 10000;
}

function getCraftingSpeedReduction() {
    return Math.max(
        0,
        Math.min(
            75,
            getSkillEffectValue(
                "craftingSpeedPercentPerLevel"
            )
        )
    );
}

function getCraftingExperienceBonus() {
    return Math.max(
        0,
        Math.min(
            200,
            getSkillEffectValue(
                "craftingExperiencePercentPerLevel"
            )
        )
    );
}

function getCraftingInstantCycleChance() {
    return Math.max(
        0,
        Math.min(
            50,
            getSkillEffectValue(
                "craftingInstantCycleChancePercentPerLevel"
            )
        )
    );
}

function getCraftingMaterialRecoveryChance() {
    return Math.max(
        0,
        Math.min(
            50,
            getSkillEffectValue(
                "craftingMaterialRecoveryChancePercentPerLevel"
            )
        )
    );
}

function getCraftingExtraResultChance() {
    return Math.max(
        0,
        Math.min(
            50,
            getSkillEffectValue(
                "craftingExtraResultChancePercentPerLevel"
            )
        )
    );
}

function getCraftingGoldReduction() {
    return Math.min(
        80,
        getSkillEffectValue(
            "craftingGoldReductionPercentPerLevel"
        )
    );
}

function getCraftingSecondInstantCycleChance() {
    return Math.max(
        0,
        Math.min(
            100,
            getSkillEffectValue(
                "craftingSecondInstantCycleChancePercentPerLevel"
            )
        )
    );
}

function getCraftingFullRecoveryChance() {
    return Math.max(
        0,
        Math.min(
            100,
            getSkillEffectValue(
                "craftingFullRecoveryChancePercentPerLevel"
            )
        )
    );
}

function getCraftingExtraResultQuantity() {
    const quantity =
        getSkillLevelEffectValue(
            "perfect_batch",
            "craftingExtraResultQuantityByLevel"
        );

    /*
     * Bez rozwiniętej Doskonałej partii
     * Kontrola jakości nadal daje
     * jedną dodatkową sztukę.
     */
    return Math.max(
        1,
        Math.floor(
            Number(quantity) || 1
        )
    );
}

function isCraftingMassProductionActive() {
    return (
        isCraftingCapstoneSelected(
            "crafting_mass_production_capstone"
        ) &&
        getUnlockedSkillEffectValue(
            "crafting_mass_production_capstone",
            "craftingMassProductionChainEnabled"
        ) >
        0
    );
}

function getCraftingMassProductionMaximumBonusCycles() {
    if (
        !isCraftingMassProductionActive()
    ) {
        return 0;
    }

    return Math.max(
        0,
        Math.floor(
            getUnlockedSkillEffectValue(
                "crafting_mass_production_capstone",
                "craftingMassProductionMaximumBonusCycles"
            )
        )
    );
}

function getCraftingLosslessWorkshopChance() {
    if (
        !isCraftingCapstoneSelected(
            "crafting_lossless_workshop_capstone"
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            100,
            getUnlockedSkillEffectValue(
                "crafting_lossless_workshop_capstone",
                "craftingLosslessWorkshopChancePercent"
            )
        )
    );
}

function getCraftingMasterpieceChance() {
    if (
        !isCraftingCapstoneSelected(
            "crafting_masterpiece_capstone"
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            100,
            getUnlockedSkillEffectValue(
                "crafting_masterpiece_capstone",
                "craftingMasterpieceChancePercent"
            )
        )
    );
}

function getCraftingMasterpieceStackBonusQuantity() {
    if (
        !isCraftingCapstoneSelected(
            "crafting_masterpiece_capstone"
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        Math.floor(
            getUnlockedSkillEffectValue(
                "crafting_masterpiece_capstone",
                "craftingMasterpieceStackBonusQuantity"
            )
        )
    );
}

function getCraftingMasterpieceEquipmentStatPercent() {
    if (
        !isCraftingCapstoneSelected(
            "crafting_masterpiece_capstone"
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        getUnlockedSkillEffectValue(
            "crafting_masterpiece_capstone",
            "craftingMasterpieceEquipmentStatPercent"
        )
    );
}

function getTradeBuyPriceReduction() {
    return Math.max(
        0,
        Math.min(
            75,
            getSkillEffectValue(
                "buyPriceReductionPercentPerLevel"
            )
        )
    );
}

function getTradeSellPriceBonus() {
    return Math.max(
        0,
        Math.min(
            200,
            getSkillEffectValue(
                "sellPricePercentPerLevel"
            )
        )
    );
}

function getTradeOrderGoldRewardBonus() {
    return Math.max(
        0,
        Math.min(
            200,
            getSkillEffectValue(
                "tradeOrderGoldRewardPercentPerLevel"
            )
        )
    );
}

function getBulkPurchaseReduction() {
    return Math.max(
        0,
        Math.min(
            50,
            getSkillEffectValue(
                "bulkPurchaseReductionPercentPerLevel"
            )
        )
    );
}

function getEquipmentSellPriceBonus() {
    return Math.max(
        0,
        Math.min(
            100,
            getSkillEffectValue(
                "equipmentSellPricePercentPerLevel"
            )
        )
    );
}

function getQuestExperienceBonus() {
    return Math.max(
        0,
        Math.min(
            100,
            getSkillEffectValue(
                "questExperiencePercentPerLevel"
            )
        )
    );
}

function getFinalTradeBuyPrice(
    basePrice
) {
    const safeBasePrice =
        Math.max(
            0,
            Number(basePrice) || 0
        );

    const reduction =
        getTradeBuyPriceReduction();

    /*
     * Cena zakupu jest zaokrąglana
     * w górę, aby przedmiot o niskiej
     * cenie nie stał się zbyt łatwo darmowy.
     */
    return Math.max(
        safeBasePrice > 0
            ? 1
            : 0,

        Math.ceil(
            safeBasePrice *
            (
                1 -
                reduction /
                100
            )
        )
    );
}

function getFinalTradeBulkBuyPrice(
    basePrice,
    quantity
) {
    const safeBasePrice =
        Math.max(
            0,
            Number(basePrice) || 0
        );

    const safeQuantity =
        Math.max(
            1,
            Math.floor(
                Number(quantity) || 1
            )
        );

    /*
     * Zwykła zniżka działa
     * przy każdym zakupie.
     */
    const regularReduction =
        getTradeBuyPriceReduction();

    /*
     * Zniżka hurtowa działa dopiero
     * od 10 sztuk.
     */
    const bulkReduction =
        safeQuantity >= 10
            ? getBulkPurchaseReduction()
            : 0;

    const totalReduction =
        Math.min(
            90,
            regularReduction +
            bulkReduction
        );

    return Math.max(
        safeBasePrice > 0
            ? 1
            : 0,

        Math.ceil(
            safeBasePrice *
            (
                1 -
                totalReduction /
                100
            )
        )
    );
}

function getFinalTradeSellPrice(
    basePrice
) {
    const safeBasePrice =
        Math.max(
            0,
            Number(basePrice) || 0
        );

    const bonus =
        getTradeSellPriceBonus();

    return Math.max(
        0,
        Math.floor(
            safeBasePrice *
            (
                1 +
                bonus /
                100
            )
        )
    );
}

function getFinalTradeOrderGoldReward(
    baseReward
) {
    const safeBaseReward =
        Math.max(
            0,
            Number(baseReward) || 0
        );

    const bonus =
        getTradeOrderGoldRewardBonus();

    return Math.max(
        0,
        Math.floor(
            safeBaseReward *
            (
                1 +
                bonus /
                100
            )
        )
    );
}

function rollTradeChance(
    chancePercent
) {
    const safeChance =
        Math.max(
            0,
            Math.min(
                100,
                Number(chancePercent) || 0
            )
        );

    if (safeChance <= 0) {
        return false;
    }

    if (safeChance >= 100) {
        return true;
    }

    return (
        Math.random() * 100 <
        safeChance
    );
}

function getMerchantRefundChance() {
    return Math.max(
        0,
        Math.min(
            100,
            getSkillEffectValue(
                "merchantRefundChancePercentPerLevel"
            )
        )
    );
}

function getHotMerchandiseChance() {
    return Math.max(
        0,
        Math.min(
            100,
            getSkillEffectValue(
                "hotMerchandiseChancePercentPerLevel"
            )
        )
    );
}

function getTimelyCompletionChance() {
    return Math.max(
        0,
        Math.min(
            100,
            getSkillEffectValue(
                "timelyCompletionChancePercentPerLevel"
            )
        )
    );
}

function getSellPriceSkillBonus() {
    return getSkillEffectValue(
        "sellPricePercentPerLevel"
    );
}

function getUnlockedSkillEffectValue(
    skillId,
    effectName
) {
    const skill = skills[skillId];

    if (
        !skill ||
        getSkillLevel(skillId) <= 0 ||
        !isSkillClassRequirementMet(
            skill
        ) ||
        (
            isWarriorCapstoneSkill(
                skillId
            ) &&
            !isWarriorCapstoneSelected(
                skillId
            )
        ) ||
        (
            isHunterCapstoneSkill(
                skillId
            ) &&
            !isHunterCapstoneSelected(
                skillId
            )
        ) ||
        (
            isMageCapstoneSkill(
                skillId
            ) &&
            !isMageCapstoneSelected(
                skillId
            )
        ) ||
        (
            isGuardianCapstoneSkill(
                skillId
            ) &&
            !isGuardianCapstoneSelected(
                skillId
            )
        ) ||
        (
            isRogueCapstoneSkill(
                skillId
            ) &&
            !isRogueCapstoneSelected(
                skillId
            )
        )
        ||
        (
            isCombatCapstoneSkill(
                skillId
            ) &&
            !isCombatCapstoneSelected(
                skillId
            )
        )
    ) {
        return 0;
    }

    return Math.max(
        0,
        Number(
            skill.effect?.[effectName]
        ) || 0
    );
}

function getSpentSkillPoints() {
    if (
        !player.skills ||
        typeof player.skills !==
        "object"
    ) {
        return 0;
    }

    return Object.entries(
        player.skills
    ).reduce(
        (
            total,
            [skillId, savedLevel]
        ) => {
            const skill = skills[skillId];

            if (!skill) {
                return total;
            }

            const level = Math.max(
                0,
                Math.min(
                    skill.maxLevel,
                    Math.floor(
                        Number(
                            savedLevel
                        ) || 0
                    )
                )
            );

            return (
                total +
                level *
                skill.costPerLevel
            );
        },
        0
    );
}

function getSpentSkillGold() {
    return Math.max(
        0,
        Math.floor(
            Number(
                player.skillGoldSpent
            ) || 0
        )
    );
}

function hasResettablePermanentCapstone() {
    const combatCapstoneId =
        typeof getLockedCombatCapstone ===
            "function"
            ? getLockedCombatCapstone()
            : null;

    const craftingCapstoneId =
        typeof getLockedCraftingCapstone ===
            "function"
            ? getLockedCraftingCapstone()
            : null;

    const tradeCapstoneId =
        typeof getLockedTradeCapstone ===
            "function"
            ? getLockedTradeCapstone()
            : null;

    return Boolean(
        combatCapstoneId ||
        craftingCapstoneId ||
        tradeCapstoneId
    );
}

function getSkillResetGoldRefund() {
    /*
     * Reset zwraca punkty umiejętności,
     * ale nie zwraca złota wydanego
     * na ich rozwijanie.
     */
    return 0;
}
function getSkillResetCost() {
    const spentPoints =
        typeof getSpentSkillPoints ===
            "function"
            ? getSpentSkillPoints()
            : 0;

    if (spentPoints <= 0) {
        return 0;
    }

    const resetCount =
        Math.max(
            0,
            Math.floor(
                Number(
                    player.skillResetCount
                ) || 0
            )
        );

    const baseCost =
        1000;

    const spentPointsCost =
        spentPoints *
        spentPoints *
        250;
    const previousResetsCost =
        resetCount *
        25000;

    const capstoneCost =
        hasResettablePermanentCapstone()
            ? 250000
            : 0;

    return Math.max(
        0,
        Math.floor(
            baseCost +
            spentPointsCost +
            previousResetsCost +
            capstoneCost
        )
    );
}

function resetAllSkills() {
    const spentPoints =
        getSpentSkillPoints();

    if (spentPoints <= 0) {
        showSkillError(
            "Nie masz wydanych punktów do zresetowania."
        );

        return;
    }

    const resetCost =
        getSkillResetCost();

    const currentGold =
        Math.max(
            0,
            Number(player.gold) || 0
        );

    if (currentGold < resetCost) {
        showSkillError(
            "Potrzebujesz " +
            resetCost.toLocaleString(
                "pl-PL"
            ) +
            " złota, aby zresetować umiejętności."
        );

        return;
    }

    const combatCapstoneId =
        typeof getLockedCombatCapstone ===
            "function"
            ? getLockedCombatCapstone()
            : null;

    const craftingCapstoneId =
        typeof getLockedCraftingCapstone ===
            "function"
            ? getLockedCraftingCapstone()
            : null;
    const tradeCapstoneId =
        typeof getLockedTradeCapstone ===
            "function"
            ? getLockedTradeCapstone()
            : null;

    const removedSpecializations = [];

    if (combatCapstoneId) {
        const combatCapstone =
            skills[
            combatCapstoneId
            ];

        removedSpecializations.push(
            combatCapstone?.name ||
            "specjalizacja Walki"
        );
    }

    if (craftingCapstoneId) {
        const craftingCapstone =
            skills[
            craftingCapstoneId
            ];

        removedSpecializations.push(
            craftingCapstone?.name ||
            "specjalizacja Rzemiosła"
        );
    }
    if (tradeCapstoneId) {
        const tradeCapstone =
            skills[
            tradeCapstoneId
            ];

        removedSpecializations.push(
            tradeCapstone?.name ||
            "specjalizacja Handlu"
        );
    }

    const specializationText =
        removedSpecializations.length > 0
            ? (
                "\n\nUsunięte specjalizacje końcowe:\n• " +
                removedSpecializations.join(
                    "\n• "
                )
            )
            : "";

    const shouldReset =
        window.confirm(
            "Zresetować wszystkie umiejętności?\n\n" +

            "Odzyskasz: " +
            spentPoints +
            " pkt umiejętności.\n" +

            "Koszt resetu: " +
            resetCost.toLocaleString(
                "pl-PL"
            ) +
            " złota.\n\n" +

            "Złoto wydane wcześniej na rozwijanie umiejętności nie zostanie zwrócone." +

            specializationText
        );

    if (!shouldReset) {
        return;
    }

    /*
     * Pobieramy opłatę za reset.
     */
    player.gold =
        currentGold -
        resetCost;

    /*
     * Zwracamy wszystkie wydane punkty.
     */
    player.skillPoints =
        Math.max(
            0,
            Number(
                player.skillPoints
            ) || 0
        ) +
        spentPoints;

    player.skills = {};

    player.skillGoldSpent = 0;

    player.selectedWarriorCapstone =
        null;

    player.selectedHunterCapstone =
        null;

    player.selectedMageCapstone =
        null;

    player.selectedGuardianCapstone =
        null;

    player.selectedRogueCapstone =
        null;

    player.selectedSpells = {
        offensive: null,
        defensive: null
    };

    player.spellCooldowns = {};

    /*
     * Czyścimy trwające efekty czarów,
     * które mogły zostać usunięte resetem.
     */
    if (
        player.activeEffects &&
        typeof player.activeEffects ===
        "object"
    ) {
        player.activeEffects
            .arcaneBarrierUntil = 0;

        player.activeEffects
            .manaShieldUntil = 0;

        player.activeEffects
            .regenerationUntil = 0;

        player.activeEffects
            .regenerationNextTickAt = 0;

        player.activeEffects
            .regenerationTickMilliseconds =
            1000;

        player.activeEffects
            .regenerationHealingPerTick =
            0;

        player.activeEffects
            .mirrorImageUntil = 0;

        player.activeEffects
            .mirrorImageCharges = 0;
    }

    /*
     * Zwiększamy licznik dopiero po
     * rzeczywistym wykonaniu resetu.
     */
    player.skillResetCount =
        Math.max(
            0,
            Math.floor(
                Number(
                    player.skillResetCount
                ) || 0
            )
        ) +
        1;

    /*
     * Resetujemy tymczasowe stany walki.
     */
    if (
        typeof resetWarriorCombatState ===
        "function"
    ) {
        resetWarriorCombatState();
    }

    if (
        typeof resetHunterCombatState ===
        "function"
    ) {
        resetHunterCombatState();
    }

    if (
        typeof resetMageCombatState ===
        "function"
    ) {
        resetMageCombatState();
    }

    if (
        typeof resetGuardianCombatState ===
        "function"
    ) {
        resetGuardianCombatState();
    }

    if (
        typeof resetRogueCombatState ===
        "function"
    ) {
        resetRogueCombatState();
    }

    if (
        typeof resetCombatWeaponCapstoneState ===
        "function"
    ) {
        resetCombatWeaponCapstoneState();
    }

    if (
        typeof resetSpellCombatState ===
        "function"
    ) {
        resetSpellCombatState();
    }

    /*
     * Po usunięciu bonusów maksymalne HP
     * i mana mogą spaść. Ograniczamy więc
     * obecne zasoby do nowych limitów.
     */
    if (
        typeof getDerivedStats ===
        "function"
    ) {
        const derived =
            getDerivedStats();

        player.hp =
            Math.min(
                Number(player.hp) || 0,
                derived.maxHp
            );

        player.mana =
            Math.min(
                Number(player.mana) || 0,
                derived.maxMana
            );
    }

    if (
        typeof showNotification ===
        "function"
    ) {
        showNotification(
            "Zresetowano umiejętności. Odzyskano " +
            spentPoints +
            " pkt. Koszt: " +
            resetCost.toLocaleString(
                "pl-PL"
            ) +
            " złota.",
            "success"
        );
    }

    saveGame();
    render();

    if (
        typeof refreshSkillsView ===
        "function"
    ) {
        refreshSkillsView();
    }
}

function isWarriorMeleeAttack() {
    if (
        player.classId !== "warrior"
    ) {
        return false;
    }

    const weaponId =
        player.equipment?.weapon;

    const weapon =
        weaponId
            ? items[weaponId]
            : null;

    return (
        !weapon ||
        weapon.weaponType === "melee"
    );
}

function clearWarriorBleeds() {
    warriorCombatState.bleeds = [];
}

function resetCombatWeaponCapstoneState() {
    combatWeaponCapstoneState
        .slashingAttackCount = 0;
}

function resetWarriorCombatState() {
    warriorCombatState
        .momentumCharges = 0;

    warriorCombatState
        .secondWindUsed = false;

    clearWarriorBleeds();
}

function resetWarriorAfterRespawn() {
    warriorCombatState
        .momentumCharges = 0;

    warriorCombatState
        .secondWindUsed = false;

    clearWarriorBleeds();
}

function getWarriorBerserkerHpThreshold() {
    return getUnlockedSkillEffectValue(
        "berserker",
        "berserkerHpThresholdPercent"
    );
}

function isWarriorBerserkerActive() {
    if (
        !isWarriorMeleeAttack() ||
        !isWarriorCapstoneSelected(
            "berserker"
        )
    ) {
        return false;
    }

    const derived =
        getDerivedStats();

    if (derived.maxHp <= 0) {
        return false;
    }

    const currentHpPercent =
        (
            Math.max(
                0,
                Number(player.hp) || 0
            ) /
            derived.maxHp
        ) *
        100;

    return (
        currentHpPercent <=
        getWarriorBerserkerHpThreshold()
    );
}

function getWarriorBerserkerAttackSpeedPercent() {
    if (!isWarriorBerserkerActive()) {
        return 0;
    }

    return getUnlockedSkillEffectValue(
        "berserker",
        "berserkerAttackSpeedPercent"
    );
}

function applyWarriorAttackModifiers(
    attackResult
) {
    if (
        !attackResult ||
        !isWarriorMeleeAttack()
    ) {
        return attackResult;
    }

    let damage = Math.max(
        0,
        Number(
            attackResult.damage
        ) || 0
    );

    let usedMomentum = false;

    const momentumBonus =
        getSkillEffectValue(
            "battleMomentumDamagePercentPerLevel"
        );

    if (
        momentumBonus > 0 &&
        warriorCombatState
            .momentumCharges > 0
    ) {
        damage *=
            1 +
            momentumBonus / 100;

        warriorCombatState
            .momentumCharges--;

        usedMomentum = true;
    }

    const powerStrikeChance =
        Math.min(
            100,
            getSkillEffectValue(
                "powerStrikeChancePercentPerLevel"
            )
        );

    const powerStrikeTriggered =
        powerStrikeChance > 0 &&
        Math.random() * 100 <=
        powerStrikeChance;

    if (powerStrikeTriggered) {
        damage *=
            1 +
            getUnlockedSkillEffectValue(
                "power_strike",
                "powerStrikeBonusDamagePercent"
            ) /
            100;
    }

    const berserkerActive =
        isWarriorBerserkerActive();

    if (berserkerActive) {
        damage *=
            1 +
            getUnlockedSkillEffectValue(
                "berserker",
                "berserkerDamagePercent"
            ) /
            100;
    }

    if (
        attackResult.isCritical &&
        getSkillLevel(
            "battle_momentum"
        ) > 0
    ) {
        warriorCombatState
            .momentumCharges =
            getUnlockedSkillEffectValue(
                "battle_momentum",
                "battleMomentumAttackCount"
            );
    }

    return {
        ...attackResult,

        damage: Math.max(
            1,
            Math.floor(damage)
        ),

        warriorPowerStrike:
            powerStrikeTriggered,

        warriorMomentum:
            usedMomentum,

        warriorBerserker:
            berserkerActive
    };
}

function isHunterRangedAttack() {
    if (
        player.classId !== "hunter"
    ) {
        return false;
    }

    const weaponId =
        player.equipment?.weapon;

    const weapon =
        weaponId
            ? items[weaponId]
            : null;

    return (
        weapon?.weaponType ===
        "ranged"
    );
}

function resetHunterCombatState() {
    hunterCombatState
        .attacksSinceSniperShot = 0;

    hunterCombatState
        .counterShotCharges = 0;
}

function resetHunterAfterRespawn() {
    resetHunterCombatState();
}

function getHunterAttackSpeedPercent() {
    if (!isHunterRangedAttack()) {
        return 0;
    }

    return Math.min(
        100,
        getSkillEffectValue(
            "rangedAttackSpeedPercentPerLevel"
        )
    );
}

function registerHunterDodge() {
    if (
        !isHunterRangedAttack() ||
        getSkillLevel(
            "counter_shot"
        ) <= 0
    ) {
        return 0;
    }

    const charges =
        isHunterCapstoneSelected(
            "tracker"
        )
            ? getUnlockedSkillEffectValue(
                "tracker",
                "trackerCounterCharges"
            )
            : getUnlockedSkillEffectValue(
                "counter_shot",
                "counterShotCharges"
            );

    hunterCombatState
        .counterShotCharges =
        Math.max(
            hunterCombatState
                .counterShotCharges,
            Math.floor(charges)
        );

    return hunterCombatState
        .counterShotCharges;
}

function applyHunterAttackModifiers(
    attackResult
) {
    if (
        !attackResult ||
        !isHunterRangedAttack()
    ) {
        return attackResult;
    }

    let damage = Math.max(
        0,
        Number(
            attackResult.damage
        ) || 0
    );

    let isCritical =
        attackResult.isCritical ===
        true;

    let sniperShot = false;

    if (
        isHunterCapstoneSelected(
            "sniper"
        )
    ) {
        const attackInterval =
            Math.max(
                1,
                Math.floor(
                    getUnlockedSkillEffectValue(
                        "sniper",
                        "sniperAttackInterval"
                    )
                )
            );

        hunterCombatState
            .attacksSinceSniperShot++;

        if (
            hunterCombatState
                .attacksSinceSniperShot >=
            attackInterval
        ) {
            hunterCombatState
                .attacksSinceSniperShot = 0;

            sniperShot = true;

            if (!isCritical) {
                const derived =
                    getDerivedStats();

                damage *= Math.max(
                    1,
                    (
                        Number(
                            derived.critDamage
                        ) || 100
                    ) /
                    100
                );

                isCritical = true;
            }
        }
    } else {
        hunterCombatState
            .attacksSinceSniperShot = 0;
    }

    if (isCritical) {
        const weakSpotBonus =
            getSkillEffectValue(
                "rangedCritDamagePercentPerLevel"
            );

        damage *=
            1 +
            weakSpotBonus / 100;
    }

    if (sniperShot) {
        damage *=
            1 +
            getUnlockedSkillEffectValue(
                "sniper",
                "sniperBonusDamagePercent"
            ) /
            100;
    }

    let counterShot = false;

    if (
        hunterCombatState
            .counterShotCharges > 0
    ) {
        const counterDamageBonus =
            isHunterCapstoneSelected(
                "tracker"
            )
                ? getUnlockedSkillEffectValue(
                    "tracker",
                    "trackerCounterDamagePercent"
                )
                : getSkillEffectValue(
                    "counterShotDamagePercentPerLevel"
                );

        damage *=
            1 +
            counterDamageBonus / 100;

        hunterCombatState
            .counterShotCharges--;

        counterShot = true;
    }

    const doubleShotChance =
        Math.min(
            100,
            getSkillEffectValue(
                "doubleShotChancePercentPerLevel"
            )
        );

    const doubleShot =
        doubleShotChance > 0 &&
        Math.random() * 100 <=
        doubleShotChance;

    let additionalArrowDamage = 0;
    let additionalArrowCount = 0;

    if (doubleShot) {
        additionalArrowCount =
            1 +
            (
                isHunterCapstoneSelected(
                    "arrow_storm"
                )
                    ? getUnlockedSkillEffectValue(
                        "arrow_storm",
                        "arrowStormAdditionalArrows"
                    )
                    : 0
            );

        additionalArrowDamage =
            damage *
            getUnlockedSkillEffectValue(
                "double_shot",
                "additionalArrowDamagePercent"
            ) /
            100 *
            additionalArrowCount;

        damage +=
            additionalArrowDamage;
    }

    return {
        ...attackResult,

        damage: Math.max(
            1,
            Math.floor(damage)
        ),

        isCritical:
            isCritical,

        hunterSniperShot:
            sniperShot,

        hunterDoubleShot:
            doubleShot,

        hunterAdditionalArrowCount:
            additionalArrowCount,

        hunterAdditionalArrowDamage:
            Math.max(
                0,
                Math.floor(
                    additionalArrowDamage
                )
            ),

        hunterCounterShot:
            counterShot
    };
}

function resetMageCombatState() {
    mageCombatState
        .arcaneRebirthUsed = false;
}

function resetMageAfterRespawn() {
    resetMageCombatState();
}

function getDefensiveSpellPowerPercent() {
    const protectionAdeptBonus =
        getSkillLevelEffectValue(
            "protection_adept",
            "defensiveSpellPowerByLevel"
        );

    /*
     * Obejmuje między innymi:
     * - Mistrza ochrony,
     * - klasową Magię ochronną Maga.
     */
    const otherDefensiveSpellBonus =
        getSkillEffectValue(
            "defensiveSpellPowerPercentPerLevel"
        );

    return Math.max(
        0,
        Math.min(
            100,
            protectionAdeptBonus +
            otherDefensiveSpellBonus
        )
    );
}

function getMageDefensiveSpellPowerPercent() {
    return getDefensiveSpellPowerPercent();
}

function isMageManaOverflowActive() {
    if (
        player.classId !== "mage" ||
        !isMageCapstoneSelected(
            "mana_overflow"
        )
    ) {
        return false;
    }

    const derived =
        getDerivedStats();

    if (derived.maxMana <= 0) {
        return false;
    }

    const manaPercent =
        (
            Math.max(
                0,
                Number(player.mana) || 0
            ) /
            derived.maxMana
        ) *
        100;

    return (
        manaPercent >=
        getUnlockedSkillEffectValue(
            "mana_overflow",
            "manaOverflowThresholdPercent"
        )
    );
}

function getMageManaOverflowDamagePercent() {
    if (
        !isMageManaOverflowActive()
    ) {
        return 0;
    }

    return getUnlockedSkillEffectValue(
        "mana_overflow",
        "manaOverflowDamagePercent"
    );
}

function applyMageOffensiveSpellEcho(
    damage
) {
    const safeDamage =
        Math.max(
            0,
            Math.floor(
                Number(damage) || 0
            )
        );

    const defaultResult = {
        damage:
            safeDamage,
        echoDamage:
            0,
        triggered:
            false
    };

    if (
        player.classId !== "mage"
    ) {
        return defaultResult;
    }

    const echoChance =
        Math.min(
            100,
            getSkillEffectValue(
                "elementalEchoChancePercentPerLevel"
            )
        );

    if (
        echoChance <= 0 ||
        Math.random() * 100 >
        echoChance
    ) {
        return defaultResult;
    }

    const echoPercent =
        isMageCapstoneSelected(
            "overload"
        )
            ? getUnlockedSkillEffectValue(
                "overload",
                "overloadEchoDamagePercent"
            )
            : getUnlockedSkillEffectValue(
                "elemental_echo",
                "elementalEchoDamagePercent"
            );

    const echoDamage =
        Math.max(
            1,
            Math.floor(
                safeDamage *
                echoPercent /
                100
            )
        );

    return {
        damage:
            safeDamage +
            echoDamage,

        echoDamage:
            echoDamage,

        triggered:
            true
    };
}

function logMageOffensiveSpellEcho(
    echoResult
) {
    if (
        !echoResult?.triggered ||
        typeof addCombatLog !==
        "function"
    ) {
        return;
    }

    addCombatLog(
        "✨ Echo żywiołów zadaje dodatkowo " +
        echoResult.echoDamage +
        " obrażeń."
    );
}

function tryTriggerMageArcaneRebirth() {
    if (
        player.classId !== "mage" ||
        mageCombatState
            .arcaneRebirthUsed ||
        !isMageCapstoneSelected(
            "arcane_rebirth"
        ) ||
        (
            Number(player.hp) ||
            0
        ) >
        0
    ) {
        return {
            triggered:
                false,
            healing:
                0,
            manaSpent:
                0
        };
    }

    const derived =
        getDerivedStats();

    const manaCost =
        Math.max(
            1,
            Math.ceil(
                derived.maxMana *
                getUnlockedSkillEffectValue(
                    "arcane_rebirth",
                    "arcaneRebirthManaCostPercent"
                ) /
                100
            )
        );

    if (
        (
            Number(player.mana) ||
            0
        ) <
        manaCost
    ) {
        return {
            triggered:
                false,
            healing:
                0,
            manaSpent:
                0
        };
    }

    const healing =
        Math.max(
            1,
            Math.floor(
                derived.maxHp *
                getUnlockedSkillEffectValue(
                    "arcane_rebirth",
                    "arcaneRebirthHealingPercent"
                ) /
                100
            )
        );

    player.mana -=
        manaCost;

    player.hp = Math.min(
        derived.maxHp,
        healing
    );

    mageCombatState
        .arcaneRebirthUsed = true;

    return {
        triggered:
            true,
        healing:
            player.hp,
        manaSpent:
            manaCost
    };
}

function isGuardianMeleeAttack() {
    if (
        player.classId !== "guardian"
    ) {
        return false;
    }

    const weaponId =
        player.equipment?.weapon;

    const weapon =
        weaponId
            ? items[weaponId]
            : null;

    return (
        !weapon ||
        weapon.weaponType === "melee"
    );
}

function resetGuardianCombatState() {
    guardianCombatState
        .receivedHits = 0;

    guardianCombatState
        .unyieldingUsed = false;

    guardianCombatState
        .unyieldingGuardCharges = 0;
}

function resetGuardianAfterRespawn() {
    resetGuardianCombatState();
}

function getGuardianReceivedDamageReduction() {
    if (
        player.classId !== "guardian"
    ) {
        return 0;
    }

    let reduction =
        getSkillEffectValue(
            "guardianDamageReductionPercentPerLevel"
        );

    if (
        isGuardianCapstoneSelected(
            "fortress"
        )
    ) {
        const derived =
            getDerivedStats();

        const hpPercent =
            derived.maxHp > 0
                ? Math.max(
                    0,
                    Number(player.hp) || 0
                ) /
                derived.maxHp *
                100
                : 100;

        if (
            hpPercent <=
            getUnlockedSkillEffectValue(
                "fortress",
                "fortressHpThresholdPercent"
            )
        ) {
            reduction +=
                getUnlockedSkillEffectValue(
                    "fortress",
                    "fortressDamageReductionPercent"
                );
        }
    }

    if (
        guardianCombatState
            .unyieldingGuardCharges > 0
    ) {
        reduction +=
            getUnlockedSkillEffectValue(
                "unyielding",
                "unyieldingDamageReductionPercent"
            );
    }

    return Math.max(
        0,
        Math.min(
            80,
            reduction
        )
    );
}

function consumeGuardianGuardCharge() {
    if (
        guardianCombatState
            .unyieldingGuardCharges <= 0
    ) {
        return 0;
    }

    guardianCombatState
        .unyieldingGuardCharges--;

    return guardianCombatState
        .unyieldingGuardCharges;
}

function resolveGuardianReceivedHit() {
    const defaultResult = {
        retaliationTriggered: false,
        retaliationDamage: 0,
        forcedRetaliation: false,
        healing: 0
    };

    if (
        player.classId !== "guardian"
    ) {
        return defaultResult;
    }

    guardianCombatState
        .receivedHits++;

    const hitCount =
        guardianCombatState
            .receivedHits;

    let healing = 0;

    const recoveryInterval =
        Math.max(
            1,
            Math.floor(
                getUnlockedSkillEffectValue(
                    "battle_recovery",
                    "battleRecoveryHitInterval"
                )
            )
        );

    const recoveryPercent =
        getSkillEffectValue(
            "battleRecoveryHealingPercentPerLevel"
        );

    if (
        recoveryPercent > 0 &&
        hitCount % recoveryInterval === 0
    ) {
        const derived =
            getDerivedStats();

        const hpBeforeHealing =
            Number(player.hp) || 0;

        player.hp = Math.min(
            derived.maxHp,
            hpBeforeHealing +
            Math.max(
                1,
                Math.floor(
                    derived.maxHp *
                    recoveryPercent /
                    100
                )
            )
        );

        healing = Math.max(
            0,
            player.hp -
            hpBeforeHealing
        );
    }

    if (!isGuardianMeleeAttack()) {
        return {
            ...defaultResult,
            healing:
                healing
        };
    }

    const retaliationChance =
        Math.max(
            0,
            Math.min(
                100,
                getSkillEffectValue(
                    "guardianRetaliationChancePercentPerLevel"
                )
            )
        );

    const forcedInterval =
        Math.max(
            1,
            Math.floor(
                getUnlockedSkillEffectValue(
                    "spiked_bulwark",
                    "spikedBulwarkHitInterval"
                )
            )
        );

    const forcedRetaliation =
        isGuardianCapstoneSelected(
            "spiked_bulwark"
        ) &&
        hitCount % forcedInterval === 0;

    const retaliationTriggered =
        forcedRetaliation ||
        (
            retaliationChance > 0 &&
            Math.random() * 100 <=
            retaliationChance
        );

    if (!retaliationTriggered) {
        return {
            ...defaultResult,
            healing:
                healing
        };
    }

    const retaliationPercent =
        getUnlockedSkillEffectValue(
            "retaliatory_strike",
            "guardianRetaliationDamagePercent"
        ) +
        getSkillEffectValue(
            "guardianRetaliationDamagePercentPerLevel"
        );

    const retaliationDamage =
        Math.max(
            1,
            Math.floor(
                getAttack() *
                retaliationPercent /
                100
            )
        );

    return {
        retaliationTriggered:
            true,
        retaliationDamage:
            retaliationDamage,
        forcedRetaliation:
            forcedRetaliation,
        healing:
            healing
    };
}

function tryTriggerGuardianUnyielding() {
    if (
        player.classId !== "guardian" ||
        guardianCombatState
            .unyieldingUsed ||
        !isGuardianCapstoneSelected(
            "unyielding"
        ) ||
        (
            Number(player.hp) ||
            0
        ) >
        0
    ) {
        return {
            triggered: false,
            healing: 0,
            guardCharges: 0
        };
    }

    const derived =
        getDerivedStats();

    const healing =
        Math.max(
            1,
            Math.floor(
                derived.maxHp *
                getUnlockedSkillEffectValue(
                    "unyielding",
                    "unyieldingHealingPercent"
                ) /
                100
            )
        );

    player.hp = Math.min(
        derived.maxHp,
        healing
    );

    guardianCombatState
        .unyieldingUsed = true;

    guardianCombatState
        .unyieldingGuardCharges =
        Math.max(
            0,
            Math.floor(
                getUnlockedSkillEffectValue(
                    "unyielding",
                    "unyieldingGuardCharges"
                )
            )
        );

    return {
        triggered: true,
        healing: player.hp,
        guardCharges:
            guardianCombatState
                .unyieldingGuardCharges
    };
}

function isRogueMeleeAttack() {
    if (
        player.classId !== "rogue"
    ) {
        return false;
    }

    const weaponId =
        player.equipment?.weapon;

    const weapon =
        weaponId
            ? items[weaponId]
            : null;

    return (
        !weapon ||
        weapon.weaponType === "melee"
    );
}

function clearRoguePoisons() {
    rogueCombatState.poisons = [];
}

function resetRogueCombatState() {
    rogueCombatState
        .shadowstepCharges = 0;

    rogueCombatState
        .attacksSinceBladeDance = 0;

    clearRoguePoisons();
}

function resetRogueAfterRespawn() {
    resetRogueCombatState();
}

function getRogueAttackSpeedPercent() {
    if (!isRogueMeleeAttack()) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            60,
            getSkillEffectValue(
                "rogueAttackSpeedPercentPerLevel"
            )
        )
    );
}

function registerRogueDodge() {
    if (
        !isRogueMeleeAttack() ||
        getSkillLevel(
            "shadowstep"
        ) <= 0
    ) {
        return 0;
    }

    rogueCombatState
        .shadowstepCharges = 1;

    return rogueCombatState
        .shadowstepCharges;
}

function isRogueExecutionerActive() {
    if (
        !isRogueMeleeAttack() ||
        !isRogueCapstoneSelected(
            "executioner"
        ) ||
        typeof enemy ===
        "undefined" ||
        !enemy ||
        (
            Number(enemy.maxHp) ||
            0
        ) <=
        0
    ) {
        return false;
    }

    const enemyHpPercent =
        Math.max(
            0,
            Number(enemy.hp) || 0
        ) /
        enemy.maxHp *
        100;

    return (
        enemyHpPercent <=
        getUnlockedSkillEffectValue(
            "executioner",
            "executionerEnemyHpThresholdPercent"
        )
    );
}

function applyRogueAttackModifiers(
    attackResult
) {
    if (
        !attackResult ||
        !isRogueMeleeAttack()
    ) {
        return attackResult;
    }

    let damage =
        Math.max(
            0,
            Number(
                attackResult.damage
            ) || 0
        );

    const shadowstepTriggered =
        rogueCombatState
            .shadowstepCharges > 0;

    if (shadowstepTriggered) {
        damage *=
            1 +
            getSkillEffectValue(
                "shadowstepDamagePercentPerLevel"
            ) /
            100;

        rogueCombatState
            .shadowstepCharges--;
    }

    const executionerTriggered =
        isRogueExecutionerActive();

    if (executionerTriggered) {
        damage *=
            1 +
            getUnlockedSkillEffectValue(
                "executioner",
                "executionerDamagePercent"
            ) /
            100;
    }

    let bladeDanceTriggered = false;
    let bladeDanceDamage = 0;

    if (
        isRogueCapstoneSelected(
            "blade_dance"
        )
    ) {
        const attackInterval =
            Math.max(
                1,
                Math.floor(
                    getUnlockedSkillEffectValue(
                        "blade_dance",
                        "bladeDanceAttackInterval"
                    )
                )
            );

        rogueCombatState
            .attacksSinceBladeDance++;

        if (
            rogueCombatState
                .attacksSinceBladeDance >=
            attackInterval
        ) {
            rogueCombatState
                .attacksSinceBladeDance = 0;

            bladeDanceTriggered = true;

            bladeDanceDamage =
                damage *
                getUnlockedSkillEffectValue(
                    "blade_dance",
                    "bladeDanceAdditionalDamagePercent"
                ) /
                100;

            damage +=
                bladeDanceDamage;
        }
    } else {
        rogueCombatState
            .attacksSinceBladeDance = 0;
    }

    return {
        ...attackResult,

        damage:
            Math.max(
                1,
                Math.floor(damage)
            ),

        rogueShadowstep:
            shadowstepTriggered,

        rogueExecutioner:
            executionerTriggered,

        rogueBladeDance:
            bladeDanceTriggered,

        rogueBladeDanceDamage:
            Math.max(
                0,
                Math.floor(
                    bladeDanceDamage
                )
            )
    };
}

function tryApplyRoguePoison(
    attackDamage
) {
    if (!isRogueMeleeAttack()) {
        return false;
    }

    const poisonChance =
        Math.max(
            0,
            Math.min(
                100,
                getSkillEffectValue(
                    "poisonChancePercentPerLevel"
                )
            )
        );

    if (
        poisonChance <= 0 ||
        Math.random() * 100 >
        poisonChance
    ) {
        return false;
    }

    const durationSeconds =
        getUnlockedSkillEffectValue(
            "poisoned_blade",
            "poisonDurationSeconds"
        );

    const tickSeconds =
        Math.max(
            0.1,
            getUnlockedSkillEffectValue(
                "poisoned_blade",
                "poisonTickSeconds"
            )
        );

    const tickCount =
        Math.max(
            1,
            Math.floor(
                durationSeconds /
                tickSeconds
            )
        );

    const poisonDamageBonus =
        getSkillEffectValue(
            "poisonDamageBonusPercentPerLevel"
        ) +
        getUnlockedSkillEffectValue(
            "deadly_venom",
            "deadlyVenomDamagePercent"
        );

    const damagePerTick =
        Math.max(
            1,
            Math.floor(
                Math.max(
                    1,
                    Number(
                        attackDamage
                    ) || 1
                ) *
                getUnlockedSkillEffectValue(
                    "poisoned_blade",
                    "poisonDamagePercentPerTick"
                ) /
                100 *
                (
                    1 +
                    poisonDamageBonus /
                    100
                )
            )
        );

    const tickMilliseconds =
        tickSeconds *
        1000;

    const newPoison = {
        damagePerTick:
            damagePerTick,
        ticksRemaining:
            tickCount,
        tickMilliseconds:
            tickMilliseconds,
        nextTickAt:
            Date.now() +
            tickMilliseconds
    };

    if (
        !isRogueCapstoneSelected(
            "deadly_venom"
        )
    ) {
        rogueCombatState.poisons = [
            newPoison
        ];

        return true;
    }

    const maximumStacks =
        Math.max(
            1,
            Math.floor(
                getUnlockedSkillEffectValue(
                    "deadly_venom",
                    "deadlyVenomMaximumStacks"
                )
            )
        );

    rogueCombatState.poisons.push(
        newPoison
    );

    while (
        rogueCombatState
            .poisons.length >
        maximumStacks
    ) {
        rogueCombatState
            .poisons.shift();
    }

    return true;
}

function collectRoguePoisonDamage() {
    if (
        rogueCombatState
            .poisons.length === 0
    ) {
        return 0;
    }

    const now = Date.now();
    let totalDamage = 0;

    rogueCombatState
        .poisons.forEach(poison => {
            while (
                poison.ticksRemaining > 0 &&
                now >=
                poison.nextTickAt
            ) {
                totalDamage +=
                    poison.damagePerTick;

                poison.ticksRemaining--;

                poison.nextTickAt +=
                    poison.tickMilliseconds;
            }
        });

    rogueCombatState.poisons =
        rogueCombatState
            .poisons.filter(poison => {
                return (
                    poison.ticksRemaining >
                    0
                );
            });

    return Math.max(
        0,
        Math.floor(totalDamage)
    );
}

function tryApplyWarriorBleed(
    attackDamage
) {
    if (!isWarriorMeleeAttack()) {
        return false;
    }

    const bleedChance =
        Math.min(
            100,
            getSkillEffectValue(
                "bleedChancePercentPerLevel"
            )
        );

    if (
        bleedChance <= 0 ||
        Math.random() * 100 >
        bleedChance
    ) {
        return false;
    }

    const durationSeconds =
        getUnlockedSkillEffectValue(
            "serrated_blade",
            "bleedDurationSeconds"
        );

    const tickSeconds =
        Math.max(
            0.1,
            getUnlockedSkillEffectValue(
                "serrated_blade",
                "bleedTickSeconds"
            )
        );

    const tickCount = Math.max(
        1,
        Math.floor(
            durationSeconds /
            tickSeconds
        )
    );

    const deepWoundsBonus =
        getSkillEffectValue(
            "bleedDamageBonusPercentPerLevel"
        );

    const damagePerTick =
        Math.max(
            1,
            Math.floor(
                Math.max(
                    1,
                    Number(
                        attackDamage
                    ) || 1
                ) *
                getUnlockedSkillEffectValue(
                    "serrated_blade",
                    "bleedDamagePercentPerTick"
                ) /
                100 *
                (
                    1 +
                    deepWoundsBonus /
                    100
                )
            )
        );

    const now = Date.now();

    const newBleed = {
        damagePerTick:
            damagePerTick,

        ticksRemaining:
            tickCount,

        tickMilliseconds:
            tickSeconds * 1000,

        nextTickAt:
            now +
            tickSeconds * 1000
    };

    const hemorrhageUnlocked =
        isWarriorCapstoneSelected(
            "hemorrhage"
        );

    const maximumStacks =
        hemorrhageUnlocked
            ? Math.max(
                1,
                getUnlockedSkillEffectValue(
                    "hemorrhage",
                    "maximumBleedStacks"
                )
            )
            : 1;

    if (!hemorrhageUnlocked) {
        warriorCombatState.bleeds = [
            newBleed
        ];

        return true;
    }

    warriorCombatState.bleeds
        .forEach(bleed => {
            bleed.ticksRemaining =
                tickCount;

            bleed.nextTickAt =
                now +
                bleed
                    .tickMilliseconds;
        });

    if (
        warriorCombatState
            .bleeds.length <
        maximumStacks
    ) {
        warriorCombatState
            .bleeds.push(
                newBleed
            );
    } else {
        let weakestIndex = 0;

        warriorCombatState.bleeds
            .forEach(
                (
                    bleed,
                    index
                ) => {
                    if (
                        bleed.damagePerTick <
                        warriorCombatState
                            .bleeds[
                            weakestIndex
                        ]
                            .damagePerTick
                    ) {
                        weakestIndex =
                            index;
                    }
                }
            );

        warriorCombatState.bleeds[
            weakestIndex
        ] = newBleed;
    }

    return true;
}

function collectWarriorBleedDamage() {
    if (
        warriorCombatState
            .bleeds.length === 0
    ) {
        return 0;
    }

    const now = Date.now();
    let totalDamage = 0;

    warriorCombatState.bleeds
        .forEach(bleed => {
            while (
                bleed.ticksRemaining > 0 &&
                now >=
                bleed.nextTickAt
            ) {
                totalDamage +=
                    bleed.damagePerTick;

                bleed.ticksRemaining--;

                bleed.nextTickAt +=
                    bleed
                        .tickMilliseconds;
            }
        });

    warriorCombatState.bleeds =
        warriorCombatState.bleeds
            .filter(bleed => {
                return (
                    bleed.ticksRemaining >
                    0
                );
            });

    return Math.max(
        0,
        Math.floor(totalDamage)
    );
}

function getWarriorReceivedDamageReduction() {
    if (
        player.classId !== "warrior"
    ) {
        return 0;
    }

    return Math.min(
        50,
        getSkillEffectValue(
            "receivedDamageReductionPercentPerLevel"
        )
    );
}

function getWarriorSecondWindHealingPercent() {
    return getUnlockedSkillEffectValue(
        "second_wind",
        "secondWindHealingPercent"
    );
}

function tryTriggerWarriorSecondWind() {
    if (
        player.classId !== "warrior" ||
        warriorCombatState
            .secondWindUsed ||
        !isWarriorCapstoneSelected(
            "second_wind"
        )
    ) {
        return 0;
    }

    const derived =
        getDerivedStats();

    if (derived.maxHp <= 0) {
        return 0;
    }

    const triggerPercent =
        getUnlockedSkillEffectValue(
            "second_wind",
            "secondWindTriggerHpPercent"
        );

    const currentHpPercent =
        (
            Number(player.hp) /
            derived.maxHp
        ) *
        100;

    if (
        currentHpPercent >
        triggerPercent
    ) {
        return 0;
    }

    warriorCombatState
        .secondWindUsed = true;

    const healing = Math.max(
        1,
        Math.floor(
            derived.maxHp *
            getWarriorSecondWindHealingPercent() /
            100
        )
    );

    const previousHp =
        Number(player.hp) || 0;

    player.hp = Math.min(
        derived.maxHp,
        previousHp +
        healing
    );

    return Math.max(
        0,
        player.hp -
        previousHp
    );
}

/*
 * Wybór czarów.
 */
function selectSpell(skillId) {
    const spell = skills[skillId];

    if (!spell || spell.type !== "active") {
        showSkillError(
            "Ta umiejętność nie jest czarem aktywnym."
        );
        return;
    }

    if (
        spell.spellType !== "offensive" &&
        spell.spellType !== "defensive"
    ) {
        showSkillError(
            "Nieznany typ czaru."
        );
        return;
    }

    if (getSkillLevel(skillId) <= 0) {
        showSkillError(
            "Najpierw odblokuj ten czar."
        );
        return;
    }

    const combatIsActive =
        player.isFighting === true ||
        (
            typeof isFighting !==
            "undefined" &&
            isFighting === true
        );

    if (combatIsActive) {
        showSkillError(
            "Czary można zmieniać tylko poza walką."
        );
        return;
    }

    if (!player.selectedSpells) {
        player.selectedSpells = {
            offensive: null,
            defensive: null
        };
    }

    const currentlySelected =
        player.selectedSpells[spell.spellType];

    if (currentlySelected === skillId) {
        player.selectedSpells[spell.spellType] = null;

        if (typeof showNotification === "function") {
            showNotification(
                `Usunięto czar: ${spell.name}.`,
                "success"
            );
        }

        if (typeof addSystemLog === "function") {
            addSystemLog(
                "🔮 Usunięto wybrany czar: " +
                spell.name +
                ".",
                "spell"
            );
        }
    } else {
        player.selectedSpells[spell.spellType] = skillId;

        if (typeof showNotification === "function") {
            showNotification(
                `Wybrano czar: ${spell.name}.`,
                "success"
            );
        }

        if (typeof addSystemLog === "function") {
            const spellTypeName =
                spell.spellType === "offensive"
                    ? "ofensywny"
                    : "defensywny";

            addSystemLog(
                "🔮 Wybrano czar " +
                spellTypeName +
                ": " +
                spell.name +
                ".",
                "spell"
            );
        }
    }
    saveGame();
    render();

    if (
        typeof refreshSkillsView ===
        "function"
    ) {
        refreshSkillsView();
    }
}

function getSelectedSpell(spellType) {
    if (!player.selectedSpells) {
        return null;
    }

    const spellId =
        player.selectedSpells[spellType];

    if (!spellId) {
        return null;
    }

    const spell = skills[spellId];

    if (!spell) {
        return null;
    }

    if (getSkillLevel(spellId) <= 0) {
        return null;
    }

    return spell;
}

function getSpellManaCost(
    spell
) {
    if (!spell || !spell.effect) {
        return 0;
    }

    const level = getSkillLevel(spell.id);

    const baseManaCost =
        spell.effect.baseManaCost || 0;

    const reductionPerLevel =
        spell.effect.manaCostReductionPerLevel ||
        0;

    const costAfterLevelReduction =
        Math.max(
            0,
            baseManaCost -
            reductionPerLevel *
            Math.max(
                0,
                level - 1
            )
        );

    const generalPercentageReduction =
        Math.max(
            0,
            getSkillEffectValue(
                "spellManaCostReductionPercentPerLevel"
            )
        );

    const wandCapstoneReduction =
        typeof getWandCapstoneManaCostReduction ===
            "function"
            ? getWandCapstoneManaCostReduction()
            : 0;

    const percentageReduction =
        Math.min(
            80,
            generalPercentageReduction +
            wandCapstoneReduction
        );

    return Math.max(
        0,
        Math.floor(
            costAfterLevelReduction *
            (
                1 -
                percentageReduction /
                100
            )
        )
    );
}

function getSpellCooldownMilliseconds(
    spell
) {
    if (!spell || !spell.effect) {
        return 0;
    }

    const level = getSkillLevel(spell.id);

    const baseCooldown =
        spell.effect.baseCooldownSeconds || 0;

    const reductionPerLevel =
        spell.effect
            .cooldownReductionSecondsPerLevel ||
        0;

    const cooldownSeconds =
        Math.max(
            1,
            baseCooldown -
            reductionPerLevel *
            Math.max(
                0,
                level - 1
            )
        );

    const wandCooldownReduction =
        typeof getWandSpellCooldownReductionSkillBonus ===
            "function"
            ? getWandSpellCooldownReductionSkillBonus()
            : 0;

    const wandCapstoneCooldownReduction =
        typeof getWandCapstoneCooldownReduction ===
            "function"
            ? getWandCapstoneCooldownReduction()
            : 0;

    const totalWandCooldownReduction =
        Math.max(
            0,
            Math.min(
                50,
                wandCooldownReduction +
                wandCapstoneCooldownReduction
            )
        );

    const finalCooldownSeconds =
        Math.max(
            1,
            cooldownSeconds *
            (
                1 -
                totalWandCooldownReduction /
                100
            )
        );

    return (
        finalCooldownSeconds *
        1000
    );
}

function getSpellCooldownRemaining(spellId) {
    if (!player.spellCooldowns) {
        player.spellCooldowns = {};
    }

    const readyAt =
        player.spellCooldowns[spellId] || 0;

    return Math.max(
        0,
        readyAt - Date.now()
    );
}

function isSpellReady(spellId) {
    return getSpellCooldownRemaining(spellId) <= 0;
}

function startSpellCooldown(spell) {
    if (!player.spellCooldowns) {
        player.spellCooldowns = {};
    }

    player.spellCooldowns[spell.id] =
        Date.now() +
        getSpellCooldownMilliseconds(spell);
}

/*
 * Automatyczny czar ofensywny.
 */
function castSelectedOffensiveSpell() {
    const spell = getSelectedSpell("offensive");

    if (!spell) {
        return false;
    }

    if (!isSpellReady(spell.id)) {
        return false;
    }

    const manaCost = getSpellManaCost(spell);

    if (player.mana < manaCost) {
        return false;
    }

    if (spell.id === "fireball") {
        return castFireball(spell, manaCost);
    }

    if (spell.id === "frost_bolt") {
        return castFrostBolt(spell, manaCost);
    }

    if (spell.id === "arcane_missiles") {
        return castArcaneMissiles(
            spell,
            manaCost
        );
    }

    if (spell.id === "ignite") {
        return castIgnite(
            spell,
            manaCost
        );
    }

    if (spell.id === "meteor") {
        return castMeteor(
            spell,
            manaCost
        );
    }

    return false;
}

function calculateMagicSpellDamage(
    multiplier
) {
    const derived =
        getDerivedStats();

    let damage =
        derived.magicDamage *
        Math.max(
            0,
            Number(multiplier) || 0
        );

    /*
     * Ten bonus dotyczy wyłącznie
     * zaklęć ofensywnych.
     */
    const offensiveSpellBonus =
        typeof getOffensiveSpellDamageSkillBonus ===
            "function"
            ? getOffensiveSpellDamageSkillBonus()
            : 0;

    damage *=
        1 +
        offensiveSpellBonus / 100;

    /*
     * Premia klasowa Maga działająca
     * przy odpowiedniej ilości many.
     */
    const manaOverflowBonus =
        getMageManaOverflowDamagePercent();

    damage *=
        1 +
        manaOverflowBonus / 100;

    /*
     * Mikstura wzmacniająca zaklęcia.
     */
    if (
        typeof applySpellDamagePotionBonus ===
        "function"
    ) {
        damage =
            applySpellDamagePotionBonus(
                damage
            );
    }

    return Math.max(
        1,
        Math.floor(damage)
    );
}

function castFireball(spell, manaCost) {
    const level = getSkillLevel(spell.id);

    const baseMultiplier =
        spell.effect.baseDamageMultiplier || 1;

    const multiplierPerLevel =
        spell.effect.damageMultiplierPerLevel ||
        0;

    const multiplier =
        baseMultiplier +
        multiplierPerLevel *
        Math.max(0, level - 1);

    const echoResult =
        applyMageOffensiveSpellEcho(
            calculateMagicSpellDamage(
                multiplier
            )
        );

    const damage =
        echoResult.damage;
    player.mana -= manaCost;
    enemy.hp -= damage;

    startSpellCooldown(spell);

    if (typeof addCombatLog === "function") {
        addCombatLog(
            "🔥 Kula ognia zadaje " +
            damage +
            " obrażeń. Mana: -" +
            manaCost +
            "."
        );
    }

    logMageOffensiveSpellEcho(
        echoResult
    );

    return true;
}

function castFrostBolt(spell, manaCost) {
    const level = getSkillLevel(spell.id);

    const baseMultiplier =
        spell.effect.baseDamageMultiplier || 1;

    const multiplierPerLevel =
        spell.effect.damageMultiplierPerLevel || 0;

    const multiplier =
        baseMultiplier +
        multiplierPerLevel * Math.max(0, level - 1);

    const echoResult =
        applyMageOffensiveSpellEcho(
            calculateMagicSpellDamage(
                multiplier
            )
        );

    const damage =
        echoResult.damage;

    const baseSlowDuration =
        spell.effect.baseSlowDurationSeconds || 0;

    const slowDurationPerLevel =
        spell.effect.slowDurationSecondsPerLevel || 0;

    const slowDuration =
        baseSlowDuration +
        slowDurationPerLevel * Math.max(0, level - 1);

    player.mana -= manaCost;
    enemy.hp -= damage;

    if (typeof applyEnemySlow === "function") {
        applyEnemySlow(
            slowDuration,
            spell.effect.enemyAttackSkipChance || 50
        );
    }

    startSpellCooldown(spell);

    if (typeof addCombatLog === "function") {
        addCombatLog(
            "❄️ Lodowy pocisk zadaje " +
            damage +
            " obrażeń i spowalnia przeciwnika na " +
            slowDuration.toFixed(1) +
            " s. Mana: -" +
            manaCost +
            "."
        );
    }

    logMageOffensiveSpellEcho(
        echoResult
    );

    return true;
}

function castArcaneMissiles(
    spell,
    manaCost
) {
    const level =
        getSkillLevel(spell.id);

    const projectileCount =
        Math.max(
            1,
            Math.floor(
                Number(
                    spell.effect
                        .projectileCount
                ) || 1
            )
        );

    const multiplierPerProjectile =
        (
            Number(
                spell.effect
                    .baseDamageMultiplierPerProjectile
            ) || 0
        ) +
        (
            Number(
                spell.effect
                    .damageMultiplierPerProjectilePerLevel
            ) || 0
        ) *
        Math.max(
            0,
            level - 1
        );

    const damagePerProjectile =
        calculateMagicSpellDamage(
            multiplierPerProjectile
        );

    const echoResult =
        applyMageOffensiveSpellEcho(
            damagePerProjectile *
            projectileCount
        );

    const totalDamage =
        echoResult.damage;

    player.mana -= manaCost;
    enemy.hp -= totalDamage;

    startSpellCooldown(spell);

    if (
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(
            "🔮 Magiczne pociski trafiają " +
            projectileCount +
            " razy i zadają łącznie " +
            totalDamage +
            " obrażeń. Mana: -" +
            manaCost +
            "."
        );
    }

    logMageOffensiveSpellEcho(
        echoResult
    );

    return true;
}

function castIgnite(
    spell,
    manaCost
) {
    const level =
        getSkillLevel(spell.id);

    const initialMultiplier =
        (
            Number(
                spell.effect
                    .baseDamageMultiplier
            ) || 0
        ) +
        (
            Number(
                spell.effect
                    .damageMultiplierPerLevel
            ) || 0
        ) *
        Math.max(
            0,
            level - 1
        );

    const tickMultiplier =
        (
            Number(
                spell.effect
                    .baseTickDamageMultiplier
            ) || 0
        ) +
        (
            Number(
                spell.effect
                    .tickDamageMultiplierPerLevel
            ) || 0
        ) *
        Math.max(
            0,
            level - 1
        );

    const durationSeconds =
        Math.max(
            0,
            Number(
                spell.effect
                    .durationSeconds
            ) || 0
        );

    const tickSeconds =
        Math.max(
            0.1,
            Number(
                spell.effect
                    .tickSeconds
            ) || 1
        );

    const echoResult =
        applyMageOffensiveSpellEcho(
            calculateMagicSpellDamage(
                initialMultiplier
            )
        );

    const initialDamage =
        echoResult.damage;

    const tickDamage =
        calculateMagicSpellDamage(
            tickMultiplier
        );

    const tickCount =
        Math.max(
            1,
            Math.floor(
                durationSeconds /
                tickSeconds
            )
        );

    player.mana -= manaCost;
    enemy.hp -= initialDamage;

    spellCombatState.ignite = {
        damagePerTick:
            tickDamage,

        ticksRemaining:
            tickCount,

        tickMilliseconds:
            tickSeconds * 1000,

        nextTickAt:
            Date.now() +
            tickSeconds * 1000
    };

    startSpellCooldown(spell);

    if (
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(
            "🔥 Podpalenie zadaje " +
            initialDamage +
            " obrażeń i podpala przeciwnika na " +
            durationSeconds +
            " s. Mana: -" +
            manaCost +
            "."
        );
    }

    logMageOffensiveSpellEcho(
        echoResult
    );

    return true;
}

function clearIgnite() {
    spellCombatState.ignite =
        null;
}

function collectIgniteDamage() {
    const ignite =
        spellCombatState.ignite;

    if (!ignite) {
        return 0;
    }

    const now = Date.now();
    let damage = 0;

    while (
        ignite.ticksRemaining > 0 &&
        now >= ignite.nextTickAt
    ) {
        damage +=
            ignite.damagePerTick;

        ignite.ticksRemaining--;

        ignite.nextTickAt +=
            ignite.tickMilliseconds;
    }

    if (
        ignite.ticksRemaining <= 0
    ) {
        clearIgnite();
    }

    return Math.max(
        0,
        Math.floor(damage)
    );
}

function castMeteor(
    spell,
    manaCost
) {
    const level =
        getSkillLevel(spell.id);

    const multiplier =
        (
            Number(
                spell.effect
                    .baseDamageMultiplier
            ) || 1
        ) +
        (
            Number(
                spell.effect
                    .damageMultiplierPerLevel
            ) || 0
        ) *
        Math.max(
            0,
            level - 1
        );

    const echoResult =
        applyMageOffensiveSpellEcho(
            calculateMagicSpellDamage(
                multiplier
            )
        );

    const damage =
        echoResult.damage;

    player.mana -= manaCost;
    enemy.hp -= damage;

    startSpellCooldown(spell);

    if (
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(
            "☄️ Meteor uderza za " +
            damage +
            " obrażeń. Mana: -" +
            manaCost +
            "."
        );
    }

    logMageOffensiveSpellEcho(
        echoResult
    );

    return true;
}

/*
 * Automatyczny czar defensywny.
 */
function castSelectedDefensiveSpell() {
    const spell = getSelectedSpell("defensive");

    if (!spell) {
        return false;
    }

    if (!isSpellReady(spell.id)) {
        return false;
    }

    const manaCost = getSpellManaCost(spell);

    if (player.mana < manaCost) {
        return false;
    }

    if (spell.id === "arcane_barrier") {
        return castArcaneBarrier(
            spell,
            manaCost
        );
    }

    if (spell.id === "healing") {
        return castHealing(
            spell,
            manaCost
        );
    }

    if (spell.id === "mana_shield") {
        return castManaShield(
            spell,
            manaCost
        );
    }

    if (spell.id === "regeneration") {
        return castRegeneration(
            spell,
            manaCost
        );
    }

    if (spell.id === "mirror_image") {
        return castMirrorImage(
            spell,
            manaCost
        );
    }

    return false;
}

function castArcaneBarrier(spell, manaCost) {
    if (!player.activeEffects) {
        player.activeEffects = {};
    }

    const currentBarrierUntil =
        player.activeEffects
            .arcaneBarrierUntil || 0;

    if (currentBarrierUntil > Date.now()) {
        return false;
    }

    const durationSeconds =
        spell.effect.durationSeconds || 0;

    player.mana -= manaCost;

    player.activeEffects.arcaneBarrierUntil =
        Date.now() +
        durationSeconds * 1000;

    startSpellCooldown(spell);

    if (typeof addCombatLog === "function") {
        addCombatLog(
            "🛡️ Aktywowano Magiczną barierę na " +
            durationSeconds +
            " sekund. Mana: -" +
            manaCost +
            "."
        );
    }

    return true;
}

function castHealing(spell, manaCost) {
    const derived = getDerivedStats();
    const level = getSkillLevel(spell.id);

    const triggerHpPercent =
        spell.effect.triggerHpPercent || 50;

    const currentHpPercent =
        derived.maxHp > 0
            ? (player.hp / derived.maxHp) * 100
            : 100;

    if (currentHpPercent > triggerHpPercent) {
        return false;
    }

    if (player.hp >= derived.maxHp) {
        return false;
    }

    const baseHealingPercent =
        spell.effect.baseHealingPercent || 0;

    const healingPercentPerLevel =
        spell.effect.healingPercentPerLevel || 0;

    const healingPercent =
        baseHealingPercent +
        healingPercentPerLevel * Math.max(0, level - 1);

    const healingAmount = Math.max(
        1,
        Math.floor(
            derived.maxHp *
            healingPercent /
            100 *
            (
                1 +
                getMageDefensiveSpellPowerPercent() /
                100
            )
        )
    );

    const hpBeforeHealing = player.hp;

    player.hp = Math.min(
        derived.maxHp,
        player.hp + healingAmount
    );

    const actualHealing =
        player.hp - hpBeforeHealing;

    if (actualHealing <= 0) {
        return false;
    }

    player.mana -= manaCost;

    startSpellCooldown(spell);

    if (typeof addCombatLog === "function") {
        addCombatLog(
            "✨ Uzdrowienie przywraca " +
            actualHealing +
            " HP. Mana: -" +
            manaCost +
            "."
        );
    }

    return true;
}

function getCurrentHpPercent() {
    const derived =
        getDerivedStats();

    if (derived.maxHp <= 0) {
        return 100;
    }

    return (
        Math.max(
            0,
            Number(player.hp) || 0
        ) /
        derived.maxHp
    ) *
        100;
}

function castManaShield(
    spell,
    manaCost
) {
    if (!player.activeEffects) {
        player.activeEffects = {};
    }

    if (isManaShieldActive()) {
        return false;
    }

    const triggerHpPercent =
        Number(
            spell.effect
                .triggerHpPercent
        ) || 70;

    if (
        getCurrentHpPercent() >
        triggerHpPercent
    ) {
        return false;
    }

    const durationSeconds =
        Math.max(
            0,
            Number(
                spell.effect
                    .durationSeconds
            ) || 0
        );

    player.mana -= manaCost;

    player.activeEffects
        .manaShieldUntil =
        Date.now() +
        durationSeconds * 1000;

    startSpellCooldown(spell);

    if (
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(
            "🔷 Tarcza many aktywna przez " +
            durationSeconds +
            " s. Mana: -" +
            manaCost +
            "."
        );
    }

    return true;
}

function isManaShieldActive() {
    return (
        (
            player.activeEffects
                ?.manaShieldUntil ||
            0
        ) >
        Date.now() &&
        (
            Number(player.mana) ||
            0
        ) >
        0
    );
}

function getManaShieldRedirectPercent() {
    if (!isManaShieldActive()) {
        return 0;
    }

    const spell =
        skills.mana_shield;

    if (!spell) {
        return 0;
    }

    const level =
        getSkillLevel(
            "mana_shield"
        );

    return Math.max(
        0,
        Math.min(
            90,
            (
                (
                    Number(
                        spell.effect
                            .baseRedirectDamagePercent
                    ) || 0
                ) +
                (
                    Number(
                        spell.effect
                            .redirectDamagePercentPerLevel
                    ) || 0
                ) *
                Math.max(
                    0,
                    level - 1
                )
            ) *
            (
                1 +
                getMageDefensiveSpellPowerPercent() /
                100
            )
        )
    );
}

function applyManaShieldToDamage(
    damage
) {
    const safeDamage =
        Math.max(
            0,
            Math.floor(
                Number(damage) || 0
            )
        );

    const defaultResult = {
        damage:
            safeDamage,
        absorbed:
            0,
        manaSpent:
            0
    };

    if (
        safeDamage <= 0 ||
        !isManaShieldActive()
    ) {
        return defaultResult;
    }

    const spell =
        skills.mana_shield;

    const manaPerDamage =
        Math.max(
            0.01,
            Number(
                spell?.effect
                    ?.manaPerAbsorbedDamage
            ) || 0.5
        );

    const targetAbsorption =
        Math.max(
            0,
            Math.floor(
                safeDamage *
                getManaShieldRedirectPercent() /
                100
            )
        );

    const maximumAbsorption =
        Math.max(
            0,
            Math.floor(
                (
                    Number(player.mana) ||
                    0
                ) /
                manaPerDamage
            )
        );

    const absorbed =
        Math.min(
            targetAbsorption,
            maximumAbsorption
        );

    if (absorbed <= 0) {
        return defaultResult;
    }

    const manaSpent =
        Math.min(
            Number(player.mana) || 0,
            Math.ceil(
                absorbed *
                manaPerDamage
            )
        );

    player.mana = Math.max(
        0,
        (
            Number(player.mana) ||
            0
        ) -
        manaSpent
    );

    if (player.mana <= 0) {
        player.activeEffects
            .manaShieldUntil = 0;
    }

    return {
        damage:
            Math.max(
                1,
                safeDamage -
                absorbed
            ),

        absorbed:
            absorbed,

        manaSpent:
            manaSpent
    };
}

function castRegeneration(
    spell,
    manaCost
) {
    if (!player.activeEffects) {
        player.activeEffects = {};
    }

    const now = Date.now();

    if (
        (
            player.activeEffects
                .regenerationUntil ||
            0
        ) >
        now
    ) {
        return false;
    }

    const triggerHpPercent =
        Number(
            spell.effect
                .triggerHpPercent
        ) || 70;

    if (
        getCurrentHpPercent() >
        triggerHpPercent
    ) {
        return false;
    }

    const derived =
        getDerivedStats();

    if (player.hp >= derived.maxHp) {
        return false;
    }

    const level =
        getSkillLevel(spell.id);

    const durationSeconds =
        Math.max(
            0.1,
            Number(
                spell.effect
                    .durationSeconds
            ) || 1
        );

    const tickSeconds =
        Math.max(
            0.1,
            Number(
                spell.effect
                    .tickSeconds
            ) || 1
        );

    const tickCount =
        Math.max(
            1,
            Math.floor(
                durationSeconds /
                tickSeconds
            )
        );

    const totalHealingPercent =
        (
            Number(
                spell.effect
                    .baseTotalHealingPercent
            ) || 0
        ) +
        (
            Number(
                spell.effect
                    .totalHealingPercentPerLevel
            ) || 0
        ) *
        Math.max(
            0,
            level - 1
        );

    const totalHealing =
        Math.max(
            1,
            Math.floor(
                derived.maxHp *
                totalHealingPercent /
                100 *
                (
                    1 +
                    getMageDefensiveSpellPowerPercent() /
                    100
                )
            )
        );

    player.mana -= manaCost;

    player.activeEffects
        .regenerationUntil =
        now +
        durationSeconds * 1000;

    player.activeEffects
        .regenerationNextTickAt =
        now +
        tickSeconds * 1000;

    player.activeEffects
        .regenerationTickMilliseconds =
        tickSeconds * 1000;

    player.activeEffects
        .regenerationHealingPerTick =
        Math.max(
            1,
            Math.ceil(
                totalHealing /
                tickCount
            )
        );

    startSpellCooldown(spell);

    if (
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(
            "🌿 Regeneracja przywróci około " +
            totalHealing +
            " HP przez " +
            durationSeconds +
            " s. Mana: -" +
            manaCost +
            "."
        );
    }

    return true;
}

function collectRegenerationHealing() {
    const activeEffects =
        player.activeEffects;

    if (!activeEffects) {
        return 0;
    }

    const until =
        Number(
            activeEffects
                .regenerationUntil
        ) || 0;

    const tickMilliseconds =
        Math.max(
            100,
            Number(
                activeEffects
                    .regenerationTickMilliseconds
            ) || 1000
        );

    let nextTickAt =
        Number(
            activeEffects
                .regenerationNextTickAt
        ) || 0;

    const healingPerTick =
        Math.max(
            0,
            Number(
                activeEffects
                    .regenerationHealingPerTick
            ) || 0
        );

    if (
        until <= 0 ||
        nextTickAt <= 0 ||
        healingPerTick <= 0
    ) {
        return 0;
    }

    const now = Date.now();
    let healing = 0;

    while (
        nextTickAt <= until &&
        now >= nextTickAt
    ) {
        healing +=
            healingPerTick;

        nextTickAt +=
            tickMilliseconds;
    }

    activeEffects
        .regenerationNextTickAt =
        nextTickAt;

    if (
        now >= until ||
        nextTickAt > until
    ) {
        activeEffects
            .regenerationUntil = 0;
    }

    if (healing <= 0) {
        return 0;
    }

    const derived =
        getDerivedStats();

    const previousHp =
        Math.max(
            0,
            Number(player.hp) || 0
        );

    player.hp = Math.min(
        derived.maxHp,
        previousHp +
        healing
    );

    return Math.max(
        0,
        player.hp -
        previousHp
    );
}

function castMirrorImage(
    spell,
    manaCost
) {
    if (!player.activeEffects) {
        player.activeEffects = {};
    }

    if (isMirrorImageActive()) {
        return false;
    }

    const triggerHpPercent =
        Number(
            spell.effect
                .triggerHpPercent
        ) || 45;

    if (
        getCurrentHpPercent() >
        triggerHpPercent
    ) {
        return false;
    }

    const level =
        getSkillLevel(spell.id);

    const additionalChargeAtLevel =
        Math.max(
            1,
            Math.floor(
                Number(
                    spell.effect
                        .additionalDodgeChargeAtLevel
                ) || 4
            )
        );

    const charges =
        Math.max(
            1,
            Math.floor(
                Number(
                    spell.effect
                        .baseDodgeCharges
                ) || 1
            )
        ) +
        (
            level >=
                additionalChargeAtLevel
                ? 1
                : 0
        );

    const durationSeconds =
        Math.max(
            0,
            Number(
                spell.effect
                    .durationSeconds
            ) || 0
        ) *
        (
            1 +
            getMageDefensiveSpellPowerPercent() /
            100
        );

    player.mana -= manaCost;

    player.activeEffects
        .mirrorImageUntil =
        Date.now() +
        durationSeconds * 1000;

    player.activeEffects
        .mirrorImageCharges =
        charges;

    startSpellCooldown(spell);

    if (
        typeof addCombatLog ===
        "function"
    ) {
        addCombatLog(
            "🪞 Lustrzane odbicie tworzy " +
            charges +
            (
                charges === 1
                    ? " ochronne odbicie"
                    : " ochronne odbicia"
            ) +
            ". Mana: -" +
            manaCost +
            "."
        );
    }

    return true;
}

function isMirrorImageActive() {
    return (
        (
            player.activeEffects
                ?.mirrorImageUntil ||
            0
        ) >
        Date.now() &&
        (
            Number(
                player.activeEffects
                    ?.mirrorImageCharges
            ) || 0
        ) >
        0
    );
}

function consumeMirrorImageCharge() {
    if (!isMirrorImageActive()) {
        return false;
    }

    player.activeEffects
        .mirrorImageCharges =
        Math.max(
            0,
            (
                Number(
                    player.activeEffects
                        .mirrorImageCharges
                ) || 0
            ) -
            1
        );

    if (
        player.activeEffects
            .mirrorImageCharges <= 0
    ) {
        player.activeEffects
            .mirrorImageUntil = 0;
    }

    return true;
}

function resetSpellCombatState() {
    clearIgnite();
}

function isArcaneBarrierActive() {
    if (!player.activeEffects) {
        return false;
    }

    return (
        (player.activeEffects
            .arcaneBarrierUntil || 0) >
        Date.now()
    );
}

function getArcaneBarrierDamageReduction() {
    if (!isArcaneBarrierActive()) {
        return 0;
    }

    const spell = skills.arcane_barrier;

    if (!spell) {
        return 0;
    }

    const level =
        getSkillLevel("arcane_barrier");

    const baseReduction =
        spell.effect
            .baseDamageReductionPercent || 0;

    const reductionPerLevel =
        spell.effect
            .damageReductionPercentPerLevel ||
        0;

    return Math.min(
        80,
        (
            baseReduction +
            reductionPerLevel *
            Math.max(
                0,
                level - 1
            )
        ) *
        (
            1 +
            getMageDefensiveSpellPowerPercent() /
            100
        )
    );
}

startManaRegeneration();
