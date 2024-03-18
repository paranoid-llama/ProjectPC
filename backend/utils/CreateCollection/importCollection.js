const {gapIdentifiers, regions}= require('../../infoconstants.js')

function formatImportQuery(query, lastItem=false) {
    return (query === undefined || typeof query === 'object') ? lastItem ? '' : '&' : lastItem ? `&${query}` : `&${query}&`
}

function setEMQueries(EM1, EM2, EM3, EM4, putFirstAnd) {
    const emQuery = EM1 === undefined ? '' : `${putFirstAnd ? '&' : ''}${EM1}&${EM2}&${EM3}&${EM4}`
    return emQuery
}

function formatImportedValues(type, arr, gapRows, ballOrder=[], gapIdType='none') {
    //gapIdType essentially controls which arr (dexNum or name, pref dexNum) is used to identify gaps list (to display generation name and categorize list)
    if (type === 'gapIdxs') {
        const gapIdByName = gapIdType === 'names'
        const gapRowIdxs = gapIdByName ? arr.map((v, idx) => {
            const isGapIdentifier = gapIdentifiers.map((gi) => {
                if (v.length !== 0) {
                    const isRegionName = regions.includes(gi)
                    const check = isRegionName ? v[0].toLowerCase() === gi.toLowerCase() : v[0].toLowerCase().includes(gi.toLowerCase())
                    return check
                }
                return false
            }).filter(item => item === true)
            const isGap = v.length === 0 || (v[0] !== undefined && isGapIdentifier.includes(true))
            return isGap ? idx : undefined
        }).filter(idx => idx !== undefined) : 
        arr.map((v, idx) => {
            const isGap = v.length === 0 || (v[0] !== undefined && isNaN(v[0]))
            return isGap ? idx : undefined
        }).filter(idx => idx !== undefined)
        return gapRowIdxs
    } else if (type === 'dexNum') {
        const formattedDexNums = arr.filter((item, idx) => !gapRows.includes(idx)).flat().map((idx) => parseInt(idx))
        return formattedDexNums
    } else if (type === 'names') {
        const formattedNames = arr.filter((item, idx) => !gapRows.includes(idx)).flat()
        return formattedNames
    } else if (type === 'balls') {
        const formattedBallInfo = arr.filter((item, idx) => !gapRows.includes(idx))
        return formattedBallInfo
    }
}

module.exports = {formatImportQuery, setEMQueries, formatImportedValues}
