import * as React from 'react';
import {Box, Typography, useTheme, Paper, Table, TableHead, TableContainer, TableRow, TableBody, TableCell} from '@mui/material'
import { apriballs } from '../../../../../common/infoconstants/miscconstants.mjs';
import { useRef, useLayoutEffect, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { setScrollPosition } from '../../../../app/slices/collectionstate'
import { interchangeableAltFormMons } from '../../../../../common/infoconstants/pokemonconstants.mjs'
import { TableVirtuoso } from 'react-virtuoso';
import SmallWidthOnHandRowContent from './smallwidthonhandrow'
import SmallWidthByPokemonDisplay from './smallwidthbypokemondisplay';
import { setColumns } from '../bypokemoncomponents';
import { capitalizeFirstLetter } from '../../../../../utils/functions/misc';
import getNameDisplay from '../../../../../utils/functions/display/getnamedisplay';
import listStyles from '../../../../../utils/styles/componentstyles/liststyles';

export default function SmallWidthOnHand({collectionID, styles, collectionListStyles, eggMoveInfo, isEditMode, demo, isHomeCollection, collectingBallsConst, localDisplayState=undefined, height=800, isTradePage, tradeSide, wantedByOtherListData=[], userData, localOnhandView}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const listState = useSelector(state => state.collectionState.listDisplay.onhand)
    const viewType = useSelector((state) => state.collectionState.listDisplay.onhandView)
    const listDisplay = localDisplayState === undefined ? listState : localDisplayState
    const link = useLocation().pathname
    const previousScrollPosition = useSelector((state) => state.collectionState.previousOnhandScrollPosition)
    const previousColId = useSelector((state) => state.collectionState.prevColId)
    const availableGamesInfo = useSelector((state) => state.collectionState.availableGamesInfo)

    const trueOnhandView = localOnhandView ? localOnhandView : viewType

    const ballScopeState = useSelector((state) => state.collectionState.options.collectingBalls)
    const ballScopeDisplay = (ballScopeState === undefined || (!isEditMode && !demo)) ? collectingBallsConst : ballScopeState

    const scrollRef = useRef(null)
    const scrollPosition = useRef()

    const trProps = isTradePage ? {
        sx: {':hover': {cursor: 'pointer', opacity: 0.5}},
    } : {}

    useLayoutEffect(() => {
        const sameIDBetweenRefs = collectionID === previousColId
        if (previousScrollPosition && sameIDBetweenRefs) {
            setTimeout(() => {
              scrollRef.current.scrollTo({top: previousScrollPosition})  
            }, 1000)  
        }
    }, [link])

    useEffect(() => {
        return () => {
            dispatch(setScrollPosition({scrollPos: scrollPosition.current, latestColId: collectionID, onhandScrollRef: true}))
        }
    })

    const setBallCols = (colnum) => {
        const cols = []
        const ballOrder = userData.loggedIn ? userData.user.settings.display.ballOrder.filter(b => ballScopeDisplay.includes(b)).slice(colnum === 1 ? 0 : 7, colnum === 1 ? 7 : 11) : apriballs.filter(b => ballScopeDisplay.includes(b)).slice(colnum === 1 ? 0 : 7, colnum === 1 ? 7 : 11)
        ballOrder.forEach(ball => {
            cols.push({
                label: capitalizeFirstLetter(ball),
                dataKey: ball,
                width: colnum === 2 ? `${100/7}%` : `${100/ballOrder.length}%`,
                ball: true
            })
        })
        return cols
    }

    const emColumns = isHomeCollection ? [] : [
        {label: 'EM #', dataKey: 'emCount', width: '15%', smallHeader: true},
        {label: 'Egg Moves', dataKey: 'EMs', width: '50%', maxWidth: '400px'},
    ]

    const tableColumns1 = trueOnhandView === 'byPokemon' ? [...setBallCols(1)] : [
        {label: '#', dataKey: 'natDexNum', width: '10%'},
        {label: 'img', dataKey: 'natDexNum', width: '20%', isImg: true},
        {label: 'Ball', dataKey: 'ball', width: '20%', isImg: true, smallHeader: true},
        {label: 'Name', dataKey: 'name', width: '40%'},
        {label: 'Qty', dataKey: 'qty', width: '10%', smallHeader: true}
        
    ]
    const tableColumns2 = trueOnhandView === 'byPokemon' ? [...setBallCols(2)] : [
        {label: 'Gender', dataKey: 'gender', width: isHomeCollection ? '30%' : '17.5%', isImg: true, smallHeader: true},
        {label: 'HA', dataKey: 'isHA', width: isHomeCollection ? '30%' : '17.5%', smallHeader: true},
        ...emColumns,
    ]
    const noRow2 = tableColumns2.length === 0

    function tableHeader() {
        return (
            <>
            <TableRow sx={{backgroundColor: '#283f57', zIndex: 20, width: '100%', height: '120px'}}>
                <TableCell sx={{...theme.components.box.fullCenterCol, width: '100%', padding: 0}} variant='head'>
                    <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: '50%', padding: 0, borderBottom: '1px solid white'}}>
                        {tableColumns1.map(c => (
                            <Box 
                                key={`${c.label}-header`} 
                                sx={{...styles.tableCell, width: c.width, zIndex: 15, border: '1px solid black', minWidth: '0px', height: '56px'}} 
                            >
                                <Box 
                                    sx={
                                        c.label === 'img' ? 
                                        {...styles.textHeader, paddingTop: '28px', paddingBottom: '28px', position: 'relative', width: 'calc(100%-1px)', height: 'calc(100%-1px)'} : 
                                        c.label === '#' ?
                                        {...styles.textHeader, ...styles.alignment.dexNumHeaderAlignment, px: 0, position: 'relative', width: 'calc(100%-1px)', height: 'calc(100%-1px)'} :
                                        (c.smallHeader === true) ? 
                                        {...styles.textHeader, ...styles.alignment.textAlignment, px: 0, position: 'relative', width: 'calc(100%-1px)', height: 'calc(100%-1px)'} :
                                        {...styles.textHeader, position: 'relative', width: 'calc(100%-1px)', height: 'calc(100%-1px)'}
                                    }
                                >
                                <Typography sx={{color: 'white'}}>{c.label !== 'img' && c.label}</Typography>
                                </Box>
                            </Box>
                        ))} 
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: '50%', padding: 0}}>
                        {tableColumns2.map(c => (
                            <Box 
                                key={`${c.label}-header`} 
                                sx={{...styles.tableCell, width: c.width, zIndex: 15, border: '1px solid black', minWidth: '0px', height: '56px'}} 
                            >
                            <Box 
                                sx={(c.smallHeader === true) ? 
                                    {...styles.textHeader, ...styles.alignment.textAlignment, px: 0, pb: c.dataKey === 'emCount' ? '20px' : '', position: 'relative', width: 'calc(100%-1px)', height: 'calc(100%-1px)'} :
                                    {...styles.textHeader, position: 'relative', width: 'calc(100%-2px)', height: 'calc(100%-2px)'}
                                }
                            >
                                <Typography 
                                    sx={{
                                        color: 'white', 
                                        fontSize: c.dataKey === 'emCount' ? '13px' : '16px', 
                                        width: '100%',
                                        '@media only screen and (max-width: 425px)': {
                                            fontSize: c.dataKey === 'emCount' || c.dataKey === 'gender' ? '11px' : '16px'
                                        }
                                    }}
                                >
                                    {c.label}
                                </Typography>
                            </Box>
                            </Box>
                        ))}
                    </Box>
                </TableCell>
            </TableRow>
            </>
        )
    }
    function tableHeaderByPokemon() {
        return (
            <>
            <TableRow sx={{backgroundColor: '#283f57', zIndex: 20, width: '100%', height: noRow2 ? '40px' : '80px'}}>
                <TableCell sx={{...theme.components.box.fullCenterCol, width: '100%', height: '100%', padding: 0}} variant='head'>
                    <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: noRow2 ? '100%' : '50%', padding: 0, borderBottom: noRow2 ? 'none' : '1px solid white'}}>
                        {tableColumns1.map(c => (
                            <Box 
                                key={`${c.label}-header`}
                                sx={{...listStyles.collection.tableCell, width: c.width, zIndex: 15, border: '1px solid black', minWidth: '0px'}} 
                                variant='head'
                            >
                                <Box
                                    sx={{...listStyles.collection.ballHeaderDiv.divStyles, zIndex: 15}}
                                >
                                    <Box sx={{zIndex: 15, padding: 0, margin: 0}}>{c.label}</Box>
                                    <div>
                                        <img height='25px' width='25px' src={`https://res.cloudinary.com/duaf1qylo/image/upload/balls/${c.dataKey}.png`}/>
                                    </div>
                                </Box>
                            </Box> 
                        ))} 
                    </Box>
                    {!noRow2 && 
                    <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: '50%', padding: 0}}>
                        {tableColumns2.map(c => (
                            <Box
                                key={`${c.label}-header`}
                                sx={{...listStyles.collection.tableCell, width: `${100/7}%`, zIndex: 15, border: '1px solid black'}} 
                            >
                                <Box
                                    sx={{...listStyles.collection.ballHeaderDiv.divStyles, zIndex: 15}}
                                >
                                    <Box sx={{zIndex: 15, padding: 0, margin: 0}}>{c.label}</Box>
                                    <div>
                                        <img height='25px' width='25px' src={`https://res.cloudinary.com/duaf1qylo/image/upload/balls/${c.dataKey}.png`}/>
                                    </div>
                                </Box>
                            </Box> 
                        ))}
                    </Box>
                    }
                </TableCell>
            </TableRow>
            </>
        )
    }

    function rowContent(_index, row) {
        const includePokemonProp = (isEditMode || demo) ? {} : {row}
        const pokeWantedData = isTradePage ? wantedByOtherListData.filter(p => {
            const interchangeableMon = interchangeableAltFormMons.map(iName => p.name.includes(iName)).includes(true)
            const nameComparator = interchangeableMon ? p.name.slice(0, p.name.indexOf('(')-1) : p.name
            const isExactName = p.name === row.name
            return (!isExactName && interchangeableMon) ? row.name.includes(nameComparator) : isExactName
        }) : []
        const finalPokeWantedData = pokeWantedData.length > 1 ? [{name: row.name, balls: pokeWantedData.map(p => p.balls).flat()}] : pokeWantedData
        return (
            <SmallWidthOnHandRowContent
                // row={row}
                pokemonId={row._id}
                collectionId={collectionID}
                styles={styles}
                allEggMoveInfo={eggMoveInfo}
                availableGamesInfo={availableGamesInfo}
                isEditMode={isEditMode}
                demo={demo}
                isHomeCollection={isHomeCollection}
                isTradePage={isTradePage}
                tradeSide={tradeSide}
                wantedByOtherList={finalPokeWantedData}
                userData={userData}
                {...includePokemonProp}
            />
        )
    }
    

    function rowContentByPokemon(_index, row) {
        const availableGamesData = isHomeCollection ? {availableGames: availableGamesInfo[row.name]} : {}
        const nameLabel = userData.loggedIn ? getNameDisplay(userData.user.settings.display.pokemonNames, row.name, row.natDexNum) : row.name
        const rowProp = (isEditMode || demo) ? {row: {}} : {row}
        return (
            <SmallWidthByPokemonDisplay
                {...rowProp}
                pokemonId={row.imgLink}
                cols1={tableColumns1}
                cols2={tableColumns2}
                noRow2={noRow2}
                styles={collectionListStyles}
                nameLabel={nameLabel}
                row1Balls={tableColumns1.map(tC => tC.dataKey)}
                row2Balls={tableColumns2.map(tC => tC.dataKey)}
                isEditMode={isEditMode}
                demo={demo}
                {...availableGamesData}
            />
        )
    }

    const VirtuosoTableComponents = {
        Scroller: React.forwardRef((props, ref) => (
          <TableContainer 
            component={Paper} 
            {...props} 
            ref={ref} 
            sx={{
                ...props.sx,
                '&::-webkit-scrollbar': {
                    width: '0.3rem'
                },
                '&::-webkit-scrollbar-track': {
                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.color3.main,
                    borderRadius: '5px'
                },
                overflowX: 'hidden'
            }}
        />
        )),
        Table: (props) => (
          <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed'}} />
        ),
        TableHead,
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} {...trProps} />,
        TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
      };
    return (
        <Paper style={{height, margin: 0}}>
            <TableVirtuoso
                data={listDisplay}
                components={VirtuosoTableComponents}
                fixedHeaderContent={trueOnhandView === 'byPokemon' ? tableHeaderByPokemon : tableHeader}
                itemContent={trueOnhandView === 'byPokemon' ? rowContentByPokemon : rowContent}
                // fixedHeaderContent={tableHeader}
                // itemContent={rowContent}
                sx={{backgroundColor: '#272625', zIndex: 100}}
            />
        </Paper>
    )

}