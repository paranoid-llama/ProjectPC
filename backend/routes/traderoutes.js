import e from 'express'
const router = e.Router()
import catchAsync from '../utils/catchAsync.js'
import { createNewTrade } from '../controllers/tradecontrollers/newtrade.js'
import { getTradeData, getOfferData } from '../controllers/tradecontrollers/gettradedata.js'
import { respondToTrade } from '../controllers/tradecontrollers/traderesponse.js'
import { canOfferTrade, isLoggedIn, canRespondToTrade, isValidId, tradeExists } from '../middleware.js'
import validateNewTradeData from '../controllers/validators/tradevalidator.js'

router.post('/new', isLoggedIn, canOfferTrade, validateNewTradeData, catchAsync(createNewTrade))

router.get('/:id/offer/:offerIdx', isValidId, tradeExists, catchAsync(getOfferData))

router.route('/:id')
    .get(isValidId, tradeExists, catchAsync(getTradeData))
    .put(isValidId, tradeExists, isLoggedIn, canRespondToTrade, catchAsync(respondToTrade))

export {router}