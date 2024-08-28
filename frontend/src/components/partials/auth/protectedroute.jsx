import { useRouteLoaderData, useNavigate, useLocation, useLoaderData } from "react-router-dom";
import BodyWrapper from "../routepartials/bodywrapper";
import { useEffect, useContext } from "react";
import { AlertsContext } from "../../../alerts/alerts-context";

//protected routes are routes that logged in users can access, but it can be any logged in user.

export default function ProtectedRoute({Component, PlaceholderComponent, loaderData, extraAuthType, loaderDataProp}) {
    const user = useRouteLoaderData("root")
    const {addAlert} = useContext(AlertsContext)
    
    const pathname = useLocation().pathname
    const navigate = useNavigate()
    const notLoggedIn = user.loggedIn === false
    const extraAuthOkay = extraAuthType === undefined ? true : 
        extraAuthType === 'newTrade' && (!(user.user.username === loaderData.owner.username) && ((!notLoggedIn && !loaderData.owner.settings.privacy.blockedUsers.includes(user.user.username)) && (!loaderData.owner.settings.privacy.disabledTrades)))
    const errorOccurred = notLoggedIn || (extraAuthType !== undefined && !extraAuthOkay)

    useEffect(() => {
        if (errorOccurred) {
            const extraAuthIssue = !notLoggedIn
            if (extraAuthIssue) {
                const redirect = extraAuthType === 'newTrade' && pathname.slice(0, -6)
                const errorMessage = extraAuthType === 'newTrade' && (user.user.username === loaderData.owner.username ? 'You cannot trade with yourself!' : loaderData.owner.settings.privacy.disabledTrades ? 'This user has trades disabled!' : 'You were blocked by this user and cannot trade with them!')
                addAlert({severity: 'error', timeout: 5, message: errorMessage})
                navigate(redirect)
            } else {
                navigate('/login', {state: {error: true, message: 'You must be logged in to go to that page!', redirectTo: pathname}})
            }
        }
    }, [])
    return (
        (errorOccurred) ? 
            PlaceholderComponent ? <PlaceholderComponent/> : <BodyWrapper></BodyWrapper> : 
            <Component {...loaderDataProp}/>
    )
}