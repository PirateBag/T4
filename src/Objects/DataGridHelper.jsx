
import {DataGrid} from "@mui/x-data-grid";
import {Typography} from "@mui/material";
import React from "react";

export function DataGridHelper({
                                   apiRef,
                                   label,
                                   rows,
                                   columns,
                                   handleRowChangeCallback,
                                   handleCellClickCallback,
                                   selectionMode = 'single',
                                   onSelectionChange,
                                   rowSelectionModel = [],
                                   disableRowSelectionOnClick = false,
                                   sx,
                                   initialState
                               }) {

    const safeRows = rows || [];
    const safeColumns = columns || [];

    const isSingleSelection = selectionMode === 'single';
    const isMultipleSelection = selectionMode === 'multiple';
    const isSelectionEnabled = selectionMode !== 'none';

    const handleSelectionModelChange = (newSelectionModel) => {
        let modelToSet = newSelectionModel || [];

        // Enforce single selection logic if in single mode
        if (isSingleSelection && modelToSet.length > 1) {
            modelToSet = [modelToSet[modelToSet.length - 1]];
            if (apiRef && apiRef.current) {
                apiRef.current.setRowSelectionModel(modelToSet);
            }
        }

        // Map IDs back to full row objects if callback is provided
        if (onSelectionChange) {
            const selectedRows = safeRows.filter(row => modelToSet.includes(row.id));
            onSelectionChange(selectedRows);
        }
    };

    return (
        <div>
            {label && (
                <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>
                    {label}
                </Typography>
            )}

            <DataGrid columns={safeColumns}
                      //  apiRef={apiRef}
                      rows={safeRows}
                      density="compact"
                      rowSelection={isSelectionEnabled}
                      // checkboxSelection={isMultipleSelection}
                      // disableMultipleRowSelection={isSingleSelection}
                      //  rowSelectionModel={rowSelectionModel || []}
                      onRowSelectionModelChange={handleSelectionModelChange}
                      disableRowSelectionOnClick={disableRowSelectionOnClick}
                      getRowId={(row) => row.id}
                      //  processRowUpdate={handleRowChangeCallback}
                      //  onCellClick={handleCellClickCallback}
                      onProcessRowUpdateError={(error) => console.error("Row update failed:", error)}
                      //  sx={sx}
                      //  initialState={initialState}
                      // slotProps={{
                      //     footer: {
                      //         sx: { display: safeRows.length === 0 ? 'none' : 'flex' }
                      //     }
                      // }}
            />
            {/*{safeRows.length === 0 && (*/}
            {/*    <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>*/}
            {/*        No data for you.*/}
            {/*    </Typography>*/}
            {/*)}*/}
        </div>
    );
}