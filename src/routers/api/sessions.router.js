import { Router } from 'express';
import UserManager from '../../dao/Users.manager.js';

const router = Router();

router.post('/sessions/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password ) {
        return res.render('error', { title: 'Error', errorMsg: 'Faltan campos requeridos' });
    }

    const user = await UserManager.getByEmail(email);
    if (user && user.password === password) {
        const { first_name, last_name, age, rol } = user;
        req.session.user = { first_name, last_name, email, age, rol };
        return res.redirect('/products');
    } 

    res.render('error', { title: 'Error', errorMsg: 'Correo o contraseña invalidos' });
});

router.post('/sessions/register', async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;

    if (!first_name || !last_name || !email || !password ) {
        return res.render('error', { title: 'Error', errorMsg: 'Faltan campos requeridos' });
    }

    const user = await UserManager.create({ first_name, last_name, email, password, age});
    res.redirect('/login');
});

router.get('/sessions/logout', async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.render('error', { title: 'Error', errorMsg: error.message });
        }
        res.redirect('/login');
    });
});

router.get('/sessions/profile', async (req, res) => {
    if (!req.session.user){
        return res.status(401).send('No estas autenticado');
    }
    res.status(200).json(req.session.user);
});

export default router;