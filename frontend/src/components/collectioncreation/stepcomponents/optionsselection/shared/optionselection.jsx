import {Box, Typography, Button, ToggleButton, Tooltip, Select, MenuItem, Tabs, Tab, Grid} from '@mui/material'
import { useState, useRef } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForward from '@mui/icons-material/ArrowForward';
import HelpIcon from '@mui/icons-material/Help';
import ControlledTextInput from '../../../../functionalcomponents/controlledtextinput'
import TradePreferencesSelection from './tradepreferencesselection';
import RateSelection from '../aprimon/rateselection';
import SortingSelection from '../aprimon/sortingselection';
import MiscSelection from '../aprimon/miscselection';
import Header from '../../../../titlecomponents/subcomponents/header';
import { getPossibleItems, apriballLiterals, getBallsInGen } from '../../../../../../common/infoconstants/miscconstants.mjs';

export default function OptionSelection({collectionType, formOptionsData, collectionGen, goBackStep, cssClass, customSort, userData, handleChange, demo}) {
    const optionTabs = ['preferences', 'rates', 'sorting', 'misc']
    const [optionTab, setOptionTab] = useState(optionTabs[0])
    const collectionNameRef = useRef(null)
    const [optionsFormData, setOptionsFormData] = useState(formOptionsData !== undefined ? formOptionsData : {
        collectionName: '',
        globalDefaults: {
            isHA: true,
            emCount: 0
        },
        tradePreferences: {
            status: 'open',
            size: 'any',
            onhandOnly: 'no',
            items: 'none',
            lfItems: [],
            ftItems: {}
        },
        sorting: {
            collection: {default: 'NatDexNumL2H', reorder: false},
            onhand: {default: 'NatDexNumL2H', reorder: true, ballOrder: [], sortFirstBy: 'pokemon'},
            customSort,
            holdPokemon: []
        }, 
        rates: { pokemonOffers: [{items: ['On-Hand HA Aprimon', 'HA Aprimon'], rate: [2, 1]}, {add: true}], itemOffers: [{add: true}]}
    })

    const totalItems = getPossibleItems(collectionGen)
    
    const totalBalls = getBallsInGen(collectionGen)
    const tentativeBallOrder = [...optionsFormData.sorting.onhand.ballOrder, ...totalBalls.filter(b => !optionsFormData.sorting.onhand.ballOrder.includes(b))]
    const rateTotalItemsStep = totalItems.map(item => apriballLiterals.includes(item.value) ? 'Apriballs' : item.display)
    const rateTotalItems = rateTotalItemsStep.filter((item, idx) => rateTotalItemsStep.indexOf(item) === idx)

    const changeTab = (e, val) => {
        setOptionTab(val)
    }

    const handleTradePreferenceChange = (field, newValue) => {
        const adjustedNewVal = field === 'items' ? newValue.props.value : newValue
        setOptionsFormData({...optionsFormData, tradePreferences: {...optionsFormData.tradePreferences, [field]: adjustedNewVal}})
    }

    const handleRateDataChange = (offerType, newValue) => {
        setOptionsFormData({...optionsFormData, rates: {...optionsFormData.rates, [`${offerType}Offers`]: newValue}})
    }

    const handleSortDataChange = (field, newValue, listType) => {
        setOptionsFormData({...optionsFormData, sorting: {...optionsFormData.sorting, [listType]: {...optionsFormData.sorting[listType], [field]: newValue}}})
    }

    const handleCustomSortChange = (customSort, holdPokemon) => {
        const includeHoldPokemon = holdPokemon === undefined ? {} : {holdPokemon}
        setOptionsFormData({...optionsFormData, sorting: {...optionsFormData.sorting, customSort, ...includeHoldPokemon}})
    }

    const handleGlobalDefaultChange = (field, newValue) => {
        setOptionsFormData({...optionsFormData, globalDefaults: {...optionsFormData.globalDefaults, [field]: newValue}})
    }

    const sortMechanismTooltip = 'The sorting mechanisms applied to the two lists when content is added or removed. Enable it to have the sorting mechanism apply every time content changes.'

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 1, height: '581px', position: 'relative'}} className={cssClass}>
            <Header additionalStyles={{color: 'black', paddingBottom: '2px', height: '32px'}}>Collection Options</Header>
            <Typography sx={{fontSize: '12px'}}>{collectionType}</Typography>
            <Box sx={{width: '100%', height: '95%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{width: '90%', height: '15%', display: 'flex', alignItems: 'center', justifyContent: 'center', mt: -1}}>
                    <Typography sx={{fontSize: '16px', fontWeight: 700, marginRight: 2}}>Collection Name:</Typography>
                    <ControlledTextInput
                        textFieldProps={{
                            size: 'small',
                            helperText: `If empty: '${demo ? 'My' : userData.username}${!demo ? "'s" : ''} ${collectionType}'`,
                            FormHelperTextProps: {
                                sx: {fontSize: '10.5px', height: 2}
                            },
                            inputRef:  collectionNameRef
                        }}
                        textFieldStyles={{
                            width: '60%',
                            '& .MuiInputBase-input': {
                                py: 0.5
                            }
                        }}
                        useExpandedRegex={true}
                        defaultValue={optionsFormData.collectionName}
                        charLimit={60}
                    />
                </Box>
                <Box sx={{width: '90%', height: '10%', display: 'flex', justifyContent: 'center'}}>
                    <Tabs value={optionTab} onChange={changeTab}>
                        <Tab value='preferences' label='Preferences'/>
                        <Tab value='rates' label='Rates'/>
                        <Tab value='sorting' label='Sorting'/>
                        <Tab value='misc' label='Miscellaneous'/>
                    </Tabs>
                </Box>
                <Box sx={{width: '100%', height: '70%', mt: 1}}>
                    {optionTab === 'preferences' && 
                        <TradePreferencesSelection 
                            formData={optionsFormData.tradePreferences} 
                            handleChange={handleTradePreferenceChange} 
                            totalItems={totalItems}
                            collectionGen={collectionGen}
                        />
                    }
                    {optionTab === 'rates' && 
                        <RateSelection 
                            rateData={optionsFormData.rates} 
                            items={rateTotalItems} 
                            handleChange={handleRateDataChange}
                            collectionGen={collectionGen}
                        />
                    }
                    {optionTab === 'sorting' && 
                        <SortingSelection 
                            totalBalls={totalBalls}
                            sortData={optionsFormData.sorting}
                            handleChange={handleSortDataChange}
                            handleCustomSortChange={handleCustomSortChange}
                            tentativeBallOrder={tentativeBallOrder}
                            holdPokemon={optionsFormData.sorting.holdPokemon}
                        />
                    }
                    {optionTab === 'misc' && 
                        <MiscSelection
                            globalDefaultData={optionsFormData.globalDefaults}
                            handleChange={handleGlobalDefaultChange}
                            collectionGen={collectionGen}
                        />
                    }
                </Box>
            </Box>
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '95%', zIndex: 1}}>
                <Box sx={{display: 'flex', width: '90%'}}>
                    <Box sx={{width: '50%', display: 'flex', justifyContent: 'start'}}>
                        <Button onClick={goBackStep.func}>
                            <ArrowBackIcon/>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>{goBackStep.stepName}</Typography>
                        </Button>
                    </Box>
                    <Box sx={{width: '50%', display: 'flex', justifyContent: 'end'}}>
                        <Button onClick={(e) => handleChange(e, optionsFormData, collectionNameRef.current.value, totalBalls)}>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>Review</Typography>
                            <ArrowForward/>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}