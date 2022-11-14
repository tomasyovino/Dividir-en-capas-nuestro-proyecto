import { Router } from "express";
import User from "../models/User.js";
import { auth } from "../middlewares/auth.js";

const profileRouter = Router();

profileRouter.get("/", auth, async (req, res) => {
    const userData = await User.findById(req.user._id).lean();
    
    res.render("profile", {
      data: userData,
    });
});

export default profileRouter;