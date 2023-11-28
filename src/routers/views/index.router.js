import { Router } from "express";
import ProductManager from "../../dao/Products.manager.js";
import CartManager from "../../dao/Carts.manager.js";

const router = new Router();

router.get('/products', async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const products = await ProductManager.get({ limit, page, sort, query }, 'http://localhost:8080/products');
    res.render('products', { title: "Productos", ...products } )
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const cart = await CartManager.getById(cid);
    res.render('cart', { title: "Mi carrito", products: cart.products.map(product => product.toJSON()) });
});

export default router;