import { Router } from "express";
import User from "../models/User.js";
import CartsDAOMongo from "../daos/CartsDAOMongo.js";
import { auth } from "../middlewares/auth.js";
import { sendEmail, sendMessage } from "../controllers/script.js";

const cartRouter = Router();
const cartsDAO = new CartsDAOMongo();

cartRouter.get("/", auth, async (req, res) => {
    const userData = await User.findById(req.user._id).lean();
    const userCart = await cartsDAO.findCart(req.user._id);
    const productsOnCart = userCart.products;
    res.render("cart", {
      userData: userData,
      data: productsOnCart,
    });
});

cartRouter.post("/", async (req, res) => {
  const data = await req.body;
  const cart = await cartsDAO.addProduct(data.userId, data.productId);
});

cartRouter.post("/buy", async (req, res) => {
  const userData = await User.findById(req.user._id).lean();
  const userCart = await cartsDAO.findCart(req.user._id);
  const productsOnCart = userCart.products;

  sendEmail(userData.username, userData.email, productsOnCart);
  sendMessage(userData.phoneNumber);
});

cartRouter.delete("/product", async (req, res) => {
  const data = req.body;
  console.log(data.userId, data.productId);
  const deleteProductFromCart = await cartsDAO.deleteProduct(data.userId, data.productId);
  res.send(deleteProductFromCart);
});

export default cartRouter;