import React, {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material';
import Grid from "@mui/material/Grid";
import ReturnButton from "./ReturnButton.jsx";
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
    rowsOfQueryResults,
    handleAdd,
    handleDelete,
    handleClear,
    pickListsForSelect = {},
    ...rest
}) => {
    const [selectedQueryRows, setSelectedQueryRows] = useState([]);

    const handleRowChange = (newRow) => {
        if (setQueryParameters) {
            setQueryParameters(prev => prev.map(row => row.lineNo === newRow.lineNo ? newRow : row));
        }
        return newRow;
    };

    const handleAddClick = (event) => {
        if (setQueryParameters) {
            setQueryParameters(prev => {
                const current = Array.isArray(prev) ? prev : (Array.isArray(queryParameters) ? queryParameters : []);
                const maxLineNo = current.reduce((max, row) => {
                    const num = Number(row?.lineNo);
                    return !isNaN(num) && num > max ? num : max;
                }, 0);
                return [...current, { lineNo: maxLineNo + 1 }];
            });
        }
        setSelectedQueryRows([]);
        if (typeof handleAdd === 'function') {
            handleAdd(event);
        }
    };

    const handleClearClick = (event) => {
        if (setQueryParameters) {
            setQueryParameters([{ lineNo: 1 }]);
        }
        setSelectedQueryRows([]);
        if (typeof handleClear === 'function') {
            handleClear(event);
        }
    };

    const handleDeleteClick = (event) => {
        if (setQueryParameters && selectedQueryRows.length > 0) {
            setQueryParameters(prev => {
                const current = Array.isArray(prev) ? prev : (Array.isArray(queryParameters) ? queryParameters : []);
                const selectedIds = new Set(selectedQueryRows.map(r => r?.lineNo ?? r?.id ?? r));
                return current.filter(row => {
                    const id = row?.lineNo ?? row?.id ?? row;
                    return !selectedIds.has(id) && !selectedQueryRows.includes(row);
                });
            });
        }
        setSelectedQueryRows([]);
        if (typeof handleDelete === 'function') {
            handleDelete(event);
        }
    };

    const handleSearch = async (event) => {
        if (event) event.preventDefault();
        setSelectedQueryRows([]);
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
            <Box sx={{width: '100%', mb: 2}}>
                <DataGridHelper label={label}
                                columns={columns}
                                rows={queryParameters}
                                autoHeight={true}
                                handleRowChangeCallback={handleRowChange}
                                onSelectionChange={setSelectedQueryRows}
                                showCellVerticalBorder={true}
                                showColumnVerticalBorder={true}
                                pickListsForSelect={pickListsForSelect}
                                {...rest}
                />
            </Box>

            <Grid container spacing={1} padding={2}>
                <Grid size="auto">
                    <Button type="submit" variant="contained">Search</Button>
                </Grid>
                    <Grid size="auto">
                        <ReturnButton type="button" noContainer />
                    </Grid>

                <Grid size="auto" sx={{ ml: 2 }}>
                    <Button
                        type="button"
                        variant="contained"
                        disabled={handleAdd === undefined}
                        onClick={handleAddClick}
                    >Add</Button>
                </Grid>
                <Grid size="auto">
                    <Button
                        type="button"
                        variant="contained"
                        color="error"
                        disabled={handleDelete === undefined || selectedQueryRows.length === 0}
                        onClick={handleDeleteClick}
                    >
                        Delete
                    </Button>
                </Grid>

                {handleClear !== undefined && (
                    <Grid size="auto">
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={handleClearClick}
                        >
                            Clear
                        </Button>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default SearchParametersForm;
