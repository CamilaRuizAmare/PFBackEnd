import express from 'express';
import {newUser, loginUser, logoutUser} from '../../dao/controllers/auth.controller.js';

const sessionRouter = express.Router();

sessionRouter.post('/login', loginUser);
sessionRouter.get('/logout', logoutUser);
sessionRouter.post('/register', newUser);

export default sessionRouter;