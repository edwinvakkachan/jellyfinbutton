
  let cooldown = 180; // 3 minutes
  let timerInterval = null;
  let remaining = 0;

  const button = document.querySelector('.btn');
  const status = document.getElementById('status');
  const toast = document.getElementById('toast');

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

  function startCooldown() {
    button.disabled = true;
    button.style.opacity = "0.6";
    button.innerText = "Please wait...";

    remaining = cooldown;

    timerInterval = setInterval(() => {
      remaining--;

      status.innerText = `⏳ Wait ${formatTime(remaining)}`;

      if (remaining <= 0) {
        clearInterval(timerInterval);
        button.disabled = false;
        button.style.opacity = "1";
        button.innerText = "Turn ON Device";
        status.innerText = "✅ Ready";
      }
    }, 1000);
  }

  async function triggerWebhook() {
    // 🚫 If disabled → show toast instead of alert
    if (button.disabled) {
      showToast(`⏳ Please wait ${formatTime(remaining)}`);
      return;
    }

    status.innerText = "Sending request...";

    try {
      const res = await fetch('/api/turn-on');
      const text = await res.text();
      status.innerText = text;

      showToast("✅ Request sent successfully");
      startCooldown();
      getStatus();

    } catch {
      status.innerText = "Error";
      showToast("❌ Failed to send request");
    }
  }

let statusLoading = false;

async function getStatus() {
  if (statusLoading) return;
  statusLoading = true;

  try {
    const res = await fetch('/api/status');
    const data = await res.json();

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

setInterval(getStatus, 10000);
  getStatus();
