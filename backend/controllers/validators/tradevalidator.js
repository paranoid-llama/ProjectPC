
export default function validateNewTradeData(req, res, next) {
    //certain parts of the trade data is already being validated through canOfferTrade middleware.
    const {offer, receiving, offerMessage} = req.body
    
    const validatedOfferMessage = typeof offerMessage === 'string' && offerMessage.length <= 200
    const validatedOfferData = validateOfferData(offer, receiving)
    // console.log(validatedOfferMessage)
    // console.log(validatedOfferData)

    if (!validatedOfferMessage || !validatedOfferData) {
        const exception = new Error()
        exception.name = 'Bad Request'
        exception.message = `One or more input fields were invalid.`
        exception.status = 400
        return res.status(400).send(exception)
    }
    next()
}

function validateOfferData(offer, receiving) {
    //currently no validation is being done to ensure the pokemon and item data are valid, nor if the value is correct.
    const validatedOffer = typeof offer === 'object' && !Array.isArray(offer) && 
        (Object.keys(offer).length === 3 || Object.keys(offer).length === 2) && 
        (offer.value !== undefined && offer.pokemon !== undefined && (Object.keys(offer).length === 3 ? offer.items !== undefined : true)) &&
        typeof offer.value === 'number' && Array.isArray(offer.pokemon) && (offer.items === undefined ? true : Array.isArray(offer.items))
    const validatedReceiving = typeof receiving === 'object' && !Array.isArray(receiving) && 
        (Object.keys(receiving).length === 3 || Object.keys(receiving).length === 2) && 
        (receiving.value !== undefined && receiving.pokemon !== undefined && (Object.keys(receiving).length === 3 ? receiving.items !== undefined : true)) &&
        typeof receiving.value === 'number' && Array.isArray(receiving.pokemon) && (receiving.items === undefined ? true : Array.isArray(receiving.items))
    const oneSideOfferingSomething = (validatedOffer && validatedReceiving) && 
        (offer.pokemon.length > 0 || receiving.pokemon.length > 0 || (offer.items !== undefined ? offer.items.length > 0 : false) || (receiving.items !== undefined ? receiving.items.length > 0 : false))

    return validatedOffer && validatedReceiving && oneSideOfferingSomething
}