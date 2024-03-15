import express from 'express';
import { passportCall, authorizationUser } from '../../utils.js';
import {changeRole, uploadDocs} from '../../controllers/roleUser.controller.js';
import { uploader } from '../../utils.js';

const userRouter = express.Router();

userRouter.get('/premium/:uid', passportCall('jwt'), authorizationUser('user', 'Premium'), changeRole);
userRouter.post('/:uid/documents', passportCall('jwt'), uploader.fields([{ name: 'ID' }, { name: 'address' }, { name: 'accountStatus' }]), uploadDocs)

export default userRouter;