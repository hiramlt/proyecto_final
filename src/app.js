import express from 'express';
import morgan from 'morgan';
import path from 'path';
import handlebars from 'express-handlebars'
import __dirname from './utils.js';

import viewsRouter from './routers/views/index.router.js';
import productsRouter from './routers/api/products.router.js';
import cartsRouter from './routers/api/carts.router.js';

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

app.use('/', viewsRouter)
app.use('/api', productsRouter, cartsRouter);

app.use((error, req, res, next) => {
    res.status(500).json({ error: `Ocurrio un error desconocido: ${error.message}` })
})

export default app;