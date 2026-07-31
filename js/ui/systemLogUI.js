const allowedSystemLogFilters = [
    "all",
    "activities",
    "crafting",
    "character"
];

const savedSystemLogFilter =
    localStorage.getItem(
        "idler_system_log_filter"
    );

let currentSystemLogFilter =
    allowedSystemLogFilters.includes(
        savedSystemLogFilter
    )
        ? savedSystemLogFilter
        : "all";

function getSystemLogEntryCategory(entry) {
    const type = String(
        entry?.type || "info"
    ).toLowerCase();

    const activityPrefixes = [
        "mining",
        "herbalism",
        "fishing"
    ];
    const activityTypes = [
        "boss",
        "chest",
        "location",
        "offline"
    ];

    if (
        activityPrefixes.some(prefix => {
            return (
                type === prefix ||
                type.startsWith(prefix + "-")
            );
        }) ||
        activityTypes.includes(type)
    ) {
        return "activities";
    }

    const craftingPrefixes = [
        "alchemy"
    ];
    const craftingTypes = [
        "crafting",
        "cooking",
        "recipe",
        "potion"
    ];

    if (
        craftingPrefixes.some(prefix => {
            return (
                type === prefix ||
                type.startsWith(prefix + "-")
            );
        }) ||
        craftingTypes.includes(type)
    ) {
        return "crafting";
    }

    return "character";
}

function setSystemLogFilter(filter) {
    if (
        !allowedSystemLogFilters.includes(
            filter
        )
    ) {
        return;
    }

    currentSystemLogFilter = filter;

    localStorage.setItem(
        "idler_system_log_filter",
        filter
    );

    renderSystemLog();
}

function updateSystemLogFilters() {
    const counts = {
        all: player.systemLog.length,
        activities: 0,
        crafting: 0,
        character: 0
    };

    player.systemLog.forEach(entry => {
        const category =
            getSystemLogEntryCategory(
                entry
            );

        counts[category] += 1;
    });

    document
        .querySelectorAll(
            ".system-log-filter"
        )
        .forEach(button => {
            const filter =
                button.dataset
                    .systemLogFilter;
            const isActive =
                filter ===
                currentSystemLogFilter;

            button.classList.toggle(
                "active",
                isActive
            );
            button.setAttribute(
                "aria-pressed",
                isActive ? "true" : "false"
            );
        });

    document
        .querySelectorAll(
            "[data-system-log-count]"
        )
        .forEach(counter => {
            const filter =
                counter.dataset
                    .systemLogCount;

            counter.textContent =
                counts[filter] || 0;
        });
}

function renderSystemLog() {
    const container = document.getElementById("system-log");

    if (!container) {
        return;
    }

    ensureSystemLog();

    updateSystemLogFilters();

    container.innerHTML = "";

    if (player.systemLog.length === 0) {
        container.innerHTML = `
            <div class="system-log-empty">
                Brak wydarzeń.
            </div>
        `;

        return;
    }

    const entries = player.systemLog
        .filter(entry => {
            return (
                currentSystemLogFilter ===
                    "all" ||
                getSystemLogEntryCategory(
                    entry
                ) ===
                    currentSystemLogFilter
            );
        })
        .reverse();

    if (entries.length === 0) {
        container.innerHTML = `
            <div class="system-log-empty">
                Brak wydarzeń w tej kategorii.
            </div>
        `;

        return;
    }

    entries.forEach(entry => {
        const div = document.createElement("div");

        div.className =
            "system-log-entry system-log-" +
            (entry.type || "info");

        const date = new Date(entry.time || Date.now());

        const timeText = date.toLocaleTimeString("pl-PL", {
            hour: "2-digit",
            minute: "2-digit"
        });

        div.innerHTML = `
            <span class="system-log-time">
                ${timeText}
            </span>

            <span class="system-log-message">
                ${entry.message}
            </span>
        `;

        container.appendChild(div);
    });
}

function toggleMobileSystemLog() {
    const panel = document.getElementById("system-log-panel");
    const toggleButton = document.getElementById(
        "system-log-toggle-button"
    );

    if (!panel) {
        return;
    }

    const isOpen = panel.classList.toggle(
        "system-log-mobile-open"
    );

    if (toggleButton) {
        toggleButton.textContent = isOpen ? "▼" : "▲";
    }

    localStorage.setItem(
        "idler_mobile_system_log_open",
        isOpen ? "true" : "false"
    );
}

function restoreMobileSystemLogState() {
    const panel = document.getElementById("system-log-panel");
    const toggleButton = document.getElementById(
        "system-log-toggle-button"
    );

    if (!panel) {
        return;
    }

    const savedState = localStorage.getItem(
        "idler_mobile_system_log_open"
    );

    const shouldBeOpen = savedState === "true";

    panel.classList.toggle(
        "system-log-mobile-open",
        shouldBeOpen
    );

    if (toggleButton) {
        toggleButton.textContent = shouldBeOpen
            ? "▼"
            : "▲";
    }
}
