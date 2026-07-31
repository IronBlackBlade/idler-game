const allowedJournalTabs = [
    "bestiary",
    "locations",
    "bosses",
    "professions",
    "achievements"
];

const savedJournalTab =
    localStorage.getItem(
        "idler_journal_tab"
    );

let currentJournalTab =
    allowedJournalTabs.includes(
        savedJournalTab
    )
        ? savedJournalTab
        : "bestiary";



function renderJournal() {
    const tabButtons =
        document.querySelectorAll(
            "[data-journal-tab]"
        );

    const tabPanels =
        document.querySelectorAll(
            "[data-journal-panel]"
        );

    tabButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.journalTab ===
            currentJournalTab
        );
    });

    tabPanels.forEach(panel => {
        panel.hidden =
            panel.dataset.journalPanel !==
            currentJournalTab;
    });

    if (
        currentJournalTab ===
        "bestiary"
    ) {
        renderBestiary();
    }

    if (
        currentJournalTab ===
        "locations"
    ) {
        renderLocationJournal();
    }

    if (
        currentJournalTab ===
        "bosses"
    ) {
        renderBossJournal();
    }

    if (
        currentJournalTab ===
        "achievements"
    ) {
        renderJournalAchievements();
    }

    if (
        currentJournalTab ===
        "professions"
    ) {
        renderJournalProfessions();
    }

}

function openJournalTab(
    tabName
) {
    if (
        !allowedJournalTabs.includes(
            tabName
        )
    ) {
        return;
    }

    currentJournalTab =
        tabName;

    localStorage.setItem(
        "idler_journal_tab",
        tabName
    );

    renderJournal();
}

function openJournal() {
    showScreen(
        "screen-journal"
    );

    renderJournal();
}

renderJournal();

if (
    typeof updateJournalAchievementIndicators ===
        "function"
) {
    updateJournalAchievementIndicators();
}
