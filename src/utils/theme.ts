import { createTheme } from '@mui/material/styles'

const theme = createTheme({
    palette: {
        primary: {
            main: '#14cb15',
        },
        secondary: {
            main: '#159615',
        },
    },
    typography: {
        allVariants: {
            fontFamily: 'var(--font-kanit)',
            fontSize: 'var(--body-font-size)',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: ({ ownerState }) => ({
                    borderRadius: '20px',
                    textTransform: 'inherit',
                    ...(ownerState.variant === 'contained' && ownerState.color === 'primary' && {
                        color: '#fff',
                    }),
                }),
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)',
                    borderRadius: '8px',
                    border: '1px solid #dddddd5c',
                },
            },
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    '&.Mui-error': {
                        margin: 0,
                        fontSize: '13px',
                    },
                },
            },
        },
    },
})

export default theme
