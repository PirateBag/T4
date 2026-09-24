import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {Typography} from '@mui/material';
import { CRUD_ACTION_INSERT} from "../enums/crudAction.js";
import {ScreenStack} from "../Stack.js";
import {
    bomCrudUrl,
    itemPickAll
} from "../Globals.js";
import {BomComponentsDto} from "./BomPropertiesConfig.js";
import {extractMessageFromResponse} from "../FormQueryPanel.js";
import {PropertyGrid} from "../Objects/PropertyGrid.jsx";
import * as objectToString from "../lib/ObjectToString.js";
import * as HttpUtils from "../HttpUtils.js";

const BomProperties = () => {

    const [message, setMessage] = useState("");
    const [queryParameters, setQueryParameters] = useState();
    const[ childSelections, setChildSelections] = useState([ ] );

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

    const screenTitle = () => {
        return (
            'Insert a new component of ' + objectToString.itemIdDescription( ScreenStack.stackTop().data[0] )
        );
    }

    // Consolidate data initialization into a single useEffect
    useEffect(() => {

        async function loadItemPickList() {
            const GenericRequest = {idToSearchFor: ScreenStack.stackTop().data.id};
            const itemPickListResponse = await HttpUtils.postData( {parameters: GenericRequest, url: 'http://localhost:8080/' + itemPickAll});
            afterItemPickCallback( itemPickListResponse );

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

                <PropertyGrid
                    label={screenTitle()}
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
