import MongoDbContainer from "../containers/MongoDbContainer.js";
import { CartModel } from "../models/Cart.js";
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

class CartsDAOMongo extends MongoDbContainer {
    constructor(){
        super(CartModel);
    }

    async save() {
        try {
            const newCart = await CartModel();
            const savedProduct = await newCart.save();
            return savedProduct;
        } catch (err) {
            errorLogger.error(err);
        }
    }

    async addProduct(userId, productId) {
        try {
            let cart = await CartModel.findOne({ userId });
            let product = await ProductModel.findOne({ _id: productId });

            if (cart) {
                //cart exists for user
                let itemIndex = cart.products.findIndex(p => p._id == productId);
                
                if (itemIndex > -1) {
                    //product exists in the cart, update the quantity
                    let productItem = cart.products[itemIndex];
                    productItem.quantity = productItem.quantity + 1;
                    cart.products[itemIndex] = productItem;
                } else {
                    //product does not exists in cart, add new item
                    cart.products.push(product);
                };
                cart = await cart.save();
            } else {
                //no cart for user, create new cart
                const newCart = await CartModel.create({
                    userId,
                    products: [product]
                });
            };
        } catch (err) {
            errorLogger.error(err);
        };
    };

    async listProducts(id) {
        try {
            let cartProducts = await CartModel.findById(id, { "products": 1, "_id": 0 }).exec();
            return cartProducts;
        } catch (err) {
            errorLogger.error(err);
        };
    };

    async findCart(userId) {
        try {
            let cart = await CartModel.findOne({ userId });

            if (cart) {
                return cart;
              } else {
                const newCart = await CartModel.create({
                  userId,
                });
          
                return newCart;
              }
        } catch (err) {
            errorLogger.error(err);
        };
    };

    // async deleteProduct(id, id_prod) {
    //     try {
    //         let cart = await CartModel.updateOne({ _id: "636818fa182195b2b0b6b385" }, { $set: { products: { title: "Valor actualizado" }} } );
    //         let 
    //         // db.stores.updateMany(
    //         //     { },
    //         //     { $pull: { fruits: { $in: [ "apples", "oranges" ] }, vegetables: "carrots" } }
    //         // )
    //         return cart;
    //     } catch (err) {
    //         errorLogger.error(err);
    //     };
    // };
    async deleteProduct(userId, productId) {
        try {
            let cart = await CartModel.findOne({ userId });

            if (cart) {
                let itemIndex = cart.products.findIndex(p => p._id == productId);
                const arrayTemporal = cart.products;
                if (itemIndex > -1) {
                    arrayTemporal.splice(itemIndex, 1);
                    await CartModel.updateOne({ userId: userId }, { $set: { products: arrayTemporal } } );
                }
            }
        } catch (err) {
            errorLogger.error(err);
        };
    };
};

export default CartsDAOMongo;