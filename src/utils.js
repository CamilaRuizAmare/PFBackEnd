import multer from 'multer';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import config from './config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const privateKey = config.privateKey;

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    let user = req.user.user._id
    let path = req.path
    let pathDoc;
    switch (path) {
      case `/${user}/documents`:
        pathDoc = `./src/usersDocs/${user}/documents`
        fs.mkdirSync(pathDoc, { recursive: true })
        break;
      case `/${user}/profile`:
        pathDoc = `./src/usersDocs/${user}/profile`
        fs.mkdirSync(pathDoc, { recursive: true })
        break;
      case '/':
        pathDoc = './src/public/img/products'
        fs.mkdirSync(pathDoc, { recursive: true })
        break;
      default:
        break;
    }
    cb(null, pathDoc);
  },
  filename: (req, file, cb) => {
    let user = req.user.user._id
    let path = req.path
    let originalName;
    let fileExtension;
    let filename;
    switch (path) {
      case `/${user}/documents`:
        originalName = file.originalname.split('.');
        fileExtension = originalName[originalName.length - 1];
        filename = `${file.fieldname}_${req.user.user._id}.${fileExtension}`;
        break;
      case `/${user}/profile`:
        originalName = file.originalname.split('.');
        fileExtension = originalName[originalName.length - 1];
        filename = `${file.fieldname}_${req.user.user._id}.${fileExtension}`;
        break;
      case '/':
        filename = file.originalname;
        break;
      default:
        break;
    }
    cb(null, filename);
  }
});

export const createPassHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePass = (user, password) =>
  bcrypt.compareSync(password, user.password);

export const generateToken = (user) => {
  const token = jwt.sign({ user }, privateKey, { expiresIn: '3600000' });
  return token;
};

export const tokenToRecoveryPass = (user, date) => {
  const token = jwt.sign({ user, date }, privateKey, { expiresIn: '3600000' });
  return token;
}


export const authorizationUser = (role1, role2, role3) => {
  return async (req, res, next) => {
    if (!req.user) {
      req.logger.ERROR('You must be logged in')
      return res.status(401).send({ error: 'Unauthorized user' })
    };
    if (req.user.user.role != role1 && req.user.user.role != role2 && req.user.user.role != role3) {
      req.logger.ERROR('User without permissions')
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
  },
});


export default __dirname;
export const uploader = multer({ storage })
