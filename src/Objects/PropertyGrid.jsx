import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Checkbox, FormControlLabel, MenuItem, Typography} from "@mui/material";

export function PropertyGrid({label, objectToPresent, validationRules, handleInputChangeCallback, layout, pickListsForSelect = {}}) {
    const handleInputChangeDefault = (field) => {
        return () => {
            console.error("No handleInputChangeCallback provided to PropertyGrid. Field update ignored for: " + field);
        }
    }

    if (handleInputChangeCallback === undefined) {
        handleInputChangeCallback = handleInputChangeDefault;
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
                        <Grid key={col.field}>
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
                                    sx={{width: '240px', display: col.hidden ? 'none' : 'block', ml: 1}}
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
                                    slotProps={{
                                        input: {
                                            readOnly: col.editable === false,
                                            maxLength: col.maxLengthInChars > 0 ? col.maxLengthInChars : undefined
                                        },
                                    }}
                                    sx={{width: '240px', display: col.hidden ? 'none' : 'block'}}
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
        </div>

    )
}

