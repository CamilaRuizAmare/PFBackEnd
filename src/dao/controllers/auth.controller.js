import { MongooseError } from "mongoose";
import userModel from "../models/users.model.js";
import { createPassHash, validatePass } from "../../utils.js";

export const newUser = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        if (!first_name || !last_name || !email || !password) {
            res.status(401).send({ error: 'Incomplete values' })
        }
        const userNew = new userModel({ first_name, last_name, email, age, password: createPassHash(password) });
        await userNew.save();
        req.session.user = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            age: age
        }
        res.status(201).redirect('/products');
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
            req.session.user = {
                first_name: 'adminCoder',
                profile: 'Admin'
            }
            return res.redirect("/products");
        }
        const userToLogin = await userModel.findOne({ email });
        if (!userToLogin) {
            return res.status(401).send('Usuario y/o contraseña invalidos');
        }
        if (!validatePass(userToLogin, password)) {
            return res.status(401).send('Usuario y/o contraseña invalidos');
        } 
        req.session.user = {
            first_name: userToLogin.first_name,
            last_name: userToLogin.last_name,
            email: userToLogin.email,
            age: userToLogin.age,
            profile: userToLogin.profile
        }
        res.redirect("/products");
    } catch (error) {
        console.log('Error al iniciar sesión', error);
    }
};

export const logoutUser = async (req, res) => {
    try {
        if (req.session.user) {
            delete req.session.user;
            req.session.destroy((err) => {
                if (err) {
                    console.log("Error al cerrar la sesión", err);
                    res.status(500).send("Error al cerrar la sesión");
                } else {
                    res.redirect("/");
                }
            });
        }
    } catch (error) {
        console.log("Error al cerrar la sesión", error);
        res.status(500).send("Error al cerrar la sesión");
    }
};