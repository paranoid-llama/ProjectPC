import e from "express";
const router = e.Router()
import catchAsync from "../utils/catchAsync.js";
import { getCollectionController, retrievePokemonGroups } from "../controllers/collectioncontrollers/getcollections.js";
import { editCollectionFunc, deleteCollectionFunc } from "../controllers/collectioncontrollers/editcollection.js";
import { createNewCollection, importCollectionFromSheets } from "../controllers/collectioncontrollers/newcollection.js";
import { isLoggedIn, isCollectionOwner, isValidId, isValidOnHandId } from "../middleware.js";
import validateNewCollectionData from "../controllers/validators/collectionvalidator.js";
import { validateNewOnHand } from "../controllers/validators/collectionvalidator.js";

router.get('/pokemongroups', catchAsync(retrievePokemonGroups))

router.post('/new/import', isLoggedIn, catchAsync(importCollectionFromSheets))

router.post('/new', isLoggedIn, validateNewCollectionData, catchAsync(createNewCollection))

router.route('/:id')
    .get(isValidId, catchAsync(getCollectionController))
    .put(isValidId, isLoggedIn, isCollectionOwner, validateNewOnHand, isValidOnHandId, catchAsync(editCollectionFunc))
    .delete(isValidId, isLoggedIn, isCollectionOwner, isValidOnHandId, catchAsync(deleteCollectionFunc)) //delete collection function currently only deletes on-hand pokemon

export {router}