import axios from "axios";
import { getJellyfinSessions } from "./jellyfinService.js";
import config from "../config/config.js";

let lastActiveWatchTime = Date.now();

export async function monitorJellyfinUsage() {
    console.log(`monitoring started`)
  const sessions = await getJellyfinSessions();

for (const a of x) {
  console.log(
    `User: ${a.UserName}\n` +
    `Playing: ${a.NowPlayingItem?.Name || "Nothing"}\n` +
    `Client: ${a.Client}\n`
  );
}
  const activeWatching = sessions.filter(
    s => s.NowPlayingItem && !s.PlayState?.IsPaused
  );

  if (activeWatching.length > 0) {
    lastActiveWatchTime = Date.now();
    return;
  }

  const idleMinutes = (Date.now() - lastActiveWatchTime) / 1000 / 60;

  if (idleMinutes >= 30) {
     try {
    await axios.post(config.WEBHOOK_JELLYFINOff, {
      action: "turn_on"
    });

    res.send("✅ Device Turned ON");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("❌ Failed to trigger");
  }
    console.log('device will turn off')
    lastActiveWatchTime = Date.now();
  }
}