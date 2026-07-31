let currentSkillTree = "magic";
let currentMagicCategory =
    "offensive_spells";

const magicCategoryDefinitions = [
    {
        id: "general",
        icon: "🔮",
        name: "Arkana",
        description:
            "Wiedza tajemna i ogólne podstawy magii."
    },
    {
        id: "offensive_spells",
        icon: "🔥",
        name: "Ofensywne",
        description:
            "Czary zadające obrażenia i osłabiające przeciwnika."
    },
    {
        id: "defensive_spells",
        icon: "🛡️",
        name: "Defensywne",
        description:
            "Leczenie, bariery i sposoby unikania obrażeń."
    }
];

function setCurrentMagicCategory(
    categoryId
) {
    const categoryExists =
        magicCategoryDefinitions
            .some(category => {
                return (
                    category.id ===
                    categoryId
                );
            });

    if (!categoryExists) {
        return;
    }

    currentMagicCategory =
        categoryId;

    renderSkills();
}

function renderMagicCategoryTabs(
    container
) {
    if (!container) {
        return;
    }

    container.innerHTML = "";

    const isMagicTree =
        currentSkillTree ===
        "magic";

    container.hidden =
        !isMagicTree;

    if (!isMagicTree) {
        return;
    }

    if (
        !magicCategoryDefinitions
            .some(category => {
                return (
                    category.id ===
                    currentMagicCategory
                );
            })
    ) {
        currentMagicCategory =
            "offensive_spells";
    }

    magicCategoryDefinitions
        .forEach(category => {
            const button =
                document.createElement(
                    "button"
                );

            const skillCount =
                Object.values(skills)
                    .filter(skill => {
                        return (
                            skill.tree ===
                                "magic" &&
                            skill.branch ===
                                category.id
                        );
                    })
                    .length;

            button.type = "button";

            button.textContent =
                category.icon +
                " " +
                category.name +
                " (" +
                skillCount +
                ")";

            button.title =
                category.description;

            button.dataset.category =
                category.id;

            if (
                category.id ===
                currentMagicCategory
            ) {
                button.classList.add(
                    "active"
                );
            }

            button.onclick = () => {
                setCurrentMagicCategory(
                    category.id
                );
            };

            container.appendChild(
                button
            );
        });
}

function getAvailableSkillTrees() {
    return skillTrees.filter(tree => {
        return (
            !tree.requiredClass ||
            tree.requiredClass ===
            player.classId
        );
    });
}

function refreshSkillsView() {
    const skillsPanel =
        document.querySelector(
            '[data-hero-panel="skills"]'
        );

    if (
        !skillsPanel ||
        !skillsPanel.classList.contains(
            "active"
        )
    ) {
        return;
    }

    renderSkills();
}

function setCurrentSkillTree(treeId) {
    const treeIsAvailable =
        getAvailableSkillTrees()
            .some(tree => {
                return tree.id === treeId;
            });

    if (!treeIsAvailable) {
        return;
    }

    currentSkillTree = treeId;
    renderSkills();
}

function getSkillTypeName(type) {
    const typeNames = {
        active: "Aktywna",
        passive: "Pasywna",
        reactive: "Reaktywna"
    };

    return typeNames[type] || type;
}

function getSkillBranchName(branch) {
    const branchNames = {
        general: "Ogólne",
        loot: "Łupy",
        melee: "Broń biała",
        blacksmithing: "Kowalstwo",
        selling: "Sprzedaż",
        offensive_spells: "Ofensywa",
        defensive_spells: "Obrona",
        warrior_core: "Droga Żelaza",
        warrior_fury: "Furia",
        warrior_bleeding: "Krwawienie",
        warrior_defense: "Wytrzymałość",
        hunter_core: "Droga Łowów",
        hunter_precision: "Precyzja",
        hunter_volley: "Grad strzał",
        hunter_survival: "Przetrwanie",
        mage_core: "Droga Arkanów",
        mage_destruction: "Zniszczenie",
        mage_arcana: "Arkana",
        mage_protection: "Ochrona",
        guardian_core: "Droga Bastionu",
        guardian_bastion: "Bastion",
        guardian_retribution: "Odwet",
        guardian_resolve: "Niezłomność",
        rogue_core: "Droga Cienia",
        rogue_assassination: "Zabójstwo",
        rogue_agility: "Zwinność",
        rogue_poison: "Trucizny"
    };

    return (
        branchNames[branch] ||
        branch ||
        "Ogólne"
    );
}

function getSpellTypeName(spellType) {
    const spellTypeNames = {
        offensive: "Ofensywny",
        defensive: "Defensywny"
    };

    return spellTypeNames[spellType] || spellType;
}

function getSkillRequirementText(skill) {
    const requirements = [];

    if (skill.requiredClass) {
        const requiredClass =
            typeof characterClasses !==
                "undefined"
                ? characterClasses[
                    skill.requiredClass
                ]
                : null;

        requirements.push(
            "Klasa: " +
            (
                requiredClass?.name ||
                skill.requiredClass
            )
        );
    }

    if (skill.prerequisite) {
        const requiredSkill =
            skills[
                skill.prerequisite
                    .skillId
            ];

        if (requiredSkill) {
            requirements.push(
                "Wymaga: " +
                requiredSkill.name +
                " " +
                skill.prerequisite
                    .requiredSkillLevel +
                " poziom"
            );
        }
    }

    return requirements.join(" · ");
}

function updateSkillsResetButton() {
    const button =
        document.getElementById(
            "skills-reset-button"
        );

    if (!button) {
        return;
    }

    const spentPoints =
        typeof getSpentSkillPoints ===
            "function"
            ? getSpentSkillPoints()
            : 0;

    const resetCost =
        typeof getSkillResetCost ===
            "function"
            ? getSkillResetCost()
            : 0;

    button.textContent =
        resetCost > 0
            ? "Resetuj (" +
                resetCost +
                " złota)"
            : "Pierwszy reset za darmo";

    button.disabled =
        spentPoints <= 0;
}

function getSpellDetailsHtml(skill) {
    if (
        skill.type !== "active" ||
        !skill.spellType
    ) {
        return "";
    }

    const skillLevel =
        getSkillLevel(skill.id);

    const manaCost =
        skillLevel > 0
            ? getSpellManaCost(skill)
            : skill.effect.baseManaCost;

    const cooldownMilliseconds =
        skillLevel > 0
            ? getSpellCooldownMilliseconds(
                skill
            )
            : skill.effect
                .baseCooldownSeconds * 1000;

    const cooldownSeconds =
        cooldownMilliseconds / 1000;

    let effectText = "";

    if (skill.id === "fireball") {
        const levelForPreview =
            Math.max(1, skillLevel);

        const multiplier =
            skill.effect
                .baseDamageMultiplier +
            skill.effect
                .damageMultiplierPerLevel *
            (levelForPreview - 1);

        effectText =
            `Mnożnik obrażeń: ${multiplier.toFixed(2)}×`;
    }

    if (skill.id === "arcane_barrier") {
        const levelForPreview =
            Math.max(1, skillLevel);

        const reduction =
            skill.effect
                .baseDamageReductionPercent +
            skill.effect
                .damageReductionPercentPerLevel *
            (levelForPreview - 1);

        effectText =
            `Redukcja obrażeń: ${reduction}% przez ` +
            `${skill.effect.durationSeconds} s`;
    }

    if (skill.id === "frost_bolt") {
        const levelForPreview =
            Math.max(1, skillLevel);

        const multiplier =
            skill.effect.baseDamageMultiplier +
            skill.effect.damageMultiplierPerLevel *
            (levelForPreview - 1);

        const slowDuration =
            skill.effect.baseSlowDurationSeconds +
            skill.effect.slowDurationSecondsPerLevel *
            (levelForPreview - 1);

        effectText =
            `Obrażenia: ${multiplier.toFixed(2)}× magii, ` +
            `spowolnienie: ${slowDuration.toFixed(1)} s`;
    }

    if (skill.id === "healing") {
        const levelForPreview =
            Math.max(1, skillLevel);

        const healingPercent =
            skill.effect.baseHealingPercent +
            skill.effect.healingPercentPerLevel *
            (levelForPreview - 1);

        effectText =
            `Leczy ${healingPercent}% maksymalnego HP ` +
            `poniżej ${skill.effect.triggerHpPercent}% HP`;
    }

    if (
        skill.id ===
        "arcane_missiles"
    ) {
        const levelForPreview =
            Math.max(
                1,
                skillLevel
            );

        const projectileMultiplier =
            skill.effect
                .baseDamageMultiplierPerProjectile +
            skill.effect
                .damageMultiplierPerProjectilePerLevel *
            (
                levelForPreview -
                1
            );

        effectText =
            `${skill.effect.projectileCount} pociski po ` +
            `${projectileMultiplier.toFixed(2)}× magii`;
    }

    if (skill.id === "ignite") {
        const levelForPreview =
            Math.max(
                1,
                skillLevel
            );

        const initialMultiplier =
            skill.effect
                .baseDamageMultiplier +
            skill.effect
                .damageMultiplierPerLevel *
            (
                levelForPreview -
                1
            );

        const tickMultiplier =
            skill.effect
                .baseTickDamageMultiplier +
            skill.effect
                .tickDamageMultiplierPerLevel *
            (
                levelForPreview -
                1
            );

        effectText =
            `Początkowo ${initialMultiplier.toFixed(2)}× magii, ` +
            `potem ${tickMultiplier.toFixed(2)}× co sekundę ` +
            `przez ${skill.effect.durationSeconds} s`;
    }

    if (skill.id === "meteor") {
        const levelForPreview =
            Math.max(
                1,
                skillLevel
            );

        const multiplier =
            skill.effect
                .baseDamageMultiplier +
            skill.effect
                .damageMultiplierPerLevel *
            (
                levelForPreview -
                1
            );

        effectText =
            `Obrażenia: ${multiplier.toFixed(2)}× magii`;
    }

    if (skill.id === "mana_shield") {
        const levelForPreview =
            Math.max(
                1,
                skillLevel
            );

        const redirectPercent =
            skill.effect
                .baseRedirectDamagePercent +
            skill.effect
                .redirectDamagePercentPerLevel *
            (
                levelForPreview -
                1
            );

        effectText =
            `Przekierowuje ${redirectPercent}% obrażeń na manę ` +
            `przez ${skill.effect.durationSeconds} s poniżej ` +
            `${skill.effect.triggerHpPercent}% HP`;
    }

    if (skill.id === "regeneration") {
        const levelForPreview =
            Math.max(
                1,
                skillLevel
            );

        const healingPercent =
            skill.effect
                .baseTotalHealingPercent +
            skill.effect
                .totalHealingPercentPerLevel *
            (
                levelForPreview -
                1
            );

        effectText =
            `Leczy łącznie ${healingPercent}% maksymalnego HP ` +
            `przez ${skill.effect.durationSeconds} s poniżej ` +
            `${skill.effect.triggerHpPercent}% HP`;
    }

    if (skill.id === "mirror_image") {
        const levelForPreview =
            Math.max(
                1,
                skillLevel
            );

        const charges =
            (
                skill.effect
                    .baseDodgeCharges ||
                1
            ) +
            (
                levelForPreview >=
                    skill.effect
                        .additionalDodgeChargeAtLevel
                    ? 1
                    : 0
            );

        effectText =
            `${charges} gwarantowane uniki przez ` +
            `${skill.effect.durationSeconds} s poniżej ` +
            `${skill.effect.triggerHpPercent}% HP`;
    }

    return `
        <div class="spell-details">
            <span>
                Typ czaru:
                ${getSpellTypeName(skill.spellType)}
            </span>

            <span>
                Mana: ${manaCost}
            </span>

            <span>
                Cooldown:
                ${cooldownSeconds.toFixed(1)} s
            </span>

            ${effectText
            ? `<span>${effectText}</span>`
            : ""
        }
        </div>
    `;
}

function createWarriorSkillTreeLayout(
    container,
    treeId = "warrior"
) {
    const isHunterTree =
        treeId === "hunter";

    const isMageTree =
        treeId === "mage";

    const isGuardianTree =
        treeId === "guardian";

    const isRogueTree =
        treeId === "rogue";

    let branchDefinitions;

    if (isHunterTree) {
        branchDefinitions = [
            {
                id: "hunter_precision",
                icon: "🎯",
                name: "Precyzja",
                description:
                    "Krytyczne trafienia i regularne strzały snajperskie."
            },
            {
                id: "hunter_volley",
                icon: "🏹",
                name: "Grad strzał",
                description:
                    "Szybsze ataki i dodatkowe pociski."
            },
            {
                id: "hunter_survival",
                icon: "🐾",
                name: "Przetrwanie",
                description:
                    "Uniki zamieniane w silne strzały odwetowe."
            }
        ];
    } else if (isMageTree) {
        branchDefinitions = [
            {
                id: "mage_destruction",
                icon: "💥",
                name: "Zniszczenie",
                description:
                    "Siła czarów i powtarzające się echa żywiołów."
            },
            {
                id: "mage_arcana",
                icon: "🔮",
                name: "Arkana",
                description:
                    "Więcej many, tańsze czary i premie przy pełnym zasobie."
            },
            {
                id: "mage_protection",
                icon: "🛡️",
                name: "Ochrona",
                description:
                    "Zdrowie, silniejsze zaklęcia obronne i odrodzenie."
            }
        ];
    } else if (isGuardianTree) {
        branchDefinitions = [
            {
                id: "guardian_bastion",
                icon: "🧱",
                name: "Bastion",
                description:
                    "Pancerz i redukcja obrażeń rosnąca w krytycznym momencie."
            },
            {
                id: "guardian_retribution",
                icon: "⚔️",
                name: "Odwet",
                description:
                    "Kontrataki wyprowadzane po ciosach przeciwnika."
            },
            {
                id: "guardian_resolve",
                icon: "💚",
                name: "Niezłomność",
                description:
                    "Ogromna żywotność, regeneracja i ratunek przed śmiercią."
            }
        ];
    } else if (isRogueTree) {
        branchDefinitions = [
            {
                id: "rogue_assassination",
                icon: "🎯",
                name: "Zabójstwo",
                description:
                    "Krytyczne ciosy i dobijanie osłabionych przeciwników."
            },
            {
                id: "rogue_agility",
                icon: "💨",
                name: "Zwinność",
                description:
                    "Szybkie ataki, uniki i serie dodatkowych cięć."
            },
            {
                id: "rogue_poison",
                icon: "☠️",
                name: "Trucizny",
                description:
                    "Toksyczne obrażenia w czasie i kumulowanie jadu."
            }
        ];
    } else {
        branchDefinitions = [
            {
                id: "warrior_fury",
                icon: "🔥",
                name: "Furia",
                description:
                    "Potężne ciosy, krytyki i walka na niskim HP."
            },
            {
                id: "warrior_bleeding",
                icon: "🩸",
                name: "Krwawienie",
                description:
                    "Rany zadające obrażenia w czasie i kumulacja efektów."
            },
            {
                id: "warrior_defense",
                icon: "🛡️",
                name: "Wytrzymałość",
                description:
                    "Więcej zdrowia, redukcja obrażeń i automatyczne leczenie."
            }
        ];
    }

    const targets = {};

    const layout =
        document.createElement("div");

    layout.className =
        "warrior-tree-layout";

    layout.dataset.tree =
        treeId;

    const rootSection =
        document.createElement("section");

    rootSection.className =
        "warrior-tree-root";

    const rootHeading =
        document.createElement("div");

    rootHeading.className =
        "warrior-tree-root-heading";

    const rootIcon =
        isHunterTree
            ? "🏹"
            : isMageTree
                ? "🧙"
                : isGuardianTree
                    ? "🛡️"
                    : isRogueTree
                        ? "🗡️"
                        : "⚔️";

    const rootName =
        isHunterTree
            ? "Droga Łowów"
            : isMageTree
                ? "Droga Arkanów"
                : isGuardianTree
                    ? "Droga Bastionu"
                    : isRogueTree
                        ? "Droga Cienia"
                        : "Droga Żelaza";

    rootHeading.innerHTML = `
        <span>${rootIcon}</span>
        <div>
            <small>PUNKT WYJŚCIA</small>
            <strong>${rootName}</strong>
        </div>
    `;

    const specializationStatus =
        document.createElement("div");

    const selectedCapstoneId =
        isHunterTree
            ? (
                typeof getSelectedHunterCapstone ===
                    "function"
                    ? getSelectedHunterCapstone()
                    : null
            )
            : isMageTree
                ? (
                    typeof getSelectedMageCapstone ===
                        "function"
                        ? getSelectedMageCapstone()
                        : null
                )
                : isGuardianTree
                    ? (
                        typeof getSelectedGuardianCapstone ===
                            "function"
                            ? getSelectedGuardianCapstone()
                            : null
                    )
                    : isRogueTree
                        ? (
                            typeof getSelectedRogueCapstone ===
                                "function"
                                ? getSelectedRogueCapstone()
                                : null
                        )
                        : (
                            typeof getSelectedWarriorCapstone ===
                                "function"
                                ? getSelectedWarriorCapstone()
                                : null
                        );

    const selectedCapstone =
        selectedCapstoneId
            ? skills[
                selectedCapstoneId
            ]
            : null;

    specializationStatus.className =
        "warrior-specialization-status";

    if (selectedCapstone) {
        specializationStatus
            .classList.add(
                "has-specialization"
            );
    }

    specializationStatus.innerHTML = `
        <span>Aktywna specjalizacja</span>
        <strong>
            ${selectedCapstone
                ? selectedCapstone.name
                : "Nie wybrano"}
        </strong>
        <small>
            Działa tylko jedna umiejętność końcowa.
        </small>
    `;

    const rootCards =
        document.createElement("div");

    rootCards.className =
        "warrior-tree-root-cards";

    targets[
        isHunterTree
            ? "hunter_core"
            : isMageTree
                ? "mage_core"
                : isGuardianTree
                    ? "guardian_core"
                    : isRogueTree
                        ? "rogue_core"
                        : "warrior_core"
    ] =
        rootCards;

    rootSection.appendChild(
        rootHeading
    );

    rootSection.appendChild(
        specializationStatus
    );

    rootSection.appendChild(
        rootCards
    );

    const branches =
        document.createElement("div");

    branches.className =
        "warrior-tree-branches";

    branchDefinitions.forEach(
        branch => {
            const section =
                document.createElement(
                    "section"
                );

            section.className =
                "warrior-tree-branch";

            section.dataset.branch =
                branch.id;

            const heading =
                document.createElement(
                    "div"
                );

            heading.className =
                "warrior-tree-branch-heading";

            heading.innerHTML = `
                <span class="warrior-tree-branch-icon">
                    ${branch.icon}
                </span>

                <div>
                    <strong>${branch.name}</strong>
                    <small>${branch.description}</small>
                </div>
            `;

            const chain =
                document.createElement(
                    "div"
                );

            chain.className =
                "warrior-tree-chain";

            targets[branch.id] =
                chain;

            section.appendChild(
                heading
            );

            section.appendChild(
                chain
            );

            branches.appendChild(
                section
            );
        }
    );

    layout.appendChild(rootSection);
    layout.appendChild(branches);
    container.appendChild(layout);

    return targets;
}

function createHunterSkillTreeLayout(
    container
) {
    return createWarriorSkillTreeLayout(
        container,
        "hunter"
    );
}

function createMageSkillTreeLayout(
    container
) {
    return createWarriorSkillTreeLayout(
        container,
        "mage"
    );
}

function createGuardianSkillTreeLayout(
    container
) {
    return createWarriorSkillTreeLayout(
        container,
        "guardian"
    );
}

function createRogueSkillTreeLayout(
    container
) {
    return createWarriorSkillTreeLayout(
        container,
        "rogue"
    );
}

function renderSkills() {
    const tabsContainer =
        document.getElementById(
            "skill-tree-tabs"
        );

    const descriptionContainer =
        document.getElementById(
            "skill-tree-description"
        );

    const skillsContainer =
        document.getElementById(
            "skills-list"
        );

    const magicCategoryContainer =
        document.getElementById(
            "magic-category-tabs"
        );

    const pointsElement =
        document.getElementById(
            "skills-points-value"
        );

    if (
        !tabsContainer ||
        !descriptionContainer ||
        !skillsContainer
    ) {
        return;
    }

    if (pointsElement) {
        pointsElement.textContent =
            player.skillPoints || 0;
    }

    updateSkillsResetButton();

    tabsContainer.innerHTML = "";
    skillsContainer.innerHTML = "";

    const availableSkillTrees =
        getAvailableSkillTrees();

    if (
        !availableSkillTrees.some(
            tree => {
                return (
                    tree.id ===
                    currentSkillTree
                );
            }
        )
    ) {
        currentSkillTree =
            availableSkillTrees[0]?.id ||
            "magic";
    }

    availableSkillTrees.forEach(tree => {
        const button =
            document.createElement("button");

        button.textContent = tree.name;

        if (tree.id === currentSkillTree) {
            button.classList.add("active");
        }

        button.onclick = () => {
            setCurrentSkillTree(tree.id);
        };

        tabsContainer.appendChild(button);
    });

    const selectedTree =
        availableSkillTrees.find(tree => {
            return (
                tree.id === currentSkillTree
            );
        });

    if (selectedTree) {
        descriptionContainer.innerHTML = `
            <strong>${selectedTree.name}</strong>
            <span>${selectedTree.description}</span>
        `;
    }

    renderMagicCategoryTabs(
        magicCategoryContainer
    );

    const treeSkills =
        Object.values(skills).filter(skill => {
            return (
                skill.tree ===
                    currentSkillTree &&
                (
                    currentSkillTree !==
                        "magic" ||
                    skill.branch ===
                        currentMagicCategory
                )
            );
        });

    if (treeSkills.length === 0) {
        skillsContainer.innerHTML = `
            <p class="skills-empty">
                Brak umiejętności w tym drzewku.
            </p>
        `;

        return;
    }

    let skillTargets = null;

    if (
        currentSkillTree ===
            "warrior" ||
        currentSkillTree ===
            "hunter" ||
        currentSkillTree ===
            "mage" ||
        currentSkillTree ===
            "guardian" ||
        currentSkillTree ===
            "rogue"
    ) {
        skillsContainer.classList.add(
            "warrior-tree-mode"
        );

        skillTargets =
            currentSkillTree ===
                "hunter"
                ? createHunterSkillTreeLayout(
                    skillsContainer
                )
                : (
                    currentSkillTree ===
                        "mage"
                        ? createMageSkillTreeLayout(
                            skillsContainer
                        )
                        : (
                            currentSkillTree ===
                                "guardian"
                                ? createGuardianSkillTreeLayout(
                                    skillsContainer
                                )
                                : (
                                    currentSkillTree ===
                                        "rogue"
                                        ? createRogueSkillTreeLayout(
                                            skillsContainer
                                        )
                                        : createWarriorSkillTreeLayout(
                                            skillsContainer
                                        )
                                )
                        )
                );
    } else {
        skillsContainer.classList.remove(
            "warrior-tree-mode"
        );
    }

    treeSkills.forEach(skill => {
        const currentLevel =
            getSkillLevel(skill.id);

        const maxLevelReached =
            currentLevel >= skill.maxLevel;

        const levelRequirementMet =
            player.level >=
            skill.requiredLevel;

        const prerequisiteMet =
            isSkillPrerequisiteMet(skill);

        const classRequirementMet =
            isSkillClassRequirementMet(
                skill
            );

        const upgradeAvailable =
            canUpgradeSkill(skill.id);

        const div =
            document.createElement("div");

        div.className = "skill-card";

        if (
            !levelRequirementMet ||
            !prerequisiteMet ||
            !classRequirementMet
        ) {
            div.classList.add(
                "skill-locked"
            );
        }

        if (maxLevelReached) {
            div.classList.add(
                "skill-max-level"
            );
        }

        if (
            skill.maxLevel === 1 &&
            skill.costPerLevel > 1
        ) {
            div.classList.add(
                "skill-capstone"
            );
        }

        const isWarriorCapstone =
            typeof isWarriorCapstoneSkill ===
                "function" &&
            isWarriorCapstoneSkill(
                skill.id
            );

        const warriorCapstoneSelected =
            isWarriorCapstone &&
            isWarriorCapstoneSelected(
                skill.id
            );

        const isHunterCapstone =
            typeof isHunterCapstoneSkill ===
                "function" &&
            isHunterCapstoneSkill(
                skill.id
            );

        const hunterCapstoneSelected =
            isHunterCapstone &&
            isHunterCapstoneSelected(
                skill.id
            );

        const isMageCapstone =
            typeof isMageCapstoneSkill ===
                "function" &&
            isMageCapstoneSkill(
                skill.id
            );

        const mageCapstoneSelected =
            isMageCapstone &&
            isMageCapstoneSelected(
                skill.id
            );

        const isGuardianCapstone =
            typeof isGuardianCapstoneSkill ===
                "function" &&
            isGuardianCapstoneSkill(
                skill.id
            );

        const guardianCapstoneSelected =
            isGuardianCapstone &&
            isGuardianCapstoneSelected(
                skill.id
            );

        const isRogueCapstone =
            typeof isRogueCapstoneSkill ===
                "function" &&
            isRogueCapstoneSkill(
                skill.id
            );

        const rogueCapstoneSelected =
            isRogueCapstone &&
            isRogueCapstoneSelected(
                skill.id
            );

        const classCapstoneSelected =
            warriorCapstoneSelected ||
            hunterCapstoneSelected ||
            mageCapstoneSelected ||
            guardianCapstoneSelected ||
            rogueCapstoneSelected;

        if (classCapstoneSelected) {
            div.classList.add(
                "warrior-capstone-selected"
            );
        }

        div.dataset.branch =
            skill.branch || "general";

        if (skillTargets) {
            div.classList.add(
                "warrior-tree-node"
            );
        }

        const requirementText =
            getSkillRequirementText(skill);

        let buttonText = "Rozwiń";

        if (maxLevelReached) {
            buttonText =
                "Maksymalny poziom";
        } else if (!levelRequirementMet) {
            buttonText =
                "Wymaga poziomu " +
                skill.requiredLevel;
        } else if (
            !classRequirementMet
        ) {
            buttonText =
                "Niewłaściwa klasa";
        } else if (!prerequisiteMet) {
            buttonText = "Zablokowana";
        } else if (
            (player.skillPoints || 0) <
            skill.costPerLevel
        ) {
            buttonText = "Brak punktów";
        }

        const isSpell =
            skill.type === "active" &&
            (
                skill.spellType ===
                "offensive" ||
                skill.spellType ===
                "defensive"
            );

        const selectedSpellId =
            isSpell &&
                player.selectedSpells
                ? player.selectedSpells[
                skill.spellType
                ]
                : null;

        const spellSelected =
            selectedSpellId === skill.id;

        let selectButtonHtml = "";

        if (isSpell) {
            if (currentLevel <= 0) {
                selectButtonHtml = `
                    <button
                        class="spell-select-button"
                        disabled
                    >
                        Najpierw odblokuj czar
                    </button>
                `;
            } else {
                selectButtonHtml = `
                    <button
                        class="spell-select-button ${spellSelected
                        ? "selected"
                        : ""
                    }"
                        onclick="selectSpell('${skill.id}')"
                    >
                        ${spellSelected
                        ? "Wybrany — kliknij, aby usunąć"
                        : "Wybierz czar"
                    }
                    </button>
                `;
            }
        }

        let capstoneButtonHtml = "";

        if (
            isWarriorCapstone ||
            isHunterCapstone ||
            isMageCapstone ||
            isGuardianCapstone ||
            isRogueCapstone
        ) {
            const combatIsActive =
                player.isFighting === true ||
                (
                    typeof isFighting !==
                        "undefined" &&
                    isFighting === true
                );

            let capstoneButtonText =
                "Ustaw jako aktywną specjalizację";

            if (currentLevel <= 0) {
                capstoneButtonText =
                    "Najpierw odblokuj umiejętność";
            } else if (
                classCapstoneSelected
            ) {
                capstoneButtonText =
                    combatIsActive
                        ? "Aktywna specjalizacja"
                        : "Aktywna — kliknij, aby wyłączyć";
            } else if (combatIsActive) {
                capstoneButtonText =
                    "Zmień poza walką";
            }

            capstoneButtonHtml = `
                <button
                    class="warrior-capstone-button ${classCapstoneSelected
                        ? "selected"
                        : ""
                    }"
                    onclick="${isHunterCapstone
                        ? "selectHunterCapstone"
                        : (
                            isMageCapstone
                                ? "selectMageCapstone"
                                : (
                                    isGuardianCapstone
                                        ? "selectGuardianCapstone"
                                        : (
                                            isRogueCapstone
                                                ? "selectRogueCapstone"
                                                : "selectWarriorCapstone"
                                        )
                                )
                        )
                    }('${skill.id}')"
                    ${currentLevel <= 0 ||
                        combatIsActive
                        ? "disabled"
                        : ""
                    }
                >
                    ${capstoneButtonText}
                </button>
            `;
        }

        div.innerHTML = `
            <div class="skill-card-header">
                <div>
                    <span class="skill-type">
                        ${getSkillTypeName(
            skill.type
        )} · ${getSkillBranchName(
            skill.branch
        )}
                    </span>

                    <h4>${skill.name}</h4>
                </div>

                <div class="skill-level">
                    ${currentLevel}/${skill.maxLevel}
                </div>
            </div>

            <p class="skill-description">
                ${skill.description}
            </p>

            ${getSpellDetailsHtml(skill)}

            <div class="skill-requirements">
                <span>
                    Poziom bohatera:
                    ${skill.requiredLevel}
                </span>

                <span>
                    Koszt:
                    ${skill.costPerLevel} pkt
                </span>

                ${requirementText
                ? `<span>${requirementText}</span>`
                : ""
            }
            </div>

            <button
                class="skill-upgrade-button"
                onclick="upgradeSkill('${skill.id}')"
                ${upgradeAvailable
                ? ""
                : "disabled"
            }
            >
                ${buttonText}
            </button>

            ${selectButtonHtml}

            ${capstoneButtonHtml}
        `;

        const targetContainer =
            skillTargets?.[
                skill.branch
            ] ||
            skillsContainer;

        targetContainer.appendChild(
            div
        );
    });
}

function getUnlockedSpellsByType(spellType) {
    if (typeof skills === "undefined") {
        return [];
    }

    return Object.values(skills).filter(skill => {
        return (
            skill.type === "active" &&
            skill.spellType === spellType &&
            getSkillLevel(skill.id) > 0
        );
    });
}

function changeCombatSpell(spellType, spellId) {
    if (
        spellType !== "offensive" &&
        spellType !== "defensive"
    ) {
        console.warn(
            "Nieznany typ czaru:",
            spellType
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
        if (
            typeof showNotification ===
            "function"
        ) {
            showNotification(
                "Czary można zmieniać tylko poza walką.",
                "error"
            );
        }

        renderCombatSpellSlots();
        return;
    }

    if (!player.selectedSpells) {
        player.selectedSpells = {
            offensive: null,
            defensive: null
        };
    }

    if (!spellId) {
        player.selectedSpells[spellType] = null;

        if (typeof showNotification === "function") {
            showNotification(
                spellType === "offensive"
                    ? "Usunięto czar ofensywny."
                    : "Usunięto czar defensywny.",
                "success"
            );
        }

        saveGame();
        render();

        return;
    }

    const spell = skills[spellId];

    if (!spell) {
        console.warn(
            "Nie znaleziono czaru:",
            spellId
        );

        return;
    }

    if (spell.type !== "active") {
        console.warn(
            "Wybrana umiejętność nie jest czarem:",
            spellId
        );

        return;
    }

    if (spell.spellType !== spellType) {
        console.warn(
            "Czar nie pasuje do wybranego slotu:",
            spellId
        );

        return;
    }

    if (getSkillLevel(spellId) <= 0) {
        if (typeof showNotification === "function") {
            showNotification(
                "Najpierw odblokuj ten czar.",
                "error"
            );
        }

        renderCombatSpellSlots();
        return;
    }

    player.selectedSpells[spellType] = spellId;

    if (typeof showNotification === "function") {
        showNotification(
            `Wybrano czar: ${spell.name}.`,
            "success"
        );
    }

    saveGame();
    render();
}

function getCombatSpellCooldownText(spell) {
    if (!spell) {
        return "Gotowy";
    }

    if (
        typeof getSpellCooldownRemaining !==
        "function"
    ) {
        return "Gotowy";
    }

    const remainingMilliseconds =
        getSpellCooldownRemaining(spell.id);

    if (remainingMilliseconds <= 0) {
        return "Gotowy";
    }

    const remainingSeconds =
        remainingMilliseconds / 1000;

    return (
        "CD: " +
        remainingSeconds.toFixed(1) +
        " s"
    );
}

function populateCombatSpellSelect(
    selectElement,
    spellType
) {
    if (!selectElement) {
        return;
    }

    const selectedSpellId =
        player.selectedSpells &&
            player.selectedSpells[spellType]
            ? player.selectedSpells[spellType]
            : "";

    const unlockedSpells =
        getUnlockedSpellsByType(spellType);

    selectElement.innerHTML = "";

    const emptyOption =
        document.createElement("option");

    emptyOption.value = "";
    emptyOption.textContent = "Brak czaru";

    selectElement.appendChild(emptyOption);

    unlockedSpells.forEach(spell => {
        const option =
            document.createElement("option");

        option.value = spell.id;

        option.textContent =
            spell.name +
            " — poziom " +
            getSkillLevel(spell.id);

        selectElement.appendChild(option);
    });

    const selectedSpellExists =
        unlockedSpells.some(spell => {
            return spell.id === selectedSpellId;
        });

    if (selectedSpellExists) {
        selectElement.value =
            selectedSpellId;
    } else {
        selectElement.value = "";

        if (
            player.selectedSpells &&
            selectedSpellId
        ) {
            player.selectedSpells[spellType] =
                null;
        }
    }
}

function renderCombatSpellSlot(spellType) {
    const selectElement =
        document.getElementById(
            spellType + "-spell-select"
        );

    const nameElement =
        document.getElementById(
            spellType + "-spell-name"
        );

    const manaElement =
        document.getElementById(
            spellType + "-spell-mana"
        );

    const cooldownElement =
        document.getElementById(
            spellType + "-spell-cooldown"
        );

    const slotElement =
        document.getElementById(
            spellType + "-spell-slot"
        );

    if (
        !selectElement ||
        !nameElement ||
        !manaElement ||
        !cooldownElement ||
        !slotElement
    ) {
        return;
    }

    populateCombatSpellSelect(
        selectElement,
        spellType
    );

    selectElement.disabled =
        player.isFighting === true ||
        (
            typeof isFighting !==
                "undefined" &&
            isFighting === true
        );

    const selectedSpell =
        typeof getSelectedSpell === "function"
            ? getSelectedSpell(spellType)
            : null;

    slotElement.classList.remove(
        "spell-ready",
        "spell-cooldown",
        "spell-no-mana",
        "spell-empty"
    );

    if (!selectedSpell) {
        nameElement.textContent =
            "Brak czaru";

        manaElement.textContent =
            "Mana: —";

        cooldownElement.textContent =
            "Nie wybrano";

        slotElement.classList.add(
            "spell-empty"
        );

        return;
    }

    const manaCost =
        typeof getSpellManaCost === "function"
            ? getSpellManaCost(selectedSpell)
            : 0;

    const cooldownRemaining =
        typeof getSpellCooldownRemaining ===
            "function"
            ? getSpellCooldownRemaining(
                selectedSpell.id
            )
            : 0;

    nameElement.textContent =
        selectedSpell.name;

    manaElement.textContent =
        "Mana: " + manaCost;

    cooldownElement.textContent =
        getCombatSpellCooldownText(
            selectedSpell
        );

    if (player.mana < manaCost) {
        slotElement.classList.add(
            "spell-no-mana"
        );

        cooldownElement.textContent =
            "Brak many";
    } else if (cooldownRemaining > 0) {
        slotElement.classList.add(
            "spell-cooldown"
        );
    } else {
        slotElement.classList.add(
            "spell-ready"
        );
    }
}

function renderCombatSpellSlots() {
    renderCombatSpellSlot("offensive");
    renderCombatSpellSlot("defensive");
}
