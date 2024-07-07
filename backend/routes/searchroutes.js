import e from "express";
const router = e.Router()
import catchAsync from "../utils/catchAsync.js";
import searchDatabases from "../controllers/searchcontroller.js";

router.get('/:searchType', catchAsync(searchDatabases))

export {router}