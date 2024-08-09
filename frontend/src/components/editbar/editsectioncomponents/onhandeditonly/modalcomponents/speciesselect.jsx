import {Box, Typography, TextField} from '@mui/material'
import getNameDisplay from '../../../../../../utils/functions/display/getnamedisplay'
import styled from '@emotion/styled'
import {Virtuoso} from 'react-virtuoso'
import {useRef} from 'react'
import ImgData from './../../../../collectiontable/tabledata/imgdata'
import modalStyles from './../../../../../../utils/styles/componentstyles/modalstyles'
import './speciesselect.css'

export default function SpeciesSelect({searchOnChange, pokemonData, listItemContent, totalCount, height='60%', onlyList=false, otherStyles={}, otherSubContainerStyles={}, virtuosoStyles={border: '1px solid black'}, onHoverStyles=false, virtuosoProps={}, nameDisplaySettings}) {
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
                />
            </Box>
            
        </Box>
    )
}