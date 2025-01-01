import {Box, Typography, Select, MenuItem, ToggleButton, Button, useTheme} from '@mui/material'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { useState, useEffect, useContext } from 'react'
import { AlertsContext } from '../../../../alerts/alerts-context'
import { ErrorContext } from '../../../../app/contexts/errorcontext'
import { useDispatch, useSelector } from 'react-redux'
import { changeModalState } from '../../../../app/slices/editmode'
import { setSortingOptionsState } from '../../../../app/slices/collectionstate'
import { backendChangeOptions } from '../../../../../utils/functions/backendrequests/collectionoptionsedit'
import { sortList } from '../../../../../common/sortingfunctions/customsorting.mjs'
import SaveChangesConfirmModal from '../savechangesconfirmmodal'

export default function CollectionSortingOptions({elementBg, collectionGen, collectionId, demo, sw}) {
    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)
    const currentOptions = useSelector((state) => state.collectionState.options.sorting.collection)
    const collectionListState = useSelector((state) => state.collectionState.collection)
    const theme = useTheme()

    const buttonStyles = {
        opacity: 0.5,
        fontWeight: 700,
        '&.MuiButtonBase-root': {color: 'white', border: '1px solid white'},
        '&.MuiButtonBase-root:hover': {opacity: 0.8},
        '&.Mui-selected': {backgroundColor: 'rgba(40,63,87,1)', opacity: 1},
        '&.Mui-selected:hover': {backgroundColor: 'rgba(40,63,87,0.8)'},
        '&:hover': {backgroundColor: 'inherit'}
    }

    const [sortingOptions, setSortingOptions] = useState({options: currentOptions, saveChangesConfirmOpen: false})

    //alerts
    const [alertIds, setAlertIds] = useState([])
    const {addAlert, dismissAlert} = useContext(AlertsContext)

    const clearAlerts = () => {
        alertIds.forEach((id) => {
            dismissAlert(id);
        });
        setAlertIds([]);
    }

    useEffect(() => {
        return () => {
            clearAlerts();
        };
    }, []);

    const changeOption = (field, newVal) => {
        setSortingOptions({...sortingOptions, options: {...sortingOptions.options, [field]: newVal}})
    }

    const closeSaveChangesConfirm = () => {
        setSortingOptions({...sortingOptions, saveChangesConfirmOpen: false})
    }

    const changeOptionsSave = (saveButtonSelected, nextScreen) => {
        const noChangesMade = (currentOptions.reorder === sortingOptions.options.reorder) && (currentOptions.default === sortingOptions.options.default)
        if (saveButtonSelected && noChangesMade) {
            setSortingOptions({...sortingOptions, saveErrorNotice: true})
            setTimeout(() => {
                setSortingOptions((curr) => {return {...curr, saveErrorNotice: false}})
            }, 3000)
        } else if (!noChangesMade) {
            setSortingOptions({...sortingOptions, saveChangesConfirmOpen: true, saveButtonSelected, nextScreen, reSortWillHappen: sortingOptions.options.reorder === true})
        } else {
            if (nextScreen === 'exit') {
                dispatch(changeModalState({open: false}))
            } else {
                dispatch(changeModalState({open: true, screen: nextScreen}))
            }
        }
    }

    const finalizeChanges = (saveChanges, nextScreen) => {
        if (saveChanges) {
            setSortingOptions({...sortingOptions, saving: true})
            setTimeout(() => {
                const sortedCollectionList = sortingOptions.reSortWillHappen ? sortList(sortingOptions.options.default, collectionListState) : undefined
                if (demo) {
                    dispatch(setSortingOptionsState({listType: 'collection', data: sortingOptions.options}))
                    
                    //spawning alert
                    const alertMessage = `Updated Collection Sorting Options${sortingOptions.reSortWillHappen ? ' and re-sorted the list!' : '!'}`
                    const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                    const id = addAlert(alertInfo);
                    setAlertIds((prev) => [...prev, id]);
                    dispatch(changeModalState({open: false}))
                } else {
                const backendSortedList = sortingOptions.reSortWillHappen && JSON.parse(JSON.stringify(sortedCollectionList)).map(mon => {
                    delete mon.imgLink
                    delete mon.possibleGender
                    return mon
                })
                const backendReqData = sortingOptions.reSortWillHappen ? {listType: 'collection', data: sortingOptions.options, sortedList: backendSortedList} : {listType: 'collection', data: sortingOptions.options}
                const backendReq = async() => await backendChangeOptions('sort', backendReqData, collectionId) 
                const successFunc = () => {
                    dispatch(setSortingOptionsState({listType: 'collection', data: sortingOptions.options}))
                    
                    //spawning alert
                    const alertMessage = `Updated Collection Sorting Options${sortingOptions.reSortWillHappen ? ' and re-sorted the list!' : '!'}`
                    const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                    const id = addAlert(alertInfo);
                    setAlertIds((prev) => [...prev, id]);
                    dispatch(changeModalState({open: false}))
                }

                handleError(backendReq, false, successFunc, () => {dispatch(changeModalState({open: false}))})
                }
                
                
            }, 1000)
        } else if (nextScreen === 'goBack') {
            setSortingOptions({...sortingOptions, saveChangesConfirmOpen: false})
        } else if (nextScreen === 'exit') {
            dispatch(changeModalState({open: false}))
        } else if (saveChanges === false) {
            dispatch(changeModalState({screen: nextScreen}))
        }
    }

    const disabledResortEffect = sortingOptions.options.reorder === false ? {pointerEvents: 'none', opacity: 0.5} : {}

    return (
        <>
        <Box sx={{...elementBg, width: '95%', height: sw ? '80px' : '35px', display: 'flex', alignItems: 'center', mb: 1}}>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeOptionsSave(false, 'main')}>Collection Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => changeOptionsSave(false, 'sorting')}>Sorting Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Typography sx={{color: 'white', fontWeight: 700, mx: 1}}>Collection Sorting</Typography>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '85%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 1, gap: 4}}>
            <Box sx={{width: '100%', height: '20%', display: 'flex', flexDirection: sw ? 'column' : 'row', gap: 2, alignItems: 'center', ml: sw ? 0 : 10}}>
                <Typography sx={{fontSize: '18px', fontWeight: 700}}>Auto Re-Sort List:</Typography>
                <Box sx={{...theme.components.box.fullCenterRow, gap: sw ? 4 : 2}}>
                <ToggleButton 
                    sx={{padding: 1, px: 2, ...buttonStyles}} 
                    value={true} 
                    selected={sortingOptions.options.reorder === true} 
                    onChange={(e) => changeOption('reorder', true)}
                >
                    Yes
                </ToggleButton>
                <ToggleButton 
                    sx={{padding: 1, px: 2, ...buttonStyles}} 
                    value={false}
                    selected={sortingOptions.options.reorder === false} 
                    onChange={(e) => changeOption('reorder', false)}
                >
                    No
                </ToggleButton>
                </Box>
            </Box>
            <Box sx={{width: '100%', height: '20%', display: 'flex', flexDirection: sw ? 'column' : 'row', gap: 2, alignItems: 'center', ...disabledResortEffect, ml: sw ? 0:10}}>
                <Typography sx={{fontSize: '18px', fontWeight: 700}}>Sort By:</Typography>
                <Select 
                    value={sortingOptions.options.default}
                    sx={{'&.MuiInputBase-root': {width: sw ? '90%' : '70%', color: 'white', border: '1px solid white'}}}
                    size='small'
                    onChange={(e, newVal) => changeOption('default', newVal.props.value)}
                >
                    <MenuItem value='NatDexNumL2H'>Dex # - Lowest to Highest</MenuItem>
                    <MenuItem value='NatDexNumH2L'>Dex # - Highest to Lowest</MenuItem>
                    <MenuItem value='A2Z'>Name - A to Z</MenuItem>
                    <MenuItem value='Z2A'>Name - Z to A</MenuItem>
                </Select>
            </Box>
        </Box>
        <Box sx={{mt: 1, height: sw ? '50px' : '35px', width: '100%', display: 'flex'}}>
            <Box sx={{...elementBg, width: '20%', height: '100%', mr: sw ? '5%' : '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size='small' variant='contained' sx={{py: 0}} onClick={() => changeOptionsSave(false, 'exit')}>Exit</Button>
            </Box>
            <Box sx={{...elementBg, width: sw ? '35%' : '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size={sw ? 'large' : 'small'} variant='contained' sx={{py: 0, fontSize: sw ? '20px' : '15px'}} onClick={() => changeOptionsSave(true, 'sorting')}>Save</Button>
            </Box>
            {sortingOptions.saveErrorNotice && 
            <Box sx={{...elementBg, width: '25%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: sw ? 1 : 5}}>
                <Typography sx={{fontSize: '12px', color: 'white', fontWeight: 700, textAlign: 'center'}}>
                    No changes were made!
                </Typography>
            </Box>
            }
        </Box>
        <SaveChangesConfirmModal 
            open={sortingOptions.saveChangesConfirmOpen}
            modalScreen={'collectionSort'}
            saveButtonSelected={sortingOptions.saveButtonSelected}
            nextScreen={sortingOptions.nextScreen}
            sortingOptionData={{reSortWillHappen: sortingOptions.reSortWillHappen}}
            handleChange={finalizeChanges}
            closeModal={closeSaveChangesConfirm}
            saving={sortingOptions.saving}
            sw={sw}
            modalWrapperSx={{height: '70%'}}
        />
        </>
    )
}