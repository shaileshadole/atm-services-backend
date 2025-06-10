import express from "express";
import { fullhistory, tcredit, threehistory, twithdraw } from "../controllers/tranController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/twithdraw", isAuthenticated, twithdraw);
router.post("/tcredit", isAuthenticated, tcredit);
router.get("/threehistory", isAuthenticated, threehistory);
router.post("/fullhistory", isAuthenticated, fullhistory);

export default router;