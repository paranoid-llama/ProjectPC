import e from 'express'
const router = e.Router()
import catchAsync from '../utils/catchAsync.js'
import { createNewTrade } from '../controllers/tradecontrollers/newtrade.js'
import { getTradeData, getOfferData } from '../controllers/tradecontrollers/gettradedata.js'
import { respondToTrade } from '../controllers/tradecontrollers/traderesponse.js'

router.post('/new', catchAsync(createNewTrade))

router.get('/:id/offer/:offerIdx', catchAsync(getOfferData))

router.route('/:id')
    .get(catchAsync(getTradeData))
    .put(catchAsync(respondToTrade))

export {router}