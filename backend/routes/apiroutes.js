import e from "express";
const router = e.Router()
import catchAsync from "../utils/catchAsync.js";
import { isSiteOwner } from "../middleware.js";
import { getSession, checkUsernameEmailAvailability, generateForgotPwTokenAndSendEmail, passJWTTokenToResetPassword, resetPasswordWithJwt, sendEmailToLlama } from "../controllers/apicontrollers/apicontrollers.js";
import sendNotifications from "../controllers/apicontrollers/admin/sendnotifications.js";
import changeTableData from "../controllers/apicontrollers/admin/changetabledata.js";

router.get('/session', catchAsync(getSession))
router.get('/username-availability', catchAsync(checkUsernameEmailAvailability))
router.post('/send-user-message', catchAsync(sendEmailToLlama))
router.route('/forgot-password').post(catchAsync(generateForgotPwTokenAndSendEmail))
router.route('/reset-password')
    .get(catchAsync(passJWTTokenToResetPassword))
    .put(catchAsync(resetPasswordWithJwt))

router.post('/admin/send-notifications', isSiteOwner, catchAsync(sendNotifications))
router.put('/admin/change-table-data', isSiteOwner, catchAsync(changeTableData))

export {router}