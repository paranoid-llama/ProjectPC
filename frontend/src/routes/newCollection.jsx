import {useNavigate} from "react-router-dom";
import { createNewCollection } from "../../utils/functions/backendrequests/newcollection";
import { useState } from "react";
import {Box, Typography} from "@mui/material";
import Header from "../components/titlecomponents/subcomponents/header";
import BodyWrapper from "../components/partials/routepartials/bodywrapper";
import CreationProgress from "../components/collectioncreation/creationprogress";
import CollectionTypeSelection from "../components/collectioncreation/stepcomponents/collectiontypeselection";

export default function NewCollection(userid) {
    const navigate = useNavigate()
    const [creationProgress, setCreationProgress] = useState(0)

    const handleCreationProgressChange = (progressNum) => {
        setCreationProgress(progressNum)
    }

    const handleFormData = (e) => {
        e.preventDefault()
        const formData = {
            gen: e.target[0].value, 
            includeBabyMon: e.target[1].checked, 
            includeIncenseMon: e.target[2].checked,
            interchangeableAltForms: e.target[3].checked,
            owner: '64ea4c22465311a6bf99c4ae'
            //put userid here too for authentication
        }
        createNewCollection(formData)
        navigate("/collections")
    }
    
    return (
        <>
        <Box sx={{flexGrow: 1, width: '100%', alignItems: 'center'}}>
            <Header text={"Create New Collection"} additionalStyles={{backgroundColor: '#26BCC9', color: 'black'}}>Create New Collection</Header>
        </Box>
        <BodyWrapper>
            <CreationProgress progress={creationProgress}/>
            {creationProgress === 0 && <CollectionTypeSelection/>}
        </BodyWrapper>
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