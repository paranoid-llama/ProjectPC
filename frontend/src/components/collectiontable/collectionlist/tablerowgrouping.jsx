import * as React from 'react';
import {useState, useEffect, useRef, useContext} from 'react'
import { ErrorContext } from '../../../app/contexts/errorcontext';
import { AlertsContext } from '../../../alerts/alerts-context';
import Box from '@mui/material/Box'
import './../../../routes/showCollection.css'
import TableCell from '@mui/material/TableCell'
import IsOwnedCheckbox from '../tabledata/isownedcheckbox'
import DataCell from '../tabledata/datacell'
import {useLoaderData} from 'react-router-dom'
import {useSelector, useDispatch, connect} from 'react-redux'
import {setIsOwned, setIsHA, setEmCount, setEms, deleteEms} from './../../../app/slices/collectionstate'
import {setMaxEmArr, selectNextEmCount} from './../../../../utils/functions/misc'
import {seeIfPokemonIsSelected, selectCollectionPokemon, selectIdxOfMon} from './../../../app/selectors/selectors'
import {setSelected, deselect, setSelectedAfterChangingOwned} from './../../../app/slices/editmode'
import {usePutRequest} from './../../../../utils/functions/backendrequests/editcollection'
import getDefaultData from '../../../../utils/functions/defaultdata';
import { apriballs } from '../../../../common/infoconstants/miscconstants.mjs';
import getNameDisplay from '../../../../utils/functions/display/getnamedisplay';
import {createSelector} from '@reduxjs/toolkit'
import {setCollectionInitialState} from '../../../app/slices/collection'
import { setUnsavedChanges } from './../../../app/slices/editmode';
import store from '../../../app/store'
import newObjectId from '../../../../utils/functions/newobjectid';

const blackTableCellStyles = { //for illegal ball combos
    color: 'white',
    backgroundColor: 'black'
}

const disabledTableCellStyles = { //for disabled ball combos (which the user purposefully doesn't wanna collect)
    color: 'white',
    backgroundColor: 'grey'
}

export function TableRowGroupingNoRedux({columns, row, id, collectionId, ownerId, styles, isHomeCollection, availableGames, isTradePage, tradeSide, wantedByOtherList, userData}) {
    return (
        <React.Fragment>
            {columns.map(c => {
                const isImg = c.label === 'img' && true
                const textSizeAdjustor = c.dataKey === 'name' && row[c.dataKey] === 'Basculin (White-Striped)' ? {fontSize: '13px'} : {}
                const validBallCombo = apriballs.includes(c.dataKey) && (row.balls[c.dataKey] !== undefined && row.balls[c.dataKey].disabled !== true)
                const isBallColumn = row.balls[c.dataKey] !== undefined
                const wantedData = isBallColumn && (wantedByOtherList[0] === undefined ? {} : wantedByOtherList[0].balls.includes(c.dataKey) ? {wanted: true} : {})
                const nameLabel = (c.dataKey === 'name' && userData.loggedIn) ? getNameDisplay(userData.user.settings.display.pokemonNames, row[c.dataKey], row.natDexNum) : c.dataKey === 'name' && row[c.dataKey]
                
                return (
                    c.label === '#' ? 
                        <DataCell
                            key={`${row.imgLink}-${c.label}`}
                            label={row[c.dataKey]} 
                            styles={styles} 
                            alignment={styles.alignment.numAlignment}
                            isEditMode={false}
                            leftMostCell={true}
                            isSelected={false}
                            onClickFunc={null}
                        /> :
                    row[c.dataKey] !== undefined ? 
                        <DataCell 
                            key={`${row.imgLink}-${c.label}`}
                            label={c.dataKey === 'name' && nameLabel}
                            styles={styles}
                            alignment={c.label === 'img' ? styles.alignment.imgAlignment : c.dataKey === 'name' && {position: 'relative'}}
                            imgParams={{isImg: isImg, imgLinkKey: row.imgLink}}
                            specialStyles={textSizeAdjustor}
                            isEditMode={false}
                            isSelected={false}
                            onClickFunc={null}
                            availableGames={(availableGames === undefined) ? undefined : c.dataKey === 'name' ? availableGames[row.name] : undefined}
                        />:
                    row.balls[c.dataKey] === undefined ? 
                        <TableCell sx={blackTableCellStyles} key={`${row.imgLink}-${c.label}`}>
                        </TableCell> :
                    row.balls[c.dataKey].disabled === true ? 
                        <TableCell sx={disabledTableCellStyles} key={`${row.imgLink}-${c.label}`}>
                        </TableCell> :
                    <IsOwnedCheckbox
                        key={`${row.imgLink}-${c.label}`} 
                        ballInfo={row.balls}
                        handleEditBallInfo={null}
                        pokeName={row.name}
                        ball={c.dataKey}
                        collectionId={collectionId}
                        ownerId={ownerId}
                        styles={styles}
                        isEditMode={false}
                        isHomeCollection={isHomeCollection}
                        isTradePage={isTradePage}
                        tradeSide={tradeSide}
                        tradeDispData={isTradePage && {
                            pData: {name: row.name, id: row.imgLink, natDexNum: row.natDexNum},
                            ballData: {
                                ball: c.dataKey, 
                                ...wantedData,
                                ...row.balls[c.dataKey]
                            }
                        }}
                    />
                )
            })}
        </React.Fragment>
    )
}

//dont remove id, mapStateToProps uses it
function TableRowGrouping({columns, row, id, collectionId, ownerId, styles, isSelected, setSelected, isEditMode, demo, isHomeCollection, userData}) {
    const dispatch = useDispatch()
    // console.log(`rendered ${row.name}`)

    if (row === undefined) { //when switching between collections theres seems to be a bit of lag in updating the state, even though i tried to stop it.
        return <>
            {columns.map(c => {
                return (
                    <TableCell key={`${id}-${c.dataKey}-${newObjectId()}-undefined-row`} sx={{backgroundColor: 'black'}}></TableCell>
                )
            })}
        </>
    }

    const {handleError} = useContext(ErrorContext)
    const {addAlert} = useContext(AlertsContext)
    //following data is used for editing values in the list
    const possibleEggMoves = ((isEditMode || demo) && !isHomeCollection) ? useSelector((state) => state.collectionState.eggMoveInfo[row.name]) : null
    const maxEMs = ((isEditMode || demo) && !isHomeCollection) ? possibleEggMoves.length > 4 ? 4 : possibleEggMoves.length : null
    const emCountSelectionList = ((isEditMode || demo) && !isHomeCollection) ? setMaxEmArr(maxEMs) : null
    const idx = (isEditMode || demo) ? useSelector(state => state.collectionState.collection.findIndex((p) => p.imgLink === id)) : null
    const unsavedChanges = (isEditMode || demo) ? useSelector((state) => state.editmode.unsavedChanges) : null

    //available games
    const availableGames = (isHomeCollection) ? useSelector((state) => state.collectionState.availableGamesInfo[row.name]) : null

    //default data
    const globalDefaults = (isEditMode || demo) ? useSelector((state) => state.collectionState.options.globalDefaults) : null
    const checkDefault = Object.keys(row.balls)[Object.values(row.balls).map((b) => b.default !== undefined).indexOf(true)]
    const currentDefault = checkDefault === undefined ? 'none' : checkDefault

    const handleEditBallInfo = (e, key, pokename, ballname, collectionID, ownerID) => {
        const newValue = 
            (
                key === 'isOwned' ? e.target.checked :
                key === 'isHA' ? !(e.target.value === 'true') :
                key === 'emCount' ? selectNextEmCount(emCountSelectionList, parseInt(e.target.value)) :
                key === 'EMs' && 'none'
            )
        const deleteEMs = key === 'emCount' && row.balls[ballname].EMs.length > newValue
        const hasAllPossibleEMs = key === 'emCount' && newValue === possibleEggMoves.length
        const defaultData = key === 'emCount' ? (deleteEMs ? {EMs: []} : hasAllPossibleEMs ? {EMs: possibleEggMoves} : undefined) : getDefaultData(globalDefaults, currentDefault, row.balls, maxEMs, possibleEggMoves, ballname)
        // const successFunc = () => {
        if (key === 'isOwned') {
            if (newValue === true) {
                dispatch(setSelectedAfterChangingOwned({idx: id, ball: ballname}))
            }
            dispatch(setIsOwned({idx, ball: ballname, ballDefault: defaultData}))
        } else if (key === 'isHA') {
            dispatch(setIsHA({idx, ball: ballname, listType: 'collection'}))
        } else if (key === 'emCount') {
            dispatch(setEmCount({idx, ball: ballname, listType: 'collection', numEMs: newValue}))
            if (deleteEMs) {
                dispatch(deleteEms({idx, ball: ballname, listType: 'collection'}))
            }
            if (hasAllPossibleEMs) {
                for (let eggmove of possibleEggMoves) {
                    dispatch(setEms({idx, ball: ballname, listType: 'collection', emName: eggmove}))
                }
            }
        }
        // if (unsavedChanges === false) {addAlert({severity: 'error', timeout: 4, message: 'You have unsaved changes. Make sure to save before leaving!'})}
        dispatch(setUnsavedChanges())
        // }}
        // const backendFunc = async() => await usePutRequest(key, newValue, {pokename, ballname}, 'collection', collectionID, ownerID, defaultData)
        // handleError(backendFunc, false, successFunc, () => {})
    }

    const blackTableCellStyles = { //for illegal ball combos
        color: 'white',
        backgroundColor: 'black'
    }

    const disabledTableCellStyles = { //for disabled ball combos (which the user purposefully doesn't wanna collect)
        color: 'white',
        backgroundColor: 'grey'
    }

    return (
        <React.Fragment>
            {columns.map(c => {
                const isImg = c.label === 'img' && true
                const textSizeAdjustor = c.dataKey === 'name' && row[c.dataKey] === 'Basculin (White-Striped)' ? {fontSize: '13px'} : {}
                const validBallCombo = apriballs.includes(c.dataKey) && (row.balls[c.dataKey] !== undefined && row.balls[c.dataKey].disabled !== true)
                const nameLabel = (c.dataKey === 'name' && userData.loggedIn) ? getNameDisplay(userData.user.settings.display.pokemonNames, row[c.dataKey], row.natDexNum) : c.dataKey === 'name' && row[c.dataKey]
                return (
                    c.label === '#' ? 
                        <DataCell
                            key={`${row.imgLink}-${c.label}`}
                            label={row[c.dataKey]} 
                            styles={styles} 
                            alignment={styles.alignment.numAlignment}
                            isEditMode={isEditMode}
                            leftMostCell={true}
                            isSelected={isSelected}
                            onClickFunc={isSelected ? null : setSelected}
                        /> :
                    row[c.dataKey] !== undefined ? 
                        <DataCell 
                            key={`${row.imgLink}-${c.label}`}
                            label={c.dataKey === 'name' && nameLabel}
                            styles={styles}
                            alignment={c.label === 'img' ? styles.alignment.imgAlignment : c.dataKey === 'name' && {position: 'relative'}}
                            imgParams={{isImg: isImg, imgLinkKey: row.imgLink}}
                            specialStyles={textSizeAdjustor}
                            isEditMode={isEditMode}
                            isSelected={isSelected}
                            onClickFunc={isSelected ? null : setSelected}
                            availableGames={(availableGames === null) ? undefined : c.dataKey === 'name' ? availableGames : undefined}
                        />:
                    row.balls[c.dataKey] === undefined ? 
                        <TableCell sx={blackTableCellStyles} key={`${row.imgLink}-${c.label}`}>
                        </TableCell> :
                    row.balls[c.dataKey].disabled === true ? 
                        <TableCell sx={disabledTableCellStyles} key={`${row.imgLink}-${c.label}`}>
                        </TableCell> :
                    <IsOwnedCheckbox
                        key={`${row.imgLink}-${c.label}`} 
                        id={row.imgLink}
                        ballInfo={row.balls}
                        isSelectedEditPage={isSelected}
                        handleEditBallInfo={handleEditBallInfo}
                        pokeName={row.name}
                        ball={c.dataKey}
                        collectionId={collectionId}
                        ownerId={ownerId}
                        styles={styles}
                        isEditMode={isEditMode}
                        isHomeCollection={isHomeCollection}
                    />
                )
            })}
        </React.Fragment>
    )
}

const mapStateToProps = function(state, ownProps) {
    if (!ownProps.isEditMode && !ownProps.demo) {
        return {}
    } 
    const isPokemonSelected = seeIfPokemonIsSelected(state, ownProps.id)
    // const pokemon = state.collection[ownProps.idx]
    const pokemon = selectCollectionPokemon(state, ownProps.id)
    return {
        row: pokemon,
        isSelected: isPokemonSelected
    }
}

const mapDispatchToProps = function(dispatch, ownProps) {
    if (!ownProps.isEditMode && !ownProps.demo) {
        return {}
    }
    return {
        setSelected: () => dispatch(setSelected(ownProps.id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableRowGrouping);
