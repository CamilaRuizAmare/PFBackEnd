import multer from 'multer';  
import jwt from 'jsonwebtoken'; 
import passport from 'passport';
import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt";
import 'dotenv/config.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const privateKey = process.env.privateKey;

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
  const token = jwt.sign({user}, privateKey, {expiresIn: '2h'});
  console.log(token);
  return token;
};


export const authorizationUser = (role) => {
  return async (req, res, next) => {
    if(!req.user){
      return res.status(401).send({error: 'Unauthorized user'})
    };
    if(req.user.user.role != role){
      return res.status(403).send({error: 'User without permissions'})
    }
    next();
  };
}

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if(error) {
        return next(error);
      };
      if(!user) {
        return res.status(401).send({error: info.messages?.info, messages: info.toString()})
      }
      req.user = user;
      next();
    })(req, res, next);
  };
};

export default __dirname;
export const uploader = multer({storage})