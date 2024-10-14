import handleApiResponse from "../handleapiresponse";

const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export default async function changeTableDataBackendRequest(allPokemon, pokemonName, newKey, newValue) {
    return await fetch(`${backendurl}/api/admin/change-table-data`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({allPokemon, pokemonName, newKey, newValue}),
    }).then(async(data) => {return await handleApiResponse(data, false)})
}