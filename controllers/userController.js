
import axios  from "axios";
import config from "../config/config.js";
import { fetchPiStatus } from "../service/homeassistant.js";
import { turnTheOnDevice } from "../service/homeassistant.js";
// API: Turn ON

let cooldownUntil = 0;

 export const  turnOnDevice =  async (req, res) => {
  try {

const now = Date.now();

 if (now < cooldownUntil) {
    const remaining = Math.ceil((cooldownUntil - now) / 1000);
    return res.status(429).json({
      error: 'Cooldown active',
      remaining
    });
  }

  await turnTheOnDevice()

cooldownUntil = now + 180000; // 3 min

  
  res.json({
    success: true,
    message: 'Device turning on'
  });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("❌ Failed to trigger");
  }
};

// // API: Get status
export const getStatus= async (req, res) => {
  try {
    const response = await fetchPiStatus();

    res.json({
      state: response.data.state
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ state: "unknown" });
  }
};

export const getHome = async (req,res)=>{
    res.render('index')
}


export const coolDown= async (req, res) => {
  const remaining = Math.max(
    0,
    Math.ceil((cooldownUntil - Date.now()) / 1000)
  );

  res.json({
    remaining,
    active: remaining > 0
  });
};

