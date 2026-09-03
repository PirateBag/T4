import React, {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import Grid from "@mui/material/Grid";
import ReturnButton from "./ReturnButton.jsx";
import DataGridHelper from "./DataGridHelper.jsx";
import {postData} from "../HttpUtils.js";
import {noop} from "../lib/noop.js";

const SearchParametersForm = ({
    searchUrl,
    setRowsOfQueryResults,
    setMessage,
    queryParameters,
    setQueryParameters,
    columns,
    label,
    rowsOfQueryResults,
    handleDelete,
    handleClear,
    handleReturn
}) => {
    const [selectedQueryRows, setSelectedQueryRows] = useState([]);

    const handleRowChange = (newRow) => {
        if (setQueryParameters) {
            setQueryParameters(prev => prev.map(row => row.lineNo === newRow.lineNo ? newRow : row));
        }
        return newRow;
    };

    const handleSearch = async (event) => {
        if (event) event.preventDefault();
        try {
            const response = await postData({
                parameters: { 'rows': queryParameters },
                url: searchUrl
            });
            if (response.status === 200) {
                if (setMessage) setMessage("Success, retrieved " + (response.data?.data?.length || 0) + " rows");
                if (setRowsOfQueryResults) setRowsOfQueryResults(response.data?.data || []);
            } else {
                if (setMessage) setMessage("Error retrieving with response " + response.status);
                if (setRowsOfQueryResults) setRowsOfQueryResults([]);
            }
        } catch (error) {
            if (setMessage) setMessage("Error: " + error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (rowsOfQueryResults && rowsOfQueryResults.length === 0) {
                await handleSearch();
            }
        };
        fetchData().catch(error => setMessage && setMessage("Promise rejection in fetchData: " + error));
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

            <Grid container spacing={1} padding={2}>
                {typeof handleAdd === 'function' && (
                    <Grid size="auto">
                        <Button type="button" variant="contained" onClick={noop}>Add</Button>
                    </Grid>
                )}
                {typeof handleDelete === 'function' && (
                    <Grid size="auto">
                        <Button type="button" variant="contained" color="error" disabled={selectedQueryRows.length === 0}>Delete</Button>
                    </Grid>
                )}

                <Grid size="auto">
                    <Button type="submit" variant="contained" sx={{ ml: 1 }}>Search</Button>
                </Grid>
                {typeof handleClear === 'function' && (
                    <Grid size="auto">
                        <Button type="button" variant="outlined" sx={{ ml: 1 }}>Clear</Button>
                    </Grid>
                )}
                {typeof handleReturn === 'function' && (
                    <Grid size="auto">
                        <ReturnButton type="button" sx={{ ml: 1 }} noContainer />
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default SearchParametersForm;
