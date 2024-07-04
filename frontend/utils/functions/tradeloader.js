export default async function tradeLoader({params}, getFullCollectionData=false) {
    const tradeData = await fetch(`http://localhost:3000/trades/${params.id}?getFullCollectionData=${getFullCollectionData}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    }).then(data => data.json())
    // .then(data => { //bandaid solution to what should be solved through database querying tools
    //     const tradeData = data.tradeData
    //     const crossGenTrade = tradeData.gen.includes('-')
    //     const newUsersArr = tradeData.users.map((userData, userIdx) => {
    //         const genRef = crossGenTrade ? (
    //             userIdx === 0 ? tradeData.gen.slice(0, tradeData.gen.indexOf('-')) : tradeData.gen.slice(tradeData.gen.indexOf('-')+1)
    //         ) : tradeData.gen
    //         const tradeCollectionData = userData.collections.filter(col => col.gen === genRef)[0]
    //         return {...userData, tradeCollection: tradeCollectionData}
    //     })
    //     return {...data, tradeData: {...tradeData, users: newUsersArr}}
    // })
    return tradeData
}