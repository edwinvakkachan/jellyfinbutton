import axios from 'axios'
import config from '../config/config.js'

const JELLYFIN_HELPER_ENTITY_ID = config.JELLYFIN_HELPER_ENTITY_ID || "input_boolean.jellyfin";
const POWER_CUT_HELPER_ENTITY_ID = config.POWER_CUT_HELPER_ENTITY_ID || "input_boolean.powercut";

function getHomeAssistantHeaders() {
  return {
    Authorization: `Bearer ${config.TOKEN}`
  };
}

export async function fetchPiStatus() {
    const response = await axios.get(
      `${config.HA_URL}/api/states/${config.ENTITY_ID}`,
      {
        headers: getHomeAssistantHeaders()
      }
    );

    return response;
}

export async function fetchJellyfinHelperStatus() {
    const response = await axios.get(
      `${config.HA_URL}/api/states/${JELLYFIN_HELPER_ENTITY_ID}`,
      {
        headers: getHomeAssistantHeaders()
      }
    );

    return response;
}

export async function fetchPowerCutHelperStatus() {
    const response = await axios.get(
      `${config.HA_URL}/api/states/${POWER_CUT_HELPER_ENTITY_ID}`,
      {
        headers: getHomeAssistantHeaders()
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

export async function turnONRRRaps (){
     await axios.post(config.WEBHOOK_URL_RRRON, {
      action: "turn_on"
    });
}

export async function turnOffRRRaps (){
       await axios.post(config.WEBHOOK_URL_RRROFF, {
      action: "turn_on"
    });
}
