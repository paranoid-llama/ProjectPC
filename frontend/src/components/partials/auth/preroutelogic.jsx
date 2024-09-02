import { useRouteLoaderData, useNavigate, useLocation } from "react-router";
import BodyWrapper from "../routepartials/bodywrapper";
import { useEffect, useContext, useState } from "react";
import { AlertsContext } from "../../../alerts/alerts-context";
import { ErrorContext } from "../../../app/contexts/errorcontext";
import verifyForgotPwTokenForBackend from "../../../../utils/functions/backendrequests/users/forgotpassword/verifyforgotpwtoken";

//component for if there is other logic that needs to be done before a route loads. unused.

export default function PreRouteLogic({logicType, Component}) {
    const userData = useRouteLoaderData('root')
    const [valid, setValid] = useState(false)
    const [validData, setValidData] = useState({})
    const navigate = useNavigate()
    const locationData = useLocation()
    const {addAlert} = useContext(AlertsContext)
    const {handleError} = useContext(ErrorContext)
    const cantBeLoggedIn = logicType === 'no-logged-in-user'
    const forgotPwTokenCheck = logicType === 'forgot-password-verify-token'
    const siteOwnerOnly = logicType === 'admin-route'

    const errorOccurred = cantBeLoggedIn ? userData.loggedIn : false
    
    useEffect(() => {
        if (siteOwnerOnly) {
            const deniedAccess = !userData.loggedIn || (userData.loggedIn && userData.user.accountType !== 'owner')
            if (deniedAccess) {
                const redirect = '/'
                const errorMessage = "You do not have access to this page!"
                addAlert({severity: 'error', timeout: 5, message: errorMessage})
                navigate(redirect)
            }
        }
        if (forgotPwTokenCheck) {
            const isLoggedIn = userData.loggedIn 
            if (isLoggedIn) {
                const redirect = '/'
                const errorMessage = cantBeLoggedIn && "You can't reach this page while being logged in!"
                addAlert({severity: 'error', timeout: 5, message: errorMessage})
                navigate(redirect)
            } else {
                const tokenQuery = locationData.search
                const backendFunc = async() => await verifyForgotPwTokenForBackend(tokenQuery)
                const successFunc = (data) => {
                    setValid(true)
                    setValidData(data.data)
                }
                const errorFunc = () => {
                    navigate('/forgot-password', {state: {error: true, invalidToken: true}})
                }
                handleError(backendFunc, false, successFunc, errorFunc, false, true)
            }
        } else if (errorOccurred) {
            const redirect = '/'
            const errorMessage = cantBeLoggedIn && "You can't reach this page while being logged in!"
            addAlert({severity: 'error', timeout: 5, message: errorMessage})
            navigate(redirect)
        }
    }, [])

    return (
        (errorOccurred || (forgotPwTokenCheck && !valid)) ? <BodyWrapper></BodyWrapper> : <Component data={validData}/>
    )
}