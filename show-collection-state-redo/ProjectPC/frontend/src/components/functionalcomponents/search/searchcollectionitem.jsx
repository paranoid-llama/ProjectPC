import {Box, Typography, useTheme, CircularProgress} from '@mui/material'
import ImgData from '../../collectiontable/tabledata/imgdata'
import SearchItemWrapper from './searchitemwrapper'
import Highlighter from 'react-highlight-words'
import { useNavigate } from 'react-router-dom'

export default function SearchCollectionItem({query, name, type, subType, owner, progress, percentProgress, collectionId, showOwner=true}) {
    const typeDisplay = type === 'aprimon' && isNaN(parseInt(subType)) ? `${subType.toUpperCase()} Aprimon Collection` : `Gen ${subType} Aprimon Collection`
    const navigate = useNavigate()
    const sendToCollection = () => {
        navigate(`/collections/${collectionId}`)
    }
    return (
        <SearchItemWrapper onClickFunc={sendToCollection}>
            <Box sx={{width: '80%', height: '100%', display: 'flex', alignItems: 'center', gap: 2}}>
                <Box sx={{ml: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ImgData type='icons' linkKey={type} size={'50px'}/></Box>
                <Box sx={{width: '80%', minWidth: '100px', display: 'flex', flexDirection: 'column'}}>
                    <Typography sx={{fontWeight: 700, fontSize: '16px', textAlign: 'start', my: -0.25}} noWrap><Highlighter textToHighlight={name} searchWords={[query]}/></Typography>
                    <Typography sx={{fontSize: '11px', textAlign: 'start', my: 0, opacity: 0.8}}><Highlighter textToHighlight={typeDisplay} searchWords={[query]}/></Typography>
                    {showOwner && <Typography sx={{fontSize: '11px', textAlign: 'start', my: -0.25, opacity: 0.8}}>Owned by <Highlighter textToHighlight={owner} searchWords={[query]}/></Typography>}
                </Box>
            </Box>
            <Box sx={{width: '20%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'end', gap: 0.5}}>
                <Typography sx={{textAlign: 'center', fontWeight: 700, fontSize: '14px', width: '50%'}}>{progress}</Typography>
                <Box sx={{width: '50%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Box sx={{position: 'relative', width: '45px', height: '45px'}}>
                    <CircularProgress sx={{position: 'absolute', opacity: 0.2, top: 0, right: 0}} variant='determinate' value={100} size={45}/>
                    <CircularProgress sx={{position: 'absolute', top: 0, right: 0}} variant='determinate' value={percentProgress} size={45}/>
                    <Typography sx={{fontSize: '12px', width: '32px', fontWeight: 700, position: 'absolute', top: '14.25px', right: '6.25px'}}>{Math.round(percentProgress)}%</Typography>
                    </Box>
                </Box>
            </Box>
        </SearchItemWrapper>
    )
}