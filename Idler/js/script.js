loadGame();

renderLocations();
renderQuests();
render();

const savedScreen = localStorage.getItem("idler_current_screen");

if (savedScreen && document.getElementById(savedScreen)) {
    showScreen(savedScreen);
} else {
    showScreen("screen-hunting");
}

if (player.isFighting) {
    startFight();
}

startAutoSave();