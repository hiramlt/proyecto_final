import mongoose from "mongoose";

const ProductItemShema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number }
}, { _id: false });

const CartSchema = new mongoose.Schema({
    products: { type: [ProductItemShema], default: [] },
}, { timestamps: true });


export default mongoose.model('carts', CartSchema)