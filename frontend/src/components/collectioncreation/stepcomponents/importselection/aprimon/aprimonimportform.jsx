import {Box, Typography, TextField, InputAdornment, styled, Button, Tabs, Tab, ToggleButton, ToggleButtonGroup, CircularProgress, useTheme} from '@mui/material'
import lton from 'letter-to-number'
import NameFormatModal from '../shared/nameformatmodal';
import {NumericFormat} from 'react-number-format'
import Tooltip, {tooltipClasses} from '@mui/material/Tooltip'
import HelpIcon from '@mui/icons-material/Help';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState, useRef, useEffect } from 'react'
import { apriballs } from '../../../../../../common/infoconstants/miscconstants.mjs';
import AprimonImportNotice from './aprimonimportnotice'
import ColorSelection from './colorselection';
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import { aprimonImportFormTemplate } from '../../../../../../common/infoconstants/importconstants.mjs';

import { useDebouncedCallback } from 'use-debounce';
import './aprimonimportform.css'

//please re-order/piece apart this form this is div hell.

export default function AprimonImportForm({handleSubmit, isHomeCollection}) {
    const [notice, setNotice] = useState(true)
    // useEffect(() => {
    //     setNotice(true) //this makes it so we can update parent local state without the notice coming back
    // }, [])
    const [nameFormatModal, setNameFormatModal] = useState(false)
    const [formState, setFormState] = useState({ballOrder: [], haImport: {type: 'color-coded', colors: [''], col: ''}, emImport: {type: ['color-coded'], colors: [''], cols: ['', '', '', '']}})
    const [error, setError] = useState({id: false, sheetName: false, rowSpanFrom: false, rowSpanTo: false, nameCol: false, ballColFrom: false, ballColTo: false, ballOrder: false})
    const [importData, setImportData] = useState(aprimonImportFormTemplate)
    const theme = useTheme()

    const noticeClassName = notice === 'transitioning' ? 'fade-notice-out' : ''
    const formClassName = notice === 'transitioning' ? 'fade-form-in' : ''

    const formHelperTextProps = {
        sx: {position: 'absolute', top: '85%', fontSize: '11px'}
    }

    const setErrorProps = (isError) =>  {
        if (isError || isError === 'true') { //using string ver of isError to only return error prop and not helper text
            return isError === true ? {
                error: true,
                helperText: 'Required',
                FormHelperTextProps: formHelperTextProps
            } : {error: true}
        }
    }

    const setBallOrderErrorProps = (isError) => {
        if (isError) {
            return {
                color: 'red',
                borderColor: 'red'
            }
        }
    }

    const removeNotice = () => {
        setNotice('transitioning')
        setTimeout(() => {
            setNotice(false)
        }, 500)
    }

    const CustomWidthTooltip = styled(({className, ...props}) => (
        <Tooltip {...props} classes={{popper: className}}/>
    ))({
        '& .MuiTooltip-tooltip': {
            maxWidth: 425,
            textAlign: 'center'
        }
    })

    const openNameFormatModal = () => {
        setNameFormatModal(true)
    }

    const closeNameFormatModal = () => {
        setNameFormatModal(false)
    }

    const changeBallOrder = (e, selected) => {
        const newOrderList = selected ? formState.ballOrder.filter(ball => ball !== e.target.value) : [...formState.ballOrder, e.target.value]
        setFormState({...formState, ballOrder: newOrderList})
    }

    const changeImportType = (e, field) => {
        if (field === 'em') {
            const newImportTypes = formState.emImport.type.includes(e.target.value) ? formState.emImport.type.filter(type => type !== e.target.value) : [...formState.emImport.type, e.target.value]
            setFormState({...formState, [`${field}Import`]: {...formState[`${field}Import`], type: newImportTypes}})
        } else {
            setFormState({...formState, [`${field}Import`]: {...formState[`${field}Import`], type: e.target.value}})
        }   
    }
    
    //this handles adding more color text fields as well as the values in the text fields (controlled input)
    const handleColorChange = (e, field, addingColor, colorIdx) => {
        if (addingColor) {
            if (formState[`${field}Import`].colors.length < 4) { //max colors is 4
                const newColorsArr = [...formState[`${field}Import`].colors, '']
                setFormState({...formState, [`${field}Import`]: {...formState[`${field}Import`], colors: newColorsArr}})
            }
        } else {
            const newColorsArr = formState[`${field}Import`].colors
            newColorsArr[colorIdx] = e.target.value
            setFormState({...formState, [`${field}Import`]: {...formState[`${field}Import`], colors: newColorsArr}})
        }
    }

    const updateHaEmCols = (e, field, emIdx) => {
        const newValue = e.target.value
        const letterValues = /[a-zA-Z]/
        if (newValue.length > 2 || (!letterValues.test(newValue)) && newValue !== '') {
            null
        } else if (field === 'ha') {
            setFormState({...formState, haImport: {...formState.haImport, col: newValue}})
        } else {
            const newEmCols = formState.emImport.cols
            newEmCols[emIdx] = newValue
            setFormState({...formState, emImport: {...formState.emImport, cols: newEmCols}})
        }
    }

    const handleImportDataChange = (e, changedField, colField=false, nestedField=undefined) => {
        const newValue = e.target.value
        const letterValues = /[a-zA-Z]/
        if (colField && (newValue.length > 2 || (!letterValues.test(newValue)) && newValue !== '')) {
            null
        } else {
            const newState = nestedField !== undefined ? {...importData, [nestedField]: {...importData[nestedField], [changedField]: newValue}} : {...importData, [changedField]: newValue}
            setImportData(newState)
        }
    }

    const formatData = () => {
        const untouchedHaImportFields = (formState.haImport.colors.filter(color => color !== '').length === 0 && formState.haImport.col === '')
        const untouchedEmImportFields = (formState.emImport.colors.filter(color => color !== '').length === 0 && formState.emImport.cols.filter(col => col !== '').length === 0)
        const haImportFields = untouchedHaImportFields ? {} : 
            formState.haImport.type === 'color-coded' ? {colors: formState.haImport.colors.filter(color => color !== '')} : 
            formState.haImport.type === 'column-info' && {col: formState.haImport.col.toUpperCase()}
        const emImportFields = untouchedEmImportFields ? {} : 
            (formState.emImport.type.includes('color-coded') && formState.emImport.type.includes('column-info')) ? {colors: formState.emImport.colors.filter(color => color !== ''), cols: formState.emImport.cols.map((col) => col.toUpperCase())} :
            formState.emImport.type.includes('color-coded') ? {colors: formState.emImport.colors.filter(color => color !== '')} : 
            formState.emImport.type.includes('column-info') && {cols: formState.emImport.cols.map((col) => col.toUpperCase())}   
        const extractedIdFromImportDataLink = importData.spreadsheetId.includes('docs.google.com') ? importData.spreadsheetId.slice(importData.spreadsheetId.indexOf('spreadsheets/d/')+15, importData.spreadsheetId.indexOf('/edit')) : importData.spreadsheetId
        const formattedImportData = {
            ...importData,
            spreadsheetId: extractedIdFromImportDataLink,
            ballColSpan: {from: importData.ballColSpan.from.toUpperCase(), to: importData.ballColSpan.to.toUpperCase(), order: formState.ballOrder},
            haImport: {import: !untouchedHaImportFields, assumeAll: untouchedHaImportFields, ...haImportFields},
            emImport: {import: !untouchedEmImportFields, ...emImportFields}
        }
        return formattedImportData
    }

    const validateAndSubmit = (e, formData) => {
        const requiredFields = ['id', 'sheetName', 'rowSpanFrom', 'rowSpanTo', 'nameCol', 'ballColFrom', 'ballColTo', 'ballOrder']
        const importDataField = ['spreadsheetId', 'sheetName', 'rowSpan[from]', 'rowSpan[to]', 'nameCol', 'ballCol[from]', 'ballCol[to]', 'ballOrder']
        const ballFromEmpty = importData.ballColSpan.from === ''
        const ballToEmpty = importData.ballColSpan.to === ''
        const obj = {}
        for (let field of requiredFields.slice(0, 5)) {
            if (field.includes('rowSpan')) {
                const nestedFieldKey = field.slice(field.indexOf('n')+1, field.length).toLowerCase()
                obj[field] = importData.rowSpan[nestedFieldKey] === ''
            } else {
                obj[field] = importData[importDataField[requiredFields.indexOf(field)]] === ''
            }
        }
        if (ballFromEmpty || ballToEmpty) {
            if (ballFromEmpty && ballToEmpty) {
                obj['ballColFrom'] = true
                obj['ballColTo'] = true
            }
            if (ballFromEmpty) {
                obj['ballColFrom'] = true
            }
            if (ballToEmpty) {
                obj['ballColTo'] = true
            }
        } else {
            const num1 = lton(importData.ballColSpan.from.toUpperCase())
            const num2 = lton(importData.ballColSpan.to.toUpperCase())
            const numOfColBalls = num2 > num1 ? num2 - (num1-1) : 0
            if (numOfColBalls > 11) {
                obj['ballColFrom'] = 'true'
                obj['ballColTo'] = 'true'
            } else {
                obj['ballColFrom'] = false
                obj['ballColTo'] = false
            }
        }
        if (formState.ballOrder.length === 0 && (obj.ballColFrom === false && obj.ballColFrom === false)) {
            obj['ballOrder'] = true
        } else if (formState.ballOrder.length !== 0 && (obj.ballColFrom === false && obj.ballColFrom === false)) {
            const num1 = lton(importData.ballColSpan.from.toUpperCase())
            const num2 = lton(importData.ballColSpan.to.toUpperCase())
            const numOfColBalls = num2 > num1 ? num2 - (num1-1) : 0
            if (numOfColBalls !== formState.ballOrder.length) {
                obj['ballOrder'] = true
            } else {
                obj['ballOrder'] = false
            }
        }
        if (Object.values(obj).filter((error) => error !== false).length !== 0) {
            setError(obj)
        } else {
            setError({id: false, sheetName: false, rowSpanFrom: false, rowSpanTo: false, nameCol: false, ballColFrom: false, ballColTo: false, ballOrder: false})
            handleSubmit(e, formData)
        }
    }

    const ballColOrderNoError = (error.ballOrder !== true && error.ballColFrom !== true && error.ballColFrom !== 'true' && error.ballColTo !== true && error.ballColTo !== 'true')

    // const spreadSheetIdToolTip = 'Your spreadsheet ID is in the link: https://docs.google.com/spreadsheets/d/(SPREADSHEET_ID)/edit#gid=123456789 Make sure anyone with the link can view the spreadsheet!'
    const spreadSheetIdToolTip = 'The link for your spreadsheet page, which looks like this: https://docs.google.com/spreadsheets/d/(SPREADSHEET_ID)/edit#gid=123456789 Make sure it is NOT the published spreadsheet link (it has to be the one from your edit page), and that anyone with the link can view the spreadsheet. '
    const sheetNameToolTip = 'The Sheet Name is the name of the particular sheet within the entire spreadsheet, NOT the spreadsheet name. It is displayed on the bottom of the spreadsheet editor.'
    const rowSpanToolTip = 'The range of rows your collection encompasses. First value will be the first pokemon, and the second one will be the last pokemon. Ensure most of the imported fields spans this range!'
    const identifierToolTip = "These are used to associate data with a particular pokemon. National Dex # is not required, but you have to make sure all your pokemon are spelled correctly if you don't import it!"
    const haImportToolTip = "The data on whether or not a specific pokemon/ball combo you own has their hidden ability as well. You can leave this blank and it will be assumed that they all have their hidden abilities (if applicable)"
    const emImportToolTip = "The data on whether or not a specific pokemon/ball combo you own has egg moves, and what those egg moves are. Color coded only imports whether they have 4/Max EMs, while Column Info imports the EM data but applies it to all owned combos. You can include both types."

    const emSectionDisabledStyles = isHomeCollection ? {filter: 'blur(0.5rem)', pointerEvents: 'none', position: 'relative'} : {}

    return (
        <Box sx={{width: '100%', height: '95%'}}>
            {(notice === true || notice === 'transitioning') && <AprimonImportNotice removeNotice={removeNotice} transitionClass={noticeClassName}/>}
            {(notice === false || notice === 'transitioning') &&
            <Box sx={{width: '100%', height: '100%', position: 'relative'}} className={formClassName}>
                <Box sx={{position: 'absolute', width: '100%', height: '100%',  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Box sx={{width: '100%', height: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 1}}>
                        <Box sx={{width: '50%', height: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                            <TextField 
                                fullWidth 
                                size='small' 
                                label='Spreadsheet Link'
                                value={importData.spreadsheetId}
                                onChange={(e) => handleImportDataChange(e, 'spreadsheetId')}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end" sx={{':hover': {cursor: 'pointer'}}}>
                                                    <CustomWidthTooltip title={spreadSheetIdToolTip} arrow>
                                                        <HelpIcon/>
                                                    </CustomWidthTooltip> 
                                                  </InputAdornment>
                                }}
                                {...setErrorProps(error.id)}
                            />
                        </Box>
                        <Box sx={{width: '100%', height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Box sx={{width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <Box sx={{width: '75%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>  
                                    <TextField
                                        fullWidth
                                        size='small'
                                        label='Sheet Name'
                                        value={importData.sheetName}
                                        onChange={(e) => handleImportDataChange(e, 'sheetName')}
                                        FormHelperTextProps={formHelperTextProps}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end" sx={{':hover': {cursor: 'pointer'}}}>
                                                            <CustomWidthTooltip title={sheetNameToolTip} arrow>
                                                                <HelpIcon/>
                                                            </CustomWidthTooltip> 
                                                          </InputAdornment>
                                        }}
                                        {...setErrorProps(error.sheetName)}
                                    />
                                </Box>
                            </Box>
                            <Box sx={{width: '50%', height: '100%'}}>
                                <Box sx={{width: '90%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}> 
                                    <Typography sx={{fontSize: '16px', fontWeight: 700, mr: 3}}>Row Span:</Typography>
                                    <NumericFormat 
                                        sx={{position: 'relative'}}
                                        customInput={TextField} 
                                        size='small' 
                                        label='From' 
                                        allowNegative={false} 
                                        decimalScale={0}
                                        value={importData.rowSpan.from}
                                        onChange={(e) => handleImportDataChange(e, 'from', false, 'rowSpan')}
                                        {...setErrorProps(error.rowSpanFrom)}
                                    />
                                    <Typography sx={{fontSize: '16px', fontWeight: 700, mx: 1}}>-</Typography>
                                    <NumericFormat 
                                        sx={{position: 'relative'}}
                                        customInput={TextField} 
                                        size='small' 
                                        label='To' 
                                        allowNegative={false} 
                                        decimalScale={0}
                                        value={importData.rowSpan.to}
                                        onChange={(e) => handleImportDataChange(e, 'to', false, 'rowSpan')}
                                        {...setErrorProps(error.rowSpanTo)}
                                    />
                                    <Box sx={{marginLeft: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', ':hover': {cursor: 'pointer'}, color: 'rgba(0, 0, 0, 0.54)'}}>
                                        <Tooltip title={rowSpanToolTip} arrow>
                                            <HelpIcon/>
                                        </Tooltip> 
                                    </Box>
                                </Box> 
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', height: '75%', display: 'flex', flexDirection: 'column'}}>
                        <Box sx={{width: '100%', height: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Box sx={{width: '40%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                <Typography sx={{fontSize: '16px', fontWeight: 700, mb: 0.1, position: 'relative'}}>
                                    Identifiers 
                                    <Tooltip sx={{position: 'absolute', width: '16px', bottom: '5px', right: '-20px', ':hover': {cursor: 'pointer'}}} title={identifierToolTip} arrow>
                                        <HelpIcon/>
                                    </Tooltip> 
                                </Typography>
                                <Box sx={{width: '100%', height: '30%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Typography sx={{fontSize: '14px', marginRight: 1}}>Dex # Column:</Typography>
                                    <TextField 
                                        placeholder='E.g. A'
                                        size='small'
                                        value={importData.dexNumCol}
                                        onChange={(e) => handleImportDataChange(e, 'dexNumCol', true)}
                                    />
                                </Box>
                                <Box sx={{width: '100%', height: '30%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', mb: 1}}>
                                    <Typography sx={{fontSize: '14px', marginRight: 1}}>Name Column:</Typography>
                                    <TextField 
                                        placeholder='E.g. C' 
                                        size='small'
                                        value={importData.nameCol}
                                        onChange={(e) => handleImportDataChange(e, 'nameCol', true)}
                                        {...setErrorProps(error.nameCol)}
                                    />
                                </Box>
                                <Button sx={{fontSize: '10px'}} onClick={openNameFormatModal}>
                                    See Accepted Name Formats
                                </Button>
                                <NameFormatModal open={nameFormatModal} handleClose={closeNameFormatModal}/>
                            </Box>
                            <Box sx={{width: '60%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 1, mb: 1}}>
                                <Typography sx={{fontSize: '16px', fontWeight: 700, mb: 0.1, position: 'relative'}}>
                                    Owned Ball Combos
                                </Typography>
                                <Box sx={{width: '100%', height: '30%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Typography sx={{fontSize: '14px', marginRight: 1, fontWeight: 700}}>Column Span:</Typography>
                                    <TextField 
                                        placeholder='E.g. E' 
                                        label='From' 
                                        size='small'
                                        value={importData.ballColSpan.from}
                                        onChange={(e) => handleImportDataChange(e, 'from', true, 'ballColSpan')}
                                        {...setErrorProps(error.ballColFrom)}
                                    />
                                    <Typography sx={{fontSize: '16px', fontWeight: 700, mx: 1}}>-</Typography>
                                    <TextField 
                                        placeholder='E.g. O' 
                                        label='To' 
                                        size='small'
                                        value={importData.ballColSpan.to}
                                        onChange={(e) => handleImportDataChange(e, 'to', true, 'ballColSpan')}
                                        {...setErrorProps(error.ballColTo)}
                                    />
                                </Box>
                                <Box sx={{width: '100%', height: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                    <Box sx={{width: '100px', position: 'relative'}}>
                                        <Typography sx={{fontSize: '12px', fontWeight: 700}}>
                                            Select Ball Order
                                        </Typography>
                                        <Box sx={{position: 'absolute', top: '-4px', right: '-17px', ':hover': {cursor: 'pointer'}}}>
                                            <Tooltip title='The order of the ball columns on your sheet from left to right' sx={{width: '15px'}}>
                                                <HelpIcon/>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                    <Box sx={{width: '100%', height: '70%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                        {apriballs.map((ball) => {
                                            return (
                                                <ToggleButton 
                                                    key={`order-select-${ball}-ball`} 
                                                    value={ball}
                                                    selected={formState.ballOrder.includes(ball)}
                                                    onChange={(e) => changeBallOrder(e, formState.ballOrder.includes(ball))}
                                                    sx={{padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'end', mx: 0.2, position: 'relative', ...setBallOrderErrorProps(error.ballOrder)}}
                                                >
                                                    {formState.ballOrder.includes(ball) && 
                                                    <Typography 
                                                        sx={{
                                                            zIndex: -100, 
                                                            fontSize: '14px', 
                                                            position: 'absolute',
                                                            top: '-3px', 
                                                            fontWeight: 700
                                                        }}
                                                        >
                                                            {formState.ballOrder.indexOf(ball) + 1}
                                                        </Typography>
                                                    }
                                                    <ImgData type='ball' linkKey={ball} additionalClasses='set-under'/>
                                                </ToggleButton>
                                            )
                                        })}
                                    </Box>
                                </Box>
                                <Box sx={{width: '100%', height: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <Typography sx={{fontSize: '11px', color: ballColOrderNoError ? 'black' : 'red'}}>
                                        {ballColOrderNoError && 'If you are not collecting a particular ball, you can leave it unselected'}
                                        {error.ballOrder === true && 'Number of selected balls does not match the number between the column spans'}
                                        {(error.ballColFrom === 'true' || error.ballColTo === 'true') && 'Column Spans are greater than the total allowed balls (11)'}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{width: '100%', height: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Box sx={{width: '40%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                <Typography sx={{fontSize: '16px', fontWeight: 700, mb: 0.1, position: 'relative'}}>
                                    Hidden Ability Data Import
                                    <Tooltip sx={{position: 'absolute', width: '16px', bottom: '5px', right: '-20px', ':hover': {cursor: 'pointer'}}} title={haImportToolTip} arrow>
                                        <HelpIcon/>
                                    </Tooltip> 
                                </Typography>
                                <Box sx={{height: '15%'}}>
                                    <ToggleButtonGroup sx={{height: '100%'}} orientation='horizontal' value={formState.haImport.type} onChange={(e) => changeImportType(e, 'ha')} exclusive>
                                        <ToggleButton sx={{height: '50%'}} value='color-coded'>
                                            Color-Coded
                                        </ToggleButton>
                                        <ToggleButton sx={{height: '50%'}} value='column-info'>
                                            Column Info
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                                {formState.haImport.type === 'color-coded' && 
                                <ColorSelection 
                                    totalColors={formState.haImport.colors.length} 
                                    colors={formState.haImport.colors} 
                                    handleChange={handleColorChange} 
                                    field='ha'
                                />}
                                {formState.haImport.type === 'column-info' &&
                                <Box sx={{width: '100%', height: '65%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                                    <TextField 
                                        label='Column'
                                        placeholder='E.g. E'
                                        size='small'
                                        value={formState.haImport.col}
                                        onChange={(e) => updateHaEmCols(e, 'ha')}
                                    />
                                </Box>}
                            </Box>
                            <Box sx={{width: '60%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                {isHomeCollection &&
                                    <Box sx={{...theme.components.box.fullCenterCol, position: 'absolute'}}>
                                        <Typography sx={{fontWeight: 700, fontSize: '14px'}}>Egg moves are disabled in HOME collections!</Typography>
                                    </Box>
                                }
                                <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', ...emSectionDisabledStyles}}>
                                    <Typography sx={{fontSize: '16px', fontWeight: 700, mb: 0.1, position: 'relative'}}>
                                        Egg Move Data Import
                                        <Tooltip sx={{position: 'absolute', width: '16px', bottom: '5px', right: '-20px', ':hover': {cursor: 'pointer'}}} title={emImportToolTip} arrow>
                                            <HelpIcon/>
                                        </Tooltip> 
                                    </Typography>
                                    <Box sx={{height: '15%'}}>
                                        <ToggleButtonGroup sx={{height: '100%'}} orientation='horizontal' value={formState.emImport.type} onChange={(e) => changeImportType(e, 'em')}>
                                            <ToggleButton sx={{height: '50%'}} value='color-coded'>
                                                Color-Coded
                                            </ToggleButton>
                                            <ToggleButton sx={{height: '50%'}} value='column-info'>
                                                Column Info
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Box>
                                    <Box sx={{height: '65%', width: '95%', display: 'flex', flexDirection: 'row', alignItems: 'center', jsutifyContent: 'center'}}>
                                        <ColorSelection 
                                            totalColors={formState.emImport.colors.length} 
                                            colors={formState.emImport.colors} 
                                            handleChange={handleColorChange} 
                                            field='em'
                                            height='100%'
                                            width='40%'
                                            firstColorFieldWidth='111.5px'
                                            includeAdornment={false}
                                            otherStyles={{opacity: formState.emImport.type.includes('color-coded') ? 1 : 0.5}}
                                        />
                                        <Box sx={{height: '100%', width: '55%', marginLeft: 3, opacity: formState.emImport.type.includes('column-info') ? 1 : 0.5}}>
                                            <Box sx={{height: '30%', width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                                <TextField 
                                                    placeholder='EM 1 Col'
                                                    inputProps={{sx: {paddingY: '2px'}}}
                                                    size='small'
                                                    sx={{marginRight: '3px'}}
                                                    value={formState.emImport.cols[0]}
                                                    onChange={(e) => updateHaEmCols(e, 'em', 0)}
                                                    disabled={!formState.emImport.type.includes('column-info')}
                                                />
                                                <TextField 
                                                    placeholder='EM 2 Col'
                                                    inputProps={{sx: {paddingY: '2px'}}}
                                                    size='small'
                                                    sx={{marginLeft: '3px'}}
                                                    value={formState.emImport.cols[1]}
                                                    onChange={(e) => updateHaEmCols(e, 'em', 1)}
                                                    disabled={!formState.emImport.type.includes('column-info')}
                                                />
                                            </Box>
                                            <Box sx={{height: '30%', width: '100%' , display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                                <TextField 
                                                    placeholder='EM 3 Col'
                                                    inputProps={{sx: {paddingY: '2px'}}}
                                                    size='small'
                                                    sx={{marginRight: '3px'}}
                                                    value={formState.emImport.cols[2]}
                                                    onChange={(e) => updateHaEmCols(e, 'em', 2)}
                                                    disabled={!formState.emImport.type.includes('column-info')}
                                                />
                                                <TextField 
                                                    placeholder='EM 4 Col'
                                                    inputProps={{sx: {paddingY: '2px'}}}
                                                    size='small'
                                                    sx={{marginLeft: '3px'}}
                                                    value={formState.emImport.cols[3]}
                                                    onChange={(e) => updateHaEmCols(e, 'em', 3)}
                                                    disabled={!formState.emImport.type.includes('column-info')}
                                                />
                                            </Box>
                                            <Box sx={{height: '20%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1, opacity: formState.emImport.type.includes('column-info') ? 1 : 0.5}}>
                                                <Typography sx={{fontSize: '10px'}}>
                                                    Egg Moves must be on different columns and spelled correctly. All fields must be filled.
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                <Box sx={{position: 'absolute', top: '108%', width: '217.625px', height: '36px', right: '3%', zIndex: 2}}>
                    <Button onClick={(e) => validateAndSubmit(e, formatData())}>
                        <Typography sx={{mx: 2, fontSize: '14px'}}>Submit and Import</Typography>
                        <ArrowForwardIcon/>
                    </Button>
                </Box>
                </Box>
            </Box>
            }
        </Box>
    )
}