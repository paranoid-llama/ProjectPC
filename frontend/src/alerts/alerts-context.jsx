import {createContext, useState} from 'react';
import { CustomAlert, AlertsWrapper } from './alert';
import { useDispatch, useSelector } from 'react-redux';
import { addAlert as reduxAddAlert, dismissAlert as reduxDismissAlert } from '../app/slices/alerts';

const AlertsContext = createContext();
const AlertsProvider = ({children}) => {
    // const [alerts, setAlerts] = useState([]);
    const dispatch = useDispatch()

    const addAlert = (alert) => {
        const id = Math.random().toString(36).slice(2, 9) + new Date().getTime().toString(36);
        dispatch(reduxAddAlert({alertData: alert, id}))
        return id
    }

    const dismissAlert = (id) => {
        dispatch(reduxDismissAlert(id))
    }

    return (
        <AlertsContext.Provider value={({addAlert, dismissAlert})}>
            <AlertsWrapper dismissAlert={dismissAlert}/>
            {children}
        </AlertsContext.Provider>
    )
}

export {AlertsContext}
export default AlertsProvider;