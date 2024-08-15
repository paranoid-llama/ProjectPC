import * as React from 'react';
import Box from '@mui/material/Box'
import {useState, useRef, useEffect} from 'react'
import {useLocation} from 'react-router'
import {useSelector} from 'react-redux'
import './../../../routes/showCollection.css'
import TableCell from '@mui/material/TableCell'
import DataCell from '../tabledata/datacell'
import {seeIfPokemonIsSelected, selectOnHandPokemon} from './../../../app/selectors/selectors'
import getNameDisplay from '../../../../utils/functions/display/getnamedisplay';
import {setSelected} from './../../../app/slices/editmode'
import {connect, useDispatch} from 'react-redux'

function OnHandRowContent({columns, row, pokemonId, collectionId, styles, isSelected, setSelected, allEggMoveInfo, isEditMode, isHomeCollection, isTradePage, tradeSide, wantedByOtherList, userData}) {
    const dispatch = useDispatch()

    const possibleEMs = !isHomeCollection && (allEggMoveInfo[row.name])
    const maxEMs = !isHomeCollection && (possibleEMs === undefined ? 0 : possibleEMs.length > 4 ? 4 : possibleEMs.length)

    // const reRenderCount = useRef(0)
    // useEffect(() => {
    //     reRenderCount.current += 1
    //     console.log(`RE-RENDER ${reRenderCount.current}`)
    // }) 
    // to check how often its re-rendering

    const pokeImgLink = `https://res.cloudinary.com/duaf1qylo/image/upload/sprites/${row.imgLink}.png`
    const imgLinkModifiers = {gender: 'icons', ball: 'balls'}

    return (
        <React.Fragment>
            {columns.map(c => {
                const genderlessLabel = (c.dataKey === 'gender' && row[c.dataKey] === 'none')
                const noInfoLabel = (c.dataKey === 'EMs' && row.emCount >= parseInt(c.label[3]) && row.EMs.length < parseInt(c.label[3]))
                const label = c.dataKey === 'isHA' ? 
                    (row[c.dataKey] === undefined ? 'N/A' : row[c.dataKey] === true ? 'Yes' : 'No') :
                    noInfoLabel ? '(No Info)' : 
                    (c.dataKey === 'EMs' && row[c.dataKey] !== undefined) ? row[c.dataKey][c.idx] :
                    genderlessLabel ? 'N/A' :
                    (c.dataKey === 'emCount' && row[c.dataKey] === undefined) ? 'N/A' :
                    row[c.dataKey] !== undefined ? (
                        c.dataKey === 'name' && userData.loggedIn ? getNameDisplay(userData.user.settings.display.pokemonNames, row[c.dataKey], row.natDexNum) : row[c.dataKey]
                    ) : undefined
                const textSizeAdjustor = label === ('Paldean Tauros (Aqua)' || 'Paldean Tauros (Blaze)') ? {fontSize: '11.96px'} : 
                    label === 'Basculin (White-Striped)' ? {fontSize: '11.19px'} : {}
                const imgKey = c.isImg === true ? 
                    c.label === 'img' ? row.imgLink : 
                    row[c.dataKey] :
                    undefined
                const imgType = (c.dataKey === 'ball' || c.dataKey === 'gender') ? c.dataKey : 'poke'
                const isBlackSquare = (c.dataKey === 'EMs' && row[c.dataKey] === undefined) || (c.dataKey === 'EMs' && parseInt(c.label[3]) > maxEMs)
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
                const reservedQty = c.dataKey === 'qty' && row.reserved !== undefined ? {reserved: row.reserved} : {}
                return (
                    <DataCell
                        key={`${row._id}-${c.label}`}
                        label={label}
                        styles={styles}
                        alignment={alignment}
                        imgParams={{isImg: genderlessLabel ? false : c.isImg, imgLinkKey: imgKey, imgType: imgType}}
                        isEditMode={isEditMode}
                        leftMostCell={c.label === '#' ? true : false}
                        isSelected={isSelected}
                        onClickFunc={setSelected}
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
                        {...reservedQty}
                    />
                )
            })}
        </React.Fragment>
    )
}

const mapStateToProps = (state, ownProps) => {
    if (!ownProps.isEditMode) {
        return {}
    }
    const pokemon = selectOnHandPokemon(state, ownProps.pokemonId)
    const isSelected = seeIfPokemonIsSelected(state, ownProps.pokemonId)
    return {
        row: pokemon,
        isSelected
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    if (!ownProps.isEditMode) {
        return {}
    }
    return {
        setSelected: () => dispatch(setSelected(ownProps.pokemonId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnHandRowContent)