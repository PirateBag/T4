
import {DataGrid } from "@mui/x-data-grid";
import {Typography} from "@mui/material";
import React from "react";

export function DataGridHelper({
                                   apiRef,
                                   label,
                                   rows,
                                   columns,
                                   handleRowChangeCallback,
                                   sx,
                                   initialState
                               }) {

    const safeRows = React.useMemo(() => rows || [], [rows]);
    const safeColumns = React.useMemo(() => columns || [], [columns]);

    const handleInternalCellClick = ( params ) => {
        // Handle ID column click for selection
        if (params.field === 'id' && handleRowChangeCallback) {
            handleRowChangeCallback([params.row]);
        }
    };

    // Construct common DataGrid props
    const gridProps = {
        apiRef,
        columns: safeColumns,
        rows: safeRows,
        density: "compact",
        rowSelection: false, // Disable standard MUI selection
        getRowId: (row) => row.id,
        onCellClick: handleInternalCellClick,
        sx,
        initialState,
        sortingMode: "client",
        filterMode: "client",
        slotProps: {
            footer: {
                sx: { display: 'flex' },
            },
            noRowsOverlay: {
                sx: { display: 'none' }
            }
        }
    };

    return (
        <div>
            {label && (
                <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>
                    {label}
                </Typography>
            )}

            <DataGrid {...gridProps} />
        </div>
    );
}