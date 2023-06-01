"use client"
import { Button, ButtonProps } from "@mui/material"

export default function OptionButton( { children, sx, fullWidth = true, ...rest }: ButtonProps ) {
    return (
        <Button
            fullWidth={ fullWidth }
            sx={ {
                borderRadius: '9px',
                justifyContent: 'left',
                color: '#000',
                '&:hover': { background: '#F7F7F7' }, ...sx
            } }
            { ...rest }
        >
            { children }
        </Button>
    )
}