import { Router } from "express";
import CartManager from "../../dao/Carts.manager.js";

const router = new Router();

const validateData = async (req, res, next) => {
    const { products } = req.body;

    const valid = products.every(product => {
        return (
            typeof product === 'object' && product.hasOwnProperty('product') && product.hasOwnProperty('quantity') 
        )
    });
    if (!valid) {
        res.status(400).json({ error: "Incorrect data" });
    }
    next();
};

router.post('/carts', async (req, res) => {
    try {
        const cart = await CartManager.create();
        res.status(201).json(cart);
    } catch (error) {
        res.status(503).json({ error: error.message });
    }
});

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await CartManager.getById(cid);
        res.status(200).json(cart);
    } catch (error) {
        if (error.message === "Cart not found"){
            return res.status(404).json({ error: error.message });
        }
        if (error.name === 'CastError'){
            return res.status(400).json({ error: "Invalid cart ID" });
        }
        res.status(503).json({ error: error.message });
    }
});

router.put('/carts/:cid', validateData, async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;

    try {
        await CartManager.update(cid, products);
        res.status(204).end();
    } catch (error) {
        if (error.message === "Cart not found"){
            return res.status(404).json({ error: error.message });
        }
        if (error.name === "CastError"){
            return res.status(400).json({ error: "Invalid cart ID" });
        }
        if (error.name === "ValidationError"){
            return res.status(400).json({ error: "Data contains invalid product ID" });
        }
        console.log(error.name);
        res.status(503).json({ error: error.message });
    }
}); 

router.delete('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        await CartManager.delete(cid);
        res.status(204).end();
    } catch (error) {
        if (error.message === "Cart not found"){
            return res.status(404).json({ error: error.message });
        }
        if (error.name === 'CastError'){
            return res.status(400).json({ error: "Invalid cart ID" });
        }
        res.status(503).json({ error: error.message });
    }
}); 

router.post('/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        await CartManager.addProducts(cid, pid, quantity);
        res.status(204).end();
    } catch (error) {
        if (error.message === "Cart not found" || error.message === "Product not found"){
            return res.status(404).json({ error: error.message });
        }
        if (error.name === 'CastError'){
            return res.status(400).json({ error: "Invalid ID" });
        }
        res.status(503).json({ error: error.message });
    }
});

router.put('/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {
        await CartManager.updateProducts(cid, pid, quantity);
        res.status(204).end();
    } catch (error) {
        if (error.message === "Cart not found" || error.message === "Product not found"){
            return res.status(404).json({ error: error.message });
        }
        if (error.name === 'CastError'){
            return res.status(400).json({ error: "Invalid ID" });
        }
        res.status(503).json({ error: error.message });
    }
});

router.delete('/carts/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        await CartManager.deleteProducts(cid, pid);
        res.status(204).end();
    } catch (error) {
        if (error.message === "Cart not found" || error.message === "Product not found"){
            return res.status(404).json({ error: error.message });
        }
        res.status(503).json({ error: error.message });
    }
});

export default router;