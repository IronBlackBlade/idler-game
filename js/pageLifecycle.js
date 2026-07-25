const BACKGROUND_RELOAD_DELAY_MS =
    10000;

window.idlerBackgroundStartedAt = 0;
window.idlerShouldReloadAfterBackground =
    false;
window.idlerIsReloadingAfterBackground =
    false;

function saveGameBeforeBackground() {
    if (
        window
            .idlerShouldReloadAfterBackground
    ) {
        return;
    }

    if (
        typeof saveGame ===
        "function"
    ) {
        saveGame();
    }

    window.idlerBackgroundStartedAt =
        Date.now();

    window
        .idlerShouldReloadAfterBackground =
        true;
}

function restoreGameAfterBackground() {
    if (
        !window
            .idlerShouldReloadAfterBackground
    ) {
        return;
    }

    const backgroundDuration =
        Math.max(
            0,
            Date.now() -
            Number(
                window
                    .idlerBackgroundStartedAt
            )
        );

    window
        .idlerShouldReloadAfterBackground =
        false;

    window.idlerBackgroundStartedAt = 0;

    if (
        backgroundDuration <
        BACKGROUND_RELOAD_DELAY_MS
    ) {
        return;
    }

    window.idlerIsReloadingAfterBackground =
        true;

    window.location.reload();
}

document.addEventListener(
    "visibilitychange",
    () => {
        if (
            document.visibilityState ===
            "hidden"
        ) {
            saveGameBeforeBackground();
            return;
        }

        if (
            document.visibilityState ===
            "visible"
        ) {
            restoreGameAfterBackground();
        }
    }
);

window.addEventListener(
    "pagehide",
    () => {
        if (
            window
                .idlerIsReloadingAfterBackground
        ) {
            return;
        }

        saveGameBeforeBackground();
    }
);

window.addEventListener(
    "pageshow",
    () => {
        if (
            document.visibilityState ===
            "visible"
        ) {
            restoreGameAfterBackground();
        }
    }
);