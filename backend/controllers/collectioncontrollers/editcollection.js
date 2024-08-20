import updateCollectionSingleValue from './editcollectioncontrollers.js/singleValueUpdate.js'
import tagEdit from './editcollectioncontrollers.js/tagEdit.js'
import bulkEdit from './editcollectioncontrollers.js/bulkEdit.js'
import addOnHand from './editcollectioncontrollers.js/addonhand.js'
import ownedPokemonEdit from './editcollectioncontrollers.js/ownedpokemonedit.js'
import optionsEdit from './editcollectioncontrollers.js/optionsedit.js'

import deleteOnHand from './editcollectioncontrollers.js/deleteonhand.js'
import deleteCollectionController from './deletecollection.js'

export const editCollectionFunc = async(req, res) => {
    const {editType} = req.body
    switch(editType) {
        case 'singleValue': return await updateCollectionSingleValue(req, res) 
        case 'tagEdit': return await tagEdit(req, res)
        case 'bulkEdit': return await bulkEdit(req, res)
        case 'addOnHand': return await addOnHand(req, res)
        case 'ownedPokemonEdit': return await ownedPokemonEdit(req, res)
        case 'optionsEdit': return await optionsEdit(req, res)
        default: res.end()
    }
}

export const deleteCollectionFunc = async(req, res) => {
    const {deleteType} = req.body
    switch(deleteType) {
        case 'deleteOnHand': return await deleteOnHand(req, res)
        case 'deleteCollection': return await deleteCollectionController(req, res)
        default: res.end()
    }
}


