import {Router} from "express";

import { loginController, logoutController, registerController } from "../controllers/auth.js";
import {protectRoute} from "../middlewares/protectRoute.js"

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", protectRoute, logoutController);

export default authRouter;