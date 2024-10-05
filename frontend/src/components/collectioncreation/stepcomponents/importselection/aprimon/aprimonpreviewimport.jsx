import * as React from 'react';
import { useState } from 'react';
import { useRouteLoaderData } from 'react-router';
import getNameDisplay from '../../../../../../utils/functions/display/getnamedisplay';
import {Box, Typography, Table, TableRow, TableCell, TableHead, TableBody, TableContainer, Paper, Modal, Fade, Backdrop, Tabs, Tab, useTheme} from '@mui/material'
import DataCell from '../../../../collectiontable/tabledata/datacell';
import ImgData from '../../../../collectiontable/tabledata/imgdata';
import { capitalizeFirstLetter } from '../../../../../../utils/functions/misc';
import { TableVirtuoso } from 'react-virtuoso'
import listStyles from '../../../../../../utils/styles/componentstyles/liststyles'
import modalStyles from '../../../../../../utils/styles/componentstyles/modalstyles'

export default function AprimonPreviewImport({data, numOfBalls}) {
    const [openDataModal, setOpenDataModal] = useState(false)
    const [openErrorModal, setOpenErrorModal] = useState(false)
    const [errorDisplayType, setErrorDisplayType] = useState('rows')
    const nameDisplaySettings = useRouteLoaderData('root').user === undefined ? undefined : useRouteLoaderData('root').user.settings.display.pokemonNames
    const theme = useTheme()

    const openModal = (type) => {
        if (type === 'data') {
            setOpenDataModal(true)
        } else if (type === 'error') {
            setOpenErrorModal(true)
        }
    }

    const closeModal = (type) => {
        if (type === 'data') {
            setOpenDataModal(false)
        } else if (type === 'error') {
            setOpenErrorModal(false)
        }
    }

    const toggleModal = (type) => {
        if (type === 'data') {
            setOpenDataModal(!openDataModal)
        } else if (type === 'error') {
            setOpenErrorModal(!openErrorModal)
        }
    }

    const toggleErrorDisplay = () => {
        if (errorDisplayType === 'rows') {
            setErrorDisplayType('ems')
        }
        if (errorDisplayType === 'ems') {
            setErrorDisplayType('rows')
        }
    }

    const dataTableColumns = [
        {label: '#', dataKey: 'natDexNum', width: '32px'},
        {label: 'img', dataKey: 'natDexNum', width: '32px'},
        {label: 'Name', dataKey: 'name', width: '100px'},
        {label: 'Owned Balls', dataKey: 'balls', width: `${numOfBalls*50}px`}
    ]

    const errorTableColumns = [
        {label: 'Name', dataKey: 'pokemonName', width: '100px'},
        {label: 'Row #', dataKey: 'row', width: '60px'},
        {label: 'Error Details', label2: 'Failed Egg Move Imports', dataKey: 'errorMessage', dataKey2: 'EMs', width: '500px'}
    ]

    function setDataHeaders() {
        return (
            <>
            <TableRow sx={{backgroundColor: '#283f57'}}>
                {dataTableColumns.map((col) => (
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

    function setErrorHeaders(detailed) {
        return (
            <>
                <TableRow sx={{backgroundColor: '#283f57'}}>
                    {errorTableColumns.map((col) => (
                        <TableCell
                            key={`Error-${col.label}-header`}
                            sx={{...listStyles.collection.tableCell, width: col.width}}
                            variant='head'
                        >
                            <Box
                                sx={
                                    // col.label === 'img' ? 
                                    // {...listStyles.collection.textHeader, paddingTop: '28px', paddingBottom: '28px'} : 
                                    // col.label === '#' ?
                                    // {...listStyles.collection.textHeader, ...listStyles.collection.alignment.dexNumHeaderAlignment} :
                                    listStyles.collection.textHeader
                                }
                            >
                                {col.label2 !== undefined && (detailed && errorDisplayType === 'ems') ? col.label2 : col.label}
                            </Box>
                        </TableCell>
                    ))}
                </TableRow>
            </>
        )
    }

    function dataRowContent(_index, row, detailed) {
        return (
        <React.Fragment>
            {dataTableColumns.map(col => {
                const isImg = col.label === 'img' && true
                const textSizeAdjustor = col.dataKey === 'name' && row[col.dataKey] === 'Basculin (White-Striped)' ? {fontSize: '13px'} : {}
                const height = detailed ? {padding: '0px'} : {}
                return (
                    col.label === '#' ? 
                    <DataCell
                        key={`${row.imgLink}-${col.label}`}
                        label={row[col.dataKey]} 
                        styles={listStyles.collection} 
                        alignment={{position: 'relative', width: '100%'}}
                        isEditMode={false}
                        leftMostCell={true}
                        isSelected={false}
                        onClickFunc={null}
                    /> : 
                    col.label !== 'Owned Balls' ? 
                    <DataCell 
                        key={`${row.imgLink}-${col.label}`}
                        label={(col.dataKey === 'name') && getNameDisplay(nameDisplaySettings, row[col.dataKey], row.natDexNum)}
                        styles={listStyles.collection} 
                        alignment={col.label === 'img' ? {} : {position: 'relative', width: '100%'}}
                        imgParams={{isImg: isImg, imgLinkKey: row.imgLink}}
                        imgAlignment={col.label === 'img' && {position: 'relative'}}
                        specialStyles={textSizeAdjustor}
                        isEditMode={false}
                        isSelected={false}
                        onClickFunc={null}
                    /> : 
                    <TableCell 
                        key={`${row.imgLink}-${col.label}`}
                        padding='none'
                        sx={{...listStyles.collection.tableCell, overFlowX: 'hidden', height}}
                    >
                        <Box sx={{...listStyles.collection.bodyColor, display: 'flex', justifyContent: 'center', gap: 0.75}}>
                            {Object.keys(row[col.dataKey]).map((ball) => {
                                const isOwnedBall = row[col.dataKey][ball].isOwned === true
                                const cantHaveHA = row[col.dataKey][ball].isHA === undefined
                                const hasHA = !cantHaveHA && row[col.dataKey][ball].isHA === true
                                const cantHaveEMs = row[col.dataKey][ball].EMs === undefined
                                const hasNoEMs = !cantHaveEMs && row[col.dataKey][ball].emCount === 0
                                return (
                                    isOwnedBall &&
                                    <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}} key={`${row.name}-${ball}-ball-owned`}>
                                       
                                        <Typography variant='p' sx={{fontSize: '14px', margin: 0, padding: 0}}>{capitalizeFirstLetter(ball)}</Typography>
                                        <ImgData type='ball' linkKey={ball}/>
                                        {detailed &&
                                        <Box sx={{height: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', my: 0, padding: 0}}>
                                                <Typography sx={{fontSize: '12px', width: '100%', borderTop: '1px solid white', fontWeight: hasHA ? 700 : 400, opacity: hasHA ? 1 : 0.5}}>{!cantHaveHA && 'HA'}</Typography>
                                                <Typography sx={{fontSize: '12px', width: '100%', fontWeight: hasNoEMs ? 400 : 700, opacity: hasNoEMs ? 0.5 : 1}}>{!cantHaveEMs && `${row[col.dataKey][ball].emCount}EMs`}</Typography>
                                        </Box>
                                        }
                                    </Box> 
                                )
                            })}
                        </Box>
                    </TableCell>
                )
            })}
        </React.Fragment>
        )
    }

    function errorRowContent(_index, row, detailed) {
        return (
            <React.Fragment>
                {errorTableColumns.map((col) => {
                    const fsOverride = (col.dataKey === 'errorMessage' && row[col.dataKey2] === undefined) ? {fontSizeOverride: '12px'} : {}
                    return (
                    <DataCell
                        key={`Row-${row.row}-${col.label}-details`}
                        label={col.label2 !== undefined && (detailed && errorDisplayType === 'ems') ? row[col.dataKey2].map((em, idx) => idx+1 !== row[col.dataKey2].length ? `${em}, ` : em) : row[col.dataKey]} 
                        styles={{...listStyles.collection, tableCell: {...listStyles.collection.tableCell, height: '70px'}}} 
                        alignment={{position: 'relative'}}
                        bodyColorOverride={{height: '30px'}}
                        {...fsOverride}
                        // alignment={{'@media only screen and (max-width: 1500px)': {paddingLeft: '10px'}}}
                        isEditMode={false}
                        // leftMostCell={true}
                        isSelected={false}
                        onClickFunc={null}
                    />)
                })}
            </React.Fragment>
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

    return (
        <Box sx={{width: '100%', height: '95%', display: 'flex', flexDirection: 'column'}}>
             <Typography variant='h6' sx={{fontWeight: 700, fontSize: '20px', my: 1}}> 
                Preview Collection
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%'}}>
                <Box sx={{width: '50%'}}>
                    <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px', mb: 1}}> 
                        We successfully imported the collection! Here's a preview of the imported data:
                    </Typography>
                    <Paper style={{height: 350, margin: 0}}>
                        <TableVirtuoso 
                            data={data.collection}
                            components={VirtuosoTableComponents}
                            fixedHeaderContent={setDataHeaders}
                            itemContent={dataRowContent}
                            sx={{backgroundColor: '#272625', ':hover': {cursor: 'pointer', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}}
                            onClick={() => toggleModal('data')}
                        />
                    </Paper>
                    <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '12px', mt: 1}}> 
                        Click to enlarge
                    </Typography>
                    <Modal
                        aria-labelledby='detailed-data-table'
                        aria-describedby='check the details of your imported data'
                        open={openDataModal}
                        onClose={() => toggleModal('data')}
                        closeAfterTransition
                        slots={{backdrop: Backdrop}}
                        slotProps={{
                            backdrop: {
                                timeout: 500
                            }
                        }}
                    >
                        <Fade in={openDataModal}> 
                            <Box sx={{...modalStyles.onhand.modalContainer, height: '665px', width: '95%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                                <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '99%'}}>
                                    <Typography variant='h5' align='center' sx={{paddingTop: '10px', fontSize: '24px', fontWeight: 700, mb: 3}}>Imported Data</Typography>
                                    <Paper style={{height: '80%', margin: 0}}>
                                        <TableVirtuoso 
                                            data={data.collection}
                                            components={VirtuosoTableComponents}
                                            fixedHeaderContent={setDataHeaders}
                                            itemContent={(_index, row) => dataRowContent(_index, row, true)}
                                            sx={{backgroundColor: '#272625'}}
                                        />
                                    </Paper>
                                </Box>
                            </Box>
                        </Fade>
                    </Modal>
                </Box>
                <Box sx={{width: '50%', marginLeft: 2}}>
                    <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px', mb: 1}}> 
                        Here were some rows that might not have imported successfully:
                    </Typography>
                    <Paper style={{height: 350, margin: 0 }}>
                        <TableVirtuoso 
                            data={data.possibleUnsuccessfulRows}
                            components={VirtuosoTableComponents}
                            fixedHeaderContent={setErrorHeaders}
                            itemContent={errorRowContent}
                            sx={{backgroundColor: '#272625', ':hover': {cursor: 'pointer', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}}
                            onClick={() => toggleModal('error')}
                        />
                    </Paper>
                    <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '12px', mt: 1}}> 
                        Click to enlarge
                    </Typography>
                    <Modal
                        aria-labelledby='detailed-error-table'
                        aria-describedby='check the details of your import errors'
                        open={openErrorModal}
                        onClose={() => toggleModal('error')}
                        closeAfterTransition
                        slots={{backdrop: Backdrop}}
                        slotProps={{
                            backdrop: {
                                timeout: 500
                            }
                        }}
                    >
                        <Fade in={openErrorModal}> 
                            <Box sx={{...modalStyles.onhand.modalContainer, height: '665px', width: '95%', maxWidth: '800px', display: 'flex', alignItems: 'center'}}>
                                <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '99%', position: 'relative'}}>
                                    <Typography variant='h5' align='center' sx={{paddingTop: '10px', fontSize: '24px', fontWeight: 700, mb: 3}}>Import Errors</Typography>
                                    {data.possibleUnsuccessfulEMs !== undefined &&
                                    <Tabs sx={{color: 'white'}} onChange={toggleErrorDisplay} value={errorDisplayType}>
                                        <Tab label='Failed Rows' value='rows'/>
                                        <Tab label='Failed EMs' value='ems'/>
                                    </Tabs>}
                                    {errorDisplayType === 'ems' && 
                                    <Typography sx={{position: 'absolute', fontSize: '10px', top: '40px', width: '150px', right: '25px', textAlign: 'center'}}>
                                        Egg moves may fail to import due to a spelling error, missing a hyphen ( - ), or the pokemon can't have that egg move.
                                    </Typography>}
                                    <Paper style={{height: '80%', margin: 0}}>
                                        <TableVirtuoso 
                                            data={errorDisplayType === 'rows' ? data.possibleUnsuccessfulRows : data.possibleUnsuccessfulEMs}
                                            components={VirtuosoTableComponents}
                                            fixedHeaderContent={() => setErrorHeaders(true)}
                                            itemContent={(_index, row) => errorRowContent(_index, row, true)}
                                            sx={{backgroundColor: '#272625'}}
                                        />
                                    </Paper>
                                </Box>
                            </Box>
                        </Fade>
                    </Modal>
                </Box>
            </Box>
        </Box>
    )
}