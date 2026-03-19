import React, {useEffect, useState} from 'react';
import FormService from "../FormService.js";
import {Box, Button} from '@mui/material';
import {DataGridHelper} from "../Objects/DataGridHelper.jsx";
import {textReportConfig} from "./ItemMasterConfig.js";
import Grid from "@mui/material/Grid";
import {ScreenStack} from "../Stack.js";
import ErrorMessage from "../ErrorMessage.jsx";
import {ItemQueryRequestEditableMetadata} from "./ItemQueryConfig.js";
import TextField from "@mui/material/TextField";
import {itemMasterReportUrl, itemQueryAll, itemQueryUrl, itemCrudRequestTemplate} from "../Globals.js";

const ItemMaster = () => {

    const [message, setMessage] = useState("");
    const [rowsOfQueryResults, setRowsOfQueryResults] = useState([]);

    const afterQueryPostedCallback = (response) => {
        console.log("afterQueryCallback received:", response.status);
        if (response.status === 200) {
            setMessage("Success");
            const data = response.data.data || [];
            // Assign sequential IDs if missing or needed for the report
            const rowsWithIds = data.map((row, index) => ({
                ...row,
                id: row.id || (index + 1)
            }));
            setRowsOfQueryResults(rowsWithIds);
        } else {
            setMessage("Error");
            setRowsOfQueryResults([]);
        }
    }


    const queryFormService = new FormService({
            messageFormSetter: setMessage,
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
    }, []); // Dependency array ensures this runs only on mount

    const safeRows = rowsOfQueryResults || [];

    return (

        <div>

            <form onSubmit={queryFormService.handleSubmit}>
                <ErrorMessage message={message}/>
                <br/>

                <Grid container spacing={2} padding={2}>
                    {ItemQueryRequestEditableMetadata.map((col) => (
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
            <Grid container sx={{ mt: 1 }}>
                <Grid size="auto">
                    <Button variant="outlined" onClick={() => ScreenStack.pop()}>Return</Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default ItemMaster;