import {Box, Typography, Grid} from '@mui/material'
import { pokemonGroups } from '../../../../../../common/infoconstants/pokemonconstants.mjs'
import { items } from '../../../../../../common/infoconstants/miscconstants.mjs'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import { capitalizeFirstLetter } from '../../../../../../utils/functions/misc'

export default function AprimonReviewFinalize({formData}) {
    const getScopeGroupAmount = (group, total, groupType='') => {
        const groupLengthComparator = groupType === 'alternateForms' ? group.filter(p => p.name.includes('(')).length : group.length
        const totalLengthComparator = groupType === 'alternateForms' ? total.filter(p => p.name.includes('(')).length : total.length
        return groupLengthComparator === 0 ? 'None' : groupLengthComparator === totalLengthComparator ? 'All' : 'Some'
    } 
    const scopeGroups = {}
    Object.keys(formData.scope.formData).forEach(group => {
        scopeGroups[group] = getScopeGroupAmount(Object.values(formData.scope.formData[group]).flat(), Object.values(formData.scope.total[group]).flat(), group === 'alternateForms' ? 'alternateForms' : '')
    })

    const excludedBallCombosMons = `${Object.keys(formData.scope.excludedCombos).filter((mon, idx) => idx <= 20).map((mon, idx) => idx === 20 ? ' ...' : (idx === 0 ? mon : ` ${mon}`))}`
    const excludedBallCombosMonsSliced = excludedBallCombosMons.slice(0, 300)
    const homeCollection = formData.collectionType.subTypeValue === 'home'

    const reorderDisplays = {
        'NatDexNumL2H': 'Dex Number - Lowest to Highest',
        'NatDexNumH2L': 'Dex Number - Highest to Lowest',
        'A2Z': 'Name - A to Z',
        'Z2A': 'Name - Z to A'
    }

    const otherOnHandSortBy = {
        'pokemon': 'Ball',
        'ball': 'Pokemon'
    }

    return (
        <Box sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 1, mt: 2}}>
            <Box sx={{width: '50%', height: '100%', display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center'}}>
                <Box sx={{width: '100%', height: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography sx={{fontSize: '14px'}}><b>Collection Type:</b> {capitalizeFirstLetter(formData.collectionType.type)}</Typography>
                    <Typography sx={{fontSize: '14px', mt: 1}}><b>Collection Sub-Type:</b> {formData.collectionType.subType}</Typography>
                    <Typography sx={{fontSize: '14px', mt: 1}}><b>Import Selection: </b> {Object.values(formData.importedCollection).length !== 0 ? 'Imported from Google Sheets' : 'Started from Scratch'}</Typography>
                </Box>
                <Box sx={{width: '100%', height: '70%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2}}>
                    <Typography sx={{fontSize: '14px', fontWeight: 700}}>Collection Scope</Typography>
                    <Box sx={{width: '100%', height: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 0.5}}>
                        {Object.keys(scopeGroups).map(group => (
                            <Typography key={`scope-review-${group}-group`} sx={{fontSize: '12px', mt: -0.25}}><b>{pokemonGroups.filter(g => g.key === group)[0].display}:</b> {scopeGroups[group]}</Typography>
                        ))}
                    </Box>
                    <Box sx={{width: '100%', height: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1}}>
                        <Typography sx={{fontSize: '12px', fontWeight: 700}}>Included Balls</Typography>
                        <Grid container sx={{display: 'flex', justifyContent: 'center', width: '80%'}}>
                        {formData.ballScope.formData.map(ball => (
                            <Grid item xs={2} key={`scope-review-${ball}-ball`}>
                                <Typography sx={{fontSize: '10px'}}>
                                    {capitalizeFirstLetter(ball)}
                                </Typography>
                                <ImgData type='ball' linkKey={ball} size='22px'/>
                            </Grid>
                        ))}
                        </Grid>
                    </Box>
                    <Box sx={{width: '100%', height: '30%', display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1}}>
                        <Typography sx={{fontSize: '12px', fontWeight: 700}}>Pokemon with Excluded Ball Combos</Typography>
                        <Typography sx={{fontSize: '11px'}}>
                            {excludedBallCombosMons.length > 300 ? 
                                `${excludedBallCombosMonsSliced.slice(0, excludedBallCombosMonsSliced.lastIndexOf(','))}, ...` : 
                                excludedBallCombosMons
                            }
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{width: '50%', height: '97%', display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center', mt: 1}}>
                <Typography sx={{fontSize: '14px', fontWeight: 700, mb: 1}}>Options</Typography>
                <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography sx={{fontSize: '14px', fontWeight: 700}}>Trade Preferences</Typography>
                    <Typography sx={{fontSize: '12px'}}><b>Trade Status:</b> {formData.options.tradePreferences.status}</Typography>
                    <Typography sx={{fontSize: '12px'}}><b>Trade Size:</b> {formData.options.tradePreferences.size}</Typography>
                    <Typography sx={{fontSize: '12px'}}><b>On-Hand Only:</b> {formData.options.tradePreferences.onhandOnly}</Typography>
                    <Typography sx={{fontSize: '12px'}}><b>Item Trading:</b> {homeCollection ? 'disabled' : formData.options.tradePreferences.items === 'none' ? 'not trading items' : formData.options.tradePreferences.items.toUpperCase() + ' items'}</Typography>
                    <Typography sx={{fontSize: '10px', opacity: formData.options.tradePreferences.items === 'lf' || formData.options.tradePreferences.items === 'lf/ft' ? 1 : 0.5}}>
                        <b>Items you're looking for:</b> {formData.options.tradePreferences.lfItems.map((item, idx) => {
                            const pluralConfig = formData.options.tradePreferences.ftItems[item] !== 1 ? (item === 'patch' ? 'es' : 's') : ''
                            const firstItem = idx === 0 ? '' : ', '
                            const itemDisplay = items.filter(i => i.value === item)[0].display
                            return `${firstItem}${itemDisplay}${pluralConfig}`
                        })}
                    </Typography>
                    <Typography sx={{fontSize: '10px', opacity: formData.options.tradePreferences.items === 'ft' || formData.options.tradePreferences.items === 'lf/ft' ? 1 : 0.5}}>
                        <b>Items you're offering:</b> {Object.keys(formData.options.tradePreferences.ftItems).map((item, idx) => {
                            const pluralConfig = formData.options.tradePreferences.ftItems[item] !== 1 ? (item === 'patch' ? 'es' : 's') : ''
                            const qtyConfig = formData.options.tradePreferences.ftItems[item] === 0 ? '' : `${formData.options.tradePreferences.ftItems[item]} `
                            const firstItem = idx === 0 ? '' : ', '
                            const itemDisplay = items.filter(i => i.value === item)[0].display
                            return `${firstItem}${qtyConfig}${itemDisplay}${pluralConfig}`
                        })}
                    </Typography>
                </Box>
                <Box sx={{width: '100%', height: '15%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography sx={{fontSize: '14px', fontWeight: 700, mb: 1}}>Trade Rates (You : Trader)</Typography>
                    <Typography sx={{fontSize: '12px'}}><b>Pokemon Trade Rates:</b> {formData.options.rates.pokemonOffers.length-1} defined rate{formData.options.rates.pokemonOffers.length-1 === 1 ? '' : 's'}</Typography>
                    <Typography sx={{fontSize: '12px'}}><b>Item Trade Rates:</b> {homeCollection ? 'disabled' : formData.options.rates.itemOffers.length-1} {homeCollection ? '' : 'defined rate'}{formData.options.rates.itemOffers.length-1 === 1 || homeCollection ? '' : 's'}</Typography>
                </Box>
                <Box sx={{width: '100%', height: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Typography sx={{fontSize: '14px', fontWeight: 700}}>Sorting Options</Typography>
                    <Typography sx={{fontSize: '11px'}}><b>Auto-Sort Collection List:</b> {formData.options.sorting.collection.reorder === true ? `Yes, by ${reorderDisplays[formData.options.sorting.collection.default]}` : 'No'}</Typography>
                    <Typography sx={{fontSize: '11px'}}><b>Auto-Sort On-Hand List: </b> 
                        {formData.options.sorting.onhand.reorder === true ? 
                            `Yes, first by ${capitalizeFirstLetter(formData.options.sorting.onhand.sortFirstBy)}${formData.options.sorting.onhand.sortFirstBy === 'pokemon' ? ` (${reorderDisplays[formData.options.sorting.onhand.default]})` : ''}, then by ${otherOnHandSortBy[formData.options.sorting.onhand.sortFirstBy]}${otherOnHandSortBy[formData.options.sorting.onhand.sortFirstBy] === 'Pokemon' ? ` (${reorderDisplays[formData.options.sorting.onhand.default]})` : ''}` : 'No'}</Typography>
                </Box>
            </Box> 
        </Box>
    )
}