import passport from 'passport';
import local from "passport-local";
import { createPassHash, validatePass } from "../utils.js";
import userModel from "../dao/models/users.model.js";


const strategyLocal = local.Strategy;

const initPassport = () => {
    passport.use('register', new strategyLocal({ passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
          try {
            let user = await userModel.findOne({ email: username });
            if (user) {
              console.log("El usuario ya está registrado");
              return done(null, false);
            }
            const userNew = new userModel({ first_name, last_name, email, age, password: createPassHash(password) });
            await userNew.save();
            return done(null, userNew);
          } catch (error) {
            return done('Error al crear el usuario', error);
          }
        }
      )
    );
  
    passport.use("login",new strategyLocal({ usernameField: 'email'},
        async (username, password, done) => {
          try {
            const userToLogin = await userModel.findOne({ email: username });
            if (!user) {
              console.log('Usuario y/o contraseña invalidos');
              return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                return done(null, false);
            }
            return done(null, userToLogin);
          } catch (error) {
            return done('Error al iniciar sesión', error);
          }
        }
      )
    );
  };
  
  passport.serializeUser((user, done) => {
    console.log(user._id);
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
  });
  
  export default initPassport;
