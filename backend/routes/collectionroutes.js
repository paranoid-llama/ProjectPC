import e from "express";
const router = e.Router()
import catchAsync from "../utils/catchAsync.js";
import { getCollectionController, retrievePokemonGroups } from "../controllers/collectioncontrollers/getcollections.js";
import { editCollectionFunc, deleteCollectionFunc } from "../controllers/collectioncontrollers/editcollection.js";
import { createNewCollection, importCollectionFromSheets } from "../controllers/collectioncontrollers/newcollection.js";
import { isLoggedIn } from "../middleware.js";

router.get('/pokemongroups', catchAsync(retrievePokemonGroups))

router.post('/new/import', catchAsync(importCollectionFromSheets))

router.post('/new', isLoggedIn, catchAsync(createNewCollection))

router.route('/:id')
    .get(catchAsync(getCollectionController))
    .put(catchAsync(editCollectionFunc))
    .delete(catchAsync(deleteCollectionFunc)) //delete collection function currently only deletes on-hand pokemon

export {router}