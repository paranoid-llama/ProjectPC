import {Box, Typography, useTheme} from '@mui/material'
import { useEffect, useState } from 'react'

export default function DotWaitingText({}) {
    const [text, setText] = useState('...')

    useEffect(() => {
        setTimeout(() => {
            const nextText = text === '...' ? '' : text === '' ? '.' : text === '.' ? '..' : text === '..' && '...'
            setText(nextText)
<<<<<<< HEAD
        }, 250)
=======
        }, 1000)
>>>>>>> da117561453ada333ccb4dac2d33ced7e28f4916
    }, [text])

    return text
}
