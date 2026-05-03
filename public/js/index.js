const button = document.querySelector('.btn');
const status = document.getElementById('status');
const toast = document.getElementById('toast');

let timerInterval = null;
let remaining = 0;
let statusLoading = false;

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function showToast(message) {
  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function startCooldownUI(seconds) {
  clearInterval(timerInterval);

  remaining = seconds;
  button.disabled = true;
  button.style.opacity = "0.6";

  timerInterval = setInterval(() => {
    status.innerText = `⏳ Wait ${formatTime(remaining)}`;
    button.innerText = `Wait ${formatTime(remaining)}`;

    remaining--;

    if (remaining < 0) {
      clearInterval(timerInterval);

      button.disabled = false;
      button.style.opacity = "1";
      button.innerText = "Turn ON Device";

      getStatus();
    }
  }, 1000);
}

async function triggerWebhook() {
  try {
    const res = await fetch('/api/turn-on');
    const data = await res.json();

    if (!res.ok) {
      if (data.remaining) {
        startCooldownUI(data.remaining);
        showToast(`⏳ Wait ${formatTime(data.remaining)}`);
      }
      return;
    }

    showToast(data.message);

    if (data.success) {
      getCooldown();
      getStatus();
    }

  } catch {
    showToast("❌ Request failed");
  }
}

async function getCooldown() {
  try {
    const res = await fetch('/api/cooldown');
    const data = await res.json();

    if (data.active) {
      startCooldownUI(data.remaining);
    }
  } catch (err) {
    console.error("Cooldown fetch failed:", err);
  }
}

async function getStatus() {
  if (statusLoading) return;
  statusLoading = true;

  try {
    const res = await fetch('/api/status');
    const data = await res.json();

    if (remaining > 0) return;

    if (data.state === "on") {
      status.innerText = "🟢 Device is ON";
    } else if (data.state === "off") {
      status.innerText = "🔴 Device is OFF";
    } else {
      status.innerText = "⚪ Unknown";
    }

  } catch {
    status.innerText = "Error fetching status";
  } finally {
    statusLoading = false;
  }
}

getCooldown();
getStatus();

setInterval(getStatus, 10000);