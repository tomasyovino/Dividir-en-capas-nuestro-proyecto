import MongoDbContainer from "../containers/MongoDbContainer.js";
import { ProductModel } from "../models/Product.js";
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

class ProductsDAOMongo extends MongoDbContainer {
    constructor(){
        super(ProductModel);
    }

    async save(obj) {
        try {
            const newProduct = await ProductModel(obj);
            const savedProduct = await newProduct.save();
            return savedProduct;
        } catch (err) {
            errorLogger.error(err);
        }
    }
}

export default ProductsDAOMongo;