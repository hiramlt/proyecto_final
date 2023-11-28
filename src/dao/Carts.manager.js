import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";

export default class CartManager {
    static async getById(cid) {
        const cart = await CartModel.findById(cid).populate('products.product');
        if (!cart) {
            throw new Error("Cart not found");
        }
        return cart;
    }

    static async create() {
        const cart = await CartModel.create({});
        return cart;
    }

    static async update(cid, data) {
       const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("Cart not found");
        }

        cart.products = data;
        await cart.save();
    } 

    static async delete(cid) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("Cart not found");
        }

        cart.products = [];
        await cart.save();
    }

    static async addProducts(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("Cart not found");
        }

        const existentProduct = await ProductModel.findById(pid);
        if (!existentProduct){ 
            throw new Error("Product not found"); 
        }

        const foundProduct = cart.products.find((currentProduct) => currentProduct.product.equals(pid));
        if (foundProduct){
            foundProduct.quantity = foundProduct.quantity + quantity;
        } else {
            cart.products.push({ product: pid, quantity: quantity});
        }
 
        await cart.save();
    }

    static async updateProducts(cid, pid, quantity) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("Cart not found");
        }

        const existentProduct = cart.products.find((currentProduct) => currentProduct.product.equals(pid));
        if (!existentProduct){
            throw new Error("Product not found"); 
        }

        existentProduct.quantity = quantity;
        await cart.save();
    }

    static async deleteProducts(cid, pid) {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            throw new Error("Cart not found");
        }

        const existentProduct = cart.products.findIndex((currentProduct) => currentProduct.product.equals(pid));
        if (existentProduct === -1){
            throw new Error("Product not found"); 
        }

        cart.products.splice(existentProduct, 1);
        await cart.save();  
    }
}