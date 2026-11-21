
import {DataGrid } from "@mui/x-data-grid";
import {Typography, Checkbox, Button, Box} from "@mui/material";
import React from "react";
import {CRUD_ACTION_CHANGE, CRUD_ACTION_DELETE, CRUD_ACTION_NONE} from "../enums/crudAction.js";
import {noop} from "../lib/noop.js";
import {randomId} from "../lib/randomId.js";
import {masterSaveChanges} from "../lib/masterSaveChanges.js";
import Grid from "@mui/material/Grid";
import ReturnButton from "../Buttons/ReturnButton.jsx";

export function DataGridHelper({
    label,
    rows,
    columns,
    handleRowChangeCallback,
    setRows,
    sx,
    initialState,
    onSelectionChange,
    onProcessError,
    pickListsForSelect = {}, // New optional parameter
    autoHeight = false,
    autoPageSize = false,
    hideFooter = false,
    showCellVerticalBorder = false,
    showColumnVerticalBorder = true,
    submitButton = undefined,
    extraButtons = null,
    showDataGrid = true,
    setShowDataGrid = noop,
    setMessage = null,
    ...rest
}) {

    const safeRows = React.useMemo(() => rows || [], [rows]);
    const safeColumns = React.useMemo(() =>
        (columns || []).map(col => {
            let newCol = col.clickable ? { ...col, cellClassName: 'clickable-cell' } : col;

            // Check if the column is configured for selection
            if (newCol.useSelect) {
                newCol = {
                    ...newCol,
                    type: 'singleSelect',
                    // Look up the picklist by field name; default to empty array if not found
                    valueOptions: pickListsForSelect[newCol.field] || [],
                };

                if ( newCol.valueOptions.length === 0 ) {
                    console.log(`No picklist options found for field: ${newCol.field}`);
                }
            }

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
        }), [columns, pickListsForSelect]);

    const hasLineNo = React.useMemo(() => safeColumns.some(col => col.field === 'lineNo'), [safeColumns]);
    const shouldHideFooter = hideFooter;

    const handleSubmit = async (event) => {
        if (event) event.preventDefault();
        await masterSaveChanges( {
            'rows': rows,
            'messageSetter' : setMessage,
            'updatedRowsSetter' : setRows,
            url: submitButton.url } )
    };


    const resolveRowId = React.useCallback((row) => {
        if (!row) return undefined;
        if (hasLineNo && row.lineNo != null) {
            return row.lineNo;
        }
        return row.id ?? (safeColumns[0]?.field ? row[safeColumns[0].field] : undefined);
    }, [hasLineNo, safeColumns]);

    const defaultHandleRowChange = (newRow, oldRow) => {
        if (!setRows) {
            throw new Error("DataGridHelper: defaultHandleRowChange requires a rows setter function (e.g. setRows) when no custom handleRowChangeCallback is provided.");
        }

        if (!newRow) {
            return oldRow;
        }

        const updatedRow = { ...newRow };

        const changedColumns = (columns || []).filter(col => !oldRow || newRow[col.field] !== oldRow[col.field]);

        for (const col of changedColumns) {
            if (col && typeof col.validate === 'function') {
                const errorMessage = col.validate(newRow[col.field]);
                if (errorMessage) {
                    setMessage( errorMessage );
                }
            }
            if (col && typeof col.reformatStringUsingRules === 'function' && typeof newRow[col.field] === 'string') {
                updatedRow[col.field] = col.reformatStringUsingRules(newRow[col.field]);
            }
        }

        // updatedRow.crudAction = CRUD_ACTION_CHANGE;
        if ( updatedRow.crudAction === CRUD_ACTION_NONE ) {
            updatedRow.crudAction = CRUD_ACTION_CHANGE;
        }

        if (typeof setRows === 'function') {
            setRows(prevRows => {
                if (Array.isArray(prevRows)) {
                    const targetId = resolveRowId(updatedRow);
                    if (targetId !== undefined) {
                        return prevRows.map(row => (resolveRowId(row) === targetId ? updatedRow : row));
                    }
                    if (prevRows.length === 1) {
                        return [updatedRow];
                    }
                    return prevRows.map(row => (row === oldRow ? updatedRow : row));
                }
                return updatedRow;
            });
        }

        console.log('DataGridHelper:updateRow:', updatedRow);

        return updatedRow;
    };

    const handleInternalCellClick = ( params ) => {
        console.log('DataGridHelper:handleInternalCellClick:', params);
        if (onSelectionChange) {
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
            } else if (setRows && typeof setRows === 'function') {
                setRows(prevRows => {
                    if (Array.isArray(prevRows)) {
                        const targetId = resolveRowId(updatedRow);
                        if (targetId !== undefined) {
                            return prevRows.map(row => (resolveRowId(row) === targetId ? updatedRow : row));
                        }
                        if (prevRows.length === 1) {
                            return [updatedRow];
                        }
                        return prevRows.map(row => (row === params.row ? updatedRow : row));
                    }
                    return updatedRow;
                });
            }
        }
    };

    const handleCheckBoxClick = ( ) => {
        console.log("Checkbox clicked when checkbox: " + showDataGrid );
        setShowDataGrid && setShowDataGrid(!showDataGrid);
        console.log("Checkbox after clicking: " + showDataGrid );
    }



    // Construct common DataGrid props
    const gridProps = {
        columns: safeColumns,
        rows: safeRows,
        autoHeight: autoPageSize ? false : autoHeight,
        autoPageSize,
        density: "compact",
        showCellVerticalBorder,
        showColumnVerticalBorder,
        rowSelection: false, // Disable standard MUI selection; handled manually in onCellClick
        getRowId: (row) => resolveRowId(row) ?? randomId(),
        onCellClick: handleInternalCellClick,
        hideFooter: shouldHideFooter,
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
        processRowUpdate: handleRowChangeCallback || defaultHandleRowChange,
        onProcessRowUpdateError: onProcessError || ((error) => console.error('DataGridHelper: Error in processRowUpdate:', error)),
        slotProps: {
            footer: {
                sx: { display: shouldHideFooter ? 'none' : 'flex' },
            },
            noRowsOverlay: {
                sx: { display: 'none' }
            }
        },
        ...rest
    };

    return (
        <div>
            {label && (
                <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"} onClick={handleCheckBoxClick}>
                    {label + " ["+rows.length+"]"}
                </Typography>
            )}

            {showDataGrid && (
                <DataGrid {...gridProps} />
            )}

            {(showDataGrid &&(submitButton || extraButtons)) && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    {submitButton && (
                        <Button variant="contained" type="button" onClick={handleSubmit}>
                            {submitButton.label}
                        </Button> ) }
                        <ReturnButton type="button" noContainer />
                    {extraButtons}
                </Box>
            )}
        </div>
    );
}

export default DataGridHelper