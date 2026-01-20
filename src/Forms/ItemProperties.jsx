import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {extractMessageFromResponse, FormService, isShallowEqual} from "../FormService.js";
import {Box, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_DELETE, CRUD_ACTION_INSERT} from "../crudAction.js";
import {ScreenStack} from "../Stack.js";
import {
    bomCrudUrl,
    bomFindItemParameters,
    itemCrudRequestTemplate,
    itemUpdateUrl,
    queryParameterConfig
} from "../Globals.js";
import {ItemDtoToStringWithOperation, ItemRoDTO, BomComponentsDto, BomDtoToString} from "./ItemPropertiesConfig.js";
import {generateDefaultFromRules} from "../Metadata/ValidateRule.js";
import {DataGrid} from "@mui/x-data-grid";

const ItemProperties = (  ) => {

    const [message, setMessage] = useState("");
    const [queryParameters, setQueryParameters] = useState();
    const [components, setComponents] = useState();
    const [saveButtonMessage, setSaveButtonMessage] = useState("Save Changes");

    const afterUpdateCallback = (response) => {
        console.log("afterQueryCallback received:", response.status);
        if (response.status === 200) {
            const possibleErrorMessages = extractMessageFromResponse(response);
            if (possibleErrorMessages.length > 0) {
                setMessage(possibleErrorMessages);
                return;
            }
            setMessage(ItemDtoToStringWithOperation(response.data.data[0]));
        } else {
            setMessage("Error");
        }
    }

    // Calculate the total extended cost
    const totalExtendedCost = components?.reduce((sum, component) => {
        const quantity = component.quantityPer || 0;
        const cost = component.unitCost || 0;
        return sum + (quantity * cost);
    }, 0) || 0;

    const ItemPropertiesUpdateFormService = new FormService({
            messageFromFormSetter: setMessage,
            messagesFromForm: message,
            afterPostCallback: afterUpdateCallback,
            requestTemplate: itemCrudRequestTemplate
        }
    );

    // Consolidate data initialization into a single useEffect
    useEffect(() => {
        const initializeData = async () => {
            let currentParams;

            if (ScreenStack.stackTop().activityState === CRUD_ACTION_INSERT) {
                setMessage("Insert New Item");
                setSaveButtonMessage("Insert New Item");
                let defaultParams = generateDefaultFromRules(queryParameterConfig);
                defaultParams.crudAction = CRUD_ACTION_INSERT;
                currentParams = {
                    ...defaultParams,
                    crudAction: ScreenStack.stackTop().activityState
                };
                setQueryParameters(currentParams);
                setComponents([]); // No components for a brand new item
            } else if (ScreenStack.stackTop().activityState === CRUD_ACTION_CHANGE) {
                setSaveButtonMessage("Save Changes");
                currentParams = ScreenStack.stackTop().data[0];
                currentParams.crudAction = CRUD_ACTION_CHANGE;
                setQueryParameters(currentParams);

                // Now that we have currentParams, fetch components immediately
                try {
                    const objectToBeTransmitted = ItemPropertiesUpdateFormService.singleRowToRequest(currentParams);
                    const componentResponse = await ItemPropertiesUpdateFormService.postData(objectToBeTransmitted, bomFindItemParameters);
                    setComponents(componentResponse.data.data);
                } catch (error) {
                    console.error("Error fetching components:", error);
                    setComponents([]);
                }
            }
        };

        initializeData();
    }, []); // Runs once on mount

    useEffect(() => {
        if (components && components.length >= 0) {
            const total = components.reduce((sum, c) => sum + (c.quantityPer * c.unitCost || 0), 0);

            setQueryParameters(prev => {
                // Only update if the value actually changed to avoid unnecessary re-renders
                if (prev && prev.unitCost !== total) {
                    return {...prev, unitCost: total};
                }
                return prev;
            });
        }
    }, [components]);


    const handleInputChange = (field) => {
        return (event) => {
            setQueryParameters({...queryParameters, [field]: event.target.value});
        }
    }

    async function ComponentsUpdateRowHandler(newValue, oldValue) {
        if (isShallowEqual(newValue, oldValue)) {
            console.log("Row " + oldValue.id + " unchanged, skipping update");
            return;
        }
        newValue.crudAction = newValue.crudAction === CRUD_ACTION_INSERT ? CRUD_ACTION_INSERT : CRUD_ACTION_CHANGE;
        const updatedRow = {...newValue};

        const objectToBeTransmitted = ItemPropertiesUpdateFormService.singleRowToRequest(updatedRow);
        await ItemPropertiesUpdateFormService.postData(objectToBeTransmitted, bomCrudUrl);
        console.log("Response " + BomDtoToString(updatedRow));

        if (updatedRow.extendedCost !== oldValue.extendedCost) {
            console.log("Extended component cost changed from " + oldValue.extendedCost + " to " + updatedRow.extendedCost);
            const proposedNewExtendedCost = totalExtendedCost;
            console.log("Proposed new unit cost for parent {} ", proposedNewExtendedCost);
            return updatedRow
        }
    }

        if (queryParameters === undefined) return (<div>Loading...</div>)
        if (components === undefined) return (<div>Loading...</div>)

        let workingTabIndex = 0;
        return (
            <div>
                <br/>
                <form onSubmit={ItemPropertiesUpdateFormService.handleSubmit}>
                    <ErrorMessage message={message}/>
                    <br/>

                    <Grid container spacing={2} padding={2}>
                        {ItemRoDTO.map((col) => (
                            <TextField
                                type={col.type}
                                key={col.headerName}
                                size="small"
                                margin="dense"
                                name={col.domainName}
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

                        <Grid container spacing={2} padding={2} size={{xs: 12}}>
                            <Button type="submit" variant="contained" name={itemUpdateUrl}
                                    tabIndex={workingTabIndex++}>{saveButtonMessage}</Button>
                            <Button variant="outlined" tabIndex={workingTabIndex++} onClick={() => ScreenStack.pop()}>Return
                                without Saving</Button>
                            {ScreenStack.stackTop().activityState === CRUD_ACTION_CHANGE && (
                                <Button type="submit" variant="outlined" name={itemUpdateUrl} value={CRUD_ACTION_DELETE}
                                        tabIndex={workingTabIndex++}>Delete</Button>
                            )}
                        </Grid>
                    </Grid>
                </form>


                <Box sx={{height: 400, width: '100%', mb: 10}}>
                    {components.length === 0 ? (
                        "No Components"
                    ) : (
                        <DataGrid columns={BomComponentsDto}
                                  rows={components}
                                  density="compact"
                                  processRowUpdate={ComponentsUpdateRowHandler}
                                  columnHeaderHeight={60} // Increase height to accommodate multiple lines
                                  sx={{
                                      '& .MuiDataGrid-columnHeaderTitle': {
                                          whiteSpace: 'normal',
                                          lineHeight: 'normal',
                                      },
                                  }                                  }
                                  onProcessRowUpdateError={(error) => console.error("Row update failed:", error)}
                        />
                    )}
                    <Grid size={{xs: 12}}>
                        <Button variant="outlined">Add</Button>
                    </Grid>

                </Box>
            </div>
        );
    }
 export default ItemProperties;