import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import FormService, {extractMessageFromResponse, isShallowEqual} from "../FormService.js";
import {Box, Button, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';
import {CRUD_ACTION_CHANGE, CRUD_ACTION_DELETE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../crudAction.js";
import {ScreenStack} from "../Stack.js";
import {
    bomComponents,
    bomCrudUrl,
    bomWhereUsed,
    itemCrudRequestTemplate, itemExplosionReportUrl,
    itemMaxLevelReportUrl,
    ItemQueryParameterConfig,
    itemUpdateUrl, olderEmptyQueryConstant
} from "../Globals.js";
import {BomComponentsDto, BomDtoToString, BomParentsDto, ItemDtoToString } from "./ItemPropertiesConfig.js";
import {generateDefaultFromRules} from "../Metadata/ValidateRule.js";
import {useGridApiRef} from "@mui/x-data-grid";
import {DataGridHelper} from "../Objects/DataGridHelper.jsx";
import {ScreenTransition} from "../ScreenTransition.js";
import BomProperties from "./BomProperties.jsx";
import {PropertyGrid} from "../Objects/PropertyGrid.jsx";
import {
    ItemQueryRequestCrudInsertMetadata,
    ItemQueryRequestCrudUpdateMetadata
} from "./ItemQueryConfig.js";
import {ItemExplosion} from "./ItemExplosion.jsx";
import OrderMaster from "./OrderMaster.jsx";

const ItemProperties = () => {

    const [selectedRow, setSelectedRow] = useState( undefined );
    const apiRef = useGridApiRef();
    const [message, setMessage] = useState("");
    const [queryParameters, setQueryParameters] = useState();
    const [components, setComponents] = useState();
    const [saveButtonMessage, setSaveButtonMessage] = useState("Save Changes");
    const [whereUsed, setWhereUsed] = useState([]);
    const [ , setItemMasterQueryResults] = useState([]);

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
            messageFormSetter: setMessage,
            validationRules: ItemQueryRequestCrudUpdateMetadata,
            messagesFromForm: message,
            afterPostCallback: afterUpdateCallback,
            requestTemplate: itemCrudRequestTemplate
        }
    );
    const ItemPropertiesInsertFormService = new FormService({
            messageFormSetter: setMessage,
            validationRules: ItemQueryRequestCrudInsertMetadata,
            messagesFromForm: message,
            afterPostCallback: afterUpdateCallback,
            requestTemplate: itemCrudRequestTemplate
        }
    );

    const ItemExplosionFormService = new FormService({
            messageFormSetter: setItemMasterQueryResults,
            validationRules: ItemQueryParameterConfig,
            messagesFromForm: null,
            afterPostCallback: null,
            requestTemplate: null
        }
    );

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
                setComponents([]);
                setWhereUsed([]);
            } else if (ScreenStack.stackTop().activityState === CRUD_ACTION_CHANGE) {
                setSaveButtonMessage("Save Changes");
                currentParams = ScreenStack.stackTop().data[0];
                currentParams.crudAction = CRUD_ACTION_CHANGE;
                setQueryParameters(currentParams);

                // Now that we have currentParams, fetch components immediately
                try {
                    const objectToBeTransmitted = {"idToSearchFor": currentParams.id};
                    const componentResponse = await ItemPropertiesUpdateFormService.postData(objectToBeTransmitted, bomComponents);
                    setComponents(componentResponse.data.data);

                    const whereUsedResponse = await ItemPropertiesUpdateFormService.postData(objectToBeTransmitted, bomWhereUsed);
                    setWhereUsed(whereUsedResponse.data.data === undefined ? [] : whereUsedResponse.data.data);

                } catch (error) {
                    console.error("Error fetching components:", error);
                    setComponents([]);
                    setWhereUsed([]);
                }
            }
        };

        initializeData();
    }, []); // Runs once on mount

    useEffect(() => {
        if (components && components.length > 0) {
            const total = components.reduce((sum, c) => sum + (c.quantityPer * c.unitCost || 0), 0);
            console.log("Total extended cost is " + total);
            setQueryParameters(prev => {
                // Only update if the value actually changed to avoid unnecessary re-renders
                if (prev && prev.unitCost !== total) {
                    return {...prev, unitCost: total};
                }
                return prev;
            });
        }
    }, [components]);


    const handleInputChange = (rule) => {
        return (event) => {
            let value = event.target.value;
            if (rule.type === 'number') {
                value = value === '' ? undefined : Number(value);
            }
            setQueryParameters({...queryParameters, [rule.field]: value});
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

            //  Return the updated Component Row...
            return updatedRow
        }
        return updatedRow
    }

    async function transitionToComponentDelete() {
        if (selectedRow  === undefined ) {
            setMessage("Please select a row to delete.");
            return;
        }
        console.log("Selected BOM for deletion:", selectedRow);

        const objectToBeTransmitted = {
            updatedRows: [{...selectedRow, crudAction: CRUD_ACTION_DELETE}]
        };

        try {
            await ItemPropertiesUpdateFormService.postData(objectToBeTransmitted, bomCrudUrl);
            setComponents(prev => prev.filter(row => row.id !== selectedRow.id));
            setSelectedRow( undefined );
        } catch (error) {
            console.error("Error deleting component:", error);
            setMessage("Error deleting component: " + error.message);
        }
    }

    function transitionToComponentAdd() {
        ScreenStack.push(new ScreenTransition("Add Component for" + queryParameters, BomProperties, CRUD_ACTION_INSERT,
            queryParameters));
        setSelectedRow( undefined );
    }

    async function transitionToMaxLevelReport() {
        try {
            const response = await ItemExplosionFormService.postData(olderEmptyQueryConstant, itemMaxLevelReportUrl);

            if (response && response.data && response.data.data) {
                const data = response.data.data;
                const rowsWithIds = data.map((row, index) => ({
                    ...row,
                    id: row.id || (index + 1)
                }));

                let nextScreen = new ScreenTransition("Max Level Report", ItemExplosion, CRUD_ACTION_NONE, rowsWithIds);
                ScreenStack.push(nextScreen);
            } else {
                setMessage("Failed to fetch Max Level report data.");
            }
        } catch (error) {
            console.error("Error fetching Max Level report:", error);
            setMessage("Error loading Max Level report.");
        }
    }


    async function transitionToExplosion() {
        const parametersForExplosionRequest = { "parentId" : queryParameters.id, "childId" : 0  };
        const response = await ItemExplosionFormService.postData(parametersForExplosionRequest, itemExplosionReportUrl);

        if (response && response.data && response.data.data) {
            const data = response.data.data;
            const rowsWithIds = data.map((row, index) => ({
                ...row,
                id: row.id || (index + 1)
            }));
            let nextScreen = new ScreenTransition("ItemExplosion Master Report", ItemExplosion, CRUD_ACTION_NONE, rowsWithIds);
            ScreenStack.push(nextScreen);
        } else {
            setMessage("Failed to fetch explosion report data.");
        }
    }


    if (queryParameters === undefined) return (<div>Loading...</div>)
    if (components === undefined) return (<div>Loading...</div>)

    let workingTabIndex = 0;

    function renderInsertForm() {
        return (
            <div>
                <br/>

                <form onSubmit={ItemPropertiesInsertFormService.handleSubmit}>
                    <ErrorMessage message={message}/>
                    <br/>

                    <PropertyGrid label="Create a new item with the following details:"
                                  objectToPresent={queryParameters}
                                  validationRules={ItemQueryRequestCrudInsertMetadata}
                                  handleInputChangeCallback={handleInputChange}></PropertyGrid>

                    <Grid size={12} container spacing={2}>
                        <Grid size="auto">
                            <Button type="submit" variant="contained" name={itemUpdateUrl} sx={{ mr: 1 }}
                                    tabIndex={workingTabIndex++}  value={queryParameters.crudAction} >{saveButtonMessage}</Button>
                            <Button variant="outlined" tabIndex={workingTabIndex++} onClick={() => ScreenStack.pop()}>Return
                                without Saving</Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
    function renderUpdateOrDeleteForm() {
        return (
            <div>
                <br/>

                <form onSubmit={ItemPropertiesUpdateFormService.handleSubmit}>
                    <ErrorMessage message={message}/>
                    <br/>

                    <PropertyGrid label={queryParameters.description}
                                  objectToPresent={queryParameters}
                                  validationRules={ItemPropertiesUpdateFormService.validationRules}
                                  handleInputChangeCallback={handleInputChange}></PropertyGrid>

                    <br/>

                    <Grid size={12} container spacing={2}>
                        <Grid size="auto">
                            <Button type="submit" variant="contained" name={itemUpdateUrl} sx={{ mr: 1 }}
                                    tabIndex={workingTabIndex++}  value={CRUD_ACTION_CHANGE} >{saveButtonMessage}</Button>
                            <Button variant="outlined" tabIndex={workingTabIndex++} sx={{ mr: 1 }} onClick={() => ScreenStack.pop()}>Return
                                without Saving</Button>
                            <Button type="submit" variant="outlined" name={itemUpdateUrl} value={CRUD_ACTION_DELETE}
                                    tabIndex={workingTabIndex++} sx={{ mr: 1 }}>Delete this Item</Button>
                        </Grid>
                        <br/>
                        <Grid size="auto">
                            <Button variant="outlined" sx={{ mr: 1 }} onClick={transitionToMaxLevelReport}>Max Level Report</Button>
                            <Button variant="outlined" onClick={transitionToExplosion}>Item Explosion Report</Button>
                            <Button variant="outlined" sx={{ mr: 1 }} onClick={() => ScreenStack.push(new ScreenTransition("Show Orders for" + queryParameters, OrderMaster, CRUD_ACTION_NONE, queryParameters))}>Show Orders</Button>
                        </Grid>
                    </Grid>
                </form>

                <Box sx={{height: 400, width: '100%', mb: 10}}>
                    {ScreenStack.stackTop().activityState === CRUD_ACTION_CHANGE && (
                        <>
                            <DataGridHelper apiRef={apiRef}
                                            label={components.length === 0 ? "There are no components of " + queryParameters.description : "Components of " + queryParameters.description }
                                            rows={components}
                                            columns={BomComponentsDto}
                                            handleRowChangeCallback={ComponentsUpdateRowHandler}
                                            onSelectionChange={(rows) => setSelectedRow( rows[ 0 ] )}
                                            onCellClick={undefined}
                            />

                            <Grid container sx={{mt: 2}} size={{xs: 12}}>
                                <Grid size={{xs: 'auto'}}>
                                    <Button variant="outlined" sx={{ mr: 1 }} onClick={transitionToComponentDelete}>Delete Component</Button>
                                    <Button variant="outlined" onClick={transitionToComponentAdd}>Add</Button>

                                </Grid>
                            </Grid>

                            <DataGridHelper
                                label={whereUsed.length === 0 ? queryParameters.description + " is not a component of any item." : "Items where " + queryParameters.description + " is used."}
                                rows={whereUsed}
                                columns={BomParentsDto}
                                onSelectionChange={undefined}
                            />
                        </>
                    )}
                </Box>
            </div>
        );
    }

    switch (ScreenStack.stackTop().activityState) {
        case CRUD_ACTION_INSERT:
            return renderInsertForm();
        case CRUD_ACTION_CHANGE:
            return renderUpdateOrDeleteForm();
        default:
            return(
                <div>
                <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>
                    Illegal State:  Form Caller passed  {ScreenStack.stackTop().activityState}
                </Typography>
                </div>
            )
    }
}
export default ItemProperties;
