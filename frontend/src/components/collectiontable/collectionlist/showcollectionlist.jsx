import * as React from 'react';
import {useRef, useEffect, useLayoutEffect, useState, memo} from 'react'
import {Fragment} from 'react'
import { apriballs } from '../../../../common/infoconstants/miscconstants.mjs';
import {Paper, Table, TableHead, TableRow, TableBody, TableContainer, TableCell, Box, Button, useTheme} from '@mui/material'
import {TableVirtuoso} from 'react-virtuoso'
import { TableRowGroupingNoRedux as ConnectlessTableRow } from './tablerowgrouping';
import TableRowGrouping from './tablerowgrouping'
import './../../../routes/showCollection.css'
import { capitalizeFirstLetter } from '../../../../utils/functions/misc';
import {useSelector, useDispatch, connect} from 'react-redux'
import { useLocation } from 'react-router';
import { interchangeableAltFormMons } from '../../../../common/infoconstants/pokemonconstants.mjs';
import { setScrollPosition } from '../../../app/slices/collectionstate';
import {setCollectionInitialState} from '../../../app/slices/collection'
import {setSelected} from '../../../app/slices/editmode'

export default function ShowCollectionList({collection, isCollectionOwner, styles, isEditMode, demo, localDisplayState=undefined, height=800, noStates=false, isTradePage=false, tradeSide=null, wantedByOtherListData=[], userData}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const ballScopeState = !noStates && useSelector((state) => state.collectionState.options.collectingBalls)
    const listState = useSelector((state) => state.collectionState.listDisplay.collection)
    const previousScrollPosition = useSelector((state) => state.collectionState.lastScrollPosition)
    const previousColId = useSelector((state) => state.collectionState.prevColId)
    // const showFullSets = useSelector((state) => state.collectionState.listDisplay.showFullSets)
    const link = useLocation().pathname
    // const linkRef = useRef(link)

    // console.log(collection)
    // console.log(listState)
    // ^^ listdisplay always uses state to cover for filtering/sorting functions (which anyone should be able to do)

    //apparently, on first render, this component loads faster than the initial state can initialize, meaning we have the one line below.
    const ballScopeDisplay = (ballScopeState === undefined || (!isEditMode && !demo)) ? collection.options.collectingBalls : ballScopeState
    const listDisplay = (localDisplayState !== undefined) ? localDisplayState : listState


    // console.log(listDisplay)

    const scrollRef = useRef(null)
    const scrollPosition = useRef()
    // console.log('rendered')

    // useEffect(() => {
        
    // })

    // useEffect(() => {
        
    // }, [])

    useLayoutEffect(() => {
        const sameIDBetweenRefs = collection._id === previousColId
        if (previousScrollPosition && sameIDBetweenRefs) {
            setTimeout(() => {
              scrollRef.current.scrollTo({top: previousScrollPosition})  
            }, 1000)  
        }
    }, [link])

    useEffect(() => {
        return () => {
            dispatch(setScrollPosition({scrollPos: scrollPosition.current, latestColId: collection._id}))
        }
    })

    // useEffect(() => {
    //     const id = collection._id
    //     const sameIDBetweenRefs = linkRef.current.includes(id) && link.includes(id)
    //     console.log(scrollPosition)
    //     if (scrollPosition.current !== undefined && (sameIDBetweenRefs)) { 
    //         console.log('FIRED!')
    //         setTimeout(() => {
    //             scrollRef.current.scrollTo({top: scrollPosition.current})
                
    //         }, 1000)
    //     }
    //     linkRef.current = link
    // }, [link])

    const setBallCols = () => {
        const cols = []
        const ballOrder = userData.loggedIn ? userData.user.settings.display.ballOrder.filter(b => ballScopeDisplay.includes(b)) : apriballs.filter(b => ballScopeDisplay.includes(b))
        ballOrder.forEach(ball => {
            cols.push({
                label: capitalizeFirstLetter(ball),
                dataKey: ball,
                width: `${70/ballScopeDisplay.length}%`,
                ball: true
            })
        })
        return cols
    }

    const columns = [
        {label: '#', dataKey: 'natDexNum', width: '5%'},
        {label: 'img', dataKey: 'natDexNum', width: '5%'},
        {label: 'Name', dataKey: 'name', width: '20%'},
        ...setBallCols()
    ]

    function setHeaders() {
        return (
            <>
            <TableRow sx={{backgroundColor: '#283f57', zIndex: 20}}>
                {columns.map(c => (
                    c.ball ? 
                    <TableCell 
                        key={`${c.label}-header`}
                        sx={{...styles.tableCell, width: c.width, zIndex: 15}} 
                        variant='head'>
                        <Box
                            sx={{...styles.ballHeaderDiv.divStyles, zIndex: 15}}
                        >
                            <Box sx={{...styles.ballHeaderDiv.label, zIndex: 15}}>{c.label}</Box>
                            <div>
                                <img height='25px' width='25px' src={`https://res.cloudinary.com/duaf1qylo/image/upload/balls/${c.dataKey}.png`}/>
                            </div>
                        </Box>
                    </TableCell> :
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
        const TrueTableRow = isTradePage ? ConnectlessTableRow : TableRowGrouping
        const pokeWantedData = isTradePage ? wantedByOtherListData.filter(p => {
            const interchangeableMon = interchangeableAltFormMons.map(iName => p.name.includes(iName)).includes(true)
            const nameComparator = interchangeableMon ? p.name.slice(0, p.name.indexOf('(')-1) : p.name
            const isExactName = p.name === row.name
            return (!isExactName && interchangeableMon) ? row.name.includes(nameComparator) : isExactName
        }) : []
        const finalPokeWantedData = pokeWantedData.length > 1 ? [{name: row.name, balls: pokeWantedData.map(p => p.balls).flat()}] : pokeWantedData
        return (
            // <Fragment key={row.imgLink}>
                <TrueTableRow
                    columns={columns}
                    // row={row}
                    // idx={_index}
                    id={row.imgLink}
                    isCollectionOwner={isCollectionOwner}
                    collectionId={demo ? '' : collection._id}
                    ownerId={demo ? '' : collection.owner._id}
                    styles={styles}
                    isEditMode={isEditMode}
                    demo={demo}
                    isHomeCollection={collection.gen === 'home'}
                    availableGames={collection.availableGamesInfo !== undefined && collection.availableGamesInfo}
                    noStates={noStates}
                    isTradePage={isTradePage}
                    tradeSide={tradeSide}
                    wantedByOtherList={finalPokeWantedData}
                    userData={userData}
                    {...includePokemonProp}
                />
            // </Fragment>
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
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
        TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
      };

    const onScroll = (e) => {
        scrollPosition.current = e.target.scrollTop
    }

    return (
        <>
        <Paper style={{height, margin: 0}}>
            <TableVirtuoso
                data={listDisplay}
                components={VirtuosoTableComponents}
                fixedHeaderContent={setHeaders}
                itemContent={rowContent}
                sx={{backgroundColor: '#272625', zIndex: 100}}
                ref={scrollRef}
                onScroll={(e) => onScroll(e)}
            >
            </TableVirtuoso>
        </Paper>
        </>
    )
}