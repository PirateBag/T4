import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import {Typography} from "@mui/material";

export function  PropertyGrid( {label, objectToPresent, validationRules, handleInputChangeCallback, layout } ) {
    const handleInputChangeDefault = (field) => {
        return () => {
            console.error("No handleInputChangeCallback provided to PropertyGrid. Field update ignored for: " + field);
        }
    }

    if (handleInputChangeCallback === undefined) {
        handleInputChangeCallback = handleInputChangeDefault;
    }

    const direction = layout || 'row';

    if (objectToPresent)

    return (
        <div>
        <Typography variant="h5" gutterBottom sx={{ml: 2, mt: 2}} align={"center"}>{label}
        </Typography>


    <Grid container spacing={2} padding={2} direction={direction}>
        {validationRules.map((col) => (
            <Grid size={{xs: 12, sm: 6, md: 4}} key={col.field}>
                <TextField
                    type={col.type}
                    size="small"
                    margin="dense"
                    name={col.domainName}
                    placeholder={col.headerName}
                    maxLength={col.maxLength}
                    value={objectToPresent[col.field] || col.defaultValue ||''}
                    onChange={handleInputChangeCallback(col.field)}
                    disabled={col.editable === false}
                    sx={{width: '240px', display: col.hidden ? 'none' : 'block'}}
                />
            </Grid>
        ))}
        </Grid>
        </div>

        )
        }

