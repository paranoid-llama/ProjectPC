import {Box, Typography, useTheme, Paper, TableContainer, TableCell, TableRow, TableHead} from '@mui/material'
import { interchangeableAltFormMons } from '../../../../../common/infoconstants/pokemonconstants.mjs'
import { apriballLiterals, apriballs, specialBalls } from '../../../../../common/infoconstants/miscconstants.mjs'
import {TableVirtuoso} from 'react-virtuoso'
import SmallWidthColRow from './smallwidthrow'
import { ConnectlessSmallWidthColRow } from './smallwidthrow'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { useEffect, useLayoutEffect, useRef, forwardRef } from 'react'
import { setScrollPosition } from '../../../../app/slices/collectionstate'
import { Virtuoso } from 'react-virtuoso'
import getTableVirtuosoComponents from '../virtuosotablecomponents/getvirtuosotablecomponents'
import { capitalizeFirstLetter } from '../../../../../utils/functions/misc'

export default function SmallWidthColList({collection, isCollectionOwner, demo, styles, isEditMode, localDisplayState=undefined, height=800, noStates=false, isTradePage=false, tradeSide=null, wantedByOtherListData=[], userData}) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const ballScopeState = !noStates && useSelector((state) => state.collectionState.options.collectingBalls)
    const listState = useSelector((state) => state.collectionState.listDisplay.collection)
    const previousScrollPosition = useSelector((state) => state.collectionState.lastScrollPosition)
    const previousColId = useSelector((state) => state.collectionState.prevColId)
    const link = useLocation().pathname

    //apparently, on first render, this component loads faster than the initial state can initialize, meaning we have the one line below.
    const ballScopeDisplay = (ballScopeState === undefined || (!isEditMode)) ? collection.options.collectingBalls : ballScopeState
    const listDisplay = (localDisplayState !== undefined) ? localDisplayState : listState

    // console.log(listDisplay)

    const scrollRef = useRef(null)
    const scrollPosition = useRef()

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

    const setBallCols = (colnum) => {
        const cols = []
        const ballOrder = userData.loggedIn ? userData.user.settings.display.ballOrder.filter(b => ballScopeDisplay.includes(b)).slice(colnum === 1 ? 0 : 7, colnum === 1 ? 7 : 11) : apriballs.filter(b => ballScopeDisplay.includes(b)).slice(colnum === 1 ? 0 : 7, colnum === 1 ? 7 : 11)
        ballOrder.forEach(ball => {
            cols.push({
                label: capitalizeFirstLetter(ball),
                dataKey: ball,
                width: `${100/ballOrder.length}%`,
                ball: true
            })
        })
        return cols
    }
    
    const tableColumns1 = [
        ...setBallCols(1)
    ]

    const tableColumns2 = [
        ...setBallCols(2)
    ]

    const noRow2 = tableColumns2.length === 0 //if their ball scope has 7 or less balls.

    // const leftRightMargin = ballScopeDisplay.length > 7 && ()

    function tableHeader() {
        return (
            <>
            <TableRow sx={{backgroundColor: '#283f57', zIndex: 20, width: '100%', height: noRow2 ? '40px' : '80px'}}>
                <TableCell sx={{...theme.components.box.fullCenterCol, width: '100%', height: '100%', padding: 0}} variant='head'>
                    <Box sx={{...theme.components.box.fullCenterRow, width: '100%', height: noRow2 ? '100%' : '50%', padding: 0, borderBottom: noRow2 ? 'none' : '1px solid white'}}>
                        {tableColumns1.map(c => (
                            <Box 
                                key={`${c.label}-header`}
                                sx={{...styles.tableCell, width: c.width, zIndex: 15, border: '1px solid black', minWidth: '0px'}} 
                                variant='head'
                            >
                                <Box
                                    sx={{...styles.ballHeaderDiv.divStyles, zIndex: 15}}
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
                                sx={{...styles.tableCell, width: `${100/7}%`, zIndex: 15, border: '1px solid black'}} 
                            >
                                <Box
                                    sx={{...styles.ballHeaderDiv.divStyles, zIndex: 15}}
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

    function rowContent(_idx, row) {
        const includePokemonProp = (isEditMode || demo) ? {} : {row}
        const RowDisplay = isTradePage ? ConnectlessSmallWidthColRow : SmallWidthColRow
        const pokeWantedData = isTradePage ? wantedByOtherListData.filter(p => {
            const interchangeableMon = interchangeableAltFormMons.map(iName => p.name.includes(iName)).includes(true)
            const nameComparator = interchangeableMon ? p.name.slice(0, p.name.indexOf('(')-1) : p.name
            const isExactName = p.name === row.name
            return (!isExactName && interchangeableMon) ? row.name.includes(nameComparator) : isExactName
        }) : []
        const finalPokeWantedData = pokeWantedData.length > 1 ? [{name: row.name, balls: pokeWantedData.map(p => p.balls).flat()}] : pokeWantedData
        return (
            <RowDisplay
                {...includePokemonProp}
                id={row.imgLink}
                demo={demo}
                isCollectionOwner={isCollectionOwner}
                ballScopeDisplay={ballScopeDisplay}
                collectionId={collection._id}
                ownerId={demo ? '000000' : collection.owner._id}
                isEditMode={isEditMode}
                isHomeCollection={collection.gen === 'home'}
                availableGames={collection.availableGamesInfo !== undefined && collection.availableGamesInfo}
                noStates={noStates}
                isTradePage={isTradePage}
                tradeSide={tradeSide}
                wantedByOtherList={finalPokeWantedData}
                userData={userData}
                row1Balls={tableColumns1.map(tC => tC.dataKey)}
                row2Balls={tableColumns2.map(tC => tC.dataKey)}
            />
        )
    }

    
    const onScroll = (e) => {
        scrollPosition.current = e.target.scrollTop
    }
    
    return (
        <Paper sx={{height, margin: 0}}>
            {/* <Virtuoso 
                style={{height: '100%', width: '100%'}}
                totalCount={listDisplay.length}
                itemContent={idx => rowContent(idx, listDisplay[idx])}
                components={{
                    Scroller: forwardRef((props, ref) => (
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
                        ))
                }}
                ref={scrollRef}
                onScroll={(e) => onScroll(e)}
            /> */}
            <TableVirtuoso 
                data={listDisplay}
                components={getTableVirtuosoComponents(theme)}
                fixedHeaderContent={tableHeader}
                itemContent={rowContent}
                sx={{backgroundColor: '#272625', zIndex: 100}}
                ref={scrollRef}
                onScroll={(e) => onScroll(e)}

            />
        </Paper>
    )
}