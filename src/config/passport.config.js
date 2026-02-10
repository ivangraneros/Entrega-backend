import passport from 'passport';
import local from 'passport-local';
import passportJWT from 'passport-jwt';
import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const buscarToken = (req) => {
    let token = null;

    if (req && req.cookies) {
        token = req.cookies["tokencookie"];
    }

    return token
}

export const configPassport = () => {

    passport.use("login", new local.Strategy(
        {
            usernameField: "email",
        },
        async (email, password, done) => {
            try {
                const user = await userModel.findOne({ email })
                if (!user) {
                    return done(null, false, { message: "Usuario no encontrado" });
                }
                
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false, { message: "credenciales invalidas" });
                }
                return done(null, user);

            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use("jwt", new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([buscarToken]),
            secretOrKey: "secretKey"
        }, async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (error) {
                return done(error);
            }
}))

}
