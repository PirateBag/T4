import React, {useEffect, useState} from 'react';
import FormService from "../FormService.js";
import {Box, Button} from '@mui/material';
import {DataGrid} from "@mui/x-data-grid";
import {textReportConfig} from "./ItemMasterConfig.js";
import Grid from "@mui/material/Grid";
import {ScreenStack} from "../Stack.js";
import ErrorMessage from "../ErrorMessage.jsx";
import {ItemQueryParametersDTO} from "./ItemQueryConfig.js";
import TextField from "@mui/material/TextField";
import {itemMasterReportUrl, itemQueryAll, itemQueryUrl, itemCrudRequestTemplate} from "../Globals.js";

const ItemMaster = () => {

    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);

    const afterQueryPostedCallback = (response) => {
        console.log("afterQueryCallback received:", response.status);
        if (response.status === 200) {
            setMessage("Success");
            setRowsOfQueryResults(response.data.data);
        } else {
            setMessage("Error");
            setRowsOfQueryResults([]);
        }
    }


    const queryFormService = new FormService({
            messageFromFormSetter: setMessage,
            messagesFromForm: message,
            afterPostCallback: afterQueryPostedCallback,
            requestTemplate: itemCrudRequestTemplate
        }
    );


    // Fetch data on mount if empty
    useEffect(() => {
        const fetchData = async () => {
            if (rowsOfQueryResults.length === 0) {
                // Trigger search with empty values
                queryFormService.postData(itemQueryAll, itemMasterReportUrl);
            }
        };
        fetchData();
    }, [rowsOfQueryResults.length]); // Dependency array ensures this runs only on mount

    if (rowsOfQueryResults.length > 0) {
        let counter = 1;
        rowsOfQueryResults.map((row) => row.id = counter++);
    }

    return (

        <div>

            <form onSubmit={queryFormService.handleSubmit}>
                <ErrorMessage message={message}/>
                <br/>

                <Grid container spacing={2} padding={2}>
                    {ItemQueryParametersDTO.map((col) => (
                        <Grid size={{xs: 12, sm: 6, md: 4}} key={col.field}>
                            <TextField
                                type={col.type}
                                size="small"
                                margin="dense"
                                name={col.domainName}
                                placeholder={col.placeholder}
                                maxLength={col.maxLength}
                                defaultValue={''}
                                sx={{ width: '180px' }}
                            />
                        </Grid>
                    ))}
                    <Grid size={12}>
                        <Button type="submit" variant="contained" name={itemQueryUrl}>Search</Button>
                    </Grid>
                </Grid>
            </form>


            Item Master Report.<br/>
            <Grid container sx={{ mt: 1 }}>
                <Grid size="auto">
                    <Button variant="outlined" onClick={() => ScreenStack.pop()}>Return</Button>
                </Grid>
            </Grid>
            <Box sx={{height: 600, width: '100%', mb: 10}}>
                {rowsOfQueryResults.length === 0 ? (
                    "No results"
                ) : (
                    <DataGrid columns={textReportConfig}
                              rows={rowsOfQueryResults}
                              density="compact"
                              disableMultipleRowSelection={true}
                              rowSelection={true}
                              onRowSelectionModelChange={(newSelectionModel) => {
                                  // Enforce single selection by taking only the first item
                                  if (newSelectionModel.length > 1) {
                                      // Note: Since this grid is not controlled, we'd need state to force it.
                                      // But disableMultipleRowSelection should handle it for uncontrolled grids.
                                  }
                              }}
                              getRowId={(row) => row.id}
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
                )}
            </Box>
            <Grid container sx={{ mt: 1 }}>
                <Grid size="auto">
                    <Button variant="outlined" onClick={() => ScreenStack.pop()}>Return</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default ItemMaster;