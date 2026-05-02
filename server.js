import express from 'express';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/config.js';


const app = express();



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));

// Serve frontend

app.use(express.static(path.join(__dirname,"public")))
app.use(express.urlencoded({ extended: true }));


import router from './routes/userRoutes.js';

app.use('/',router)


import { monitorJellyfinUsage } from './service/monitorService.js';



// Start server
app.listen(config.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${config.PORT}`);
   setInterval(monitorJellyfinUsage, 60000);
});