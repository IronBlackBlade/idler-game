let currentSkillTree = "magic";

function setCurrentSkillTree(treeId) {
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

function getSpellTypeName(spellType) {
    const spellTypeNames = {
        offensive: "Ofensywny",
        defensive: "Defensywny"
    };

    return spellTypeNames[spellType] || spellType;
}

function getSkillRequirementText(skill) {
    if (!skill.prerequisite) {
        return "";
    }

    const requiredSkill =
        skills[skill.prerequisite.skillId];

    if (!requiredSkill) {
        return "";
    }

    return (
        "Wymaga: " +
        requiredSkill.name +
        " " +
        skill.prerequisite
            .requiredSkillLevel +
        " poziom"
    );
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

            ${
                effectText
                    ? `<span>${effectText}</span>`
                    : ""
            }
        </div>
    `;
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

    tabsContainer.innerHTML = "";
    skillsContainer.innerHTML = "";

    skillTrees.forEach(tree => {
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
        skillTrees.find(tree => {
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

    const treeSkills =
        Object.values(skills).filter(skill => {
            return (
                skill.tree ===
                currentSkillTree
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

        const upgradeAvailable =
            canUpgradeSkill(skill.id);

        const div =
            document.createElement("div");

        div.className = "skill-card";

        if (
            !levelRequirementMet ||
            !prerequisiteMet
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
                        class="spell-select-button ${
                            spellSelected
                                ? "selected"
                                : ""
                        }"
                        onclick="selectSpell('${skill.id}')"
                    >
                        ${
                            spellSelected
                                ? "Wybrany — kliknij, aby usunąć"
                                : "Wybierz czar"
                        }
                    </button>
                `;
            }
        }

        div.innerHTML = `
            <div class="skill-card-header">
                <div>
                    <span class="skill-type">
                        ${getSkillTypeName(
                            skill.type
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

                ${
                    requirementText
                        ? `<span>${requirementText}</span>`
                        : ""
                }
            </div>

            <button
                class="skill-upgrade-button"
                onclick="upgradeSkill('${skill.id}')"
                ${
                    upgradeAvailable
                        ? ""
                        : "disabled"
                }
            >
                ${buttonText}
            </button>

            ${selectButtonHtml}
        `;

        skillsContainer.appendChild(div);
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