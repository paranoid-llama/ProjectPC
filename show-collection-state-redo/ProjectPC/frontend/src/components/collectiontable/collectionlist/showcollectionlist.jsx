import * as React from 'react';
import {useRef, useEffect, useState} from 'react'
import {Fragment} from 'react'
import {Paper, Table, TableHead, TableRow, TableBody, TableContainer, TableCell, Box, Button} from '@mui/material'
import {TableVirtuoso} from 'react-virtuoso'
import TableRowGrouping from './tablerowgrouping'
import './../../../routes/showCollection.css'
import { capitalizeFirstLetter } from '../../../../utils/functions/misc';
import {useSelector, useDispatch, connect} from 'react-redux'
import { useLocation } from 'react-router';
import {setCollectionInitialState} from '../../../app/slices/collection'
import {setSelected} from '../../../app/slices/editmode'

export default function ShowCollectionList({collection, styles, isEditMode}) {

    const ballScopeState = useSelector((state) => state.options.collectingBalls)
    const listDisplay = useSelector((state) => state.listDisplay.collection)
    const link = useLocation().pathname
    const linkRef = useRef(link)
    // ^^ listdisplay always uses state to cover for filtering/sorting functions (which anyone should be able to do)

    //apparently, on first render, this component loads faster than the initial state can initialize, meaning we have the one line below.
    const ballScopeDisplay = (ballScopeState === undefined || !isEditMode) ? collection.options.collectingBalls : ballScopeState

    // console.log(listDisplay)

    const scrollRef = useRef(null)
    const scrollPosition = useRef()

    // useEffect(() => {
        
    // })

    useEffect(() => {
        const id = collection._id
        const sameIDBetweenRefs = linkRef.current.includes(id) && link.includes(id)
        if (scrollPosition.current !== undefined && (sameIDBetweenRefs)) { 
            setTimeout(() => scrollRef.current.scrollTo({top: scrollPosition.current}), 1000)
        }
        linkRef.current = link
    }, [link])

    const setBallCols = () => {
        const cols = []
        ballScopeDisplay.forEach(ball => {
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
        // {label: 'Fast', dataKey: 'fast', width: `${70/11}%`, ball: true},
        // {label: 'Friend', dataKey: 'friend', width: `${70/11}%`, ball: true},
        // {label: 'Heavy', dataKey: 'heavy', width: `${70/11}%`, ball: true},
        // {label: 'Level', dataKey: 'level', width: `${70/11}%`, ball: true},
        // {label: 'Love', dataKey: 'love', width: `${70/11}%`, ball: true},
        // {label: 'Lure', dataKey: 'lure', width: `${70/11}%`, ball: true},
        // {label: 'Moon', dataKey: 'moon', width: `${70/11}%`, ball: true},
        // {label: 'Beast', dataKey: 'beast', width: `${70/11}%`, ball: true},
        // {label: 'Dream', dataKey: 'dream', width: `${70/11}%`, ball: true},
        // {label: 'Safari', dataKey: 'safari', width: `${70/11}%`, ball: true},
        // {label: 'Sport', dataKey: 'sport', width: `${70/11}%`, ball: true}
    ]

    function setHeaders() {
        return (
            <>
            <TableRow sx={{backgroundColor: '#283f57'}}>
                {columns.map(c => (
                    c.ball ? 
                    <TableCell 
                        key={`${c.label}-header`}
                        sx={{...styles.tableCell, width: c.width}} 
                        variant='head'>
                        <Box
                            sx={styles.ballHeaderDiv.divStyles}
                        >
                            <Box sx={styles.ballHeaderDiv.label}>{c.label}</Box>
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
                                {...styles.textHeader, ...styles.alignment.dexNumHeaderAlignment} :
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
        const includePokemonProp = isEditMode ? {} : {row}
        return (
            // <Fragment key={row.imgLink}>
                <TableRowGrouping
                    columns={columns}
                    // row={row}
                    // idx={_index}
                    id={row.imgLink}
                    collectionId={collection._id}
                    ownerId={collection.owner._id}
                    styles={styles}
                    isEditMode={isEditMode}
                    constRow={row}
                    {...includePokemonProp}
                />
            // </Fragment>
        )
    }
    
    const VirtuosoTableComponents = {
        Scroller: React.forwardRef((props, ref) => (
          <TableContainer component={Paper} {...props} ref={ref} />
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
        <Paper style={{height: 800, margin: 0}}>
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