import e from 'express'
const router = e.Router()
import catchAsync from '../utils/catchAsync.js'
import { createNewTrade } from '../controllers/tradecontrollers/newtrade.js'
import { getTradeData, getOfferData } from '../controllers/tradecontrollers/gettradedata.js'
import { respondToTrade } from '../controllers/tradecontrollers/traderesponse.js'
import { canOfferTrade, isLoggedIn, canRespondToTrade, isValidId } from '../middleware.js'
import validateNewTradeData from '../controllers/validators/tradevalidator.js'

router.post('/new', isLoggedIn, canOfferTrade, validateNewTradeData, catchAsync(createNewTrade))

router.get('/:id/offer/:offerIdx', isValidId, catchAsync(getOfferData))

router.route('/:id')
    .get(isValidId, catchAsync(getTradeData))
    .put(isValidId, isLoggedIn, canRespondToTrade, catchAsync(respondToTrade))

export {router}