import handleApiResponse from "./handleapiresponse"
const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

//frontend needs data back to display the data
const importCollection = async(spreadsheetId, apiRequestQueries, collectionTypeValue) => {
    const collectionData = await fetch(`${backendurl}/collections/new/import`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({spreadsheetId, apiRequestQueries, collectionTypeValue})
    }).then(async(data) => {return await handleApiResponse(data, true)})
    return collectionData
}

const createRange = (rangeInfo, col, multipleCols=false, col2) => {
    return `ranges=${rangeInfo.sheetName}!${col.toUpperCase()}${rangeInfo.from}:${multipleCols ? col2.toUpperCase() : col.toUpperCase()}${rangeInfo.to}`
}

const formatApiRequestLink = (formData) => {
    const rangeInfo = {sheetName: formData.sheetName, from: formData.rowSpan.from, to: formData.rowSpan.to}
    const dexColImport = !(formData.dexNumCol === '') ? {dexNum: createRange(rangeInfo, formData.dexNumCol)} : {}
    const haColImport = (formData.haImport.import === true) ? 
        (formData.haImport.col !== undefined && formData.haImport.col !== '') ? {HA: createRange(rangeInfo, formData.haImport.col)} : 
        (formData.haImport.colors !== undefined && !formData.haImport.colors.includes('')) && {HA: formData.haImport.colors} :
        {}
    const emColImport = (formData.emImport.import === true) ? 
        ((formData.emImport.cols !== undefined && !formData.emImport.cols.includes('')) && (formData.emImport.colors !== undefined && !formData.emImport.colors.includes(''))) ? 
            {
                EM1: createRange(rangeInfo, formData.emImport.cols[0]), 
                EM2: createRange(rangeInfo, formData.emImport.cols[1]), 
                EM3: createRange(rangeInfo, formData.emImport.cols[2]), 
                EM4: createRange(rangeInfo, formData.emImport.cols[3]),
                emColors: formData.emImport.colors
            } :
        (formData.emImport.cols !== undefined && !formData.emImport.cols.includes('')) ? 
            {
                EM1: createRange(rangeInfo, formData.emImport.cols[0]), 
                EM2: createRange(rangeInfo, formData.emImport.cols[1]), 
                EM3: createRange(rangeInfo, formData.emImport.cols[2]), 
                EM4: createRange(rangeInfo, formData.emImport.cols[3])
            } : 
        (formData.emImport.colors !== undefined && !formData.emImport.colors.includes('')) && {emColors: formData.emImport.colors} : {}

    const importInfo = {
        ...dexColImport, 
        names: createRange(rangeInfo, formData.nameCol), 
        balls: {range: createRange(rangeInfo, formData.ballColSpan.from, true, formData.ballColSpan.to), order: formData.ballColSpan.order},
        rowStart: parseInt(formData.rowSpan.from),
        ...haColImport,
        ...emColImport,
        rawRequiredFormData: {sheetName: formData.sheetName, rowSpanFrom: formData.rowSpan.from, rowSpanTo: formData.rowSpan.to, nameCol: formData.nameCol, ballColFrom: formData.ballColSpan.from, ballColTo: formData.ballColSpan.to, ballOrder: formData.ballColSpan.order}
    }
    return importInfo
}

export {importCollection, formatApiRequestLink}