import * as React from 'react';
import {Modal, Box, Typography, Fade, Backdrop, Tooltip, TableRow, TableCell, TableHead, TableBody, TableContainer, Paper, Table, Button} from '@mui/material'
import HelpIcon from '@mui/icons-material/Help';
import { aprimonGeneralIdentifiers, aprimonSpecificIdentifiers, aprimonAsideInfo } from '../../../../../../common/infoconstants/importconstants.mjs';
import { TableVirtuoso } from 'react-virtuoso'
import ImgData from '../../../../collectiontable/tabledata/imgdata';
import modalStyles from '../../../../../../utils/styles/componentstyles/modalstyles'

export default function NameFormatModal({open, handleClose}) {

    const setHeaders = () => {
        return (
            <>
            <TableRow sx={{backgroundColor: '#26BCC9', color: 'black', display: 'flex', flexDirection: 'row', width: '99%', height: '50px'}}>
                <TableCell sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30%', borderTop: 'none'}} variant='head'>
                </TableCell>
                <TableCell sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30%', borderTop: 'none'}} variant='head'>
                    <Typography sx={{fontSize: '12px', fontWeight: 700}}>
                        Pokemon
                    </Typography>
                </TableCell>
                <TableCell sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', borderTop: 'none'}} variant='head'>
                    <Typography sx={{fontSize: '12px', fontWeight: 700}}>
                        Required Identifier
                    </Typography>
                </TableCell>
                <TableCell sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', borderTop: 'none'}} variant='head'>
                    <Typography sx={{fontSize: '10px', fontWeight: 700}}>
                        Can 1st Letter with dash?
                    </Typography>
                </TableCell>
            </TableRow>
            </>
        )
    }

    const rowContent = (idx, row) => {
        return (
            <>
                <TableCell sx={{width: '30%', position: 'relative', borderTop: 'none'}}>
                    {row.imgLink.map((imgLink) => {
                        return (
                            
                            <ImgData type='poke' linkKey={imgLink} key={`pokemon-${imgLink}`}/>
                        )
                    })}
                </TableCell>
                <TableCell sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '30%', borderTop: 'none'}}>
                    <Typography sx={{fontSize: '12px', color: 'white'}}>
                        {row.category}
                    </Typography>
                </TableCell>
                <TableCell sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', borderTop: 'none', position: 'relative'}}>
                    <Typography sx={{fontSize: '12px', color: 'white', textAlign: 'center'}}>
                        {row.id}
                    </Typography>
                    {(aprimonAsideInfo[row.category] !== undefined && aprimonAsideInfo[row.category].id !== undefined) &&
                    <Box sx={{position: 'absolute', color: 'white', bottom: '5%'}}>
                        <Tooltip title={aprimonAsideInfo[row.category].id}>
                            <Typography sx={{fontSize: '8px', ':hover': {cursor: 'pointer'}}}>
                                NOTE
                            </Typography>
                        </Tooltip>
                    </Box>
                    }
                </TableCell>
                <TableCell sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '20%', borderTop: 'none', position: 'relative'}}>
                    <Typography sx={{fontSize: '12px', fontWeight: row.canFirstLetter === true ? 700 : 400, color: 'white'}}>
                        {row.canFirstLetter === true ? 'Yes' : 'No'}
                    </Typography>
                    {(row.canFirstLetter === false && aprimonAsideInfo[row.category] !== undefined && aprimonAsideInfo[row.category].canFirstLetter !== undefined) &&
                    <Box sx={{position: 'absolute', color: 'white', bottom: '5%'}}>
                        <Tooltip title={aprimonAsideInfo[row.category].canFirstLetter}>
                            <Typography sx={{fontSize: '8px', ':hover': {cursor: 'pointer'}}}>
                                WHY?
                            </Typography>
                        </Tooltip>
                    </Box>
                    }
                  
                </TableCell>
            </> 
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
        <>
        <Modal
            aria-labelledby='name-format'
            aria-describedby='check-accepted-alt-form-name-formats-for-import'
            open={open}
            onClose={handleClose}
            closeAfterTransition
            slots={{backdrop: Backdrop}}
            slotProps={{
                backdrop: {
                    timeout: 500
                }
            }}
        >
            <Fade in={open}>
                <Box sx={{...modalStyles.onhand.modalContainer, height: '665px', width: '70%', maxWidth: '550px', display: 'flex', alignItems: 'center'}}>
                    <Box sx={{...modalStyles.onhand.modalElementBg, width: '95%', height: '99%'}}>
                        <Typography variant='h5' align='center' sx={{paddingTop: '10px', fontSize: '24px', fontWeight: 700}}>Name Formats</Typography>
                        <Typography variant='body1' align='center' sx={{padding: '10px', fontSize: '14px'}}>
                            While there's only one way to spell a pokemon, there are tons of different ways to format regional form and/or alternate form pokemon. 
                            Below lists the required identifier in the name of regional/alternate form pokemon along with if you can just have the first letter of that identifer with a dash (-) in the name
                        </Typography>
                        <Box sx={{width: '100%', height: '7.5%', display: 'flex', flexDirection: 'row', border: '1px solid white', backgroundColor: '#26BCC9', color: 'black'}}>
                            <Box sx={{width: '30%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <Typography sx={{fontSize: '12px', fontWeight: 700}}>
                                    Category
                                </Typography>
                            </Box>
                            <Box sx={{width: '55%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid white'}}>
                                <Typography sx={{fontSize: '12px', fontWeight: 700}}>
                                    Required Identifier
                                </Typography>
                            </Box>
                            <Box sx={{width: '15%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <Typography sx={{fontSize: '10px', fontWeight: 700}}>
                                    Can 1st Letter with dash?
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{width: '100%', height: '15%', display: 'flex', flexDirection: 'column'}}>
                            {aprimonGeneralIdentifiers.map((identifiers) => {

                                return (
                                    <Box sx={{width: '100%', height: `${100/aprimonGeneralIdentifiers.length}%`, border: '1px white solid', display: 'flex', flexDirection: 'row', alignItems: 'center'}} key={`${identifiers.category}-name-requirements`}>
                                        <Box sx={{width: '30%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                            <Typography sx={{fontSize: '12px', textAlign: 'center'}}>
                                                {identifiers.category}
                                            </Typography>
                                        </Box>
                                        <Box sx={{width: '55%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid white', position: 'relative'}}>
                                            <Typography sx={{fontSize: '12px', textAlign: 'center'}}>
                                                {identifiers.id}
                                            </Typography>
                                            {aprimonAsideInfo[identifiers.category] !== undefined && 
                                            <Tooltip title={aprimonAsideInfo[identifiers.category].id} sx={{width: '14px', position: 'absolute', right: '30%', top: '15%', ':hover': {cursor: 'pointer'}}}>
                                                <HelpIcon/>
                                            </Tooltip>
                                            }
                                        </Box>
                                        <Box sx={{width: '15%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
                                            <Typography sx={{fontSize: '12px', fontWeight: identifiers.canFirstLetter === true ? 700 : 400}}>
                                                {identifiers.canFirstLetter === true ? 'Yes' : 'No'}
                                            </Typography>
                                            {aprimonAsideInfo[identifiers.category] !== undefined && 
                                            <Box sx={{position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', bottom: '5%'}}>
                                                <Tooltip title={aprimonAsideInfo[identifiers.category].canFirstLetter}>
                                                    <Typography sx={{fontSize: '8px', ':hover': {cursor: 'pointer'}}}>EXCEPTIONS</Typography>
                                                </Tooltip>
                                            </Box>
                                            }
                                        </Box>
                                    </Box>
                                )
                            })}
                        
                        </Box>
                        <Typography variant='body1' align='center' sx={{padding: '10px', fontSize: '14px'}}>
                            You can see a detailed table for each pokemon here:
                        </Typography>
                        <Paper style={{height: 250, margin: 0}}>
                            <TableVirtuoso 
                                data={aprimonSpecificIdentifiers}
                                components={VirtuosoTableComponents}
                                fixedHeaderContent={setHeaders}
                                itemContent={rowContent}
                                sx={{backgroundColor: '#1e2f41'}}
                            />
                        </Paper>
                        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2}}>
                            <Button onClick={handleClose}>Got it!</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
        </>
    )
}