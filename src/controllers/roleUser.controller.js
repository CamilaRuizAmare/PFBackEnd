import express from 'express';
import { passportCall, authorizationUser } from '../utils.js';
import userModel from '../dao/mongo/models/users.model.js';

const changeRoleRouter = express.Router();

changeRoleRouter.get('/premium/:uid', passportCall('jwt'), authorizationUser('user', 'Premium'), async (req, res) => {
    try {
        const user = req.params.uid;
        const role = req.user.user.role;
        req.logger.INFO(req.user.user.role);
        const changeRole = await userModel.findByIdAndUpdate(user, { role: (role === 'user' ? 'Premium' : 'user')});
        role === 'user' ? req.user.user.role = 'Premium' : req.user.user.role = 'user';
        req.logger.INFO(changeRole);
        res.status(200).json({'Profile change' :`Your subscription has been updated to ${role}, please log in again to impact the changes`});
    } catch (error) {
        req.logger.ERROR(error);
        res.status(500).json({ "Internal Server Error": error.message });
    }
});

export default changeRoleRouter;