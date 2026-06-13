
import {DataGrid } from "@mui/x-data-grid";
import {Typography, Checkbox} from "@mui/material";
import React from "react";
import {CRUD_ACTION_DELETE, CRUD_ACTION_NONE} from "../enums/crudAction.js";

function DataGridHelper({
                                   apiRef,
                                   label,
                                   rows,
                                   columns,
                                   handleRowChangeCallback,
                                   sx,
                                   initialState,
                                   onSelectionChange,
                                   onProcessError
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
                        const cellValue = params.value !== undefined ? params.value : params.row[params.field];
                        const isChecked = cellValue === true || cellValue === 'x' || cellValue === 'X';
                        return <Checkbox checked={isChecked} readOnly size="small" />;
                    },
                    renderEditCell: (params) => {
                        const cellValue = params.value !== undefined ? params.value : params.row[params.field];
                        const isChecked = cellValue === true || cellValue === 'x' || cellValue === 'X';
                        return (
                            <Checkbox
                                checked={isChecked}
                                onChange={(e) => {
                                    params.api.setEditCellValue({
                                        id: params.id,
                                        field: params.field,
                                        value: e.target.checked
                                    });
                                }}
                                size="small"
                            />
                        );
                    }
                };
            }
            return newCol;
        }), [columns]);

    const handleInternalCellClick = ( params ) => {
        console.log('DataGridHelper:handleInternalCellClick:', params);
        if (params.field === safeColumns[0]?.field && onSelectionChange) {
            onSelectionChange([params.row]);
        }

        const validationRuleForField = columns.find(col => col.field === params.field);
        if (validationRuleForField && validationRuleForField.type === 'checkbox') {
            const currentValue = params.value !== undefined ? params.value : params.row[params.field];
            const isCurrentlyChecked = currentValue === true || currentValue === 'x' || currentValue === 'X';
            const newCheckValue = !isCurrentlyChecked;
            const newCrudAction = newCheckValue ? CRUD_ACTION_DELETE : CRUD_ACTION_NONE;

            params.api.updateRows([{ id: params.id, [params.field]: newCheckValue, 'crudAction' : newCrudAction }]);

            const updatedRow = { ...params.row, [params.field]: newCheckValue, crudAction: newCrudAction };
            console.log('DataGridHelper:handleInternalCellClick:updatedCheckBox', {
                field: params.field,
                oldValue: currentValue,
                newValue: newCheckValue,
                newCrudAction: newCrudAction,
                updatedRow: updatedRow
            });

            if (handleRowChangeCallback) {
                handleRowChangeCallback(updatedRow, params.row);
            }
        }
    };

    // Construct common DataGrid props
    const gridProps = {
        apiRef,
        columns: safeColumns,
        rows: safeRows,
        density: "compact",
        rowSelection: false, // Disable standard MUI selection; handled manually in onCellClick
        getRowId: (row) => row.id,
        onCellClick: handleInternalCellClick,
        sx: {
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
            ...sx,
        },
        initialState: {
            pagination: { paginationModel: { pageSize: 10 } },
            ...initialState,
        },
        pageSizeOptions: [10, 25, 50],
        sortingMode: "client",
        filterMode: "client",
        processRowUpdate: handleRowChangeCallback,
        onProcessRowUpdateError: onProcessError || ((error) => console.error('DataGridHelper: Error in processRowUpdate:', error)),
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

export default DataGridHelper