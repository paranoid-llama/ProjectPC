import * as React from 'react';
import {useRef, useEffect} from 'react'
import store from '../../../app/store';
import {Paper, Table, TableHead, TableRow, TableBody, TableContainer, TableCell, Box} from '@mui/material'
import {TableVirtuoso} from 'react-virtuoso'
import { useSelector } from 'react-redux';
import OnHandRowContent from './onhandrowcontent'
import './../../../routes/showCollection.css'
import {connect} from 'react-redux'

export default function ShowOnHandList({collectionID, styles, eggMoveInfo}) {
    
    const listState = useSelector(state => state.listDisplay.onhand)

    const scrollRef = useRef(null)
    const scrollPosition = useRef()

    useEffect(() => {
        if (scrollPosition.current !== undefined) { 
            setTimeout(() => scrollRef.current.scrollTo({top: scrollPosition.current}), 1000)
        }
    })

    const columns = [
        {label: '#', dataKey: 'natDexNum', width: '5%'},
        {label: 'img', dataKey: 'natDexNum', width: '5%', isImg: true},
        {label: 'Name', dataKey: 'name', width: '17%'},
        {label: 'Ball', dataKey: 'ball', width: '5%', isImg: true, smallHeader: true},
        {label: 'Gender', dataKey: 'gender', width: '8%', isImg: true, smallHeader: true},
        {label: 'HA?', dataKey: 'isHA', width: '5%', smallHeader: true},
        {label: 'EM Count', dataKey: 'emCount', width: '10%'},
        {label: 'EM 1', dataKey: 'EMs', width: '10%', idx: 0},
        {label: 'EM 2', dataKey: 'EMs', width: '10%', idx: 1},
        {label: 'EM 3', dataKey: 'EMs', width: '10%', idx: 2},
        {label: 'EM 4', dataKey: 'EMs', width: '10%', idx: 3},
        {label: 'Qty', dataKey: 'qty', width: '5%', smallHeader: true}
    ]

    function setHeaders() {
        return (
            <>
            <TableRow sx={{backgroundColor: '#283f57'}}>
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
                                {...styles.textHeader, ...styles.alignment.dexNumHeaderAlignment} :
                                (c.smallHeader === true) ? 
                                {...styles.textHeader, ...styles.alignment.textAlignment} :
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
        return (
            <OnHandRowContent
                columns={columns}
                // row={row}
                pokemonId={row._id}
                collectionId={collectionID}
                styles={styles}
                allEggMoveInfo={eggMoveInfo}
            />
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

    return (
        <Paper style={{height: 800, margin: 0}}>
            <TableVirtuoso
                data={listState}
                components={VirtuosoTableComponents}
                fixedHeaderContent={setHeaders}
                itemContent={rowContent}
                sx={{backgroundColor: '#272625', zIndex: 100}}
            >
            </TableVirtuoso>
        </Paper>
    )
}