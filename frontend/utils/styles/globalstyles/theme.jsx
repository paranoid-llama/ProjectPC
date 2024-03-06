import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            light: '#a8bed7',
            main: '#4f7cac',
            dark: '#283f57',
            darker: '#1e2f41',
            contrastText: '#fff'
        },
        secondary: {
            light: '#413f3e',
            main: '#272625',
            abitdarker: '#1d1c1b',
            dark: '#0d0d0c',
            contrastText: '#000'
        },
        tertiary: {
            main: '#ffdf26'
        }
    }
})

export default theme