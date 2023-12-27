import express from 'express';

const profileRouter = express.Router();

profileRouter.get('/', (req, res) => {
    let profileUser = req.session.user
    let adminUser = profileUser.role === 'Admin' ? true : false
    res.render('index', {
        layout: 'profile',
        profileUser,
        adminUser,
    })
});

export default profileRouter;