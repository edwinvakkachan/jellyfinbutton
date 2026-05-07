import dotenv from 'dotenv';
dotenv.config()

const config={
 PORT : process.env.PORT,
 WEBHOOK_URL : process.env.WEBHOOK_URL,
 HA_URL : process.env.HA_URL,
 TOKEN : process.env.TOKEN,
 ENTITY_ID : process.env.ENTITY_ID,
 JELLYFIN_HELPER_ENTITY_ID : process.env.JELLYFIN_HELPER_ENTITY_ID,
 POWER_CUT_HELPER_ENTITY_ID : process.env.POWER_CUT_HELPER_ENTITY_ID,
 WEBHOOK_JELLYFINOff :process.env.WEBHOOK_JELLYFINOff,
 JELLYFIN_URL:process.env.JELLYFIN_URL,
 API_KEY :process.env.API_KEY,
 QBITIP :process.env.QBITIP,
 QBITPASS :process.env.QBITPASS,
 QBITUSER :process.env.QBITUSER
}

export default config;
