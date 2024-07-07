import passport from "passport";
import LocalStrategy from "passport-local"
import bcrypt from 'bcrypt'
import User from "./models/users.js";

const initializePassportStrategy = () => passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            const user = await User.findOne({$or: [{username}, {email: username}]})
            if (!user) {return done(null, false)}
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false) }
            return done(null, user)
        } catch (e) {
            return done(e)
        }
    }
))

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        const exception = new Error()
        exception.name = "CustomError";

        exception.response = {
            status: 401,
            data: {
            detail: "This is a custom error",
            },
        };
        return res.json()
    }
    next()
}

export {initializePassportStrategy, isLoggedIn}