import dotenv from 'dotenv';
dotenv.config()

const config={
 PORT : process.env.PORT,
 WEBHOOK_URL : process.env.WEBHOOK_URL,
 HA_URL : process.env.HA_URL,
 TOKEN : process.env.TOKEN,
 ENTITY_ID : process.env.ENTITY_ID,
}

export default config;