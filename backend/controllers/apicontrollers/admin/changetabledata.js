import Collection from "../../../models/collections.js";

export default async function changeTableData(req, res) {
    //this controller is very underdeveloped as it was only used to update isHA for ferroseed. It can only add boolean keys to peripheral data.

    const {allPokemon, pokemonName, newKey, newValue} = req.body

    const allCollections = await Collection.find({})

    allCollections.forEach(col => {
        const newOp = col.ownedPokemon.map(p => {
            if (allPokemon) {
                const newBallsObj = {}
                Object.keys(p.balls).forEach(ball => {
                    const ballData = p.balls[ball]
                    newBallsObj[ball] = {...ballData, [newKey]: newValue.toLowerCase() === 'true'} //converts to bool
                })
                return {...p, balls: newBallsObj}
            }
            else {
                if (!(p.name.toLowerCase() === pokemonName.toLowerCase())) {
                    return p
                }
                else {
                    const newBallsObj = {}
                    Object.keys(p.balls).forEach(ball => {
                        const ballData = p.balls[ball]
                        newBallsObj[ball] = {...ballData, [newKey]: newValue.toLowerCase() === 'true'} //converts to bool
                    })
                    return {...p, balls: newBallsObj}
                }
            }
        })
        col.ownedPokemon = newOp
        col.save()
    })

    res.end()
}