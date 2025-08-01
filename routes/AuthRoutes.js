import express from "express";
import signUpController from "../controllers/Auth/SignupController.js";
import signInController from "../controllers/Auth/SigninController.js";
import signOutController from "../controllers/Auth/SignoutController.js";
import { protect } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// AUTH ROUTES
router.post("/signup", signUpController);
router.post("/signin", signInController);
router.post("/signout", signOutController);



export default router;