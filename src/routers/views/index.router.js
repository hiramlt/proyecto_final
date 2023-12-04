import { Router } from "express";
import ProductManager from "../../dao/Products.manager.js";
import CartManager from "../../dao/Carts.manager.js";

const router = new Router();

const isAuth = (req, res, next) => {
    if (!req.session.user){
        return res.render('error', { title: 'Error', errorMsg: 'No estas autenticado' });
    }
    next();
};

router.get('/login', (req, res) => {
    res.render('login', { title: 'Inicio de sesión' });
}); 

router.get('/register', (req, res) => {
    res.render('register', { title: 'Registro' });
});

router.get('/profile', isAuth, (req, res) => {
    res.render('profile', { title: 'Mi perfil', user: req.session.user });
});

router.get('/products', isAuth, async (req, res) => {
    const { limit, page, sort, query } = req.query;
    const products = await ProductManager.get({ limit, page, sort, query }, 'http://localhost:8080/products');
    res.render('products', { title: "Productos", ...products, user: req.session.user } )
});

router.get('/carts/:cid', isAuth, async (req, res) => {
    const { cid } = req.params;
    const cart = await CartManager.getById(cid);
    res.render('cart', { title: "Mi carrito", products: cart.products.map(product => product.toJSON()) });
});

export default router;