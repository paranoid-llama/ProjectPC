import {Box, Typography, useTheme, Button, ToggleButton, Select, MenuItem, CircularProgress} from '@mui/material'
import { useState, useTransition } from 'react'
import SearchCollectionItem from './searchcollectionitem'
import SearchUserItem from './searchuseritem'
import DotWaitingText from '../dotwaitingtext'
import { getBallProgress } from '../../../../utils/functions/ballprogresscircle/ballprogressstate'

export default function SearchAreaRoute({query, searchType, result, page, changePage, changeSearchType, changingPage, searching}) {
    //currently not using the changingPage variable as queries are fast. consider changing this later on. 
    const theme = useTheme()
    // const [page, setPage] = useState(1)

    const searchingCollections = searchType === 'all' || searchType === 'collections'
    const searchingUsers = searchType === 'all' || searchType === 'users'
    const searchingAll = searchType === 'all'

    const noCollections = result.collectionCount === 0
    const noUsers = result.userCount === 0
    const noResults = noUsers && noCollections
    const resultCount = searchType === 'collections' ? result.collectionCount : searchType === 'users' ? result.userCount : undefined
    const pagesMax = !searchingAll && Math.ceil(resultCount/10)

    const renderResults = (resultType, resultArr) => {
        if (resultType === 'collections') {
            return resultArr.map((collection, idx) => {
                const percentProgress = Math.round((parseInt(collection.progress)/parseInt(collection.progress.slice(collection.progress.indexOf('/')+1)))*100)
                return (
                    <SearchCollectionItem 
                        key={`collection-search-result-${idx+1}`}
                        query={query}
                        name={collection.name}
                        type={collection.type}
                        subType={collection.gen}
                        owner={collection.owner[0].username}
                        progress={collection.progress}
                        percentProgress={percentProgress}
                        collectionId={collection._id}
                    />
                )
            })
        } else {
            return resultArr.map((user, idx) => {
                const collectionsInfo = user.collections.map(col => col.type)
                return (
                    <SearchUserItem 
                        key={`user-search-result-${idx+1}`}
                        query={query}
                        username={user.username}
                        collectionsInfo={collectionsInfo}
                        userId={user._id}
                        badges={user.settings.profile.badges}
                        userAccountType={user.accountType}
                    />
                )
            })
        }
    }

    const renderPagination = (pageNum) => {
        const isFirstOrLast = pageNum === 1 || pageNum === pagesMax
        const isCurrentPage = pageNum === page
        const currentPageInfo = {
            isStartPage: page < 5,
            isEndPage: page > (pagesMax-4),
            currentPageIsInEdge: (page < 5 || page > (pagesMax-4))
        }
        // const renderFourFromEdges = (page < 5 && pageNum < 6) || (page > (pagesMax-5) && pageNum > (pagesMax-5))
        const renderFourFromEdges = (currentPageInfo.isStartPage && (pageNum < 6) || currentPageInfo.isEndPage && (pageNum > (pagesMax-5)))
        const renderTwoBeside = (!currentPageInfo.currentPageIsInEdge && (pageNum > page-3 && pageNum < page+3))
        const renderThisNumber = isCurrentPage || renderFourFromEdges || renderTwoBeside || isFirstOrLast
        if (renderThisNumber) {
            return 'togglebutton'
        } else {
            const firstOfFirstHalf = page === 4 ? false : page < 5 ? pageNum === 6 : pageNum === 2
            const firstOfLastHalf = pageNum === page+3
            if (firstOfFirstHalf) {
                return 'middle-pages-first-half'
            } else if (firstOfLastHalf) {
                return 'middle-pages-last-half'
            }
        }
    }

    return (
        <>
        <Box sx={{width: '80%', minHeight: '600px', mt: 2}}>
            
            <Box sx={{maxWidth: '800px', display: 'flex', alignItems: 'center', mb: 3, position: 'relative'}}>
            {(!searchingAll && !noResults && !searching) && 
                <Typography sx={{fontSize: '12px', color: 'grey', position: 'absolute'}}>
                    <i>
                        {query === '' ?  `Showing all ${searchType}` : `${resultCount} result${resultCount === 1 ? '' : 's'} found` }
                    </i>
                </Typography>}
            </Box>
            {searching &&
                <> 
                    <Box sx={{...theme.components.box.fullCenterCol, width: '100%', height: '50px', mt: 10}}>
                        <Typography sx={{color: 'grey', mb: 2}}>
                        <i>
                            Searching<DotWaitingText/>
                        </i>
                        </Typography>
                        <CircularProgress/>
                    </Box>
                </>
            }
            {(searchingCollections && !noCollections && !searching) &&
            <>
                {searchingAll && 
                <Box sx={{width: '100%', height: '50px', ...theme.components.box.fullCenterRow}}>
                    <Typography sx={{fontSize: '24px', fontWeight: 700}}>Collections</Typography>
                </Box>}
                <Box sx={{...theme.components.box.fullCenterCol, gap: 1}}>
                    {renderResults('collections', result.collections)}
                </Box>
                {searchingAll && 
                <Box sx={{width: '100%', height: '25px', ...theme.components.box.fullCenterRow, mt: 2}}>
                    {result.collectionCount <= 5 ? <Typography sx={{color: 'grey'}}><i>No other collections</i></Typography> : <Button onClick={() => changeSearchType('collections')}>See More Collections</Button>}
                </Box>}
            </>
            }
            {(searchingUsers && !noUsers && !searching) && 
            <>
                {searchingAll && 
                <Box sx={{width: '100%', height: '50px', ...theme.components.box.fullCenterRow, mt: (searchingCollections && result.collectionCount !== 0) ? 4 : 0}}>
                    <Typography sx={{fontSize: '24px', fontWeight: 700}}>Users</Typography>
                </Box>}
                <Box sx={{...theme.components.box.fullCenterCol, gap: 1}}>
                    {renderResults('users', result.users)}
                </Box>
                {searchingAll && 
                <Box sx={{width: '100%', height: '25px', ...theme.components.box.fullCenterRow, mt: 2}}>
                    {result.userCount <= 5 ? <Typography sx={{color: 'grey'}}><i>No other users</i></Typography> : <Button onClick={() => changeSearchType('users')}>See More Users</Button>}
                </Box>}
            </>
            }
            {(noResults && !searching) &&
                <Box sx={{width: '100%', height: '50px', ...theme.components.box.fullCenterRow, mt: 10}}>
                    <Typography sx={{color: 'grey'}}><i>No results found</i></Typography>
                </Box>
            }
            
        </Box>
        {(!(searchingAll) && resultCount > 10) &&
        <Box sx={{width: '100%', ...theme.components.box.fullCenterCol}}>
            <Box sx={{maxWidth: '800px', mt: 2, ...theme.components.box.fullCenterRow}}>
                {Array.from({length: pagesMax}, (_, i) => i+1).map(pageNum => {
                    const pagination = renderPagination(pageNum)
                    const isDots = pagination !== undefined ? pagination.includes('middle-pages') : false
                    return (
                        (pagination === 'togglebutton') ? 
                        <ToggleButton 
                            key={`${searchType}-search-page-${pageNum}`} 
                            onClick={(e, newVal) => changePage(newVal)}
                            value={pageNum}
                            selected={pageNum === page}
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
                <Select sx={{'& .MuiSelect-select': {py: 0, paddingLeft: 1}, mx: 1}} value={page} onChange={(e, newVal) => changePage(newVal.props.value)}>
                    {Array.from({length: pagesMax}, (_, i) => i+1).map(pageNum => {
                        return (
                            <MenuItem key={`page-${pageNum}-select`} value={pageNum}>{pageNum}</MenuItem>
                        )
                    })}
                </Select>
            </Box>
        </Box>}
        </>
    )
}