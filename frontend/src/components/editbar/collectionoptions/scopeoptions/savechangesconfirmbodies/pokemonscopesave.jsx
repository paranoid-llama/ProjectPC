import {Box, Typography} from '@mui/material'
import { useRouteLoaderData } from 'react-router'
import getNameDisplay from '../../../../../../utils/functions/display/getnamedisplay'
import SpeciesSelect from '../../../editsectioncomponents/onhandeditonly/modalcomponents/speciesselect'
import ImgData from '../../../../collectiontable/tabledata/imgdata'

export default function PokemonScopeSave({addedPokemon, removedPokemon, collectionAutoSort, collectionSortOrder}) {
    const nameDisplaySettings = useRouteLoaderData('root').user === undefined ? undefined : useRouteLoaderData('root').user.settings.display.pokemonNames
    const sortDisplays = {
        'NatDexNumL2H': 'Dex Number - Lowest to Highest',
        'NatDexNumH2L': 'Dex Number - Highest to Lowest',
        'A2Z': 'Name - A to Z',
        'Z2A': 'Name - Z to A'
    }

    const listItemContent = (index, listType) => {
        const list = listType === 'added' ? addedPokemon : removedPokemon
        const pokemonInfo = list[index]
        return (
            <>
            <Box 
                sx={{
                    display: 'flex',  
                    alignItems: 'center', 
                    backgroundColor: '#283f57',
                    borderRadius: '10px', 
                    marginBottom: '3px', 
                    marginTop: '3px',
                }}
            >
                <Box sx={{height: '100%', width: '14%', mx: 1}}>
                    <ImgData linkKey={pokemonInfo.id}/>
                </Box>
                <Box sx={{height: '100%', width: '16%', ml: 1}}>
                    <Typography sx={{fontSize: '10px'}}>#{pokemonInfo.natDexNum}</Typography>
                </Box>
                <Box sx={{height: '100%', width: '60%', ml: 2}}>
                    <Typography sx={{fontSize: '12px'}}>{getNameDisplay(nameDisplaySettings, pokemonInfo.name, pokemonInfo.natDexNum)}</Typography>
                </Box>
            </Box> 
            </>
        )
    }

    return (
        <>
        <Box sx={{width: '100%', height: '70%', justifyContent: 'center', display: 'flex'}}>
            {addedPokemon.length !== 0 && 
            <Box sx={{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                <Typography sx={{color: 'white', fontSize: '14px'}}>
                    Added Pokemon
                </Typography>
                <SpeciesSelect
                    listItemContent={(index) => listItemContent(index, 'added')}
                    totalCount={addedPokemon.length}
                    height='90%'
                    onlyList={true}
                    otherStyles={{width: '90%', mt: 1}}
                    virtuosoStyles={{border: '1px solid white'}}
                />
            </Box>
            }
            {removedPokemon.length !== 0 && 
            <Box sx={{width: '50%', height: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
                <Typography sx={{color: 'white', fontSize: '14px'}}>
                    Removed Pokemon
                </Typography>
                <SpeciesSelect
                    listItemContent={(index) => listItemContent(index, 'removed')}
                    totalCount={removedPokemon.length}
                    height='90%'
                    onlyList={true}
                    otherStyles={{width: '90%', mt: 1}}
                    virtuosoStyles={{border: '1px solid white'}}
                />
            </Box>}
        </Box>
        <Box sx={{width: '100%', height: '10%', justifyContent: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {collectionAutoSort === false ? 
                <>
                <Typography>
                    Collection Auto-Sort is <b>turned off</b>. 
                </Typography>
                <Typography sx={{textAlign: 'center'}}>
                    New Pokemon will be added at the end of the list, unless you had the pokemon in your scope before.
                </Typography>
                </> : 
                <>
                <Typography>
                    Collection Auto-Sort is <b>turned on</b>. 
                </Typography>
                <Typography>
                    Collection will be re-ordered by {sortDisplays[collectionSortOrder]}.
                </Typography>
                </>
            } 
        </Box>
        </>
    )
}