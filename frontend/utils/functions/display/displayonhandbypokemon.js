import { apriballs } from "../../../common/infoconstants/miscconstants.mjs"

export default function displayOnHandByPokemon(onhandList, collectionList) {
    const onlyUniquePokemon = onhandList.filter((p, idx) => onhandList.findIndex(p2 => p2.name === p.name) === idx)
    const displayList = onlyUniquePokemon.map(p => {
        const collectionData = collectionList.filter(cP => cP.name === p.name)[0]
        const possibleBalls = collectionData === undefined ? apriballs : Object.keys(collectionData.balls)

        const noHAMon = p.isHA === undefined
        const numOfBalls = possibleBalls.map(pB => {
            const numOfTotalPb = onhandList.filter(p2 => p2.name === p.name && p2.ball === pB).map(p2 => p2.qty).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
            const numOfNonHaPb = onhandList.filter(p2 => p2.name === p.name && p2.ball === pB && (p2.isHA !== undefined && !(p2.isHA))).map(p2 => p2.qty).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
            const numReserved = onhandList.filter(p2 => p2.name === p.name && p2.ball === pB).map(p2 => p2.reserved).filter(el => el !== undefined).reduce((accumulator, currentValue) => accumulator+currentValue, 0)
            const numGeneral = noHAMon ? {numTotal: numOfTotalPb, reserved: numReserved} : {numTotal: numOfTotalPb, numNonHA: numOfNonHaPb, reserved: numReserved}
            return {ball: pB, number: numGeneral}
        })
        const ballData = {}
        numOfBalls.forEach(bD => {
            ballData[bD.ball] = bD.number
        })
        return {
            name: p.name,
            natDexNum: p.natDexNum,
            imgLink: p.imgLink,
            balls: ballData
        }
    })
    return displayList
}