<<<<<<< HEAD
import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

const searchDB = async(searchType, query, pageNum=undefined) => {
    const skipModifier = pageNum === undefined ? '' : `&skip=${(pageNum-1)*10}`
    const searchResult = await fetch(`${backendurl}/search/${searchType}?query=${query}${skipModifier}`, {
        method: "GET",
        credentials: "include",
        headers: {
            'Access-Control-Allow-Credentials': true
        },
    }).then(async(data) => {return await handleApiResponse(data, true)})
    return searchResult
}

=======
import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL

const searchDB = async(searchType, query, pageNum=undefined) => {
    const skipModifier = pageNum === undefined ? '' : `&skip=${(pageNum-1)*10}`
    const searchResult = await fetch(`${backendurl}/search/${searchType}?query=${query}${skipModifier}`, {
        method: "GET",
        credentials: "include",
        headers: {
            'Access-Control-Allow-Credentials': true
        },
    }).then(async(data) => {return await handleApiResponse(data, true)})
    return searchResult
}

>>>>>>> f33309733d8d71e2016f1a91eacbe582e6f51448
export {searchDB}