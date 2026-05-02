import dotenv from 'dotenv';
dotenv.config()

const config={
 PORT : process.env.PORT,
 WEBHOOK_URL : process.env.WEBHOOK_URL,
 HA_URL : process.env.HA_URL,
 TOKEN : process.env.TOKEN,
 ENTITY_ID : process.env.ENTITY_ID,
 WEBHOOK_JELLYFINOff:process.env.WEBHOOK_JELLYFINOff,
 JELLYFIN_URL:process.env.JELLYFIN_URL,
 API_KEY :process.env.API_KEY
}

export default config;