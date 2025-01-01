import {Box, Typography, Button, LinearProgress} from '@mui/material'
import { useTransition, useContext, useState } from 'react'
import { ErrorContext } from '../../../app/contexts/errorcontext'
import { useDispatch, useSelector } from 'react-redux'
import { changeModalState } from '../../../app/slices/editmode'
import { getPokemonGroups } from '../../../../utils/functions/backendrequests/getpokemongroups'
import ArrowForward from '@mui/icons-material/ArrowForward'

export default function OptionsSub({elementBg, screenType, collectionGen, sw}) {
    const dispatch = useDispatch()
    const {handleError} = useContext(ErrorContext)
    const [isPending, startTransition] = useTransition()
    const [groupError, setGroupError] = useState({error: false})
    const scopeTotal = useSelector((state) => state.editmode.pokemonScopeTotal)
    const itemsState = useSelector((state) => state.collectionState.options.tradePreferences.items)

    const buttons = screenType === 'changeScope' ? [{screen: 'pokemonScope', display: 'Pokemon Scope'}, {screen: 'ballScope', display: 'Ball Scope'}, {screen: 'excludedCombos', display: 'Excluded Ball Combos'}] : 
        screenType === 'sorting' ? [{screen: 'collectionSort', display: 'Collection Sorting Settings'}, {screen: 'onhandSort', display: 'On-Hand Sorting Settings'}, {screen: 'customSort', display: 'Custom Sort Collection'}] : 
        screenType === 'tradePreferences' && [{screen: 'preferences', display: 'Preferences'}, {screen: 'rates', display: 'Rates'}, {screen: 'items', display: 'Items'}]

    const navIndicator = screenType === 'changeScope' ? 'Change Scope' : screenType === 'sorting' ? 'Sorting Options' : screenType === 'tradePreferences' && 'Trade Preferences'

    const generateButtons = () => {
        return buttons.map((button) => {
            const disableButton = button.screen === 'items' && itemsState === 'none' && !(collectionGen === 'home')
            const disableButtonBecauseHomeCollection = collectionGen === 'home' && button.screen === 'items'
            const initializeScopeTotal = (button.screen === 'pokemonScope' || button.screen === 'ballScope' || button.screen === 'excludedCombos')
            const onClickFunc = isPending ? null : initializeScopeTotal ? () => initializePokemonGroups(button.screen) : () => dispatch(changeModalState({screen: button.screen}))
            return (
                <Button 
                    size='large'
                    sx={{color: 'white', fontSize: '24px', fontWeight: 700, position: 'relative', '&.Mui-disabled': {opacity: 0.3, color: 'white'}}}
                    key={`change-${button.display}`}
                    disabled={(disableButton || disableButtonBecauseHomeCollection)}
                    onClick={onClickFunc}
                >
                    {button.display}
                    {(disableButton || disableButtonBecauseHomeCollection) && 
                        <Typography sx={{position: 'absolute', fontSize: '12px', textTransform: 'none', top: '95%', width: '140px'}}>
                            {disableButton ? 'Item Trading is disabled. Re-enable it in Preferences.' : 'Item Trading is disabled in HOME collections.'}
                        </Typography>
                    }
                </Button>
            )
        })
    }

    const initializePokemonGroups = async(screen) => {
        const backendRequestGroups = Object.keys(scopeTotal).length === 0
        if (backendRequestGroups) {
            const backendFunc = async() => await getPokemonGroups(collectionGen)
            const successFunc = (totalGroups) => {dispatch(changeModalState({screen, initializeScopeTotal: true, scopeTotal: totalGroups}))}
            const errorFunc = (errorData) => {setGroupError({error: true, ...errorData})}
            // const totalGroups = await getPokemonGroups(collectionGen)
            startTransition(() => {
                handleError(backendFunc, false, successFunc, errorFunc)
            }) 
        } else {
            dispatch(changeModalState({screen}))
        }
    }

    return (
        <>
        <Box sx={{...elementBg, width: '95%', height: sw ? '80px' : '35px', display: 'flex', alignItems: 'center'}}>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => dispatch(changeModalState({screen: 'main'}))}>Collection Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Typography sx={{color: 'white', fontWeight: 700, mx: 1, textAlign: 'center'}}>{navIndicator}</Typography>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '92%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 1}}>
            {!isPending ? 
            groupError.error ?
            <>
                <Typography sx={{fontSize: '24px', color: 'rgb(200, 50, 50)', fontWeight: 700, mb: 2}}>
                    Error {groupError.status}: {groupError.name}
                </Typography>
                <Typography sx={{fontSize: '16px', color: 'rgb(200, 50, 50)', fontWeight: 700}}>
                    {groupError.message}
                </Typography>
                <Typography sx={{fontSize: '16px', color: 'rgb(200, 50, 50)', fontWeight: 700}}>
                    Try again later!
                </Typography>
            </> :
            <Box sx={{width: '95%', height: isPending ? '80%' : '95%', padding: '1%', mb: 2, display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center'}}>
                {generateButtons()}
            </Box> :
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