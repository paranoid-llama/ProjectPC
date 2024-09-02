import Collection from '../../../models/collections.js'

export default async function updateCollectionSingleValue(req, res) { 
    const {id} = req.params
    const {newOwnedPokemonArr, newOnhand} = req.body
    
    const setModifier = newOnhand === undefined ? {$set: {ownedPokemon: newOwnedPokemonArr}} : 
        newOwnedPokemonArr === undefined ? {$set: {onHand: newOnhand}} : {$set: {ownedPokemon: newOwnedPokemonArr, onHand: newOnhand}}
    
    await Collection.findOneAndUpdate({
        _id: id
        }, setModifier
    )
    res.end()
}

//old ver which updated collection on EVERY value change
// export default async function updateCollectionSingleValue(req, res) {
//     const changedField = Object.keys(req.body)[2]
//     const newValueOfChangedField = Object.values(req.body)[2]
//     const {pokename, ballname, idOfPokemon, onhandPokemon, otherFieldsData} = req.body //idofpokemon is only for onhand pokemon
//     const {id} = req.params

//     if (onhandPokemon === true) {
//         const setModifier = { $set: {
//             [`onHand.$.${changedField}`]: newValueOfChangedField
//         }}
//         await Collection.updateOne({
//             _id: id,
//             'onHand._id': idOfPokemon
//             }, setModifier
//         )
//     } else {
//         if (changedField === 'isOwned' && newValueOfChangedField === true) {
//             const setDefaults = otherFieldsData !== undefined
//             const otherSetModifiers = {}
//             if (setDefaults) {
//                 const fieldsChanged = Object.keys(otherFieldsData)
//                 for (let field of fieldsChanged) {
//                     otherSetModifiers[`ownedPokemon.$.balls.${ballname}.${field}`] = otherFieldsData[field]
//                 }
//             }
//             const setModifier = { $set: {
//                 [`ownedPokemon.$.balls.${ballname}.${changedField}`]: newValueOfChangedField,
//                 ...otherSetModifiers
//             }, $unset: {
//                 [`ownedPokemon.$.balls.${ballname}.highlyWanted`]: "",
//                 [`ownedPokemon.$.balls.${ballname}.pending`]: ""
//             }}

//             await Collection.findOneAndUpdate({
//                 _id: id, 
//                 "ownedPokemon.name": pokename
//                 }, setModifier, 
//             )
//         } else {
//             const setOtherEmField = otherFieldsData !== undefined && (changedField === 'emCount' || changedField === 'EMs')
//             const otherSetModifier = {}
//             if (setOtherEmField) {
//                 const otherField = changedField === 'emCount' ? 'EMs' : 'emCount'
//                 otherSetModifier[`ownedPokemon.$.balls.${ballname}.${otherField}`] = otherFieldsData[otherField]
//             }
//             const setModifier = { $set: {
//                 [`ownedPokemon.$.balls.${ballname}.${changedField}`]: newValueOfChangedField,
//                 ...otherSetModifier
//             }}

//             await Collection.updateOne({
//                 _id: id, 
//                 "ownedPokemon.name": pokename
//                 }, setModifier
//             )
//         }
//     }
//     res.end()
// }