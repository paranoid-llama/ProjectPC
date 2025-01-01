import {Box, Typography, ToggleButton} from '@mui/material'
import {useState, useEffect, useContext} from 'react'
import { AlertsContext } from '../../../../alerts/alerts-context'
import { ErrorContext } from '../../../../app/contexts/errorcontext'
import { useDispatch, useSelector } from 'react-redux'
import { getBallsInGen } from '../../../../../common/infoconstants/miscconstants'
import { changeModalState } from '../../../../app/slices/editmode'
import { setListInitialState } from '../../../../app/slices/listdisplay'
import { setSortingOptionsState } from '../../../../app/slices/collectionstate'
import { backendChangeOptions } from '../../../../../utils/functions/backendrequests/collectionoptionsedit'
import { sortOnHandList } from '../../../../../common/sortingfunctions/onhandsorting.mjs'
import OnHandSortSettingsModalContents from '../../../collectioncreation/stepcomponents/optionsselection/aprimon/onhandsortsettingsmodalcontents'
import SaveChangesConfirmModal from '../savechangesconfirmmodal'

export default function OnHandSortingOptions({elementBg, collectionGen, collectionId, demo, sw}) {
    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)
    const totalBalls = getBallsInGen(collectionGen)
    const currentOptions = useSelector((state) => state.collectionState.options.sorting.onhand)
    const onhandListState = useSelector((state) => state.collectionState.onhand)

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
    const tentativeBallOrder = [...sortingOptions.options.ballOrder, ...totalBalls.filter(ball => !sortingOptions.options.ballOrder.includes(ball))]

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

    const closeSaveChangesConfirm = () => {
        setSortingOptions({...sortingOptions, saveChangesConfirmOpen: false})
    }

    const changeOption = (field, newVal) => {
        setSortingOptions({...sortingOptions, options: {...sortingOptions.options, [field]: newVal}})
    }

    const handleBallOrderChange = (newBall) => {
        const newArr = sortingOptions.options.ballOrder.includes(newBall) ? sortingOptions.options.ballOrder.filter(b => b !== newBall) : [...sortingOptions.options.ballOrder, newBall]
        changeOption('ballOrder', newArr)
    }

    const changeOptionsSave = (saveButtonSelected, nextScreen) => {
        const ballOrderSame = !currentOptions.ballOrder.map((ball, idx) => tentativeBallOrder.indexOf(ball) === idx).includes(false) && currentOptions.ballOrder.length === sortingOptions.options.ballOrder.length
        const sortFirstBySame = (currentOptions.sortFirstBy === sortingOptions.options.sortFirstBy)
        const reOrderSame = (currentOptions.reorder === sortingOptions.options.reorder)
        const defaultSame = (currentOptions.default === sortingOptions.options.default)
        const noChangesMade = reOrderSame && defaultSame && sortFirstBySame && ballOrderSame  
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
            const editedOptionsObj = {...sortingOptions.options, ballOrder: tentativeBallOrder}
            setSortingOptions({...sortingOptions, saving: true})
            setTimeout(() => {
                if (demo) {
                    dispatch(setSortingOptionsState({listType: 'onhand', data: editedOptionsObj}))

                    //spawning alert
                    const alertMessage = `Updated On-Hand Sorting Options${sortingOptions.reSortWillHappen ? ' and re-sorted the list!' : '!'}`
                    const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                    const id = addAlert(alertInfo);
                    setAlertIds((prev) => [...prev, id]);
                    dispatch(changeModalState({open: false}))
                } else {
                    const sortedOnHandList = sortingOptions.reSortWillHappen ? sortOnHandList(sortingOptions.options.sortFirstBy, sortingOptions.options.default, tentativeBallOrder, onhandListState) : undefined
                    const backendSortedList = sortingOptions.reSortWillHappen && JSON.parse(JSON.stringify(sortedOnHandList)).map(mon => {
                        delete mon.imgLink
                        delete mon.possibleGender
                        return mon
                    })
                    const backendReqData = sortingOptions.reSortWillHappen ? {listType: 'onhand', data: sortingOptions.options, sortedList: backendSortedList} : {listType: 'onhand', data: sortingOptions.options}
                    const backendReq = async() => await backendChangeOptions('sort', backendReqData, collectionId)
                    const successFunc = () => {
                        dispatch(setSortingOptionsState({listType: 'onhand', data: editedOptionsObj}))

                        //spawning alert
                        const alertMessage = `Updated On-Hand Sorting Options${sortingOptions.reSortWillHappen ? ' and re-sorted the list!' : '!'}`
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


    const renderReorderButtons = () => (
        <Box sx={{width: '100%', height: '15%', display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'center'}}>
            <Typography sx={{fontSize: '14px', fontWeight: 700}}>Auto Re-Sort List:</Typography>
            <ToggleButton 
                sx={{padding: 1, py: 0, ...buttonStyles}} 
                value={true} 
                selected={sortingOptions.options.reorder === true} 
                onChange={(e) => changeOption('reorder', true)}
            >
                Yes
            </ToggleButton>
            <ToggleButton 
                sx={{padding: 1, py: 0, ...buttonStyles}} 
                value={false}
                selected={sortingOptions.options.reorder === false} 
                onChange={(e) => changeOption('reorder', false)}
            >
                No
            </ToggleButton>
        </Box>
    )

    return (
        <>
        <OnHandSortSettingsModalContents 
            elementBg={elementBg}
            onhandSortSettings={sortingOptions.options}
            totalBalls={totalBalls}
            tentativeBallOrder={tentativeBallOrder}
            handleChange={changeOption}
            handleBallOrderChange={handleBallOrderChange}
            changingOptions={true}
            changeOptionsSave={changeOptionsSave}
            renderReorder={renderReorderButtons}
            saveErrorNoticeShow={sortingOptions.saveErrorNotice}
            reorderActive={sortingOptions.options.reorder}
            sw={sw}
        />
        <SaveChangesConfirmModal 
            open={sortingOptions.saveChangesConfirmOpen}
            modalScreen='onhandSort'
            saveButtonSelected={sortingOptions.saveButtonSelected}
            nextScreen={sortingOptions.nextScreen}
            sortingOptionData={{reSortWillHappen: sortingOptions.reSortWillHappen}}
            handleChange={finalizeChanges}
            closeModal={closeSaveChangesConfirm}
            saving={sortingOptions.saving}
            sw={sw}
        />
        </>
    )
}