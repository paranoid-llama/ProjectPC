import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeModalState } from "../../../../app/slices/editmode";
import { setListState } from "../../../../app/slices/collectionstate";
import { selectScopeFormData, selectExcludedBallCombos } from "../../../../app/selectors/selectors";
import { getOneArrData } from "../../../../../utils/functions/scope/getonearrdata";
import { getBallsInGen } from "../../../../../common/infoconstants/miscconstants.mjs";
import { excludedCombosChange, getExcludedCombosChange } from "../../../../../utils/functions/scope/statechanges";
import { saveExcludedCombos } from "../../../../../utils/functions/scope/savescopechanges";
import { AlertsContext } from "../../../../alerts/alerts-context";
import { ErrorContext } from "../../../../app/contexts/errorcontext";
import { ownedPokemonEdit } from "../../../../../utils/functions/backendrequests/ownedpokemonedit";
import PokemonBallCombosModalContents from "../../../collectioncreation/stepcomponents/scopeselection/aprimon/pokemonballcombosmodalcontents";
import SaveChangesConfirmModal from "../savechangesconfirmmodal";

export default function BallCombosScope({elementBg, collectionGen, collectionId, demo, sw}) {
    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)
    const scopeTotal = useSelector((state) => state.editmode.pokemonScopeTotal)
    const totalList = getOneArrData(scopeTotal)
    const pokemonScope = useSelector((state) => selectScopeFormData(state, scopeTotal))
    const collectionState = useSelector((state) => state.collectionState.collection)
    const ballScope = useSelector((state) => state.collectionState.options.collectingBalls)
    const excludedBallCombosInit = useSelector((state) => selectExcludedBallCombos(state))
    const totalPossibleBalls = getBallsInGen(collectionGen)

    const [excludedCombos, setExcludedCombos] = useState({combos: excludedBallCombosInit, selected: '', saveChangesConfirmOpen: false})
    const pokemonChangeUndefined = excludedCombos.pokemonChange === undefined

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

    const selectPokemon = (pokemonId) => {
        setExcludedCombos({...excludedCombos, selected: pokemonId})
    }

    const changeBallCombo = (monInfo, ball) => {
        const newExcludedCombosState = excludedCombosChange(monInfo, ball, excludedCombos.combos)
        setExcludedCombos({...excludedCombos, combos: newExcludedCombosState})
    }

    const saveChangesConfirmOpen = (saveButtonSelected, nextScreen) => {
        const changes = getExcludedCombosChange(excludedBallCombosInit, excludedCombos.combos)
        if (saveButtonSelected && changes.changed === false) {
            setExcludedCombos({...excludedCombos, saveErrorNotice: true})
            setTimeout(() => {
                setExcludedCombos((curr) => {return {...curr, saveErrorNotice: false}})
            }, 3000)
        } else if (changes.changed === true) {
            setExcludedCombos({...excludedCombos, saveChangesConfirmOpen: true, saveButtonSelected, nextScreen, pokemonChange: changes.pokemonChange, ballChange: changes.ballChange})
        } else {
            if (nextScreen === 'exit') {
                dispatch(changeModalState({open: false}))
            } else {
                dispatch(changeModalState({open: true, screen: nextScreen}))
            }
        }
    }

    const finalizeChanges = async(saveChanges, nextScreen) => {
        if (saveChanges) {
            const newCollectionListState = saveExcludedCombos(excludedCombos.pokemonChange.addedPokemon, excludedCombos.pokemonChange.removedPokemon, excludedCombos.ballChange, collectionState)
            setExcludedCombos({...excludedCombos, saving: true})
            if (demo) {
                setTimeout(() => {
                    dispatch(setListState({collection: newCollectionListState, onlyUpdateCollection: true, resetCollectionFilters: true}))
    
                    //spawning alert
                    const alertMessage = `Updated Excluded Pokemon/Ball Combos!`
                    const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                    const id = addAlert(alertInfo);
                    setAlertIds((prev) => [...prev, id]);
    
                    dispatch(changeModalState({open: false}))
                }, 1000)
            } else {
                const newListBackendFormat = JSON.parse(JSON.stringify(newCollectionListState)).map(mon => {
                    delete mon.imgLink
                    delete mon.possibleGender
                    return mon
                })
                const backendFunc = async() => await ownedPokemonEdit(collectionGen, newListBackendFormat, collectionId)
                
                const successFunc = () => {
                    setTimeout(() => {
                        dispatch(setListState({collection: newCollectionListState, onlyUpdateCollection: true, resetCollectionFilters: true}))
        
                        //spawning alert
                        const alertMessage = `Updated Excluded Pokemon/Ball Combos!`
                        const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                        const id = addAlert(alertInfo);
                        setAlertIds((prev) => [...prev, id]);
        
                        dispatch(changeModalState({open: false}))
                    }, 1000)
                }
                const errorFunc = () => {
                    setTimeout(() => {dispatch(changeModalState({open: false}))}, 1000)
                }
                handleError(backendFunc, false, successFunc, errorFunc)
            }
        } else if (nextScreen === 'goBack') {
            setExcludedCombos({...excludedCombos, saveChangesConfirmOpen: false})
        } else if (nextScreen === 'exit') {
            dispatch(changeModalState({open: false}))
        } else if (saveChanges === false) {
            dispatch(changeModalState({screen: nextScreen}))
        }
    }

    const closeSaveChanges = () => {
        setExcludedCombos({...excludedCombos, saveChangesConfirmOpen: false})
    }

    return (
        <>
        <PokemonBallCombosModalContents 
            elementBg={elementBg}
            selectedMon={excludedCombos.selected}
            totalList={totalList}
            ballComboData={excludedCombos.combos}
            pokemonScopeData={pokemonScope}
            ballScope={ballScope}
            changePokemonSelection={selectPokemon}
            allPossibleBalls={totalPossibleBalls}
            handleChange={changeBallCombo}
            changingScope={true}
            changeScopeSave={saveChangesConfirmOpen}
            saveErrorNoticeShow={excludedCombos.saveErrorNotice}
            sw={sw}
        />
        <SaveChangesConfirmModal 
            open={excludedCombos.saveChangesConfirmOpen}
            modalScreen='excludedCombos'
            saveButtonSelected={excludedCombos.saveButtonSelected}
            excludedCombosData={{
                addedPokemonCombos: pokemonChangeUndefined ? [] : excludedCombos.pokemonChange.addedPokemon, 
                removedPokemonCombos: pokemonChangeUndefined ? [] : excludedCombos.pokemonChange.removedPokemon, 
                ballChanges: pokemonChangeUndefined ? [] : excludedCombos.ballChange
            }}
            nextScreen={excludedCombos.nextScreen}
            handleChange={finalizeChanges}
            closeModal={closeSaveChanges}
            saving={excludedCombos.saving}
            sw={sw}
        />
        </>
    )
}