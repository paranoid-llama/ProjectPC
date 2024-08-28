import {Box, Typography, useTheme} from '@mui/material'
import { useEffect, useState } from 'react'

export default function DotWaitingText({}) {
    const [text, setText] = useState('...')

    useEffect(() => {
        setTimeout(() => {
            const nextText = text === '...' ? '' : text === '' ? '.' : text === '.' ? '..' : text === '..' && '...'
            setText(nextText)
        }, 250)
    }, [text])

    return text
}
