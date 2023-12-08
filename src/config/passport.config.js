import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";

import UserManager from '../dao/Users.manager.js';
import { createHash, isValidPassword } from '../utils.js';

export const initPassport = () => {
    const registerOpts = {
        usernameField: 'email',
        passReqToCallback: true,
    }

    const githubOpts = {
        clientID: 'Iv1.968e1d7ed3a69092',
        clientSecret: '1cd6a4c11e8c9bfe4e9e1ec289bd075fd2833b7b',
        callbackURL: 'http://localhost:8080/api/sessions/github/callback',
    }

    passport.use('register', new LocalStrategy(registerOpts, async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body;

        if (!first_name || !last_name ) {
            return done(new Error('Faltan campos requeridos'));
        }

        const user = await UserManager.getByEmail(email);
        if (user){
            return done(new Error('Usuario ya registrado'));
        }

        const newUser = await UserManager.create({ first_name, last_name, email, password: createHash(password), age});
        done(null, newUser);
    }));

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        const user = await UserManager.getByEmail(email);

        if (user && isValidPassword(password, user.password)) {
            return done(null, user);
        }
        done(new Error('Correo o contraseña invalidos.'));
    }));

    passport.use('github', new GithubStrategy(githubOpts, async (accesstoken, refreshToken, profile, done) => {
        const email = profile._json.email;
        if (!email) {
            return done(new Error('Error al obtener email'));
        }
        let user = await UserManager.getByEmail(email);

        if (user) {
            return done(null, user);
        }
        user = {
            first_name: profile._json.name,
            last_name: '',
            email: email,
            password: '',
        }

        const newUser = await UserManager.create(user);
        done(null, newUser);
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (uid, done) => {
        const user = await UserManager.getByID(uid);
        done(null, user);
    });
}