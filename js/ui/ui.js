
function isGameScreenVisible(
    screenId
) {
    const screen =
        document.getElementById(
            screenId
        );

    if (!screen) {
        return false;
    }

    return (
        window.getComputedStyle(
            screen
        ).display !== "none"
    );
}

function refreshShopView() {
    if (
        !isGameScreenVisible(
            "screen-shop"
        )
    ) {
        return;
    }

    if (
        typeof renderShop ===
            "function"
    ) {
        renderShop();
    }
}

function refreshCraftingView() {
    if (
        !isGameScreenVisible(
            "screen-crafting"
        )
    ) {
        return;
    }

    if (
        typeof renderCrafting ===
            "function"
    ) {
        renderCrafting();
    }
}

function refreshQuestsView() {
    if (
        !isGameScreenVisible(
            "screen-quests"
        )
    ) {
        return;
    }

    if (
        typeof renderQuests ===
            "function"
    ) {
        renderQuests();
    }
}

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

localStorage.setItem(
    "idler_current_screen",
    screenId
);

render();

if (
    screenId ===
        "screen-shop" &&
    typeof renderShop ===
        "function"
) {
    renderShop();
}

if (
    screenId ===
        "screen-crafting" &&
    typeof renderCrafting ===
        "function"
) {
    renderCrafting();
}

if (
    screenId === "screen-hero" &&
    typeof refreshCurrentHeroTab ===
        "function"
) {
    refreshCurrentHeroTab();
}

if (
    screenId ===
        "screen-quests" &&
    typeof renderQuests ===
        "function"
) {
    renderQuests();
}

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


    if (
        typeof renderCombatLog ===
        "function"
    ) {
        renderCombatLog();
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
    
    if (
    typeof renderHerbalism ===
        "function"
) {
    renderHerbalism();
}

if (
    typeof renderAlchemy ===
        "function"
) {
    renderAlchemy();
}

}