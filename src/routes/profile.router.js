import express from 'express';
import {passportCall} from '../utils.js'

const profileRouter = express.Router();

profileRouter.get('/', passportCall('jwt'), (req, res) => {
    let profileUser = req.user.user
    console.log(profileUser);
    let adminUser = profileUser.role === 'Admin' ? true : false
    res.render('index', {
        layout: 'profile',
        profileUser,
        adminUser,
    })
});

export default profileRouter;