import {Box, Tabs, Tab, Typography, Grid, Select, MenuItem, TextField, ToggleButton, Button} from '@mui/material'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { NumericFormat } from 'react-number-format'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export default function ItemSelectionModalContents({elementBg, activeTab, changeTab, totalItems, lfItems, ftItems, handleChange, ftSelectedItem, changeFtSelectedItem, lfDisabled, ftDisabled, changingItems=false, saveChanges, saveErrorNoticeShow}) {

    const renderItems = () => {
        return (
            totalItems.map(item => {
                return (
                    <Grid item xs={2} key={`${activeTab}-${item.display}-selection`} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <ToggleButton 
                            value={item.value} 
                            sx={{
                                padding: 0.5, 
                                display: 'flex', 
                                flexDirection: 'column',
                                textTransform: 'none',
                                boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.4), 0px 1px 1px 0px rgba(0,0,0,0.24), 0px 1px 3px 0px rgba(0,0,0,0.22)',
                                '&.Mui-selected': {
                                    backgroundColor: '#283f57'
                                },
                                position: 'relative'
                            }}
                            selected={activeTab === 'lf' ? lfItems.includes(item.value) : Object.keys(ftItems).includes(item.value)}
                            onChange={activeTab === 'lf' ? () => handleChange(item.value) : () => handleChange(item.value, false)}
                        >
                            <Typography sx={{fontSize: '14px', color: '#e3e3e3'}}>{item.display}</Typography>
                            <ImgData type='items' linkKey={item.value} size='32px'/>
                            {(activeTab === 'ft' && ftItems[item.value] !== undefined) &&
                                <Typography sx={{position: 'absolute', fontSize: '12px', top: '100%', color: 'white'}}>
                                    {ftItems[item.value] === 0 ? 'Indeterminate' : ftItems[item.value]}
                                </Typography>
                            }
                        </ToggleButton>
                    </Grid>
                )
            })
        )
    }

    return (
        <>
        {changingItems && 
            <Box sx={{...elementBg, width: '95%', height: '35px', display: 'flex', alignItems: 'center', mb: 1}}>
                <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => saveChanges(false, 'main')}>Collection Options</Button>
                <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
                <Button sx={{color: 'rgb(38, 188, 201)', fontWeight: 700, textTransform: 'none', fontSize: '1rem'}} onClick={() => saveChanges(false, 'preferences')}>Trade Preferences</Button>
                <ArrowForward sx={{color: 'rgb(38, 188, 201)'}}/>
                <Typography sx={{color: 'white', fontWeight: 700, mx: 1}}>Items</Typography>
            </Box>
        }
        <Box sx={{...elementBg, width: '95%', height: '8%'}}>
            <Tabs value={activeTab} onChange={changeTab}>
                <Tab value='lf' label='LF' disabled={lfDisabled} sx={{'&.Mui-disabled': {opacity: 0.3}, '&.MuiButtonBase-root': {color: 'white'}}}/>
                <Tab value='ft' label='FT' disabled={ftDisabled} sx={{'&.Mui-disabled': {opacity: 0.3}, '&.MuiButtonBase-root': {color: 'white'}}}/>
            </Tabs>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '22%', mt: 1}}>
            <Typography variant='h5' align='center' sx={{paddingTop: '10px', fontSize: '24px', fontWeight: 700, mb: activeTab === 'lf' ? 2 : 1}}>Select {activeTab === 'lf' ? 'LF' : 'FT'} Items</Typography>
            <Typography align='center' sx={{paddingTop: '10px', fontSize: '16px', fontWeight: 400}}>
                {activeTab === 'lf' ? "Select which items you're looking for among the below list of valuable items" : 
                    "Select which items you're offering among the below list of valuable items. You do not have to specify a quantity for them, but it helps potential traders!"
                }
            </Typography>
        </Box>
        <Box sx={{...elementBg, width: '95%', height: '55%', mt: 1, display: 'flex', alignItems: 'center'}}>
            <Grid container sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2}}>
                {renderItems()}
            </Grid>
        </Box>
        {activeTab === 'ft' && 
        <Box sx={{...elementBg, width: '95%', height: '10%', mt: 1, display: 'flex', alignItems: 'center', gap: 2}}>
            {ftSelectedItem !== 'none' ? 
                <>
                <Box sx={{width: '1%'}}></Box>
                <Box sx={{width: '7%', display: 'flex', alignItems: 'center'}}>
                    <ImgData type='items' linkKey={ftSelectedItem}/> 
                </Box>
                </> :
                <Box sx={{width: '8%'}}></Box>
            }  
            <Select 
                value={ftSelectedItem === 'none' ? '' : ftSelectedItem} 
                sx={{width: '30%', '& .MuiSelect-select': {padding: 1, color: 'white'}}} 
                onChange={(e, newVal) => changeFtSelectedItem(newVal)}
            >
                {Object.keys(ftItems).map(ftItem => {
                    const label = totalItems.filter(it => it.value === ftItem)[0].display
                    return (
                        <MenuItem key={`${ftItem}-ft-qty-select`} value={ftItem}>{label}</MenuItem>
                    )
                })}
            </Select>
            {ftSelectedItem !== 'none' && 
                <>
                <Typography>Quantity:</Typography>
                <NumericFormat
                    sx={{position: 'relative', '& .MuiInputBase-root': {width: '100%', color: 'white'}, '&.MuiTextField-root': {width: '30%'}}}
                    InputProps={{
                        endAdornment: <Box sx={{height: '90%', width: '15%', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative'}}>
                            <Box sx={{height: '50%', width: '100%', position: 'absolute', top: '-25px', right: '25px'}}>
                                <Button sx={{padding: 0}} onClick={ftItems[ftSelectedItem] < 999 ? () => handleChange(ftSelectedItem, true, ftItems[ftSelectedItem]+1) : null}>
                                    <KeyboardArrowUpIcon/>
                                </Button>
                            </Box>
                            <Box sx={{height: '50%', width: '100%', position: 'absolute', top: '0px', right: '25px'}}>
                                <Button sx={{padding: 0, '&.MuiButton-root': {width: '20px', height: '20px'}, height: '100%'}} onClick={ftItems[ftSelectedItem] > 0 ? () => handleChange(ftSelectedItem, true, ftItems[ftSelectedItem]-1) : null}>
                                    <KeyboardArrowDownIcon/>
                                </Button>
                            </Box>
                        </Box>
                    }}
                    value={ftItems[ftSelectedItem] === undefined ? 0 : ftItems[ftSelectedItem]}
                    onChange={(e) => handleChange(ftSelectedItem, true, isNaN(parseInt(e.target.value))? 0 : parseInt(e.target.value))}
                    customInput={TextField} 
                    size='small' 
                    isAllowed={(values) => {
                        const {floatValue} = values
                        return (floatValue <= 999 || floatValue === undefined)
                    }}
                    allowNegative={false} 
                    decimalScale={0}
                />
                <Button sx={{width: '20%'}} onClick={() => handleChange(ftSelectedItem, false)}>
                    Remove
                </Button>
                </>
            }
        </Box>
        }
        {changingItems &&
            <Box sx={{mt: 1, height: '35px', width: '100%', display: 'flex'}}>
                <Box sx={{...elementBg, width: '20%', height: '100%', mr: '20%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Button size='small' variant='contained' sx={{py: 0}} onClick={() => saveChanges(false, 'exit')}>Exit</Button>
                </Box>
                <Box sx={{...elementBg, width: '20%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Button size='small' variant='contained' sx={{py: 0}} onClick={() => saveChanges(true, 'preferences')}>Save</Button>
                </Box>
                {saveErrorNoticeShow && 
                <Box sx={{...elementBg, width: '25%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 5}}>
                    <Typography sx={{fontSize: '12px', color: 'white', fontWeight: 700}}>
                        No changes were made!
                    </Typography>
                </Box>
                }
            </Box>
        }
        </>
    )
}