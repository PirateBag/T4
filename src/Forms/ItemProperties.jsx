import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import FormService, {extractMessageFromResponse, isShallowEqual} from "../FormService.js";
import {Box, Button, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_DELETE, CRUD_ACTION_INSERT} from "../crudAction.js";
import {ScreenStack} from "../Stack.js";
import {
    bomCrudUrl,
    bomFindItemParameters,
    itemCrudRequestTemplate,
    itemUpdateUrl,
    ItemQueryParameterConfig
} from "../Globals.js";
import {
    BomComponentsDto,
    BomDtoToString,
    ItemDtoToString,
    ItemRoDTO
} from "./ItemPropertiesConfig.js";
import {generateDefaultFromRules} from "../Metadata/ValidateRule.js";
import {DataGrid, useGridApiRef} from "@mui/x-data-grid";
import {ScreenTransition} from "../ScreenTransition.js";
import BomProperties from "./BomProperties.jsx";

const ItemProperties = () => {

    const apiRef = useGridApiRef();
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
            }
        } else {
            setMessage("Unknown error code in itemProperties.afterUpdateCallback");
        }
    }

    // Calculate the total extended cost
    const totalExtendedCost = components?.reduce((sum, component) => {
        const quantity = component.quantityPer || 0;
        const cost = component.unitCost || 0;
        return sum + (quantity * cost);
    }, 0) || 0;

    const adjustTotalExtendedCost = ({originalCost, newRow, oldRow}) => {
        const costAfterRemovingOldRow = originalCost - (oldRow.quantityPer * oldRow.unitCost);
        const costAfterAddingNewRow = costAfterRemovingOldRow + (newRow.quantityPer * newRow.unitCost);
        console.log("Adjusted total extended cost from " + originalCost + " to " + costAfterAddingNewRow);
        return costAfterAddingNewRow;
    }

    const ItemPropertiesUpdateFormService = new FormService({
            messageFromFormSetter: setMessage,
            messagesFromForm: message,
            afterPostCallback: afterUpdateCallback,
            requestTemplate: itemCrudRequestTemplate
        }
    );

    const itemNameForPresent = () => {
        return (
            <i>{queryParameters.id},{queryParameters.description}</i>
        )
    }

    // Consolidate data initialization into a single useEffect
    useEffect(() => {
        const initializeData = async () => {
            let currentParams;

            if (ScreenStack.stackTop().activityState === CRUD_ACTION_INSERT) {
                setMessage("Insert New Item");
                setSaveButtonMessage("Insert New Item");
                let defaultParams = generateDefaultFromRules(ItemQueryParameterConfig);
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
        updatedRow.extendedCost = updatedRow.quantityPer * updatedRow.unitCost;

        const objectToBeTransmitted = ItemPropertiesUpdateFormService.singleRowToRequest(updatedRow);
        await ItemPropertiesUpdateFormService.postData(objectToBeTransmitted, bomCrudUrl);
        console.log("Response " + BomDtoToString(updatedRow));

        if (updatedRow.extendedCost !== oldValue.extendedCost) {
            const line1 = "Extended component cost changed from " + oldValue.extendedCost + " to " + updatedRow.extendedCost;

            const proposedNewCostAfterAdjustments = adjustTotalExtendedCost(
                {
                    "originalCost": totalExtendedCost,
                    "newRow": updatedRow,
                    "oldRow": oldValue
                })


            const updatedQueryParameters = {...queryParameters, unitCost: proposedNewCostAfterAdjustments};
            setQueryParameters(updatedQueryParameters);

            const line2 = "Updated unit cost for parent: "
                + ItemDtoToString(updatedQueryParameters);
            console.log(line2);
            const finalMessage = (message ? message + "\n" : "") + line1 + "\n" + line2;
            setMessage(finalMessage);

            const objectToBeTransmitted = ItemPropertiesUpdateFormService.singleRowToRequest(updatedQueryParameters);
            await ItemPropertiesUpdateFormService.postData(objectToBeTransmitted, itemUpdateUrl);

            // // Clear focus from the cell after successful update
            // setTimeout(() => {
            //     apiRef.current.setCellFocus(0, '');
            // }, 0);

            //  Return the updated Component Row...
            return updatedRow
        }
        // // Clear focus even if extendedCost didn't change (still a successful update)
        // setTimeout(() => {
        //     apiRef.current.setCellFocus(0, '');
        // }, 0);
        return updatedRow
    }

    async function transitionToComponentDelete() {

        const selectedRows = apiRef.current.getSelectedRows();
        if (selectedRows.size === 0) {
            setMessage("Please select a row to delete.");
            return;
        }

        const selectedRow = selectedRows.values().next().value;
        console.log("Selected item for deletion:", selectedRow);

        const objectToBeTransmitted = {
            updatedRows: [{...selectedRow, crudAction: CRUD_ACTION_DELETE}]
        };

        try {
            await ItemPropertiesUpdateFormService.postData(objectToBeTransmitted, bomCrudUrl);
            setComponents(prev => prev.filter(row => row.id !== selectedRow.id));
        } catch (error) {
            console.error("Error deleting component:", error);
            setMessage("Error deleting component: " + error.message);
        }
    }

    function transitionToComponentAdd() {
        ScreenStack.push(new ScreenTransition("Add Component for" + queryParameters, BomProperties, CRUD_ACTION_INSERT,
                queryParameters ) );
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

                {/* 1. Prominent title for the main Grid/Form */}
                <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>
                    Details of <i> {itemNameForPresent()} </i>
                </Typography>

                <Grid container spacing={2} padding={2}>
                    {ItemRoDTO.map((col) => (
                        <Grid size="auto" key={col.headerName}>
                            <TextField
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
                        </Grid>
                    ))}


                    <Grid size={12} container spacing={2}>
                        <Grid size="auto">
                            <Button type="submit" variant="contained" name={itemUpdateUrl}
                                    tabIndex={workingTabIndex++}>{saveButtonMessage}</Button>
                        </Grid>
                        <Grid size="auto">
                            <Button variant="outlined" tabIndex={workingTabIndex++} onClick={() => ScreenStack.pop()}>Return
                                without Saving</Button>
                        </Grid>
                        {ScreenStack.stackTop().activityState === CRUD_ACTION_CHANGE && (
                            <Grid size="auto">
                                <Button type="submit" variant="outlined" name={itemUpdateUrl} value={CRUD_ACTION_DELETE}
                                        tabIndex={workingTabIndex++}>Delete</Button>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </form>


            <Box sx={{height: 400, width: '100%', mb: 10}}>

                <Typography variant="h6" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>
                    Components of {itemNameForPresent()}
                </Typography>


                {components.length === 0 ? (
                    "No Components"
                ) : (

                    <DataGrid columns={BomComponentsDto}
                              apiRef={apiRef}
                              rows={components}
                              density="compact"
                              editMode="cell"
                              rowSelection={true}
                              getRowId={(row) => row.id}
                              processRowUpdate={ComponentsUpdateRowHandler}
                              columnHeaderHeight={60} // Increase height to accommodate multiple lines
                              sx={{
                                  '& .MuiDataGrid-columnHeaderTitle': {
                                      whiteSpace: 'normal',
                                      lineHeight: 'normal',
                                  },
                                  '& .MuiDataGrid-cell': {
                                      cursor: 'pointer',
                                  },
                                  '& .MuiDataGrid-cell:focus': {
                                      outline: 'solid 2px blue',
                                  },
                                  '& .MuiDataGrid-cell:focus-within': {
                                      outline: 'solid 2px blue',
                                  },
                                  '& .MuiDataGrid-columnHeader:focus': {
                                      outline: 'solid 2px blue',
                                  },
                                  '& .MuiDataGrid-columnHeader:focus-within': {
                                      outline: 'solid 2px blue',
                                  },
                              }}
                              onProcessRowUpdateError={(error) => console.error("Row update failed:", error)}
                              slots={{
                                  footer: () => null,
                              }}
                    />
                )}
                <Grid container sx={{mt: 2}} size={{xs: 12}}>
                    <Grid size={{xs: 'auto'}}>
                        <Button variant="outlined" onClick={transitionToComponentDelete}>Delete</Button>
                        <Button variant="outlined" onClick={transitionToComponentAdd}>Add</Button>
                    </Grid>
                </Grid>

            </Box>
        </div>
    );
}
export default ItemProperties;
