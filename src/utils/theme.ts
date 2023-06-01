import {createTheme} from "@mui/material"

const theme = createTheme({
    palette: {
        primary: {
            main: '#159615',
        },
    },
    typography: {
        fontFamily: ['Kanit', 'sans-serif'].join(','),
        fontSize: 15
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '20px',
                    textTransform: 'inherit'
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -4px rgba(0,0,0,.1)',
                    borderRadius: '8px',
                    border: '1px solid #dddddd5c',
                }
            }
        }
    },
})

export default theme