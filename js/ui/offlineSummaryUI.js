function formatOfflineSummaryDuration(
    durationMilliseconds
) {
    const totalSeconds = Math.max(
        0,
        Math.floor(
            (
                Number(durationMilliseconds) ||
                0
            ) / 1000
        )
    );

    const days =
        Math.floor(totalSeconds / 86400);

    const hours =
        Math.floor(
            totalSeconds % 86400 / 3600
        );

    const minutes =
        Math.floor(
            totalSeconds % 3600 / 60
        );

    const seconds =
        totalSeconds % 60;

    const parts = [];

    if (days > 0) {
        parts.push(days + " d");
    }

    if (hours > 0) {
        parts.push(hours + " godz.");
    }

    if (minutes > 0) {
        parts.push(minutes + " min");
    }

    if (
        parts.length === 0 ||
        (
            days === 0 &&
            hours === 0 &&
            seconds > 0
        )
    ) {
        parts.push(seconds + " sek.");
    }

    return parts.join(" ");
}

function formatOfflineSummaryValue(
    value
) {
    const numericValue =
        Number(value);

    if (Number.isFinite(numericValue)) {
        return numericValue.toLocaleString(
            "pl-PL"
        );
    }

    return String(value ?? "");
}

function getOfflineSummaryItemName(
    itemData
) {
    if (itemData?.name) {
        return itemData.name;
    }

    if (
        itemData?.itemId &&
        typeof items !== "undefined"
    ) {
        return (
            items[itemData.itemId]?.name ||
            itemData.itemId
        );
    }

    return (
        itemData?.itemId ||
        "Nieznany przedmiot"
    );
}

function createOfflineSummaryElement(
    tagName,
    className,
    textContent
) {
    const element =
        document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    if (textContent !== undefined) {
        element.textContent =
            textContent;
    }

    return element;
}

function renderOfflineSummarySection(
    section
) {
    const sectionElement =
        createOfflineSummaryElement(
            "section",
            "offline-summary-section"
        );

    const titleElement =
        createOfflineSummaryElement(
            "h3",
            "offline-summary-section-title",
            (
                section?.icon || "🌙"
            ) +
            " " +
            (
                section?.title ||
                "Postęp offline"
            )
        );

    sectionElement.appendChild(
        titleElement
    );

    const stats =
        Array.isArray(section?.stats)
            ? section.stats
            : [];

    if (stats.length > 0) {
        const statsGrid =
            createOfflineSummaryElement(
                "div",
                "offline-summary-stat-grid"
            );

        stats.forEach(stat => {
            const statElement =
                createOfflineSummaryElement(
                    "div",
                    "offline-summary-stat"
                );

            statElement.append(
                createOfflineSummaryElement(
                    "span",
                    "",
                    stat.label || ""
                ),

                createOfflineSummaryElement(
                    "strong",
                    "",
                    (
                        stat.prefix || ""
                    ) +
                    formatOfflineSummaryValue(
                        stat.value
                    )
                )
            );

            statsGrid.appendChild(
                statElement
            );
        });

        sectionElement.appendChild(
            statsGrid
        );
    }

    const summaryItems =
        Array.isArray(section?.items)
            ? section.items.filter(
                item => {
                    return (
                        Number(
                            item?.quantity
                        ) > 0
                    );
                }
            )
            : [];

    if (summaryItems.length > 0) {
        const itemsGrid =
            createOfflineSummaryElement(
                "div",
                "offline-summary-items"
            );

        summaryItems.forEach(item => {
            const itemElement =
                createOfflineSummaryElement(
                    "div",
                    "offline-summary-item"
                );

            itemElement.append(
                createOfflineSummaryElement(
                    "span",
                    "",
                    getOfflineSummaryItemName(
                        item
                    )
                ),

                createOfflineSummaryElement(
                    "strong",
                    "",
                    "+" +
                    formatOfflineSummaryValue(
                        item.quantity
                    )
                )
            );

            itemsGrid.appendChild(
                itemElement
            );
        });

        sectionElement.appendChild(
            itemsGrid
        );
    }

    return sectionElement;
}

function showOfflineSummary(summary) {
    const overlay =
        document.getElementById(
            "offline-summary-overlay"
        );

    const durationElement =
        document.getElementById(
            "offline-summary-duration"
        );

    const contentElement =
        document.getElementById(
            "offline-summary-content"
        );

    const continueButton =
        document.getElementById(
            "offline-summary-continue-button"
        );

    const sections =
        Array.isArray(summary?.sections)
            ? summary.sections.filter(Boolean)
            : [];

    if (
        !overlay ||
        !durationElement ||
        !contentElement ||
        sections.length === 0
    ) {
        return false;
    }

    durationElement.textContent =
        "Nieobecność: " +
        formatOfflineSummaryDuration(
            summary.durationMilliseconds
        );

    contentElement.replaceChildren(
        ...sections.map(
            renderOfflineSummarySection
        )
    );

    overlay.hidden = false;

    overlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "offline-summary-open"
    );

    if (continueButton) {
        continueButton.focus();
    }

    return true;
}

function closeOfflineSummary() {
    const overlay =
        document.getElementById(
            "offline-summary-overlay"
        );

    if (!overlay) {
        return;
    }

    overlay.hidden = true;

    overlay.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "offline-summary-open"
    );
}

function initializeOfflineSummaryUI() {
    const overlay =
        document.getElementById(
            "offline-summary-overlay"
        );

    const continueButton =
        document.getElementById(
            "offline-summary-continue-button"
        );

    if (continueButton) {
        continueButton.addEventListener(
            "click",
            closeOfflineSummary
        );
    }

    document.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Escape" &&
                overlay &&
                !overlay.hidden
            ) {
                closeOfflineSummary();
            }
        }
    );
}

initializeOfflineSummaryUI();