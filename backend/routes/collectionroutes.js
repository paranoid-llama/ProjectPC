import e from "express";
const router = e.Router()
import catchAsync from "../utils/catchAsync.js";
import { getCollectionController, retrievePokemonGroups } from "../controllers/collectioncontrollers/getcollections.js";
import { editCollectionFunc, deleteCollectionFunc } from "../controllers/collectioncontrollers/editcollection.js";
import { createNewCollection, importCollectionFromSheets } from "../controllers/collectioncontrollers/newcollection.js";
import { isLoggedIn, isCollectionOwner, isValidId } from "../middleware.js";
import validateNewCollectionData from "../controllers/validators/collectionvalidator.js";

router.get('/pokemongroups', catchAsync(retrievePokemonGroups))

router.post('/new/import', isLoggedIn, catchAsync(importCollectionFromSheets))

router.post('/new', isLoggedIn, validateNewCollectionData, catchAsync(createNewCollection))

router.route('/:id')
    .get(isValidId, catchAsync(getCollectionController))
    .put(isValidId, isLoggedIn, isCollectionOwner, catchAsync(editCollectionFunc))
    .delete(isValidId, isLoggedIn, isCollectionOwner, catchAsync(deleteCollectionFunc)) //delete collection function currently only deletes on-hand pokemon

export {router}