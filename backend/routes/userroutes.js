import e from 'express'
const router = e.Router()
import passport from 'passport'
import catchAsync from '../utils/catchAsync.js'
import { createNewUser } from '../controllers/usercontrollers/newuser.js'
import { userLogin, userLogout } from '../controllers/usercontrollers/userlog.js'
import { getUser, getUserTrades } from '../controllers/usercontrollers/getuserdata.js'
import { editUserSettings, readUserNotification } from '../controllers/usercontrollers/edituser.js'

router.post('/new', catchAsync(createNewUser))

router.post('/login', passport.authenticate('local'), catchAsync(userLogin))

router.post('/logout', catchAsync(userLogout))

router.put('/settings/:settingType', catchAsync(editUserSettings))

router.put('/:username/read-notification', catchAsync(readUserNotification))

router.get('/:username/trades', catchAsync(getUserTrades))

router.get('/:username', catchAsync(getUser))

export {router}