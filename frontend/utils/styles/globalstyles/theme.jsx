import { createTheme } from '@mui/material/styles'
import listStyles from '../componentstyles/liststyles'

const theme = createTheme({
    palette: {
        //primary.main handles all the colors of the unstyled buttons/mui components. i just set it to what it is by default
        primary: {
            main: '#1976d2'
        },
        color1: {
            light: '#26BCC9',
            main: '#283f57',
            dark: '#1e2f41',
            darker: '#182634',
            contrastText: '#fff',
            contrastTextLight: '#000'
        },
        color2: {
            light: '#413f3e',
            main: '#272625',
            dark: '#1d1c1b',
            darker: '#0d0d0c',
            contrastText: '#fff'
        },
        color3: {
            light: '#edcc12',
            main: '#b59d0e',
            dark: '#98830b',
            darker: '#776708',
            contrastText: '#000'
        }
    },
    components: {
        box: {
            fullCenterRow: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
            },
            fullCenterCol: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }
        },
        toggleButton: {
            dark: {
                group: {
                    '& .MuiToggleButton-root': {border: '1px solid rgba(40,63,87,1)', color: 'white', backgroundColor: '#272625'},
                },
                buttons: {
                    '&.Mui-selected': {backgroundColor: 'rgba(40,63,87,1)', color: 'white'},
                    '&.Mui-selected:hover': {backgroundColor: 'rgba(40,63,87,0.9)'},
                    ':hover': {backgroundColor: 'rgba(39, 38, 37, 0.9)'},
                    '&.Mui-disabled': {color: 'white', opacity: 0.7}
                }  
            }
        },
        list: listStyles
    }
})

export default theme