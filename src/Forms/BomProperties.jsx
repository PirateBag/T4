import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import FormService, {extractMessageFromResponse} from "../FormService.js";
import {Button, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import {CRUD_ACTION_INSERT} from "../crudAction.js";
import {ScreenStack} from "../Stack.js";
import {bomCrudUrl, itemCrudRequestTemplate,} from "../Globals.js";
import {BomComponentsDto} from "./BomPropertiesConfig.js";

const BomProperties = () => {

    const [message, setMessage] = useState("");
    const [queryParameters, setQueryParameters] = useState();
    const afterUpdateCallback = (response) => {
        console.log("afterQueryCallback received:", response.status);
        if (response.status === 200) {
            const possibleErrorMessages = extractMessageFromResponse(response);
            if (possibleErrorMessages.length > 0) {
                setMessage(possibleErrorMessages);
            }
        } else {
            setMessage("Unknown error code in itemProperties.afterUpdateCallback");
        }
    }


    const BomItemPropertiesFormService = new FormService({
            messageFromFormSetter: setMessage,
            messagesFromForm: message,
            afterPostCallback: afterUpdateCallback,
            requestTemplate: itemCrudRequestTemplate
        }
    );

    const screenTitle = () => {
        return (
            <i>Create a new component of {ScreenStack.stackTop().label}</i>
        )
    }

    // Consolidate data initialization into a single useEffect
    useEffect(() => {
        const initializeData = async () => {
            if (ScreenStack.stackTop().activityState === CRUD_ACTION_INSERT) {
                setMessage("Insert New Component");
                let defaultParams = {
                    "id": 0,
                    "childId": 0,
                    "parentId": ScreenStack.stackTop().data.id,
                    "childDescription": "default",
                    "quantityPer": 1.0,
                    "unitCost": 0.0,
                    "extendedCost": 0.0,
                    "parentDescription": ScreenStack.stackTop().data.description,
                    "activityState": CRUD_ACTION_INSERT
                };
                setQueryParameters(defaultParams);
                return;
            }

            throw new Error("Unexpected activity state: " + ScreenStack.stackTop().activityState);
        };

        initializeData();
    }, []); // Runs once on mount


    const handleInputChange = (field) => {
        return (event) => {
            setQueryParameters({...queryParameters, [field]: event.target.value});
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


                {BomComponentsDto.map((col) => (
                    <TextField
                        key={col.headerName}
                        type={col.type}
                        size="small"
                        margin="dense"
                        name={col.field}
                        placeholder={col.placeholder}
                        value={queryParameters[col.field]}
                        label={col.headerName}
                        onChange={handleInputChange(col.field)}
                        slotProps={{
                            input: {
                                maxLength: 50
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
                    />
                ))}

                <Grid size={12} container spacing={2}>
                    <Button variant="outlined" tabIndex={workingTabIndex++} onClick={() => ScreenStack.pop()}>Return
                        without Saving</Button>

                    {ScreenStack.stackTop().activityState === CRUD_ACTION_INSERT && (
                        <Button type="submit" variant="outlined" name={bomCrudUrl}   value={CRUD_ACTION_INSERT}
                                tabIndex={workingTabIndex++}>Insert Component and Return</Button>
                    )}
                </Grid>
            </form>
        </div>
    );
}
export default BomProperties;
