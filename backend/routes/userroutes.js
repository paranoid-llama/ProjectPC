import e from 'express'
const router = e.Router()
import passport from 'passport'
import catchAsync from '../utils/catchAsync.js'
import { createNewUser } from '../controllers/usercontrollers/newuser.js'
import { userLogin, userLogout, passwordCheck } from '../controllers/usercontrollers/userlog.js'
import { getUser, getUserTrades } from '../controllers/usercontrollers/getuserdata.js'
import { editUserSettings, readUserNotification, changeUserPassword } from '../controllers/usercontrollers/edituser.js'
import { deleteUser } from '../controllers/usercontrollers/deleteuser.js'
import { isLoggedIn, isTheUser, isValidUsername } from '../middleware.js'
import validateNewUserData from '../controllers/validators/uservalidator.js'

router.post('/new', validateNewUserData, catchAsync(createNewUser))

router.post('/login', passport.authenticate('local'), catchAsync(userLogin))

router.post('/logout', catchAsync(userLogout))

router.put('/:username/settings/:settingType', isValidUsername, isLoggedIn, isTheUser, catchAsync(editUserSettings))

router.post('/:username/check-password', isValidUsername, isLoggedIn, isTheUser, catchAsync(passwordCheck))

router.put('/:username/read-notification', isValidUsername, isLoggedIn, isTheUser, catchAsync(readUserNotification))

router.get('/:username/trades', isValidUsername, catchAsync(getUserTrades))

router.route('/:username')
    .get(isValidUsername, catchAsync(getUser))
    .put(isValidUsername, isLoggedIn, isTheUser, catchAsync(changeUserPassword))
    .delete(isValidUsername, isLoggedIn, isTheUser, catchAsync(deleteUser))

export {router}