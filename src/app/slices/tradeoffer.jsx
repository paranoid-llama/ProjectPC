import { createSlice } from "@reduxjs/toolkit";

const tradeOffer = createSlice({
    name: 'tradeOffer',
    initialState: {offering: [], receiving: [], offeringItems: [], receivingItems: []},
    reducers: {
        setPokemon: (state, action) => {
            const {pData, ballData, tradeSide} = action.payload
            if (ballData.for !== undefined) {
                pData.for = ballData.for
                delete ballData.for
            }
            const includeForData = pData.for !== undefined ? {for: pData.for} : {}
            const pokemonDataInState = state[tradeSide].filter(d => d.name === pData.name)[0]
            const isInData = pokemonDataInState !== undefined && pokemonDataInState.balls.filter(bData => (bData.ball === ballData.ball && bData.onhandId === ballData.onhandId))[0] !== undefined
            const isLastSelectedBall = isInData && pokemonDataInState.balls.length === 1
            const isFirstTimeSelected = pokemonDataInState === undefined
            const newSideState = isLastSelectedBall ? state[tradeSide].filter(d => d.name !== pData.name) :
                isInData ? state[tradeSide].map(d => {
                    const isPokemon = d.name === pData.name 
                    const newData = isPokemon ? {...d, balls: d.balls.filter(bData => (bData.onhandId === undefined && bData.ball !== ballData.ball) || (bData.onhandId !== undefined && bData.onhandId !== ballData.onhandId))} : d
                    return newData
                }) : 
                isFirstTimeSelected ? [...state[tradeSide], {name: pData.name, id: pData.id, natDexNum: pData.natDexNum, ...includeForData, balls: [{...ballData}]}] :
                state[tradeSide].map(d => {
                    const isPokemon = d.name === pData.name 
                    const newData = isPokemon ? {...d, balls: [...d.balls, {...ballData}]} : d
                    return newData
                })
            return {...state, [tradeSide]: newSideState}
        },
        resetTradeData: (state, action) => {return {offering: [], receiving: [], offeringItems: [], receivingItems: []}},
        setItems: (state, action) => {
            const {itemValueName, newQty, tradeSide} = action.payload
            const itemInState = state[`${tradeSide}Items`].filter(item => item.name === itemValueName)[0]
            const itemIsThereAlready = itemInState !== undefined
            const removeItem = newQty === 0
            const newTradeSideState = removeItem ? state[`${tradeSide}Items`].filter(item => item.name !== itemValueName) : 
                itemIsThereAlready ? state[`${tradeSide}Items`].map(item => {
                const isItem = item.name === itemValueName
                return isItem ? {...item, qty: newQty} : item
            }) : [...state[`${tradeSide}Items`], {name: itemValueName, qty: newQty}]
            return {...state, [`${tradeSide}Items`]: newTradeSideState}
        }
    }
})

export const {setPokemon, resetTradeData, setItems} = tradeOffer.actions

export default tradeOffer