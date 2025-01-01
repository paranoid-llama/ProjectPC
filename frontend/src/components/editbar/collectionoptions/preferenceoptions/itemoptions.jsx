import { useState, useEffect, useContext } from "react";
import { AlertsContext } from "../../../../alerts/alerts-context";
import { ErrorContext } from "../../../../app/contexts/errorcontext";
import { useDispatch, useSelector } from "react-redux";
import { changeModalState } from "../../../../app/slices/editmode";
import { setItemState } from "../../../../app/slices/collectionstate";
import { getPossibleItems } from "../../../../../common/infoconstants/miscconstants.mjs";
import { backendChangeOptions } from "../../../../../utils/functions/backendrequests/collectionoptionsedit";
import ItemSelectionModalContents from "../../../collectioncreation/stepcomponents/optionsselection/aprimon/itemselectionmodalcontents";
import SaveChangesConfirmModal from "../savechangesconfirmmodal";

export default function ItemOptions({elementBg, collectionGen, collectionId, demo, sw}) {
    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)
    const tradePreferences = useSelector((state) => state.collectionState.options.tradePreferences)
    const lfDisabled = tradePreferences.items === 'none' || tradePreferences.items === 'ft'
    const ftDisabled = tradePreferences.items === 'none' || tradePreferences.items === 'lf'
    const totalItems = getPossibleItems(collectionGen)
    const stateInit = {
        data: {lfItems: tradePreferences.lfItems, ftItems: tradePreferences.ftItems}, 
        tab: tradePreferences.items === 'lf' || tradePreferences.items === 'lf/ft' ? 'lf' : 'ft',
        ftSelectedItem: 'none',
        saveChangesConfirmOpen: false
    }

    const [items, setItems] = useState(stateInit)

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
        setItems({...items, saveChangesConfirmOpen: false})
    }

    const changeTab = () => {
        setItems({...items, tab: items.tab === 'lf' ? 'ft' : 'lf'})
    }

    const handleLfItemsChange = (newItem) => {
        const newLfItems = items.data.lfItems.includes(newItem) ? items.data.lfItems.filter(item => item !== newItem) : [...items.data.lfItems, newItem]
        setItems({...items, data: {...items.data, lfItems: newLfItems}})
    }

    const handleFtItemsChange = (item, changingQty, newQty, doNotUpdateFtSelectedItem=false) => {
        const copyOfFt = {...items.data.ftItems}
        if (Object.keys(copyOfFt).includes(item)) {
            if (changingQty) {
                if (newQty <= 999) {
                    copyOfFt[item] = newQty
                }
            }
            else {
                if (doNotUpdateFtSelectedItem) {
                    setItems({...items, ftSelectedItem: item})
                    return
                }
                delete copyOfFt[item]
                setItems({...items, data: {...items.data, ftItems: copyOfFt}, ftSelectedItem: 'none'})
                return
            }
        } else {
            copyOfFt[item] = 0
            setItems({...items, data: {...items.data, ftItems: copyOfFt}, ftSelectedItem: item})
            return
        }
        setItems({...items, data: {...items.data, ftItems: copyOfFt}})
    }

    const changeFtSelectedItem = (newVal, literalNewVal=false) => {
        setItems({...items, ftSelectedItem: literalNewVal ? newVal : newVal.props.value})
    }

    const changeItemsSave = (saveButtonSelected, nextScreen) => {
        const noLFItemsChanges = (tradePreferences.lfItems.length === items.data.lfItems.length) && (tradePreferences.lfItems.length === 0 || !tradePreferences.lfItems.map(item => items.data.lfItems.includes(item)).includes(false))
        const noFTItemsChanges = (Object.keys(tradePreferences.ftItems).length === Object.keys(items.data.ftItems).length) && (Object.keys(tradePreferences.ftItems).length === 0 || !Object.keys(tradePreferences.ftItems).map(item => tradePreferences.ftItems[item] === items.data.ftItems[item]).includes(false))
        const noChangesMade = noLFItemsChanges && noFTItemsChanges
        if (saveButtonSelected && noChangesMade) {
            setItems({...items, saveErrorNotice: true})
            setTimeout(() => {
                setItems((curr) => {return {...curr, saveErrorNotice: false}})
            }, 3000)
        } else if (!noChangesMade) {
            setItems({...items, saveChangesConfirmOpen: true, saveButtonSelected, nextScreen})
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
            const newItems = {lfItems: items.data.lfItems, ftItems: items.data.ftItems}
            setItems({...items, saving: true})
            setTimeout(() => {
                if (demo) {
                    dispatch(setItemState(newItems))

                    //spawning alert
                    const alertMessage = `Set Item Options!`
                    const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                    const id = addAlert(alertInfo);
                    setAlertIds((prev) => [...prev, id]);
                    dispatch(changeModalState({open: false}))
                } else {
                    const backendReq = async() => await backendChangeOptions('items', newItems, collectionId)
                    const successFunc = () => {
                        dispatch(setItemState(newItems))

                        //spawning alert
                        const alertMessage = `Set Item Options!`
                        const alertInfo = {severity: 'success', message: alertMessage, timeout: 3}
                        const id = addAlert(alertInfo);
                        setAlertIds((prev) => [...prev, id]);
                        dispatch(changeModalState({open: false}))
                    }
                    handleError(backendReq, false, successFunc, () => {dispatch(changeModalState({open: false}))})
                }
            }, 1000)
        } else if (nextScreen === 'goBack') {
            setItems({...items, saveChangesConfirmOpen: false})
        } else if (nextScreen === 'exit') {
            dispatch(changeModalState({open: false}))
        } else if (saveChanges === false) {
            dispatch(changeModalState({screen: nextScreen}))
        }
    }

    return (
        <>
        <ItemSelectionModalContents 
            elementBg={elementBg}
            activeTab={items.tab}
            changeTab={changeTab}
            totalItems={totalItems}
            lfItems={items.data.lfItems}
            ftItems={items.data.ftItems}
            handleChange={items.tab === 'lf' ? handleLfItemsChange : handleFtItemsChange}
            ftSelectedItem={items.ftSelectedItem}
            changeFtSelectedItem={changeFtSelectedItem}
            lfDisabled={lfDisabled}
            ftDisabled={ftDisabled}
            changingItems={true}
            saveChanges={changeItemsSave}
            saveErrorNoticeShow={items.saveErrorNotice}
            sw={sw}
        />
        <SaveChangesConfirmModal 
            open={items.saveChangesConfirmOpen}
            modalScreen='items'
            saveButtonSelected={items.saveButtonSelected}
            nextScreen={items.nextScreen}
            handleChange={finalizeChanges}
            closeModal={closeSaveChangesConfirm}
            saving={items.saving}
            sw={sw}
        />
        </>
    )
}