import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const searchDB = async(searchType, query, pageNum=undefined) => {
    const skipModifier = pageNum === undefined ? '' : `&skip=${(pageNum-1)*10}`
    const searchResult = await fetch(`${backendurl}/search/${searchType}?query=${query}${skipModifier}`, {
        method: "GET",
        credentials: "include",
        headers: {
            'Access-Control-Allow-Credentials': true
        },
    }).then(async(data) => {return await handleApiResponse(data, true)})
    .catch(e => {return {
        ok: false,
        load: {
            name: 'Internal Server Error',
            message: "Our server has encountered an unexpected error!",
            status: 500
        }
    }})
    return searchResult
}

export {searchDB}