import React, {useEffect, useState} from 'react';
import {Box} from '@mui/material';
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import SearchParametersForm from "../Objects/SearchParametersForm.jsx";
import ErrorMessage from "../ErrorMessage.jsx";
import {AdjustmentQueryMetadata, AdjustmentRowMetadata} from "./Adjustment.js";
import {adjustmentQueryUrl} from "../Globals.js";
import {loadItemPickList} from "../Objects/ItemPickListService.js";

const Adjustment = () => {
    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);
    const [queryParameters, setQueryParameters] = useState([{lineNo: 1}]);
    const [itemPickList, setItemPickList] = useState( [] );

    useEffect(() => {
        const pickListToSet = loadItemPickList();
        setItemPickList( pickListToSet );
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

            <Box sx={{height: 600, width: '100%', mb: 10}}>
                <DataGridHelper label="Adjustment Query Results"
                                columns={AdjustmentRowMetadata}
                                rows={rowsOfQueryResults}
                                pickListsForSelect = {{ 'itemId' : itemPickList}}
                />
            </Box>
        </div>
    );
};

export default Adjustment;
