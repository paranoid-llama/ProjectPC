import {Box, Typography, CircularProgress} from '@mui/material'
import AprimonPreviewImport from './aprimonpreviewimport'

export default function AprimonImportDisplay({data, numOfBalls}) {
    const noData = Object.keys(data).length === 0
    const apiCallError = data.error !== undefined
    const apiCallErrorCode = apiCallError && data.error.code
    const badRanges = data.rangeIssue !== undefined 
    const missingInfo = data.missingInfo !== undefined
    const ballColIssue = data.ballColIssue !== undefined
    const backendError = data.status !== undefined && !apiCallError && !badRanges && !missingInfo && !ballColIssue

    const setBallColIssue = (type) => {
        return (
            <Box sx={{mb: 4, mt: 5, textAlign: 'center', width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 3}}>
                <Typography variant='h6' sx={{fontWeight: 700, fontSize: '20px', mb: -1}}> 
                    There was a problem with the owned ball information!
                </Typography>
                <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px'}}>
                    {type === 'notLeftToRight' ? 'You might have inputted the columns right to left, when it should be left to right. Make sure the fields are in the right order!' : 
                    type === 'moreThan11Balls' ? "The ball column range indicates more than 11 ball columns, which is over the max. Double check the columns to make sure they're right!" :
                    type === 'mismatchBallColsAndOrder' && "The ball column range and the ball order length are not the same. Make sure they're matching!"}
                </Typography>
            </Box> 
        )
    }

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
                {apiCallErrorCode === 404 ? `The spreadsheet ID we got from your link didn't match any spreadsheet in Google's database. Double check that the spreadsheet link was input correctly, and that it's ${<b>not</b>} the published spreadsheet link.` : 
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
        </Box> :
        missingInfo ? 
        <Box sx={{mb: 4, mt: 5, textAlign: 'center', width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 3}}>
            <Typography variant='h6' sx={{fontWeight: 700, fontSize: '20px', mb: -1}}> 
                There was a problem with the import!
            </Typography>
            <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px'}}>
                One or multiple required form fields were not filled:
            </Typography>
            <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px'}}>
                {data.missingFields.map((name, idx) => idx+1 === data.missingFields.length ? `${name}` : `${name}, `)}
            </Typography>
            <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px'}}>
                Double-check that these fields are filled out!
            </Typography>
        </Box> :
        ballColIssue ? setBallColIssue(data.type) : 
        backendError ? 
        <Box sx={{mb: 4, mt: 5, textAlign: 'center', width: '80%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 3}}>
            <Typography variant='h6' sx={{fontWeight: 700, fontSize: '20px', mb: -1}}> 
                There was a problem with the import!
            </Typography>
            <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px'}}>
                <b>ERROR:</b> {data.name} ({data.status})
            </Typography>
            <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px'}}>
                {data.message}
            </Typography>
            <Typography variant='p' sx={{fontFamily: 'Arial', fontSize: '14px'}}>
                Please try again.
            </Typography>
        </Box> :
        <AprimonPreviewImport data={data} numOfBalls={numOfBalls}/>
    )
}