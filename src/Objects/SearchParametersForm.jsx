import React, {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import Grid from "@mui/material/Grid";
import {ScreenStack} from "../Stack.js";
import DataGridHelper from "./DataGridHelper.jsx";
import {postData} from "../HttpUtils.js";

const SearchParametersForm = ({
    searchUrl,
    setRowsOfQueryResults,
    setMessage,
    queryParameters,
    setQueryParameters,
    columns,
    label,
    rowsOfQueryResults
}) => {
    const [selectedQueryRows, setSelectedQueryRows] = useState([]);

    const handleRowChange = (newRow) => {
        setQueryParameters(prev => prev.map(row => row.lineNo === newRow.lineNo ? newRow : row));
        return newRow;
    };

    const clearQueryParameters = () => {
        setQueryParameters([{lineNo: 1}]);
        setRowsOfQueryResults([]);
        setMessage("");
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

    const handleSearch = async (event) => {
        if (event) event.preventDefault();
        try {
            const response = await postData({
                parameters: { 'rows': queryParameters },
                url: searchUrl
            });
            if (response.status === 200) {
                setMessage("Success, retrieved " + (response.data?.data?.length || 0) + " rows");
                setRowsOfQueryResults(response.data?.data || []);
            } else {
                setMessage("Error retrieving with response " + response.status);
                setRowsOfQueryResults([]);
            }
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
        fetchData().catch(error => setMessage("Promise rejection in fetchData: " + error));
    }, []);
    return (
        <Box component="form" onSubmit={handleSearch}>
            <Grid container spacing={1} sx={{ mb: 0 }}>
            </Grid>

            <Box sx={{width: '100%', mb: 2}}>
                <DataGridHelper label={label}
                                columns={columns}
                                rows={queryParameters}
                                handleRowChangeCallback={handleRowChange}
                                onSelectionChange={setSelectedQueryRows}
                />
            </Box>

            <Grid container spacing={2} padding={2}>
                <Grid size="auto">
                    <Button type="button" variant="contained" onClick={handleAddRow}>Add</Button>
                </Grid>
                <Grid size="auto">
                    <Button type="button" variant="contained" color="error" onClick={handleDeleteRow} disabled={selectedQueryRows.length === 0}>Delete</Button>
                </Grid>

                <Grid size="auto">
                    <Button type="submit" variant="contained" sx={{ ml: 10 }}>Search</Button>
                </Grid>
                <Grid size="auto">
                    <Button type="button" variant="outlined" sx={{ ml: 1 }} onClick={clearQueryParameters}>Clear</Button>
                </Grid>
                <Grid size="auto">
                    <Button type="button" variant="outlined" sx={{ ml: 1 }} onClick={() => ScreenStack.pop()}>Return</Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchParametersForm;
