import {Button} from '@mui/material'
import {useEffect} from 'react'

export default function CountDownButton({handleChange, handleChangeSecond, handleCanConfirmChange, second, canConfirm, isCounting, buttonProps, buttonLabel}) {
    useEffect(() => {
        if (isCounting) {
            if (second !== 0) {
                setTimeout(() => {
                    handleChangeSecond(second-1)
                }, 1000)
            } else {
                handleCanConfirmChange()
            }
        }
    })
    return (
        <Button
            {...buttonProps}
            disabled={!canConfirm}
            onClick={handleChange}
        >
            {buttonLabel} {second !== 0 && `(${second})`}
        </Button>
    )

}