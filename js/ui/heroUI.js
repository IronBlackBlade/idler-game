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

    if (heroLevel) heroLevel.textContent = player.level;

    if (heroAttributePoints) {
        heroAttributePoints.textContent = player.attributePoints || 0;
    }

    if (heroHp) heroHp.textContent = player.hp + "/" + derived.maxHp;
    if (heroMana) heroMana.textContent = player.mana + "/" + derived.maxMana;

    if (heroExp) heroExp.textContent = player.exp + "/" + player.expToNextLevel;
    if (heroGold) heroGold.textContent = player.gold;

    if (heroStrength) heroStrength.textContent = stats.strength;
    if (heroDexterity) heroDexterity.textContent = stats.dexterity;
    if (heroIntelligence) heroIntelligence.textContent = stats.intelligence;
    if (heroEndurance) heroEndurance.textContent = stats.endurance;
    if (heroLuck) heroLuck.textContent = stats.luck;

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

        element.innerHTML = `
            <div class="equipment-item-name">${item.name}</div>

            <div class="equipment-item-tags">
                <span>Poziom: ${item.requiredLevel || 1}</span>
                <span>${item.rarity}</span>
                ${stats}
            </div>

            <button onclick="unequipItem('${slot}')">Zdejmij</button>
        `;
    });
}