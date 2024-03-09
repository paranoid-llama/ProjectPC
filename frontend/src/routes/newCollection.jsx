import {useNavigate} from "react-router-dom";
import { createNewCollection } from "../../utils/functions/backendrequests/newcollection";
import { useState, useTransition, useRef, useEffect } from "react";
import { Virtuoso } from "react-virtuoso";
import {Box, Typography, Button} from "@mui/material";
import Header from "../components/titlecomponents/subcomponents/header";
import BodyWrapper from "../components/partials/routepartials/bodywrapper";
import CreationProgress from "../components/collectioncreation/creationprogress";
import CollectionTypeSelection from "../components/collectioncreation/stepcomponents/typeselection/collectiontypeselection";
import ImportSelection from "../components/collectioncreation/stepcomponents/importselection/importselection";
import { selectAdjArrItem } from "../../utils/functions/misc";
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

    // const handleCreationProgressChange = (progressNum) => {
    //     setCreationProgress(progressNum)
    // }

    useEffect(() => {
        progressRef.current = creationProgress
    }, [creationProgress])

    const handleFormData = (e) => {
        e.preventDefault()
        // const formData = {
        //     gen: e.target[0].value, 
        //     includeBabyMon: e.target[1].checked, 
        //     includeIncenseMon: e.target[2].checked,
        //     interchangeableAltForms: e.target[3].checked,
        //     owner: '64ea4c22465311a6bf99c4ae'
        //     //put userid here too for authentication
        // }
        // createNewCollection(formData)
        navigate("/collections")
    }

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
        <>
        <Box sx={{flex: 1, overflowX: 'hidden', overflowY: 'hidden'}}>
            <Box sx={{flexGrow: 1, width: '100%', alignItems: 'center'}}>
                <Header text={"Create New Collection"} additionalStyles={{backgroundColor: '#26BCC9', color: 'black'}}>Create New Collection</Header>
            </Box>
            <BodyWrapper sx={{position: 'relative'}}>
                <CreationProgress progress={creationProgress} />
                {(formBodyProgress === 0 || slideClasses.step1 !== 'none') && <CollectionTypeSelection handleChange={handleCollectionTypeChange} cssClass={slideClasses.step1}/>}
                {(formBodyProgress === 25 || slideClasses.step2 !== 'none') && <ImportSelection cssClass={slideClasses.step2}/>
                    // <Box sx={{mt: 2, height: '100%', backgroundColor: 'black', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}} className={slideClasses.step2}>Import Collection <Button onClick={goBackStep}>Go Back</Button></Box>
                }
            </BodyWrapper>
        </Box>
        </>
        
    
        // <div>
        //     <h1>Create new collection!</h1>
        //     <form action="/collections/new" method="POST" onSubmit={handleFormData}>
        //         <label htmlFor="gen">Gen:</label>
        //         <select id="gen" name="gen">
        //             <option value={6}>Gen 6</option>
        //             <option value={7}>Gen 7</option>
        //             <option value='swsh'>Gen 8 (Sword/Shield)</option>
        //             <option value='bdsp'>Gen 8 (BD/SP)</option>
        //             <option value={9}>Gen 9</option>
        //         </select>
        //         <div>
        //             <label htmlFor="babyMon">Include Baby Pokemon over their evolved forms:</label>
        //             <input type="checkbox" id="babyMon" name="includeBabyMon" defaultChecked></input>
        //         </div>
        //         <div>
        //             <label htmlFor="incenseMon">Include Incense babies over their evolved forms:</label>
        //             <input type="checkbox" id="incenseMon" name="includeIncenseBaby"></input>
        //         </div>
        //         <div>
        //             <label htmlFor="interchangeableAltForms">Include Interchangeable Alternate Forms:</label>
        //             <input type="checkbox" id="interchangeableAltForms" name="interchangeableAltForms"></input>
        //         </div>
        //         <button type="submit">Create Collection</button>
        //     </form>
        // </div>
    )
}