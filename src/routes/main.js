import { Router } from "express";
import User from "../models/User.js";
import ProductsDAOMongo from "../daos/ProductsDAOMongo.js";
import { auth } from "../middlewares/auth.js";

const mainRouter = Router();
const productsDAO = new ProductsDAOMongo();

mainRouter.get("/", auth, async (req, res) => {
    const userData = await User.findById(req.user._id).lean();
    const dataProd = await productsDAO.listAll();

    res.render("main", {
      data: userData,
      productData: dataProd,
    });
});

export default mainRouter;