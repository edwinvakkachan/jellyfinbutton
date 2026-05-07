import { fetchPiStatus, turnTheOnDevice } from "../service/homeassistant.js";

const COOLDOWN_MS = 180000;

let cooldownUntil = 0;

function getCooldownState() {
  const remaining = Math.max(
    0,
    Math.ceil((cooldownUntil - Date.now()) / 1000)
  );

  return {
    remaining,
    active: remaining > 0
  };
}

function formatTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

async function buildUiState() {
  const cooldown = getCooldownState();

  if (cooldown.active) {
    const waitText = `Wait ${formatTime(cooldown.remaining)}`;

    return {
      state: "cooldown",
      statusText: waitText,
      statusKind: "waiting",
      buttonLabel: waitText,
      buttonDisabled: true,
      isWaiting: true,
      cooldown,
      nextPollMs: 1000
    };
  }

  try {
    const response = await fetchPiStatus();
    const state = response.data.state;
    const baseState = {
      state,
      buttonLabel: "Turn ON Device",
      buttonDisabled: false,
      isWaiting: false,
      cooldown,
      nextPollMs: 10000
    };

    if (state === "on") {
      return {
        ...baseState,
        statusText: "Device is ON",
        statusKind: "on"
      };
    }

    if (state === "off") {
      return {
        ...baseState,
        statusText: "Device is OFF",
        statusKind: "off"
      };
    }

    return {
      ...baseState,
      statusText: "Unknown",
      statusKind: "unknown"
    };
  } catch (err) {
    console.error(err.message);

    return {
      state: "unknown",
      statusText: "Error fetching status",
      statusKind: "unknown",
      buttonLabel: "Turn ON Device",
      buttonDisabled: false,
      isWaiting: false,
      cooldown,
      nextPollMs: 10000
    };
  }
}

export const turnOnDevice = async (req, res) => {
  try {
    const now = Date.now();

    if (now < cooldownUntil) {
      return res.status(429).json({
        success: false,
        message: "Cooldown active",
        uiState: await buildUiState()
      });
    }

    await turnTheOnDevice();

    cooldownUntil = now + COOLDOWN_MS;

    res.json({
      success: true,
      message: "Device turning on",
      uiState: await buildUiState()
    });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Failed to trigger"
    });
  }
};

export const getStatus = async (req, res) => {
  try {
    const response = await fetchPiStatus();

    res.json({
      state: response.data.state
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ state: "unknown" });
  }
};

export const getHome = async (req, res) => {
  res.render("index");
};

export const getUiState = async (req, res) => {
  res.json(await buildUiState());
};

export const coolDown = async (req, res) => {
  res.json(getCooldownState());
};
