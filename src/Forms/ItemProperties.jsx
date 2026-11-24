import React, {useEffect, useState} from 'react';
import ErrorMessage from "../ErrorMessage.jsx";
import {Box, Button, Typography} from '@mui/material';
import {CRUD_ACTION_DELETE, CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {ScreenStack} from "../Stack.js";
import {bomComponents, bomCrudUrl, bomWhereUsed, itemCrudUrl} from "../Globals.js";
import {
    BomComponentsDto,
    BomParentsDto,
    ParentItemRules
} from "./ItemPropertiesConfig.js";
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import {descriptionFromId, itemPickListLoader} from "../Objects/ItemPickListService";
import {ScreenTransition} from "../ScreenTransition.js";
import OrderMaster from "./OrderMaster.jsx";
import {postData} from "../HttpUtils.js";

import {MaxLevelButton} from "../Buttons/MaxLevelButton.jsx";
import {ItemExplosionButton} from "../Objects/ItemExplosionButton.jsx";
import {BalanceProjectionButton} from "../Buttons/BalanceProjectionButton.jsx";
import {randomId} from "../lib/randomId.js";

const ItemProperties = () => {

    const [selectedParentRow, setSelectedParentRow] = useState(null);
    const [selectedComponentRow, setSelectedComponentRow] = useState(null);
    const [message, setMessage] = useState("");
    const [queryParameters, setQueryParameters] = useState([]);
    const [components, setComponents] = useState();
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
            const currentParentItems = ScreenStack.stackTop().data;
            setQueryParameters(currentParentItems);

            try {
                const objectToBeTransmitted = {"idToSearchFor": currentParentItems[0].id};
                const componentResponse = await postData({parameters: objectToBeTransmitted, url: bomComponents});
                setComponents(componentResponse.data.data);

                const whereUsedResponse = await postData({parameters: objectToBeTransmitted, url: bomWhereUsed});
                setWhereUsed(whereUsedResponse.data.data === undefined ? [] : whereUsedResponse.data.data);


            } catch (error) {
                console.error("Error fetching components, whereUsed or picklists:", error);
                setComponents([]);
                setWhereUsed([]);
                setItemPickList([]);
            }
        }

        initializeData().then(r => r);
        itemPickListLoader(
            {'responseSetter': setItemPickList, 'errorMessageSetter': setMessage})
            .then(r => console.log(r));

    }, []); // Runs once on mount

    useEffect(() => {
        if (components && components.length > 0) {
            const total = components.reduce((sum, c) => sum + (c.quantityPer * c.unitCost || 0), 0);
            console.log("Total extended cost is " + total);
            const oldParent = queryParameters[0];

            if (oldParent && oldParent.unitCost !== total) {
                setQueryParameters([{...oldParent, unitCost: total}]);
            }
        }
    }, [components]);

    const handleParentRowSelectChange = (rows) => {
        setSelectedParentRow(rows?.[0] ?? null);
        setMessage( null );

    };

    const handleComponentRowSelectionChange = (rows) => {
        setSelectedComponentRow(rows?.[0] ?? null);
        setMessage( null );
    };

    const showLog = (label, rows)  => {
        console.log( label + JSON.stringify(rows) );
        setMessage( JSON.stringify( rows, null, 2  ) );
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

        setComponents(prev => [newItem, ...(prev || [])]);
    };

    const deleteRowFromQueryResults = () => {
        if ( selectedComponentRow)
        if ( selectedComponentRow.id <= 100000) {
            setComponents(prev => prev.map(row =>
                row.id === selectedComponentRow.id ? {...row, crudAction: CRUD_ACTION_DELETE} : row
            ));
            setMessage( "Press 'SAVE' to complete deletion.")
            return;
        }
        setComponents(prev => prev.filter(row => row.id !== selectedComponentRow.id));
        setSelectedComponentRow(null);
    };

    if (queryParameters === undefined) return (<div>
        <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>Loading Item Master</Typography>
    </div>);
    if (components === undefined) return (<div>
        <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>Loading Components</Typography>
    </div>);

    const isAnItemSelected = Boolean(selectedComponentRow);
    if (itemPickList === undefined || itemPickList.length === 0) return "";

    return (
        <div>
            <ErrorMessage message={message}/>

            <DataGridHelper
                label={descriptionFromId({pickList: itemPickList, id: queryParameters[0]?.id})}
                rows={queryParameters}
                columns={ParentItemRules}
                hideFooter={true}
                setRows={setQueryParameters}
                setMessage={setMessage}
                onSelectionChange={handleParentRowSelectChange}
                getRowClassName={(params) => (params.row === selectedParentRow || (selectedParentRow && params.row?.id !== undefined && params.row?.id === selectedParentRow?.id)) ? 'selected-row' : ''}
                sx={{'& .selected-row .MuiDataGrid-cell': {backgroundColor: '#e3f2fd'}}}
                showCellVerticalBorder={true}
                showColumnVerticalBorder={true}

                submitButton={{'label': 'Save', 'url': itemCrudUrl}}
                extraButtons={
                    <>
                        <MaxLevelButton messageSetter={setMessage}/>
                        <ItemExplosionButton parentItemId={0} messageSetter={setMessage}/>
                        <BalanceProjectionButton/>
                        <Button variant="outlined" sx={{mr: 1}}
                                onClick={() => ScreenStack.push(new ScreenTransition("Show Orders for" + queryParameters, OrderMaster, CRUD_ACTION_NONE, queryParameters))}>Show
                            Orders</Button>
                    </>
                }
            />


            <Box sx={{height: 400, width: '100%', mb: 10}}>
                <DataGridHelper
                    label={components.length === 0 ? "There are no components of " + queryParameters[0]?.description : "Components of " + queryParameters[0]?.description}
                    rows={components}
                    setRows={setComponents}
                    columns={BomComponentsDto}
                    onSelectionChange={handleComponentRowSelectionChange}
                    setMessage={setMessage}
                    pickListsForSelect={{childId: itemPickList}}
                    getRowClassName={(params) => (params.row === selectedComponentRow || (selectedComponentRow && params.row?.id !== undefined && params.row?.id === selectedComponentRow?.id)) ? 'selected-row' : ''}
                    sx={{'& .selected-row .MuiDataGrid-cell': {backgroundColor: '#e3f2fd'}}}
                    showCellVerticalBorder={true}
                    showColumnVerticalBorder={true}
                    submitButton={{'label': 'saveMe', 'url': bomCrudUrl}}
                    extraButtons={
                        <>
                            <Button variant="outlined" sx={{mr: 1}} onClick={addItemToQueryResults}>New
                                Component</Button>
                            <Button variant="outlined" sx={{mr: 1}} onClick={deleteRowFromQueryResults}
                                    disabled={!isAnItemSelected}>Delete</Button>
                            <Button variant="outlined" sx={{mr: 1}} onClick={() => showLog( "Components: ", components)}
                                    >Log</Button>
                        </>
                    }
                />

                <DataGridHelper
                    label={whereUsed.length === 0 ? queryParameters[0]?.description + " is not a component of any item" : "Items where " + queryParameters[0]?.description + " is used"}
                    rows={whereUsed}
                    columns={BomParentsDto}
                    getRowClassName={(params) => (params.row === selectedComponentRow || (selectedComponentRow && params.row?.id !== undefined && params.row?.id === selectedComponentRow?.id)) ? 'selected-row' : ''}
                    sx={{'& .selected-row .MuiDataGrid-cell': {backgroundColor: '#e3f2fd'}}}
                    showCellVerticalBorder={true}
                    showColumnVerticalBorder={true}
                />
            </Box>
        </div>
    );
}
export default ItemProperties;
