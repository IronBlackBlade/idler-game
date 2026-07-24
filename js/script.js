loadGame();

if (
    typeof checkJournalAchievements ===
        "function"
) {
    const initialAchievementResult =
        checkJournalAchievements();

    if (
        initialAchievementResult
            .unlockedCount > 0 &&
        typeof saveGame ===
            "function"
    ) {
        saveGame();
    }
}

if (
    typeof startActivityHudUpdates ===
    "function"
) {
    startActivityHudUpdates();
}

if (typeof restoreMobileSystemLogState === "function") {
    restoreMobileSystemLogState();
}

renderLocations();
renderQuests();
render();

const savedScreen =
    localStorage.getItem("idler_current_screen");

if (
    savedScreen &&
    document.getElementById(savedScreen)
) {
    showScreen(savedScreen);
} else {
    showScreen("screen-hunting");
}


startAutoSave();

setInterval(() => {
    regenerateMana(1);
    renderPlayerHud();

    if (
        typeof renderCombat ===
            "function"
    ) {
        renderCombat();
    }

    if (
        typeof refreshLocationCooldownButtons ===
            "function"
    ) {
        refreshLocationCooldownButtons();
    }
}, 1000);