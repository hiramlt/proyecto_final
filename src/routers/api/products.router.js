import { Router } from "express";
import ProductManager from "../../dao/Products.manager.js";

const router = new Router();

const validateData = async (req, res, next) => {
    const { title, description, code, price, status, stock, category } = req.body;
    if (!title || !description || !code || !price || !status || !stock || !category){
        return res.status(400).json({ error: "Missing required fields"})
    }
    next();
};

router.post('/products', validateData, async (req, res)  => {
    const { body } = req;
    try {
        const product = await ProductManager.create(body);
        res.status(201).json(product)
    } catch (error) {
        if (error.message === "Product already exists"){
            return res.status(400).json({ error: error.message });
        }
        res.status(503).json({ error: error.message });
    }
});

router.get('/products', async (req, res) => {
    const { limit, page, sort, query } = req.query;
    try {
        const products = await ProductManager.get({ limit, page, sort, query }, 'http://localhost:8080/api/products');
        res.status(200).json(products)
    } catch (error) {
        res.status(503).json({ error: error.message });
    }
});

router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await ProductManager.getById(pid);
        res.status(200).json(product);
    } catch (error) {
        if (error.message === "Product not found"){
            return res.status(404).json({ error: error.message });
        } 
        if (error.name === 'CastError'){
            return res.status(400).json({ error: "Invalid product ID" });
        }
        res.status(503).json({ error: error.message });
    }
});

router.put('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const { body } = req;
    try {
        await ProductManager.update(pid, body);
        res.status(204).end();
    } catch (error) {
        if (error.message === "Product not found"){
            return res.status(404).json({ error: error.message });
        } 
    }
});

router.delete('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await ProductManager.delete(pid);
        res.status(204).end();
    } catch (error) {
        if (error.message === "Product not found"){
            return res.status(404).json({ error: error.message });
        } 
    }
});

export default router;