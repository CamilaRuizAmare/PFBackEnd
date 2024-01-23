import express from 'express';
import passport from "passport";
import {newUser, loginUser, logoutUser} from '../../controllers/auth.controller.js';
import {generateToken, passportCall, authorizationUser} from '../../utils.js'


const sessionRouter = express.Router();

sessionRouter.get('/logout', logoutUser);
sessionRouter.post('/register', newUser); 
sessionRouter.post('/login', loginUser);
sessionRouter.get('/github', passport.authenticate('github', {scope: ['user: email']}), async (req, res) => {});
sessionRouter.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/failRegisterOrLogin'}), async (req, res) => {
    let token = generateToken(req.body.email)
    res
    .status(201)
    .cookie('userToken', token, {
        maxAge: 60 * 60 * 24, httpOnly: true
    })
    .redirect('/products');
});
sessionRouter.get('/current', passportCall('jwt'), authorizationUser('Admin'), (req, res) => {
    res.send({payload: req.user})
});

export default sessionRouter;