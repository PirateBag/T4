import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import FormService from "../FormService.js";
import {Typography} from '@mui/material';
import { CRUD_ACTION_INSERT} from "../enums/crudAction.js";
import {ScreenStack} from "../Stack.js";
import {
    bomCrudUrl,
    itemPickAll,
    pickListRequestTemplate,
} from "../Globals.js";
import {BomComponentsDto} from "./BomPropertiesConfig.js";
import {extractMessageFromResponse} from "../FormQueryPanel.js";
import {PropertyGrid} from "../Objects/PropertyGrid.jsx";
import * as objectToString from "../lib/ObjectToString.js";

const BomProperties = () => {

    const [message, setMessage] = useState("");
    const [queryParameters, setQueryParameters] = useState();
    const[ childSelections, setChildSelections] = useState([         {value: '0', label: 'None'},
        {value: '9', label: 'Nut'},
        {value: '10', label: '8 In Wheel'},
        {value: '11', label: 'Front Wheel Bracket'},])

    const afterItemPickCallback = (response) => {
        console.log("afterItemPickCallback received:", response.status);
        if (response.status === 200) {
            const possibleErrorMessages = extractMessageFromResponse(response);
            if (possibleErrorMessages.length > 0) {
                setMessage(possibleErrorMessages);
            }
            setChildSelections([
                {value: 0, label: 'none'},
                ...response.data.data.map(item => ({value: item.id, label: item.external}))
            ]);
        } else {
            setMessage("Unknown error code in itemProperties.afterUpdateCallback");
        }
    }


    const ItemPickListFormService = new FormService({
            messageFormSetter: setMessage,
            messagesFromForm: message,
            afterPostCallback: afterItemPickCallback,
            requestTemplate: pickListRequestTemplate,
            validationRules: BomComponentsDto
        }
    );


    const screenTitle = () => {
        return (
            <i>Create a new component of {ScreenStack.stackTop().data.description }</i>
        )
    }

    // Consolidate data initialization into a single useEffect
    useEffect(() => {

        async function loadItemPickList() {
            const GenericRequest = {idToSearchFor: ScreenStack.stackTop().data.id};
            await ItemPickListFormService.postData(GenericRequest, 'http://localhost:8080/' + itemPickAll);

        }
        const initializeData =  () => {
            if (ScreenStack.stackTop().activityState === CRUD_ACTION_INSERT) {
                setMessage("Insert New Component");
                const defaultParams = {
                    "id": 0,
                    "childId": 9,
                    "parentId": ScreenStack.stackTop().data[0].id,
                    "childDescription": "default",
                    "quantityPer": undefined,
                    "unitCost": undefined,
                    "extendedCost": undefined,
                    "parentDescription": ScreenStack.stackTop().data[0].description,
                    "crudAction": CRUD_ACTION_INSERT
                };
                setQueryParameters(defaultParams);
                return;
            }

            throw new Error("Unexpected activity state: " + ScreenStack.stackTop().activityState);
        };

        initializeData();
        loadItemPickList()
    }, []); // Runs once on mount

    if (queryParameters === undefined) return (<div>Loading ...</div>)

    return (
        <div>
            <br/>
                <ErrorMessage message={message}/>
                <br/>

                <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>
                    {screenTitle()}
                </Typography>

                <PropertyGrid
                    label='Add a component'
                    objectToPresent={queryParameters}
                    objectSetter={setQueryParameters}
                    validationRules={BomComponentsDto}
                    pickListsForSelect = {{ 'childId' : childSelections}}
                    messageFormSetter={setMessage}
                    url={bomCrudUrl}
                    actionLabel='Insert Component'
                    objectToStringFormatter={objectToString.bomResponse}
                />
        </div>
    );
}
export default BomProperties;
