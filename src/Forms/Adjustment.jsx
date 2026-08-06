import React, {useState} from 'react';
import {Box} from '@mui/material';
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import SearchParametersForm from "../Objects/SearchParametersForm.jsx";
import ErrorMessage from "../ErrorMessage.jsx";
import {AdjustmentQueryMetadata, AdjustmentRowMetadata} from "./Adjustment.js";
import {adjustmentQueryUrl} from "../Globals.js";

const Adjustment = () => {
    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);
    const [queryParameters, setQueryParameters] = useState([{lineNo: 1}]);
    const [selectedQueryRows, setSelectedQueryRows] = useState([]);

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
                selectedQueryRows={selectedQueryRows}
                setSelectedQueryRows={setSelectedQueryRows}
                columns={AdjustmentQueryMetadata}
                label="Adjustment Query Parameters"
                rowsOfQueryResults={rowsOfQueryResults}
            />

            <Box sx={{height: 600, width: '100%', mb: 10}}>
                <DataGridHelper label="Adjustment Query Results"
                                columns={AdjustmentRowMetadata}
                                rows={rowsOfQueryResults}
                />
            </Box>
        </div>
    );
};

export default Adjustment;
