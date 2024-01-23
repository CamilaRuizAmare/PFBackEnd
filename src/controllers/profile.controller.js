import express from 'express';
import {passportCall} from '../utils.js'

const profileRouter = express.Router();

profileRouter.get('/', passportCall('jwt'), (req, res) => {
    res.render('index', {
        layout: 'profile',
        profileUser: req.user.user,
    })
});

export default profileRouter;