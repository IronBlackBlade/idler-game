
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

const menuCategoryStorageKey =
    "idler_menu_categories";

const defaultMenuCategoryState = {
    activities: true,
    crafting: false,
    character: false
};

function getSavedMenuCategoryState() {
    try {
        const savedState = JSON.parse(
            localStorage.getItem(
                menuCategoryStorageKey
            ) || "{}"
        );

        return {
            ...defaultMenuCategoryState,
            ...savedState
        };
    } catch (error) {
        return {
            ...defaultMenuCategoryState
        };
    }
}

function saveMenuCategoryState() {
    const state = {};

    document.querySelectorAll(
        "#menu [data-menu-category]"
    ).forEach(category => {
        state[
            category.dataset.menuCategory
        ] = !category.classList.contains(
            "is-collapsed"
        );
    });

    localStorage.setItem(
        menuCategoryStorageKey,
        JSON.stringify(state)
    );
}

function setMenuCategoryExpanded(
    categoryId,
    expanded,
    shouldSave = true
) {
    const category = document.querySelector(
        '#menu [data-menu-category="' +
        categoryId +
        '"]'
    );

    if (!category) {
        return;
    }

    const toggle = category.querySelector(
        ".menu-category-toggle"
    );
    const items = category.querySelector(
        ".menu-category-items"
    );

    category.classList.toggle(
        "is-collapsed",
        !expanded
    );

    if (toggle) {
        toggle.setAttribute(
            "aria-expanded",
            String(expanded)
        );
    }

    if (items) {
        items.hidden = !expanded;
    }

    if (shouldSave) {
        saveMenuCategoryState();
    }
}

function toggleMenuCategory(categoryId) {
    const category = document.querySelector(
        '#menu [data-menu-category="' +
        categoryId +
        '"]'
    );

    if (!category) {
        return;
    }

    setMenuCategoryExpanded(
        categoryId,
        category.classList.contains(
            "is-collapsed"
        )
    );
}

function initializeMenuCategories() {
    const savedState =
        getSavedMenuCategoryState();

    document.querySelectorAll(
        "#menu [data-menu-category]"
    ).forEach(category => {
        const categoryId =
            category.dataset.menuCategory;

        setMenuCategoryExpanded(
            categoryId,
            savedState[categoryId] !== false,
            false
        );
    });
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

        "screen-fishing-locations":
            "fishing",

        "screen-alchemy":
            "alchemy",

        "screen-cooking":
            "cooking",

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
            "#menu button[data-menu-section]"
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

                const category =
                    button.closest(
                        "[data-menu-category]"
                    );

                if (category) {
                    setMenuCategoryExpanded(
                        category.dataset
                            .menuCategory,
                        true
                    );
                }
            } else {
                button.removeAttribute(
                    "aria-current"
                );
            }
        }
    );

    document.querySelectorAll(
        "#menu [data-menu-category]"
    ).forEach(category => {
        category.classList.toggle(
            "has-active-item",
            Boolean(
                category.querySelector(
                    ".menu-active"
                )
            )
        );
    });
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
        typeof renderFishing ===
        "function"
    ) {
        renderFishing();
    }

    if (
        typeof renderAlchemy ===
        "function"
    ) {
        renderAlchemy();
    }

    if (
        typeof renderCooking ===
        "function"
    ) {
        renderCooking();
    }

    if (
        typeof renderProfessionToolContextPanels ===
        "function"
    ) {
        renderProfessionToolContextPanels();
    }

if (
    typeof updateQuestMenuHighlight ===
        "function"
) {
    updateQuestMenuHighlight();
}

}
