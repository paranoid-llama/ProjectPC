import { createContext, useContext, useEffect } from "react";
import { AlertsContext } from "../../alerts/alerts-context";
import { useNavigate } from "react-router";

const ErrorContext = createContext()
const ErrorProvider = ({children}) => {
    //alerts
    const {addAlert} = useContext(AlertsContext)

    const handleError = async(backendFunc, errorRedirect=false, successFunc, errorFunc, checkingAvailability=false, nothingHappenIfError=false) => { 
        //ifErrorRedirect -> new page showing error. if false -> sends alert response.
        //successFunc primarily consists of updating the states in accordance with the action, but also includes sending alerts.
        //errorFunc is any other functions that need to occur when an error occurs (primarily only when it's an alert error), but also the redirect func (cant have useNavigate here.)
        const response = await backendFunc()
        if (response.ok) {
            successFunc(response.load)
        } else {
            if (errorRedirect) {
                errorFunc(response.load)
            } else {
                const alertData = checkingAvailability ? 
                    {severity: 'error', isErrorLiteral: true, timeout: 8, errName: response.load.name, errStatus: response.load.status, message: response.load.message, message2: 'We could not verify if the username/e-mail is available. The input information may be declined if you go through!'} : 
                    {severity: 'error', isErrorLiteral: true, timeout: 8, errName: response.load.name, errStatus: response.load.status, message: response.load.message}
                if (!nothingHappenIfError) {
                    addAlert(alertData)
                }   
                errorFunc(response.load)
            }
        }
    }

    return (
        <ErrorContext.Provider value={({handleError})}>
            {children}
        </ErrorContext.Provider>
    )
}

export {ErrorContext}
export default ErrorProvider