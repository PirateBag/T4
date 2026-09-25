import React, {useMemo} from 'react';
import {Box, Typography} from '@mui/material';
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import ReturnButton from "../Objects/ReturnButton.jsx";
import {textReportConfig} from "./GenericText.js";
import {ScreenStack} from "../Stack.js";

const GenericText = () => {


    const dataToPresent = ScreenStack.stackTop().data.slice(1);
    const rowHeader = ScreenStack.stackTop().data[0].message ?? "No Data";
    const columnsWithFlex = useMemo(() =>
        textReportConfig.map(col => ({
            ...col,
            flex: 1,
            minWidth: col.width
        })),
    []);

    columnsWithFlex[2].headerName  = rowHeader;

    return (

        <div>
            <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>
                {  ScreenStack.stackTop().label  }
            </Typography>
            <br/>
            <ReturnButton />
            <Box sx={{width: '100%', my: 2}}>
                <DataGridHelper columns={columnsWithFlex}
                                rows={dataToPresent}
                                autoHeight={true}
                                onCellClick={undefined}
                                sx={{
                                    fontSize: '12px',
                                    '& .MuiDataGrid-columnHeaders': {
                                        fontFamily: 'monospace',
                                        fontSize: '12px',
                                    },
                                    '& .MuiDataGrid-columnHeader': {
                                        fontFamily: 'monospace',
                                        fontSize: '12px',
                                    },
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        fontFamily: 'monospace',
                                        fontSize: '12px',
                                        whiteSpace: 'pre',
                                        overflow: 'visible',
                                        textOverflow: 'clip'
                                    },
                                    '& .MuiDataGrid-cell': {
                                        backgroundColor: '#f5f5f5',
                                        fontFamily: 'monospace',
                                        fontSize: '12px',
                                        whiteSpace: 'pre',
                                        overflow: 'visible',
                                        textOverflow: 'clip'
                                    },
                                }}
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: 25 },
                                    },
                                    columns: {
                                        columnVisibilityModel: {
                                            crudAction: false,
                                            id: false
                                        },
                                    },
                                }}
                />
            </Box>
            {/*<ReturnButton containerSx={{ mb: 2 }} />*/}
        </div>
    );
};

export default GenericText;