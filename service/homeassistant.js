import axios from 'axios'
import config from '../config/config.js'

export async function fetchPiStatus() {
    const response = await axios.get(
      `${config.HA_URL}/api/states/${config.ENTITY_ID}`,
      {
        headers: {
          Authorization: `Bearer ${config.TOKEN}`
        }
      }
    );

    return response;
}

export async function turnTheOnDevice(){
      await axios.post(config.WEBHOOK_URL, {
      action: "turn_on"
    });
}
export async function turnTheDeviceOFF() {
  await axios.post(config.WEBHOOK_JELLYFINOff, {
      action: "turn_off"
    });
}