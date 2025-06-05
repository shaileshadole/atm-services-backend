import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { changePIN, checkBalance, deposit, getATMNumber, login, register, verifyPin, withdraw } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

//All below routes require authentication
router.use(isAuthenticated);

router.get("/balance", checkBalance);
router.get("/atmNumber", getATMNumber);
router.patch("/deposit", deposit);
router.patch("/withdraw", withdraw);
router.patch("/change-pin", changePIN);
router.post("/verify-pin", verifyPin);

export default router;