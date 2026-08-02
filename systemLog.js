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
