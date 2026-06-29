import React, {useMemo} from 'react';
import {Box, Button, Typography} from '@mui/material';
import DataGridHelper from "../Objects/DataGridHelper.jsx";
import {textReportConfig} from "./ItemMasterConfig.js";
import Grid from "@mui/material/Grid";
import {ScreenStack} from "../Stack.js";

const GenericText = () => {

    const dataToPresent = ScreenStack.stackTop().data;

    const columnsWithFlex = useMemo(() =>
        textReportConfig.map(col => ({
            ...col,
            flex: 1,
            minWidth: col.width
        })),
    []);

    return (

        <div>

            <form >

            <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>
                {  ScreenStack.stackTop().label  }
            </Typography>
            <br/>
            <Grid container sx={{ mt: 1 }}>
                <Grid size="auto">
                    <Button variant="outlined" onClick={() => ScreenStack.pop()}>Return</Button>
                </Grid>
            </Grid>
            <Box sx={{height: 800, width: '100%', mb: 10}}>
                <DataGridHelper columns={columnsWithFlex}
                                rows={dataToPresent}
                                onCellClick={undefined}
                                sx={{
                                    '& .MuiDataGrid-columnHeaderTitle': {
                                        fontFamily: 'monospace',
                                    },
                                    '& .MuiDataGrid-cell': {
                                        backgroundColor: '#f5f5f5',
                                        fontFamily: 'monospace',
                                        whiteSpace: 'pre',
                                        overflow: 'visible',
                                        textOverflow: 'clip'
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
            </form>
        </div>
    );
};

export default GenericText;