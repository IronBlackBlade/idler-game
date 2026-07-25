let currentHeroTab = "summary";




function renderHero() {
    const stats = getTotalStats();
    const derived = getDerivedStats();

    const heroLevel = document.getElementById("hero-level");
    const heroAttributePoints = document.getElementById("hero-attribute-points");

    const heroHp = document.getElementById("hero-hp");
    const heroMana = document.getElementById("hero-mana");
    const heroExp = document.getElementById("hero-exp");
    const heroGold = document.getElementById("hero-gold");

    const heroStrength = document.getElementById("hero-strength");
    const heroDexterity = document.getElementById("hero-dexterity");
    const heroIntelligence = document.getElementById("hero-intelligence");
    const heroEndurance = document.getElementById("hero-endurance");
    const heroLuck = document.getElementById("hero-luck");

    const heroGeneralDamage = document.getElementById("hero-general-damage");
    const heroMeleeDamage = document.getElementById("hero-melee-damage");
    const heroRangedDamage = document.getElementById("hero-ranged-damage");
    const heroMagicDamage = document.getElementById("hero-magic-damage");

    const heroDefense = document.getElementById("hero-defense");
    const heroDodgeChance = document.getElementById("hero-dodge-chance");
    const heroCritChance = document.getElementById("hero-crit-chance");
    const heroCritDamage = document.getElementById("hero-crit-damage");
    const heroLootBonus = document.getElementById("hero-loot-bonus");
    const pendingPointsElement =
        document.getElementById(
            "hero-pending-attribute-points"
        );

    if (pendingPointsElement) {
        pendingPointsElement.textContent =
            getAvailablePendingAttributePoints();
    }

    if (heroLevel) heroLevel.textContent = player.level;

    if (heroAttributePoints) {
        heroAttributePoints.textContent = player.attributePoints || 0;
    }

    if (heroHp) heroHp.textContent = player.hp + "/" + derived.maxHp;
    if (heroMana) heroMana.textContent = player.mana + "/" + derived.maxMana;

    if (heroExp) heroExp.textContent = player.exp + "/" + player.expToNextLevel;
    if (heroGold) heroGold.textContent = player.gold;

    if (heroStrength) {
        heroStrength.textContent =
            formatPreviewAttribute(
                "strength"
            );
    }

    if (heroDexterity) {
        heroDexterity.textContent =
            formatPreviewAttribute(
                "dexterity"
            );
    }

    if (heroIntelligence) {
        heroIntelligence.textContent =
            formatPreviewAttribute(
                "intelligence"
            );
    }

    if (heroEndurance) {
        heroEndurance.textContent =
            formatPreviewAttribute(
                "endurance"
            );
    }

    if (heroLuck) {
        heroLuck.textContent =
            formatPreviewAttribute(
                "luck"
            );
    }

    renderHeroAttributeDetails();

    renderCharacterClassSection();
    renderHeroClassSummaryCard();

    if (heroGeneralDamage) {
        heroGeneralDamage.textContent = "+" + derived.generalDamage.toFixed(1);
    }

    if (heroMeleeDamage) {
        heroMeleeDamage.textContent =
            Math.floor(
                derived.meleeDamage
            );
    }

    if (heroRangedDamage) {
        heroRangedDamage.textContent =
            Math.floor(
                derived.rangedDamage
            );
    }

    if (heroMagicDamage) {
        heroMagicDamage.textContent =
            Math.floor(
                derived.magicDamage
            );
    }

    if (heroDefense) {
        heroDefense.textContent =
            derived.defense.toFixed(1) +
            "%";
    }

    if (heroDodgeChance) {
        heroDodgeChance.textContent =
            derived.dodgeChance.toFixed(1) +
            "%";
    }

    if (heroCritChance) {
        heroCritChance.textContent =
            derived.critChance.toFixed(1) +
            "%";
    }

    if (heroCritDamage) {
        heroCritDamage.textContent =
            derived.critDamage.toFixed(1) +
            "%";
    }

    if (heroLootBonus) {
        heroLootBonus.textContent =
            "+" +
            derived.lootBonus.toFixed(1) +
            "%";
    }

    if (
        typeof renderActiveHeroBonuses ===
        "function"
    ) {
        renderActiveHeroBonuses();
    }


}


function isHeroTabVisible(
    tabName
) {
    const heroScreen =
        document.getElementById(
            "screen-hero"
        );

    const heroPanel =
        document.querySelector(
            '[data-hero-panel="' +
            tabName +
            '"]'
        );

    if (
        !heroScreen ||
        !heroPanel
    ) {
        return false;
    }

    const isScreenVisible =
        window.getComputedStyle(
            heroScreen
        ).display !== "none";

    const isPanelActive =
        heroPanel.classList.contains(
            "active"
        );

    return (
        isScreenVisible &&
        isPanelActive
    );
}

function refreshHeroInventoryView() {
    if (
        !isHeroTabVisible(
            "inventory"
        )
    ) {
        return;
    }

    if (
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
    }
}

function refreshHeroEquipmentView() {
    if (
        !isHeroTabVisible(
            "equipment"
        )
    ) {
        return;
    }

    if (
        typeof renderEquipmentSlots ===
        "function"
    ) {
        renderEquipmentSlots();
    }
}

function refreshCurrentHeroTab() {
    if (
        currentHeroTab ===
        "inventory" &&
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
        return;
    }

    if (
        currentHeroTab ===
        "equipment" &&
        typeof renderEquipmentSlots ===
        "function"
    ) {
        renderEquipmentSlots();
        return;
    }

    if (
        currentHeroTab ===
        "skills" &&
        typeof renderSkills ===
        "function"
    ) {
        renderSkills();
    }
}

function showHeroTab(tabName) {
    currentHeroTab = tabName;

    const panels =
        document.querySelectorAll(
            ".hero-tab-panel"
        );

    panels.forEach(panel => {
        panel.classList.toggle(
            "active",
            panel.dataset.heroPanel ===
            tabName
        );
    });

    const buttons =
        document.querySelectorAll(
            ".hero-tab-button"
        );

    buttons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.heroTab ===
            tabName
        );
    });

    localStorage.setItem(
        "idler_hero_tab",
        tabName
    );

    if (
        tabName === "inventory" &&
        typeof renderInventory ===
        "function"
    ) {
        renderInventory();
    }

    if (
        tabName === "equipment" &&
        typeof renderEquipmentSlots ===
        "function"
    ) {
        renderEquipmentSlots();
    }

    if (
        tabName === "skills" &&
        typeof renderSkills ===
        "function"
    ) {
        renderSkills();
    }
}

function openHeroTab(
    tabName
) {
    const allowedTabs = [
        "summary",
        "attributes",
        "equipment",
        "inventory",
        "skills"
    ];

    if (
        !allowedTabs.includes(
            tabName
        )
    ) {
        console.warn(
            "Nieznana zakładka bohatera:",
            tabName
        );

        return;
    }

    if (
        typeof showScreen ===
        "function"
    ) {
        showScreen(
            "screen-hero"
        );
    }

    showHeroTab(
        tabName
    );
}

function restoreHeroTab() {
    const savedTab =
        localStorage.getItem(
            "idler_hero_tab"
        );

    const allowedTabs = [
        "summary",
        "attributes",
        "equipment",
        "inventory",
        "skills"
    ];

    const tabName =
        allowedTabs.includes(savedTab)
            ? savedTab
            : "summary";

    showHeroTab(tabName);
}



function initializeHeroTab() {
    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            () => {
                restoreHeroTab();
            },
            {
                once: true
            }
        );

        return;
    }

    restoreHeroTab();
}

initializeHeroTab();