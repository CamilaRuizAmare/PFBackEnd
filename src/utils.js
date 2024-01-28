import multer from 'multer';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import config from './config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const privateKey = config.privateKey;

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './src/public/img')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});

export const createPassHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePass = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const generateToken = (user) => {
  const token = jwt.sign({ user }, privateKey, { expiresIn: '2h' });
  console.log(token);
  return token;
};


export const authorizationUser = (role) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).send({ error: 'Unauthorized user' })
    };
    if (req.user.user.role != role) {
      return res.status(403).send({ error: 'User without permissions' })
    }
    next();
  };
}

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) {
        return next(error);
      };
      if (!user) {
        return res.status(401).send({ error: info.messages?.info, messages: info.toString() })
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export const transport = nodemailer.createTransport({
  service: config.serviceMail,
  port: config.serviceMailPort,
  auth: {
    user: config.mailUser,
    pass: config.mailPassword,
  }
});

export const mailSend = (dataMail) => {
  const html = `
  <html>
    <div>
      <h3>${dataMail.name}, tu compra fué realizada</h3>
      <p> Los detalles de tu compra son: 
      ${dataMail.ticket}</p>
      <h4>Recordá tener tu N° de compra al momento de recibir o retirar el pedido!</h4>
    </div>
  </html>
`;

}

export default __dirname;
export const uploader = multer({ storage })