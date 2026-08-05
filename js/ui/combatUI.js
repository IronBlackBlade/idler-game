const BOSS_CHANCE_START_KILL =
    26;

const BOSS_CHANCE_PER_KILL =
    0.25;

const BOSS_CHANCE_MAX =
    20;

function formatBossChance(
    value
) {
    const safeValue =
        Math.max(
            0,
            Number(value) || 0
        );

    return safeValue
        .toFixed(2)
        .replace(/\.?0+$/, "")
        .replace(".", ",") +
        "%";
}

var equipmentSetCombatIndicatorUiState = {
    commander: "",
    dragon: ""
};

function getEquipmentSetCombatIndicatorModels() {
    const combatState =
        typeof getEquipmentSetCombatState === "function"
            ? getEquipmentSetCombatState()
            : {};

    const commanderEffect =
        typeof getActiveEquipmentSetUniqueEffect === "function"
            ? getActiveEquipmentSetUniqueEffect(
                "commander_unyielding_defense"
            )
            : null;

    const dragonEffect =
        typeof getActiveEquipmentSetUniqueEffect === "function"
            ? getActiveEquipmentSetUniqueEffect(
                "dragon_wrath_burn"
            )
            : null;

    let commander = null;

    if (commanderEffect) {
        const maxCharges = Math.max(
            1,
            Math.floor(
                Number(commanderEffect.hitCount) || 3
            )
        );

        const remainingCharges = Math.max(
            0,
            Math.floor(
                Number(
                    combatState.commanderDefenseCharges
                ) || 0
            )
        );

        if (remainingCharges > 0) {
            commander = {
                mode: "active",
                status:
                    "Aktywna · pozostało " +
                    remainingCharges +
                    "/" +
                    maxCharges +
                    " bloków"
            };
        } else if (
            combatState.commanderDefenseTriggered === true
        ) {
            commander = {
                mode: "spent",
                status: "Wykorzystana w tej walce"
            };
        } else {
            commander = {
                mode: "ready",
                status:
                    "Gotowa · aktywacja poniżej " +
                    Math.max(
                        1,
                        Math.floor(
                            Number(
                                commanderEffect.hpThresholdPercent
                            ) || 35
                        )
                    ) +
                    "% HP"
            };
        }
    }

    let dragon = null;

    if (dragonEffect) {
        const maxTicks = Math.max(
            1,
            Math.floor(
                Number(dragonEffect.tickCount) || 3
            )
        );

        const remainingTicks = Math.max(
            0,
            Math.floor(
                Number(
                    combatState.dragonBurnTicksRemaining
                ) || 0
            )
        );

        const damagePerTick = Math.max(
            0,
            Math.round(
                Number(
                    combatState.dragonBurnDamagePerTick
                ) || 0
            )
        );

        if (remainingTicks > 0) {
            dragon = {
                mode: "active",
                status:
                    "Podpalenie · " +
                    remainingTicks +
                    "/" +
                    maxTicks +
                    " tur · " +
                    damagePerTick +
                    " obrażeń/turę"
            };
        } else {
            dragon = {
                mode: "ready",
                status: "Gotowy · podpala po trafieniu krytycznym"
            };
        }
    }

    return {
        commander,
        dragon
    };
}

function renderEquipmentSetCombatIndicator(
    elementId,
    model,
    stateKey
) {
    const element = document.getElementById(
        elementId
    );

    if (!element) return;

    if (!model) {
        element.hidden = true;
        equipmentSetCombatIndicatorUiState[stateKey] = "";
        return;
    }

    const previousSignature =
        equipmentSetCombatIndicatorUiState[stateKey];

    const currentSignature =
        model.mode + "|" + model.status;

    const previousMode =
        previousSignature.split("|")[0];

    const statusElement = element.querySelector(
        "[data-set-effect-status]"
    );

    element.hidden = false;
    element.dataset.state = model.mode;

    if (statusElement) {
        statusElement.textContent = model.status;
    }

    if (element.classList) {
        element.classList.remove(
            "is-ready",
            "is-active",
            "is-spent",
            "is-activating",
            "is-expiring",
            "is-updating"
        );

        element.classList.add(
            "is-" + model.mode
        );

        if (
            previousSignature &&
            previousSignature !== currentSignature
        ) {
            void element.offsetWidth;

            if (
                previousMode !== "active" &&
                model.mode === "active"
            ) {
                element.classList.add(
                    "is-activating"
                );
            } else if (
                previousMode === "active" &&
                model.mode !== "active"
            ) {
                element.classList.add(
                    "is-expiring"
                );
            } else if (model.mode === "active") {
                element.classList.add(
                    "is-updating"
                );
            }
        }
    }

    equipmentSetCombatIndicatorUiState[stateKey] =
        currentSignature;
}

function renderEquipmentSetCombatIndicators() {
    const models =
        getEquipmentSetCombatIndicatorModels();

    renderEquipmentSetCombatIndicator(
        "commander-defense-indicator",
        models.commander,
        "commander"
    );

    renderEquipmentSetCombatIndicator(
        "dragon-wrath-indicator",
        models.dragon,
        "dragon"
    );
}

function renderAutoHealingPanel() {
    if (
        typeof ensureAutoHealingState !==
        "function"
    ) {
        return;
    }

    ensureAutoHealingState();

    const slot =
        document.getElementById(
            "auto-healing-slot"
        );

    const potionSelect =
        document.getElementById(
            "auto-healing-potion-select"
        );

    const thresholdSelect =
        document.getElementById(
            "auto-healing-threshold-select"
        );

    const potionName =
        document.getElementById(
            "auto-healing-potion-name"
        );

    const quantityElement =
        document.getElementById(
            "auto-healing-quantity"
        );

    const statusElement =
        document.getElementById(
            "auto-healing-status"
        );

    if (
        !slot ||
        !potionSelect ||
        !thresholdSelect ||
        !potionName ||
        !quantityElement ||
        !statusElement
    ) {
        return;
    }

    const healingPotions =
        typeof getHealingPotionItems ===
            "function"
            ? getHealingPotionItems()
            : [];

    const optionsSignature =
        healingPotions
            .map(potion => {
                return (
                    potion.id +
                    ":" +
                    potion.healingPercent
                );
            })
            .join("|");

    if (
        potionSelect.dataset
            .optionsSignature !==
        optionsSignature
    ) {
        potionSelect.innerHTML = `
            <option value="">
                Wyłączone
            </option>

            <option
                value="${AUTO_HEALING_STRONGEST_MODE}"
            >
                ✨ Najsilniejsza dostępna
            </option>
        `;

        healingPotions.forEach(
            potion => {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    potion.id;

                option.textContent =
                    potion.name +
                    " · +" +
                    potion.healingPercent +
                    "% HP";

                potionSelect.appendChild(
                    option
                );
            }
        );

        potionSelect.dataset
            .optionsSignature =
            optionsSignature;
    }

    const selectedPotionId =
        player.autoHealing
            .selectedPotionId ||
        "";

    const strongestModeSelected =
        selectedPotionId ===
        AUTO_HEALING_STRONGEST_MODE;

    /*
     * W trybie automatycznym pobieramy
     * prawdziwą, najmocniejszą dostępną
     * miksturę z plecaka.
     */
    const selectedPotion =
        strongestModeSelected
            ? (
                typeof getStrongestAvailableHealingPotion ===
                    "function"
                    ? getStrongestAvailableHealingPotion()
                    : null
            )
            : selectedPotionId
                ? items[selectedPotionId]
                : null;

    /*
     * Ilość liczymy z ID prawdziwego
     * przedmiotu, a nie ze specjalnego
     * identyfikatora trybu automatycznego.
     */
    const quantity =
        selectedPotion &&
            typeof getInventoryItemQuantity ===
            "function"
            ? getInventoryItemQuantity(
                selectedPotion.id
            )
            : 0;

    const cooldownSeconds =
        typeof getAutoHealingCooldownSecondsLeft ===
            "function"
            ? getAutoHealingCooldownSecondsLeft()
            : 0;

    const combatIsActive =
        player.isFighting ===
        true ||
        (
            typeof isFighting !==
            "undefined" &&
            isFighting === true
        );

    potionSelect.value =
        selectedPotionId;

    thresholdSelect.value =
        String(
            player.autoHealing
                .thresholdPercent
        );

    potionSelect.disabled =
        combatIsActive;

    thresholdSelect.disabled =
        combatIsActive;

    potionName.textContent =
        strongestModeSelected
            ? selectedPotion
                ? "Auto: " +
                selectedPotion.name
                : "Auto: brak mikstur"
            : selectedPotion?.name ||
            "Brak wybranej mikstury";

    quantityElement.textContent =
        "W plecaku: " +
        quantity;

    /*
     * Najpierw czyścimy poprzednie
     * kolory i stany kafelka.
     */
    slot.classList.remove(
        "healing-potion-ready",
        "healing-potion-cooldown",
        "healing-potion-empty"
    );

    /*
     * Automat jest całkowicie wyłączony.
     */
    if (
        !selectedPotionId
    ) {
        statusElement.textContent =
            "Wyłączone";

        quantityElement.textContent =
            "W plecaku: 0";

        slot.classList.add(
            "healing-potion-empty"
        );

        return;
    }

    /*
     * Tryb automatyczny jest włączony,
     * ale gracz nie ma żadnej mikstury.
     */
    if (
        strongestModeSelected &&
        !selectedPotion
    ) {
        statusElement.textContent =
            "Brak mikstur";

        quantityElement.textContent =
            "W plecaku: 0";

        slot.classList.add(
            "healing-potion-empty"
        );

        return;
    }

    /*
     * Wybrano konkretną miksturę,
     * ale przedmiot już nie istnieje.
     */
    if (!selectedPotion) {
        statusElement.textContent =
            "Brak mikstury";

        quantityElement.textContent =
            "W plecaku: 0";

        slot.classList.add(
            "healing-potion-empty"
        );

        return;
    }

    /*
     * Wybrana mikstura istnieje,
     * ale nie ma jej już w plecaku.
     */
    if (quantity <= 0) {
        statusElement.textContent =
            strongestModeSelected
                ? "Brak mikstur"
                : "Brak mikstury";

        slot.classList.add(
            "healing-potion-empty"
        );

        return;
    }

    /*
     * Mikstura jest w trakcie cooldownu.
     */
    if (cooldownSeconds > 0) {
        statusElement.textContent =
            "Odnowienie " +
            cooldownSeconds +
            " s";

        slot.classList.add(
            "healing-potion-cooldown"
        );

        return;
    }

    /*
     * Mikstura jest gotowa.
     */
    statusElement.textContent =
        strongestModeSelected
            ? "Auto · Gotowa"
            : "Gotowa";

    slot.classList.add(
        "healing-potion-ready"
    );
}

function formatCombatFoodTime(
    seconds
) {
    const safeSeconds =
        Math.max(
            0,
            Math.ceil(
                Number(seconds) || 0
            )
        );

    const hours =
        Math.floor(
            safeSeconds / 3600
        );

    const minutes =
        Math.floor(
            (
                safeSeconds % 3600
            ) / 60
        );

    const remainingSeconds =
        safeSeconds % 60;

    if (hours > 0) {
        return (
            hours +
            " godz. " +
            minutes +
            " min"
        );
    }

    return (
        String(minutes)
            .padStart(2, "0") +
        ":" +
        String(
            remainingSeconds
        ).padStart(2, "0")
    );
}

function renderCombatFoodPanel() {
    if (
        typeof ensureCombatFoodState !==
        "function"
    ) {
        return;
    }

    ensureCombatFoodState();

    const slot =
        document.getElementById(
            "combat-food-slot"
        );

    const foodSelect =
        document.getElementById(
            "combat-food-select"
        );

    const foodName =
        document.getElementById(
            "combat-food-name"
        );

    const activeFoodName =
        document.getElementById(
            "combat-food-active-name"
        );

    const activeFoodTime =
        document.getElementById(
            "combat-food-active-time"
        );

    const quantityElement =
        document.getElementById(
            "combat-food-quantity"
        );

    const statusElement =
        document.getElementById(
            "combat-food-status"
        );

    const useButton =
        document.getElementById(
            "combat-food-use-button"
        );

    if (
        !slot ||
        !foodSelect ||
        !foodName ||
        !activeFoodName ||
        !activeFoodTime ||
        !quantityElement ||
        !statusElement ||
        !useButton
    ) {
        return;
    }

    const foodItems =
        typeof getFoodItems ===
            "function"
            ? getFoodItems()
            : [];

    const optionsSignature =
        foodItems
            .map(food => {
                const quantity =
                    typeof getInventoryItemQuantity ===
                        "function"
                        ? getInventoryItemQuantity(
                            food.id
                        )
                        : 0;

                return (
                    food.id +
                    ":" +
                    food.durationSeconds +
                    ":" +
                    quantity
                );
            })
            .join("|");
    if (
        foodSelect.dataset
            .optionsSignature !==
        optionsSignature
    ) {
        foodSelect.innerHTML = `
            <option value="">
                Brak potrawy
            </option>
        `;

        foodItems.forEach(
            food => {
                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    food.id;

                const quantity =
                    typeof getInventoryItemQuantity ===
                        "function"
                        ? getInventoryItemQuantity(
                            food.id
                        )
                        : 0;

                option.textContent =
                    (
                        food.foodIcon ||
                        "🍲"
                    ) +
                    " " +
                    food.name +
                    " (" +
                    quantity +
                    ")";
                foodSelect.appendChild(
                    option
                );
            }
        );

        foodSelect.dataset
            .optionsSignature =
            optionsSignature;
    }

    const selectedFoodId =
        player.combatFood
            .selectedFoodId ||
        "";

    const selectedFood =
        selectedFoodId
            ? items[selectedFoodId]
            : null;

    const selectedQuantity =
        selectedFoodId
            ? getInventoryItemQuantity(
                selectedFoodId
            )
            : 0;

    const activeFood =
        typeof getActiveFoodEffect ===
            "function"
            ? getActiveFoodEffect()
            : null;

    const activeFoodSeconds =
        typeof getActiveFoodRemainingSeconds ===
            "function"
            ? getActiveFoodRemainingSeconds()
            : 0;

    const cooldownSeconds =
        typeof getCombatFoodCooldownSecondsLeft ===
            "function"
            ? getCombatFoodCooldownSecondsLeft()
            : 0;

    foodSelect.value =
        selectedFoodId;

    foodName.textContent =
        selectedFood?.name ||
        "Brak wybranej potrawy";

    quantityElement.textContent =
        "W plecaku: " +
        selectedQuantity;

    activeFoodName.textContent =
        activeFood
            ? (
                activeFood.icon ||
                "🍲"
            ) +
            " " +
            activeFood.name
            : "Brak";

    activeFoodTime.textContent =
        activeFood
            ? "Czas: " +
            formatCombatFoodTime(
                activeFoodSeconds
            )
            : "Czas: —";

    slot.classList.remove(
        "combat-food-ready",
        "combat-food-cooldown",
        "combat-food-empty",
        "combat-food-unselected"
    );

    if (!selectedFood) {
        statusElement.textContent =
            "Nie wybrano";

        useButton.textContent =
            "🍴 Wybierz potrawę";

        useButton.disabled = true;

        slot.classList.add(
            "combat-food-unselected"
        );

        return;
    }

    if (selectedQuantity <= 0) {
        statusElement.textContent =
            "Brak potraw";

        useButton.textContent =
            "🍴 Brak w plecaku";

        useButton.disabled = true;

        slot.classList.add(
            "combat-food-empty"
        );

        return;
    }

    if (cooldownSeconds > 0) {
        statusElement.textContent =
            "Jedzenie: " +
            cooldownSeconds +
            " s";

        useButton.textContent =
            "🍴 Odnowienie " +
            cooldownSeconds +
            " s";

        useButton.disabled = true;

        slot.classList.add(
            "combat-food-cooldown"
        );

        return;
    }

    const sameFoodIsActive =
        activeFood &&
        (
            activeFood.sourceItemId ===
            selectedFoodId
        );

    statusElement.textContent =
        sameFoodIsActive
            ? "Możesz wydłużyć"
            : "Gotowa";

    useButton.textContent =
        sameFoodIsActive
            ? "🍴 Zjedz ponownie"
            : activeFood
                ? "🍴 Zmień potrawę"
                : "🍴 Zjedz";

    useButton.disabled = false;

    slot.classList.add(
        "combat-food-ready"
    );
}

function renderCombat() {
    const currentLocationName = document.getElementById("current-location-name");

    const enemyName =
        document.getElementById(
            "enemy-name"
        );

    const enemyIcon =
        document.getElementById(
            "enemy-icon"
        );
    const enemyModifierDescription =
        document.getElementById(
            "enemy-modifier-description"
        );
    const enemyHp = document.getElementById("enemy-hp");
    const enemyAttack = document.getElementById("enemy-attack");
    const enemyFill = document.getElementById("enemy-fill");

    const bossChance = document.getElementById("boss-chance");
    const bossKillsCounter = document.getElementById("boss-kills-counter");
    const bossChanceProgress =
        document.getElementById(
            "boss-chance-progress"
        );

    const bossChanceFill =
        document.getElementById(
            "boss-chance-fill"
        );

    const bossChanceMessage =
        document.getElementById(
            "boss-chance-message"
        );
    const bossLabel = document.getElementById("boss-label");
    const enemyCard = document.getElementById("enemy-card");

    const fightButton = document.getElementById("fight-btn");
    const respawnTimer = document.getElementById("respawn-timer");

    if (currentLocationName && locations[player.location]) {
        currentLocationName.textContent = locations[player.location].name;
    }

    if (enemyName) enemyName.textContent = enemy.name;
    if (enemyIcon) {
        enemyIcon.textContent =
            typeof getEnemyIcon ===
                "function"
                ? getEnemyIcon(
                    enemy.id
                )
                : "👹";
    }

    if (enemyHp) enemyHp.textContent = enemy.hp + "/" + enemy.maxHp;
    if (enemyAttack) enemyAttack.textContent = enemy.attack || 0;

    if (enemyFill) {
        const enemyHpPercent = Math.max(
            0,
            Math.min(100, (enemy.hp / enemy.maxHp) * 100)
        );

        enemyFill.style.width = enemyHpPercent + "%";
    }

    const progress =
        getCurrentLocationProgress();

    const currentBossChance =
        Math.max(
            0,
            Number(
                progress.bossChance
            ) || 0
        );

    const currentBossKills =
        Math.max(
            0,
            Math.floor(
                Number(
                    progress
                        .bossKillsCounter
                ) || 0
            )
        );

    const bossChanceFillPercent =
        Math.min(
            100,
            (
                currentBossChance /
                BOSS_CHANCE_MAX
            ) * 100
        );

    if (bossChance) {
        bossChance.textContent =
            formatBossChance(
                currentBossChance
            );
    }

    if (bossKillsCounter) {
        bossKillsCounter.textContent =
            currentBossKills;
    }

    if (bossChanceProgress) {
        bossChanceProgress.textContent =
            formatBossChance(
                currentBossChance
            ) +
            " / " +
            formatBossChance(
                BOSS_CHANCE_MAX
            );
    }

    if (bossChanceFill) {
        bossChanceFill.style.width =
            bossChanceFillPercent +
            "%";

        bossChanceFill.classList.toggle(
            "has-chance",
            currentBossChance > 0
        );
    }

    if (bossChanceMessage) {
        if (player.isBossFight) {
            bossChanceMessage.textContent =
                "👑 Boss pojawił się w walce!";
        } else if (
            currentBossKills <
            BOSS_CHANCE_START_KILL
        ) {
            bossChanceMessage.textContent =
                "Pierwszy wzrost szansy: " +
                currentBossKills +
                "/" +
                BOSS_CHANCE_START_KILL +
                " zwycięstw.";
        } else if (
            currentBossChance >=
            BOSS_CHANCE_MAX
        ) {
            bossChanceMessage.textContent =
                "Osiągnięto maksymalną szansę 20%.";
        } else {
            bossChanceMessage.textContent =
                "Każde kolejne zwycięstwo: +" +
                formatBossChance(
                    BOSS_CHANCE_PER_KILL
                ) +
                " szansy.";
        }
    }

    const encounterType =
        player.isBossFight
            ? "boss"
            : (
                enemy.encounterType ||
                "normal"
            );

    if (bossLabel) {
        if (encounterType === "boss") {
            bossLabel.textContent =
                "👑 BOSS";
        } else if (
            encounterType === "elite"
        ) {
            bossLabel.textContent =
                "💠 ELITA" +
                (
                    enemy.eliteModifierLabel
                        ? " · " +
                        enemy.eliteModifierLabel
                        : ""
                );

            bossLabel.title =
                enemy
                    .eliteModifierDescription ||
                "";
        } else if (
            encounterType === "strong"
        ) {
            bossLabel.textContent =
                "⭐ SILNY";
        } else {
            bossLabel.textContent = "";
        }
        if (encounterType !== "elite") {
            bossLabel.title = "";
        }
    }
    if (enemyModifierDescription) {
        const shouldShowModifier =
            encounterType === "elite" &&
            Boolean(
                enemy
                    .eliteModifierDescription
            );

        enemyModifierDescription.hidden =
            !shouldShowModifier;

        enemyModifierDescription.textContent =
            shouldShowModifier
                ? enemy
                    .eliteModifierDescription
                : "";
    }
    if (enemyCard) {
        enemyCard.classList.remove(
            "boss-card",
            "strong-card",
            "elite-card"
        );

        if (encounterType === "boss") {
            enemyCard.classList.add(
                "boss-card"
            );
        } else if (
            encounterType === "elite"
        ) {
            enemyCard.classList.add(
                "elite-card"
            );
        } else if (
            encounterType === "strong"
        ) {
            enemyCard.classList.add(
                "strong-card"
            );
        }
    }

    if (fightButton) {
        const cooldownSeconds =
            typeof getCombatCooldownSecondsLeft ===
                "function"
                ? getCombatCooldownSecondsLeft()
                : 0;

        if (isFighting) {
            fightButton.textContent =
                "STOP WALKI ⏸️";

            fightButton.disabled =
                false;
        } else if (
            cooldownSeconds > 0
        ) {
            fightButton.textContent =
                "START ZA " +
                cooldownSeconds +
                " s";

            fightButton.disabled =
                true;
        } else {
            fightButton.textContent =
                "START WALKI ▶️";

            fightButton.disabled =
                false;
        }

        fightButton.classList.toggle(
            "fight-active",
            isFighting === true
        );

        fightButton.classList.toggle(
            "fight-cooldown",
            !isFighting &&
            cooldownSeconds > 0
        );
    }

    if (respawnTimer) {
        if (isRespawning) {
            const safeRespawnTime = Math.max(
                0,
                Number(respawnTimeLeft) || 0
            );

            const respawnTimeText =
                Number.isInteger(safeRespawnTime)
                    ? String(safeRespawnTime)
                    : safeRespawnTime
                        .toFixed(1)
                        .replace(".", ",");

            respawnTimer.textContent =
                "⏳ Odrodzenie za: " +
                respawnTimeText +
                " s";
        } else {
            respawnTimer.textContent = "";
        }
    }

    renderEquipmentSetCombatIndicators();
    renderAutoHealingPanel();
    renderCombatFoodPanel();
}
