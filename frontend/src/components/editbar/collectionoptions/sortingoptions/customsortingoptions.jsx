import {useState, useEffect, useContext} from 'react'
import { AlertsContext } from '../../../../alerts/alerts-context'
import { ErrorContext } from '../../../../app/contexts/errorcontext'
import { useDispatch, useSelector } from 'react-redux'
import { selectCustomSortData } from '../../../../app/selectors/selectors'
import { changeModalState } from '../../../../app/slices/editmode'
import { sortList, customSortChanges } from '../../../../../common/sortingfunctions/customsorting.mjs'
import { ownedPokemonEdit } from '../../../../../utils/functions/backendrequests/ownedpokemonedit'
import CustomSortModalContents from '../../../collectioncreation/stepcomponents/optionsselection/aprimon/customsortmodalcontents'
import SaveChangesConfirmModal from '../savechangesconfirmmodal'
import { setListState } from '../../../../app/slices/collectionstate'

export default function CustomSortingOptions({elementBg, collectionGen, collectionId, demo, sw}) {
    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)
    const customSortStateInit = useSelector((state) => selectCustomSortData(state))
    const collectionState = useSelector((state) => state.collectionState.collection)

    const [sortData, setSortData] = useState({customSort: customSortStateInit, holdPokemon: [], saveChangesConfirmOpen: false})
    
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
        setSortData({...sortData, saveChangesConfirmOpen: false})
    }

    const handleChange = (result) => {
        const draggedPokemonData = result.source.droppableId === 'customSort' ? sortData.customSort.filter(p => p.id === result.draggableId)[0] : sortData.holdPokemon.filter(p => p.id === result.draggableId)[0]
        if (result.destination === null) {return}
        if (result.destination.droppableId === "holdList") {
            const newCustomSortState = result.source.droppableId === 'customSort' ? sortData.customSort.filter(p => p.id !== result.draggableId) : sortData.customSort
            const newHoldListState = result.source.droppableId === 'customSort' ? [...sortData.holdPokemon, draggedPokemonData] : [...sortData.holdPokemon]
            setSortData({...sortData, customSort: newCustomSortState, holdPokemon: newHoldListState})
        } else if (result.destination.droppableId === 'customSort') {
            const newHoldListState = result.source.droppableId === 'holdList' ? sortData.holdPokemon.filter(p => p.id !== result.draggableId) : sortData.holdPokemon
            const newCustomSortState = result.source.droppableId === 'holdList' ? [...sortData.customSort] : sortData.customSort.filter(p => p.id !== result.draggableId)
            newCustomSortState.splice(result.destination.index, 0, draggedPokemonData)
            setSortData({...sortData, customSort: newCustomSortState, holdPokemon: newHoldListState})
        }
    }

    const handleSortByKey = (key) => {
        const newCustomSortState = sortList(key, sortData.customSort)
        setSortData({...sortData, customSort: newCustomSortState})
    }
    
    const changeOptionsSave = (saveButtonSelected, nextScreen) => {
        const noChangesMade = !sortData.customSort.map((mon, idx) => customSortStateInit[idx].id === mon.id).includes(false)
        if (saveButtonSelected && noChangesMade) {
            setSortData({...sortData, saveErrorNotice: true})
            setTimeout(() => {
                setSortData((curr) => {return {...curr, saveErrorNotice: false}})
            }, 3000)
        } else if (!noChangesMade) {
            setSortData({...sortData, saveChangesConfirmOpen: true, saveButtonSelected, nextScreen})
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
            const enabledMonsOrderRef = [...sortData.customSort, ...sortData.holdPokemon].map((mon, idx) => {return {...mon, idx}})
            const newCollectionListState = customSortChanges(enabledMonsOrderRef, collectionState)
            const backendListFormat = JSON.parse(JSON.stringify(newCollectionListState)).map(mon => {
                delete mon.imgLink
                delete mon.possibleGender
                return mon
            })
            setSortData({...sortData, saving: true})
            setTimeout(() => {
                if (demo) {
                    dispatch(setListState({collection: newCollectionListState, resetCollectionFilters: true, onlyUpdateCollection: true}))

                    //spawning alert
                    const alertMessage = `Sorted Collection List!`
                    const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                    const id = addAlert(alertInfo);
                    setAlertIds((prev) => [...prev, id]);
                    dispatch(changeModalState({open: false}))
                } else {
                    const backendReq = async() => await ownedPokemonEdit(collectionGen, backendListFormat, collectionId)
                    const successFunc = () => {
                        dispatch(setListState({collection: newCollectionListState, resetCollectionFilters: true, onlyUpdateCollection: true}))

                        //spawning alert
                        const alertMessage = `Sorted Collection List!`
                        const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                        const id = addAlert(alertInfo);
                        setAlertIds((prev) => [...prev, id]);
                        dispatch(changeModalState({open: false}))
                    }
                    handleError(backendReq, false, successFunc, () => {dispatch(changeModalState({open: false}))}) 
                }
            }, 1000)
        } else if (nextScreen === 'goBack') {
            setSortData({...sortData, saveChangesConfirmOpen: false})
        } else if (nextScreen === 'exit') {
            dispatch(changeModalState({open: false}))
        } else if (saveChanges === false) {
            dispatch(changeModalState({screen: nextScreen}))
        }
    }

    return (
        <>
        <CustomSortModalContents 
            elementBg={elementBg}
            customSortState={sortData.customSort}
            holdPokemon={sortData.holdPokemon}
            handleChange={handleChange}
            handleChangeBySortKey={handleSortByKey}
            changingCustomSort={true}
            changeOptionsSave={changeOptionsSave}
            saveErrorNoticeShow={sortData.saveErrorNotice}
            sw={sw}
        />
        <SaveChangesConfirmModal 
            open={sortData.saveChangesConfirmOpen}
            modalScreen='customSort'
            saveButtonSelected={sortData.saveButtonSelected}
            nextScreen={sortData.nextScreen}
            handleChange={finalizeChanges}
            closeModal={closeSaveChangesConfirm}
            saving={sortData.saving}
            sw={sw}
        />
        </>
    )
}