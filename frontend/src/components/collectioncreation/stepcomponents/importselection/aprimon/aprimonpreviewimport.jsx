import * as React from 'react';
import {Box, Typography, Table, TableRow, TableCell, TableHead, TableBody, TableContainer, Paper, Card, CardMedia, CardContent} from '@mui/material'
import DataCell from '../../../../collectiontable/tabledata/datacell';
import ImgData from '../../../../collectiontable/tabledata/imgdata';
import { capitalizeFirstLetter } from '../../../../../../utils/functions/misc';
import { TableVirtuoso } from 'react-virtuoso'
import listStyles from '../../../../../../utils/styles/componentstyles/liststyles'

export default function AprimonPreviewImport({data}) {

    const tableColumns = [
        {label: '#', dataKey: 'natDexNum', width: '5%'},
        {label: 'img', dataKey: 'natDexNum', width: '5%'},
        {label: 'Name', dataKey: 'name', width: '20%'},
        {label: 'Owned Balls', dataKey: 'balls', width: '70%'}
    ]

    function setHeaders() {
        return (
            <>
            <TableRow sx={{backgroundColor: '#283f57'}}>
                {tableColumns.map((col) => (
                    <TableCell
                        key={`${col.label}-header`}
                        sx={{...listStyles.collection.tableCell, width: col.width}}
                        variant='head'
                    >
                        <Box
                            sx={
                                col.label === 'img' ? 
                                {...listStyles.collection.textHeader, paddingTop: '28px', paddingBottom: '28px'} : 
                                col.label === '#' ?
                                {...listStyles.collection.textHeader, ...listStyles.collection.alignment.dexNumHeaderAlignment} :
                                listStyles.collection.textHeader
                            }
                        >
                            {col.label !== 'img' && col.label}
                        </Box>
                    </TableCell>
                ))}
            </TableRow>
            </>
        )    
    }

    function rowContent(_index, row) {
        return (
        <React.Fragment>
            {tableColumns.map(col => {
                const isImg = col.label === 'img' && true
                const textSizeAdjustor = col.dataKey === 'name' && row[col.dataKey] === 'Basculin (White-Striped)' ? {fontSize: '13px'} : {}
                return (
                    col.label === '#' ? 
                    <DataCell
                        key={`${row.imgLink}-${col.label}`}
                        label={row[col.dataKey]} 
                        styles={listStyles.collection} 
                        alignment={listStyles.collection.alignment.numAlignment}
                        isEditMode={false}
                        leftMostCell={true}
                        isSelected={false}
                        onClickFunc={null}
                    /> : 
                    col.label !== 'Owned Balls' ? 
                    <DataCell 
                        key={`${row.imgLink}-${col.label}`}
                        label={col.dataKey === 'name' && row[col.dataKey]}
                        styles={listStyles.collection} 
                        alignment={col.label === 'img' && listStyles.collection.alignment.imgAlignment}
                        imgParams={{isImg: isImg, imgLinkKey: row.imgLink}}
                        specialStyles={textSizeAdjustor}
                        isEditMode={false}
                        isSelected={false}
                        onClickFunc={null}
                    /> : 
                    <TableCell 
                        padding='none'
                        sx={listStyles.collection.tableCell}
                    >
                        <Box sx={{...listStyles.collection.bodyColor, display: 'flex', justifyContent: 'center'}}>
                            {Object.keys(row[col.dataKey]).map((ball) => {
                                const isOwnedBall = row[col.dataKey][ball].isOwned === true
                                const cantHaveHA = row[col.dataKey][ball].isHA === undefined
                                const hasHA = !cantHaveHA && row[col.dataKey][ball].isHA === true
                                const cantHaveEMs = row[col.dataKey][ball].EMs === undefined
                                const hasNoEMs = !cantHaveEMs && row[col.dataKey][ball].emCount === 0
                                return (
                                    isOwnedBall &&
                                    <Card sx={{height: '30px'}} key={`${row.name}-${ball}-ball-owned`}>
                                        {/* <CardMedia 
                                            sx={{height: '35px'}}
                                            image={`https://res.cloudinary.com/duaf1qylo/image/upload/v1693796934/balls/${ball}.png`}
                                            title={`${ball}-ball`}
                                        /> */}
                                        <CardContent sx={{height: '50%'}}>
                                            <Typography gutterBottom variant='p' sx={{fontSize: '14px'}}>{capitalizeFirstLetter(ball)}</Typography>
                                            <Box sx={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                                                <Typography sx={{fontSize: '12px', width: '50%', borderTop: '1px solid white', borderRight: '1px solid white', fontWeight: hasHA ? 700 : 400, opacity: hasHA ? 1 : 0.5}}>{!cantHaveHA && 'HA'}</Typography>
                                                <Typography sx={{fontSize: '12px', width: '50%', borderTop: '1px solid white', borderRight: '1px solid white', fontWeight: hasNoEMs ? 400 : 700, opacity: hasNoEMs ? 0.5 : 1}}>{!cantHaveEMs && `${row[col.dataKey][ball].emCount}EMs`}</Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </Box>
                    </TableCell>
                )
            })}
        </React.Fragment>
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
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} sx={{display: 'flex', flexDirection: 'row', width: '99%'}} />,
        TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
    };

    return (
        <Box sx={{width: '100%', height: '95%', display: 'flex', flexDirection: 'column'}}>
             <Typography variant='h6' sx={{fontWeight: 700, fontSize: '20px', my: 1}}> 
                Preview Collection
            </Typography>
            <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px'}}> 
                We successfully imported the collection! Here's a preview of the imported data:
            </Typography>
            <Paper style={{height: '50%', margin: 0}}>
                <TableVirtuoso 
                    data={data.collection}
                    components={VirtuosoTableComponents}
                    fixedHeaderContent={setHeaders}
                    itemContent={rowContent}
                    sx={{backgroundColor: '#272625'}}
                />
            </Paper>
        </Box>
    )
}