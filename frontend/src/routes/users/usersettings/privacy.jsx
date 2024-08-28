import {Box, useTheme, Typography, Tooltip, Checkbox, Grid, Button} from '@mui/material'
import { useContext, useState, forwardRef, useRef } from 'react'
import { useRouteLoaderData, useOutletContext } from 'react-router'
import { ErrorContext } from '../../../app/contexts/errorcontext'
import { AlertsContext } from '../../../alerts/alerts-context'
import userSettingsBackendRequest from '../../../../utils/functions/backendrequests/users/settings'
import ImgData from '../../../components/collectiontable/tabledata/imgdata'
import { VirtuosoGrid } from 'react-virtuoso'

const blockedUsersGridComponents = {
    List: forwardRef(({children, ...props}, ref) => (
        <Grid {...props} container ref={ref} spacing={0.5} rowSpacing={1} sx={{width: '100%'}}>
            {children}
        </Grid>
    )),
    Item: forwardRef(({children, ...props}, ref) => (
        <Grid item {...props} xs={6} ref={ref} sx={{height: '50px'}}>
            {children}
        </Grid>
    ))
}

const wrapperStyles = {
    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
    width: '100%',
    height: '50px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: '5px'
}

export default function Privacy({user, revalidate}) {
    const theme = useTheme()
    const {handleError} = useContext(ErrorContext)
    const {addAlert} = useContext(AlertsContext)
    const currentBlockedUsers = user.settings.privacy.blockedUsers

    const [tentativeChanges, setTentativeChanges] = useState({removedBlockedUsers: [], disabledTrades: user.settings.privacy.disabledTrades})
    const changesRef = useRef({disabledTrades: user.settings.privacy.disabledTrades}) //dont need one for blocked users
    const noChangesMade = tentativeChanges.removedBlockedUsers.length === 0 && tentativeChanges.disabledTrades === changesRef.current.disabledTrades

    const removeBlockedUser = (username) => {
        const alreadySetToRemove = tentativeChanges.removedBlockedUsers.includes(username)
        setTentativeChanges({...tentativeChanges, removedBlockedUsers: alreadySetToRemove ? tentativeChanges.removedBlockedUsers.filter(userN => userN !== username) : [...tentativeChanges.removedBlockedUsers, username]})
    }

    const saveChanges = () => {
        if (noChangesMade) {
            addAlert({severity: 'error', timeout: 3, message: 'No changes were made!'})
        } else {
            const newPrivacySettings = {
                blockedUsers: currentBlockedUsers.filter(userN => !tentativeChanges.removedBlockedUsers.includes(userN)),
                disabledTrades: tentativeChanges.disabledTrades
            }
            const backendFunc = async() => await userSettingsBackendRequest('privacy', newPrivacySettings, user.username)
            const successFunc = () => {
                changesRef.current.disabledTrades = newPrivacySettings.disabledTrades
                setTentativeChanges({...tentativeChanges, removedBlockedUsers: []})
                addAlert({severity: 'success', timeout: 3, message: 'Changed Privacy Settings!'})
                revalidate()
            }
            handleError(backendFunc, false, successFunc, () => {})
        }
    }

    const listBlockedUsers = (username) => {
        const toBeRemovedAlready = tentativeChanges.removedBlockedUsers.includes(username)
        const toBeRemovedStyle = toBeRemovedAlready ? {backgroundColor: 'rgb(200, 100, 100)'} : {}
        const hoverStyles = {
            ':hover': {
                boxShadow: '0px 5px 4px -4px rgba(0,0,0,0.2), 0px 5px 5px 0px rgba(0,0,0,0.14), 0px 5px 7px 0px rgba(0,0,0,0.12)',
                cursor: 'pointer',
                backgroundColor: toBeRemovedAlready ? 'grey' : 'rgb(240,150,150)'
            }
        }
        return (
            <Box sx={{backgroundColor: 'grey', position: 'relative', ...wrapperStyles, ...hoverStyles, ...toBeRemovedStyle}} onClick={() => removeBlockedUser(username)}>
                <Box sx={{width: '80%', height: '100%', display: 'flex', alignItems: 'center', gap: 2}}>
                    <Box sx={{ml: 1.5, display: 'flex', justifyContent: 'center', alignItems: 'center'}}><ImgData type='icons' linkKey='user' size={'40px'}/></Box>
                    <Box sx={{width: '80%', minWidth: '100px', display: 'flex', flexDirection: 'column'}}>
                        <Typography sx={{fontWeight: 700, fontSize: '16px', textAlign: 'start', my: -0.25}}>{username}</Typography>
                    </Box>
                    {toBeRemovedAlready &&
                        <Typography sx={{fontSize: '12px', position: 'absolute', bottom: '0px', right: '4px'}}>Unblocked</Typography>
                    }
                </Box>
            </Box>
        )
    }

    return (
        <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: '90%', height: '100%', margin: 2, position: 'relative'}}>
            {!noChangesMade && <Typography sx={{fontSize: '12px', color: 'grey', position: 'absolute', top: -12}}>You have unsaved changes</Typography>}
            <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'center', width: '100%', mt: 1}}>
                <Tooltip arrow title='Check this box to stop anyone from offering you a trade from any collection.'>
                    <Typography sx={{fontSize: '18px', mx: 1, fontWeight: 700, ':hover': {cursor: 'pointer'}}}>Disable Trade Offers:</Typography>
                </Tooltip>
                <Checkbox 
                    checked={tentativeChanges.disabledTrades}
                    onChange={(e) => setTentativeChanges({...tentativeChanges, disabledTrades: !tentativeChanges.disabledTrades})}
                />
            </Box>
            <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'center', width: '100%', mt: 4}}>
                <Typography sx={{fontSize: '18px', fontWeight: 700}}>Blocked Users:</Typography>
                <Typography sx={{fontSize: '12px'}}>Blocked users are unable to send you trade offers. You can block users by going to their profile and clicking the block icon.</Typography>
                <VirtuosoGrid 
                    style={{height: '300px', width: '100%'}}
                    components={blockedUsersGridComponents}
                    totalCount={currentBlockedUsers.length}
                    itemContent={(idx) => listBlockedUsers(currentBlockedUsers[idx])}
                />
            </Box>
            <Button sx={{mt: 2, position: 'absolute', bottom: 0}} onClick={saveChanges}>Save Changes</Button>
        </Box>
    )
}