import {Box, Typography, Button, LinearProgress, Grid, styled} from '@mui/material'
import MuiToggleButton from '@mui/material/ToggleButton'
import { useEffect, useState, useRef } from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Header from '../../../../titlecomponents/subcomponents/header'
import { pokemonGroups, pokemonSubGroups, apriballLiterals } from '../../../../../infoconstants'
import { getPokemonGroups } from '../../../../../../utils/functions/backendrequests/getpokemongroups'
import ImgData from '../../../../collectiontable/tabledata/imgdata'
import PokemonGroupCardArea from './pokemongroupcardarea'

export default function ScopeSelection({collectionType, collectionGen, importedCollection, scope, ballScopeInit, goBackStep, cssClass}) {

    const ToggleButton = styled(MuiToggleButton)({
        '&.Mui-selected': {
            backgroundColor: 'rgba(99, 99, 99, 0.3)',
        }
    })

    const [pokemonGroupsFormData, setPokemonGroupsFormData] = useState({
        pokemon: scope === undefined ? {} : scope.formData, 
        balls: ballScopeInit === undefined ? [] : ballScopeInit
    })
    const gettingGroups = scope === undefined
    const gettingBallData = ballScopeInit === undefined
    const groupKeys = !gettingGroups && Object.keys(scope.total)
    const firstPokemonScopeRender = Object.keys(pokemonGroupsFormData.pokemon).length === 0
    const firstBallScopeRender = pokemonGroupsFormData.balls.length === 0

    // console.log(!gettingGroups && scope.oneArrTotal)

    const togglePokemon = (e, groupInfo, imgLink, fullFormData={}) => {
        const {group, subGroup} = groupInfo
        
        const formData = Object.keys(pokemonGroupsFormData.pokemon).length === 0 ? fullFormData : pokemonGroupsFormData.pokemon
        const hasSubGroup = subGroup !== undefined
        const selected = hasSubGroup ? formData[group][subGroup].includes(imgLink) : formData[group].includes(imgLink)
        if (selected) {
            const newGroupData = hasSubGroup ? 
                {...pokemonGroupsFormData, pokemon: {...formData, [group]: {...formData[group], [subGroup]: formData[group][subGroup].filter(id => id !== imgLink)}}} :
                {...pokemonGroupsFormData, pokemon: {...formData, [group]: formData[group].filter(id => id !== imgLink)}}
            setPokemonGroupsFormData(newGroupData)
        } else {
            const newGroupData = hasSubGroup ? 
                {...pokemonGroupsFormData, pokemon: {...formData, [group]: {...formData[group], [subGroup]: [...formData[group][subGroup], imgLink]}}} :
                {...pokemonGroupsFormData, pokemon: {...formData, [group]: [...formData[group], imgLink]}}
            if (subGroup === 'interchangeable') {
                const dexNum = scope.total.alternateForms.interchangeable.filter((mon) => !isNaN(mon.imgLink)).map((mon) => mon.imgLink).filter(link => imgLink.includes(link))[0]
                const selectingAny = dexNum === imgLink
                const selectingForm = dexNum !== imgLink && imgLink.includes(dexNum)
                if (selectingAny) {
                    newGroupData.pokemon.alternateForms.interchangeable = newGroupData.pokemon.alternateForms.interchangeable.filter(id => (!id.includes(dexNum) || (id.includes(dexNum) && id === dexNum)))
                } else if (selectingForm) {
                    newGroupData.pokemon.alternateForms.interchangeable = newGroupData.pokemon.alternateForms.interchangeable.filter(id => id !== dexNum)
                }
            }
            setPokemonGroupsFormData(newGroupData)
        }
    }

    const massTogglePokemon = (e, groupInfo, fullFormData, type) => {
        const {group, subGroup} = groupInfo
        //type --- all (include all), none (include none), Babies (include all babies), Adults (include all Adults), 
        //         any (include all 'any' in interchangeable alt forms), allForms (include all forms in interchangeable alt forms)

        const adjustedSubGroup = group === 'babyAdultMons' ? `${subGroup}${type}` : subGroup

        const otherSubGroup = group === 'babyAdultMons' ? `${subGroup}${type === 'Babies' ? 'Adults' : 'Babies'}` : ''
        const formData = Object.keys(pokemonGroupsFormData).length === 0 ? fullFormData : pokemonGroupsFormData.pokemon
        //must specify formData since state starts off as empty obj (while formData gets initialized). left side only gets utilized when the comp first mounts.

        const hasSubGroup = subGroup !== undefined

        if (group === 'babyAdultMons' && type === 'none') {
            const newGroupData = {...formData, [group]: {...formData[group], [`${subGroup}Babies`]: [], [`${subGroup}Adults`]: []}} 
            setPokemonGroupsFormData(newGroupData)
            return
        }

        const useBallScope = firstBallScopeRender ? ballScopeInit : pokemonGroupsFormData.balls
        const filterLegalBalls = (totalList) => {
            const currentBallsLegality = useBallScope.map(ball => apriballLiterals.includes(ball) ? 'apriball' : ball)
            const currentBallsFormatted = currentBallsLegality.filter((ball, idx) => currentBallsLegality.indexOf(ball) === idx)
            const filteredMons = totalList.filter(mon => mon.legalBalls.map(lB => currentBallsFormatted.includes(lB)).includes(true))
            return filteredMons
        }

        const totalPath = hasSubGroup ? 
            type === 'any' ? filterLegalBalls(scope.total[group][adjustedSubGroup]).map(mon => mon.imgLink).filter(link => !link.includes('-')) :
            type === 'allForms' ? filterLegalBalls(scope.total[group][adjustedSubGroup]).map(mon => mon.imgLink).filter(link => link.includes('-')) : 
            filterLegalBalls(scope.total[group][adjustedSubGroup]).map(mon => mon.imgLink) : filterLegalBalls(scope.total[group]).map(mon => mon.imgLink)

        const formDataPath = hasSubGroup ? 
            type === 'any' ? formData[group][adjustedSubGroup].filter(link => !link.includes('-')) :
            type === 'allForms' ? formData[group][adjustedSubGroup].filter(link => link.includes('-')):
            formData[group][adjustedSubGroup] : formData[group]

        const doNothing = type === 'none' ? formDataPath.length === 0 : totalPath.length === formDataPath.length

        if (doNothing) {
            null
        } else if (type === 'all' || (type === 'Babies' || type === 'Adults') || (type === 'any' || type === 'allForms')) {
            const newGroupData = hasSubGroup ? 
                {...pokemonGroupsFormData, pokemon: {...formData, [group]: {...formData[group], [adjustedSubGroup]: totalPath}}} : 
                {...pokemonGroupsFormData, pokemon: {...formData, [group]: totalPath}}

            // if (type === 'any' || type === 'allForms') {
            //     newGroupData.pokemon.alternateForms.interchangeable = newGroupData.pokemon.alternateForms.interchangeable.filter(id => type === 'any' ? !id.includes('-') : id.includes('-'))
            // }
            
            setPokemonGroupsFormData(newGroupData)
        } else if (type === 'none') {
            const newGroupData = hasSubGroup ? 
                {...pokemonGroupsFormData, pokemon: {...formData, [group]: {...formData[group], [adjustedSubGroup]: []}}} : 
                {...pokemonGroupsFormData, pokemon: {...formData, [group]: []}}
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
                            newFormData[pokemon.group][pokemon.subGroup] = valuePath.filter(id => id !== pokemon.imgLink)
                        } else {
                            newFormData[pokemon.group] = valuePath.filter(id => id !== pokemon.imgLink)
                        }
                    })
                    setPokemonGroupsFormData({pokemon: newFormData, balls: newBallArr})
                    return
                }
            }
        }
        setPokemonGroupsFormData({...pokemonGroupsFormData, balls: newBallArr})
    }

    // console.log(scope)
    // console.log(pokemonGroupsFormData)

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 1, height: '581px', position: 'relative'}} className={cssClass}>
            <Header additionalStyles={{color: 'black', paddingBottom: '2px', height: '32px'}}>Set Collection Scope</Header>
            <Typography sx={{fontSize: '12px'}}>{collectionType}</Typography>
            <Box sx={{width: '100%', height: '95%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
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
                            formData={firstPokemonScopeRender ? scope.formData : pokemonGroupsFormData.pokemon} 
                            ballScope={firstBallScopeRender ? scope.ballScopeInit : pokemonGroupsFormData.balls}
                            groupKeys={groupKeys} 
                            handleChange={togglePokemon}
                            handleMassChange={massTogglePokemon}
                        />
                    </Box>
                    }
                    
                </Box>
                <Box sx={{width: '90%', height: '55%', display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 3}}>
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
                                                selected={firstBallScopeRender ? ballScopeInit.formData.includes(ball) : pokemonGroupsFormData.balls.includes(ball)}
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
                    <Box sx={{width: '20%', height: '90%', display: 'flex', flexDirection: 'row'}}>

                    </Box>
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
                </Box>
            </Box>
        </Box>
    )
}