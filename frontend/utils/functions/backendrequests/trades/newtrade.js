import handleApiResponse from "../handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

export const newTradeBackendFormatting = (pokemonOffer, itemOffer, pokemonReceiving, itemReceiving, offerValue, receivingValue, traderGen, ownerGen) => {
    const formattedGen = traderGen === ownerGen ? ownerGen : `${traderGen}-${ownerGen}`

    // const formattedPokemonOffer = pokemonOffer.length !== 0 && 
    //     pokemonOffer.map((p) => {
    //         const ballsFormatted = p.balls.map(ball => {
    //             const haSection = ball.isHA !== undefined ? {isHA: ball.isHA} : {}
    //             const emSection = ball.emCount !== undefined ? {emCount: ball.emCount, EMs: ball.EMs} : {}
    //             const onhandThing = ball.onhandId !== undefined ? {onhandId: ball.onhandId} : {}
    //             const wanted = ball.wanted !== undefined ? {wanted: ball.wanted} : {}
    //             return {ball: ball.ball, ...haSection, ...emSection, ...onhandThing, ...wanted}
    //         })
    //         const pData = p.balls[0].for !== undefined ? {...p, for: p.balls[0].for, balls: ballsFormatted} : {...p, balls: ballsFormatted}
    //         return pData
    //     })

    // const formattedPokemonReceiving = pokemonReceiving.length !== 0 && 
    //     pokemonReceiving.map((p) => {
    //         const ballsFormatted = p.balls.map(ball => {
    //             const haSection = ball.isHA !== undefined ? {isHA: ball.isHA} : {}
    //             const emSection = ball.emCount !== undefined ? {emCount: ball.emCount, EMs: ball.EMs} : {}
    //             const onhandThing = ball.onhandId !== undefined ? {onhandId: ball.onhandId} : {}
    //             const wanted = ball.wanted !== undefined ? {wanted: ball.wanted} : {}
    //             return {ball: ball.ball, ...haSection, ...emSection, ...onhandThing, ...wanted}
    //         })
    //         const pData = p.balls[0].for !== undefined ? {...p, for: p.balls[0].for, balls: ballsFormatted} : {...p, balls: ballsFormatted}
    //         return pData
    //     })

    const offerP = {pokemon: pokemonOffer.length !== 0 ? pokemonOffer : []} 
    const offerI = {items: itemOffer.length !== 0 ? itemOffer : []}
    const receiveP = {pokemon: pokemonReceiving.length !== 0 ? pokemonReceiving : []} 
    const receiveI = {items: itemReceiving.length !== 0 ? itemReceiving : []}
    const formattedOffer = {
        value: offerValue,
        ...offerP,
        ...offerI
    }
    const formattedReceiving = {
        value: receivingValue,
        ...receiveP,
        ...receiveI
    }

    return {offer: formattedOffer, receiving: formattedReceiving, gen: formattedGen}
}

export const newTradeBackend = async(offer, receiving, offerMessage, traderId, ownerId, traderUsername, ownerUsername, gen, traderColId) => {
    return await fetch(`${backendurl}/trades/new`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({offer, receiving, offerMessage, traderId, ownerId, traderUsername, ownerUsername, gen, traderColId})
    }).then(async(data) => {return await handleApiResponse(data, true)})
}