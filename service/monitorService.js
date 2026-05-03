import axios from "axios";
import { getJellyfinSessions } from "./jellyfinService.js";
import config from "../config/config.js";
import { logCurrentDateTime } from "../utils/logCurrentDateTime.js";


let lastActiveWatchTime = Date.now();

export async function monitorJellyfinUsage() {
   logCurrentDateTime("monitoring started")

  const sessions = await getJellyfinSessions();

  for (const a of sessions) {
  console.log(
    `User: ${a.UserName}\n` +
    `Playing: ${a.NowPlayingItem?.Name || "Nothing"}\n` +
    `Client: ${a.Client}\n`
  );
}
if(sessions.length==0){
    console.log('No user is currently watching anything');
}

 const activeWatching = sessions.filter(
    s => s.NowPlayingItem && !s.PlayState?.IsPaused
  );

  if (activeWatching.length > 0) {
    lastActiveWatchTime = Date.now();
    return;
  }

  const idleMinutes = (Date.now() - lastActiveWatchTime) / 1000 / 60;
console.log(`Idle for ${idleMinutes.toFixed(1)} minutes`);
  if (idleMinutes >= 30) {
     try {
    await axios.post(config.WEBHOOK_JELLYFINOff, {
      action: "turn_off"
    });

     console.log("Device turned off");
  } catch (error) {
    console.error(error.message);
    console.log("❌ Failed to trigger webhook");
  }
    lastActiveWatchTime = Date.now();
  }
}