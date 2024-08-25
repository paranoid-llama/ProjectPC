import Collection from '../models/collections.js'
import User from '../models/users.js'

export const collectionProgressAggField = {
    $addFields: {
        progress: {
            $concat: [
                {$toString: {$sum: {$map: {
                    input: {$filter: {
                        input: "$ownedPokemon",
                        as: 'pokemon',
                        cond: {$not: '$$pokemon.disabled'}
                    }},
                    as: 'enabledPokemon',
                    in: {$sum: {$map: {
                        input: {$filter: {input: {$objectToArray: '$$enabledPokemon.balls'}, as: 'ballValues', cond: {$not: '$$ballValues.v.disabled'}}},
                        as: 'ballObj',
                        in: {$cond: {if: '$$ballObj.v.isOwned', then: 1, else: 0}}
                    }}}
                }}}},
                '/',
                {$toString: {$sum: {$map: {
                    input: {$filter: {
                        input: "$ownedPokemon",
                        as: 'pokemon',
                        cond: {$not: '$$pokemon.disabled'}
                    }},
                    as: 'enabledPokemon',
                    in: {$sum: {$map: {
                        input: {$filter: {input: {$objectToArray: '$$enabledPokemon.balls'}, as: 'ballValues', cond: {$not: '$$ballValues.v.disabled'}}},
                        as: 'ballObj',
                        in: {$cond: {if: '$$ballObj.v', then: 1, else: 0}}
                    }}}
                }}}}
            ]
        }
    }
}

export default async function searchDatabases(req, res) {
    const {searchType} = req.params
    const {query, skip} = req.query
    const emptyQuery = query === ''
    const maxDocs = searchType === 'all' ? 5 : 10
    const searchCollections = searchType === 'all' || searchType === 'collections'
    const searchUsers = searchType === 'all' || searchType === 'users'
    const regex = new RegExp(query, 'i')
    const searchQueries = {
        collections: emptyQuery ? {} : {$or: [{name: regex}, {'owner.username': regex}, {type: regex}, {gen: regex}]},
        users: emptyQuery ? {} : {username: regex}
    }

    const queryCollectionAggregate = [
        {
            $lookup: {
                from: 'users',
                localField: 'owner',
                foreignField: '_id',
                as: 'owner'
            }
        },
        {$match: searchQueries.collections}
    ]

    const collectionCountAggregate = [
        ...queryCollectionAggregate,
        {$count: "totalCollections"}
    ]

    const collectionAggregate = [
        ...queryCollectionAggregate,
        {$skip: skip === undefined ? 0 : parseInt(skip)},
        {$limit: maxDocs},
        collectionProgressAggField,
        {$project: {_id: true, name: true, 'owner.username': true, type: true, gen: true, progress: true}}
    ]
    // const searchOperations = {
    //     collections: searchCollections ? Collection.aggregate(collectionAggregate).exec : [],
    //     users: searchUsers ? User.find(searchQueries.users, '_id username').lean().populate({path: 'collections'}).exec : []
    // }

    const collectionCountStep1 = searchCollections ? await Collection.aggregate(collectionCountAggregate, {maxTimeMS: 750}) : 0

    const searchResult = {
        collections: searchCollections ? await Collection.aggregate(collectionAggregate).exec() : [],
        users: searchUsers ? await User.find(searchQueries.users, '_id username settings.profile.badges accountType').skip(skip === undefined ? 0 : skip).limit(maxDocs).lean().populate({path: 'collections', select: 'type -_id -owner'}).exec() : [],
        collectionCount: (collectionCountStep1[0] === undefined || collectionCountStep1 === 0) ? 0 : collectionCountStep1[0].totalCollections,
        userCount: searchUsers ? await User.countDocuments(searchQueries.users, {maxTimeMS: 750}) : 0,
    }

    res.json(searchResult)
}