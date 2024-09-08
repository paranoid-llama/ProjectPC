const hideFullSets = (collectionList) => {
    return collectionList.filter(p => {
        const isFullSet = !Object.keys(p.balls).map(b => {
            return p.balls[b].isOwned
        }).includes(false)
        return !isFullSet
    })
}

export {hideFullSets}