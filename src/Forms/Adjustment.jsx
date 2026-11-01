import React, {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import SearchParametersForm from "../Objects/SearchParametersForm.jsx";
import ErrorMessage from "../ErrorMessage.jsx";
import {AdjustmentAddMetadata, AdjustmentQueryMetadata, AdjustmentRowMetadata} from "./Adjustment.js";
import {
    adjustmentCrudUrl,
    adjustmentQueryUrl
} from "../Globals.js";
import {loadItemPickListAll} from "../Objects/ItemPickListService.js";
import {CRUD_ACTION_INSERT, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {formatDate} from "../lib/dates.js";
import {ScreenStack} from "../Stack.js";
import {postData} from "../HttpUtils.js";
import {noop} from "../lib/noop.js";
import {SPF_NONE, SPF_ORDER_LINE} from '../enums/screenParameterFormats.js';

const Adjustment = () => {

    const [selectedQueryRow, setSelectedQueryRow] = useState(null);

    // Prototype local function to allow coding default values for new adjustment rows
    const getDefaultAdjustmentValues = (lineNo = 1, base = selectedQueryRow) => {
        return {
            lineNo: lineNo,
            id: 999,
            amount: base?.amount ?? 0,
            itemId: base?.itemId ?? "",
            orderId: base?.orderId ?? "",
            orderType: base?.orderType ?? "",
            effectiveDate: formatDate(new Date()),
            adjustmentType: base?.adjustmentType ?? "",
            crudAction: CRUD_ACTION_INSERT
        };
    };

    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);
    const [queryParameters, setQueryParameters] = useState([{lineNo: 1}]);
    const [itemPickList, setItemPickList] = useState( [] );
    const [adjustmentsToAdd, setAdjustmentsToAdd] = useState([getDefaultAdjustmentValues()]);

    const handleQueryRowSelectionChange = (rows) => {
        const selected = Array.isArray(rows) ? rows[0] : rows;
        if (!selected) return;
        setSelectedQueryRow(selected);
        setAdjustmentsToAdd([getDefaultAdjustmentValues(1, selected)]);
    };

    const handleAddAdjustment = () => {
        if ( queryParameters.length === 1 ) return;

        setAdjustmentsToAdd([getDefaultAdjustmentValues(1, selectedQueryRow)]);
    };

    const handleReversalAdjustment = () => {
        const defaultValues = getDefaultAdjustmentValues(1, selectedQueryRow);
        setAdjustmentsToAdd([{ ...defaultValues, amount: -(defaultValues.amount ?? 0) || 0 }]);
    };

    function mapItemQueryToAdjustmentQueryParameters( rowsOfItems ) {
        if (!Array.isArray(rowsOfItems)) {
            return [];
        }

        return rowsOfItems.map((rowOfItem, index) => ({
            lineNo: index + 1,
            amount: 0,
            itemId: rowOfItem?.id,
            orderType: 'NA',
            crudAction: CRUD_ACTION_NONE
        }));
    }

    function mapOrderLineItemsToAdjustmentQueryParameters( rowsOfOrders ) {
        if (!Array.isArray(rowsOfOrders)) {
            return [];
        }

        return rowsOfOrders.map((order, index) => ({
            lineNo: index + 1,
            amount: 0,
            orderId : order.id,
            itemId: order.itemId,
            orderType: order.orderType,
            crudAction: CRUD_ACTION_NONE
        }));
    }


    /**
     *
     * @param parameters an array of parameter objects, never a scalar.
     * @param format one of the screenTransitionParameterFormat enum values.
     *
     * @returns an adjustment/query compatible parameter object array.
     */
    function queryParametersFromStack( { parameters, format } ) {
        if ( !Array.isArray(parameters) ) {
            throw new Error( "queryParametersFromStack: parameters must be an array" );
        }

        if ( format === SPF_NONE ) {
            return mapItemQueryToAdjustmentQueryParameters( parameters );
        }
        if ( format === SPF_ORDER_LINE ) {
            return mapOrderLineItemsToAdjustmentQueryParameters( parameters );
        }
        throw new Error( "queryParametersFromStack: format not recognized: " + format );
    }

    // Fetch data on mount if empty
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (rowsOfQueryResults.length === 0) {
                    if ( ScreenStack.stackTop().data !== undefined) {
                        const queryParametersForOpeningScreen = queryParametersFromStack(
                            { parameters : ScreenStack.stackTop().data,
                                format: ScreenStack.stackTop().parameterFormat  } );

                        setQueryParameters( queryParametersForOpeningScreen );
                        const objectToBeTransmitted = { 'rows' : queryParametersForOpeningScreen }
                        const allQueryResultsButShouldOnlyBeOne =
                            await Promise.all(  [postData( {'parameters' : objectToBeTransmitted, 'url' : adjustmentQueryUrl}) ] );

                        const results = allQueryResultsButShouldOnlyBeOne[0].data?.data || [];
                        results.forEach(row => row.crudAction = CRUD_ACTION_NONE);
                        setRowsOfQueryResults( results )
                    }
                }
            } catch (error) {
                console.error("Error fetching data in useEffect:", error);
                setMessage("Error loading initial data");
            }
        };

        fetchData().catch(error => setMessage("Promise rejection in fetchData:" + error));
        loadItemPickListAll({
            responseSetter: (data) => setItemPickList(data.map(item => ({ value: item.id, label: item.external }))),
            errorMessageSetter: setMessage
        });

    }, []); // Dependency array ensures this runs only on mount



    return (
        <div>
            <ErrorMessage message={message}/>
            <br/>
            <SearchParametersForm
                searchUrl={adjustmentQueryUrl}
                setRowsOfQueryResults={setRowsOfQueryResults}
                setMessage={setMessage}
                queryParameters={queryParameters}
                setQueryParameters={setQueryParameters}
                columns={AdjustmentQueryMetadata}
                label="Adjustment Query Parameters"
                rowsOfQueryResults={rowsOfQueryResults}
                pickListsForSelect = {{ 'itemId' : itemPickList}}
                handleClear={noop}
            />

            <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>

            <Box sx={{width: '100%', mb: 4}}>
                <DataGridHelper label="Adjustment Query Results"
                                columns={AdjustmentRowMetadata}
                                rows={rowsOfQueryResults}
                                onSelectionChange={handleQueryRowSelectionChange}
                                pickListsForSelect = {{ 'itemId' : itemPickList}}
                                autoHeight={true}
                                showCellVerticalBorder={true}
                                showColumnVerticalBorder={true}
                                handleClearButton={noop}
                />
            </Box>

            <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>

            <Box sx={{width: '100%', mb: 4}}>
                <DataGridHelper label="Add Adjustments"
                                columns={AdjustmentAddMetadata}
                                rows={adjustmentsToAdd}
                                setRows={setAdjustmentsToAdd}
                                pickListsForSelect = {{ 'itemId' : itemPickList}}
                                autoHeight={true}
                                hideFooter={true}
                                showCellVerticalBorder={true}
                                showColumnVerticalBorder={true}
                                submitButton={{ label: "Save", url: adjustmentCrudUrl, setMessage }}
                                extraButtons={
                                    <>
                                        <Button variant="outlined" onClick={handleAddAdjustment}>New Selected</Button>
                                        <Button variant="outlined" onClick={handleReversalAdjustment}>New Reversal</Button>

                                    </>
                                }
                />
            </Box>
        </div>
    );
};

export default Adjustment;
