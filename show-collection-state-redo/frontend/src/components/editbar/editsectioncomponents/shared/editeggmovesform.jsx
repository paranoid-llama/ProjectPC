import {Box, Typography} from '@mui/material'
import RenderEggMoves from './rendereggmoves'
import './../../../../../utils/styles/componentstyles/eggmoveselection.css'
import RenderPossibleEggMoves from './../eggmovecomponents/renderpossibleeggmoves'

export default function EditEggMovesForm({emCount, EMs, maxEms, idxOfSelectedEM, possibleEggMoves, toggleClass, toggleScreen, handleEMChange}) {
    const hideBarStyles = {
        '&:hover': {
            backgroundColor: '#c4c4c4',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            cursor: 'pointer'
        }
    }
    return (
        <Box sx={{
            border: '1px solid black',
            backgroundColor: '#d4d5d6',
            borderBottomLeftRadius: '10px', 
            borderBottomRightRadius: '10px', 
            position: 'absolute', 
            width: '99.6%', 
            height: '200px',
            top: '98.5%',
            zIndex: -1000,
            transform: 'translateZ(-999px)',
            display: 'flex',
            flexDirection: 'row'
            }}
            className={toggleClass}
        >
            <Box sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column'}}>
                <Box sx={{height: '10%', width: '100%', textAlign: 'center', marginTop: '3px'}}>
                    <Typography variant='h2' sx={{fontSize: '16px'}}>
                        Select Egg Moves
                    </Typography>
                </Box>
                <Box sx={{height: '80%', width: '100%', display: 'flex', flexDirection: 'row'}}>
                    <Box sx={{display: 'flex', height: '100%', width: '20%', alignItems: 'center'}}>
                        <Box sx={{height: '70%', width: '100%'}}>
                            <RenderEggMoves emCount={emCount} EMs={EMs} maxEms={maxEms} idxOfSelectedEM={idxOfSelectedEM} changeEMScreen={true} toggleScreen={toggleScreen} handleEMChange={handleEMChange}/>
                        </Box>
                    </Box>
                    <Box sx={{display: 'flex', height: '100%', width: '80%', alignItems: 'center', justifyContent: 'center'}}>
                        <Box sx={{display: 'flex', height: '90%', width: '90%'}}>
                            <RenderPossibleEggMoves possibleEggMoves={possibleEggMoves} handleEMChange={handleEMChange} EMs={EMs} maxEMs={maxEms}/>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{...hideBarStyles, height: '10%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} onClick={() => toggleScreen('close')}>
                    <Box sx={{height: '100%', width: '90%', display: 'flex', justifyContent: 'center', borderTop: '1px solid grey'}}>
                        <img height='18px' width='18px' src='https://res.cloudinary.com/duaf1qylo/image/upload/icons/arrowup'/>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}