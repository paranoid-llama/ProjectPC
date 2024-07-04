import {Box, Typography, useTheme} from '@mui/material'
import { useLoaderData, useRouteLoaderData, useNavigate } from 'react-router'
import MultipleStopIcon from '@mui/icons-material/MultipleStop'
import ImgData from '../../components/collectiontable/tabledata/imgdata'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import SearchItemWrapper from '../../components/functionalcomponents/search/searchitemwrapper'

export default function UserTrades({}) {
    const theme = useTheme()
    const userAndTheirTradesData = useLoaderData()
    const navigate = useNavigate()

    const tradeStatusColors = {
        'initialoffer': {backgroundColor: 'rgb(23, 162, 184)'},
        'counteroffer': {backgroundColor: 'rgb(0, 123, 255)'},
        'rejected': {backgroundColor: 'rgb(220, 53, 69)'},
        'pending': {backgroundColor: 'rgb(252, 139, 0)'},
        'completed': {backgroundColor: 'rgb(40, 167, 69)'}
    }

    const tradeStatusDisplay = {
        'initialoffer': 'INITIAL OFFER',
        'counteroffer': 'COUNTER-OFFER',
        'rejected': 'REJECTED',
        'pending': 'PENDING',
        'completed': 'COMPLETED'
    }

    return (
        <BodyWrapper  sx={{...theme.components.box.fullCenterCol}}>
            <Box sx={{...theme.components.box.fullCenterCol, maxWidth: '1200px', width: '100%'}}>
                <Box sx={{maxHeight: '150px', height: '10%', width: '100%', ...theme.components.box.fullCenterRow, justifyContent: 'start', mt: -2, pb: 2, borderBottom: '1px solid rgba(100,100,100, 0.5)'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', ml: 5}}>
                        <Typography sx={{fontSize: '32px', fontWeight: 700}}>Your Trades</Typography>
                    </Box>
                </Box>
                <Box sx={{height: '650px', width: '90%', ...theme.components.box.fullCenterCol, justifyContent: 'start', mt: 1, gap: 1}}>
                    {userAndTheirTradesData.trades.map((tradeData) => {
                        const bGColor = tradeStatusColors[tradeData.status]
                        const otherUser = tradeData.users.filter(uD => uD.username !== userAndTheirTradesData.user.username)[0].username
                        const genDisplay1 = tradeData.gen.includes('-') && tradeData.gen.slice(0, tradeData.gen.indexOf('-'))
                        const genDisplay2 = tradeData.gen.includes('-') && tradeData.gen.slice(tradeData.gen.indexOf('-')+1)
                        const genDisplay = tradeData.gen.includes('-') ? (
                                `${isNaN(parseInt(genDisplay1)) ? genDisplay1.toUpperCase() : `Gen ${genDisplay1}`} - ${isNaN(parseInt(genDisplay2)) ? genDisplay2.toUpperCase() : `Gen ${genDisplay2}`}`
                            ) : isNaN(parseInt(tradeData.gen)) ? tradeData.gen.toUpperCase() : `Gen ${tradeData.gen}`
                        const onClickFunc = () => navigate(`/trades/${tradeData._id}`)
                        return (
                            <SearchItemWrapper
                                key={`trade-${tradeData._id}`}
                                customStyles={{position: 'relative'}}
                                customColor={bGColor}
                                useOpacityHover={true}
                                onClickFunc={onClickFunc}
                            >
                                <Box sx={{...theme.components.box.fullCenterRow, width: '25%', maxWidth: '170px', ml: 2}}>
                                    <ImgData type='icons' linkKey='user' size='40px'/>
                                    <MultipleStopIcon sx={{fontSize: '50px'}}/>
                                    <ImgData type='icons' linkKey='user' size='40px'/>
                                </Box> 
                                <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', width: '60%'}}>
                                    <Typography sx={{fontSize: '14px', fontWeight: 700}}>
                                        {`${(tradeData.status === 'completed' || tradeData.status === 'rejected') ? 'T' : 'Ongoing t'}rade with ${otherUser}`}
                                    </Typography>
                                    <Typography sx={{fontSize: '12px'}}>
                                        {genDisplay} Trade
                                    </Typography>
                                </Box>
                                <Box sx={{position: 'absolute', right: '5px', top: '0px'}}>
                                    <Typography sx={{fontSize: '12px', fontWeight: 700}}>{tradeStatusDisplay[tradeData.status]}</Typography>
                                </Box>
                                <Box sx={{position: 'absolute', right: '5px', bottom: '0px', ...theme.components.box.fullCenterCol}}>
                                    <Typography sx={{fontSize: '10px', fontWeight: 400}}>Opened: {tradeData.createdAt.slice(0, 10)}</Typography>
                                    {tradeData.closeDate !== undefined && 
                                        <Typography sx={{fontSize: '10px', fontWeight: 400}}>Closed: {tradeData.closeDate.slice(0, 10)}</Typography>}
                                </Box>
                            </SearchItemWrapper>
                        )
                    })}
                </Box>
            </Box>
        </BodyWrapper>
    )
}