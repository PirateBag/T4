import React, {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import Grid from '@mui/material/Grid';
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import SearchParametersForm from "../Objects/SearchParametersForm.jsx";
import ErrorMessage from "../ErrorMessage.jsx";
import {AdjustmentAddMetadata, AdjustmentQueryMetadata, AdjustmentRowMetadata} from "./Adjustment.js";
import {adjustmentQueryUrl} from "../Globals.js";
import {loadItemPickListAll} from "../Objects/ItemPickListService.js";
import {CRUD_ACTION_INSERT} from "../enums/crudAction.js";
import {formatDate} from "../lib/dates.js";

const Adjustment = () => {

    // Prototype local function to allow coding default values for new adjustment rows
    const getDefaultAdjustmentValues = (lineNo = 1) => {
        return {
            lineNo: lineNo,
            id: 999,
            amount: 0,
            itemId: "",
            orderId: "",
            orderType: "",
            effectiveDate: formatDate(new Date()),
            adjustmentType: "",
            crudAction: CRUD_ACTION_INSERT
        };
    };

    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);
    const [queryParameters, setQueryParameters] = useState([{lineNo: 1}]);
    const [itemPickList, setItemPickList] = useState( [] );
    const [adjustmentsToAdd, setAdjustmentsToAdd] = useState([getDefaultAdjustmentValues()]);

    const handleAddAdjustment = () => {
        setAdjustmentsToAdd(prev => {
            const current = Array.isArray(prev) ? prev : [];
            const maxLineNo = current.reduce((max, row) => {
                const num = Number(row?.lineNo);
                return !isNaN(num) && num > max ? num : max;
            }, 0);
            return [...current, getDefaultAdjustmentValues(maxLineNo + 1)];
        });
    };

    const handleReversalAdjustment = () => {
        setAdjustmentsToAdd(prev => {
            const current = Array.isArray(prev) ? prev : [];
            const maxLineNo = current.reduce((max, row) => {
                const num = Number(row?.lineNo);
                return !isNaN(num) && num > max ? num : max;
            }, 0);
            return [...current, getDefaultAdjustmentValues(maxLineNo + 1)];
        });
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
                                showCellVerticalBorder={true}
                                showColumnVerticalBorder={true}
                />
                <Grid container sx={{mt: 1}}>
                    <Grid size="auto">
                        <Button variant="outlined" onClick={handleAddAdjustment}>Add</Button>
                        <Button variant="outlined" onClick={handleReversalAdjustment}>Reverse</Button>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default Adjustment;
