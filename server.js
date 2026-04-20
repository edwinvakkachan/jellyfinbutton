import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ ENV VARIABLES
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const HA_URL = process.env.HA_URL;
const TOKEN = process.env.TOKEN;
const ENTITY_ID = process.env.ENTITY_ID;

// Validate env
if (!WEBHOOK_URL || !HA_URL || !TOKEN || !ENTITY_ID) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

// Serve frontend
app.use(express.static(path.join(__dirname)));

// API: Turn ON
app.get('/api/turn-on', async (req, res) => {
  try {
    await axios.post(WEBHOOK_URL, {
      action: "turn_on"
    });

    res.send("✅ Device Turned ON");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("❌ Failed to trigger");
  }
});

// API: Get status
app.get('/api/status', async (req, res) => {
  try {
    const response = await axios.get(
      `${HA_URL}/api/states/${ENTITY_ID}`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
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
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});