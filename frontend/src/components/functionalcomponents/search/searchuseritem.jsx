import {Box, Typography, useTheme, CircularProgress} from '@mui/material'
import ImgData from '../../collectiontable/tabledata/imgdata'
import SearchItemWrapper from './searchitemwrapper'
import Highlighter from 'react-highlight-words'
import { useNavigate } from 'react-router-dom'
import { capitalizeFirstLetter } from '../../../../utils/functions/misc'

const badgeData = {
    'apri-novice' : {display: 'Aprimon Novice', tooltip: 'Start an aprimon collection'},
    'apri-amateur' : {display: 'Aprimon Amateur', tooltip: 'Complete 25% or more of an aprimon collection'},
    'apri-enthusiast' : {display: 'Aprimon Enthusiast', tooltip: 'Complete 50% or more of an aprimon collection'},
    'apri-expert' : {display: 'Aprimon Expert', tooltip: 'Complete 75% or more of an aprimon collection'},
    'apri-master' : {display: 'Aprimon Master', tooltip: 'Complete an aprimon collection'},
    'apri-multigen' : {display: 'Multi-Generational Master', tooltip: 'Complete multiple aprimon collections'},
    'trader-new' : {display: 'New Trader', tooltip: 'Complete a trade'},
    'trader-aspiring' : {display: 'Aspiring Trader', tooltip: 'Complete 5 trades'},
    'trader-avid' : {display: 'Avid Trader', tooltip: 'Complete 10 trades'},
    'trader-experienced' : {display: 'Experienced Trader', tooltip: 'Complete 25 trades'},
    'trader-veteran' : {display: 'Veteran Trader', tooltip: 'Complete 50 trades'},
    'trader-breeder' : {display: 'Pokémon Breeder', tooltip: 'Complete 100 or more trades'},
}

export default function SearchUserItem({query, username, collectionsInfo, userId, badges, userAccountType}) {
    const theme = useTheme()
    const aprimonCollectionCount = collectionsInfo.filter(cType => cType === 'aprimon').length
    const navigate = useNavigate()
    // const otherCollectionCount = collectionsInfo.filter(cInfo => cInfo.type !== 'aprimon').length
    const sendToUser = () => {
        navigate(`/users/${username}`)
    }

    return (
        <SearchItemWrapper onClickFunc={sendToUser}>
            <Box sx={{width: '80%', height: '100%', display: 'flex', alignItems: 'center', gap: 2}}>
                <Box sx={{ml: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ImgData type='icons' linkKey='user' size={'45px'}/></Box>
                <Box sx={{width: '80%', minWidth: '100px', display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start'}}>
                        <Typography sx={{fontWeight: 700, fontSize: '16px', textAlign: 'start', my: -0.25}}><Highlighter textToHighlight={username} searchWords={[query]}/></Typography>
                        {userAccountType !== 'regular' && <Typography sx={{paddingX: 1, fontWeight: 700, ml: 1, borderRadius: '20px', fontSize: '10px', color: 'white', backgroundColor: 'black'}}>{capitalizeFirstLetter(userAccountType)}</Typography>}
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start'}}>
                        {badges.map((b, idx) => {
                            const display = badgeData[b].display
                            return (
                                <Typography sx={{fontSize: '11px', textAlign: 'start', my: 0, opacity: 0.8, mr: idx !== badges.length-1 ? 0.5 : 0}} key={`${username}-${display}-badge`}>
                                    {idx !== 0 && ' - '}{display}
                                </Typography> 
                            )
                        })}
                        {badges.length === 0 && 
                            <Typography sx={{fontSize: '11px', textAlign: 'start', my: 0, opacity: 0.8}}>
                                <i>No Badges</i>
                            </Typography> 
                        }
                    </Box>
                    <Typography sx={{fontSize: '11px', textAlign: 'start', my: -0.25, opacity: 0.8}}>{aprimonCollectionCount} aprimon collections</Typography>
                </Box>
            </Box>
        </SearchItemWrapper>
    )
}