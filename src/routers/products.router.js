const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const router = Router();
const file = path.join(__dirname, '../products.json');

const saveDataToFile = async (data) => {
    try {
        await fs.promises.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {  
        throw new Error('Error: ' + error.message)
    }
}

const getDataFromFile = async () => {
    if (!fs.existsSync(file)) return []

    try {
        const data = await fs.promises.readFile(file, 'utf-8');
        return JSON.parse(data);
    } catch (error) {  
        throw new Error('Error: ' + error.message)
    }
}

const validateFields = async (req, res, next) => {
    const { title, description, code, price, status, stock, category } = req.body;

    if (!title || !description || !code || !price || !status || !stock || !category){
        return res.status(400).json({ error: "Missing required fields"})
    }
    next();
};

const verifyExistence = async (req, res, next) => {
    const { code } = req.body;
    const products = await getDataFromFile();

    const found = products.find((product) => product.code === code);
    if (found) return res.status(400).json({error: "Product already exists"});

    next();
}


router.post('/products', validateFields, verifyExistence, async (req, res) => {
    const { thumbnails, ...fields } = req.body;
    const products = await getDataFromFile();

    const newProduct = {
        id: uuidv4(),
        ...fields,
        thumbnails: thumbnails ?? [],
    }
    
    products.push(newProduct);
    await saveDataToFile(products);

    res.status(201).json(newProduct);
})

router.get('/products', async (req, res) => {
    const { limit } = req.query;
    const products = await getDataFromFile();

    console.log(limit);

    if (limit && limit > 0 && limit < products.length) {
        return res.status(200).json(products.slice(0, limit));
    }  
    
    res.status(200).json(products)
})

router.get('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const products = await getDataFromFile();

    const found = products.find((product) => product.id === pid);
    if (!found) return res.status(404).json({error: "Product not found"});
    
    res.status(200).json(found);
})

router.put('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const products = await getDataFromFile();

    if (products && products.length > 0){
        const found = products.findIndex((product) => product.id === pid);
        if (found < 0) return res.status(404).json({error: "Product not found"});

        if (title) { products[found].title = title }
        if (description) { products[found].description = description }
        if (code) { products[found].code = code }
        if (price) { products[found].price = price }
        if (status) { products[found].status = status }
        if (stock) { products[found].stock = stock }
        if (category) { products[found].category = category }
        if (thumbnails) { products[found].thumbnails = thumbnails }
        
        await saveDataToFile(products);
        return res.status(200).json(products[found]);
    }

    res.status(404).json({error: "Product not found"});
})

router.delete('/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const products = await getDataFromFile();

    const found = products.findIndex((product) => product.id === pid);
    if (found < 0) return res.status(404).json({error: "Product not found"});
    products.splice(found, 1);
    await saveDataToFile(products);
        
    res.status(200).send('Product deleted successfully');
})


module.exports = router;