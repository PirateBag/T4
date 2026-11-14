import {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {Box, Button, Typography} from '@mui/material';
import ReturnButton from "../Buttons/ReturnButton.jsx";
import Grid from '@mui/material/Grid';
import {CRUD_ACTION_CHANGE, CRUD_ACTION_DELETE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {ScreenStack} from "../Stack.js";
import {
    bomComponents,
    bomCrudUrl,
    bomWhereUsed,
    ItemQueryParameterConfig,
    itemCrudUrl} from "../Globals.js";
import {
    BomComponentsDto,
    BomDtoToString,
    BomParentsDto,
    ItemDtoToString,
    ParentItemRules
} from "./ItemPropertiesConfig.js";
import {generateDefaultFromRules} from "../Metadata/ValidateRule.js";

import DataGridHelper from "../Objects/DataGridHelper.jsx";
import {descriptionFromId, itemPickListLoader} from "../Objects/ItemPickListService";
import {ScreenTransition} from "../ScreenTransition.js";
import OrderMaster from "./OrderMaster.jsx";
import {postData} from "../HttpUtils.js";
import {saveCrudObjects} from "../lib/saveCrudObjects.js";
import {isShallowEqual} from "../lib/isShallowEqual.js";
import {MaxLevelButton} from "../Buttons/MaxLevelButton.jsx";
import {ItemExplosionButton} from "../Objects/ItemExplosionButton.jsx";
import {BalanceProjectionButton} from "../Buttons/BalanceProjectionButton.jsx";
import {randomId} from "../lib/randomId.js";

const ItemProperties = () => {

    const [selectedComponentRow, setSelectedComponentRow] = useState( null );
    const [message, setMessage] = useState("");
    const [queryParameters, setQueryParameters] = useState( [] );
    const [components, setComponents] = useState();
    const [saveButtonMessage, setSaveButtonMessage] = useState("Save");
    const [whereUsed, setWhereUsed] = useState([]);
    const [itemPickList, setItemPickList] = useState([]);


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


                } catch (error) {
                    console.error("Error fetching components, whereUsed or picklists:", error);
                    setComponents([]);
                    setWhereUsed([]);
                    setItemPickList([]);
                }
            }
        };

        initializeData();
        itemPickListLoader(
            { 'responseSetter' : setItemPickList,'errorMessageSetter': setMessage } )
            .then(r => console.log( r ) );

    }, []); // Runs once on mount

    useEffect(() => {
        if (components && components.length > 0) {
            const total = components.reduce((sum, c) => sum + (c.quantityPer * c.unitCost || 0), 0);
            console.log("Total extended cost is " + total);
            const oldParent = queryParameters[0];

            if ( oldParent && oldParent.unitCost !== total ) {
                setQueryParameters([{...oldParent, unitCost: total}]);
            }
        }
    }, [components]);



    const handleRowSelectionChange = (rows) => {
        setSelectedComponentRow(rows?.[0] ?? null);
    };



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
            await postData({ parameters: objectToBeTransmitted, url: itemCrudUrl });

            //  Return the updated Component Row...
            return updatedRow
        }
        return updatedRow
    }

    const addItemToQueryResults = () => {
        const newItem = {
            id: randomId(),
            parentId: queryParameters[0]?.id,
            unitCost: 0.0,
            quantityPer: 0,
            extendedCost: 0.0,
            crudAction: CRUD_ACTION_INSERT
        };

        setComponents( prev => [newItem, ...(prev || [])] );
    };

    const deleteRowFromQueryResults = () => {
        if (!selectedComponentRow || selectedComponentRow.id <= 100000) return;
        setComponents(prev => prev.filter(row => row.id !== selectedComponentRow.id));
        setSelectedComponentRow( null );
    };

    async function saveParentItemChanges() {
        if (selectedComponentRow) {
            if (Array.isArray(selectedComponentRow) && selectedComponentRow.length === 1) {
                selectedComponentRow[0].crudAction = CRUD_ACTION_DELETE;
            } else if (!Array.isArray(selectedComponentRow)) {
                selectedComponentRow.crudAction = CRUD_ACTION_DELETE;
            }
        }
        await saveCrudObjects({ objectToBeTransmitted: queryParameters, messageSetter: setMessage, updatedRowsSetter: setQueryParameters, updateUrl: itemCrudUrl });
    }


    if (queryParameters === undefined) return (<div>
        <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>Loading Item Master</Typography>
        </div>);
    if (components === undefined ) return (<div>
        <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>Loading Components</Typography></div>);

    function renderUpdateOrDeleteForm() {
        const isAnItemSelected = Boolean(selectedComponentRow);
        if ( itemPickList === undefined || itemPickList.length === 0) return "";
        return (
            <div>
                <ErrorMessage message={message}/>

                <DataGridHelper
                    label={descriptionFromId( { pickList: itemPickList, id: queryParameters[0]?.id }) }
                    rows={queryParameters}
                    columns={ParentItemRules}
                    hideFooter={true}
                    setRows={setQueryParameters}
                    // handleRowChangeCallback={defaultHandleComponentRowUpdate}
                    onSelectionChange={handleRowSelectionChange}
                    // onCellClick={undefined}
                    getRowClassName={(params) => (params.row === selectedComponentRow || (selectedComponentRow && params.row?.id !== undefined && params.row?.id === selectedComponentRow?.id)) ? 'selected-row' : ''}
                    sx={{'& .selected-row .MuiDataGrid-cell': {backgroundColor: '#e3f2fd'}}}
                    showCellVerticalBorder={true}
                    showColumnVerticalBorder={true}
                />


                <Grid size={12} container spacing={2}>
                    <Grid size="auto">
                        <Button variant="contained" onClick={saveParentItemChanges} sx={{ mr: 1 }}
                                >{saveButtonMessage}</Button>
                        <ReturnButton label="Return" sx={{ mr: 1 }} noContainer />
                        <Button variant="outlined" onClick={saveParentItemChanges}
                                sx={{ mr: 1 }}>Delete Item</Button>
                    </Grid>
                    <br/>
                    <Grid size="auto">
                        <MaxLevelButton messageSetter={setMessage}/>
                        <ItemExplosionButton parentItemId={0} messageSetter={setMessage}/>
                        <BalanceProjectionButton />
                        <Button variant="outlined" sx={{ mr: 1 }} onClick={() => ScreenStack.push(new ScreenTransition("Show Orders for" + queryParameters, OrderMaster, CRUD_ACTION_NONE, queryParameters))}>Show Orders</Button>
                    </Grid>
                </Grid>

                <Box sx={{height: 400, width: '100%', mb: 10}}>
                    {ScreenStack.stackTop().activityState === CRUD_ACTION_CHANGE && (
                        <>
                            <DataGridHelper label={components.length === 0 ? "There are no components of " + queryParameters[0]?.description : "Components of " + queryParameters[0]?.description }
                                            rows={components}
                                            columns={BomComponentsDto}
                                            handleRowChangeCallback={ComponentsUpdateRowHandler}
                                            onSelectionChange={handleRowSelectionChange}
                                            pickListsForSelect={{ childId: itemPickList }}
                                            getRowClassName={(params) => (params.row === selectedComponentRow || (selectedComponentRow && params.row?.id !== undefined && params.row?.id === selectedComponentRow?.id)) ? 'selected-row' : ''}
                                            sx={{'& .selected-row .MuiDataGrid-cell': {backgroundColor: '#e3f2fd'}}}
                                            showCellVerticalBorder={true}
                                            showColumnVerticalBorder={true}
                            />

                            <Grid container sx={{mt: 2}} size={{xs: 12}}>
                                <Grid size={{xs: 'auto'}}>
                                    <Button variant="outlined" sx={{ mr: 1 }} onClick={addItemToQueryResults}>New Component</Button>
                                    <Button variant="outlined" sx={{ mr: 1 }} onClick={deleteRowFromQueryResults} disabled={!isAnItemSelected }>Delete</Button>

                                </Grid>
                            </Grid>

                            <DataGridHelper
                                label={whereUsed.length === 0 ? queryParameters[0]?.description + " is not a component of any item." : "Items where " + queryParameters[0]?.description + " is used."}
                                rows={whereUsed}
                                columns={BomParentsDto}
                                onSelectionChange={handleRowSelectionChange}
                                getRowClassName={(params) => (params.row === selectedComponentRow || (selectedComponentRow && params.row?.id !== undefined && params.row?.id === selectedComponentRow?.id)) ? 'selected-row' : ''}
                                sx={{'& .selected-row .MuiDataGrid-cell': {backgroundColor: '#e3f2fd'}}}
                                showCellVerticalBorder={true}
                                showColumnVerticalBorder={true}
                            />
                        </>
                    )}
                </Box>
            </div>
        );
    }
    return renderUpdateOrDeleteForm();
}
export default ItemProperties;
