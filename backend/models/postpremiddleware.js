import Collection from './collections.js'
import User from './users.js'
import Trade from './trades.js'
import { setPendingTrade } from '../controllers/tradecontrollers/colmanagementfuncs.js'
import { collectionProgressAggField } from '../controllers/searchcontroller.js'

export const postDeleteColEditTradeCol = async (trade, userPos) => {
    const latestOffer = trade.history[trade.history.length-1]
    const otherUser = await User.findById(trade.users.filter((id, idx) => idx !== userPos)[0]).populate({path: 'collections', select: 'gen'})
    const otherUserCol = await Collection.findById(otherUser.collections.filter(col => {
        const userPos = trade.users.indexOf(otherUser._id)
        const gen = trade.gen.includes('-') ? (userPos === 0 ? trade.gen.slice(0, trade.gen.indexOf('-')) : trade.gen.slice(trade.gen.indexOf('-')+1, trade.gen.length)) : trade.gen
        return gen === col.gen
    })[0]._id)
    const otherUserOfferRef = latestOffer.offerer === otherUser.username ? 'offerer' : 'recipient'
    const {
        newOfferColOp, 
        newReceivingColOp, 
        newOfferColOnhand, 
        newReceivingColOnhand} = setPendingTrade(otherUserOfferRef === 'offerer' ? otherUserCol : undefined, otherUserOfferRef === 'recipient' ? otherUserCol : undefined, latestOffer, true)
    otherUserCol.ownedPokemon = otherUserOfferRef === 'offerer' ? newOfferColOp : newReceivingColOp
    otherUserCol.onHand = otherUserOfferRef === 'offerer' ? newOfferColOnhand : newReceivingColOnhand   
    otherUserCol.save()  

    otherUser.notifications.filter(noti => noti.tradeData === undefined ? true : noti.tradeData.tradeId.toString() !== trade._id.toString())
    otherUser.notifications.push({type: 'trade-offer: cancel', tradeData: {otherParticipant: latestOffer.offerer === otherUser.username ? latestOffer.recipient : latestOffer.offerer, tradeGen: trade.gen, tradeId: trade._id}, unread: true})
    if (otherUser.notifications.length > 40) {
        otherUser.notifications.shift()
    }   
    otherUser.save()
}


export const deletedUserNotifications = async (deletedUsername) => {
    const allAffectedUsers = await User.find({$or: [{'settings.privacy.blockedUsers': deletedUsername}, {'notifications.tradeData.otherParticipant': deletedUsername}]})
    allAffectedUsers.forEach(async(user) => {
        user.settings.privacy.blockedUsers = user.settings.privacy.blockedUsers.filter(username => username !== deletedUsername)
        user.notifications = user.notifications.map(noti => {
            const affectedNotification = noti.type.includes('trade-offer') && noti.tradeData !== undefined && noti.tradeData.otherParticipant === deletedUsername
            if (affectedNotification) {
                noti.tradeData.otherParticipant = 'deleted'
            } 
            return noti
        })
        await user.save()
    })
} 

// export const checkBadges = (user) => {

// }

export const getCollectionProgressPercent = (col, getPercent=true) => {
    const pokemonToCollect = col.ownedPokemon.reduce((accum, currValue) => {
        const num = currValue.disabled ? 0 : Object.keys(currValue.balls).reduce((accum2, currValue2) => {
            const toCollect = currValue.balls[currValue2].disabled ? 0 : 1
            return accum2+toCollect
        }, 0)
        return num+accum
    }, 0)
    const pokemonCurrCollected = getPercent && col.ownedPokemon.reduce((accum, currValue) => {
        const num = currValue.disabled ? 0 : Object.keys(currValue.balls).reduce((accum2, currValue2) => {
            const toCollect = currValue.balls[currValue2].disabled ? 0 : currValue.balls[currValue2].isOwned ? 1 : 0
            return accum2+toCollect
        }, 0)
        return num+accum
    }, 0)
    return getPercent ? (pokemonCurrCollected/pokemonToCollect)*100 : 100/pokemonToCollect
}

export const checkBadgeMilestone = (colProg, userBadges, otherColProgs) => {
    const isHighestProg = !otherColProgs.map(p => p > colProg).includes(true)
    if (!isHighestProg) {
        if (colProg === 100 && otherColProgs.includes(100) && !userBadges.includes('apri-multigen')) {
            return ['apri-master', 'apri-multigen', ...userBadges.filter(b => !b.includes('apri'))]
        }
        return 'no-change'
    } else {
        if (colProg === 100 && otherColProgs.includes(100) && !userBadges.includes('apri-multigen')) {
            return ['apri-master', 'apri-multigen', ...userBadges.filter(b => !b.includes('apri'))]
        }
        const reachedMilestone = colProg === 100 ? 'apri-master' : colProg >= 75 ? 'apri-expert' : colProg >= 50 ? 'apri-enthusiast' : colProg >= 25 ? 'apri-amateur' : 'apri-novice'
        const prevMilestones = reachedMilestone === 'apri-master' ? ['apri-expert', 'apri-enthusiast', 'apri-amateur', 'apri-novice'] : 
            reachedMilestone === 'apri-expert' ? ['apri-enthusiast', 'apri-amateur', 'apri-novice'] : 
            reachedMilestone === 'apri-enthusiast' ? ['apri-amateur', 'apri-novice'] : 
            reachedMilestone === 'apri-amateur' ? ['apri-novice'] : []
        const noChange = userBadges.includes(reachedMilestone)
        if (noChange) {return 'no-change'}
        if (!prevMilestones.includes(reachedMilestone)) {return [reachedMilestone, ...userBadges.filter(b => !b.includes('apri'))]}
    }
}

const tradeBadges = ['trader-new', 'trader-aspiring', 'trader-avid', 'trader-experienced', 'trader-veteran', 'trader-breeder']

export const checkTradeBadgeMilestone = (tradeCount, userBadges) => {
    const reachedMilestone = tradeCount >= 100 ? 'trader-breeder' : tradeCount >= 50 ? 'trader-veteran' : tradeCount >= 25 ? 'trader-experienced' : tradeCount >= 10 ? 'trader-avid' : tradeCount >= 5 ? 'trader-aspiring' : tradeCount >= 1 && 'trader-new'
    const prevMilestones = tradeBadges.slice(0, tradeBadges.indexOf(reachedMilestone))
    const noChange = userBadges.includes(reachedMilestone)
    if (noChange) {return 'no-change'}
    if (!prevMilestones.includes(reachedMilestone)) {return [...userBadges.filter(b => !b.includes('trader')), reachedMilestone]}
}

//below is all logic to make badges add AND remove itself on hitting milestones, but i realized it doesnt really make sense to do logic to take away.
//commented out all that code in case i want to do it that way, otherwise users gain the badge but never lose it.

// const badges = ['apri-novice', 'apri-amateur', 'apri-enthusiast', 'apri-expert', 'apri-master']

// const getSetBadgeScenario = (badge, currBadges, badgePercent, colProg, edgeBadge) => {
//     const prevBadge = edgeBadge === 'start' ? 'none' : badges[badges.indexOf(badge)-1]
//     const nextBadge = edgeBadge === 'end' ? 'none' : badges[badges.indexOf(badge)+1]
//     if (colProg >)
// }

// export const setUserBadge = (colProg, currBadges) => {
//     if (colProg < 25) {
//         if (currBadges.includes('apri-novice')) {
//             return 'no-change'
//         } else if (currBadges.includes('apri-amateur')) {
//             return ['apri-novice', ...currBadges.filter(b => b !== 'apri-amateur')]
//         }
//     }
//     if (colProg >= 25 && colProg < 50) {
//         if (currBadges.includes('apri-novice')) {
//             return ['apri-amateur', ...currBadges.filter(b => b !== 'apri-novice')]
//         } else if (currBadges.includes('apri-amateur')) {
//             return 'no-change'
//         } else if (currBadges.includes('apri-enthusiast')) {
//             return ['apri-amateur', ...currBadges.filter(b => b !== 'apri-enthusiast')]
//         }
//     }
//     if (colProg >= 50 && colProg < 75) {
//         if (currBadges.includes('apri-amateur')) {
//             return ['apri-enthusiast', ...currBadges.filter(b => b !== 'apri-amateur')]
//         } else if (currBadges.includes('apri-enthusiast')) {
//             return 'no-change'
//         } else if (currBadges.includes('apri-expert')) {
//             return ['apri-enthusiast', ...currBadges.filter(b => b !== 'apri-expert')]
//         }
//     }
//     if (colProg >= 75 && colProg < 100) {
//         if (currBadges.includes('apri-enthusiast')) {
//             return ['apri-expert', ...currBadges.filter(b => b !== 'apri-enthusiast')]
//         } else if (currBadges.includes('apri-expert')) {
//             return 'no-change'
//         } else if (currBadges.includes('apri-master')) {
//             return ['apri-expert', ...currBadges.filter(b => b !== 'apri-master')]
//         }
//     }
//     if (colProg === 100) {
//         if (currBadges.includes('apri-expert')) {
//             return ['apri-master', ...currBadges.filter(b => b !== 'apri-expert')]
//         } else if (currBadges.includes('apri-master')) {
//             return 'no-change'
//         } 
//     }
// }

// export const setColBadgesSingleValUpdate = async (doc, added) => {
//     const userInfo = await User.findById(doc.owner.toString()).populate({path: 'collections', select: 'ownedPokemon'})
//     const currDocProgPrev = getCollectionProgressPercent(doc)
//     const currDocProg = added ? currDocProgPrev + getCollectionProgressPercent(doc, false) : currDocProgPrev - getCollectionProgressPercent(doc, false)
//     //doc always comes out as the doc pre-update for some reason.
//     const otherColsProg = userInfo.collections.filter(col => col._id.toString() !== doc._id.toString()).map(col => getCollectionProgressPercent(col))
//     if (otherColsProg.map(prog => prog > currDocProg).includes(true)) {
//         if (!otherColsProg.filter(prog => prog === 100).length > 1) {
//             userInfo.settings.profile.badges = userInfo.settings.profile.badges.filter(b => b !== 'apri-multigen')
//             userInfo.save()
//         }
//         return
//     }
//     if (otherColsProg.includes(100) && currDocProg === 100 && !userInfo.settings.profile.badges.includes('apri-multigen')) {
//         const traderBadge = userInfo.settings.profile.badges.filter(b => b.includes('trader'))
//         userInfo.settings.profile.badges = ['apri-master', 'apri-multigen', ...traderBadge]
//         userInfo.save()
//         return
//     }
//     const newBadgeArr = setUserBadge(currDocProg, userInfo.settings.profile.badges)
//     if (newBadgeArr === 'no-change') {
//         return
//     } 
//     userInfo.settings.profile.badges = newBadgeArr
//     userInfo.save()
// }

// export const setColBadgesBulk = async(currColProg, userBadges, otherUserColProgs) => { ///typically after trades. no checking to remove badge.
//     const isHighestProg = !otherUserColProgs.map(p => p > currColProg).includes(true)
//     if (isHighestProg) {
//         if (currColProg === 100 && otherUserColProgs.includes(100)) {
//             if (userBadges.includes('apri-master') && userBadges.includes('apri-multigen')) {
//                 return 'no-change'
//             } else {
//                 return ['apri-master', 'apri-multigen', ...userBadges.filter(b => !b.includs('apri'))]
//             }
//         }
//         const nextHitMilestone = currColProg === 100 ? 'apri-master' : currColProg >= 75 ? 'apri-expert' : currColProg >= 50 ? 'apri-enthusiast' : currColProg >= 25 ? 'apri-amateur' : currColProg > 0 && 'apri-novice'
//     }
// }

// const setColBadges = (userCols) => {
//     const badges = []
//     const colsProgressPercent = userCols.map((col) => {
//         const pokemonToCollect = col.ownedPokemon.reduce((accum, currValue) => {
//             const num = accum.disabled ? 0 : Object.keys(accum.balls).reduce((accum2, currValue) => {
//                 const toCollect = accum.balls[accum2].disabled ? 0 : 1
//                 return currValue+toCollect
//             }, 0)
//             return num+currValue
//         }, 0)
//         const pokemonCurrCollected = col.ownedPokemon.reduce((accum, currValue) => {
//             const num = accum.disabled ? 0 : Object.keys(accum.balls).reduce((accum2, currValue) => {
//                 const toCollect = accum.balls[accum2].disabled ? 0 : accum.balls[accum2].isOwned ? 1 : 0
//                 return currValue+toCollect
//             }, 0)
//             return num+currValue
//         }, 0)
//         return (pokemonCurrCollected/pokemonToCollect)*100
//     })
//     if (colsProgressPercent.length !== 0) {
//         const completedCols = colsProgressPercent.filter(p => p === 100)
//         const expert = colsProgressPercent.filter(p => p >= 75).length !== 0 && colsProgressPercent.filter(p => p === 100).length === 0
//         const enthusiast = colsProgressPercent.filter(p => p >= 50) && colsProgressPercent.filter(p => p >= 75).length === 0
//         const amateur = colsProgressPercent.filter(p => p >= 25) && colsProgressPercent.filter(p => p >= 50).length === 0
//         const novice = colsProgressPercent.length !== 0 && colsProgressPercent.filter(p => p >= 25).length === 0
//         if (completedCols.length !== 0) {
//             badges.push('apri-master')
//             if (completedCols.length > 1) {badges.push('apri-multigen')}
//         }
//         if (expert) {badges.push('apri-expert')}
//         if (enthusiast) {badges.push('apri-enthusiast')}
//         if (amateur) {badges.push('apri-amateur')}
//         if (novice) {badges.push('apri-novice')}
//     }
//     return badges
// }