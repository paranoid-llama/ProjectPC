import {Box, Typography, Grid, ToggleButton, Button, Tooltip, useTheme} from '@mui/material'
import { useState, forwardRef } from 'react'
import { useRouteLoaderData } from 'react-router'
import getNameDisplay from '../../../../../../utils/functions/display/getnamedisplay'
import { useDebouncedCallback } from 'use-debounce'
import ArrowForward from '@mui/icons-material/ArrowForward'
import ListSearch from '../../../../functionalcomponents/listsearch'
import Header from '../../../../titlecomponents/subcomponents/header'
import SpeciesSelect from '../../../../editbar/editsectioncomponents/onhandeditonly/modalcomponents/speciesselect'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import Selection from '../../../../collectiontable/selection'
import { apriballLiterals } from '../../../../../../common/infoconstants/miscconstants.mjs'
import { capitalizeFirstLetter } from '../../../../../../utils/functions/misc'
import ScrollBar from '../../../../functionalcomponents/scrollbar'

export default function PokemonBallCombosModalContents({elementBg, selectedMon, totalList, ballComboData, pokemonScopeData, ballScope, changePokemonSelection, allPossibleBalls, handleChange, changingScope=false, changeScopeSave, saveErrorNoticeShow, sw=false}) {
    const theme = useTheme()
    const [filteredList, setFilteredList] = useState(totalList)
    const nameDisplaySettings = useRouteLoaderData('root').user === undefined ? undefined : useRouteLoaderData('root').user.settings.display.pokemonNames

    const noSelection = Object.keys(selectedMon).length === 0
    const selectedMonLegalBalls = !noSelection && selectedMon.legalBalls.map(lB => lB === 'apriball' ? apriballLiterals : lB).flat()
    const excludedCombosPokemonList = Object.keys(ballComboData)

    const handleSearchChange = (query) => {
        debouncedSearch(query)
    }
    const debounceFunction = (query) => {
        const newListState = query === '' ? totalList : totalList.filter(mon => getNameDisplay(nameDisplaySettings, mon.name, mon.natDexNum).toLowerCase().includes(query.toLowerCase()))
        setFilteredList(newListState)
    }
    const debouncedSearch = useDebouncedCallback(
        debounceFunction,
        500
    )

    const listPokemonSelect = (index) => {
        const pokemon = filteredList[index]
        const isSelected = pokemon.imgLink === selectedMon.imgLink
        const disabledSelection = pokemon.subGroup !== undefined ? !pokemonScopeData[pokemon.group][pokemon.subGroup].map(mon => mon.id).includes(pokemon.imgLink) : !pokemonScopeData[pokemon.group].map(mon => mon.id).includes(pokemon.imgLink)
        return (
            <>
            {isSelected && <Selection height='36px' modal={true} deselectFunc={() => changePokemonSelection('')}/>}
            <Box 
                sx={{
                    display: 'flex',  
                    alignItems: 'center', 
                    backgroundColor: '#283f57',
                    borderRadius: '10px', 
                    marginBottom: '3px', 
                    marginTop: '3px',
                    opacity: disabledSelection ? 0.5 : 1,
                    '&:hover': !disabledSelection && {
                        cursor: 'pointer',
                        boxShadow: {boxShadow: '0px 0px 2px 3px #363535'}
                    }
                }}
                onClick={disabledSelection ? null : () => changePokemonSelection(pokemon)}
            >
                <Box sx={{height: '100%', width: sw ? '9%' : '7%', mx: 1}}>
                    <ImgData linkKey={pokemon.imgLink}/>
                </Box>
                <Box sx={{height: '100%', width: sw ? '12%' : '8%'}}>
                    <Typography sx={{fontSize: '10px'}}>#{pokemon.natDexNum}</Typography>
                </Box>
                <Box sx={{height: '100%', width: '45%'}}>
                    <Typography sx={{fontSize: '12px'}}>{getNameDisplay(nameDisplaySettings, pokemon.name, pokemon.natDexNum)}</Typography>
                </Box>
                <Box sx={{height: '100%', width: '30%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: 2}}>
                    {disabledSelection ? 
                        <Tooltip describeChild title='This pokemon is deselected in Pokemon Groups' placement='top' arrow>
                            <Typography sx={{fontSize: '12px', ':hover': {cursor: 'pointer'}}}>
                                Disabled
                            </Typography>
                        </Tooltip> :
                        <></>
                    }
                </Box>
            </Box> 
            </>
        )
    }

    const listExcludedCombosPokemon = (index) => {
        const pokemonName = excludedCombosPokemonList[index]
        const pokemonInfo = ballComboData[pokemonName]
        const excludedBallsNum = pokemonInfo.excludedBalls.length
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
                onClick={null}
            >
                <Box sx={{height: '100%', width: sw ? '8%' : '7%', mx: 1}}>
                    <ImgData linkKey={pokemonInfo.imgLink}/>
                </Box>
                <Box sx={{height: '100%', width: sw ? '11%' : '8%'}}>
                    <Typography sx={{fontSize: '10px'}}>#{pokemonInfo.natDexNum}</Typography>
                </Box>
                <Box sx={{height: '100%', width: '35%'}}>
                    <Typography sx={{fontSize: '12px'}}>{getNameDisplay(nameDisplaySettings, pokemonName, pokemonInfo.natDexNum)}</Typography>
                </Box>
                {sw ?
                <Grid container sx={{height: '100%', width: '45%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: 0.5}}>
                    
                    {pokemonInfo.excludedBalls.map((ball) => {
                        return (
                            <Grid key={`${pokemonInfo.imgLink}-${ball}-ball-exclusion-display`} item xs={2}>
                                <ImgData
                                    type='ball'
                                    linkKey={ball}
                                    size={'23px'}
                                />
                            </Grid>
                        )
                    })}
                </Grid> : 
                <Box container sx={{height: '100%', width: '50%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginRight: 0.25}}>
                    {pokemonInfo.excludedBalls.map((ball) => {
                        return (
                                <ImgData
                                    key={`${pokemonInfo.imgLink}-${ball}-ball-exclusion-display`}
                                    type='ball'
                                    linkKey={ball}
                                    size={excludedBallsNum === 10 ? '23px' : excludedBallsNum === 9 ? '26px' :  excludedBallsNum === 8 ? '29px' : '32px'}
                                />
                        )
                    })}
                </Box> 
                }
            </Box> 
            </>
        )
    }



    return (
        <>
        {changingScope && 
        <Box sx={{...elementBg, width: '95%', height: sw ? '80px' : '35px', display: 'flex', alignItems: 'center', mb: 1}}>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '0.9rem'}} onClick={() => changeScopeSave(false, 'main')}>Collection Options</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '0.9rem'}} onClick={() => changeScopeSave(false, 'changeScope')}>Change Scope</Button>
            <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
            <Typography sx={{color: 'white', fontWeight: 700, mx: 1, fontSize: sw ? '12px' : '0.9rem', textAlign: 'center'}}>Excluded Ball Combos</Typography>
        </Box>
        }
        <Box sx={{...elementBg, width: '95%', height: '8%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Header additionalStyles={{height: '50%', textAlign: 'center', fontSize: sw ? '18px' : '24px'}}>Change Pokemon/Ball Combos</Header>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '7%', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1}}>
            <Box sx={{width: '30%', height: '100%', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', marginLeft: 2}}>
                <Typography sx={{fontSize: '16px'}}>
                    Available Pokemon
                </Typography>
            </Box>
            <Box sx={{width: '30%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button sx={{fontSize: '10px'}} onClick={() => changePokemonSelection('')}>
                    Deselect Pokemon
                </Button>
            </Box>
            <Box sx={{width: '40%', height: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                <ListSearch 
                    queryFunc={handleSearchChange}
                    textFieldProps={{
                        size: 'small',
                        label: 'Search Name'
                    }}
                    textFieldStyles={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white',
                            },
                            '&:hover fieldset': {
                                borderColor: '#1976d2'
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: 'white'
                        },
                        '& .MuiInputBase-inputSizeSmall': {
                            color: 'white'
                        }
                    }}
                />
            </Box>
        </Box>
        <SpeciesSelect
            listItemContent={listPokemonSelect}
            totalCount={filteredList.length}
            height={changingScope ? '30%' : '35%'}
            onlyList={true}
            // virtuosoProps={{
            //     components: {
            //         Scroller: forwardRef((props, ref) => {
            //             const otherProps = {...props, ref: undefined, children: undefined, style: undefined}
            //             return <ScrollBar style={props.style} forwardedRef={ref} color={theme.palette.color3.dark} children={props.children} otherProps={otherProps}/>
            //         })
            //     }
            // }}
            otherStyles={{width: '95%', mt: 1}}
            customScroller={false}
        />
        <Box sx={{...elementBg, width: '95%', height: '40%', mt: 1}}>
            {!noSelection ?
            <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{height: '15%', display: 'flex', alignItems: 'center'}}>
                    <ImgData type='poke' linkKey={selectedMon.imgLink} size='50px'/>
                </Box>
                <Box sx={{height: '10%', display: 'flex', alignItems: 'center'}}>
                    <Typography sx={{marginRight: 1, fontSize: '12px'}}>
                        #{selectedMon.natDexNum}
                    </Typography>
                    <Typography>
                        {getNameDisplay(nameDisplaySettings, selectedMon.name, selectedMon.natDexNum)}
                    </Typography>
                </Box>
                <Box sx={{width: sw ? '100%' : '80%', height: '50%', display: 'flex', justifyContent: 'center', mt: 1, gap: 1}}>
                    <Grid sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} container>
                        {allPossibleBalls.map((ball) => {
                            const selected = ballComboData[selectedMon.name] === undefined || ((ballComboData[selectedMon.name] !== undefined) && !ballComboData[selectedMon.name].excludedBalls.includes(ball))
                            const lastBallCombo = ballComboData[selectedMon.name] !== undefined && 
                                ballComboData[selectedMon.name].excludedBalls.length === selectedMonLegalBalls.filter(b => ballScope.includes(b)).length-1 &&
                                selected
                            const illegalCombo = !selectedMonLegalBalls.includes(ball)
                            const disabledBall = !ballScope.includes(ball)
                            const disabledButton = illegalCombo || disabledBall
                            return (
                                <Grid item key={`${selectedMon.imgLink}-${ball}-exclusion-selection`} xs={2} sx={{display: 'flex', justifyContent: 'center', position: 'relative', opacity: disabledButton ? 0.5 : 1, }}>
                                    <Box sx={{position: 'absolute', top: '-5%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1}}>
                                        <Typography sx={{fontSize: '10px'}}>
                                            {capitalizeFirstLetter(ball)}
                                        </Typography>
                                    </Box>
                                    <ToggleButton 
                                        sx={{
                                            height: '40px', 
                                            px: sw ? 1 : 1.5,
                                            py: sw ? 3 : 3.5,
                                            '&.Mui-selected': {
                                                backgroundColor: '#283f57',
                                                boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)'
                                            }
                                        }}
                                        selected={!disabledButton && selected}
                                        value={ball}
                                        onChange={lastBallCombo ? null : () => handleChange(selectedMon, ball)}
                                        disabled={disabledButton}
                                    >
                                        <ImgData type='ball' linkKey={ball} size={sw ? '32px' : '40px'}/>
                                    </ToggleButton>
                                    {disabledButton && 
                                    <Box sx={{position: 'absolute', top: '75%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                        <Typography sx={{fontSize: '10px'}}>
                                            {illegalCombo ? 'Illegal' : 'Disabled'}
                                        </Typography>
                                    </Box>
                                    }
                                </Grid>
                            )
                        })
                        }
                    </Grid>
                </Box>
                <Box sx={{width: '80%', height: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, gap: 1}}>
                    <Typography sx={{fontSize: '12px', textAlign: 'center'}}>
                        Select which ball combinations you want <b>excluded</b> from your collection
                    </Typography>
                </Box>
            </Box> :
            <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography sx={{height: '10%', fontSize: '14px', display: 'flex', alignItems: 'center'}}>
                    Excluded Pokemon/Ball Combos: 
                </Typography>
                <SpeciesSelect
                    listItemContent={listExcludedCombosPokemon}
                    totalCount={excludedCombosPokemonList.length}
                    height='80%'
                    onlyList={true}
                    otherStyles={{width: '100%', mt: 1}}
                    virtuosoStyles={{border: '1px solid white'}}
                    updateCheck='neverUpdate'
                />
            </Box>
            }
        </Box>
        {changingScope && 
        <Box sx={{mt: 1, height: sw ? '45px' : '35px', width: '100%', display: 'flex'}}>
            <Box sx={{...elementBg, width: '20%', height: '100%', mr: sw ? '5%' : '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size='small' variant='contained' sx={{py: 0}} onClick={() => changeScopeSave(false, 'exit')}>Exit</Button>
            </Box>
            <Box sx={{...elementBg, width: sw ? '35%' : '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Button size={sw ? 'large' : 'small'} variant='contained' sx={{py: 0, fontSize: sw ? '20px' : '15px'}} onClick={() => changeScopeSave(true, 'changeScope')}>Save</Button>
            </Box>
            {saveErrorNoticeShow && 
            <Box sx={{...elementBg, width: '25%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: sw ? 1 : 5}}>
                <Typography sx={{fontSize: '12px', color: 'white', fontWeight: 700, textAlign: 'center'}}>
                    No changes were made!
                </Typography>
            </Box>
            }
        </Box>
        }
        </>
    )
}