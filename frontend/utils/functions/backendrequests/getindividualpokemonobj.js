import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default async function getIndividualPokemonObjBackend(newPokemon, ballScope, demoCollectionData) {
    const addedPokemonReq = await fetch(`${backendurl}/collections/demo/get-pokemon-data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newPokemon, ballScope, demoCollectionData}) //implied will update egg move data
    }).then(async(data) => {return await handleApiResponse(data, true)})
    return addedPokemonReq
}