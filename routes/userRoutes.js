import express from "express";
import {
  coolDown,
  getHome,
  getStatus,
  getUiState,
  turnOnDevice
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getHome);
router.get("/api/turn-on", turnOnDevice);
router.get("/api/ui-state", getUiState);
router.get("/api/status", getStatus);
router.get("/api/cooldown", coolDown);

export default router;
