import React, {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import SearchParametersForm from "../Objects/SearchParametersForm.jsx";
import ErrorMessage from "../ErrorMessage.jsx";
import {AdjustmentAddMetadata, AdjustmentQueryMetadata, AdjustmentRowMetadata} from "./Adjustment.js";
import {adjustmentCrudUrl, adjustmentQueryUrl} from "../Globals.js";
import {loadItemPickListAll} from "../Objects/ItemPickListService.js";
import {CRUD_ACTION_INSERT} from "../enums/crudAction.js";
import {formatDate} from "../lib/dates.js";

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
        setAdjustmentsToAdd([getDefaultAdjustmentValues(1, selectedQueryRow)]);
    };

    const handleReversalAdjustment = () => {
        const defaultValues = getDefaultAdjustmentValues(1, selectedQueryRow);
        setAdjustmentsToAdd([{ ...defaultValues, amount: -(defaultValues.amount ?? 0) || 0 }]);
    };


    useEffect(() => {

        loadItemPickListAll({
            responseSetter: (data) => setItemPickList(data.map(item => ({ value: item.id, label: item.external }))),
            errorMessageSetter: setMessage
        });

    }, []); // Runs once on mount

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
