import * as React from 'react';
import {useRef, useEffect, useLayoutEffect} from 'react'
import store from '../../../app/store';
import {Paper, Table, TableHead, TableRow, TableBody, TableContainer, TableCell, Box, useTheme} from '@mui/material'
import {TableVirtuoso} from 'react-virtuoso'
import { useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { setScrollPosition } from '../../../app/slices/collectionstate';
import OnHandRowContent from './onhandrowcontent'
import './../../../routes/showCollection.css'
import { interchangeableAltFormMons } from '../../../../common/infoconstants/pokemonconstants.mjs';
import {connect} from 'react-redux'
import OnHandByPokemonDisplay from './onhandbypokemondisplay';
import displayOnHandByPokemon from '../../../../utils/functions/display/displayonhandbypokemon';
import { setHeaders as setByPokemonHeaders, setColumns } from './bypokemoncomponents';

export default function ShowOnHandList({onhandList, collectionID, styles, collectionListStyles, eggMoveInfo, isEditMode, demo, isHomeCollection, collectingBallsConst, localDisplayState=undefined, height=800, isTradePage, tradeSide, wantedByOtherListData=[], userData, localOnhandView}) {
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

    // useEffect(() => {
    //     const sameIDBetweenRefs = linkRef.current.includes(collectionID) && link.includes(collectionID)
    //     if (scrollPosition.current !== undefined && (sameIDBetweenRefs)) { 
    //         setTimeout(() => scrollRef.current.scrollTo({top: scrollPosition.current}), 1000)
    //     }
    //     linkRef.current = link
    // }, [link])

    const emColumns = isHomeCollection ? [] : [
        {label: 'EM Count', dataKey: 'emCount', width: '10%'},
        {label: 'Egg Moves', dataKey: 'EMs', width: '30%'},
    ]

    const columns = [
        {label: '#', dataKey: 'natDexNum', width: '5%'},
        {label: 'img', dataKey: 'natDexNum', width: '5%', isImg: true},
        {label: 'Name', dataKey: 'name', width: '17%'},
        {label: 'Ball', dataKey: 'ball', width: '5%', isImg: true, smallHeader: true},
        {label: 'Gender', dataKey: 'gender', width: '8%', isImg: true, smallHeader: true},
        {label: 'HA?', dataKey: 'isHA', width: '5%', smallHeader: true},
        ...emColumns,
        {label: 'Qty', dataKey: 'qty', width: '5%', smallHeader: true}
    ]

    function setHeaders() {
        return (
            <>
            <TableRow sx={{backgroundColor: '#283f57', zIndex: 10}}>
                {columns.map(c => (
                    <TableCell
                        key={`${c.label}-header`} 
                        sx={{...styles.tableCell, width: c.width}} 
                        variant='head'
                        >
                        <Box 
                            sx={
                                c.label === 'img' ? 
                                {...styles.textHeader, paddingTop: '28px', paddingBottom: '28px'} : 
                                c.label === '#' ?
                                {...styles.textHeader, ...styles.alignment.dexNumHeaderAlignment, px: 0} :
                                (c.smallHeader === true) ? 
                                {...styles.textHeader, ...styles.alignment.textAlignment, px: 0} :
                                styles.textHeader
                            }
                        >
                            {c.label !== 'img' && c.label}
                        </Box>
                    </TableCell>
                ))}
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
            <OnHandRowContent
                columns={columns}
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
        const byPokemonColumns = setColumns(userData, ballScopeDisplay)
        const availableGamesData = isHomeCollection ? {availableGames: availableGamesInfo[row.name]} : {}
        const dataProp = isEditMode ? {} : {row}
        return (
            <OnHandByPokemonDisplay 
                {...dataProp}
                pokemonId={row.imgLink}
                columns={byPokemonColumns}
                styles={collectionListStyles}
                isEditMode={isEditMode}
                demo={demo}
                userData={userData}
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
                fixedHeaderContent={trueOnhandView === 'byPokemon' ? () => setByPokemonHeaders(setColumns(userData, ballScopeDisplay), collectionListStyles) : setHeaders}
                itemContent={trueOnhandView === 'byPokemon' ? rowContentByPokemon : rowContent}
                sx={{backgroundColor: '#272625', zIndex: 100}}
            />
        </Paper>
    )
}