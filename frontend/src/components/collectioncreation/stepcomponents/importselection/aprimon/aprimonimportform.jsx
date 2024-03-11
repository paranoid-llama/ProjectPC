import {Box, Typography, TextField} from '@mui/material'
import { useState, useRef } from 'react'
import AprimonImportNotice from './aprimonimportnotice'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import './aprimonimportform.css'


export default function AprimonImportForm({}) {
    const [notice, setNotice] = useState(true)

    const noticeClassName = notice === 'transitioning' ? 'fade-notice-out' : ''
    const formClassName = notice === 'transitioning' ? 'fade-form-in' : ''

    const removeNotice = () => {
        setNotice('transitioning')
        setTimeout(() => {
            setNotice(false)
        }, 500)
    }

    return (
        <Box sx={{width: '100%', height: '95%'}}>
            {(notice === true || notice === 'transitioning') && <AprimonImportNotice removeNotice={removeNotice} transitionClass={noticeClassName}/>}
            {(notice === false || notice === 'transitioning') &&
            <Box sx={{width: '100%', height: '100%', position: 'relative'}} className={formClassName}>
                <Box sx={{position: 'absolute', width: '100%', height: '100%',  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <Box sx={{width: '100%', height: '20%'}}>
                        <TextField size='small' label='Spreadsheet ID'/>
                    </Box>
                    <Box sx={{width: '100%', height: '80%', display: 'flex', flexDirection: 'row'}}>
                        
                    </Box>
                </Box>
            </Box>
            }
        </Box>
    )
}