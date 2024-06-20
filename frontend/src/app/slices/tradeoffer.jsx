import { createSlice } from "@reduxjs/toolkit";

const tradeOffer = createSlice({
    name: 'tradeOffer',
    initialState: {offering: [], receiving: [], offeringItems: [], receivingItems: []},
    reducers: {
        setPokemon: (state, action) => {
            const {pData, ballData, tradeSide} = action.payload
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
                isFirstTimeSelected ? [...state[tradeSide], {name: pData.name, id: pData.id, natDexNum: pData.natDexNum, balls: [{...ballData}]}] :
                state[tradeSide].map(d => {
                    const isPokemon = d.name === pData.name 
                    const newData = isPokemon ? {...d, balls: [...d.balls, {...ballData}]} : d
                    return newData
                })
            return {...state, [tradeSide]: newSideState}
        },
        resetTradeData: (state, action) => {return {offering: [], receiving: [], offeringItems: [], receivingItems: []}}
    }
})

export const {setPokemon, resetTradeData} = tradeOffer.actions

export default tradeOffer