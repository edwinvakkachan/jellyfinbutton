const button = document.querySelector(".btn");
const buttonLabel = button?.querySelector(".btn__label");
const status = document.getElementById("status");
const statusDot = document.getElementById("status-dot");
const uptime = document.getElementById("uptime");
const toast = document.getElementById("toast");

let pollTimer = null;
let statusLoading = false;

function showToast(message) {
  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function renderUiState(uiState) {
  if (!uiState) return;

  status.innerText =
    uiState.cooldownMessage || uiState.statusText;

  button.disabled = uiState.buttonDisabled;
  buttonLabel.innerText = uiState.buttonLabel;

  document.body.classList.toggle(
    "is-waiting",
    uiState.isWaiting
  );

  document.body.classList.toggle(
    "is-turning-on",
    uiState.isTurningOn
  );

  document.body.classList.toggle(
    "is-turning-off",
    uiState.isTurningOff
  );

  document.body.classList.toggle(
    "is-power-cut",
    uiState.isPowerCut
  );

  document.body.classList.toggle(
    "is-cooldown",
    uiState.isCooldown
  );

  uptime.innerText = uiState.uptimeText || "";
  uptime.hidden = !uiState.uptimeText;

  statusDot.className = "status-dot";

  if (uiState.statusKind === "on") {
    statusDot.classList.add("is-on");

  } else if (uiState.statusKind === "off") {
    statusDot.classList.add("is-off");

  } else if (uiState.statusKind === "turning-on") {
    statusDot.classList.add("is-turning-on");

  } else if (uiState.statusKind === "turning-off") {
    statusDot.classList.add("is-turning-off");

  } else if (uiState.statusKind === "power-cut") {
    statusDot.classList.add("is-power-cut");

  } else if (uiState.statusKind === "cooldown") {
    statusDot.classList.add("is-cooldown");
  }
}

function scheduleStatusRefresh(delayMs = 10000) {
  clearTimeout(pollTimer);
  pollTimer = setTimeout(getUiState, delayMs);
}

async function getUiState() {
  if (statusLoading) return;

  statusLoading = true;

  try {
    const res = await fetch("/api/ui-state");
    const uiState = await res.json();

    renderUiState(uiState);

    scheduleStatusRefresh(uiState.nextPollMs);

  } catch {

    status.innerText = "Error fetching status";

    document.body.classList.remove(
      "is-waiting",
      "is-turning-on",
      "is-turning-off",
      "is-power-cut",
      "is-cooldown"
    );

    uptime.innerText = "";
    uptime.hidden = true;

    scheduleStatusRefresh();

  } finally {
    statusLoading = false;
  }
}

async function triggerWebhook() {
  try {
    const res = await fetch("/api/turn-on");

    const data = await res.json();

    showToast(data.message || "Request failed");

    if (data.uiState) {
      renderUiState(data.uiState);
      scheduleStatusRefresh(data.uiState.nextPollMs);
    }

    if (!res.ok && !data.uiState) {
      getUiState();
    }

  } catch {
    showToast("Request failed");
  }
}

button?.addEventListener("pointerdown", (event) => {

  if (button.disabled) return;

  const ripple = document.createElement("span");

  const rect = button.getBoundingClientRect();

  const size = Math.max(rect.width, rect.height) * 2;

  ripple.className = "btn__ripple";

  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;

  ripple.style.left =
    `${event.clientX - rect.left - size / 2}px`;

  ripple.style.top =
    `${event.clientY - rect.top - size / 2}px`;

  button.appendChild(ripple);

  ripple.addEventListener(
    "animationend",
    () => ripple.remove(),
    { once: true }
  );
});

getUiState();