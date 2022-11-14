import express from "express";
import ProductsDAOMongo from "../daos/ProductsDAOMongo.js";
import log4js  from "log4js";

log4js.configure({
    appenders: {
      miLoggerConsole: { type: "console" },
      miLoggerFile: { type: "file", filename: "error.log" },
    },
    categories: {
      default: { appenders: ["miLoggerConsole"], level: "info" },
      error: { appenders: ["miLoggerFile"], level: "error" },
    },
});

const errorLogger = log4js.getLogger("error");

const productsRouter = express.Router();
const productsDAO = new ProductsDAOMongo();

productsRouter.get("/", async (req, res) => {
    try {
        let products = await productsDAO.listAll();
        res.send(products);
    } catch (err) {
        errorLogger.error(err);
    }
});

productsRouter.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let product = await productsDAO.list(id);
        res.send(product);
    } catch (err) {
        errorLogger.error(err);
    }
});

productsRouter.post("/", async (req, res) => {
    try {
        const { title, price, thumbnail } = req.body;
        let savedProduct = await productsDAO.save({ title: title, price: price, thumbnail: thumbnail, quantity: 1 });
        res.send(savedProduct);
    } catch (err) {
        errorLogger.error(err);
    }
});

productsRouter.put("/", async (req, res) => {
    const { id, title, price, thumbnail, quantity } = req.body;
    const product = await productsDAO.update({ id: id, title: title, price: price, thumbnail: thumbnail, quantity: quantity });
    res.send(product);
});

productsRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;
    res.send(productsDAO.delete(id));
});

export default productsRouter;