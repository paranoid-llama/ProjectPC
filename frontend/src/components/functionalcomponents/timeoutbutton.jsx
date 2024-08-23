import {Button} from '@mui/material'
import {useEffect, useState} from 'react'

export default function TimeoutButton({onClickFunc, buttonProps, buttonSx, children, timeoutInit, resetTimeout, init0}) {
    const [timeoutTime, setTimeoutTime] = useState(init0 ? 0 : timeoutInit)
    useEffect(() => {
        if (timeoutTime !== 0) {
            setTimeout(() => {
                setTimeoutTime(timeoutTime - 1)
            }, 1000)
        }
    }, [timeoutTime])

    const handleOnClick = () => {
        if (resetTimeout) {
            setTimeoutTime(timeoutInit)
        }
        onClickFunc()
    }

    return (
        <Button 
            {...buttonProps}
            sx={buttonSx}
            disabled={timeoutTime !== 0}
            onClick={handleOnClick}
        >
            {children}{timeoutTime !== 0 && ` (${timeoutTime})`}
        </Button>
    )
}