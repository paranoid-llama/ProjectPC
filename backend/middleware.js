import passport from "passport";
import LocalStrategy from "passport-local"
import bcrypt from 'bcrypt'
import User from "./models/users.js";

const initializePassportStrategy = () => passport.use(new LocalStrategy(
    async function (username, password, done) {
        try {
            const user = await User.findOne({ username })
            if (!user) {return done(null, false)}
            if (!bcrypt.compareSync(password, user.password)) { return done(null, false) }
            return done(null, user)
        } catch (e) {
            return done(e)
        }
    }
))

export {initializePassportStrategy}