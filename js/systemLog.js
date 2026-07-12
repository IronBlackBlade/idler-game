function ensureSystemLog() {
    if (!Array.isArray(player.systemLog)) {
        player.systemLog = [];
    }
}

function addSystemLog(message, type = "info") {
    ensureSystemLog();

    player.systemLog.push({
        message: message,
        type: type,
        time: Date.now()
    });

    if (player.systemLog.length > 100) {
        player.systemLog.shift();
    }

    renderSystemLog();
}

function renderSystemLog() {
    const container = document.getElementById("system-log");

    if (!container) {
        return;
    }

    ensureSystemLog();

    container.innerHTML = "";

    if (player.systemLog.length === 0) {
        container.innerHTML = `
            <div class="system-log-empty">
                Brak wydarzeń.
            </div>
        `;

        return;
    }

    const entries = [...player.systemLog].reverse();

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

function clearSystemLog() {
    player.systemLog = [];

    saveGame();
    renderSystemLog();

    if (typeof showNotification === "function") {
        showNotification(
            "Wyczyszczono log postaci.",
            "success"
        );
    }
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