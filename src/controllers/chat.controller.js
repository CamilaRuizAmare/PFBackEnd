import express from 'express';
import { passportCall, authorizationUser } from '../utils.js';

const chatRouter = express.Router();

chatRouter.get('/', passportCall('jwt'), authorizationUser('user'), async (req, res) => {
    res.render('index', {
        layout: 'chat',
        profileUser: req.user.user,
    })
});

export default chatRouter;