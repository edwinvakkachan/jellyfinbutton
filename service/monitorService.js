import axios from "axios";
import { getJellyfinSessions } from "./jellyfinService.js";
import config from "../config/config.js";


let lastActiveWatchTime = Date.now();

export async function monitorJellyfinUsage() {
    console.log(`monitoring started`)

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
  // If sessions exist, users are watching
  if (sessions.length > 0) {
    lastActiveWatchTime = Date.now();
    return;
  }

  // Nobody watching
  const idleMinutes = (Date.now() - lastActiveWatchTime) / 1000 / 60;

  console.log(`Idle for ${idleMinutes.toFixed(1)} minutes`);

  if (idleMinutes >= 30) {
    await axios.post(config.WEBHOOK_JELLYFINOff, {
      action: "turn_off"
    });

    console.log("Device turned off");

    // Reset timer to prevent repeated shutdown requests
    lastActiveWatchTime = Date.now();
  }
}