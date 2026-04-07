
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
                                   initialState,
                                   onSelectionChange
                               }) {

    const safeRows = React.useMemo(() => rows || [], [rows]);
    const safeColumns = React.useMemo(() => columns || [], [columns]);

    const handleInternalCellClick = ( params ) => {
        // // Consider a click on the ID a row selection.
        // if (params.field === 'id' && onSelectionChange) {
        //     onSelectionChange(params.row);
        // }

        //  Consider a click on any other field to trigger a row change.
        onSelectionChange([params.row] )
    };

    // Construct common DataGrid props
    const gridProps = {
        apiRef,
        columns: safeColumns,
        rows: safeRows,
        density: "compact",
        rowSelection: (onSelectionChange === undefined ? false : onSelectionChange), // Disable standard MUI selection
        getRowId: (row) => row.id,
        onCellClick: handleInternalCellClick,
        sx,
        initialState,
        sortingMode: "client",
        filterMode: "client",
        processRowUpdate: handleRowChangeCallback,
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