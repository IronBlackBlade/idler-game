
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

function updateActiveMenuButton(
    screenId
) {
    const screenToMenuSection = {
        "screen-hunting":
            "hunting",

        "screen-combat":
            "hunting",

        "screen-mining-locations":
            "mining",

        "screen-mining-area":
            "mining",

        "screen-herbalism-locations":
            "herbalism",

        "screen-alchemy":
            "alchemy",

        "screen-hero":
            "hero",

        "screen-shop":
            "shop",

        "screen-crafting":
            "crafting",

        "screen-quests":
            "quests",

        "screen-journal":
            "journal",

        "screen-settings":
            "settings"
    };

    const activeSection =
        screenToMenuSection[
            screenId
        ];

    const menuButtons =
        document.querySelectorAll(
            "#menu > button[data-menu-section]"
        );

    menuButtons.forEach(
        button => {
            const isActive =
                button.dataset
                    .menuSection ===
                activeSection;

            button.classList.toggle(
                "menu-active",
                isActive
            );

            if (isActive) {
                button.setAttribute(
                    "aria-current",
                    "page"
                );
            } else {
                button.removeAttribute(
                    "aria-current"
                );
            }
        }
    );
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

    updateActiveMenuButton(
        screenId
    );

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

if (
    screenId ===
    "screen-journal" &&
    typeof renderJournal ===
        "function"
) {
    renderJournal();
}

}

function refreshCombatInterface() {
    renderPlayerHud();
    renderCombat();

    if (
        typeof renderCombatSpellSlots ===
        "function"
    ) {
        renderCombatSpellSlots();
    }

    if (
        typeof renderCombatLog ===
        "function"
    ) {
        renderCombatLog();
    }

    if (
        typeof renderSystemLog ===
        "function"
    ) {
        renderSystemLog();
    }

    if (
        typeof renderActivityHud ===
        "function"
    ) {
        renderActivityHud();
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

if (
    typeof updateQuestMenuHighlight ===
        "function"
) {
    updateQuestMenuHighlight();
}

}