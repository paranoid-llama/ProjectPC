import {Box, Typography, CircularProgress} from '@mui/material'
import AprimonPreviewImport from './aprimonpreviewimport'

export default function AprimonImportDisplay({data}) {
    const noData = Object.keys(data).length === 0
    const apiCallError = data.error !== undefined
    const apiCallErrorCode = apiCallError && data.error.code
    const badRanges = data.rangeIssue !== undefined 
    return (
        noData ?
        <Box sx={{width: '100%', height: '95%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center'}}>
            <Typography sx={{fontWeight: 700, fontSize: '20px', mb: 4, mt: 10}}> Importing Collection </Typography>
            <CircularProgress />
        </Box> : 
        apiCallError ?
        <Box sx={{mb: 4, mt: 5, textAlign: 'center', width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 3}}>
            <Typography variant='h6' sx={{fontWeight: 700, fontSize: '20px', mb: -1}}> 
                We couldn't retrieve your data!
            </Typography>
            <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px'}}>
                {apiCallErrorCode === 404 ? "The spreadsheet ID didn't match any spreadsheet in Google's database. Double check that the spreadsheet ID was input correctly." : 
                apiCallErrorCode === 403 && "We don't have permission to view the spreadsheet. Double check that the spreadsheet is viewable to anyone with the link."}
            </Typography>
            {apiCallErrorCode === 404 && 
            <Typography variant = 'p' sx={{fontFamily: 'Arial', fontSize: '12px', color: '#3b3b3b'}}>
                *Note that the spreadsheet ID is only in the unpublished spreadsheet link, not the published one.
            </Typography>
            }
        </Box> :
        badRanges ?
        <Box sx={{mb: 4, mt: 5, textAlign: 'center', width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 3}}>
            <Typography variant='h6' sx={{fontWeight: 700, fontSize: '20px', mb: -1}}> 
                There was a problem with the import!
            </Typography>
            <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px'}}>
                One or multiple data columns featured no data:
            </Typography>
            <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px'}}>
                {data.badRanges.map((name, idx) => idx+1 === data.badRanges.length ? `${name} Column` : `${name} Column, `)}
            </Typography>
            <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px'}}>
                Double-check that the columns were input correctly!
            </Typography>
            {apiCallErrorCode === 404 && 
            <Typography variant = 'p' sx={{fontFamily: 'Arial', fontSize: '12px', color: '#3b3b3b'}}>
                "Note that the spreadsheet ID is only in the unpublished spreadsheet link, not the published one."
            </Typography>
            }
        </Box> :
        <AprimonPreviewImport data={data}/>
    )
}