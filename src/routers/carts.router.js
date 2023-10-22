const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const router = Router();
const carts_file = path.join(__dirname, '../carts.json');
const products_file = path.join(__dirname, '../products.json');

const saveDataToFile = async (data, file) => {
    const file_path = file === 1 ? carts_file : products_file;
    try {
        await fs.promises.writeFile(file_path, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {  
        throw new Error('Error: ' + error.message)
    }
}

const getDataFromFile = async (file) => {
    const file_path = file === 1 ? carts_file : products_file;
    if (!fs.existsSync(file_path)) return []

    try {
        const data = await fs.promises.readFile(file_path, 'utf-8');
        return JSON.parse(data);
    } catch (error) {  
        throw new Error('Error: ' + error.message)
    }
}

const verifyExistence = async (req, res, next) => {
    const { cid, pid } = req.params;
    const carts = await getDataFromFile(1);
    const products = await getDataFromFile(2);

    const cart = carts.find((cart) => cart.id === cid);
    const product = products.find((product) => product.id === pid);
    
    if (!cart) return res.status(404).json({error: "Cart not found"});
    if (!product) return res.status(404).json({error: "Product not found"});

    next();
}

router.post('/carts', async (req, res) => {
    const carts = await getDataFromFile(1);

    const newCart = {
        id: uuidv4(),
        products: [],
    }
    
    carts.push(newCart);
    await saveDataToFile(carts, 1);     
    res.status(201).json(newCart);
})

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const carts = await getDataFromFile(1);

    const found = carts.find((cart) => cart.id === cid);
    if (!found) return res.status(404).json({error: "Cart not found"});
    
    res.status(200).json(found.products);
})

router.post('/carts/:cid/product/:pid', verifyExistence, async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const carts = await getDataFromFile(1);

    const cart = carts.find((cart) => cart.id === cid);
    const found_product = cart.products.find((product) => product.id === pid);

    if (found_product) {
        found_product.quantity = found_product.quantity + parseInt(quantity);
    } else {
        const newProduct = {
            id: pid,
            quantity: parseInt(quantity)
        }
        cart.products.push(newProduct);
    }
    
    await saveDataToFile(carts, 1);  
    res.status(200).json(found_product);
})


module.exports = router;