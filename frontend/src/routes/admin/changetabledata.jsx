import {Box, Typography, useTheme, Select, MenuItem, Button} from '@mui/material'
import { useState, useRef, useContext } from 'react'
import { AlertsContext } from '../../alerts/alerts-context'
import { ErrorContext } from '../../app/contexts/errorcontext'
import { useNavigate } from 'react-router'
import BodyWrapper from '../../components/partials/routepartials/bodywrapper'
import ControlledTextInput from '../../components/functionalcomponents/controlledtextinput'
import changeTableDataBackendRequest from '../../../utils/functions/backendrequests/api/changetabledata'

export default function ChangeTableData({}) {
    const theme = useTheme()
    const navigate = useNavigate()
    const {handleError} = useContext(ErrorContext)
    const {addAlert} = useContext(AlertsContext)
    const newPeripheralFieldKey = useRef(null)
    const newPeripheralValueKey = useRef(null)
    const [stateData, setStateData] = useState({whichPokemon: 'all', pokemonName: ''})

    const finalizeTableDataChange = () => {
        const allPokemonArg = stateData.whichPokemon === 'all'
        const successFunc = () => {
            const message = `Successfully changed ${stateData.whichPokemon === 'all' ? "all collections'" : `${stateData.pokemonName}'s`} data`
            addAlert({severity: 'success', timeout: 4, message})
        }
        const backendFunc = async() => changeTableDataBackendRequest(allPokemonArg, stateData.pokemonName, newPeripheralFieldKey.current.value, newPeripheralValueKey.current.value)
        handleError(backendFunc, false, successFunc, () => {})
    }

    return (
        <BodyWrapper sx={{...theme.components.box.fullCenterCol, gap: 1, justifyContent: 'start'}}>
            <Typography sx={{fontSize: '36px', fontWeight: 700, mb: 2}}>Change Table Data</Typography>
            <Typography sx={{my: 2}}>Change the data of pokemon in collections for every current collection. Use to correct mistakes/update legality.</Typography>
            {/* <ControlledTextInput 
                textFieldProps={{
                    placeholder: 'Username'
                }}
                textFieldStyles={{
                    '&.MuiTextField-root': {
                        width: '60%',
                        minWidth: '200px'
                    },
                }}
                defaultValue={data.username}
                controlInputFunc={(newVal) => setData({...data, username: newVal})}
            /> */}
            <Select value={stateData.whichPokemon} onChange={(e, newVal) => setStateData({...stateData, whichPokemon: newVal.props.value})}>
                <MenuItem value='all'>Change all Pokemon</MenuItem>
                <MenuItem value='specific'>Change specific pokemon</MenuItem>
            </Select>
            <Box sx={{...theme.components.box.fullCenterCol, gap: 2, opacity: stateData.whichPokemon === 'all' ? 0.5 : 1, pointerEvents: stateData.whichPokemon === 'all' ? 'none' : 'auto'}}>
                <Typography>Make sure to type the pokemon's name as it appears in the database!</Typography>
                <ControlledTextInput 
                    textFieldProps={{
                        placeholder: 'Pokemon Name'
                    }}
                    textFieldStyles={{
                        '&.MuiTextField-root': {
                            width: '60%',
                            minWidth: '200px'
                        },
                    }}
                    defaultValue={stateData.pokemonName}
                    controlInputFunc={(newVal) => setStateData({...stateData, pokemonName: newVal})}
                />
            </Box>
            <Box sx={{...theme.components.box.fullCenterRow, gap: 1}}>
                {/*Add more here to be able to change the pokemon object, as well as remove balls from pokemon*/}
                <Box sx={{...theme.components.box.fullCenterCol, gap: 1}}>
                    <Typography>Change Ball Peripheral Data</Typography>
                    <Typography sx={{fontSize: '14px'}}>Currently any added field will be a boolean. Please update eventually.</Typography>
                    {/*Add more here to be able to remove fields. I'm doing just this since it's what I need.*/}
                    <Box sx={{...theme.components.box.fullCenterRow}}>
                        <Typography sx={{mr: 2}}>Add Field:</Typography>
                        <ControlledTextInput
                            textFieldProps={{
                                placeholder: 'Key',
                                inputRef: newPeripheralFieldKey
                            }}
                            textFieldStyles={{
                                '&.MuiTextField-root': {
                                    width: '30%'
                                },
                            }}
                        />
                        <Typography sx={{mr: 1}}>:</Typography>
                        <ControlledTextInput
                            textFieldProps={{
                                placeholder: 'Default Value',
                                inputRef: newPeripheralValueKey
                            }}
                            textFieldStyles={{
                                '&.MuiTextField-root': {
                                    width: '30%'
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Box>
            <Button variant='contained' size='large' sx={{my: 3}} onClick={finalizeTableDataChange}>Change Table Data</Button>
        </BodyWrapper>
    )
}