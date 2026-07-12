const player = {
    hp: 100,
    mana: 50,

    gold: 0,
    exp: 0,
    expToNextLevel: 100,
    level: 1,
    attributePoints: 0,
    skillPoints: 0,

    skills: {},
    systemLog: [],

selectedSpells: {
    offensive: null,
    defensive: null
},

spellCooldowns: {},

activeEffects: {
    arcaneBarrierUntil: 0
},

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

    mining: {
        level: 1,
        exp: 0,
        expToNextLevel: 100,
        isMining: false,
        selectedAreaId: "upper_shaft",
        cycleStartedAt: 0,
        cycleDurationMs: 0,
        lastResult: null
    },

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
player.level = 1;
player.expToNextLevel = 100;
player.systemLog = [];

player.mining = {
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    isMining: false,
    selectedAreaId: "upper_shaft",
    cycleStartedAt: 0,
    cycleDurationMs: 0,
    lastResult: null
};

    player.isFighting = false;
    player.unlockedRecipes = [];

    player.bossKillsCounter = 0;
    player.bossChance = 0;
    player.isBossFight = false;

    player.skills = {};

player.selectedSpells = {
    offensive: null,
    defensive: null
};

player.spellCooldowns = {};

player.activeEffects = {
    arcaneBarrierUntil: 0
};

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

    return {
        maxHp: Math.floor(
            50 + stats.endurance * 10 + (player.level - 1) * 10
        ),

        maxMana: Math.floor(
            20 + stats.intelligence * 10
        ),

        generalDamage: 0,

        meleeDamage: stats.strength * 1.8,
        rangedDamage: stats.dexterity * 1.8,
        magicDamage: stats.intelligence * 1.8,

        defense: stats.endurance * 0.5,

        dodgeChance: Math.min(
            40,
            stats.dexterity * 0.4
        ),

        critChance: Math.min(
            50,
            stats.luck * 0.4
        ),

        critDamage: 150 + stats.luck,

        lootBonus: stats.luck
    };
}

function getAttack() {
    const derived = getDerivedStats();

    const weaponId = player.equipment.weapon;
    const weapon = weaponId ? items[weaponId] : null;

    if (!weapon) {
        const meleeBonus =
            typeof getMeleeDamageSkillBonus === "function"
                ? getMeleeDamageSkillBonus()
                : 0;

        const baseDamage = derived.meleeDamage;

        return Math.floor(
            baseDamage * (1 + meleeBonus / 100)
        );
    }

    const weaponDamage = weapon.damage || 0;

    if (weapon.weaponType === "melee") {
        const meleeBonus =
            typeof getMeleeDamageSkillBonus === "function"
                ? getMeleeDamageSkillBonus()
                : 0;

        const baseDamage =
            weaponDamage + derived.meleeDamage;

        return Math.floor(
            baseDamage * (1 + meleeBonus / 100)
        );
    }

    if (weapon.weaponType === "ranged") {
        return Math.floor(
            weaponDamage + derived.rangedDamage
        );
    }

    if (weapon.weaponType === "magic") {
        const magicBonus =
            typeof getMagicDamageSkillBonus === "function"
                ? getMagicDamageSkillBonus()
                : 0;

        const baseDamage =
            weaponDamage + derived.magicDamage;

        return Math.floor(
            baseDamage * (1 + magicBonus / 100)
        );
    }

    return Math.floor(
        weaponDamage + derived.meleeDamage
    );
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
        player.skillPoints += 1;

        player.expToNextLevel = getExpToNextLevel(player.level);

        const derived = getDerivedStats();
        player.hp = derived.maxHp;
        player.mana = derived.maxMana;

if (typeof addSystemLog === "function") {
    addSystemLog(
        "⭐ Awansowano na poziom " +
        player.level +
        ". Otrzymano 5 punktów atrybutów i 1 punkt umiejętności.",
        "level"
    );
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

function regenerateMana(amount = 1) {
    const derived = getDerivedStats();

    player.mana = Math.min(
        derived.maxMana,
        player.mana + amount
    );
}