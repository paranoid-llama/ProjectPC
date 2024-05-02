import {Box, Typography, Button, LinearProgress, Grid, styled, Paper} from '@mui/material'
import MuiToggleButton from '@mui/material/ToggleButton'
import { useEffect, useState, useRef} from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForward from '@mui/icons-material/ArrowForward'
import Header from '../../../../titlecomponents/subcomponents/header'
import { pokemonGroups, pokemonSubGroups, apriballLiterals } from '../../../../../infoconstants'
import { getPokemonGroups } from '../../../../../../utils/functions/backendrequests/getpokemongroups'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import PokemonBallCombosModal from './pokemonballcombosmodal'
import PokemonGroupCardArea from './pokemongroupcardarea'

export default function ScopeSelection({collectionType, collectionGen, importedCollection, scope, ballScopeInit, goBackStep, cssClass, handleChange}) {

    const ToggleButton = styled(MuiToggleButton)({
        '&.Mui-selected': {
            backgroundColor: 'rgba(99, 99, 99, 0.3)',
        }
    })

    const firstNoticeRender = importedCollection === undefined
    const inheritScopeFromImportNotice = firstNoticeRender ? false : Object.values(importedCollection).length !== 0
    const [showImportScopeNotice, setShowImportScopeNotice] = useState('firstRender')
    const showNotice = showImportScopeNotice === 'firstRender' && inheritScopeFromImportNotice 

    const closeNotice = () => {
        setShowImportScopeNotice(false)
    }

    const [pokemonGroupsFormData, setPokemonGroupsFormData] = useState({
        pokemon: scope === undefined ? {} : scope.formData, 
        balls: ballScopeInit === undefined ? [] : ballScopeInit.formData,
        excludedCombos: scope === undefined ? {} : scope.excludedCombos
    })
    const [pokemonBallComboModal, setPokemonBallComboModal] = useState({selected: '', open: false})

    const toggleModal = () => {
        const newStatus = !pokemonBallComboModal.open
        setPokemonBallComboModal({selected: {}, open: newStatus})
    }

    const selectPokemonBallCombo = (pokemonId) => {
        setPokemonBallComboModal({...pokemonBallComboModal, selected: pokemonId})
    }

    const gettingGroups = scope === undefined
    const gettingBallData = ballScopeInit === undefined
    const groupKeys = !gettingGroups && Object.keys(scope.total)
    const firstPokemonScopeRender = Object.keys(pokemonGroupsFormData.pokemon).length === 0
    const firstBallScopeRender = pokemonGroupsFormData.balls.length === 0

    const Item = styled(Paper)(() => ({
        backgroundColor:'#222222',
        boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
        padding: '8px',
        textAlign: 'center',
        color: 'white',
        fontFamily: 'Arial'
    }));
    
    const tyroguePresent = scope !== undefined && (Array.isArray(scope.total.breedables) ? scope.total.breedables.filter(mon => mon.id === '236').length !== 0 : scope.total.breedables.regular.filter(mon => mon.id === '236').length !== 0)

    //a bit weird what we do below. long explanation for this and for the conditional state initialization above:
    //scope and ballscopeinit are initialized after an async function to get data from backend. first few renders of this component, it comes out undefined,
    //which sets the state as empty objects. to prevent component from throwing an error for trying to get a nested item from an undefined object, we add these conditionals
    // and use that data for the first state update since the state was already initialized as empty objects. this has no bad effect since you can't actually
    // change any of the states until the data comes out due to the "gettingGroups" and "gettingBallData" preventing any interactable forms from rendering on the page. 
    const pokemonFormData = firstPokemonScopeRender ? scope !== undefined && scope.formData : pokemonGroupsFormData.pokemon
    const ballScopeData = firstBallScopeRender ? ballScopeInit !== undefined && ballScopeInit.formData : pokemonGroupsFormData.balls

    // console.log(!gettingGroups && scope.oneArrTotal)

    const togglePokemon = (e, groupInfo, imgLink, name, natDexNum) => {
        const {group, subGroup} = groupInfo

        const hasSubGroup = subGroup !== undefined
        const selected = hasSubGroup ? pokemonFormData[group][subGroup].map(mon => mon.id).includes(imgLink) : pokemonFormData[group].map(mon => mon.id).includes(imgLink)
        if (selected) {
            const newGroupData = hasSubGroup ? 
                {...pokemonGroupsFormData, pokemon: {...pokemonFormData, [group]: {...pokemonFormData[group], [subGroup]: pokemonFormData[group][subGroup].filter(poke => poke.id !== imgLink)}}} :
                {...pokemonGroupsFormData, pokemon: {...pokemonFormData, [group]: pokemonFormData[group].filter(poke => poke.id !== imgLink)}}
            setPokemonGroupsFormData(newGroupData)
        } else {
            const newGroupData = hasSubGroup ? 
                {...pokemonGroupsFormData, pokemon: {...pokemonFormData, [group]: {...pokemonFormData[group], [subGroup]: [...pokemonFormData[group][subGroup], {name, natDexNum, id: imgLink}]}}} :
                {...pokemonGroupsFormData, pokemon: {...pokemonFormData, [group]: [...pokemonFormData[group], {name, natDexNum, id: imgLink}]}}
            if (subGroup === 'interchangeable') {
                const dexNum = scope.total.alternateForms.interchangeable.filter((mon) => !isNaN(mon.imgLink)).map((mon) => mon.imgLink).filter(link => imgLink.includes(link))[0]
                const selectingAny = dexNum === imgLink
                const selectingForm = dexNum !== imgLink && imgLink.includes(dexNum)
                if (selectingAny) {
                    newGroupData.pokemon.alternateForms.interchangeable = newGroupData.pokemon.alternateForms.interchangeable.filter(poke => (!poke.id.includes(dexNum) || (poke.id.includes(dexNum) && poke.id === dexNum)))
                } else if (selectingForm) {
                    newGroupData.pokemon.alternateForms.interchangeable = newGroupData.pokemon.alternateForms.interchangeable.filter(poke => poke.id !== dexNum)
                }
            }
            setPokemonGroupsFormData(newGroupData)
        }
    }

    const massTogglePokemon = (e, groupInfo, type) => {
        const {group, subGroup} = groupInfo
        //type --- all (include all), none (include none), Babies (include all babies), Adults (include all Adults), 
        //         any (include all 'any' in interchangeable alt forms), allForms (include all forms in interchangeable alt forms)

        const adjustedSubGroup = group === 'babyAdultMons' ? `${subGroup}${type}` : subGroup

        const hasSubGroup = subGroup !== undefined

        if (group === 'babyAdultMons' && type === 'none') {
            const newGroupData = {...pokemonGroupsFormData, pokemon: {...pokemonFormData, [group]: {...pokemonFormData[group], [`${subGroup}Babies`]: [], [`${subGroup}Adults`]: []}}}
            setPokemonGroupsFormData(newGroupData)
            return
        }

        const filterLegalBalls = (totalList) => {
            const currentBallsLegality = ballScopeData.map(ball => apriballLiterals.includes(ball) ? 'apriball' : ball)
            const currentBallsFormatted = currentBallsLegality.filter((ball, idx) => currentBallsLegality.indexOf(ball) === idx)
            const filteredMons = totalList.filter(mon => mon.legalBalls.map(lB => currentBallsFormatted.includes(lB)).includes(true))
            return filteredMons
        }

        const totalPath = hasSubGroup ? 
            type === 'any' ? filterLegalBalls(scope.total[group][adjustedSubGroup]).map(mon => {return {name: mon.name, natDexNum: mon.natDexNum, id: mon.imgLink}}).filter(poke => !poke.id.includes('-')) :
            type === 'allForms' ? filterLegalBalls(scope.total[group][adjustedSubGroup]).map(mon => {return {name: mon.name, natDexNum: mon.natDexNum, id: mon.imgLink}}).filter(poke => poke.id.includes('-')) : 
            filterLegalBalls(scope.total[group][adjustedSubGroup]).map(mon => {return {name: mon.name, natDexNum: mon.natDexNum, id: mon.imgLink}}) : filterLegalBalls(scope.total[group]).map(mon => {return {name: mon.name, natDexNum: mon.natDexNum, id: mon.imgLink}})

        const pokemonFormDataPath = hasSubGroup ? 
            type === 'any' ? pokemonFormData[group][adjustedSubGroup].filter(poke => !poke.id.includes('-')) :
            type === 'allForms' ? pokemonFormData[group][adjustedSubGroup].filter(poke => poke.id.includes('-')):
            pokemonFormData[group][adjustedSubGroup] : pokemonFormData[group]

        const doNothing = type === 'none' ? pokemonFormDataPath.length === 0 : totalPath.length === pokemonFormDataPath.length

        if (doNothing) {
            null
        } else if (type === 'all' || (type === 'Babies' || type === 'Adults') || (type === 'any' || type === 'allForms')) {
            const newGroupData = hasSubGroup ? 
                {...pokemonGroupsFormData, pokemon: {...pokemonFormData, [group]: {...pokemonFormData[group], [adjustedSubGroup]: totalPath}}} : 
                {...pokemonGroupsFormData, pokemon: {...pokemonFormData, [group]: totalPath}}

            // if (type === 'any' || type === 'allForms') {
            //     newGroupData.pokemon.alternateForms.interchangeable = newGroupData.pokemon.alternateForms.interchangeable.filter(id => type === 'any' ? !id.includes('-') : id.includes('-'))
            // }
            
            setPokemonGroupsFormData(newGroupData)
        } else if (type === 'none') {
            const newGroupData = hasSubGroup ? 
                {...pokemonGroupsFormData, pokemon: {...pokemonFormData, [group]: {...pokemonFormData[group], [adjustedSubGroup]: []}}} : 
                {...pokemonGroupsFormData, pokemon: {...pokemonFormData, [group]: []}}
            setPokemonGroupsFormData(newGroupData)
        }
    }

    

    const toggleBall = (e, ball) => {
        const ballArr = firstBallScopeRender ? ballScopeInit.formData : pokemonGroupsFormData.balls
        const ballSelected = ballArr.includes(ball)
        const newBallArr = ballSelected ? ballArr.filter(b => b !== ball) : [...ballArr, ball]
        if (newBallArr.length === 0) {
            return
        }
        if (ballSelected) { //if we're removing a ball, this checks if the ball is the only legal combo for certain pokemon and excludes them
            const currentBallsLegality = newBallArr.map(ball => apriballLiterals.includes(ball) ? 'apriball' : ball)
            const currentBallsFormatted = currentBallsLegality.filter((ball, idx) => currentBallsLegality.indexOf(ball) === idx)
            const hasNoApriballLiterals = !currentBallsFormatted.includes('apriball')
            const hasNoSpecialBall = !currentBallsFormatted.includes(ball)
            if (hasNoApriballLiterals || hasNoSpecialBall) {
                const pokemonToRemove = scope.oneArrTotal.filter(mon => (
                    // mon.legalBalls.length === 1 && mon.legalBalls[0] === 'apriball'
                    !mon.legalBalls.map(lB => currentBallsFormatted.includes(lB)).includes(true)
                ))
                const removedPokemon = pokemonToRemove.length !== 0
                if (removedPokemon) { 
                    //below is used to remove any reference to the original obj, since we don't spread into it with this one. idk if this is necessary but i think itll avoid issues
                    const newFormData = JSON.parse(JSON.stringify(firstPokemonScopeRender ? scope.formData : pokemonGroupsFormData.pokemon)) 
                    pokemonToRemove.forEach((pokemon) => {
                        const valuePath = pokemon.subGroup === undefined ? newFormData[pokemon.group] : newFormData[pokemon.group][pokemon.subGroup]
                        if (pokemon.subGroup !== undefined) {
                            newFormData[pokemon.group][pokemon.subGroup] = valuePath.filter(p => p.id !== pokemon.imgLink)
                        } else {
                            newFormData[pokemon.group] = valuePath.filter(p => p.id !== pokemon.imgLink)
                        }
                    })
                    setPokemonGroupsFormData({...pokemonGroupsFormData, pokemon: newFormData, balls: newBallArr})
                    return
                }
            }
        }
        setPokemonGroupsFormData({...pokemonGroupsFormData, balls: newBallArr})
    }

    const togglePokemonBallCombo = (monInfo, ball) => {
        const firstMonExclusion = pokemonGroupsFormData.excludedCombos[monInfo.name] === undefined
        const monCombosState = firstMonExclusion ? {natDexNum: monInfo.natDexNum, imgLink: monInfo.imgLink, excludedBalls: [ball]} : 
            pokemonGroupsFormData.excludedCombos[monInfo.name].excludedBalls.includes(ball) ? 
                {...pokemonGroupsFormData.excludedCombos[monInfo.name], excludedBalls: pokemonGroupsFormData.excludedCombos[monInfo.name].excludedBalls.filter(b => b !== ball)} : 
                {...pokemonGroupsFormData.excludedCombos[monInfo.name], excludedBalls: [...pokemonGroupsFormData.excludedCombos[monInfo.name].excludedBalls, ball]} 

        if (monCombosState.excludedBalls.length === 0) {
            const fullExcludedCombosState = {...pokemonGroupsFormData.excludedCombos}
            delete fullExcludedCombosState[monInfo.name]
            setPokemonGroupsFormData({...pokemonGroupsFormData, excludedCombos: fullExcludedCombosState})
        } else {
            setPokemonGroupsFormData({...pokemonGroupsFormData, excludedCombos: {...pokemonGroupsFormData.excludedCombos, [monInfo.name]: monCombosState}})
        }
    }

    // console.log(scope)
    // console.log(pokemonGroupsFormData)

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 1, height: '581px', position: 'relative'}} className={cssClass}>
            <Header additionalStyles={{color: 'black', paddingBottom: '2px', height: '32px'}}>Set Collection Scope</Header>
            <Typography sx={{fontSize: '12px'}}>{collectionType}</Typography>
            <Box sx={{width: '100%', height: '95%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', filter: showNotice ? 'blur(4px)' : 'none', opacity: showNotice ? 0.5 : 1}}>
                <Typography variant='h6' sx={{fontSize: '16px', fontWeight: 700, mt: 2}}>Select Pokemon Groups</Typography>
                <Typography sx={{fontSize: '12px'}}>Select which groups of pokemon you want in your collection. Click on a group to see details.</Typography>
                <Box sx={{width: '80%', height: '27%', display: 'flex', flexDirection: 'column'}}>
                    {gettingGroups ? 
                    <>
                    <Typography sx={{mt: 2}}>Getting Pokemon Groups...</Typography>
                    <LinearProgress/>
                    </> : 
                    <Box sx={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', mt: 1, gap: 1}}>
                        <PokemonGroupCardArea 
                            typeTotalMons={scope.total} 
                            formData={pokemonFormData} 
                            ballScope={ballScopeData}
                            groupKeys={groupKeys} 
                            handleChange={togglePokemon}
                            handleMassChange={massTogglePokemon}
                            tyroguePresent={tyroguePresent}
                        />
                    </Box>
                    }
                    
                </Box>
                <Box sx={{width: '90%', height: '50%', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 3}}>
                    <Box sx={{width: '60%', height: '90%', display: 'flex', flexDirection: 'column'}}>
                        <Typography variant='h6' sx={{fontSize: '16px', fontWeight: 700, mt: 2}}>Select Ball Scope</Typography>
                        <Typography sx={{fontSize: '12px'}}>Select which apri/special balls you want to collect </Typography>
                        {gettingBallData ? 
                        <>
                        <Typography sx={{mt: 2}}>Getting Ball Scope...</Typography>
                        <LinearProgress/>
                        </> : 
                        <>
                        <Box sx={{width: '100%', height: '50%', display: 'flex', justifyContent: 'center', mt: 1, gap: 1}}>
                            <Grid sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}} container>
                                {ballScopeInit.total.map((ball) => {
                                    return (
                                        <Grid item xs={2} key={`${ball}-ball-scope-selection`}>
                                            <ToggleButton 
                                                sx={{height: '40px', px: 0.5}}
                                                selected={ballScopeData.includes(ball)}
                                                value={ball}
                                                onChange={(e) => toggleBall(e, ball)}
                                            >
                                                <ImgData type='ball' linkKey={ball} size={'40px'}/>
                                            </ToggleButton>
                                        </Grid>
                                    )
                                })
                                }
                            </Grid>
                        </Box>
                        <Typography sx={{fontSize: '12px', mt: 2}}>
                            <b>WARNING:</b> Deselecting a ball will remove pokemon whose only legal ball combo is that ball!
                        </Typography>
                        </>
                        }
                    </Box>
                    <Box sx={{width: '20%', height: '90%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                        <Typography variant='h6' sx={{fontSize: '16px', fontWeight: 700, mt: 2}}>Exclude Pokemon/Ball Combos</Typography>
                        <Typography sx={{fontSize: '12px'}}>Exclude certain pokemon/ball combos you don't want to collect</Typography>
                        {gettingGroups ?
                            <></> :
                            <>
                            <Button sx={{padding: 0, margin: 0, textTransform: 'none'}} onClick={toggleModal}>
                                <Item>
                                    Change Pokemon/Ball Combos
                                </Item>
                            </Button>
                            <PokemonBallCombosModal
                                isOpen={pokemonBallComboModal.open}
                                totalList={scope.oneArrTotal}
                                selectedMon={pokemonBallComboModal.selected}
                                ballComboData={pokemonGroupsFormData.excludedCombos}
                                formData={pokemonFormData}
                                ballScope={ballScopeData}
                                allPossibleBalls={ballScopeInit.total}
                                toggleModal={toggleModal}
                                changePokemonSelection={selectPokemonBallCombo}
                                handleChange={togglePokemonBallCombo}
                            />
                            </>
                        }
                    </Box>
                </Box>
                <Typography sx={{fontSize: '14px', fontWeight: 700}}>You can change all of these settings later on.</Typography>
            </Box>
            {showNotice &&
            <Box sx={{width: '100%', height: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'absolute'}}>
                <Typography sx={{fontSize: '32px', fontWeight: 700}}>Inheriting Scope from Import</Typography>
                <Button onClick={() => closeNotice()}>Change Scope Anyway</Button>
            </Box>
            }
            
            <Box sx={{width: '100%', display: 'flex', justifyContent: 'start', flexDirection: 'column', alignItems: 'center', position: 'absolute', top: '95%', zIndex: 1}}>
                <Box sx={{display: 'flex', width: '90%'}}>
                    <Box sx={{width: '50%', display: 'flex', justifyContent: 'start'}}>
                        <Button onClick={goBackStep.func}>
                            <ArrowBackIcon/>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>{goBackStep.stepName}</Typography>
                        </Button>
                    </Box>
                    {!gettingGroups && 
                    <Box sx={{width: '50%', display: 'flex', justifyContent: 'end'}}>
                        <Button onClick={(e) => handleChange(e, pokemonFormData, ballScopeData, pokemonGroupsFormData.excludedCombos)}>
                            <Typography sx={{mx: 2, fontSize: '14px'}}>Options</Typography>
                            <ArrowForward/>
                        </Button>
                    </Box>}
                </Box>
            </Box>
        </Box>
    )
}