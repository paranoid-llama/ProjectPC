import {Box, Typography, TextField, InputAdornment, styled, Button, Tabs, Tab} from '@mui/material'
import NameFormatModal from '../shared/nameformatmodal';
import {NumericFormat} from 'react-number-format'
import Tooltip, {tooltipClasses} from '@mui/material/Tooltip'
import HelpIcon from '@mui/icons-material/Help';
import { useState, useRef } from 'react'
import AprimonImportNotice from './aprimonimportnotice'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import './aprimonimportform.css'


export default function AprimonImportForm({}) {
    const [notice, setNotice] = useState(true)
    const [nameFormatModal, setNameFormatModal] = useState(false)

    const noticeClassName = notice === 'transitioning' ? 'fade-notice-out' : ''
    const formClassName = notice === 'transitioning' ? 'fade-form-in' : ''

    const removeNotice = () => {
        setNotice('transitioning')
        setTimeout(() => {
            setNotice(false)
        }, 500)
    }

    // const CustomWidthTooltip = styled(MuiTooltip)({
    //     '&.MuiTooltip-tooltip': {
    //         maxWidth: 1000
    //     } 
    // })

    const CustomWidthTooltip = styled(({className, ...props}) => (
        <Tooltip {...props} classes={{popper: className}}/>
    ))({
        '& .MuiTooltip-tooltip': {
            maxWidth: 425,
            textAlign: 'center'
        }
    })

    const openNameFormatModal = () => {
        setNameFormatModal(true)
    }

    const closeNameFormatModal = () => {
        setNameFormatModal(false)
    }

    const spreadSheetIdToolTip = 'Your spreadsheet ID is in the link: https://docs.google.com/spreadsheets/d/(SPREADSHEET_ID)/edit#gid=123456789 Make sure anyone with the link can view the spreadsheet!'
    const rowSpanToolTip = 'The range of rows your collection encompasses. First value will be the first pokemon, and the second one will be the last pokemon. Ensure most of the imported fields spans this range!'
    const identifierToolTip = "These are used to associate data with a particular pokemon. National Dex # is not required, but you have to make sure all your pokemon are spelled correctly if you don't import it!"

    return (
        <Box sx={{width: '100%', height: '95%'}}>
            {(notice === true || notice === 'transitioning') && <AprimonImportNotice removeNotice={removeNotice} transitionClass={noticeClassName}/>}
            {(notice === false || notice === 'transitioning') &&
            <Box sx={{width: '100%', height: '100%', position: 'relative'}} className={formClassName}>
                <Box sx={{position: 'absolute', width: '100%', height: '100%',  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Box sx={{width: '100%', height: '25%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mb: 1}}>
                        <Box sx={{width: '50%', height: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <TextField 
                                fullWidth size='small' 
                                label='Spreadsheet ID'
                                InputProps={{
                                    endAdornment: <InputAdornment position="end" sx={{':hover': {cursor: 'pointer'}}}>
                                                    <CustomWidthTooltip title={spreadSheetIdToolTip} arrow>
                                                        <HelpIcon/>
                                                    </CustomWidthTooltip> 
                                                  </InputAdornment>
                                }}
                            />
                        </Box>
                        <Box sx={{width: '100%', height: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Box sx={{width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                <Box sx={{width: '75%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>  
                                    <TextField
                                        fullWidth
                                        size='small'
                                        label='Sheet Name'
                                    />
                                </Box>
                            </Box>
                            <Box sx={{width: '50%', height: '100%'}}>
                                <Box sx={{width: '90%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}> 
                                    <Typography sx={{fontSize: '16px', fontWeight: 700, mr: 3}}>Row Span:</Typography>
                                    <NumericFormat customInput={TextField} size='small' label='From' allowNegative={false} decimalScale={0}/>
                                    <Typography sx={{fontSize: '16px', fontWeight: 700, mx: 1}}>-</Typography>
                                    <NumericFormat customInput={TextField} size='small' label='To' allowNegative={false} decimalScale={0}/>
                                    <Box sx={{marginLeft: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', ':hover': {cursor: 'pointer'}, color: 'rgba(0, 0, 0, 0.54)'}}>
                                        <Tooltip title={rowSpanToolTip} arrow>
                                            <HelpIcon/>
                                        </Tooltip> 
                                    </Box>
                                </Box> 
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{width: '100%', height: '75%', display: 'flex', flexDirection: 'column'}}>
                        <Box sx={{width: '100%', height: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Box sx={{width: '40%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                                <Typography sx={{fontSize: '16px', fontWeight: 700, mb: 0.1, position: 'relative'}}>
                                    Identifiers 
                                    <Tooltip sx={{position: 'absolute', width: '16px', bottom: '5px', right: '-20px', ':hover': {cursor: 'pointer'}}} title={identifierToolTip} arrow>
                                        <HelpIcon/>
                                    </Tooltip> 
                                </Typography>
                                <Box sx={{width: '100%', height: '30%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Typography sx={{fontSize: '14px', marginRight: 1}}>Dex # Column:</Typography>
                                    <TextField placeholder='A' size='small'/>
                                </Box>
                                <Box sx={{width: '100%', height: '30%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                                    <Typography sx={{fontSize: '14px', marginRight: 1}}>Name Column:</Typography>
                                    <TextField placeholder='C' size='small'/>
                                </Box>
                                <Button sx={{fontSize: '10px'}} onClick={openNameFormatModal}>
                                    See Accepted Name Formats
                                </Button>
                                <NameFormatModal open={nameFormatModal} handleClose={closeNameFormatModal}/>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
            }
        </Box>
    )
}