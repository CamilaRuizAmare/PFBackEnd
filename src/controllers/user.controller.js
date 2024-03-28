import config from '../config/env.config.js'
import userModel from '../dao/mongo/models/users.model.js';
import {transport} from '../utils.js';


export const changeRole = async (req, res) => {
    try {
        const user = req.params.uid;
        const role = req.user.user.role;
        if (role === 'Premium') {
            const changeRole = await userModel.findByIdAndUpdate(user, { role: 'user' });
            req.user.user.role = 'user';
            return res.status(200).json({ 'Profile change': `Your subscription has been updated to ${req.user.user.role}, please log in again to impact the changes` });
        };
        if (role === 'user') {
            const checkDocs = await userModel.findById(user)
            if (checkDocs.documents?.length == 3) {
                const changeRole = await userModel.findByIdAndUpdate(user, { role: 'Premium' });
                req.user.user.role = 'Premium';
                return res.status(200).json({ 'Profile change': `Your subscription has been updated to ${req.user.user.role}, please log in again to impact the changes` });
            }
            return res.status(409).json({ Conflict: 'The user does not have the required documentation to modify their subscription, Please check if it has been uploaded and try again' })
        };
    } catch (error) {
        req.logger.ERROR(error);
        res.status(500).json({ "Internal Server Error": error.message });
    }
};

export const changeRoleAdmin = async (req, res) => {
    const userID = req.params.uid;
    const user = await userModel.findById(userID);
    await userModel.findByIdAndUpdate(userID, { role: (user.role == 'user' ? 'Premium' : 'user') });
    return res.status(200).redirect('/api/users')
};

export const uploadDocs = async (req, res) => {
    try {
        let user = req.user.user._id
        const userToUpdate = await userModel.findById(user)
        for (let doc in req.files) {
            const docsToUpload = {
                name: doc,
                reference: `./src/usersDocs/${user}/documents`
            }
            const validationDoc = userToUpdate.documents.findIndex(doc => doc.name === docsToUpload.name);
            if (validationDoc !== -1) {
                await userModel.findByIdAndUpdate(user, userToUpdate);
                return res.status(200).json({ 'Updated documents': 'Go back and refresh the page so you can change your subscription' })
            }
            userToUpdate.documents.push(docsToUpload);
        }
        await userModel.findByIdAndUpdate(user, userToUpdate);
        return res.status(200).json({ 'Uploaded documents': 'Go back and refresh the page so you can change your subscription' })
    } catch (error) {
        req.logger.ERROR(error);
        res.status(500).json({ "Internal Server Error": error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        const infoUser = [];
        for (let user of users) {
            const userInfo = {
                name: user.first_name,
                lastName: user.last_name,
                email: user.email,
                profileType: user.role,
                id: user._id,
            }
            infoUser.push(userInfo)
        }
        res.status(200).render('index', {
            layout: 'allUsers',
            infoUser
        })
    } catch (error) {
        req.logger.ERROR(error);
        res.status(500).json({ "Internal Server Error": error.message });
    }
};

export const deleteInactiveUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        const inactiveUsers = users.filter((user) => {
            const lastConnectionUser = new Date(user.lastConection)
            const today = new Date()
            const idleTolerance = new Date(today - 172800000)
            return lastConnectionUser < idleTolerance || lastConnectionUser === undefined 
        });
        req.logger.DEBUG(inactiveUsers)
        inactiveUsers.forEach(async (user) => {
            const html = `
                     <html>
                         <div>
                            <h3>Hola, ${user.first_name} ${user.last_name}, tu cuenta fué eliminada por inactividad</h3>
                            <p>Han pasado más de 48 hs desde que nos visitaste por última vez, es por eso que hemos tenido que dar de baja tu usuario :( </p>
                            <p>
                            Si querés volver a suscribirte haz click <a href="http://localhost:${config.port}" >aquí</a>
                            </p>
                            <h4>¡Te esperamos nuevamente!</h4>
                        </div>
                    </html>
                    `;
            const infoUser = {
                from: config.mailUser,
                to: user.email,
                subject: `Tu cuenta ha sido eliminada por inactividad`,
                html
            };
            const sendMail = await transport.sendMail(infoUser);
            await userModel.findByIdAndDelete(user._id)
        })
        res.status(200).json({ 'Users Removed': inactiveUsers });
    } catch (error) {
        req.logger.ERROR(error);
        res.status(500).json({ "Internal Server Error": error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userID = req.params.uid;
        const userToDelete = await userModel.findByIdAndDelete(userID);
        if (!userToDelete) {
            req.logger.WARNING('User not found');
            return res.status(404).json('User not found');
        }
        req.logger.DEBUG(userToDelete);
        return res.status(200).json({'User Deleted': userToDelete})
    } catch (error) {
        req.logger.ERROR(error);
        res.status(500).json({ "Internal Server Error": error.message });
    }
};