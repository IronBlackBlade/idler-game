function renderCraftingActivity(container) {

  if (
    typeof getActiveCraftingQueueJob !==
    "function"
  ) {
    return;
  }

  const job =
    getActiveCraftingQueueJob();

  if (!job) {
    return;
  }

  const recipe = getCraftingRecipeById(job.recipeId);

  if (!recipe) {
    return;
  }

  const resultItem = items[recipe.resultItemId];
  const resultName = resultItem?.name || recipe.name;
  const isToolUpgrade =
    typeof isProfessionToolUpgradeRecipe === "function" &&
    isProfessionToolUpgradeRecipe(recipe);
  const currentCraftNumber = Math.min(
    job.totalCraftCount,
    job.completedCraftCount + 1,
  );
  const progress =
    typeof getCraftingQueueProgressPercent ===
      "function"
      ? getCraftingQueueProgressPercent()
      : 0;
  const remainingSeconds =
    typeof getCraftingQueueRemainingSeconds ===
      "function"
      ? getCraftingQueueRemainingSeconds()
      : 0;

  const activity = document.createElement("section");
  activity.className = "crafting-activity";
  activity.classList.toggle(
    "is-tool-upgrade",
    isToolUpgrade,
  );
  activity.dataset.craftingActivity = "true";

  activity.innerHTML = `
    <div class="crafting-activity-header">
      <div>
        <span class="crafting-activity-label">
          ${isToolUpgrade ? "ULEPSZANIE NARZĘDZIA" : "AKTYWNA PRACA"}
        </span>
        <strong>${isToolUpgrade ? "🧰" : "⚒️"} ${resultName}</strong>
      </div>

      <span class="crafting-activity-count" data-crafting-activity-count>
        ${isToolUpgrade
      ? "Ranga " + resultItem.toolTier + "/" + PROFESSION_TOOL_MAX_TIER
      : currentCraftNumber + "/" + job.totalCraftCount}
      </span>
    </div>

    <div class="crafting-activity-progress">
      <div
        class="crafting-activity-progress-fill"
        data-crafting-progress-fill
        style="width: ${progress}%;"
      ></div>
    </div>

    <div class="crafting-activity-footer">
      <span data-crafting-progress-text>
        ${isToolUpgrade
      ? "Trwa wzmacnianie przedmiotu"
      : "Wytwarzanie " + currentCraftNumber + " z " + job.totalCraftCount}
      </span>

      <strong data-crafting-time-remaining>
        ${isToolUpgrade ? "Do ukończenia: " : "Do końca partii: "}
        ${formatCraftingTime(remainingSeconds)}
      </strong>
    </div>
  `;

  container.appendChild(activity);
}

function enableCraftingQueueDragging(list) {
  let draggedRow = null;
  let dragHandle = null;
  let activePointerId = null;
  let dragStarted = false;

  function resetDragState() {

    if (draggedRow) {
      dragStarted = true;
      draggedRow.classList.add("is-dragging");
    }

    if (
      dragHandle &&
      activePointerId !== null &&
      dragHandle.hasPointerCapture(activePointerId)
    ) {
      dragHandle.releasePointerCapture(activePointerId);
    }

    draggedRow = null;
    dragHandle = null;
    activePointerId = null;
  }

  list.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) {
      return;
    }

    const handle = event.target.closest(
      "[data-crafting-drag-handle]",
    );

    if (!handle || !list.contains(handle)) {
      return;
    }

    const row = handle.closest(
      "[data-crafting-job-id]",
    );

    if (!row || row.classList.contains("is-active")) {
      return;
    }

    event.preventDefault();

    draggedRow = row;
    dragHandle = handle;
    activePointerId = event.pointerId;

    dragHandle.setPointerCapture(activePointerId);

    dragStarted = true;
    draggedRow.classList.add("is-dragging");
  });

  list.addEventListener("pointermove", (event) => {
    if (
      !dragStarted ||
      event.pointerId !== activePointerId
    ) {
      return;
    }

    event.preventDefault();

    const listRectangle =
      list.getBoundingClientRect();

    const scrollEdgeSize = 45;
    const scrollStep = 10;

    const pointerNearTop =
      event.clientY <
      listRectangle.top + scrollEdgeSize;

    const pointerNearBottom =
      event.clientY >
      listRectangle.bottom - scrollEdgeSize;

    if (pointerNearTop) {
      list.scrollTop -= scrollStep;
    } else if (pointerNearBottom) {
      list.scrollTop += scrollStep;
    }

    const waitingRows = Array.from(
      list.querySelectorAll(
        ".crafting-queue-item.is-waiting",
      ),
    );

    const targetRow =
      waitingRows.find((row) => {
        if (row === draggedRow) {
          return false;
        }

        const rectangle =
          row.getBoundingClientRect();

        const pointerInsideHorizontally =
          event.clientX >= rectangle.left &&
          event.clientX <= rectangle.right;

        const pointerInsideVertically =
          event.clientY >= rectangle.top &&
          event.clientY <= rectangle.bottom;

        return (
          pointerInsideHorizontally &&
          pointerInsideVertically
        );
      }) || null;


    if (
      !targetRow ||
      targetRow === draggedRow ||
      !list.contains(targetRow)
    ) {

      return;
    }

    const targetMiddle =
      targetRow.getBoundingClientRect().top +
      targetRow.getBoundingClientRect().height / 2;

    const pointerIsBelowMiddle =
      event.clientY > targetMiddle;

    if (pointerIsBelowMiddle) {
      list.insertBefore(
        draggedRow,
        targetRow.nextSibling,
      );
    } else {
      list.insertBefore(
        draggedRow,
        targetRow,
      );
    }


  });

  list.addEventListener("pointerup", (event) => {
    if (event.pointerId !== activePointerId) {
      return;
    }

    let movedJobId = null;

    if (draggedRow) {
      movedJobId =
        draggedRow.dataset.craftingJobId;
    }

    const currentRows = Array.from(
      list.querySelectorAll(
        "[data-crafting-job-id]",
      ),
    );

    const targetIndex =
      currentRows.indexOf(draggedRow);

    const canMove =
      dragStarted &&
      movedJobId !== null &&
      Number.isInteger(targetIndex);

    resetDragState();

    if (!canMove) {
      return;
    }

    const moved = moveCraftingQueueJob(
      movedJobId,
      targetIndex,
    );

    if (moved) {
      renderCrafting();
    }
  });

  list.addEventListener("pointercancel", () => {
    resetDragState();
  });
}

function renderCraftingQueue(container) {
  if (typeof getCraftingQueue !== "function") {
    return;
  }

  const queue = getCraftingQueue();

  if (queue.length === 0) {
    return;
  }

  const panel = document.createElement("section");
  panel.className = "crafting-queue";

  const header = document.createElement("div");
  header.className = "crafting-queue-header";

  header.innerHTML = `
    <strong>📋 Kolejka prac</strong>
    <span>${queue.length}</span>
  `;

  const list = document.createElement("div");
  list.className = "crafting-queue-list";

  queue.forEach((job, index) => {
    const recipe =
      getCraftingRecipeById(job.recipeId);

    if (!recipe) {
      return;
    }

    const row = document.createElement("div");
    row.className = "crafting-queue-item";
    row.dataset.craftingJobId = job.id;
    row.dataset.craftingQueueIndex = String(index);

    row.classList.add(
      index === 0 ? "is-active" : "is-waiting",
    );

    const information =
      document.createElement("div");

    information.className =
      "crafting-queue-item-info";

    const name = document.createElement("strong");

    const isToolUpgrade =
      typeof isProfessionToolUpgradeRecipe === "function" &&
      isProfessionToolUpgradeRecipe(recipe);
    const resultItem =
      items[recipe.resultItemId];

    name.textContent = isToolUpgrade
      ? "Ulepsz: " + (resultItem?.name || recipe.name)
      : recipe.name;

    const status = document.createElement("span");

    status.textContent =
      index === 0
        ? isToolUpgrade
          ? "Aktualnie ulepszane"
          : "Aktualnie wytwarzane"
        : "Pozycja w kolejce";

    information.appendChild(status);
    information.appendChild(name);


    const positionBadge =
      document.createElement("div");

    positionBadge.className =
      "crafting-queue-number";

    positionBadge.textContent =
      index === 0
        ? isToolUpgrade
          ? "🧰"
          : "⚒️"
        : String(index);

    const sideStatus =
      document.createElement("div");

    sideStatus.className =
      "crafting-queue-side-status";

    if (index === 0) {
      const totalQueueSeconds =
        typeof getCraftingTotalQueueRemainingSeconds ===
          "function"
          ? getCraftingTotalQueueRemainingSeconds()
          : 0;

      sideStatus.dataset
        .craftingTotalQueueTime =
        "true";

      sideStatus.textContent =
        "Łącznie: " +
        formatCraftingTime(
          totalQueueSeconds,
        );
    } else {
      sideStatus.textContent =
        "x" +
        job.totalCraftCount;
    }

    const cancelButton =
      document.createElement("button");

    cancelButton.type = "button";
    cancelButton.className =
      "crafting-queue-cancel";

    cancelButton.textContent = "Anuluj";

    cancelButton.addEventListener("click", () => {
      const canceled =
        cancelCraftingQueueJob(job.id);

      if (canceled) {
        renderCrafting();
      }
    });


    row.appendChild(information);

    if (index > 0) {
      const dragHandle = document.createElement("button");

      dragHandle.type = "button";
      dragHandle.className =
        "crafting-queue-drag-handle";

      dragHandle.dataset.craftingDragHandle = "true";
      dragHandle.textContent = "⠿";
      dragHandle.title = "Przytrzymaj i przeciągnij";

      dragHandle.setAttribute(
        "aria-label",
        "Przeciągnij zadanie " + recipe.name,
      );

      row.insertBefore(
        dragHandle,
        information,
      );
    }

    row.insertBefore(
      positionBadge,
      information,
    );

    row.appendChild(sideStatus);
    row.appendChild(cancelButton);
    list.appendChild(row);
  });

  enableCraftingQueueDragging(list);

  panel.appendChild(header);
  panel.appendChild(list);
  container.appendChild(panel);
}

function updateCraftingProgressUI() {
  const activity = document.querySelector("[data-crafting-activity]");

  if (
    !activity ||
    typeof getActiveCraftingQueueJob !==
    "function"
  ) {
    return;
  }

  const job =
    getActiveCraftingQueueJob();

  if (!job) {
    return;
  }

  const recipe =
    getCraftingRecipeById(job.recipeId);
  const resultItem = recipe
    ? items[recipe.resultItemId]
    : null;
  const isToolUpgrade = Boolean(
    recipe &&
    typeof isProfessionToolUpgradeRecipe === "function" &&
    isProfessionToolUpgradeRecipe(recipe),
  );

  const currentCraftNumber = Math.min(
    job.totalCraftCount,
    job.completedCraftCount + 1,
  );
  const progress = getCraftingQueueProgressPercent();
  const remainingSeconds = getCraftingQueueRemainingSeconds();
  const progressFill = activity.querySelector("[data-crafting-progress-fill]");
  const progressText = activity.querySelector("[data-crafting-progress-text]");
  const count = activity.querySelector("[data-crafting-activity-count]");
  const timeRemaining = activity.querySelector(
    "[data-crafting-time-remaining]",
  );

  if (progressFill) {
    progressFill.style.width = progress + "%";
  }

  if (progressText) {
    progressText.textContent = isToolUpgrade
      ? "Trwa wzmacnianie przedmiotu"
      : "Wytwarzanie " + currentCraftNumber + " z " + job.totalCraftCount;
  }

  if (count) {
    count.textContent = isToolUpgrade
      ? "Ranga " + resultItem.toolTier + "/" + PROFESSION_TOOL_MAX_TIER
      : currentCraftNumber + "/" + job.totalCraftCount;
  }

  if (timeRemaining) {
    timeRemaining.textContent =
      (isToolUpgrade ? "Do ukończenia: " : "Do końca partii: ") +
      formatCraftingTime(remainingSeconds);
  }

  const totalQueueTime =
    document.querySelector(
      "[data-crafting-total-queue-time]",
    );

  if (
    totalQueueTime &&
    typeof getCraftingTotalQueueRemainingSeconds ===
    "function"
  ) {
    totalQueueTime.textContent =
      "Łącznie: " +
      formatCraftingTime(
        getCraftingTotalQueueRemainingSeconds(),
      );
  }
}
