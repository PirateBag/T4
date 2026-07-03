import React, {useEffect, useMemo, useState} from 'react';
import {Box, Button} from '@mui/material';
import Grid from "@mui/material/Grid";
import {ScreenStack} from "../Stack.js";
import ErrorMessage from "../ErrorMessage.jsx";
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import {PropertyGrid} from "../Objects/PropertyGrid.jsx";
import {textReportConfig} from "./ItemMasterConfig.js";
import {AdjustmentQueryMetadata} from "./Adjustment.js";
import {adjustmentReportAllUrl} from "../Globals.js";
import {postData} from "../HttpUtils.js";
import FormQueryPanel from "../FormQueryPanel.js";
import {CRUD_ACTION_NONE} from "../enums/crudAction.js";

const Adjustment = () => {
    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);
    const [queryParameters, setQueryParameters] = useState({});

    const columnsWithFlex = useMemo(() =>
        textReportConfig.map(col => ({
            ...col,
            flex: 1,
            minWidth: col.width
        })),
    []);

    const afterQueryPostedCallback = (response) => {
        if (response.status === 200) {
            setMessage("Success, retrieved " + (response.data?.data?.length || 0) + " rows");
            const data = response.data.data || [];
            const rowsWithIds = data.map((row, index) => ({
                ...row,
                id: row.id || (index + 1),
                crudAction: CRUD_ACTION_NONE
            }));
            setRowsOfQueryResults(rowsWithIds);
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
            // According to requirements: The request parameter should be posted and is { 'idToSearchFor' : 1 }
            const response = await postData({
                parameters: { idToSearchFor: 1 },
                url: adjustmentReportAllUrl
            });
            afterQueryPostedCallback(response);
        } catch (error) {
            setMessage("Error: " + error.message);
        }
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
        setQueryParameters({});
        setRowsOfQueryResults([]);
        setMessage("");
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <ErrorMessage message={message}/>
                <br/>

                <PropertyGrid label={"Adjustment Query Parameters"}
                              objectToPresent={queryParameters}
                              handleInputChangeCallback={queryFormPanelService.handleInputChange}
                              validationRules={AdjustmentQueryMetadata}
                />
                
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
                                columns={columnsWithFlex}
                                rows={rowsOfQueryResults}
                                sx={{
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        fontFamily: 'monospace',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        backgroundColor: '#f5f5f5',
                                        fontFamily: 'monospace',
                                        whiteSpace: 'pre',
                                        overflow: 'visible',
                                        textOverflow: 'clip'
                                    },
                                }}
                                initialState={{
                                    columns: {
                                        columnVisibilityModel: {
                                            crudAction: false,
                                            id: false
                                        },
                                    },
                                }}
                />
            </Box>
        </div>
    );
};

export default Adjustment;
