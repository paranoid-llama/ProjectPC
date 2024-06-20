import { createSelector } from "@reduxjs/toolkit";
import { valueDefaults } from "../../../../common/infoconstants/miscconstants.mjs";
import { getValueOfPokemon } from "../../../utils/functions/comparecollections/getvalue";

const selectTradeOfferState = (state) => state.tradeOffer

const selectProposedValues = (state, pV) => pV

const selectTradeSide = (state, tS) => tS

const selectIdData = (state, tS, idData) => idData

const selectOneHomeCollection = (state, pV, oneHomeCollection) => oneHomeCollection

const selectIfPokemonIsSelected = createSelector([selectTradeOfferState, selectTradeSide, selectIdData], (tOState, tradeSide, idData) => {
    const activatedPokemon = tOState[tradeSide]
    const pokemonDataInState = activatedPokemon.filter(p => p.name === idData.name)[0]
    const pokemonIsSelected = pokemonDataInState !== undefined && pokemonDataInState.balls.filter(bData => bData.ball === idData.ball && bData.onhandId === idData.onhandId).length !== 0
    return pokemonIsSelected 
})

const selectRelativeValue = createSelector([selectTradeOfferState, selectProposedValues, selectOneHomeCollection], (state, pValues, oneHomeCollection) => {
    const value = {offer: 0, receiving: 0}
    //note: onhand conversion is only done in the context of receiving, and wishlist is only done in the context of offering. else other contexts apply.
    state.offering.forEach(p => {
        const isNonHAMon = p.balls[0].isHA !== true //we are also including pokemon with hidden abilties but it's just false in this calc.
        p.balls.forEach(ball => {
            const isWishListCombo = ball.wanted
            const category = isWishListCombo ? 'Wishlist Aprimon' : isNonHAMon ? 'Non-HA Aprimon' : ''
            const singleValue = getValueOfPokemon(category, pValues)
            value.offer += singleValue
        })
    })
    state.receiving.forEach(p => {
        const isNonHAMon = p.balls[0].isHA !== true
        p.balls.forEach(ball => {
            const onhandCombo = ball.onhandId !== undefined
            const category = (onhandCombo && isNonHAMon) ? 'On-Hand Non-HA Aprimon' : isNonHAMon ? 'Non-HA Aprimon' : onhandCombo ? 'On-Hand HA Aprimon' : ''
            const singleValue = getValueOfPokemon(category, pValues)
            value.receiving += singleValue
        })
    })
    value.offer = value.offer.toFixed(1)
    value.receiving = value.receiving.toFixed(1)
    return value
})

export {selectIfPokemonIsSelected, selectRelativeValue}
