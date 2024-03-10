import {useNavigate} from "react-router-dom";
import { createNewCollection } from "../../utils/functions/backendrequests/newcollection";
import { useState, useTransition, useRef, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import {Box, Typography, Button} from "@mui/material";
import Header from "../components/titlecomponents/subcomponents/header";
import BodyWrapper from "../components/partials/routepartials/bodywrapper";
import BodyWithBanner from "../components/partials/routepartials/bodywithbanner";
import CreationProgress from "../components/collectioncreation/creationprogress";
import CollectionTypeSelection from "../components/collectioncreation/stepcomponents/typeselection/collectiontypeselection";
import ImportSelection from "../components/collectioncreation/stepcomponents/importselection/importselection";
import { selectAdjArrItem, capitalizeFirstLetter } from "../../utils/functions/misc";
import './newCollection.css'

export default function NewCollection(userid) {
    const navigate = useNavigate()
    const steps = [0, 25, 50, 75, 100]
    //progressBar and body should be the exact same always, just separating it allows the body to update later and apply transition effects via keyframes
    // const [creationProgress, setCreationProgress] = useState({progressBar: 0, body: 0})
    const [creationProgress, setCreationProgress] = useState(0)
    const [formBodyProgress, setFormBodyProgress] = useState(0)

    const progressRef = useRef(creationProgress)
    const [formData, setFormData] = useState({})
   
    // console.log(`Ref value: ${progressRef.current} progressBarValue: ${creationProgress}`)

    const getSlideClasses = (stepPercent) => {
        if (stepPercent === progressRef.current || stepPercent === creationProgress) {
            if (progressRef.current === creationProgress) {
                return 'none'
            }
            if (stepPercent === creationProgress) {
                const slideClass = progressRef.current > creationProgress ? 'creation-step-slide-right-enter' : 'creation-step-slide-left-enter'
                return slideClass
            }
            if (stepPercent === progressRef.current) {
                const slideClass = progressRef.current > creationProgress ? 'creation-step-slide-right-exit' : 'creation-step-slide-left-exit'
                return slideClass
            }
        } else {
            return 'none'
        }
    }

    const slideClasses = {
        step1: getSlideClasses(0),
        step2: getSlideClasses(25),
        step3: getSlideClasses(50),
        step4: getSlideClasses(75),
        step5: getSlideClasses(100)
    }

    useEffect(() => {
        progressRef.current = creationProgress
    }, [creationProgress])


    const handleCollectionTypeChange = (e, type, subType) => {
        setFormData({...formData, collectionType: {type, subType}})
        setCreationProgress(25)
        //allows transition effect to occur. if can be improved please do, as this solution re-renders the component twice
        setTimeout(() => {
            setFormBodyProgress(25)
        }, 500)
    }

    const goBackStep = () => {
        const newStep = selectAdjArrItem(steps, creationProgress, false)
        setCreationProgress(newStep)
        setTimeout(() => {
            setFormBodyProgress(newStep)
        }, 500)
    }

    const transitionOccuring = Object.values(slideClasses).filter(className => className !== 'none').length !== 0
    
    return (
        <BodyWithBanner bodySx={{overflowX: 'hidden', overflowY: 'hidden', height: '100%', mt: 2}} bannerSx={{backgroundColor: '#26BCC9', color: 'black'}} text='Create New Collection'>
            {/*extra box with margin top needed due to overflow*/}
            <Box sx={{height: '100%', mt: 3, mx: 1}}> 
                <CreationProgress progress={creationProgress} />
                {(formBodyProgress === 0 || slideClasses.step1 !== 'none') && 
                    <CollectionTypeSelection handleChange={handleCollectionTypeChange} cssClass={slideClasses.step1}/>
                }
                {(formBodyProgress === 25 || slideClasses.step2 !== 'none') && 
                    <ImportSelection 
                        goBackStep={{stepName: 'Type Selection', func: goBackStep}} 
                        cssClass={slideClasses.step2} 
                        collectionType={`${formData.collectionType.subType} ${capitalizeFirstLetter(formData.collectionType.type)} Collection`}
                    />
                }
            </Box>
        </BodyWithBanner>
    )
}