function showNotification(message, type = "success") {
    const container = document.getElementById("notification-container");

    if (!container) {
        console.warn("Nie znaleziono kontenera powiadomień.");
        return;
    }

    const notification = document.createElement("div");

    notification.className = `game-notification notification-${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    requestAnimationFrame(() => {
        notification.classList.add("notification-visible");
    });

    setTimeout(() => {
        notification.classList.remove("notification-visible");

        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2500);
}