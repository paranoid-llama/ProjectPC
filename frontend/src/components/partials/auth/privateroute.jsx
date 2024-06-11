import { useRouteLoaderData, useNavigate, useLocation, useLoaderData, useParams } from "react-router-dom";
import BodyWrapper from "../routepartials/bodywrapper";
import { useEffect, useContext, useState, Fragment } from "react";
import { AlertsContext } from "../../../alerts/alerts-context";

//private routes are routes that only one user can access, such as an edit route to their own collection.

export default function PrivateRoute({Component, PlaceholderComponent, routeType}) {
    const userData = useRouteLoaderData("root")
    const Placeholder = PlaceholderComponent === undefined ? BodyWrapper : PlaceholderComponent
    const unauthorizedRedirect = routeType === 'editCollection' ? useLocation().pathname.slice(0, -5) : 
        routeType === 'userSettings' && useLocation().pathname.slice(0, -9)
    const comparisonRef = routeType === 'editCollection' ? useLoaderData().owner._id : 
        routeType === 'userSettings' && useParams().username
    const navigate = useNavigate()
    const notLoggedIn = userData.loggedIn === false

    const isAuthorized = !notLoggedIn && (routeType === 'editCollection' ? userData.user._id === comparisonRef : 
        routeType === 'userSettings' && userData.user.username === comparisonRef)

    //alerts
    const [alertIds, setAlertIds] = useState([])
    const {addAlert, dismissAlert} = useContext(AlertsContext)

    const clearAlerts = () => {
        alertIds.forEach((id) => {
            dismissAlert(id);
        });
        setAlertIds([]);
    }

    useEffect(() => {
        if (notLoggedIn) {
            navigate('/login', {state: {error: true, message: 'You must be logged in to go to that page!', redirectTo: pathname}})
        } else {
            if (!isAuthorized) {
                //spawning alert. this ends up spawning two alerts because its in react strictmode (dev thing)
                const alertMessage = `You aren't authorized to ${routeType === 'editCollection' ? 'edit this collection' : routeType === 'userSettings' && "change this user's settings"}!`
                const alertInfo = {severity: 'error', message: alertMessage, timeout: 5}
                const id = addAlert(alertInfo);
                setAlertIds((prev) => [...prev, id]);
                navigate(unauthorizedRedirect)
            }
        }
        return () => {
            clearAlerts();
        };
    }, [])
    return (
        !isAuthorized ? <Placeholder /> : <Component />
    )
}