import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import {DataGridHelper} from "../Objects/DataGridHelper.jsx";
import {textReportConfig} from "./ItemMasterConfig.js";
import {ScreenStack} from "../Stack.js";

export const ItemExplosion = () => {

    if (ScreenStack.stackTop().data === undefined) { return(
        <div>No data</div>
    )
    }
    const safeRows =  ScreenStack.stackTop().data;

    return (

        <div>
            <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>{ScreenStack.stackTop().label }
            </Typography>

            <Button variant="outlined" onClick={() => ScreenStack.pop()}>Return</Button>

            <Box sx={{height: 600, width: '100%', mb: 10}}>
                <DataGridHelper columns={textReportConfig}
                                rows={safeRows}
                                onCellClick={undefined}
                                sx={{
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        fontFamily: 'monospace',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        fontFamily: 'monospace',
                                        whiteSpace: 'pre'
                                    },
                                }}
                                initialState={{
                                    columns: {
                                        columnVisibilityModel: {
                                            crudAction: false,
                                            id: false
                                        },
                                    },
                                }}
                />
            </Box>
        </div>
    );
};

