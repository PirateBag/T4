import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    typography: {
        fontSize: 16,
    },
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input': {
                        fontSize: '20px',
                    },
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    fontSize: '16px', // Base font size for DataGrid
                },
                columnHeader: {
                    fontSize: '18x', // Header font size
                    fontWeight: 'bold',
                },
                cell: {
                    fontSize: '16px', // Cell font size
                },
                row: {
                    '&.MuiDataGrid-row': {
                        maxHeight: '40px !important', // Reduce row height
                        minHeight: '40px !important',
                    }
                }
            },
        },
    },
});