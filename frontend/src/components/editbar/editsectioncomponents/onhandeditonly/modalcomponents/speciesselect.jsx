import {Box, Typography, TextField, useTheme} from '@mui/material'
import getNameDisplay from '../../../../../../utils/functions/display/getnamedisplay'
import styled from '@emotion/styled'
import {Virtuoso} from 'react-virtuoso'
import {useRef, forwardRef, memo} from 'react'
import ImgData from './../../../../collectiontable/tabledata/imgdata'
import modalStyles from './../../../../../../utils/styles/componentstyles/modalstyles'
import ScrollBar from '../../../../functionalcomponents/scrollbar'
import './speciesselect.css'

const scrollComponent = (theme) => {
    return {
        Scroller: forwardRef((props, ref) => {
            const otherProps = {...props, ref: undefined, children: undefined, style: undefined}
            return <ScrollBar style={props.style} forwardedRef={ref} color={theme.palette.color3.dark} children={props.children} otherProps={otherProps}/>
        })
    }
}

export default function SpeciesSelect({searchOnChange, pokemonData, listItemContent, totalCount, height='60%', onlyList=false, otherStyles={}, otherSubContainerStyles={}, virtuosoStyles={border: '1px solid black'}, onHoverStyles=false, virtuosoProps={}, nameDisplaySettings, customScroller=true}) {
    const theme = useTheme()
    return (
        <Box sx={{...modalStyles.onhand.modalElementBg, height, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', ...otherStyles}}>
            {!onlyList && 
            <Box sx={{width: '40%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <Box sx={{height: '5%', paddingBottom: '10px'}}>
                    <Typography sx={{fontSize: '18px', textDecoration: 'underline'}}>
                        Species
                    </Typography>
                </Box>
                <Box sx={{height: '5%', paddingTop: '5px'}}>
                    {pokemonData.selection.imgLink !== undefined && <ImgData linkKey={pokemonData.selection.imgLink}/>}
                </Box>
                <Box sx={{height: '5%', paddingTop: '15px'}}>
                    <Typography sx={{fontSize: '14px'}}>
                        {pokemonData.selection.name !== undefined && (nameDisplaySettings === undefined ? pokemonData.selection.name : getNameDisplay(nameDisplaySettings, pokemonData.selection.name, pokemonData.selection.natDexNum))}
                    </Typography>
                </Box>
                <Box sx={{height: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                    <TextField 
                        label='Search Pokemon' 
                        variant='outlined' 
                        size='small' 
                        InputLabelProps={{sx: {color: 'white'}}} 
                        InputProps={{sx: {color: 'white'}}}
                        value={pokemonData.searchData}
                        onChange={searchOnChange}
                    />
                </Box>
                <Box sx={{height: '25%'}}>
                    <Typography sx={{fontSize: '12px', textAlign: 'center'}}>
                        Select a pokemon from the table to add/change pokemon species. Table only contains pokemon that have at least one owned apriball.
                    </Typography>
                </Box>
            </Box>
            }
            <Box sx={{width: onlyList ? '100%' : '60%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', ...otherSubContainerStyles}}>
                <Virtuoso 
                    {...virtuosoProps}
                    className={onHoverStyles ? 'virtuosohover' : 'none'}
                    style={{height: '90%', width: '90%', borderRadius: '10px', ...virtuosoStyles}}
                    totalCount={totalCount}
                    itemContent={(index) => listItemContent(index)}
                    components={customScroller ? {...scrollComponent(theme)} : {}} 
                    //reason why custom scroller is optional is because for two components which use speciesselect (pokemon/ball combo scope and 
                    //on-hand pokemon selection), you can select pokemon and if there is a custom scroller, it re-renders the whole virtuoso.
                    //also, for on-hand sorting setting preview, it prevents it from re-rendering.
                    //im not sure why this addition does that, so im excluding those two components from custom scroller specifically until
                    //i can find a work around that wont take more effort than im willing to put in.
                />
            </Box>
            
        </Box>
    )
}

// const SpeciesSelect = memo(SpeciesSelectFunc, (oP, nP) => {
//     const comparisonOld = oP.updateCheck //this is typically a search term, but if its the on-hand sorting preview, its an object of the sorting keys.
//     const comparisonNew = nP.updateCheck
//     const checkIfNeedToUpdate = typeof comparisonOld !== 'object' ? comparisonOld !== comparisonNew : 
//         Object.values(comparisonOld).map((value, idx) => {
//             const compNewValue = Object.values(comparisonNew)[idx]
//             const nonArr = !Array.isArray(value)
//             const nonObj = typeof value !== 'object'
//             if (nonObj) {
//                 return value === compNewValue
//             } else {
//                 if (!nonArr) {
//                     return value.length === compNewValue.length && !value.map((val2, idx2) => val2 === compNewValue[idx2]).includes(false)
//                 }
//                 //not accounting for nested object since none of the use cases for this component have that.
//             }
//         }).includes(false)
//     return (!checkIfNeedToUpdate)
// })