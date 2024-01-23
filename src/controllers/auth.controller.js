import { MongooseError } from "mongoose";
import userModel from "../dao/mongo/models/users.model.js";
import { createPassHash, validatePass } from "../utils.js";
import cart from "../dao/mongo/db/Cart.dao.js";
import { generateToken } from '../utils.js'
import config from '../config/env.config.js';
import userDTO from "../dao/DTO/users.dto.js";

export const newUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            res.status(401).send({ error: 'Incomplete values' })
        }
        const userNew = new userModel({ first_name, last_name, email, age, password: createPassHash(password), cart: await cart.addCart() });
        await userNew.save();
        let userToToken = new userDTO(userNew);
        let token = generateToken(userToToken);
        res
            .status(201)
            .cookie('userToken', token, {
                maxAge: 900000, httpOnly: true
            })
            .redirect('/products');
    } catch (error) {
        if (MongooseError) {
            res.status(409).send({ error: 'El email ingresado ya está registrado' })
        }
        console.log('Error al crear el usuario', error);
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === config.userADM && password === config.passADM) {
            req.user = {
                first_name: 'Administrador',
                email,
                role: 'Admin'
            }
            let token = generateToken(req.user)
            return res
                .status(201)
                .cookie('userToken', token, {
                    maxAge: 900000, httpOnly: true
                })
                .redirect('/realtimeproducts');
        }
        const userToLogin = await userModel.findOne({ email });
        if (!userToLogin) {
            return res.status(401).send('Usuario y/o contraseña invalidos');
        }
        if (!validatePass(userToLogin, password)) {
            return res.status(401).send('Usuario y/o contraseña invalidos');
        }
        let userToToken = new userDTO(userToLogin)
        let token = generateToken(userToToken);
        res
            .status(201)
            .cookie('userToken', token, {
                maxAge: 900000, httpOnly: true
            })
            .redirect('/products');
    } catch (error) {
        console.log('Error al iniciar sesión', error);
    }
};

export const logoutUser = async (req, res) => {
    try {
        if (req.cookies['userToken']) {
            res
            .cookie('userToken', '', {
                maxAge: 1, httpOnly: true
            })
            .redirect("/");
        };
    }
     catch (error) {
    console.log("Error al cerrar la sesión", error);
    res.status(500).send("Error al cerrar la sesión");
}
};