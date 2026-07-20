let manaRegenerationIntervalId = null;
let manaRegenerationAccumulator = 0;

const baseManaRegenerationPerSecond = 1;

function getManaRegenerationPerSecond() {
    const potionBonus =
        typeof getActivePotionEffectValue ===
        "function"
            ? getActivePotionEffectValue(
                "mana_regeneration"
            )
            : 0;

    const regenerationMultiplier =
        1 + potionBonus / 100;

    return (
        baseManaRegenerationPerSecond *
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

function getSkillLevel(skillId) {
    if (!player.skills) {
        player.skills = {};
    }

    return player.skills[skillId] || 0;
}

function isSkillMaxLevel(skillId) {
    const skill = skills[skillId];

    if (!skill) {
        return false;
    }

    return getSkillLevel(skillId) >= skill.maxLevel;
}

function isSkillPrerequisiteMet(skill) {
    if (!skill.prerequisite) {
        return true;
    }

    const requiredSkillLevel = getSkillLevel(
        skill.prerequisite.skillId
    );

    return (
        requiredSkillLevel >=
        skill.prerequisite.requiredSkillLevel
    );
}

function canUpgradeSkill(skillId) {
    const skill = skills[skillId];

    if (!skill) {
        return false;
    }

    const currentLevel = getSkillLevel(skillId);

    if (currentLevel >= skill.maxLevel) {
        return false;
    }

    if (player.level < skill.requiredLevel) {
        return false;
    }

    if ((player.skillPoints || 0) < skill.costPerLevel) {
        return false;
    }

    if (!isSkillPrerequisiteMet(skill)) {
        return false;
    }

    return true;
}

function upgradeSkill(skillId) {
    const skill = skills[skillId];

    if (!skill) {
        console.warn(
            "Nie znaleziono umiejętności:",
            skillId
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
        (player.skillPoints || 0) <
        skill.costPerLevel
    ) {
        showSkillError(
            "Nie masz wystarczająco punktów umiejętności."
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
    player.skills[skillId] = currentLevel + 1;

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

/*
 * Sumowanie efektów pasywnych.
 */
function getSkillEffectValue(effectName) {
    if (typeof skills === "undefined") {
        return 0;
    }

    let totalEffect = 0;

    Object.values(skills).forEach(skill => {
        if (!skill.effect) {
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
    return getSkillEffectValue(
        "meleeDamagePercentPerLevel"
    );
}

function getMagicDamageSkillBonus() {
    return getSkillEffectValue(
        "magicDamagePercentPerLevel"
    );
}

function getLootChanceSkillBonus() {
    return getSkillEffectValue(
        "lootChancePercentPerLevel"
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

function getSellPriceSkillBonus() {
    return getSkillEffectValue(
        "sellPricePercentPerLevel"
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

function getSpellManaCost(spell) {
    if (!spell || !spell.effect) {
        return 0;
    }

    const level = getSkillLevel(spell.id);

    const baseManaCost =
        spell.effect.baseManaCost || 0;

    const reductionPerLevel =
        spell.effect.manaCostReductionPerLevel ||
        0;

    return Math.max(
        0,
        Math.floor(
            baseManaCost -
            reductionPerLevel *
            Math.max(0, level - 1)
        )
    );
}

function getSpellCooldownMilliseconds(spell) {
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

    const cooldownSeconds = Math.max(
        1,
        baseCooldown -
        reductionPerLevel *
        Math.max(0, level - 1)
    );

    return cooldownSeconds * 1000;
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

    return false;
}

function castFireball(spell, manaCost) {
    const level = getSkillLevel(spell.id);
    const derived = getDerivedStats();

    const baseMultiplier =
        spell.effect.baseDamageMultiplier || 1;

    const multiplierPerLevel =
        spell.effect.damageMultiplierPerLevel ||
        0;

    const multiplier =
        baseMultiplier +
        multiplierPerLevel *
        Math.max(0, level - 1);

    const magicSkillBonus =
        typeof getMagicDamageSkillBonus ===
        "function"
            ? getMagicDamageSkillBonus()
            : 0;

    let damage =
        derived.magicDamage * multiplier;

damage *=
    1 + magicSkillBonus / 100;

if (
    typeof applySpellDamagePotionBonus ===
    "function"
) {
    damage =
        applySpellDamagePotionBonus(
            damage
        );
}

damage = Math.max(
    1,
    Math.floor(damage)
);
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

    return true;
}

function castFrostBolt(spell, manaCost) {
    const level = getSkillLevel(spell.id);
    const derived = getDerivedStats();

    const baseMultiplier =
        spell.effect.baseDamageMultiplier || 1;

    const multiplierPerLevel =
        spell.effect.damageMultiplierPerLevel || 0;

    const multiplier =
        baseMultiplier +
        multiplierPerLevel * Math.max(0, level - 1);

    const magicSkillBonus =
        typeof getMagicDamageSkillBonus === "function"
            ? getMagicDamageSkillBonus()
            : 0;

    let damage =
        derived.magicDamage * multiplier;

damage *=
    1 + magicSkillBonus / 100;

if (
    typeof applySpellDamagePotionBonus ===
    "function"
) {
    damage =
        applySpellDamagePotionBonus(
            damage
        );
}

damage = Math.max(
    1,
    Math.floor(damage)
);

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
            derived.maxHp * healingPercent / 100
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
        baseReduction +
        reductionPerLevel *
        Math.max(0, level - 1)
    );
}

startManaRegeneration();