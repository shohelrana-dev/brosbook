import React from 'react'
import {
    OutlinedInput,
    InputLabel,
    FormControl,
    Zoom,
    OutlinedInputProps
} from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

export interface AnimatedInputProps extends Omit<OutlinedInputProps, 'error'> {
    error?: string
}

function AnimatedInput(props: AnimatedInputProps) {

    let { label, name, size = 'small', error, endAdornment, ...rest } = props
    
    name = name ? name : (label as string).toLowerCase().replace(' ', '')

    return (
        <div className="mt-4">
            <FormControl variant="outlined" fullWidth size="small">
                <InputLabel htmlFor={name} className="!text-sm !text-gray-500 !duration-500" error={!!error}>
                    {error && <ErrorOutlineIcon fontSize="small" className="!text-red-600 mr-1 !text-[16px]" />}
                    {label}
                </InputLabel>
                <OutlinedInput
                    id={name}
                    label={label}
                    name={name}
                    classes={{
                        input: 'text-sm text-gray-700'
                    }}
                    error={!!error}
                    size={size}
                    {...rest}
                />
                {error && (
                    <Zoom in>
                        <span className="flex items-center">
                            <p className="font-medium text-red-600 text-[12px]">
                                {error}
                            </p>
                        </span>
                    </Zoom>
                )}
            </FormControl>
        </div>
    )
}

export default AnimatedInput