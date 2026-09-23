import {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {Box, Button, Typography} from '@mui/material';
import ReturnButton from "../Objects/ReturnButton.jsx";
import Grid from '@mui/material/Grid';
import {CRUD_ACTION_CHANGE, CRUD_ACTION_DELETE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {ScreenStack} from "../Stack.js";
import {
    bomComponents,
    bomCrudUrl,
    bomWhereUsed,
    itemExplosionReportUrl,
    itemMaxLevelReportUrl,
    ItemQueryParameterConfig,
    itemUpdateUrl, olderEmptyQueryConstant,
    genericSingleRequest, balanceProjectionUrl} from "../Globals.js";
import {
    BomComponentsDto,
    BomDtoToString,
    BomParentsDto,
    ItemDtoToString,
    ParentItemRules
} from "./ItemPropertiesConfig.js";
import {generateDefaultFromRules} from "../Metadata/ValidateRule.js";
import {useGridApiRef} from "@mui/x-data-grid";
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import {loadItemPickListAll} from "../Objects/ItemPickListService";
import {ScreenTransition} from "../ScreenTransition.js";
import BomProperties from "./BomProperties.jsx";
import {PropertyGrid} from "../Objects/PropertyGrid.jsx";
import {
    ItemQueryRequestCrudInsertMetadata
} from "./ItemQueryConfig.js";
import {ItemExplosion} from "./ItemExplosion.jsx";
import OrderMaster from "./OrderMaster.jsx";
import {postData} from "../HttpUtils.js";
import GenericText from "./GenericText.jsx";
import {saveCrudObjects} from "../lib/masterSaveChanges.js";
import {isShallowEqual} from "../lib/isShallowEqual.js";

const ItemProperties = () => {

    const [selectedRow, setSelectedRow] = useState( undefined );
    const apiRef = useGridApiRef();
    const [message, setMessage] = useState("");
    const [queryParameters, setQueryParameters] = useState( [] );
    const [components, setComponents] = useState();
    const [saveButtonMessage, setSaveButtonMessage] = useState("Save");
    const [whereUsed, setWhereUsed] = useState([]);
    const [itemOptions, setItemOptions] = useState([]);


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

    // Consolidate data initialization into a single useEffect
    useEffect(() => {
        const initializeData = async () => {
            if (ScreenStack.stackTop().activityState === CRUD_ACTION_INSERT) {
                setMessage("Insert New Item");
                setSaveButtonMessage("Insert New Item");
                let defaultParams = generateDefaultFromRules(ItemQueryParameterConfig);
                defaultParams.crudAction = CRUD_ACTION_INSERT;
                const currentParams = {
                    ...defaultParams,
                    crudAction: ScreenStack.stackTop().activityState
                };
                setQueryParameters([currentParams]);
                setComponents([]);
                setWhereUsed([]);
            } else if (ScreenStack.stackTop().activityState === CRUD_ACTION_CHANGE) {
                setSaveButtonMessage("Save");
                const currentParentItems = ScreenStack.stackTop().data;
                setQueryParameters( currentParentItems );

                try {
                    const objectToBeTransmitted = {"idToSearchFor": currentParentItems[ 0 ].id};
                    const componentResponse = await postData({ parameters: objectToBeTransmitted, url: bomComponents });
                    setComponents(componentResponse.data.data);

                    const whereUsedResponse = await postData({ parameters: objectToBeTransmitted, url: bomWhereUsed });
                    setWhereUsed(whereUsedResponse.data.data === undefined ? [] : whereUsedResponse.data.data);

                    await loadItemPickListAll({
                        responseSetter: (data) => {
                            const formatted = data.map(item => ({
                                value: item.id,
                                label: item.external
                            }));
                            setItemOptions(formatted);
                        },
                        errorMessageSetter: setMessage
                    });

                } catch (error) {
                    console.error("Error fetching components, whereUsed or picklists:", error);
                    setComponents([]);
                    setWhereUsed([]);
                    setItemOptions([]);
                }
            }
        };

        initializeData();
    }, []); // Runs once on mount

    useEffect(() => {
        if (components && components.length > 0) {
            const total = components.reduce((sum, c) => sum + (c.quantityPer * c.unitCost || 0), 0);
            console.log("Total extended cost is " + total);
            const oldParent = queryParameters[0];

            if ( oldParent.unitCost !== total ) {
                setQueryParameters([{...oldParent, unitCost: total}]);
            }
        }
    }, [components]);


    const handleSelectionChange = (rows) => {
        const clickedRow = rows?.[0];
        if (!clickedRow) {
            setSelectedRow(undefined);
            return;
        }
        setSelectedRow(prev => {
            if (prev && (prev.id === clickedRow.id || prev === clickedRow || isShallowEqual(prev, clickedRow))) {
                return undefined;
            }
            return clickedRow;
        });
    };

    const handlePropertiesInputChange = (rule) => {
        return (event) => {
            let value = rule.type === 'checkbox' ? event.target.checked : event.target.value;
            if (rule.type === 'number') {
                value = value === '' ? undefined : Number(value);
            }
            if (Array.isArray(queryParameters)) {
                const current = queryParameters[0] || {};
                setQueryParameters([{...current, [rule.field]: value}]);
            } else {
                setQueryParameters({...queryParameters, [rule.field]: value});
            }
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

        const objectToBeTransmitted = { 'rows' : [updatedRow]};
        await postData({ parameters: objectToBeTransmitted, url: bomCrudUrl });
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
            setQueryParameters( [updatedQueryParameters]);

            const line2 = "Updated unit cost for parent: "
                + ItemDtoToString(updatedQueryParameters);
            console.log(line2);
            const finalMessage = (message ? message + "\n" : "") + line1 + "\n" + line2;
            setMessage(finalMessage);

            const objectToBeTransmitted = { 'rows' : [updatedQueryParameters]  };
            await postData({ parameters: objectToBeTransmitted, url: itemUpdateUrl });

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
        const objectToBeTransmitted = {
            updatedRows: [{...selectedRow, crudAction: CRUD_ACTION_DELETE}]
        };

        try {
            await postData({ parameters: objectToBeTransmitted, url: bomCrudUrl });
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
            const response = await postData({ parameters: olderEmptyQueryConstant, url: itemMaxLevelReportUrl });

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
        const response = await postData({ parameters: parametersForExplosionRequest, url: itemExplosionReportUrl });

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

    async function transitionToBalanceProjection() {
        const balanceLogs =  await Promise.all(  [postData( {'parameters' : {...genericSingleRequest, idToSearchFor: queryParameters.id}
            , 'url' : balanceProjectionUrl}) ] );
        const dataAfterResponseFluff = balanceLogs[0].data?.data || [];
        let nextScreen = new ScreenTransition("balance projection", GenericText, CRUD_ACTION_NONE, dataAfterResponseFluff);
        ScreenStack.push(nextScreen);
    }

    async function saveParentItemChanges() {
        if (selectedRow) {
            if (Array.isArray(selectedRow) && selectedRow.length === 1) {
                selectedRow[0].crudAction = CRUD_ACTION_DELETE;
            } else if (!Array.isArray(selectedRow)) {
                selectedRow.crudAction = CRUD_ACTION_DELETE;
            }
        }
        await saveCrudObjects({ objectToBeTransmitted: queryParameters, messageSetter: setMessage, updatedRowsSetter: setQueryParameters, updateUrl: itemUpdateUrl });
    }

    // function deleteParentItem() {
    //     if (selectedRow?.length === 1) { selectedRow[ 0 ].crudAction = CRUD_ACTION_DELETE };
    //     await saveCrudObjects({ objectToBeTransmitted: queryParameters, messageSetter: setMessage, updatedRowsSetter: setQueryParameters, updateUrl: itemUpdateUrl });
    // }




    if (queryParameters === undefined) return (<div>
        <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>Loading Item Master</Typography>
        </div>);
    if (components === undefined ) return (<div>
        <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>Loading Components</Typography></div>);


    let workingTabIndex = 0;

    function renderInsertForm() {
        return (
            <div>
                <br/>

                    <ErrorMessage message={message}/>
                    <br/>

                    <PropertyGrid label="Create a new item with the following details:"
                                  objectToPresent={queryParameters[0] || queryParameters}
                                  validationRules={ItemQueryRequestCrudInsertMetadata}
                                  handleInputChangeCallback={handlePropertiesInputChange}
                                  pickListsForSelect={{ childId: itemOptions }}
                                  actionLabel='Save'
                                  messageFormSetter={setMessage}
                                  url={itemUpdateUrl}/>
            </div>
        );
    }
    function renderUpdateOrDeleteForm() {
        return (
            <div>
                <br/>
                    <ErrorMessage message={message}/>
                <br/>


                <DataGridHelper
                    label={queryParameters[0].description }
                    rows={queryParameters}
                    columns={ParentItemRules}
                    hideFooter={true}
                    setRows={setQueryParameters}
                    // handleRowChangeCallback={defaultHandleComponentRowUpdate}
                    onSelectionChange={handleSelectionChange}
                    // onCellClick={undefined}
                    // pickListsForSelect={{ childId: itemOptions }}
                />



                <Grid size={12} container spacing={2}>
                    <Grid size="auto">
                        <Button variant="contained" onClick={saveParentItemChanges} sx={{ mr: 1 }}
                                >{saveButtonMessage}</Button>
                        <ReturnButton label="Return" tabIndex={workingTabIndex++} sx={{ mr: 1 }} noContainer />
                        <Button variant="outlined" onClick={saveParentItemChanges}
                                sx={{ mr: 1 }}
                                disabled={!selectedRow || Object.keys(selectedRow).length === 0}>Delete</Button>
                    </Grid>
                    <br/>
                    <Grid size="auto">
                        <Button variant="outlined" sx={{ mr: 1 }} onClick={transitionToMaxLevelReport}>Max Level Report</Button>
                        <Button variant="outlined" sx={{ mr: 1 }} onClick={transitionToExplosion}>Item Explosion Report</Button>
                        <Button variant="outlined" sx={{ mr: 1 }} onClick={transitionToBalanceProjection}>Balance Projection</Button>
                        <Button variant="outlined" sx={{ mr: 1 }} onClick={() => ScreenStack.push(new ScreenTransition("Show Orders for" + queryParameters, OrderMaster, CRUD_ACTION_NONE, queryParameters))}>Show Orders</Button>
                    </Grid>
                </Grid>

                <Box sx={{height: 400, width: '100%', mb: 10}}>
                    {ScreenStack.stackTop().activityState === CRUD_ACTION_CHANGE && (
                        <>
                            <DataGridHelper apiRef={apiRef}
                                            label={components.length === 0 ? "There are no components of " + queryParameters[0].description : "Components of " + queryParameters[0].description }
                                            rows={components}
                                            columns={BomComponentsDto}
                                            handleRowChangeCallback={ComponentsUpdateRowHandler}
                                            onSelectionChange={handleSelectionChange}
                                            onCellClick={undefined}
                                            pickListsForSelect={{ childId: itemOptions }}
                            />

                            <Grid container sx={{mt: 2}} size={{xs: 12}}>
                                <Grid size={{xs: 'auto'}}>
                                    <Button variant="outlined" sx={{ mr: 1 }} onClick={transitionToComponentDelete}>Delete Component</Button>
                                    <Button variant="outlined" onClick={transitionToComponentAdd}>Add</Button>

                                </Grid>
                            </Grid>

                            <DataGridHelper
                                label={whereUsed.length === 0 ? queryParameters[0].description + " is not a component of any item." : "Items where " + queryParameters[0].description + " is used."}
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
