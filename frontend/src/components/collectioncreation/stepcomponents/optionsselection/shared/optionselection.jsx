import {Box, Typography, Button, ToggleButton, Tooltip, Select, MenuItem, Tabs, Tab, Grid} from '@mui/material'
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpIcon from '@mui/icons-material/Help';
import ControlledTextInput from '../../../../functionalcomponents/controlledtextinput'
import TradePreferencesSelection from './tradepreferencesselection';
import RateSelection from '../aprimon/rateselection';
import SortingSelection from '../aprimon/sortingselection';
import Header from '../../../../titlecomponents/subcomponents/header';
import { getPossibleItems, apriballLiterals } from '../../../../../infoconstants';

export default function OptionSelection({collectionType, collectionGen, goBackStep, cssClass, ballOrderInit, customSort}) {
    const optionTabs = ['preferences', 'rates', 'sorting']
    const [optionTab, setOptionTab] = useState(optionTabs[0])
    const [optionsFormData, setOptionsFormData] = useState({
        tradePreferences: {
            status: 'open',
            size: 'any',
            onhandOnly: 'no',
            items: 'none',
            lfItems: [],
            ftItems: {}
        },
        sorting: {
            collection: {defaultSortKey: 'NatDexNumL2H', reorder: false},
            onhand: {defaultSortKey: 'NatDexNumL2H', reorder: true, ballOrder: ballOrderInit, sortFirstBy: 'pokemon'},
            customSort
        }, 
        rates: { pokemonOffers: [{items: ['On-Hand HA Aprimon', 'HA Aprimon'], rate: [2, 1]}, {add: true}], itemOffers: [{add: true}]}
    })

    const totalItems = getPossibleItems(collectionGen)
    const rateTotalItemsStep = totalItems.map(item => apriballLiterals.includes(item.value) ? 'Apriballs' : item.display)
    const rateTotalItems = rateTotalItemsStep.filter((item, idx) => rateTotalItemsStep.indexOf(item) === idx)

    const changeTab = (e, val) => {
        setOptionTab(val)
    }

    const handleTradePreferenceChange = (e, field, newValue) => {
        const adjustedNewVal = field === 'items' ? newValue.props.value : newValue
        setOptionsFormData({...optionsFormData, tradePreferences: {...optionsFormData.tradePreferences, [field]: adjustedNewVal}})
    }

    const handleRateDataChange = (e, offerType, newValue) => {
        setOptionsFormData({...optionsFormData, rates: {...optionsFormData.rates, [`${offerType}Offers`]: newValue}})
    }

    const handleSortDataChange = (e, field, nestedField, newValue) => {
        setOptionsFormData({...optionsFormData, sorting: {...optionsFormData.sorting, [field]: {...optionsFormData.sorting[field], [nestedField]: newValue}}})
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
                            helperText: `If empty: 'twentyfourcharacteryesno's ${collectionType}'`,
                            FormHelperTextProps: {
                                sx: {fontSize: '10.5px', height: 2}
                            }
                        }}
                        textFieldStyles={{
                            width: '60%',
                            '& .MuiInputBase-input': {
                                py: 0.5
                            }
                        }}
                        charLimit={60}
                    />
                </Box>
                <Box sx={{width: '90%', height: '10%', display: 'flex', justifyContent: 'center'}}>
                    <Tabs value={optionTab} onChange={changeTab}>
                        <Tab value='preferences' label='Preferences'/>
                        <Tab value='rates' label='Rates'/>
                        <Tab value='sorting' label='Sorting'/>
                    </Tabs>
                </Box>
                <Box sx={{width: '100%', height: '70%', mt: 1}}>
                    {optionTab === 'preferences' && 
                        <TradePreferencesSelection 
                            formData={optionsFormData.tradePreferences} 
                            handleChange={handleTradePreferenceChange} 
                            totalItems={totalItems}
                        />
                    }
                    {optionTab === 'rates' && 
                        <RateSelection 
                            rateData={optionsFormData.rates} 
                            items={rateTotalItems} 
                            handleChange={handleRateDataChange}
                        />
                    }
                    {optionTab === 'sorting' && 
                        <SortingSelection 
                           sortData={optionsFormData.sorting}
                           handleChange={handleSortDataChange}
                        />
                    }
                </Box>
                {/* <Box sx={{width: '100%', height: '15%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Box sx={{width: '91px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
                        <Typography sx={{position: 'relative', fontSize: '16px', fontWeight: 700}}>
                            Sorting Mechanism:
                            <Tooltip sx={{position: 'absolute', width: '16px', bottom: '20px', right: '-5px', ':hover': {cursor: 'pointer'}}} title={sortMechanismTooltip} arrow>
                                <HelpIcon/>
                            </Tooltip>
                        </Typography>
                    </Box>
                    <Box sx={{width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 2}}>
                        <Box sx={{height: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1}}>
                            <Typography sx={{fontSize: '14px', mx: 0.5}}>
                                Collection List: 
                            </Typography>
                            <ToggleButton sx={{fontSize: '12px', padding: 0}}>
                                Enable Auto Reorder
                            </ToggleButton>
                            <Select
                                sx={{width: '15%', '& .MuiSelect-select': {padding: 0}}}
                            >
                                <MenuItem>Dex Number - Low to High</MenuItem>
                                <MenuItem>Dex Number - High to Low</MenuItem>
                                <MenuItem>Name - A to Z</MenuItem>
                                <MenuItem>Name - Z to A</MenuItem>
                            </Select>
                        </Box>
                        <Box sx={{height: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <Typography sx={{fontSize: '14px', mx: 1}}>
                                On-Hand List: 
                            </Typography>
                            <ToggleButton sx={{padding: 0, fontSize: '12px'}}>
                                Enable Auto Reorder
                            </ToggleButton>
                        </Box>
                    </Box>
                </Box> */}
            </Box>
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '95%', zIndex: 1}}>
                <Box sx={{display: 'flex', width: '90%'}}>
                    <Box sx={{width: '50%', display: 'flex', justifyContent: 'start'}}>
                        <Button onClick={goBackStep.func}>
                            <ArrowBackIcon/>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>{goBackStep.stepName}</Typography>
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}