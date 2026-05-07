import {
  fetchJellyfinHelperStatus,
  fetchPiStatus,
  fetchPowerCutHelperStatus,
  turnTheOnDevice
} from "../service/homeassistant.js";

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

function formatDuration(ms) {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return "less than 1m";
}

function getOnDurationText(homeAssistantState) {
  const changedAt = homeAssistantState.last_changed || homeAssistantState.last_updated;
  const changedTime = changedAt ? new Date(changedAt).getTime() : NaN;

  if (!Number.isFinite(changedTime)) {
    return null;
  }

  return `On for ${formatDuration(Date.now() - changedTime)}`;
}

async function getPowerCutState() {
  const response = await fetchPowerCutHelperStatus().catch((err) => {
    console.error(err.message);
    return null;
  });

  return response?.data?.state || "unknown";
}

async function buildUiState() {
  const cooldown = getCooldownState();

  const powerCutState = await getPowerCutState();

  if (powerCutState === "on") {
    return {
      state: "power-cut",
      statusText: "Power cut detected",
      statusKind: "power-cut",
      buttonLabel: "Power Cut",
      buttonDisabled: true,
      isWaiting: false,
      isTurningOff: false,
      isPowerCut: true,
      uptimeText: "Waiting for power to return",
      helperState: "unknown",
      powerCutState,
      cooldown,
      nextPollMs: 5000
    };
  }

  if (cooldown.active) {
    const waitText = `Wait ${formatTime(cooldown.remaining)}`;

    return {
      state: "cooldown",
      statusText: waitText,
      statusKind: "waiting",
      buttonLabel: waitText,
      buttonDisabled: true,
      isWaiting: true,
      isTurningOff: false,
      isPowerCut: false,
      uptimeText: null,
      powerCutState,
      cooldown,
      nextPollMs: 1000
    };
  }

  try {
    const [deviceResponse, helperResponse] = await Promise.all([
      fetchPiStatus(),
      fetchJellyfinHelperStatus().catch((err) => {
        console.error(err.message);
        return null;
      })
    ]);
    const response = deviceResponse;
    const homeAssistantState = response.data;
    const state = homeAssistantState.state;
    const helperState = helperResponse?.data?.state || "unknown";
    const baseState = {
      state,
      buttonLabel: "Turn ON Device",
      buttonDisabled: false,
      isWaiting: false,
      isTurningOff: false,
      isPowerCut: false,
      uptimeText: null,
      helperState,
      powerCutState,
      cooldown,
      nextPollMs: 10000
    };

    if (state === "on") {
      if (helperState === "off") {
        return {
          ...baseState,
          statusText: "Device is turning OFF",
          statusKind: "turning-off",
          buttonLabel: "Turning OFF",
          buttonDisabled: true,
          isTurningOff: true,
          uptimeText: getOnDurationText(homeAssistantState),
          nextPollMs: 5000
        };
      }

      return {
        ...baseState,
        statusText: "Device is ON",
        statusKind: "on",
        uptimeText: getOnDurationText(homeAssistantState),
        nextPollMs: 60000
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
      isTurningOff: false,
      isPowerCut: false,
      uptimeText: null,
      powerCutState,
      cooldown,
      nextPollMs: 10000
    };
  }
}

export const turnOnDevice = async (req, res) => {
  try {
    if (await getPowerCutState() === "on") {
      return res.status(409).json({
        success: false,
        message: "Power cut detected",
        uiState: await buildUiState()
      });
    }

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
