import express from 'express';
import {newUser, loginUser, logoutUser} from '../../dao/controllers/auth.controller.js';
import passport from "passport";

const sessionRouter = express.Router();

sessionRouter.post('/login', loginUser);
sessionRouter.get('/logout', logoutUser);
sessionRouter.post('/register', passport.authenticate('register', {failureRedirect: '/failRegister'}), async (req, res) => {
    res.status(201).redirect('/products');
}); 
sessionRouter.get('/failRegisterOrLogin', (req, res) => {
    res.send({error: 'Error al crear el usuario'})
});


export default sessionRouter;