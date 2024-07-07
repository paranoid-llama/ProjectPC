import e from "express";
const router = e.Router()
import catchAsync from "../utils/catchAsync.js";
import { getSession, checkUsernameEmailAvailability } from "../controllers/apicontrollers/apicontrollers.js";

router.get('/session', catchAsync(getSession))
router.get('/username-availability', catchAsync(checkUsernameEmailAvailability))

export {router}