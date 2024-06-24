import * as React from 'react';
import {useRef, useEffect} from 'react'
import store from '../../../app/store';
import {Paper, Table, TableHead, TableRow, TableBody, TableContainer, TableCell, Box, useTheme} from '@mui/material'
import {TableVirtuoso} from 'react-virtuoso'
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import OnHandRowContent from './onhandrowcontent'
import './../../../routes/showCollection.css'
import { interchangeableAltFormMons } from '../../../../../common/infoconstants/pokemonconstants.mjs';
import {connect} from 'react-redux'

export default function ShowOnHandList({onhandList, collectionID, styles, eggMoveInfo, isEditMode, isHomeCollection, localDisplayState=undefined, height=800, isTradePage, tradeSide, wantedByOtherListData=[]}) {
    const theme = useTheme()
    const listState = useSelector(state => state.listDisplay.onhand)
    const listDisplay = localDisplayState === undefined ? listState : localDisplayState
    const link = useLocation().pathname
    const linkRef = useRef(link)

    const scrollRef = useRef(null)
    const scrollPosition = useRef()

    const trProps = isTradePage ? {
        sx: {':hover': {cursor: 'pointer', opacity: 0.5}},
    } : {}

    useEffect(() => {
        const sameIDBetweenRefs = linkRef.current.includes(collectionID) && link.includes(collectionID)
        if (scrollPosition.current !== undefined && (sameIDBetweenRefs)) { 
            setTimeout(() => scrollRef.current.scrollTo({top: scrollPosition.current}), 1000)
        }
        linkRef.current = link
    }, [link])

    const emColumns = isHomeCollection ? [] : [
        {label: 'EM Count', dataKey: 'emCount', width: '10%'},
        {label: 'EM 1', dataKey: 'EMs', width: '10%', idx: 0},
        {label: 'EM 2', dataKey: 'EMs', width: '10%', idx: 1},
        {label: 'EM 3', dataKey: 'EMs', width: '10%', idx: 2},
        {label: 'EM 4', dataKey: 'EMs', width: '10%', idx: 3},
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
        const includePokemonProp = isEditMode ? {} : {row}
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
                isEditMode={isEditMode}
                isHomeCollection={isHomeCollection}
                isTradePage={isTradePage}
                tradeSide={tradeSide}
                wantedByOtherList={finalPokeWantedData}
                {...includePokemonProp}
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
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} {...trProps} />,
        TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
      };

    return (
        <Paper style={{height, margin: 0}}>
            <TableVirtuoso
                data={listDisplay}
                components={VirtuosoTableComponents}
                fixedHeaderContent={setHeaders}
                itemContent={rowContent}
                sx={{backgroundColor: '#272625', zIndex: 100}}
            />
        </Paper>
    )
}