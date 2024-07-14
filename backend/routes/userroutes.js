import e from 'express'
const router = e.Router()
import passport from 'passport'
import catchAsync from '../utils/catchAsync.js'
import { createNewUser } from '../controllers/usercontrollers/newuser.js'
import { userLogin, userLogout } from '../controllers/usercontrollers/userlog.js'
import { getUser, getUserTrades } from '../controllers/usercontrollers/getuserdata.js'
import { editUserSettings, readUserNotification } from '../controllers/usercontrollers/edituser.js'
import { isLoggedIn, isTheUser, isValidUsername } from '../middleware.js'
import validateNewUserData from '../controllers/validators/uservalidator.js'

router.post('/new', validateNewUserData, catchAsync(createNewUser))

router.post('/login', passport.authenticate('local'), catchAsync(userLogin))

router.post('/logout', catchAsync(userLogout))

router.put('/settings/:settingType', isLoggedIn, isTheUser, catchAsync(editUserSettings))

router.put('/:username/read-notification', isValidUsername, isLoggedIn, isTheUser, catchAsync(readUserNotification))

router.get('/:username/trades', isValidUsername, catchAsync(getUserTrades))

router.get('/:username', isValidUsername, catchAsync(getUser))

export {router}