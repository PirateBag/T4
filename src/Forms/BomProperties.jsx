import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import FormService, {extractMessageFromResponse} from "../FormService.js";
import {Button, MenuItem, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import {CRUD_ACTION_DELETE, CRUD_ACTION_INSERT} from "../crudAction.js";
import {ScreenStack} from "../Stack.js";
import {bomCrudUrl, itemCrudRequestTemplate, itemPickAll, pickListRequestTemplate,} from "../Globals.js";
import {BomComponentsDto} from "./BomPropertiesConfig.js";

const BomProperties = () => {

    const [message, setMessage] = useState("");
    const [queryParameters, setQueryParameters] = useState();
    const[ childSelections, setChildSelections] = useState([         {value: '0', label: 'None'},
        {value: '9', label: 'Nut'},
        {value: '10', label: '8 In Wheel'},
        {value: '11', label: 'Front Wheel Bracket'},])

    const afterUpdateCallback = (response) => {
        console.log("afterQueryCallback received:", response.status);
        if (response.status === 200) {
            const possibleErrorMessages = extractMessageFromResponse(response);
            if (possibleErrorMessages.length > 0) {
                setMessage(possibleErrorMessages);
            }
            //  ScreenStack.pop();
        } else {
            setMessage("Unknown error code in itemProperties.afterUpdateCallback");
        }
    }


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



    const BomItemPropertiesFormService = new FormService({
            messageFormSetter: setMessage,
            messagesFromForm: message,
            afterPostCallback: afterUpdateCallback,
            requestTemplate: itemCrudRequestTemplate,
            validationRules: BomComponentsDto
        }
    );

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
        const initializeData = async () => {
            if (ScreenStack.stackTop().activityState === CRUD_ACTION_INSERT) {
                setMessage("Insert New Component");
                let defaultParams = {
                    "id": 0,
                    "childId": 9,
                    "parentId": ScreenStack.stackTop().data.id,
                    "childDescription": "default",
                    "quantityPer": undefined,
                    "unitCost": undefined,
                    "extendedCost": undefined,
                    "parentDescription": ScreenStack.stackTop().data.description,
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


    const handleInputChange = (rule) => {
        return (event) => {
            let value = event.target.value;
            if (rule.type === 'number') {
                value = value === '' ? undefined : Number(value);
            }
            setQueryParameters({...queryParameters, [rule.field]: value});
        }
    }
    if (queryParameters === undefined) return (<div>Loading ...</div>)

    let workingTabIndex = 0;
    return (
        <div>
            <br/>

            <form onSubmit={BomItemPropertiesFormService.handleSubmit}>
                <ErrorMessage message={message}/>
                <br/>

                {/* 1. Prominent title for the main Grid/Form */}
                <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>
                    {screenTitle()}
                </Typography>


                <Grid container direction="column" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    {BomComponentsDto.map((col) => (
                        <Grid key={col.headerName}>
                            <TextField
                                type={col.type}
                                size="small"
                                margin="dense"
                                name={col.field}
                                placeholder={col.placeholder}
                                value={queryParameters[col.field] ?? ''}
                                label={col.headerName}
                                onChange={handleInputChange(col)}
                                select={col.useSelect}
                                disabled={col.disabled === true}
                                slotProps={{
                                    input: {
                                        maxLength: 50,
                                        readOnly: col.editable === false,
                                    }
                                }}
                                sx={{
                                    width: '240px',
                                    ...(col.editable ? {
                                            backgroundColor: '#f5f5f5'
                                        } : {
                                            pointerEvents: 'none'
                                        }
                                    ),
                                    ...(col.hidden === true && {
                                            display: 'none'
                                        }
                                    )
                                }}
                            >
                                {col.useSelect && childSelections.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    ))}
                </Grid>

                <Grid size={12} container spacing={2} justifyContent="center">
                    <Button variant="outlined" tabIndex={workingTabIndex++} onClick={() => ScreenStack.pop()}>Return
                        without Saving</Button>

                    <Button type="submit" variant="outlined" name={bomCrudUrl}   value={CRUD_ACTION_INSERT}
                                tabIndex={workingTabIndex++}>Insert Component and Return</Button>
                </Grid>
            </form>
        </div>
    );
}
export default BomProperties;
