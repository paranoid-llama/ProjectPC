import {Box, useTheme, Typography, Button} from '@mui/material'
import ControlledTextInput from '../../../components/functionalcomponents/controlledtextinput'
import { useNavigate } from 'react-router'
import { useContext, useState, useEffect, useRef } from 'react'
import { AlertsContext } from '../../../alerts/alerts-context'
import { ErrorContext } from '../../../app/contexts/errorcontext'
import { useRouteLoaderData, useOutletContext } from 'react-router'
import ConfirmDecisionModal from '../../../components/functionalcomponents/confirmdecisionmodal'
import changePassword from '../../../../utils/functions/backendrequests/users/changepassword'
import deleteUserAccount from '../../../../utils/functions/backendrequests/users/deleteaccount'
import checkPasswordRequest from '../../../../utils/functions/backendrequests/users/checkpassword'

export default function Account({user, revalidate}) {
    const theme = useTheme()
    const {handleError} = useContext(ErrorContext)
    const {addAlert} = useContext(AlertsContext)
    const navigate = useNavigate()
    const deleteConfirmPasswordRef = useRef(null)
    const [newPasswordError, setNewPasswordError] = useState({password: '', currPassword: '', confirmPassword: '', passwordFocused: false, isError: false, confirmPasswordError: false, currentPasswordError: false, eightChars: false, oneUpper: false, oneLower: false, oneNumber: false, passwordsMatch: 'none', savePending: false})
    const [confirmDeleteAcc, setConfirmDeleteAcc] = useState({open: false, confirmedPassword: false, passwordError: false, password: '', error: false})
    const textFieldStyles = {
        '&.MuiTextField-root': {
            width: '60%'
        },
        '& .MuiInputBase-input': {
            padding: 0.5,
            width: '100%',
        }, 
        mx: 1,
        '& .MuiOutlinedInput-root': {
            width: '100%',
            '& fieldset': {

            },
            '&:hover fieldset': {

            },
            '& .Mui-focused': {

            }
        }
    }

    const passwordSpecificationsTextColor = (state) => {
        return {color: (newPasswordError.passwordFocused || state) ? state ? 'green' : 'red' : 'grey'}
    }

    const handlePasswordChange = (newValue) => {
        const oneLower = /[a-z]/.test(newValue)
        const oneUpper = /[A-Z]/.test(newValue)
        const oneNumber = /[0-9]/.test(newValue)
        setNewPasswordError({...newPasswordError, password: newValue, eightChars: newValue.length >= 8, oneUpper, oneLower, oneNumber})
    }

    const handleCurrChange = (newValue) => {setNewPasswordError({...newPasswordError, currPassword: newValue})}
    const handleConfirmChange = (newValue) => {setNewPasswordError({...newPasswordError, confirmPassword: newValue})}

    const checkIfPasswordsMatch = () => {
        if (newPasswordError.password !== newPasswordError.confirmPassword) {
            setNewPasswordError({...newPasswordError, confirmPasswordError: true, passwordsMatch: false})
        } else {
            setNewPasswordError({...error, passwordsMatch: true})
        }
    }

    const savePasswordChanges = () => {
        const passwordFitsRequirements = newPasswordError.eightChars && newPasswordError.oneLower && newPasswordError.oneUpper && newPasswordError.oneNumber
        const passwordsMatch = newPasswordError.password === newPasswordError.confirmPassword
        const currPasswordIsSameAsNew = newPasswordError.currPassword === newPasswordError.password
        if (!passwordFitsRequirements || !passwordsMatch || currPasswordIsSameAsNew) {
            addAlert({severity: 'error', timeout: 3, message: !passwordFitsRequirements ? 'Password did not fit requirements!' : currPasswordIsSameAsNew ? 'The new password is the same as the old one!' : "Confirm password field didn't match the password!"})
        } else {
            const backendFunc = async() => await changePassword(user.username, newPasswordError.currPassword, newPasswordError.password)
            const successFunc = () => {
                setNewPasswordError({password: '', currPassword: '', confirmPassword: '', passwordFocused: false, isError: false, confirmPasswordError: false, currentPasswordError: false, eightChars: false, oneUpper: false, oneLower: false, oneNumber: false, passwordsMatch: 'none', savePending: false})
                addAlert({severity: 'success', timeout: 3, message: 'Changed your password!'})
            }
            const errorFunc = (errorData) => {
                if (errorData.status === 403) {//indicates current password input was wrong
                    setNewPasswordError({...newPasswordError, currPassword: '', currentPasswordError: true})
                }
            }
            handleError(backendFunc, false, successFunc, errorFunc)
        }
    }

    const toggleConfirmDeleteModal = () => {setConfirmDeleteAcc({...confirmDeleteAcc, open: !confirmDeleteAcc.open})}
    const confirmPasswordBeforeDelete = () => {
        const backendFunc = async() => await checkPasswordRequest(user.username, deleteConfirmPasswordRef.current.value)
        const successFunc = () => {
            setConfirmDeleteAcc({...confirmDeleteAcc, confirmedPassword: true, password: deleteConfirmPasswordRef.current.value})
        }
        const errorFunc = (errorData) => {
            if (errorData.status === 403) {
                setConfirmDeleteAcc({...confirmDeleteAcc, passwordError: true})
            } else {
                setConfirmDeleteAcc({...confirmDeleteAcc, error: true, errorData})
            }
        }
        handleError(backendFunc, false, successFunc, errorFunc)
    }

    const deleteAccount = () => {
        const backendFunc = async() => await deleteUserAccount(user.username, confirmDeleteAcc.password)
        const successFunc = () => {
            navigate('/')
            addAlert({severity: 'error', timeout: 8, message: 'Successfully deleted your account!'})
        }
        const errorFunc = (errorData) => {
            setConfirmDeleteAcc({...confirmDeleteAcc, error: true, errorData})
        }
        handleError(backendFunc, false, successFunc, errorFunc)
    }

    const generatePasswordCheck = () => {
        return (
            <>
                <Typography sx={{fontSize: '20px', textAlign: 'center', mb: 3}}>Please confirm your password before proceeding:</Typography>
                <ControlledTextInput 
                    textFieldStyles={{
                        ...textFieldStyles, 
                        '& .MuiInputBase-root': {
                            border: '1px solid white', 
                            color: 'white'
                        }, 
                        '& .MuiInputBase-input': {
                            padding: 0.5,
                            width: '100%', 
                            border: 'none'
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white'
                            },
                            '&:hover fieldset': {
                                borderColor: '#1976d2'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: 'white'
                        },
                        '& .MuiInputBase-inputSizeSmall': {
                            color: 'white'
                        }
                    }}
                    textFieldProps={{
                        inputRef: deleteConfirmPasswordRef,
                        InputProps: {type: 'password'},
                        error: confirmDeleteAcc.passwordError,
                        onFocus: () => setConfirmDeleteAcc({...confirmDeleteAcc, passwordError: false}),
                    }}
                    charLimit={60}
                    useExpandedRegex={true}
                    
                />
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'start', justifyContent: 'end', mt: 0.5, width: '100%', height: '7%', position: 'relative'}}>
                    {confirmDeleteAcc.passwordError && 
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', width: '80%', height: '100%', position: 'absolute', top: '-5px'}}>
                        <Typography sx={{color: 'red', fontSize: '12px'}}>Password is incorrect!</Typography> 
                    </Box>}
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, mt: 0.5}}>
                    <Button sx={{mr: 2}} variant='contained' onClick={toggleConfirmDeleteModal}>Close</Button>
                    <Button sx={{ml: 2}}  variant='contained' onClick={confirmPasswordBeforeDelete}>Confirm</Button>
                </Box>
            </>
        )
    }

    const generateErrorSection = () => {
        return (
            <>
            <Typography sx={{fontSize: '24px', textAlign: 'center'}}>ERROR {confirmDeleteAcc.errorData.status}: {confirmDeleteAcc.errorData.name}</Typography>
            <Typography sx={{mt: 1, textAlign: 'center'}}>
                {confirmDeleteAcc.errorData.message}
            </Typography>
            <Typography sx={{mt: 1, textAlign: 'center'}}>
                Try again later!
            </Typography>
            </>
        )
    } 

    return (
        <Box sx={{...theme.components.box.fullCenterCol, justifyContent: 'start', width: '90%', height: '100%', margin: 2, position: 'relative'}}>
            <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'start', width: '100%', mt: 1}}>
                <Typography sx={{fontSize: '18px', mr: 3, mt: 2}}>Email: <b>{user.email.slice(0, 2)}************{user.email.slice(user.email.indexOf('@'), user.email.length)}</b></Typography>
            </Box>
            <Box sx={{...theme.components.box.fullCenterCol, width: '100%', mt: 4}}>
                <Typography sx={{fontSize: '18px', fontWeight: 700}}>Change Password:</Typography>
                <Box sx={{...theme.components.box.fullCenterRow, width: '90%', mt: 1}}>
                    <Typography sx={{width: '40%', fontSize: '14px'}}>Current Password:</Typography>
                    <ControlledTextInput 
                        textFieldStyles={textFieldStyles}
                        textFieldProps={{
                            InputProps: {type: 'password'},
                            error: newPasswordError.currentPasswordError,
                            onFocus: () => setNewPasswordError({...newPasswordError, currentPasswordError: false}),
                        }}
                        charLimit={60}
                        useExpandedRegex={true}
                        controlInputFunc={handleCurrChange}
                        defaultValue={newPasswordError.currPassword}
                    />
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, width: '90%', mt: 1}}>
                    <Typography sx={{width: '40%', fontSize: '14px'}}>New Password:</Typography>
                    <ControlledTextInput 
                        textFieldStyles={textFieldStyles}
                        textFieldProps={{
                            InputProps: {type: 'password'},
                            error: newPasswordError.isError,
                            onFocus: () => setNewPasswordError({...newPasswordError, isError: false, passwordFocused: true}),
                            onBlur: () => setNewPasswordError({...newPasswordError, passwordFocused: false})
                        }}
                        charLimit={60}
                        useExpandedRegex={true}
                        controlInputFunc={handlePasswordChange}
                        defaultValue={newPasswordError.password}
                    />
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'start', justifyContent: 'end', mt: 1, width: '100%', height: '30%'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', width: '60%', height: '100%', color: 'grey'}}>
                        <Typography sx={{fontSize: '12px', ml: 2, my: -0.25}}>Password must: </Typography>
                        <Typography sx={{fontSize: '12px', ml: 2, my: -0.25, ...passwordSpecificationsTextColor(newPasswordError.eightChars)}}>-  Be minimum 8 characters long</Typography>
                        <Typography sx={{fontSize: '12px', ml: 2, my: -0.25, ...passwordSpecificationsTextColor(newPasswordError.oneUpper)}}>-  Contain one upper-case letter</Typography>
                        <Typography sx={{fontSize: '12px', ml: 2, my: -0.25, ...passwordSpecificationsTextColor(newPasswordError.oneLower)}}>-  Contain one lower-case letter</Typography>
                        <Typography sx={{fontSize: '12px', ml: 2, my: -0.25, ...passwordSpecificationsTextColor(newPasswordError.oneNumber)}}>-  Contain one number</Typography>
                    </Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, width: '90%', mt: 1}}>
                    <Typography sx={{width: '40%', fontSize: '14px'}}>Confirm New Password:</Typography>
                    <ControlledTextInput 
                        textFieldStyles={textFieldStyles}
                        textFieldProps={{
                            InputProps: {type: 'password'},
                            error: newPasswordError.confirmPasswordError,
                            onFocus: () => setNewPasswordError({...newPasswordError, confirmPasswordError: false, passwordsMatch: 'none'}),
                            onBlur: checkIfPasswordsMatch
                        }}
                        charLimit={60}
                        useExpandedRegex={true}
                        controlInputFunc={handleConfirmChange}
                        defaultValue={newPasswordError.confirmPassword}
                    />
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'start', justifyContent: 'end', mt: 0.5, width: '100%', height: '10%', position: 'relative'}}>
                    {(newPasswordError.passwordsMatch === false) && 
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', width: '61%', height: '100%', position: 'absolute', top: '5px'}}>
                        <Typography sx={{color: 'red', fontSize: '11px', ml: 2}}>Field does not match password!</Typography> 
                    </Box>}
                </Box>
                <Button sx={{mt: 2}} onClick={savePasswordChanges}>Save Password Changes</Button>
                <Button sx={{backgroundColor: 'rgb(220, 53, 69)', position: 'absolute', bottom: '0px', ':hover': {backgroundColor: 'rgba(220, 53, 69, 0.5)'}}} variant='contained' size='small' onClick={toggleConfirmDeleteModal}>Delete Account</Button>
            </Box>
            <ConfirmDecisionModal 
                text='Are you sure you want to delete your account?'
                subText='Your account and all of your collections will be lost forever!'
                startingSecond={8}
                confirmDecisionFunc={deleteAccount}
                toggleModal={toggleConfirmDeleteModal}
                open={confirmDeleteAcc.open}
                state2={
                    confirmDeleteAcc.error ? generateErrorSection : 
                    !confirmDeleteAcc.confirmedPassword ? generatePasswordCheck : undefined
                }
                pendingTimeout={3}
                noPendingPage={true}
            />
        </Box>
    )
}