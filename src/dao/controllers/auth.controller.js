import { MongooseError } from "mongoose";
import userModel from "../models/users.model.js";
import { createPassHash, validatePass } from "../../utils.js";
import cart from "../db/Cart.js";
import { generateToken } from '../../utils.js'

export const newUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            res.status(401).send({ error: 'Incomplete values' })
        }
        const userNew = new userModel({ first_name, last_name, email, age, password: createPassHash(password), cart: await cart.addCart() });
        await userNew.save();
        let token = generateToken(newUser);
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
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.user = {
                first_name: 'adminCoder',
                role: 'Admin'
            }
            let token = generateToken(email)
            return res
                .status(201)
                .cookie('userToken', token, {
                    maxAge: 900000, httpOnly: true
                })
                .redirect('/products');
        }
        const userToLogin = await userModel.findOne({ email });
        if (!userToLogin) {
            return res.status(401).send('Usuario y/o contraseña invalidos');
        }
        if (!validatePass(userToLogin, password)) {
            return res.status(401).send('Usuario y/o contraseña invalidos');
        }
        let token = generateToken(userToLogin)
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