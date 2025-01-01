import PokemonGroupModalContents from '../../../collectioncreation/stepcomponents/scopeselection/aprimon/pokemongroupmodalcontents';
import { useSelector } from 'react-redux';
import { selectScopeFormData } from '../../../../app/selectors/selectors';
import { useState, useEffect, useContext } from 'react';
import { getScopePeripheralInfo } from '../../../../../utils/functions/scope/getperipheralinfo';
import { scopeSingleChange, scopeMassChange } from '../../../../../utils/functions/scope/statechanges';
import { getOneArrData } from '../../../../../utils/functions/scope/getonearrdata';
import { useDispatch } from 'react-redux';
import { changeModalState } from '../../../../app/slices/editmode';
import { saveScopeChangesAndGetNewList } from '../../../../../utils/functions/scope/savescopechanges';
import SaveChangesConfirmModal from '../savechangesconfirmmodal';
import { AlertsContext } from '../../../../alerts/alerts-context';
import { ErrorContext } from '../../../../app/contexts/errorcontext';
import { setListState } from '../../../../app/slices/collectionstate';

export default function PokemonScope({elementBg, collectionGen, collectionId, demo, sw}) {
    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)
    const scopeTotal = useSelector((state) => state.editmode.pokemonScopeTotal)
    const oneArrLegalityInfo = getOneArrData(scopeTotal, false)
    const collectionState = useSelector((state) => state.collectionState.collection)
    const optionsState = useSelector((state) => state.collectionState.options)
    const formDataInit = useSelector((state) => selectScopeFormData(state, scopeTotal))
    const groupKeys = Object.keys(scopeTotal)
    const groupKeysWithSubGroups = groupKeys.filter((groupKey) => !Array.isArray(scopeTotal[groupKey]))
    const subGroupModalInit = {subGroup: {}}

    for (let gK of groupKeysWithSubGroups) {
        if (gK === 'babyAdultMons') {
            subGroupModalInit.subGroup[gK] = 'regular'
        } else {
            subGroupModalInit.subGroup[gK] = Object.keys(scopeTotal[gK])[0]
        }
    }

    const [modalState, setModalState] = useState({group: groupKeys[0], ...subGroupModalInit, saveChangesConfirmOpen: false, saveErrorNotice: false})
    const [formData, setFormData] = useState({pokemon: formDataInit, addedPokemon: [], removedPokemon: []})
    
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

    const collectionAutoSort = optionsState.sorting.collection.reorder
    const collectionSortOrder = optionsState.sorting.collection.default
    const ballScope = optionsState.collectingBalls

    const changeGroup = (e, groupKey) => {
        setModalState({...modalState, group: groupKey})
    }

    const changeSubGroup = (e, subGroupKey) => {
        setModalState({...modalState, subGroup: {...modalState.subGroup, [modalState.group]: subGroupKey}})
    }

    const saveChangesConfirmOpen = (saveButtonSelected, nextScreen) => {
        const noChangesMade = (formData.addedPokemon.length === 0 && formData.removedPokemon.length === 0)
        if (saveButtonSelected && noChangesMade) {
            setModalState({...modalState, saveErrorNotice: true})
            setTimeout(() => {
                setModalState((curr) => {return {...curr, saveErrorNotice: false}})
            }, 3000)
        } else if (!noChangesMade) {
            setModalState({...modalState, saveChangesConfirmOpen: true, saveButtonSelected, nextScreen})
        } else {
            if (nextScreen === 'exit') {
                dispatch(changeModalState({open: false}))
            } else {
                dispatch(changeModalState({open: true, screen: nextScreen}))
            }
        }
    }
    
    const closeSaveChangesConfirm = () => {
        setModalState({...modalState, saveChangesConfirmOpen: false})
    }

    const togglePokemon = (e, groupInfo, imgLink, name, natDexNum) => {
        const newPokemonScopeState = scopeSingleChange(groupInfo, {name, id: imgLink, natDexNum}, formData.pokemon, true, formData.addedPokemon, formData.removedPokemon)
        setFormData(newPokemonScopeState)
    }

    const massTogglePokemon = (e, groupInfo, type) => {
        const newPokemonScopeState = scopeMassChange(groupInfo, type, formData.pokemon, scopeTotal, ballScope, true, formData.addedPokemon, formData.removedPokemon)
        if (newPokemonScopeState === 'doNothing') {
            null
        } else {
            setFormData(newPokemonScopeState)
        }
    }

    const finalizeChanges = async(saveChanges, nextScreen) => {
        if (saveChanges) {
            const backendFunc = async() => await saveScopeChangesAndGetNewList(formData.addedPokemon, formData.removedPokemon, collectionState, collectionGen, collectionId, collectionAutoSort, collectionSortOrder, ballScope, oneArrLegalityInfo, demo, {gen: collectionGen, ownedPokemon: collectionState})
            setModalState({...modalState, saving: true})
            const successFunc = (newListState) => {
                setTimeout(() => {
                    const actualListState = newListState.list !== undefined ? newListState.list : newListState
                    const updatedEggMoveInfo = newListState.updatedEggMoveInfo 
                    const updateEggMoveData = updatedEggMoveInfo !== undefined
                    const updatedHomeGames = newListState.updatedHomeGames
                    dispatch(setListState({collection: actualListState, onlyUpdateCollection: true, resetCollectionFilters: true, updatedEggMoveInfo: updateEggMoveData ? updatedEggMoveInfo : undefined, updatedHomeGames}))

                    //spawning alert
                    const alertMessage = `Updated Pokemon Scope!`
                    const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                    const id = addAlert(alertInfo);
                    setAlertIds((prev) => [...prev, id]);

                    dispatch(changeModalState({open: false}))
                }, 1000)
            }
            const errorFunc = () => {
                setTimeout(() => {
                    dispatch(changeModalState({open: false})) 
                }, 1000)
            }
            handleError(backendFunc, false, successFunc, errorFunc)
        } else if (nextScreen === 'goBack') {
            setModalState({...modalState, saveChangesConfirmOpen: false})
        } else if (nextScreen === 'exit') {
            dispatch(changeModalState({open: false}))
        } else if (saveChanges === false) {
            dispatch(changeModalState({screen: nextScreen}))
        }
    }

    const scopePeripheryInfo = getScopePeripheralInfo(modalState, groupKeys, formData.pokemon, scopeTotal)
    const tyroguePresent = scopeTotal.breedables.regular !== undefined ? scopeTotal.breedables.regular.filter(mon => mon.imgLink === '236').length !== 0 : scopeTotal.breedables.filter(mon => mon.imgLink === '236').length !== 0

    return (
        <>
        <PokemonGroupModalContents 
            elementBg={elementBg}
            modalState={modalState}
            groupKeys={groupKeys}
            ballScope={ballScope}
            changeGroup={changeGroup}
            changeSubGroup={changeSubGroup}
            handleChange={togglePokemon}
            handleMassChange={massTogglePokemon}
            scopePeripheryInfo={scopePeripheryInfo}
            tyroguePresent={tyroguePresent}
            changingScope={true}
            changeScopeSave={saveChangesConfirmOpen}
            saveErrorNoticeShow={modalState.saveErrorNotice}
            sw={sw}
        />
        <SaveChangesConfirmModal 
            open={modalState.saveChangesConfirmOpen}
            modalScreen='pokemonScope'
            saveButtonSelected={modalState.saveButtonSelected}
            nextScreen={modalState.nextScreen}
            pokemonScopeData={{addedPokemon: formData.addedPokemon, removedPokemon: formData.removedPokemon, collectionAutoSort: collectionAutoSort, collectionSortOrder: collectionSortOrder}}
            handleChange={finalizeChanges}
            closeModal={closeSaveChangesConfirm}
            saving={modalState.saving}
            sw={sw}
        />
        </>
    )
}