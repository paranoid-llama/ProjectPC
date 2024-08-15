import {Box, Typography, useTheme, Button} from '@mui/material'
import { Virtuoso, VirtuosoGrid } from 'react-virtuoso'
import { capitalizeFirstLetter } from '../../../../utils/functions/misc'
import { useDispatch, useSelector } from 'react-redux'
import { useRouteLoaderData } from 'react-router'
import { useState, useEffect, useRef } from 'react'
import { selectIfPokemonIsSelected } from '../../../app/selectors/tradeselectors'
import { setPokemon } from '../../../app/slices/tradeoffer'
import { compareDisplayGridComponents, IndividualCompareDisplayComponent, PokemonCompareDisplayComponent } from '../comparecollections/comparedisplaygridcomponents'
import ShowCollectionList from '../../collectiontable/collectionlist/showcollectionlist'
import ShowOnHandList from '../../collectiontable/onhandlist/showonhandlist'
import { reFormatToIndividual, reFormatIndividualRow } from '../../../../utils/functions/comparecollections/comparison'
import listStyles from '../../../../utils/styles/componentstyles/liststyles'

export default function SetPokemon({minHeight='650px', type, view, data, relValue, oneHomeCollection, fullCollectionData, wantedPokemonData}) {
    const theme = useTheme()
    const userData = useRouteLoaderData('root')
    const viewSubTypes = view === 'comparison' ? ['individual', 'pokemon'] : ['collection', 'onhand']
    const dataInit = view === 'comparison' ? data : (data.collection !== undefined ? data.collection : [])
    const [viewData, setViewData] = useState({viewSub: viewSubTypes[0], listDisplay: dataInit})
    const dataPath = view === 'comparison' ? data : data[viewData.viewSub]

    // console.log(view)
    // console.log(viewData)
    // console.log(data)

    useEffect(() => {
        setViewData({...viewData, viewSub: viewSubTypes[0], listDisplay: dataInit})
        // if (typeRef.current !== type) {typeRef.current = type}
        // if (viewRef.current !== view) {viewRef.current = view}
        // if (idRef.current !== fullCollectionData._id) {idRef.current = fullCollectionData._id}
    }, [view, type, fullCollectionData._id])

    const changeViewData = (newType) => {
        const newListDisplay = newType === 'collection' ? {listDisplay: data.collection.filter(p => (p.disabled === undefined) && (Object.values(p.balls).map(ballData => ballData.isOwned === true).includes(true)))} : 
            newType === 'onhand' ? {listDisplay: data.onhand.filter(p => p.reserved === undefined || p.reserved < p.qty)} : data
        setViewData({...viewData, viewSub: newType, ...newListDisplay})
    }

    //we need to take the state to create this boolean otherwise the view variable updates immediately while the list display takes time.
    const isComparisonSection = (view === 'comparison') && (viewData.viewSub === 'individual' || viewData.viewSub === 'pokemon')

    const isIndividualCompareDisplay = view === 'comparison' && viewData.viewSub === 'individual'
    const formattedComparisonDisplay = isIndividualCompareDisplay ? reFormatToIndividual(viewData.listDisplay, true) : viewData.listDisplay
    const ShowComparisonDisplay = isIndividualCompareDisplay ? VirtuosoGrid : Virtuoso
    const useGridComponentsIfGrid = isIndividualCompareDisplay ? {components: compareDisplayGridComponents} : {}
    const ItemContentFunc = isIndividualCompareDisplay ? IndividualCompareDisplayComponent : PokemonCompareDisplayComponent

    return (
        <>
        {view === 'comparison' ? 
            <Button sx={{color: theme.palette.color1.light}} onClick={() => changeViewData(viewData.viewSub === 'individual' ? 'pokemon' : 'individual')}>Group {viewData.viewSub === 'individual' ? 'by Pokemon' : 'individually'}</Button> :
            <Button sx={{color: theme.palette.color1.light}} onClick={() => changeViewData(viewData.viewSub === 'collection' ? 'onhand' : 'collection')}>View {viewData.viewSub === 'collection' ? 'On-Hand List' : 'Collection List'}</Button>
        }
        <Box sx={{width: '98%', height: minHeight}}>
            {(view === 'comparison') ? 
                <ShowComparisonDisplay 
                    totalCount={formattedComparisonDisplay.length}
                    {...useGridComponentsIfGrid}
                    style={{width: '99%', height: '95%', border: '1px solid white', borderRadius: '10px'}}
                    itemContent={(idx) => {
                        return (
                            // itemContentFunc(pokemon, oneHomeCollection, theme, `can${capitalizeFirstLetter(type)}`, true, useSelectorFunc, dispatchFunc)
                            <ItemContentFunc 
                                p={formattedComparisonDisplay[idx]}
                                oneHomeCollection={oneHomeCollection}
                                list={type}
                                userNameDisplaySettings={!userData.loggedIn ? undefined : userData.user.settings.display.pokemonNames}
                            />
                        )
                    }}
                /> : 
            (viewData.viewSub === 'collection') ? 
                <ShowCollectionList 
                    collection={fullCollectionData}
                    styles={listStyles.collection}
                    isEditMode={false}
                    localDisplayState={viewData.listDisplay}
                    height={minHeight}
                    isTradePage={true}
                    tradeSide={type === 'offer' ? 'offering' : 'receiving'}
                    wantedByOtherListData={wantedPokemonData}
                    userData={userData}
                /> : 
                <ShowOnHandList 
                    collectionID={fullCollectionData._id}
                    styles={listStyles.onhand}
                    isEditMode={false}
                    eggMoveInfo={{}}
                    isHomeCollection={fullCollectionData.gen === 'home'}
                    localDisplayState={viewData.listDisplay}
                    height={minHeight}
                    isTradePage={true}
                    tradeSide={type === 'offer' ? 'offering' : 'receiving'}
                    userData={userData}
                />
            }
        </Box>
        </>
    )
}