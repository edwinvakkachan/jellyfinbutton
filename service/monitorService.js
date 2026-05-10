import axios from "axios";
import { getJellyfinSessions } from "./jellyfinService.js";
import config from "../config/config.js";
import { fetchPiStatus,turnTheDeviceOFF,turnONRRRaps,turnOffRRRaps } from "./homeassistant.js";
import {logTime} from "../utils/logCurrentDateTime.js"
import { loginQB } from "./qb.js";
import { getTorrents } from "./torrent.js";

let lastActiveWatchTime = Date.now();
let previousPiState = "unknown";



export async function monitorJellyfinUsage() {
  await logTime()
  const responce = await fetchPiStatus();
   const piState =  responce.data.state;
 
  console.log(piState);
   // Detect OFF -> ON transition
  if (previousPiState === "off" && piState === "on") {
    console.log("Pi turned ON → Resetting idle timer");
    lastActiveWatchTime = Date.now();
  }

  previousPiState = piState;

  if (piState !== "on") {
    console.log("Pi is OFF — skipping monitor");
    return;
  }

  const rawSessions = await getJellyfinSessions();
const sessions = Array.isArray(rawSessions) ? rawSessions : [];

if(sessions.length>0){
  for (const a of sessions) {
  console.log(
    `User: ${a.UserName}\n` +
    `Playing: ${a.NowPlayingItem?.Name || "Nothing"}\n` +
    `Client: ${a.Client}\n`
  );
}
}
if(sessions.length==0){
    console.log('No user is currently watching anything');
}

 const activeWatching = sessions.filter(
    s => s.NowPlayingItem && !s.PlayState?.IsPaused
  );

console.log(`the current user count is ${activeWatching.length}`);

if(activeWatching.length>=2){
  console.log('rrr apps turn off');
await turnOffRRRaps ();
}




  if (activeWatching.length > 0) {
    lastActiveWatchTime = Date.now();
    return;
  }

if(activeWatching.length<2){
    console.log('rrr apps turn ON');
  await turnONRRRaps();
}

  const idleMinutes = (Date.now() - lastActiveWatchTime) / 1000 / 60;
console.log(`Idle for ${idleMinutes.toFixed(1)} minutes`);
 



await loginQB();
let count = await getTorrents();

console.log(`total torrent count is ${count}`)




if (idleMinutes >= 30 && count < 5 ) {
     try {
   await turnTheDeviceOFF();
     console.log("Device turned off");
  } catch (error) {
    console.error(error.message);
    console.log("❌ Failed to trigger webhook");
  }
    lastActiveWatchTime = Date.now();
  }
}
