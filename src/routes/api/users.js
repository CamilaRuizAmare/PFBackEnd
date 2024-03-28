import express from 'express';
import { passportCall, authorizationUser } from '../../utils.js';
import {changeRole, uploadDocs, getUsers, deleteInactiveUsers, deleteUser, changeRoleAdmin} from '../../controllers/user.controller.js';
import { uploader } from '../../utils.js';

const userRouter = express.Router();

userRouter.get('/premium/:uid', passportCall('jwt'), authorizationUser('user', 'Premium'), changeRole);
userRouter.get('/:uid', passportCall('jwt'), authorizationUser('Admin'), changeRoleAdmin);
userRouter.post('/:uid/documents', passportCall('jwt'), uploader.fields([{ name: 'ID' }, { name: 'address' }, { name: 'accountStatus' }]), uploadDocs)
userRouter.get('/', passportCall('jwt'), authorizationUser('Admin'), getUsers)
userRouter.delete('/', passportCall('jwt'), authorizationUser('Admin'), deleteInactiveUsers)
userRouter.delete('/:uid', passportCall('jwt'), authorizationUser('Admin'), deleteUser)

export default userRouter;