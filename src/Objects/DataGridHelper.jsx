
import {DataGrid } from "@mui/x-data-grid";
import {Typography, Checkbox} from "@mui/material";
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
    const safeColumns = React.useMemo(() =>
        (columns || []).map(col => {
            let newCol = col.clickable ? { ...col, cellClassName: 'clickable-cell' } : col;
            if (newCol.type === 'checkbox') {
                newCol = {
                    ...newCol,
                    type: 'boolean',
                    renderCell: (params) => {
                        const isChecked = params.value === true || params.value === 'x' || params.value === 'X';
                        return isChecked ? <Checkbox checked readOnly size="small" /> : null;
                    },
                    renderEditCell: (params) => (
                        <Checkbox
                            checked={params.value === true || params.value === 'x' || params.value === 'X'}
                            onChange={(e) => {
                                params.api.setEditCellValue({
                                    id: params.id,
                                    field: params.field,
                                    value: e.target.checked
                                });
                            }}
                            size="small"
                        />
                    )
                };
            }
            return newCol;
        }), [columns]);

    const handleInternalCellClick = ( params ) => {
        if (params.field === safeColumns[0]?.field && onSelectionChange) {
            onSelectionChange([params.row]);
        }

        const columnDef = columns.find(col => col.field === params.field);
        if (columnDef && columnDef.type === 'checkbox') {
            const isCurrentlyChecked = params.value === true || params.value === 'x' || params.value === 'X';
            const newValue = !isCurrentlyChecked;

            params.api.updateRows([{ id: params.id, [params.field]: newValue }]);
        }
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
        sx: {
            ...sx,
            '& .MuiDataGrid-cell': {
                backgroundColor: '#f5f5f5',
            },
            '& .MuiDataGrid-cell--editable': {
                backgroundColor: '#ffffff',
            },
            '& .clickable-cell': {
                color: '#1976d2',
                fontWeight: 'bold',
            },
        },
        initialState: {
            pagination: { paginationModel: { pageSize: 10 } },
            ...initialState,
        },
        pageSizeOptions: [10, 25, 50],
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