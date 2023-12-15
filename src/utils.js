import multer from 'multer';  
import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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


export default __dirname;
export const uploader = multer({storage})