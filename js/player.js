const player = {
    hp: 100,
    mana: 50,

    gold: 0,
    exp: 0,
    expToNextLevel: 100,
    level: 1,
    attributePoints: 0,

    isFighting: false,

    bossKillsCounter: 0,
    bossChance: 0,
    isBossFight: false,

    locationProgress: {
    forest: {
        bossKillsCounter: 0,
        bossChance: 0
    },
    cave: {
        bossKillsCounter: 0,
        bossChance: 0
    }
},

    location: "forest",

    stats: {
        strength: 5,
        dexterity: 5,
        intelligence: 5,
        endurance: 5,
        luck: 5
    },

    inventory: [],
    unlockedRecipes: [],

    equipment: {
        weapon: null,
        shield: null,
        helmet: null,
        armor: null,
        pants: null,
        boots: null,
        gloves: null,
        ring1: null,
        ring2: null,
        amulet: null,
        talisman: null
    }
};

function resetPlayer() {
    player.gold = 0;
    player.exp = 0;
    player.expToNextLevel = getExpToNextLevel(player.level);
    player.level = 1;

    player.isFighting = false;
    player.unlockedRecipes = [];

    player.bossKillsCounter = 0;
    player.bossChance = 0;
    player.isBossFight = false;

    player.locationProgress = {
    forest: {
        bossKillsCounter: 0,
        bossChance: 0
    },
    cave: {
        bossKillsCounter: 0,
        bossChance: 0
    }
};

    player.attributePoints = 0;
    player.skillPoints = 0;

    player.location = "forest";

    player.stats = {
        strength: 5,
        dexterity: 5,
        intelligence: 5,
        endurance: 5,
        luck: 5
    };

    player.inventory = [];

    player.equipment = {
        weapon: null,
        shield: null,
        helmet: null,
        armor: null,
        pants: null,
        boots: null,
        gloves: null,
        ring1: null,
        ring2: null,
        amulet: null,
        talisman: null
    };

    const derived = getDerivedStats();

    player.hp = derived.maxHp;
    player.mana = derived.maxMana;

    console.log("resetPlayer wykonany:", player);
}

    const derived = getDerivedStats(); {

    player.hp = derived.maxHp;
    player.mana = derived.maxMana;
}

function getExpToNextLevel(level) {
    return Math.floor(100 + (level - 1) * 60 + Math.pow(level - 1, 1.3) * 25);
}

function getTotalStats() {
    const stats = {
        strength: player.stats.strength,
        dexterity: player.stats.dexterity,
        intelligence: player.stats.intelligence,
        endurance: player.stats.endurance,
        luck: player.stats.luck
    };

    if (!player.equipment) return stats;

    Object.keys(player.equipment).forEach(slot => {
        const itemId = player.equipment[slot];

        if (!itemId) return;

        const item = items[itemId];

        if (!item) return;

        if (item.strength) stats.strength += item.strength;
        if (item.dexterity) stats.dexterity += item.dexterity;
        if (item.intelligence) stats.intelligence += item.intelligence;
        if (item.endurance) stats.endurance += item.endurance;
        if (item.luck) stats.luck += item.luck;
    });

    return stats;
}

function getDerivedStats() {
    const stats = getTotalStats();

    const generalDamage = stats.strength * 0.3;

    return {
        maxHp: Math.floor(50 + stats.endurance * 10 + (player.level - 1) * 10),
        maxMana: Math.floor(20 + stats.intelligence * 10),

        generalDamage: generalDamage,

        meleeDamage: stats.strength * 1.5 + generalDamage,
        rangedDamage: stats.dexterity * 1.5 + generalDamage,
        magicDamage: stats.intelligence * 1.5 + generalDamage,

        defense: stats.endurance * 0.5,

        dodgeChance: Math.min(
            40,
            stats.dexterity * 0.4
        ),

        critChance: Math.min(
            50,
            stats.luck * 0.4
        ),

        critDamage: 150 + stats.luck * 1,

        lootBonus: stats.luck * 1
    };
}


function getAttack() {
    const derived = getDerivedStats();

    const weaponId = player.equipment.weapon;
    const weapon = weaponId ? items[weaponId] : null;

    if (!weapon) {
        return Math.floor(derived.meleeDamage);
    }

    const weaponDamage = weapon.damage || 0;

    if (weapon.weaponType === "melee") {
        return Math.floor(weaponDamage + derived.meleeDamage);
    }

    if (weapon.weaponType === "ranged") {
        return Math.floor(weaponDamage + derived.rangedDamage);
    }

    if (weapon.weaponType === "magic") {
        return Math.floor(weaponDamage + derived.magicDamage);
    }

    return Math.floor(weaponDamage + derived.meleeDamage);
}

function calculatePlayerDamage() {
    const derived = getDerivedStats();

    let damage = getAttack();

    const critRoll = Math.random() * 100;
    const isCritical = critRoll <= derived.critChance;

    if (isCritical) {
        damage = Math.floor(damage * (derived.critDamage / 100));

        return {
            damage: damage,
            isCritical: true
        };
    }

    return {
        damage: damage,
        isCritical: false
    };
}


function checkLevelUp() {
    while (player.exp >= player.expToNextLevel) {
        player.exp -= player.expToNextLevel;

        player.level++;
        player.attributePoints += 5;

        player.expToNextLevel = getExpToNextLevel(player.level);

        const derived = getDerivedStats();
        player.hp = derived.maxHp;
        player.mana = derived.maxMana;

        if (typeof addCombatLog === "function") {
            addCombatLog("⭐ Awansowałeś na poziom " + player.level + "!");
            addCombatLog("🎁 Otrzymano 5 punktów atrybutów.");
        }

        console.log("LEVEL UP!");
        console.log("Otrzymano 5 punktów atrybutów");
    }
}

function addAttributePoint(statName) {
    if (player.attributePoints <= 0) {
        console.warn("Brak punktów atrybutów");
        return;
    }

    if (!player.stats || player.stats[statName] === undefined) {
        console.warn("Nieznana statystyka:", statName);
        return;
    }

    player.stats[statName]++;
    player.attributePoints--;

    const derived = getDerivedStats();

    if (player.hp > derived.maxHp) {
        player.hp = derived.maxHp;
    }

    if (player.mana > derived.maxMana) {
        player.mana = derived.maxMana;
    }

    saveGame();
    render();
}

function getCurrentLocationProgress() {
    if (!player.locationProgress) {
        player.locationProgress = {};
    }

    if (!player.locationProgress[player.location]) {
        player.locationProgress[player.location] = {
            bossKillsCounter: 0,
            bossChance: 0
        };
    }

    return player.locationProgress[player.location];
}
