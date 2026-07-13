function formatNumber(value) {
    return Number(value).toFixed(1);
}

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

    if (heroGeneralDamage) {
        heroGeneralDamage.textContent = "+" + derived.generalDamage.toFixed(1);
    }

    if (heroMeleeDamage) heroMeleeDamage.textContent = Math.floor(derived.meleeDamage);
    if (heroRangedDamage) heroRangedDamage.textContent = Math.floor(derived.rangedDamage);
    if (heroMagicDamage) heroMagicDamage.textContent = Math.floor(derived.magicDamage);

    if (heroDefense) heroDefense.textContent = derived.defense.toFixed(1);

    if (heroDodgeChance) {
        heroDodgeChance.textContent = derived.dodgeChance.toFixed(1) + "%";
    }

    if (heroCritChance) {
        heroCritChance.textContent = derived.critChance.toFixed(1) + "%";
    }

    if (heroCritDamage) {
        heroCritDamage.textContent = derived.critDamage + "%";
    }

    if (heroLootBonus) {
        heroLootBonus.textContent = "+" + derived.lootBonus + "%";
    }
    
const activeHeroPanel =
    document.querySelector(
        ".hero-tab-panel.active"
    );

if (!activeHeroPanel) {
    restoreHeroTab();
}

}

function renderEquipmentSlots() {
    const slots = {
        weapon: "slot-weapon",
        shield: "slot-shield",
        helmet: "slot-helmet",
        armor: "slot-armor",
        pants: "slot-pants",
        boots: "slot-boots",
        gloves: "slot-gloves",
        ring1: "slot-ring1",
        ring2: "slot-ring2",
        amulet: "slot-amulet",
        talisman: "slot-talisman"
    };

    Object.keys(slots).forEach(slot => {
        const element = document.getElementById(slots[slot]);

        if (!element) return;

        const slotBox = element.closest(".equipment-slot");
        const itemId = player.equipment[slot];

        if (!itemId) {
            if (slotBox) {
                slotBox.classList.add("empty-slot");
            }

            element.innerHTML = "Pusty";
            return;
        }

        if (slotBox) {
            slotBox.classList.remove("empty-slot");
        }

        const item = items[itemId];

        if (!item) {
            element.innerHTML = "Nieznany przedmiot";
            return;
        }

        let stats = "";

        if (item.damage) stats += `<span>Obrażenia: ${item.damage}</span>`;
        if (item.attack) stats += `<span>Atak: +${item.attack}</span>`;
        if (item.strength) stats += `<span>Siła: +${item.strength}</span>`;
        if (item.dexterity) stats += `<span>Zręczność: +${item.dexterity}</span>`;
        if (item.intelligence) stats += `<span>Inteligencja: +${item.intelligence}</span>`;
        if (item.endurance) stats += `<span>Wytrzymałość: +${item.endurance}</span>`;
        if (item.luck) stats += `<span>Szczęście: +${item.luck}</span>`;

element.classList.remove(
    "rarity-common",
    "rarity-uncommon",
    "rarity-rare",
    "rarity-epic",
    "rarity-legendary"
);

if (item.rarity) {
    element.classList.add("rarity-" + item.rarity);
}

        element.innerHTML = `
    <div class="equipment-item-content">
        <div>
            <div class="equipment-item-name">${item.name}</div>

            <div class="equipment-item-tags">
                <span>Poziom: ${item.requiredLevel || 1}</span>
                <span>${getRarityName(item.rarity)}</span>
                ${stats}
            </div>
        </div>

        <button class="equipment-unequip-btn" onclick="unequipItem('${slot}')">Zdejmij</button>
    </div>
`;
    });
}

function formatPreviewAttribute(
    statName
) {
    const baseValue =
        player.stats[statName] || 0;

    const pendingValue =
        pendingAttributeChanges[
            statName
        ] || 0;

    if (pendingValue <= 0) {
        return String(baseValue);
    }

    return (
        baseValue +
        " +" +
        pendingValue
    );
}

let currentHeroTab = "summary";

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