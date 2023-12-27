import express from 'express';
import {newUser, loginUser, logoutUser} from '../../dao/controllers/auth.controller.js';
import passport from "passport";

const sessionRouter = express.Router();

sessionRouter.get('/logout', logoutUser);
sessionRouter.post('/register', passport.authenticate('register', {failureRedirect: '/failRegister'}), async (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    }
    res.status(201).redirect('/products');
}); 
sessionRouter.get('/failRegisterOrLogin', (req, res) => {
    res.send({error: 'Error al crear el usuario'})
});
sessionRouter.post('/login', passport.authenticate('login', {failureRedirect: '/failRegisterOrLogin'}), async (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    }
    res.status(201).redirect('/products');
});
sessionRouter.get('/github', passport.authenticate('github', {scope: ['user: email']}), async (req, res) => {});
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/failRegisterOrLogin'}), async (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

export default sessionRouter;