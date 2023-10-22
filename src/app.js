const express = require('express');
const morgan = require('morgan');

const productsRouter = require('./routers/products.router.js');
const cartsRouter = require('./routers/carts.router.js');

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use((error, req, res, next) => {
    res.status(500).json({ error: error.message })
})

app.use('/api', productsRouter, cartsRouter);

app.listen(PORT, () => {
    console.log(`Server running in http://localhost:${PORT}`);
})