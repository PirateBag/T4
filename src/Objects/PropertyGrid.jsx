import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Button, Checkbox, FormControlLabel, MenuItem, Typography} from "@mui/material";
import {validateFieldsOfObject} from "../Metadata/ValidateRule.js";
import * as HttpUtils from "../HttpUtils.js";
import ReturnButton from "./ReturnButton.jsx";

export function PropertyGrid({label, objectToPresent, validationRules, handleInputChangeCallback, layout, pickListsForSelect = {},
                             messageFormSetter, url, actionLabel }) {

    const defaultSaveHandler = async (event) => {
        event.preventDefault();
        let messagesFromFormValidation = "";
        messageFormSetter(messagesFromFormValidation);

        if (messagesFromFormValidation.length > 0) return;

        messagesFromFormValidation = validateFieldsOfObject(validationRules, objectToPresent)
        if (messagesFromFormValidation.length > 0) {
            messageFormSetter(messagesFromFormValidation);
            return
        }
        const requestMessage = {rows: [objectToPresent]};
        const response = await HttpUtils.postData({'parameters': requestMessage, 'url': url});
        console.log('Property Grid Response is ' + response);

        if ( response.status === 200) {
            const responseLine = response.data.data[ 0 ];
            messageFormSetter("Saved " + responseLine.id + " " + responseLine.description + " " +
                responseLine.unitCost + " " + responseLine.sourcing + " " + responseLine.leadTime
                + "\nHit return or add another." );
        } else {
            messageFormSetter("Error saving with status code " + response.status );
        }
    }

    const direction = layout || 'row';

    if (objectToPresent === undefined) return (
        <div>Loading ...</div>
    )


    return (
        <div>
            <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>{label}
            </Typography>

            <Grid container spacing={2} direction={direction}>
                {validationRules.map((col) => {
                    const isSelect = col.useSelect || col.type === 'singleSelect';
                    const options = isSelect ? (pickListsForSelect[col.field] || col.valueOptions || []) : [];

                    return (
                        <Grid item key={col.field}>
                            {col.type === 'checkbox' ? (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={!!objectToPresent[col.field]}
                                            onChange={handleInputChangeCallback(col)}
                                            name={col.domainName}
                                            disabled={col.editable === false || col.disabled === true}
                                        />
                                    }
                                    label={col.headerName}
                                    sx={{width: '240px', display: col.hidden ? 'none' : 'inline-flex', ml: 1}}
                                />
                            ) : (
                                <TextField
                                    type={col.type === 'singleSelect' ? 'text' : col.type}
                                    size="small"
                                    margin="dense"
                                    name={col.domainName}
                                    label={col.headerName}
                                    placeholder={col.headerName}
                                    value={objectToPresent[col.field] ?? ''}
                                    onChange={handleInputChangeCallback(col)}
                                    disabled={col.disabled === true}
                                    select={isSelect}
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            readOnly: col.editable === false,
                                            maxLength: col.maxLengthInChars > 0 ? col.maxLengthInChars : undefined
                                        },
                                    }}
                                    sx={{width: '240px', display: col.hidden ? 'none' : 'inline-flex'}}
                                >
                                    {isSelect && options.map((option) => {
                                        const value = typeof option === 'object' ? option.value : option;
                                        const label = typeof option === 'object' ? option.label : option;
                                        return (
                                            <MenuItem key={value} value={value}>
                                                {label}
                                            </MenuItem>
                                        );
                                    })}
                                </TextField>
                            )}
                        </Grid>
                    );
                })}
            </Grid>

            <br/>

            {actionLabel && (
                <Grid size={12} container spacing={2}>
                    <Button variant="contained" onClick={defaultSaveHandler} sx={{width: '240px', display: 'inline-flex'}}>
                        {actionLabel}
                    </Button>
                    <ReturnButton label="Return"  sx={{ mr: 3 }} noContainer />
                </Grid>
            )}
        </div>

    )
}

