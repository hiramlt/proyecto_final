import express from 'express';
import morgan from 'morgan';
import path from 'path';
import handlebars from 'express-handlebars'
import sessions from 'express-session';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import __dirname from './utils.js';
import { URI } from './db/mongodb.js';
import { initPassport } from './config/passport.config.js';

import viewsRouter from './routers/views/index.router.js';
import productsRouter from './routers/api/products.router.js';
import cartsRouter from './routers/api/carts.router.js';
import sessionsRouter from './routers/api/sessions.router.js';

const app = express();

const SESSION_SECRET = '0#UEE`p}iCj06skE\q9P#AW(7T1VgeBI';

app.use(sessions({
    store: MongoStore.create({
      mongoUrl: URI,
      mongoOptions: {},
      ttl: 60*15,
    }), 
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

initPassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', viewsRouter)
app.use('/api', productsRouter, cartsRouter, sessionsRouter);

app.use((error, req, res, next) => {
    res.status(500).json({ error: `Ocurrio un error desconocido: ${error.message}` })
})

export default app;