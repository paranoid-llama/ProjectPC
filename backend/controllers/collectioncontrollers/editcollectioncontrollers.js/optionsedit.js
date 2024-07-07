import Collection from '../../../models/collections.js'

export default async function optionsEdit(req, res) {
    //update this route so it sorts the list on its own
    const {id} = req.params
    const {optionType, listType, data, sortedList, newRates, newPreferences, lfItems, ftItems, name, globalDefault} = req.body
    if (optionType === 'sort') {
        const setListModifier = sortedList !== undefined ? listType === 'collection' ? {'ownedPokemon': sortedList} : {'onHand': sortedList} : {}
        await Collection.updateOne({_id: id}, { $set: {[`options.sorting.${listType}`]: data, ...setListModifier} })
        res.end()
    } else if (optionType === 'rates') {
        await Collection.updateOne({_id: id}, { $set: {'options.tradePreferences.rates': newRates} })
        res.end()
    } else if (optionType === 'preferences') {
        await Collection.updateOne({_id: id}, { $set: {'options.tradePreferences': newPreferences} })
        res.end()
    } else if (optionType === 'items') {
        await Collection.updateOne({_id: id}, { $set: {'options.tradePreferences.lfItems': lfItems, 'options.tradePreferences.ftItems': ftItems} })
        res.end()
    } else if (optionType === 'name') {
        const otherSetModifier = globalDefault !== undefined ? { $set: {'options.globalDefaults': globalDefault} } : {}
        await Collection.updateOne({_id: id}, { $set: {'name': name}, ...otherSetModifier })
        res.end()
    } else if (optionType === 'globalDefault') {
        await Collection.updateOne({_id: id}, { $set: {'options.globalDefaults': globalDefault} })
    }
}