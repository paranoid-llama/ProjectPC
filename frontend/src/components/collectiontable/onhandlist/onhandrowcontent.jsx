import * as React from 'react';
import Box from '@mui/material/Box'
import {useState, useRef, useEffect} from 'react'
import {useLocation} from 'react-router'
import {useSelector} from 'react-redux'
import { toggleOnHandIdToDelete } from './../../../app/slices/editmode';
import './../../../routes/showCollection.css'
import TableCell from '@mui/material/TableCell'
import DataCell from '../tabledata/datacell'
import {seeIfPokemonIsSelected, selectIdxOfMon, selectOnHandPokemon, selectOnHandPokemonIdx} from './../../../app/selectors/selectors'
import getNameDisplay from '../../../../utils/functions/display/getnamedisplay';
import {setSelected} from './../../../app/slices/editmode'
import {connect, useDispatch} from 'react-redux'
import EggMoveColumnDisplay from './eggmovecolumndisplay';
import newObjectId from '../../../../utils/functions/newobjectid';
import { setIsHA } from '../../../app/slices/collectionstate';

function OnHandRowContent({columns, row, pokemonId, collectionId, styles, isSelected, setSelected, allEggMoveInfo, availableGamesInfo, isEditMode, demo, isHomeCollection, isTradePage, tradeSide, wantedByOtherList, userData, idxOfPokemon}) {
    const dispatch = useDispatch()

    const skeletonRow = row === undefined
    if (skeletonRow) { 
        //skeletonRow happens when adding multiple on-hands and leaving edit mode. they come out undefined at first. I gave up trying to debug it, this is a work-around
        return <>
            {columns.map(c => {

                return (
                    c.dataKey === 'EMs' ? 
                    <EggMoveColumnDisplay key={`error-onhand-em-display-${newObjectId()}`} baseStyles={styles} skeleton={true} /> : 
                    <TableCell  key={`error-onhand-${c.dataKey}-display-${newObjectId()}`} padding='none' sx={{...styles.tableCell}}>
                        <Box sx={{...styles.bodyColor, backgroundColor: 'rgb(100, 100, 100)'}}>

                        </Box>
                    </TableCell>
                )
            })}
        </>
    }

    const deleteOnHandMode = isEditMode ? useSelector((state) => state.editmode.deleteOnHandMode) : null
    const ohIdsFlagged = isEditMode ? useSelector((state) => state.editmode.deletedOnHandIds) : null
    const possibleEMs = !isHomeCollection && (allEggMoveInfo[row.name])
    const maxEMs = !isHomeCollection && (possibleEMs === undefined ? 0 : possibleEMs.length > 4 ? 4 : possibleEMs.length)
    // const reRenderCount = useRef(0)
    // useEffect(() => {
    //     reRenderCount.current += 1
    //     console.log(`RE-RENDER ${reRenderCount.current}`)
    // }) 
    // to check how often its re-rendering

    return (
        <React.Fragment>
            {columns.map(c => {
                const genderlessLabel = (c.dataKey === 'gender' && row[c.dataKey] === 'none')
                const label = c.dataKey === 'isHA' ? 
                    (row[c.dataKey] === undefined ? 'N/A' : row[c.dataKey] === true ? 'Yes' : 'No') : 
                    genderlessLabel ? 'N/A' :
                    (c.dataKey === 'emCount' && row[c.dataKey] === undefined) ? 'N/A' :
                    row[c.dataKey] !== undefined ? (
                        c.dataKey === 'name' && userData.loggedIn ? getNameDisplay(userData.user.settings.display.pokemonNames, row[c.dataKey], row.natDexNum) : 
                        row[c.dataKey] === 'unknown' ? 'Unknown' : row[c.dataKey]
                    ) : undefined
                const textSizeAdjustor = label === ('Paldean Tauros (Aqua)' || 'Paldean Tauros (Blaze)') ? {fontSize: '11.96px'} : 
                    label === 'Basculin (White-Striped)' ? {fontSize: '11.19px'} : {}
                const imgKey = c.isImg === true ? 
                    c.label === 'img' ? row.imgLink : 
                    row[c.dataKey] :
                    undefined
                const imgType = (c.dataKey === 'ball' || c.dataKey === 'gender') ? c.dataKey : 'poke'
                const isBlackSquare = (c.dataKey === 'EMs' && row[c.dataKey] === undefined)
                const alignment = c.label === '#' ? styles.alignment.dexNumAlignment :
                    (c.dataKey === 'ball' || c.label === 'img') ? styles.alignment.imgNumAlignment : 
                    (c.dataKey === 'gender' && genderlessLabel) ? styles.alignment.genderlessAlignment :
                    (c.dataKey === 'gender') ? styles.alignment.genderImgAlignment :
                    (c.dataKey === 'EMs' && label === 'Last Respects') ? styles.alignment.textAlignment2ndWordLonger :
                    (c.dataKey === 'EMs' && label !== undefined && label.includes(" ")) ? styles.alignment.textAlignmentSpaces :
                    (c.dataKey === 'EMs' || c.dataKey === 'isHA') ? styles.alignment.textAlignment :
                    (c.dataKey === 'qty') && styles.alignment.qtyValueAlignment
                const isBallColumn = c.dataKey === 'ball'
                const wantedData = isBallColumn && (wantedByOtherList[0] === undefined ? {} : wantedByOtherList[0].balls.includes(row[c.dataKey]) ? {wanted: true} : {})
                const reservedQty = (c.dataKey === 'qty' && row.reserved !== undefined) ? {reserved: row.reserved} : {}
                const nameProps = (isHomeCollection && c.dataKey === 'name') ? {
                    availableGames: availableGamesInfo[row.name]
                } : {}
                return (
                    c.dataKey === 'EMs' ?
                    <EggMoveColumnDisplay
                        key={`${row._id}-${c.label}`}
                        EMs={row.EMs}
                        emCount={row.emCount}
                        emKeyLiteral={(emNum) => `${row._id}-${row.ball}-egg-move-${emNum}`}
                        baseStyles={styles}
                        isEditMode={isEditMode}
                        flaggedForDeletion={deleteOnHandMode && ohIdsFlagged.includes(row._id)}
                        onClickFunc={deleteOnHandMode ? () => dispatch(toggleOnHandIdToDelete(row._id)) : isSelected ? null : setSelected}
                        blackSquare={isBlackSquare}
                        isTradePage={isTradePage}
                        tradeSide={tradeSide}
                        tradeDispData={isTradePage ? 
                            {
                                pData: {name: row.name, id: row.imgLink, natDexNum: row.natDexNum},
                                ballData: {ball: row.ball, onhandId: row._id, ...wantedData},
                                fullData: row
                            } : {}
                        }
                        customPadding={0}
                        customInnerWrapperSx={{height: '98%'}}
                        centeredGridItems
                    /> : 
                    <DataCell
                        key={`${row._id}-${c.label}`}
                        label={label}
                        styles={styles}
                        alignment={c.dataKey === 'name' || c.dataKey === 'emCount' || (row[c.dataKey] === 'unknown') ? {position: 'relative'} : alignment}
                        imgParams={{isImg: (row[c.dataKey] === 'unknown' || genderlessLabel) ? false : c.isImg, imgLinkKey: imgKey, imgType: imgType}}
                        isEditMode={isEditMode}
                        leftMostCell={c.label === '#' ? true : false}
                        isSelected={isSelected}
                        flaggedForDeletion={deleteOnHandMode && ohIdsFlagged.includes(row._id)}
                        ohDeleteMode={deleteOnHandMode}
                        onClickFunc={deleteOnHandMode ? () => dispatch(toggleOnHandIdToDelete(row._id)) : isSelected ? null : setSelected}
                        onhandCells={true}
                        specialStyles={textSizeAdjustor}
                        blackSquare={isBlackSquare}
                        isTradePage={isTradePage}
                        tradeSide={tradeSide}
                        tradeDispData={isTradePage ? 
                            {
                                pData: {name: row.name, id: row.imgLink, natDexNum: row.natDexNum},
                                ballData: {ball: row.ball, onhandId: row._id, ...wantedData},
                                fullData: row
                            } : {}
                        }
                        isEmDisplay={c.dataKey === 'EMs'}
                        {...reservedQty}
                        {...nameProps}
                        checkboxCell={c.dataKey === 'isHA' && row[c.dataKey] !== undefined}
                        checkboxData={{
                            active: row[c.dataKey],
                            onChange: () => dispatch(setIsHA({listType: 'onhand', idx: idxOfPokemon, ball: row.ball})),
                            sx: {position: 'absolute', right: 'calc(50% - 21px)', top: 'calc(50% - 21px)', zIndex: 1}
                        }}
                    />
                )
            })}
        </React.Fragment>
    )
}

const mapStateToProps = (state, ownProps) => {
    if (!ownProps.isEditMode && !ownProps.demo) {
        return {}
    }
    const pokemon = selectOnHandPokemon(state, ownProps.pokemonId)
    const idxOfPokemon = selectOnHandPokemonIdx(state, ownProps.pokemonId)
    const isSelected = seeIfPokemonIsSelected(state, ownProps.pokemonId)
    return {
        row: pokemon,
        isSelected,
        idxOfPokemon
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    if (!ownProps.isEditMode && !ownProps.demo) {
        return {}
    }
    return {
        setSelected: () => dispatch(setSelected(ownProps.pokemonId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnHandRowContent)