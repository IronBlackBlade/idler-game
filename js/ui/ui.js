function showScreen(screenId) {
    const screens = document.querySelectorAll(".screen");

    screens.forEach(screen => {
        screen.style.display = "none";
    });

    const selectedScreen = document.getElementById(screenId);

    if (!selectedScreen) {
        console.error("Nie znaleziono ekranu:", screenId);
        return;
    }

    selectedScreen.style.display = "flex";

    localStorage.setItem("idler_current_screen", screenId);

    render();
}

function render() {
    renderPlayerHud();
    renderCombat();

    if (
        typeof renderCombatSpellSlots ===
        "function"
    ) {
        renderCombatSpellSlots();
    }

    renderHero();
    renderInventory();
    renderEquipmentSlots();

    if (typeof renderQuests === "function") {
        renderQuests();
    }

    if (typeof renderLocations === "function") {
        renderLocations();
    }

    if (
        typeof renderCombatLog ===
        "function"
    ) {
        renderCombatLog();
    }

    if (typeof renderShop === "function") {
        renderShop();
    }

    if (
        typeof renderCrafting ===
        "function"
    ) {
        renderCrafting();
    }

    if (typeof renderSkills === "function") {
        renderSkills();
    }

    if (typeof renderSystemLog === "function") {
        renderSystemLog();
    }
    
    if (
    typeof renderActivityHud ===
    "function"
) {
    renderActivityHud();
}

    if (typeof renderMining === "function") {
        renderMining();
    }
    
}