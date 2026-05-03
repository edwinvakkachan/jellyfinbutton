import express from 'express';
const router = express.Router();

import { getHome,turnOnDevice,getStatus,coolDown } from '../controllers/userController.js';

router.get('/',getHome)
router.get('/api/turn-on', turnOnDevice);
router.get('/api/status', getStatus);
router.get('/api/cooldown',coolDown)

export default router;