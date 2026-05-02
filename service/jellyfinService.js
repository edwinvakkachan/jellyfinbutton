import axios from "axios";
import config from "../config/config.js";

async function isPi5On() {
  const res = await axios.get(
    `${config.HA_URL}/api/states/${config.ENTITY_ID}`,
    {
      headers: {
        Authorization: `Bearer ${config.TOKEN}`,
      },
    }
  );

  return res.data.state === "on";
}


export async function getJellyfinSessions() {
try {
  
      const pi5On = await isPi5On();

    if (!pi5On) {
      console.log("Pi5 is OFF — skipping Jellyfin monitor");
      return [];
    }

    console.log("Pi5 is ON — monitoring Jellyfin");

  const res = await axios.get(`${config.JELLYFIN_URL}/Sessions`, {
    headers: {
      "X-Emby-Token": config.API_KEY,
    },
  });

  return res.data;
} catch (error) {
  console.error(error);
}
}