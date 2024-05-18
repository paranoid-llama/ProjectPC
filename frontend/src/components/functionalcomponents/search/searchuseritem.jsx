import {Box, Typography, useTheme, CircularProgress} from '@mui/material'
import ImgData from '../../collectiontable/tabledata/imgdata'
import SearchItemWrapper from './searchitemwrapper'
import Highlighter from 'react-highlight-words'

export default function SearchUserItem({query, username, collectionsInfo}) {
    const aprimonCollectionCount = collectionsInfo.filter(cType => cType === 'aprimon').length
    // const otherCollectionCount = collectionsInfo.filter(cInfo => cInfo.type !== 'aprimon').length
    return (
        <SearchItemWrapper>
            <Box sx={{width: '80%', height: '100%', display: 'flex', alignItems: 'center', gap: 2}}>
                <Box sx={{ml: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ImgData type='icons' linkKey='user' size={'45px'}/></Box>
                <Box sx={{width: '80%', minWidth: '100px', display: 'flex', flexDirection: 'column'}}>
                    <Typography sx={{fontWeight: 700, fontSize: '16px', textAlign: 'start', my: -0.25}}><Highlighter textToHighlight={username} searchWords={[query]}/></Typography>
                    <Typography sx={{fontSize: '11px', textAlign: 'start', my: 0, opacity: 0.8}}>(tag area - still not implemented)</Typography>
                    <Typography sx={{fontSize: '11px', textAlign: 'start', my: -0.25, opacity: 0.8}}>{aprimonCollectionCount} aprimon collections</Typography>
                </Box>
            </Box>
        </SearchItemWrapper>
    )
}