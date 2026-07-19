import React, {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import Grid from "@mui/material/Grid";
import {ScreenStack} from "../Stack.js";
import ErrorMessage from "../ErrorMessage.jsx";
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import {PropertyGrid} from "../Objects/PropertyGrid.jsx";
import {AdjustmentQueryMetadata, AdjustmentRowMetadata} from "./Adjustment.js";
import {adjustmentQueryUrl} from "../Globals.js";
import {postData} from "../HttpUtils.js";
import FormQueryPanel from "../FormQueryPanel.js";

const Adjustment = () => {
    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);
    const [queryParameters, setQueryParameters] = useState([{lineNo: 1}]);
    const [selectedQueryRows, setSelectedQueryRows] = useState([]);

    const afterQueryPostedCallback = (response) => {
        if (response.status === 200) {
            setMessage("Success, retrieved " + (response.data?.length || 0) + " rows");
            const data = response.data || [];
            setRowsOfQueryResults(data);
        } else {
            setMessage("Error retrieving report");
            setRowsOfQueryResults([]);
        }
    }

    const queryFormPanelService = new FormQueryPanel({
        queryPanel: queryParameters,
        setQueryPanel: setQueryParameters,
        validationRules: AdjustmentQueryMetadata,
        afterPostCallback: afterQueryPostedCallback
    });

    const handleSearch = async (event) => {
        if (event) event.preventDefault();
        try {
            const response = await postData({
                parameters: { 'rows': queryParameters },
                url: adjustmentQueryUrl
            });
            afterQueryPostedCallback(response);
        } catch (error) {
            setMessage("Error: " + error.message);
        }
    };

    const handleAddRow = () => {
        setQueryParameters(prev => {
            const nextLineNo = prev.length > 0
                ? Math.max(...prev.map(r => r.lineNo || 0)) + 1
                : 1;
            return [...prev, { lineNo: nextLineNo }];
        });
    };

    const handleDeleteRow = () => {
        if (selectedQueryRows.length === 0) return;
        const selectedLineNos = selectedQueryRows.map(row => row.lineNo);
        setQueryParameters(prev => prev.filter(row => !selectedLineNos.includes(row.lineNo)));
        setSelectedQueryRows([]);
    };

    const handleRowChange = (newRow) => {
        setQueryParameters(prev => prev.map(row => row.lineNo === newRow.lineNo ? newRow : row));
        return newRow;
    };

    useEffect(() => {
        const fetchData = async () => {
            if (rowsOfQueryResults.length === 0) {
                await handleSearch();
            }
        };
        fetchData();
    }, []);

    const clearQueryParameters = () => {
        setQueryParameters([{lineNo: 1}]);
        setRowsOfQueryResults([]);
        setMessage("");
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <ErrorMessage message={message}/>
                <br/>

                <Grid container spacing={2} sx={{ mb: 1 }}>
                    <Grid size="auto">
                        <Button variant="contained" onClick={handleAddRow}>Add</Button>
                    </Grid>
                    <Grid size="auto">
                        <Button variant="contained" color="error" onClick={handleDeleteRow} disabled={selectedQueryRows.length === 0}>Delete</Button>
                    </Grid>
                </Grid>

                <Box sx={{height: '200px', width: '100%', mb: 10}}>
                    <DataGridHelper label="Adjustment Query Parameters"
                                    columns={AdjustmentQueryMetadata}
                                    rows={queryParameters}
                                    handleRowChangeCallback={handleRowChange}
                                    onSelectionChange={setSelectedQueryRows}
                    />
                </Box>

                <hr style={{margin: "20px 0", borderTop: "1px solid #ccc"}}/>
                
                <Grid container spacing={2} padding={2}>
                    <Grid size="auto">
                        <Button type="submit" variant="contained">Search</Button>
                    </Grid>
                    <Grid size="auto">
                        <Button variant="outlined" sx={{ ml: 1 }} onClick={clearQueryParameters}>Clear</Button>
                    </Grid>
                    <Grid size="auto">
                        <Button variant="outlined" sx={{ ml: 1 }} onClick={() => ScreenStack.pop()}>Return</Button>
                    </Grid>
                </Grid>
            </form>

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
