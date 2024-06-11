import { useRouteLoaderData, useNavigate, useLocation } from "react-router-dom";
import BodyWrapper from "../routepartials/bodywrapper";
import { useEffect } from "react";

//protected routes are routes that logged in users can access, but it can be any logged in user.

export default function ProtectedRoute({Component}) {
    const user = useRouteLoaderData("root")
    const pathname = useLocation().pathname
    const navigate = useNavigate()
    const notLoggedIn = user.loggedIn === false
    useEffect(() => {
        if (notLoggedIn) {
            navigate('/login', {state: {error: true, message: 'You must be logged in to go to that page!', redirectTo: pathname}})
        }
    }, [])
    return (
        notLoggedIn ? 
            <BodyWrapper></BodyWrapper> : 
            <Component />
    )
}