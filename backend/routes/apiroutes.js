import e from "express";
const router = e.Router()
import catchAsync from "../utils/catchAsync.js";
import { getSession, checkUsernameEmailAvailability, generateForgotPwTokenAndSendEmail, passJWTTokenToResetPassword, resetPasswordWithJwt } from "../controllers/apicontrollers/apicontrollers.js";

router.get('/session', catchAsync(getSession))
router.get('/username-availability', catchAsync(checkUsernameEmailAvailability))
router.route('/forgot-password').post(catchAsync(generateForgotPwTokenAndSendEmail))
router.route('/reset-password')
    .get(catchAsync(passJWTTokenToResetPassword))
    .put(catchAsync(resetPasswordWithJwt))


export {router}