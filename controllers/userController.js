
import axios  from "axios";
import config from "../config/config.js";
// API: Turn ON
 export const  turnOnDevice =  async (req, res) => {
  try {
    await axios.post(config.WEBHOOK_URL, {
      action: "turn_on"
    });

    res.send("✅ Device Turned ON");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("❌ Failed to trigger");
  }
};

// // API: Get status
export const getStatus= async (req, res) => {
  try {
    const response = await axios.get(
      `${config.HA_URL}/api/states/${config.ENTITY_ID}`,
      {
        headers: {
          Authorization: `Bearer ${config.TOKEN}`
        }
      }
    );

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