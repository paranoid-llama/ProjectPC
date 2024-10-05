import Collection from "../../models/collections.js";
import User from '../../models/users.js'
import CollectionClass from '../../utils/createCollection.js'
import lton from "letter-to-number";
import { getAvailableHomeGames, getPossibleEggMoves, getImgLink, getPossibleGender } from "../../utils/schemavirtuals/collectionvirtuals.js";
import { formatImportQuery, setEMQueries, detectBadRanges, formatImportedValues, setCollection } from "../../utils/CreateCollection/importCollection.js";
import { getCollectionProgressPercent, checkBadgeMilestone} from "../../models/postpremiddleware.js";
import dotenv from 'dotenv'
dotenv.config()

const APIKEY = process.env.API_KEY

const importException = (res) => {
    const exception = new Error()
    exception.name = 'Server Error'
    exception.message = `There was an error with the import and we could not receive data from google sheets.`
    exception.status = 500
    return res.status(500).send(exception)
} 

export async function createNewCollection(req, res) {
    const {newCollectionInfo, type} = req.body
    //type refers to 'aprimon', 'livingdex', etc. useful for when newer types of collection are supported
    const owner = newCollectionInfo.owner
    const collectionData = new CollectionClass(undefined, newCollectionInfo)
    const collection = new Collection(collectionData)
    await collection.save()

    const user = await User.findById(owner).populate({path: 'collections', select: 'ownedPokemon'})

    const colProg = getCollectionProgressPercent(collection)
    const badgeChange = checkBadgeMilestone(colProg, user.settings.profile.badges, user.collections.map(col => {return {_id: col._id, progress: getCollectionProgressPercent(col)}}).filter(col => col._id.toString() !== collection._id.toString()).map(col => col.progress))
    if (badgeChange === 'no-change') {
        return res.json(collection._id)
    } else {
        user.settings.profile.badges = badgeChange
        user.save()
        return res.json(collection._id)
    }
}

export async function importCollectionFromSheets(req, res) {
    const {spreadsheetId, apiRequestQueries, collectionTypeValue} = req.body
    const {dexNum, names, balls, HA, EM1, EM2, EM3, EM4, emColors, rowStart, rawRequiredFormData} = apiRequestQueries
    const noDexNums = dexNum === undefined
    const noHAColImport = HA === undefined || typeof HA === 'object'
    const noEMsColImport = EM1 === undefined //must populate all EM fields or they don't import
    const noEMColorImport = emColors === undefined

    const missingRequiredFormData = Object.values(rawRequiredFormData).includes('') || rawRequiredFormData.ballOrder.length === 0

    if (missingRequiredFormData) {
        const requiredFields = [{display: 'Sheet Name', formKey: 'sheetName'}, {display: 'Row Span From', formKey: 'rowSpanFrom'}, {display: 'Row Span To', formKey: 'rowSpanTo'}, {display: 'Names', formKey: 'nameCol'}, {display: 'Ball Column From', formKey: 'ballColFrom'}, {display: 'Ball Column To', formKey: 'ballColTo'}, {display: 'Ball Order', formKey: 'ballOrder'}]
        const missingFields = requiredFields.filter((field) => (rawRequiredFormData[field.formKey] === '' || rawRequiredFormData[field.formKey].length === 0)).map((missingField) => missingField.display)
        if (spreadsheetId === '') {
            missingFields.unshift('Spreadsheet Link')
        }
        return res.json({missingInfo: true, missingFields})
    }

    const numBetweenBallCols = (lton(rawRequiredFormData.ballColTo.toUpperCase())-(lton(rawRequiredFormData.ballColFrom.toUpperCase())-1))
    const notLeftToRight = numBetweenBallCols < 1
    const moreThan11Balls = numBetweenBallCols > 11
    const mismatchBallColsAndOrder = numBetweenBallCols !== rawRequiredFormData.ballOrder.length

    if (mismatchBallColsAndOrder || notLeftToRight || moreThan11Balls) {
        return res.json({ballColIssue: true, type: notLeftToRight ? 'notLeftToRight' : moreThan11Balls ? 'moreThan11Balls' : mismatchBallColsAndOrder && 'mismatchBallColsAndOrder'})
    }
    //console.log(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?key=${APIKEY}dexNum: ${formatImportQuery(dexNum)} nameRange: ${names}& ballRange: ${balls.range} HArange: ${formatImportQuery(HA)} EMQueries: ${setEMQueries(EM1, EM2, EM3, EM4, formatImportQuery(HA) === '')}`)
    //console.log(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?key=${APIKEY}${formatImportQuery(dexNum)}${names}&${balls.range}${formatImportQuery(HA, EM1 === undefined)}${setEMQueries(EM1, EM2, EM3, EM4, formatImportQuery(HA) === '')}`)

    try {
        const data = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?key=${APIKEY}&majorDimension=ROWS${formatImportQuery(dexNum)}${names}${formatImportQuery(HA, EM1 === undefined)}${setEMQueries(EM1, EM2, EM3, EM4, formatImportQuery(HA) === '')}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        }).then(async(data) => {
            if (data.ok) {
                return await data.json()
            } else {
                return null
            }
        })

        const ballData = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?key=${APIKEY}&majorDimension=ROWS&valueRenderOption=FORMULA&${balls.range}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        }).then(async(data) => {
            if (data.ok) {
                return await data.json()
            } else {
                return null
            }
        })

        const colorData = (typeof HA === 'object' || !noEMColorImport) && await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?key=${APIKEY}&${balls.range}&includeGridData=TRUE&fields=sheets.data.rowData.values.userEnteredFormat(backgroundColor)`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        }).then(async(data) => {
            if (data.ok) {
                return await data.json()
            } else {
                return null
            }
        })

        if (!data || !ballData || ((typeof HA === 'object' || !noEMColorImport) && !colorData)) {
            const exception = new Error()
            exception.name = 'Sheets API Call Bad Request'
            exception.message = `There was an error with the import and we could not receive data from google sheets. Double check that the link, sheet name, row span, and ball range are correct!`
            exception.status = 400
            return res.status(400).send(exception)
        }

        if (data.error !== undefined) {
            return res.json(data)
        }

        const dataRangeIssue = detectBadRanges(data)
        const ballDataRangeIssue = detectBadRanges(ballData)
        const ranges = [dexNum, names, !noHAColImport ? HA : undefined, EM1, EM2, EM3, EM4]
        const rangeNames = ['Dex Number', 'Names', 'Hidden Ability', 'Egg Move 1', 'Egg Move 2', 'Egg Move 3', 'Egg Move 4']

        if (dataRangeIssue.issue !== 'none' || ballDataRangeIssue.issue !== 'none') {
            const badRangeNames = [...dataRangeIssue.ranges.map(range => rangeNames[ranges.indexOf(range)]), ...ballDataRangeIssue.ranges.length !== 0 ? 'balls' : []]
            return res.json({rangeIssue: true, badRanges: badRangeNames})
        }

        const namesDataIdx = noDexNums ? 0 : 1
        const HADataIdx = noDexNums ? 1 : 2
        const EMDataIdxs = {
            EM1: 3 + (noDexNums ? -1 : 0) + (noHAColImport ? -1 : 0),
            EM2: 4 + (noDexNums ? -1 : 0) + (noHAColImport ? -1 : 0),
            EM3: 5 + (noDexNums ? -1 : 0) + (noHAColImport ? -1 : 0),
            EM4: 6 + (noDexNums ? -1 : 0) + (noHAColImport ? -1 : 0)
        }

        const gapRowIdxs = formatImportedValues('gapIdxs', data.valueRanges[0].values, [], noDexNums ? 'names' : 'dexNums')

        const importedDexNumArr = noDexNums ? [] : formatImportedValues('dexNum', data.valueRanges[0].values, gapRowIdxs)
        const importedNamesArr = formatImportedValues('names', data.valueRanges[namesDataIdx].values, gapRowIdxs)
        const importedBallInfoArr = formatImportedValues('balls', ballData.valueRanges[0].values, gapRowIdxs)
        const importedHAInfoArr = HA !== undefined && formatImportedValues('HA', noHAColImport ? colorData.sheets[0].data[0].rowData : data.valueRanges[HADataIdx].values, gapRowIdxs, 'none', noHAColImport ? HA : [])
        const importedEMCountInfoArr = !noEMColorImport ? formatImportedValues('emColors', colorData.sheets[0].data[0].rowData, gapRowIdxs, 'none', emColors) : undefined
        const importedEMsInfoArr = !noEMsColImport ? formatImportedValues('EMs', data.valueRanges[EMDataIdxs.EM1].values, gapRowIdxs, 'none', [], {EM2: data.valueRanges[EMDataIdxs.EM2].values, EM3: data.valueRanges[EMDataIdxs.EM3].values, EM4: data.valueRanges[EMDataIdxs.EM4].values}) : undefined
    
        const newCollection = setCollection(noDexNums ? importedNamesArr : importedDexNumArr, importedNamesArr, importedBallInfoArr, gapRowIdxs, balls.order, collectionTypeValue, rowStart, HA !== undefined ? importedHAInfoArr : undefined, noHAColImport ? 'colors' : 'col', importedEMCountInfoArr, importedEMsInfoArr)
        
        res.json(newCollection)
    } catch (e) {
        const exception = new Error()
        exception.name = 'Server Error'
        exception.message = `There was an error with the import and we could not receive data from google sheets.`
        exception.status = 500
        return res.status(500).send(exception)
    }
}