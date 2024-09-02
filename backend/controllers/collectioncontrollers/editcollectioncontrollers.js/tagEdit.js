import Collection from '../../../models/collections.js'

//unused

export default async function tagEdit(req, res) {
    const {tag, activeTag, pokename, ballname, isDefaultModifier} = req.body
    const {id} = req.params

    //currently only highlyWanted and pending tags available
    const otherTag = tag === 'highlyWanted' ? 'pending' : 'highlyWanted'

    const setModifier = tag !== activeTag ? activeTag !== 'none' ? 
        { $set: {
            [`ownedPokemon.$.balls.${ballname}.${tag}`]: true
        }, $unset: {
            [`ownedPokemon.$.balls.${ballname}.${otherTag}`]: ""
        }} : { $set: {
            [`ownedPokemon.$.balls.${ballname}.${tag}`]: true
        }} :
        { $unset: {
            [`ownedPokemon.$.balls.${ballname}.${tag}`]: ""
        }}

    const setModifierDefault = tag !== activeTag ? activeTag !== 'none' ? 
        { $set: {
            [`ownedPokemon.$.balls.${tag}.default`]: true
        }, $unset: {
            [`ownedPokemon.$.balls.${activeTag}.default`]: ""
        }} : { $set: {
            [`ownedPokemon.$.balls.${tag}.default`] : true
        }} : { $unset: {
            [`ownedPokemon.$.balls.${tag}.default`] : ""
        }}
    
    if (isDefaultModifier) {
        await Collection.updateOne({
            _id: id,
            "ownedPokemon.name": pokename
        }, setModifierDefault)
    } else {
        await Collection.updateOne({
            _id: id,
            "ownedPokemon.name": pokename
        }, setModifier)
    }

    res.end()
}