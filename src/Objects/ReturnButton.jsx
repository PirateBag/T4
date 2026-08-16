import React from 'react';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import { ScreenStack } from '../Stack.js';

export const ReturnButton = ({
    label = 'Return',
    onClick,
    sx,
    containerSx,
    noContainer = false,
    variant = 'outlined',
    ...props
}) => {
    const handleClick = onClick || (() => ScreenStack.pop());

    const button = (
        <Button variant={variant} onClick={handleClick} sx={sx} {...props}>
            {label}
        </Button>
    );

    if (noContainer) {
        return button;
    }

    return (
        <Grid container sx={{ mt: 1, ...containerSx }}>
            <Grid size="auto">
                {button}
            </Grid>
        </Grid>
    );
};

export default ReturnButton;
