loadGame();

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

if (isFighting || player.isFighting) {
    startFight();
}

startAutoSave();

setInterval(() => {
    regenerateMana(1);
    renderPlayerHud();
}, 1000);