import { OutlinedInputProps, styled, TextField, TextFieldProps, alpha } from '@mui/material'
import ucfirst from '@/utils/ucfirst'
import { ReactNode } from 'react'

interface CustomTextFieldProps{
    endAdornment?: ReactNode
}

const CustomTextField = styled(({endAdornment, ...restProps}: TextFieldProps & CustomTextFieldProps) => (
    <TextField
        InputProps={{ disableUnderline: true, endAdornment } as Partial<OutlinedInputProps>}
        {...restProps}
    />
))(({ theme }) => ({
    '& .MuiFilledInput-root': {
        overflow: 'hidden',
        borderRadius: 4,
        backgroundColor: theme.palette.mode === 'light' ? '#F3F6F9' : '#1A2027',
        border: '1px solid',
        borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
        transition: theme.transitions.create([
            'border-color',
            'background-color',
            'box-shadow',
        ]),
        '&:hover': {
            backgroundColor: 'transparent',
        },
        '&.Mui-focused': {
            backgroundColor: 'transparent',
            boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
            borderColor: theme.palette.primary.main,
        },
    },
}))

export interface AnimatedInputProps extends Omit<TextFieldProps & CustomTextFieldProps, 'error' | 'fullWidth' | 'id' | 'helperText'> {
    error?: string
}

export default function AnimatedInput(props: AnimatedInputProps) {
    let { label, name, error, size = 'medium', ...rest } = props

    name = name ? name : (label as string).toLowerCase().replace(' ', '')

    return (
        <CustomTextField
            label={label}
            id={name}
            name={name}
            error={error ? true : false}
            variant='filled'
            fullWidth
            helperText={ucfirst(error)}
            {...rest}
        />
    )
}
