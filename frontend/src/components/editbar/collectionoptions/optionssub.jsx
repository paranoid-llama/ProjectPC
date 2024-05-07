import {Box, Typography, Button, LinearProgress} from '@mui/material'
import { useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeModalState } from '../../../app/slices/editmode'
import { getPokemonGroups } from '../../../../utils/functions/backendrequests/getpokemongroups'
import ArrowForward from '@mui/icons-material/ArrowForward'

export default function OptionsSub({elementBg, screenType, collectionGen}) {
    const dispatch = useDispatch()
    const [isPending, startTransition] = useTransition()
    const scopeTotal = useSelector((state) => state.editmode.pokemonScopeTotal)

    const buttons = screenType === 'changeScope' ? [{screen: 'pokemonScope', display: 'Pokemon Scope'}, {screen: 'ballScope', display: 'Ball Scope'}, {screen: 'excludedCombos', display: 'Excluded Ball Combos'}] : 
        screenType === 'sorting' ? [{screen: 'collectionSort', display: 'Collection Sorting Settings'}, {screen: 'onhandSort', display: 'On-Hand Sorting Settings'}, {screen: 'customSort', display: 'Custom Sort Collection'}] : 
        screenType === 'tradePreferences' && [{screen: 'preferences', display: 'Preferences'}, {screen: 'rates', display: 'Rates'}, {screen: 'items', display: 'Items'}]

    const navIndicator = screenType === 'changeScope' ? 'Change Scope' : screenType === 'sorting' ? 'Sorting Settings' : screenType === 'tradePreferences' && 'Trade Preferences'

    const generateButtons = () => {
        return buttons.map((button) => {
            const initializeScopeTotal = (button.screen === 'pokemonScope' || button.screen === 'ballScope' || button.screen === 'excludedCombos')
            const onClickFunc = isPending ? null : initializeScopeTotal ? () => initializePokemonGroups(button.screen) : () => dispatch(changeModalState({screen: button.screen}))
            return (
                <Button 
                    size='large'
                    sx={{color: 'white', fontSize: '24px', fontWeight: 700}}
                    key={`change-${button.display}`}
                    onClick={onClickFunc}
                >
                    {button.display}
                </Button>
            )
        })
    }

    const initializePokemonGroups = async(screen) => {
        const backendRequestGroups = Object.keys(scopeTotal).length === 0
        if (backendRequestGroups) {
            const totalGroups = await getPokemonGroups(collectionGen)
            startTransition(() => {
                dispatch(changeModalState({screen, initializeScopeTotal: true, scopeTotal: totalGroups}))
            }) 
        } else {
            dispatch(changeModalState({screen}))
        }
    }

    return (
        <>
        <Box sx={{...elementBg, width: '95%', height: '35px', display: 'flex', alignItems: 'center'}}>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => dispatch(changeModalState({screen: 'main'}))}>Collection Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Typography sx={{color: 'white', fontWeight: 700, mx: 1}}>{navIndicator}</Typography>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '92%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 1}}>
            <Box sx={{width: '95%', height: isPending ? '80%' : '95%', padding: '1%', mb: 2, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center'}}>
                {generateButtons()}
            </Box>
            {isPending && 
            <>
            <Typography sx={{fontSize: '24px'}}>
                Getting Pokemon Groups...
            </Typography>
            <LinearProgress sx={{width: '60%'}}/>
            </>
            }
        </Box>
        </>
    )
}