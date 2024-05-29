import {createContext, useState} from 'react';
import { CustomAlert, AlertsWrapper } from './alert';

const AlertsContext = createContext();
const AlertsProvider = ({children}) => {
    const [alerts, setAlerts] = useState([]);

    const addAlert = (alert) => {
        const id = Math.random().toString(36).slice(2, 9) + new Date().getTime().toString(36);
        setAlerts ((prev) => [{...alert, id: id}, ...prev]);
        return id
    }

    const dismissAlert = (id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id))
    }

    return (
        <AlertsContext.Provider value={({alerts, addAlert, dismissAlert})}>
            <AlertsWrapper>
                {alerts.map((alert) => (
                    <CustomAlert key={alert.id} {...alert} handleDismiss={() => {dismissAlert(alert.id)}} />
                ))}
            </AlertsWrapper>
            {children}
        </AlertsContext.Provider>
    )
}

export {AlertsContext}
export default AlertsProvider;