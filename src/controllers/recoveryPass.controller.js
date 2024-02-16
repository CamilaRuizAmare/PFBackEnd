import express from 'express';
import { transport, createPassHash, validatePass, tokenToRecoveryPass } from '../utils.js';
import config from '../config/env.config.js'
import userModel from '../dao/mongo/models/users.model.js';

const recoveryPassRouter = express.Router();

recoveryPassRouter.get('/', (req, res) => {
    res.render('index', {
        layout: 'recoveryPass'
    });
});

recoveryPassRouter.post('/', async (req, res) => {
    try {
        const { email } = req.body;
        const userRecovery = await userModel.findOne({ email });
        if (!userRecovery) {
            req.logger.WARNING('User not found');
            return res.status(404).send('User not found');
        }
        const dateExpires = Date.now() + 3600000
        const token = tokenToRecoveryPass(email, Date.now());
        userRecovery.tokenRecoveryPass = token;
        userRecovery.dateToken = dateExpires;
        await userModel.findByIdAndUpdate(userRecovery._id, userRecovery)
        const html = `<html>
                         <div>
                            <h3>Recupera tu contraseña</h3>
                            <p>Para cambiar tu contraseña haz click <a href="http://localhost:${config.port}/api/sessions/recoveryPass/${userRecovery.tokenRecoveryPass}" >aquí</a></p>
                            <p>Si no solicitaste el cambio, desestimá este correo</p>
                        </div>
                    </html>`;
        const infoUser = {
            from: config.mailUser,
            to: email,
            subject: 'Recupera tu contraseña',
            html
        };
        req.logger.INFO(infoUser)
        const mailSend = await transport.sendMail(infoUser);
        return res.status(200).json({ message: 'Correo enviado! Revisa tu casilla' });
    } catch (error) {
        req.logger.ERROR(error);
        res.status(500).json({ "Internal Server Error": error.message });
    }
});

recoveryPassRouter.get('/:id', async (req, res) => {
    const user = await userModel.findOne({tokenRecoveryPass: req.params.id});
    if (!user) {
        req.logger.WARNING('User not found');
        return res.status(404).send('User not found');
    }
    if (user.dateToken > Date.now()) {
        return res.render('index', {
            userID: user.tokenRecoveryPass,
            layout: 'recoveryPassID',
        })
    } else {
        return res.status(409).render('index', {
            layout: 'tokenExpired'
        });
    }
});

recoveryPassRouter.post('/:id', async (req, res) => {
    const { email, password } = req.body;
    const userRecovery = await userModel.findOne({ email });
    if (!userRecovery) {
        req.logger.WARNING('User not found');
        return res.status(404).send('User not found');
    }
    if (validatePass(userRecovery, password)) {
        return res.status(401).send('You must provide a different password')
    }
    const updateUser = await userModel.findOneAndUpdate({ email }, { password: createPassHash(password) });
    req.logger.INFO('Password recovered')
    res
        .status(201)
        .redirect('/')
});


export default recoveryPassRouter;