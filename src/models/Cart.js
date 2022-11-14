import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    products: {type: Array, required: true, max: 100},
});

export const CartModel = mongoose.model("Cart", CartSchema);