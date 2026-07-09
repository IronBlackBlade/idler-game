const quests = [
    {
        id: "kill_beetles_1",
        title: "Pierwsze polowanie",
        description: "Pokonaj 5 chrząszczy.",
        targetEnemyName: "Chrząszcz",
        requiredKills: 5,
        currentKills: 0,
        rewardGold: 20,
        rewardExp: 25,
        completed: false,
        claimed: false
    },
    {
        id: "kill_sheep_1",
        title: "Wełniany problem",
        description: "Pokonaj 5 owiec.",
        targetEnemyName: "Owca",
        requiredKills: 5,
        currentKills: 0,
        rewardGold: 25,
        rewardExp: 35,
        completed: false,
        claimed: false
    },
    {
        id: "kill_rats_1",
        title: "Szczury w lesie",
        description: "Pokonaj 6 olbrzymich szczurów.",
        targetEnemyName: "Olbrzymi szczur",
        requiredKills: 6,
        currentKills: 0,
        rewardGold: 40,
        rewardExp: 55,
        completed: false,
        claimed: false
    },
    {
        id: "kill_wolves_1",
        title: "Młode wilki",
        description: "Pokonaj 6 młodych wilków.",
        targetEnemyName: "Młody wilk",
        requiredKills: 6,
        currentKills: 0,
        rewardGold: 60,
        rewardExp: 80,
        completed: false,
        claimed: false
    },
    {
        id: "kill_goblins_1",
        title: "Goblińskie kłopoty",
        description: "Pokonaj 8 goblinów.",
        targetEnemyName: "Goblin",
        requiredKills: 8,
        currentKills: 0,
        rewardGold: 100,
        rewardExp: 130,
        completed: false,
        claimed: false
    },
    {
        id: "kill_forest_boss_1",
        title: "Władca lasu",
        description: "Pokonaj Gobliniego Herszta.",
        targetEnemyName: "👑 Goblini Herszt",
        requiredKills: 1,
        currentKills: 0,
        rewardGold: 250,
        rewardExp: 300,
        completed: false,
        claimed: false
    },

{
    id: "kill_bats_1",
    title: "Cień pod sklepieniem",
    description: "Pokonaj 8 nietoperzy.",
    targetEnemyName: "Nietoperz",
    requiredKills: 8,
    currentKills: 0,
    rewardGold: 120,
    rewardExp: 180,
    completed: false,
    claimed: false
},
{
    id: "kill_cave_spiders_1",
    title: "Pajęcza sieć",
    description: "Pokonaj 8 pająków jaskiniowych.",
    targetEnemyName: "Pająk jaskiniowy",
    requiredKills: 8,
    currentKills: 0,
    rewardGold: 150,
    rewardExp: 220,
    completed: false,
    claimed: false
},
{
    id: "kill_skeletons_1",
    title: "Kości nie kłamią",
    description: "Pokonaj 10 szkieletów.",
    targetEnemyName: "Szkielet",
    requiredKills: 10,
    currentKills: 0,
    rewardGold: 200,
    rewardExp: 300,
    completed: false,
    claimed: false
},
{
    id: "kill_kobolds_1",
    title: "Problem z koboldami",
    description: "Pokonaj 10 koboldów.",
    targetEnemyName: "Kobold",
    requiredKills: 10,
    currentKills: 0,
    rewardGold: 260,
    rewardExp: 380,
    completed: false,
    claimed: false
},
{
    id: "kill_stone_golems_1",
    title: "Kamienne zagrożenie",
    description: "Pokonaj 6 kamiennych golemów.",
    targetEnemyName: "Kamienny golem",
    requiredKills: 6,
    currentKills: 0,
    rewardGold: 320,
    rewardExp: 480,
    completed: false,
    claimed: false
},
{
    id: "kill_cave_boss_1",
    title: "Król pod ziemią",
    description: "Pokonaj Króla Koboldów.",
    targetEnemyName: "👑 Król Koboldów",
    requiredKills: 1,
    currentKills: 0,
    rewardGold: 700,
    rewardExp: 900,
    completed: false,
    claimed: false
}

];

function updateQuests(enemyName) {
    quests.forEach(quest => {
        if (quest.claimed) return;
        if (quest.completed) return;

        if (quest.targetEnemyName !== enemyName) return;

        quest.currentKills++;

        if (quest.currentKills >= quest.requiredKills) {
            quest.currentKills = quest.requiredKills;
            quest.completed = true;

            if (typeof addCombatLog === "function") {
                addCombatLog("📜 Ukończono zadanie: " + quest.title + ".");
            }
        }
    });

    saveGame();
    renderQuests();
}

function claimQuestReward(questId) {
    const quest = quests.find(quest => quest.id === questId);

    if (!quest) {
        console.warn("Nie znaleziono zadania:", questId);
        return;
    }

    if (!quest.completed) {
        console.warn("Zadanie nie jest ukończone:", quest.title);
        return;
    }

    if (quest.claimed) {
        console.warn("Nagroda została już odebrana:", quest.title);
        return;
    }

    player.gold += quest.rewardGold;
    player.exp += quest.rewardExp;

    quest.claimed = true;

    checkLevelUp();

    if (typeof addCombatLog === "function") {
        addCombatLog("🎁 Odebrano nagrodę za zadanie: " + quest.title + ".");
        addCombatLog("⭐ +" + quest.rewardExp + " EXP, +" + quest.rewardGold + " złota.");
    }

    saveGame();
    render();
}

function resetQuests() {
    quests.forEach(quest => {
        quest.currentKills = 0;
        quest.completed = false;
        quest.claimed = false;
    });
}

function renderQuests() {
    const container = document.getElementById("quests");
    if (!container) return;

    container.innerHTML = "";

    const sortedQuests = [...quests].sort((a, b) => {
        const getQuestOrder = (quest) => {
            if (quest.completed && !quest.claimed) return 1;
            if (!quest.completed && !quest.claimed) return 2;
            if (quest.claimed) return 3;
            return 4;
        };

        return getQuestOrder(a) - getQuestOrder(b);
    });

    sortedQuests.forEach(quest => {
        const div = document.createElement("div");
        div.className = "quest";

        if (quest.completed && !quest.claimed) {
            div.classList.add("quest-completed");
        }

        if (quest.claimed) {
            div.classList.add("quest-claimed");
        }

        const questName = quest.name || quest.title || "Zadanie";
        const questDescription = quest.description || "";

        const progress =
    quest.progress ??
    quest.current ??
    quest.count ??
    quest.currentKills ??
    quest.kills ??
    0;

const required =
    quest.required ??
    quest.target ??
    quest.requiredAmount ??
    quest.requiredKills ??
    quest.targetKills ??
    1;

        const rewardExp = quest.rewardExp ?? quest.expReward ?? 0;
        const rewardGold = quest.rewardGold ?? quest.goldReward ?? 0;

        const progressPercent = Math.min(100, (progress / required) * 100);

        let statusText = "W trakcie";
        let buttonHtml = "";

        if (quest.completed && !quest.claimed) {
            statusText = "Gotowe";
            buttonHtml = `<button onclick="claimQuestReward('${quest.id}')">Odbierz nagrodę</button>`;
        }

        if (quest.claimed) {
            statusText = "Ukończone ✅";
        }

        div.innerHTML = `
            <h3>${questName}</h3>

            <p>${questDescription}</p>

            <div class="quest-progress-text">
                <span>${statusText}</span>
                <strong>${progress}/${required}</strong>
            </div>

            <div class="quest-progress-bar">
                <div class="quest-progress-fill" style="width: ${progressPercent}%"></div>
            </div>

            <div class="quest-reward">
                <span>⭐ ${rewardExp} EXP</span>
                <span>💰 ${rewardGold} złota</span>
            </div>

            ${buttonHtml}
        `;

        container.appendChild(div);
    });
}