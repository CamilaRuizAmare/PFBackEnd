import userModel from '../dao/mongo/models/users.model.js';


export const changeRole = async (req, res) => {
    try {
        const user = req.params.uid;
        const role = req.user.user.role;
        req.logger.INFO(req.user.user.role);
        if (role === 'Premium') {
            const changeRole = await userModel.findByIdAndUpdate(user, { role: 'user' });
            req.user.user.role = 'user';
            req.logger.INFO(changeRole);
            return res.status(200).json({ 'Profile change': `Your subscription has been updated to ${req.user.user.role}, please log in again to impact the changes` });
        };
        if (role === 'user') {
            const checkDocs = await userModel.findById(user)
            if (checkDocs.documents?.length == 3) {
                const changeRole = await userModel.findByIdAndUpdate(user, { role: 'Premium' });
                req.user.user.role = 'Premium';
                req.logger.INFO(changeRole);
                return res.status(200).json({ 'Profile change': `Your subscription has been updated to ${req.user.user.role}, please log in again to impact the changes` });
            }
            return res.status(409).json({ Conflict: 'The user does not have the required documentation to modify their subscription, Please check if it has been uploaded and try again' })
        };
    } catch (error) {
        req.logger.ERROR(error);
        res.status(500).json({ "Internal Server Error": error.message });
    }
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