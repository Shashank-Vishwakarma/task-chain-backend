import {Router} from "express";

import { googleAuthController, loginController, logoutController, registerController, verifyOtpController } from "../controllers/auth.js";
import {protectRoute} from "../middlewares/protectRoute.js"

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/verify", verifyOtpController);
authRouter.post("/login", loginController);
authRouter.post("/google", googleAuthController);
authRouter.post("/logout", protectRoute, logoutController);

export default authRouter;