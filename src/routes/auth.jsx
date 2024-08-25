import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams, useRouteLoaderData } from "react-router-dom";

//this route was going to be used for 

export default function Auth({}) {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const user = useRouteLoaderData("root")
    const queries = {}
    for (let entry of searchParams.entries()) {
        const [param, value] = entry
        queries[param] = value
    } //this is such a weird way of having to get the link params in a clean key: value way. As far as I know there's no cleaner way of doing it. 

    useEffect(() => {
        if (user.loggedIn === false) {
            navigate('/login')
        } else {
            navigate('/')
        }
    }, [])
    return <></>
}