import * as React from 'react';
import {useState, useEffect, useRef} from 'react'
import Box from '@mui/material/Box'
import './../../../routes/showCollection.css'
import TableCell from '@mui/material/TableCell'
import IsOwnedCheckbox from '../tabledata/isownedcheckbox'
import DataCell from '../tabledata/datacell'
import {useLoaderData} from 'react-router-dom'
import {useSelector, useDispatch, connect} from 'react-redux'
import {setIsOwned, setCollectionIsHA, setCollectionEmCount, setCollectionEms, deleteCollectionEms} from './../../../app/slices/collection'
import {setMaxEmArr, selectNextEmCount} from './../../../../utils/functions/misc'
import {seeIfPokemonIsSelected, selectCollectionPokemon, selectIdxOfMon} from './../../../app/selectors/selectors'
import {setSelected, deselect, setSelectedAfterChangingOwned} from './../../../app/slices/editmode'
import {usePutRequest} from './../../../../utils/functions/backendrequests/editcollection'
import getDefaultData from '../../../../utils/functions/defaultdata';
import { apriballs } from '../../../../../common/infoconstants/miscconstants.mjs';
import {createSelector} from '@reduxjs/toolkit'
import {setCollectionInitialState} from '../../../app/slices/collection'
import store from '../../../app/store'

const blackTableCellStyles = { //for illegal ball combos
    color: 'white',
    backgroundColor: 'black'
}

const disabledTableCellStyles = { //for disabled ball combos (which the user purposefully doesn't wanna collect)
    color: 'white',
    backgroundColor: 'grey'
}

export function TableRowGroupingNoRedux({columns, row, id, collectionId, ownerId, styles, isHomeCollection, availableGames, isTradePage, tradeSide}) {
    return (
        <React.Fragment>
            {columns.map(c => {
                const isImg = c.label === 'img' && true
                const textSizeAdjustor = c.dataKey === 'name' && row[c.dataKey] === 'Basculin (White-Striped)' ? {fontSize: '13px'} : {}
                const validBallCombo = apriballs.includes(c.dataKey) && (row.balls[c.dataKey] !== undefined && row.balls[c.dataKey].disabled !== true)
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
                            label={c.dataKey === 'name' && row[c.dataKey]}
                            styles={styles}
                            alignment={c.label === 'img' && styles.alignment.imgAlignment}
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
                            ballData: {ball: c.dataKey, ...row.balls[c.dataKey]}
                        }}
                    />
                )
            })}
        </React.Fragment>
    )
}

//dont remove id, mapStateToProps uses it
function TableRowGrouping({columns, row, id, collectionId, ownerId, styles, isSelected, setSelected, isEditMode, isHomeCollection, availableGames}) {
    const dispatch = useDispatch()
    // console.log(`rendered ${row.name}`)

    //following data is used for editing values in the list
    const possibleEggMoves = (isEditMode && !isHomeCollection) ? useSelector((state) => state.listDisplay.eggMoveInfo[row.name]) : null
    const maxEMs = (isEditMode && !isHomeCollection) ? possibleEggMoves.length > 4 ? 4 : possibleEggMoves.length : null
    const emCountSelectionList = (isEditMode && !isHomeCollection) ? setMaxEmArr(maxEMs) : null
    const idx = isEditMode ? useSelector(state => state.collection.indexOf(row)) : null

    //default data
    const globalDefaults = isEditMode ? useSelector((state) => state.options.globalDefaults) : null
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
        const defaultData = getDefaultData(globalDefaults, currentDefault, row.balls, maxEMs, possibleEggMoves, ballname)
        if (key === 'isOwned') {
            if (newValue === true) {
                dispatch(setSelectedAfterChangingOwned({idx: id, ball: ballname}))
            }
            dispatch(setIsOwned({idx, ball: ballname, ballDefault: defaultData}))
        } else if (key === 'isHA') {
            dispatch(setCollectionIsHA({idx, ball: ballname, listType: 'collection'}))
        } else if (key === 'emCount') {
            dispatch(setCollectionEmCount({idx, ball: ballname, listType: 'collection', numEMs: newValue}))
            if (row.balls[ballname].EMs.length > newValue) {
                dispatch(deleteCollectionEms({idx, ball: ballname, listType: 'collection'}))
                usePutRequest('EMs', [], {pokename, ballname}, 'collection', collectionID, ownerID)
            }
        }
        usePutRequest(key, newValue, {pokename, ballname}, 'collection', collectionID, ownerID, defaultData)
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
                            onClickFunc={setSelected}
                        /> :
                    row[c.dataKey] !== undefined ? 
                        <DataCell 
                            key={`${row.imgLink}-${c.label}`}
                            label={c.dataKey === 'name' && row[c.dataKey]}
                            styles={styles}
                            alignment={c.label === 'img' && styles.alignment.imgAlignment}
                            imgParams={{isImg: isImg, imgLinkKey: row.imgLink}}
                            specialStyles={textSizeAdjustor}
                            isEditMode={isEditMode}
                            isSelected={isSelected}
                            onClickFunc={setSelected}
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
    if (!ownProps.isEditMode) {
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
    if (!ownProps.isEditMode) {
        return {}
    }
    return {
        setSelected: () => dispatch(setSelected(ownProps.id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TableRowGrouping);
