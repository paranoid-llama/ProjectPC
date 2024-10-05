import {Box, useTheme, Typography, Button, Alert, Select, MenuItem} from '@mui/material'
import { useState, useRef, useContext } from 'react'
import { ErrorContext } from '../app/contexts/errorcontext'
import { Link, useLocation, useNavigate, useRevalidator } from 'react-router-dom'
import BodyWrapper from '../components/partials/routepartials/bodywrapper'
import ControlledTextInput from '../components/functionalcomponents/controlledtextinput'
// import { useDebounce } from 'use-debounce'
import { backendCheckUsernameAvailability } from '../../utils/functions/backendrequests/users/checkusernameavailability'
import { userRegisterRequest } from '../../utils/functions/backendrequests/users/register'
import DotWaitingText from '../components/functionalcomponents/dotwaitingtext'

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const usernameRegex = /^[a-zA-Z0-9\$\(\)\-\_\;\:\'\,\. ]+[a-zA-Z0-9\$\(\)\-\_\;\:\'\,\.]*$/i
const reservedWordsForUsers = ['login', 'logout', 'settings', 'deleted']
const securityQuestions = [
    "What was your childhood best friend's name?",
    "In which city did your parents meet?",
    "What was the name of your boss at your first job?",
    "In what city were you born?",
    "What is your mother's maiden name?",
    "What was the make of your first car?",
    "What was the name of your elementary school?",
    "What was the name of your childhood pet?",
    "Where did you meet your spouse?",
    "Where did you go the first time you flew on a plane?",
    "What was the name of the first movie you saw in theaters?",
    "What is the name of the street you grew up on?",
    "Who was your favorite film star or character as a child?",
    "What was the first album you purchased?",
    "What was the last name of your favorite elementary school teacher?"
]

export default function RegisterPage({}) {
    const theme = useTheme()
    const {handleError} = useContext(ErrorContext)
    const navigate = useNavigate()
    const location = useLocation()
    const hasCollection = location.state !== null && location.state.collection !== undefined
    const collectionData = hasCollection && location.state.collection

    const [error, setError] = useState({username: false, usernameAvailable: 'none', email: false, emailAvailable: 'none', password: false, passwordFocused: false, confirmPassword: false, passwordsMatch: 'none', error: false, errorMessage: ''}) 
    const [password, setPassword] = useState({value: '', eightChars: false, oneUpper: false, oneLower: false, oneNumber: false})
    const [securityQuestion, setSecurityQuestion] = useState({questionOne: 1, questionTwo: 2, questionThree: 3})
    const [registering, setRegistering] = useState(false)

    const usernameFieldRef = useRef(null)
    const emailFieldRef = useRef(null)
    const passwordRef = useRef(null)
    const confirmPasswordFieldRef = useRef(null)
    const questionOneAns = useRef(null)
    const questionTwoAns = useRef(null)
    const questionThreeAns = useRef(null)

    const textFieldStyles = {
        '&.MuiTextField-root': {
            width: '70%'
        },
        '& .MuiInputBase-input': {
            padding: 0.5,
            width: '100%'
        }, 
        mx: 5,
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

    const checkUsernameAvailability= async() => {
        if (usernameFieldRef.current.value === '') {
            setError({...error, username: false, usernameAvailable: 'none'})
            return
        }
        if (usernameFieldRef.current.value.length < 4) {
            setError({...error, username: true, usernameAvailable: 'notLongEnough'})
            return
        }
        if (usernameFieldRef.current.value[0] === ' ' || usernameFieldRef.current.value[usernameFieldRef.current.value.length-1] === ' ') {
            setError({...error, username: true, usernameAvailable: 'trailingSpace'})
            return
        }
        if (usernameFieldRef.current.value.includes(' ')) {
            const doubleSpaceMatches = [...usernameFieldRef.current.value.matchAll(new RegExp('  ', 'gi'))].length !== 0
            if (doubleSpaceMatches) {
                setError({...error, username: true, usernameAvailable: 'doubleSpace'})
                return
            }
        }
        if (reservedWordsForUsers.includes(usernameFieldRef.current.value.toLowerCase()))  {
            setError({...error, username: true, usernameAvailable: 'reserved'})
            return
        } 
        const backendFunc = async() => {return await backendCheckUsernameAvailability(usernameFieldRef.current.value)}
        const successFunc = (availability) => {
            if (availability.available === false) {
                setError({...error, username: true, usernameAvailable: false})
            } else {
                setError({...error, usernameAvailable: true})
            }
        }
        const errorFunc = () => {setError({...error, username: false, usernameAvailable: 'unknown'})}
        handleError(backendFunc, false, successFunc, errorFunc, true)
    }

    const checkEmailAvailability = async() => {
        if (emailFieldRef.current.value === '') {
            setError({...error, email: false, emailAvailable: 'none'})
            return
        }
        if (!emailRegex.test(emailFieldRef.current.value)) {
            setError({...error, email: true, emailAvailable: 'Invalid'})
            return
        }
        const backendFunc = async() => {return await backendCheckUsernameAvailability(emailFieldRef.current.value, true)}
        const successFunc = (availability) => {
            if (availability.available === false) {
                setError({...error, email: true, emailAvailable: false})
            } else {
                setError({...error, email: false, emailAvailable: 'none'})
            }
        }
        const errorFunc = () => {setError({...error, email: false, emailAvailable: 'unknown'})}
        handleError(backendFunc, false, successFunc, errorFunc, true)
    }

    const handlePasswordChange = (newValue) => {
        const oneLower = /[a-z]/.test(newValue)
        const oneUpper = /[A-Z]/.test(newValue)
        const oneNumber = /[0-9]/.test(newValue)
        setPassword({value: newValue, eightChars: newValue.length >= 8, oneUpper, oneLower, oneNumber})
    }

    const passwordSpecificationsTextColor = (state) => {
        return {color: (error.passwordFocused || state) ? state ? 'green' : 'red' : 'grey'}
    }

    const checkIfPasswordsMatch = () => {
        if (passwordRef.current.value !== confirmPasswordFieldRef.current.value) {
            setError({...error, confirmPassword: true, passwordsMatch: false})
        } else {
            setError({...error, passwordsMatch: true})
        }
    }

    const selectStyles = {
        '& .MuiSelect-select': {width: '100%', fontSize: '12px', paddingY: 0.5, textAlign: 'start'},
        '&.MuiInputBase-root': {width: '70%'}
    }

    const generateSecurityQuestions = (questionNum) => {
        const dataKey = questionNum === 1 ? 'questionOne' : questionNum === 2 ? 'questionTwo' : questionNum === 3 && 'questionThree'
        return (
            <Select value={securityQuestion[dataKey]} sx={selectStyles} onChange={(e, newVal) => changeSecurityQuestion(newVal.props.value, dataKey)}>
                {securityQuestions.map((question, idx) => {
                    const optionNum = idx+1
                    const otherQuestionNums = questionNum === 1 ? ['questionTwo', 'questionThree'] : questionNum === 2 ? ['questionOne', 'questionThree'] : ['questionOne', 'questionTwo']
                    const disabledOption = otherQuestionNums.map((qNum) => securityQuestion[qNum] === optionNum).includes(true)
                    return (
                        <MenuItem disabled={disabledOption} key={`security-question-${questionNum}-option-${optionNum}`} value={optionNum}>{question}</MenuItem>
                    )
                })}
            </Select>
        )
    }

    const changeSecurityQuestion = (newQuestionNum, questionNum) => {
        setSecurityQuestion({...securityQuestion, [questionNum]: newQuestionNum})
    }

    const finalizeRegister = async() => {
        const usernameIsUnique = error.usernameAvailable === true
        const usernameIsLongEnough = usernameFieldRef.current.value.length >= 4
        const isEmail = emailRegex.test(emailFieldRef.current.value)
        const emailIsUnique = error.emailAvailable !== false
        const passwordFitsRequirements = password.eightChars && password.oneLower && password.oneUpper && password.oneNumber
        const passwordsMatch = password.value === confirmPasswordFieldRef.current.value
        const atLeastOneSecurityQuestion = questionOneAns.current.value !== '' || questionTwoAns.current.value !== '' || questionThreeAns.current.value !== ''
        const errorInRegister = !usernameIsUnique || !usernameIsLongEnough || !isEmail || !emailIsUnique || !passwordFitsRequirements || !passwordsMatch || !atLeastOneSecurityQuestion
        if (errorInRegister) {
            const errorKeys = {
                username: !usernameIsUnique || !usernameIsLongEnough,
                email: emailFieldRef.current.value === '' || !isEmail,
                password: !passwordFitsRequirements,
                confirmPassword: !passwordsMatch
            }
            if (!atLeastOneSecurityQuestion) {
                setError({...error, ...errorKeys, error: true, errorMessage: 'You need to answer at least one security question!'})
                return
            }
            setError({...error, ...errorKeys, error: false})
            return
        } else {
            const securityQuestion1 = questionOneAns.current.value === '' ? {} : {secQuestion1: securityQuestions[securityQuestion.questionOne], secAnswer1: questionOneAns.current.value}
            const securityQuestion2 = questionTwoAns.current.value === '' ? {} : {secQuestion2: securityQuestions[securityQuestion.questionTwo], secAnswer2: questionTwoAns.current.value}
            const securityQuestion3 = questionThreeAns.current.value === '' ? {} : {secQuestion3: securityQuestions[securityQuestion.questionThree], secAnswer3: questionThreeAns.current.value}
            const securityQuestionData = {...securityQuestion1, ...securityQuestion2, ...securityQuestion3}
            setRegistering(true)
            const backendFunc = async() => {return await userRegisterRequest(usernameFieldRef.current.value, emailFieldRef.current.value, password.value, securityQuestionData, hasCollection, collectionData)}
            const successFunc = (newUserId) => {
                // navigate('/verify-account', {state: {newUserId, email: emailFieldRef.current.value}})
                setRegistering(false)
                navigate('/login', {state: {success: true, message: `Account created${hasCollection ? ' and added your collection' : ''}!`}})
            }
            handleError(backendFunc, false, successFunc, () => {setRegistering(false)})
        }
    }

    return (
        <BodyWrapper sx={{...theme.components.box.fullCenterCol, justifyContent: 'start'}}>
            <Box sx={{...theme.components.box.fullCenterCol, maxWidth: '800px', minHeight: '700px', width: '80%'}}>
                <Typography sx={{fontWeight: 700, mb: error.error ? 0 : 3, fontSize: '36px'}}>Register</Typography>
                {error.error && 
                <Alert 
                    severity='error' 
                    sx={{
                        marginTop: '5px',
                        pointerEvents: 'all',
                        my: 2
                    }}
                >
                    {error.errorMessage}
                </Alert>}
                <Box sx={{...theme.components.box.fullCenterRow, width: '100%'}}>
                    <Typography sx={{width: '30%', textAlign: 'end'}}>Username:</Typography>
                    <ControlledTextInput 
                        textFieldStyles={textFieldStyles} 
                        textFieldProps={{
                            inputRef: usernameFieldRef,
                            error: error.username,
                            onFocus: () => setError({...error, username: false, usernameAvailable: 'none'}),
                            onBlur: checkUsernameAvailability
                        }}
                        charLimit={24}
                        customRegex={usernameRegex}
                    />
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'start', justifyContent: 'end', mt: 0.5, width: '100%', height: '10%', position: 'relative'}}>
                    {(typeof error.usernameAvailable === 'boolean' || error.usernameAvailable === 'notLongEnough' || error.usernameAvailable === 'reserved' || error.usernameAvailable === 'trailingSpace' || error.usernameAvailable === 'doubleSpace' || error.usernameAvailable === 'unknown') && 
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', width: '70%', height: '100%', position: 'absolute', top: '5px'}}>
                        {error.usernameAvailable === 'notLongEnough' ? 
                            <Typography sx={{color: 'red', fontSize: '12px', ml: 2}}>Username must be at least 4 characters long!</Typography> : 
                        error.usernameAvailable === 'reserved' ? 
                            <Typography sx={{color: 'red', fontSize: '12px', ml: 2}}>{usernameFieldRef.current.value} is a reserved word. Please try another username!</Typography> : 
                        error.usernameAvailable === 'trailingSpace' ? 
                            <Typography sx={{color: 'red', fontSize: '12px', ml: 2}}>Username cannot have leading/trailing empty spaces.</Typography> : 
                        error.usernameAvailable === 'doubleSpace' ? 
                            <Typography sx={{color: 'red', fontSize: '12px', ml: 2}}>Username cannot have multiple adjacent spaces.</Typography> : 
                        error.usernameAvailable === 'unknown' ? 
                            <Typography sx={{color: '#b59d0e', fontSize: '12px', ml: 2}}>Availability unknown!</Typography> : 
                        error.usernameAvailable === true ? 
                            <Typography sx={{color: 'green', fontSize: '12px', ml: 2}}>{usernameFieldRef.current.value} is available!</Typography> : 
                            <Typography sx={{color: 'red', fontSize: '12px', ml: 2}}>{usernameFieldRef.current.value} is taken. Try another username.</Typography> 
                        }
                    </Box>}
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, mt: 3, width: '100%'}}>
                    <Typography sx={{width: '30%', textAlign: 'end'}}>E-mail:</Typography>
                    <ControlledTextInput 
                        textFieldStyles={textFieldStyles} 
                        textFieldProps={{
                            inputRef: emailFieldRef,
                            error: error.email,
                            onFocus: () => setError({...error, email: false, emailAvailable: 'none'}),
                            onBlur: checkEmailAvailability
                        }}
                        useExpandedRegex={true}
                    />
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'start', justifyContent: 'end', mt: 0.5, width: '100%', height: '10%', position: 'relative'}}>
                    {(typeof error.emailAvailable === 'boolean' || error.emailAvailable === 'Invalid' || error.emailAvailable === 'unknown') && 
                        <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', width: '70%', height: '100%', position: 'absolute', top: '5px'}}>
                            {(error.emailAvailable === 'Invalid') && <Typography sx={{color: 'red', fontSize: '12px', ml: 2}}>Invalid e-mail address</Typography>}
                            {(error.emailAvailable === 'unknown') && <Typography sx={{color: '#b59d0e', fontSize: '12px', ml: 2}}>Availability unknown!</Typography>}
                            {(error.emailAvailable === false) && <Typography sx={{color: 'red', fontSize: '12px', ml: 2}}>That e-mail is already taken by another user!</Typography>}
                        </Box>
                    }
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, mt: 3, width: '100%'}}>
                    <Typography sx={{width: '30%', textAlign: 'end'}}>Password:</Typography>
                    <ControlledTextInput 
                        textFieldStyles={textFieldStyles}
                        textFieldProps={{
                            inputRef: passwordRef,
                            InputProps: {type: 'password'},
                            error: error.password,
                            onFocus: () => setError({...error, password: false, passwordFocused: true}),
                            onBlur: () => setError({...error, passwordFocused: false})
                        }}
                        charLimit={60}
                        useExpandedRegex={true}
                        controlInputFunc={handlePasswordChange}
                        defaultValue={password.value}
                    />
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'start', justifyContent: 'end', mt: 0.5, width: '100%', height: '30%'}}>
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', width: '70%', height: '100%', color: 'grey'}}>
                        <Typography sx={{fontSize: '12px', ml: 2}}>Password must: </Typography>
                        <Typography sx={{fontSize: '12px', ml: 2, ...passwordSpecificationsTextColor(password.eightChars)}}>-  Be minimum 8 characters long</Typography>
                        <Typography sx={{fontSize: '12px', ml: 2, ...passwordSpecificationsTextColor(password.oneUpper)}}>-  Contain one upper-case letter</Typography>
                        <Typography sx={{fontSize: '12px', ml: 2, ...passwordSpecificationsTextColor(password.oneLower)}}>-  Contain one lower-case letter</Typography>
                        <Typography sx={{fontSize: '12px', ml: 2, ...passwordSpecificationsTextColor(password.oneNumber)}}>-  Contain one number</Typography>
                    </Box>
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, mt: 3, width: '100%'}}>
                    <Typography sx={{width: '30%', textAlign: 'end', fontSize: '0.95rem'}}>Confirm Password:</Typography>
                    <ControlledTextInput 
                        textFieldStyles={textFieldStyles}
                        textFieldProps={{
                            inputRef: confirmPasswordFieldRef,
                            InputProps: {type: 'password'},
                            error: error.confirmPassword,
                            onFocus: () => setError({...error, confirmPassword: false, passwordsMatch: 'none'}),
                            onBlur: checkIfPasswordsMatch
                        }}
                        charLimit={60}
                        useExpandedRegex={true}
                    />
                </Box>
                <Box sx={{...theme.components.box.fullCenterRow, alignItems: 'start', justifyContent: 'end', mt: 0.5, width: '100%', height: '10%', position: 'relative'}}>
                    {(error.passwordsMatch === false) && 
                    <Box sx={{...theme.components.box.fullCenterCol, alignItems: 'start', width: '70%', height: '100%', position: 'absolute', top: '5px'}}>
                        <Typography sx={{color: 'red', fontSize: '12px', ml: 2}}>Field does not match password!</Typography> 
                    </Box>}
                </Box>
                <Box sx={{...theme.components.box.fullCenterCol, mt: 2, width: '100%', height: '100%'}}>
                    <Typography sx={{fontSize: '18px', fontWeight: 700}}>Security Questions</Typography>
                    <Typography sx={{fontSize: '11px'}}>At least one required</Typography>
                    <Box sx={{...theme.components.box.fullCenterCol, mt: 3, width: '100%'}}>
                        <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '100%'}}>
                            <Typography sx={{fontSize: '14px', width: '30%', textAlign: 'end', mr: 2}}>Security Question 1:</Typography>
                            {generateSecurityQuestions(1)}
                        </Box>
                        <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '100%', mt: 1}}>
                            <Typography sx={{fontSize: '14px', width: '30%', textAlign: 'end', mr: 2}}>Answer:</Typography>
                            <ControlledTextInput 
                                textFieldStyles={{'&.MuiTextField-root': {width: '70%'}, '& .MuiInputBase-input': {fontSize: '12px', padding: 0.5, width: '100%'}}}
                                textFieldProps={{
                                    inputRef: questionOneAns,
                                }}
                                useRegex={true}
                            />
                        </Box>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, mt: 3, width: '100%'}}>
                        <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '100%'}}>
                            <Typography sx={{fontSize: '14px', width: '30%', textAlign: 'end', mr: 2}}>Security Question 2:</Typography>
                            {generateSecurityQuestions(2)}
                        </Box>
                        <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '100%', mt: 1}}>
                            <Typography sx={{fontSize: '14px', width: '30%', textAlign: 'end', mr: 2}}>Answer:</Typography>
                            <ControlledTextInput 
                                textFieldStyles={{'&.MuiTextField-root': {width: '70%'}, '& .MuiInputBase-input': {fontSize: '12px', padding: 0.5, width: '100%'}}}
                                textFieldProps={{
                                    inputRef: questionTwoAns,
                                }}
                                useRegex={true}
                            />
                        </Box>
                    </Box>
                    <Box sx={{...theme.components.box.fullCenterCol, mt: 3, width: '100%'}}>
                        <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '100%'}}>
                            <Typography sx={{fontSize: '14px', width: '30%', textAlign: 'end', mr: 2}}>Security Question 3:</Typography>
                            {generateSecurityQuestions(3)}
                        </Box>
                        <Box sx={{...theme.components.box.fullCenterRow, justifyContent: 'start', width: '100%', mt: 1}}>
                            <Typography sx={{fontSize: '14px', width: '30%', textAlign: 'end', mr: 2}}>Answer:</Typography>
                            <ControlledTextInput 
                                textFieldStyles={{'&.MuiTextField-root': {width: '70%'}, '& .MuiInputBase-input': {fontSize: '12px', padding: 0.5, width: '100%'}}}
                                textFieldProps={{
                                    inputRef: questionThreeAns,
                                }}
                                useRegex={true}
                            />
                        </Box>
                    </Box>
                </Box>
                <Button variant='contained' size='large' sx={{mt: 3.5, mb: 2}} onClick={finalizeRegister} disabled={registering}>{registering ? <>Registering<DotWaitingText/></>  : 'Register'}</Button>
            </Box>
        </BodyWrapper>
    )
}