import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.post('/sessions/login', passport.authenticate('login', { failureRedirect: '/login' }), async (req, res) => {
    res.redirect('/products');
});

router.post('/sessions/register', passport.authenticate('register', { failureRedirect: '/register' }), async (req, res) => {
    res.redirect('/login');
});

router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/sessions/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    res.redirect('/products');
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