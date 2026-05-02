import axios from "axios";
import config from "../config/config.js";

export async function getJellyfinSessions() {
  const res = await axios.get(`${config.JELLYFIN_URL}/Sessions`, {
    headers: {
      "X-Emby-Token": config.API_KEY,
    },
  });

  return res.data;
}