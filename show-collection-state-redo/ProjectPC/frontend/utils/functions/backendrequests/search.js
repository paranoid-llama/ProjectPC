const searchDB = async(searchType, query, pageNum=undefined) => {
    const skipModifier = pageNum === undefined ? '' : `&skip=${(pageNum-1)*10}`
    const searchResult = await fetch(`http://localhost:3000/search/${searchType}?query=${query}${skipModifier}`, {
        method: "GET",
        credentials: "include",
        headers: {
            'Access-Control-Allow-Credentials': true
        },
    }).then(data => data.json())
    return searchResult
}

export {searchDB}