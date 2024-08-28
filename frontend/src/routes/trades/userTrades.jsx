import {Box, Typography, useTheme, ToggleButtonGroup, ToggleButton, Select, MenuItem} from '@mui/material'
import { useState } from 'react'
import { useLoaderData, useRouteLoaderData, useNavigate } from 'react-router'
import MultipleStopIcon from '@mui/icons-material/MultipleStop'
import ImgData from '../../components/collectiontable/tabledata/imgdata'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import ControlledTextInput from '../../components/functionalcomponents/controlledtextinput'
import SearchItemWrapper from '../../components/functionalcomponents/search/searchitemwrapper'

const findOtherParticipantQuery = (trade, currUser, query) => {
    const otherUser = trade.users.filter(uD => uD.username !== currUser)[0].username
    return otherUser.toLowerCase().includes(query)
} 

export default function UserTrades({userAndTheirTradesData}) {
    const theme = useTheme()
    // const userAndTheirTradesData = useLoaderData()
    const navigate = useNavigate()

    const [routeState, setRouteState] = useState({pagination: 1, tradeStatus: [], userSearch: ''})
    const userTradesToDisplay = userAndTheirTradesData.trades.toReversed().filter(trade => routeState.tradeStatus.length === 0 ? true : routeState.tradeStatus.includes(trade.status)).filter(trade => routeState.userSearch === '' ? true : findOtherParticipantQuery(trade, userAndTheirTradesData.user.username, routeState.userSearch))
    const needsPagination = userTradesToDisplay.length > 10
    const displayedUserTrades = needsPagination ? userTradesToDisplay.slice((routeState.pagination-1)*10, routeState.pagination*10) : userTradesToDisplay
    const pagesMax = Math.ceil(userTradesToDisplay.length/10)

    const tradeStatusColors = {
        'initialoffer': {backgroundColor: 'rgb(23, 162, 184)'},
        'counteroffer': {backgroundColor: 'rgb(0, 123, 255)'},
        'rejected': {backgroundColor: 'rgb(220, 53, 69)'},
        'pending': {backgroundColor: 'rgb(252, 139, 0)'},
        'completed': {backgroundColor: 'rgb(40, 167, 69)'},
        'cancelled': {backgroundColor: 'rgb(150, 12, 28)'},
    }

    const tradeStatusDisplay = {
        'initialoffer': 'INITIAL OFFER',
        'counteroffer': 'COUNTER-OFFER',
        'rejected': 'REJECTED',
        'pending': 'PENDING',
        'completed': 'COMPLETED',
        'cancelled': 'CANCELLED'
    }

    const renderPagination = (pageNum) => {
        const isFirstOrLast = pageNum === 1 || pageNum === pagesMax
        const isCurrentPage = pageNum === routeState.pagination
        const currentPageInfo = {
            isStartPage: routeState.pagination < 5,
            isEndPage: routeState.pagination > (pagesMax-4),
            currentPageIsInEdge: (routeState.pagination < 5 || routeState.pagination > (pagesMax-4))
        }
        // const renderFourFromEdges = (page < 5 && pageNum < 6) || (page > (pagesMax-5) && pageNum > (pagesMax-5))
        const renderFourFromEdges = (currentPageInfo.isStartPage && (pageNum < 6) || currentPageInfo.isEndPage && (pageNum > (pagesMax-5)))
        const renderTwoBeside = (!currentPageInfo.currentPageIsInEdge && (pageNum > routeState.pagination-3 && pageNum < routeState.pagination+3))
        const renderThisNumber = isCurrentPage || renderFourFromEdges || renderTwoBeside || isFirstOrLast
        if (renderThisNumber) {
            return 'togglebutton'
        } else {
            const firstOfFirstHalf = routeState.pagination === 4 ? false : routeState.pagination < 5 ? pageNum === 6 : pageNum === 2
            const firstOfLastHalf = pageNum === routeState.pagination+3
            if (firstOfFirstHalf) {
                return 'middle-pages-first-half'
            } else if (firstOfLastHalf) {
                return 'middle-pages-last-half'
            }
        }
    }

    return (
        <BodyWrapper  sx={{...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{...theme.components.box.fullCenterCol, maxWidth: '1200px', width: '100%'}}>
                <Box sx={{maxHeight: '150px', height: '10%', width: '100%', ...theme.components.box.fullCenterRow, justifyContent: 'start', mt: -2, pb: 0.5, borderBottom: '1px solid rgba(100,100,100, 0.5)'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', ml: 5}}>
                        <Typography sx={{fontSize: '32px', fontWeight: 700}}>Your Trades</Typography>
                    </Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, height: '90%', width: '100%'}}>
                    {/* <Box sx={{...theme.components.box.fullCenterCol, height: '580px', width: '20%'}}>

                    </Box> */}
                    <Box sx={{height: '100%', width: '95%', ...theme.components.box.fullCenterCol, justifyContent: 'start', mt: 1, gap: 1}}>
                        <Box sx={{...theme.components.box.fullCenterRow, height: '30%', width: '100%'}}>
                            <Box sx={{...theme.components.box.fullCenterCol, width: '60%', height: '100%'}}>
                                <Typography>Filter by Trade Status</Typography>
                                <ToggleButtonGroup value={routeState.tradeStatus} onChange={(e, newVal) => setRouteState({...routeState, tradeStatus: newVal, pagination: 1})}>
                                    <ToggleButton value='initialoffer' sx={{paddingY: 0, px: 0.5, fontSize: '11px', textTransform: 'none'}}>Initial Offer</ToggleButton>
                                    <ToggleButton value='counteroffer' sx={{paddingY: 0, px: 0.5, fontSize: '11px', textTransform: 'none'}}>Counter Offer</ToggleButton>
                                    <ToggleButton value='rejected' sx={{paddingY: 0, px: 0.5, fontSize: '11px', textTransform: 'none'}}>Rejected</ToggleButton>
                                    <ToggleButton value='pending' sx={{paddingY: 0, px: 0.5, fontSize: '11px', textTransform: 'none'}}>Pending</ToggleButton>
                                    <ToggleButton value='completed' sx={{paddingY: 0, px: 0.5, fontSize: '11px', textTransform: 'none'}}>Completed</ToggleButton>
                                    <ToggleButton value='cancelled' sx={{paddingY: 0, px: 0.5, fontSize: '11px', textTransform: 'none'}}>Cancelled</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                            <Box sx={{...theme.components.box.fullCenterCol, width: '40%', height: '100%'}}>
                                <ControlledTextInput 
                                    textFieldStyles={{'& .MuiInputBase-input': {height: '40%'}}}
                                    textFieldProps={{
                                        label: "User you traded with",
                                    }}
                                    useRegex={true}
                                    customRegex={/^[a-zA-Z0-9\$\(\)\-\_\;\:\'\,\. ]+[a-zA-Z0-9\$\(\)\-\_\;\:\'\,\.]*$/i}
                                    controlInputFunc={(newVal) => setRouteState({...routeState, userSearch: newVal, pagination: 1})}
                                    defaultValue={routeState.userSearch}
                                />
                            </Box>
                        </Box>
                        <Box sx={{height: '70%', ...theme.components.box.fullCenterCol, width: '100%'}}>
                            <Box sx={{height: '580px', ...theme.components.box.fullCenterCol, justifyContent: displayedUserTrades.length === 0 ? 'center' : 'start', width: '100%'}}>
                                {displayedUserTrades.length === 0 ? 
                                <Typography sx={{fontSize: '24px', color: 'grey'}}>
                                    <i>No trades found.</i>
                                </Typography> : 
                                displayedUserTrades.map((tradeData) => {
                                    const bGColor = tradeStatusColors[tradeData.status]
                                    const otherUser = tradeData.users.includes(null) ? '<Deleted User>' : tradeData.users.filter(uD => uD.username !== userAndTheirTradesData.user.username)[0].username
                                    const genDisplay1 = tradeData.gen.includes('-') && tradeData.gen.slice(0, tradeData.gen.indexOf('-'))
                                    const genDisplay2 = tradeData.gen.includes('-') && tradeData.gen.slice(tradeData.gen.indexOf('-')+1)
                                    const genDisplay = tradeData.gen.includes('-') ? (
                                            `${isNaN(parseInt(genDisplay1)) ? genDisplay1.toUpperCase() : `Gen ${genDisplay1}`} - ${isNaN(parseInt(genDisplay2)) ? genDisplay2.toUpperCase() : `Gen ${genDisplay2}`}`
                                        ) : isNaN(parseInt(tradeData.gen)) ? tradeData.gen.toUpperCase() : `Gen ${tradeData.gen}`
                                    const onClickFunc = () => navigate(`/trades/${tradeData._id}`)
                                    return (
                                        <SearchItemWrapper
                                            key={`trade-${tradeData._id}`}
                                            customStyles={{position: 'relative', mt: 0.75}}
                                            customColor={bGColor}
                                            useOpacityHover={true}
                                            onClickFunc={onClickFunc}
                                        >
                                            <Box sx={{...theme.components.box.fullCenterRow, width: '25%', maxWidth: '170px', ml: 2}}>
                                                <ImgData type='icons' linkKey='user' size='40px'/>
                                                <MultipleStopIcon sx={{fontSize: '50px'}}/>
                                                <ImgData type='icons' linkKey='user' size='40px'/>
                                            </Box> 
                                            <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', width: '60%', ml: 1}}>
                                                <Typography sx={{fontSize: '14px', fontWeight: 700}}>
                                                    {`${(tradeData.status === 'completed' || tradeData.status === 'rejected' || tradeData.status === 'cancelled') ? 'T' : 'Ongoing t'}rade with ${otherUser}`}
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
                            {needsPagination && 
                            <Box sx={{...theme.components.box.fullCenterRow, width: '100%', mt: 0.5, position: 'relative', height: '40px'}}>
                                <Box sx={{...theme.components.box.fullCenterCol, width: '100%', position: 'absolute', top: '-10px'}}>
                                    <Box sx={{mt: 0.5, ...theme.components.box.fullCenterRow}}>
                                        {Array.from({length: pagesMax}, (_, i) => i+1).map(pageNum => {
                                            const pagination = renderPagination(pageNum)
                                            const isDots = pagination !== undefined ? pagination.includes('middle-pages') : false
                                            return (
                                                (pagination === 'togglebutton') ? 
                                                <ToggleButton 
                                                    key={`user-trades-page-${pageNum}`} 
                                                    onClick={(e, newVal) => setRouteState({...routeState, pagination: newVal})}
                                                    value={pageNum}
                                                    selected={pageNum === routeState.pagination}
                                                    sx={{
                                                        borderRadius: '50%', 
                                                        border: 'none', 
                                                        mx: 1, 
                                                        px: 2, 
                                                        my: 1, 
                                                        py: 0.5
                                                    }}
                                                >
                                                    {pageNum}
                                                </ToggleButton> :
                                                isDots &&
                                                <Typography key={`${searchType}-search-${pagination}`} sx={{px: 2}}>...</Typography>
                                            )
                                        })}
                                    </Box>
                                    <Box sx={{width: '100%', ...theme.components.box.fullCenterRow, mt: 0.5}}>
                                        <Typography sx={{fontSize: '12px'}}>Jump to Page:</Typography>
                                        <Select sx={{'& .MuiSelect-select': {py: 0, paddingLeft: 1}, mx: 1}} value={routeState.pagination} onChange={(e, newVal) => setRouteState({...routeState, pagination: newVal.props.value})}>
                                            {Array.from({length: pagesMax}, (_, i) => i+1).map(pageNum => {
                                                return (
                                                    <MenuItem key={`page-${pageNum}-select`} value={pageNum}>{pageNum}</MenuItem>
                                                )
                                            })}
                                        </Select>
                                    </Box>
                                </Box>
                            </Box>
                            }
                        </Box>
                    </Box>
                </Box>
            </Box>
        </BodyWrapper>
    )
}