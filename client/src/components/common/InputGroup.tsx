import React, { InputHTMLAttributes, ReactNode } from 'react'
import {
    OutlinedInput,
    InputLabel,
    FormControl,
    Zoom
}                                                from '@mui/material'
import ErrorOutlineIcon                          from '@mui/icons-material/ErrorOutline'

export interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string,
    error?: { msg?: string }
    endAdornment?: ReactNode
}

function InputGroup( props: InputGroupProps ){

    let { label, type, name, error, onChange, endAdornment } = props

    return (
        <div className="mb-3">
            <FormControl variant="outlined" fullWidth size="small">
                <InputLabel htmlFor={ name } className="!text-sm !text-gray-500" error={ !! error }>
                    { label }
                </InputLabel>
                <OutlinedInput
                    id={ name }
                    label={ label }
                    type={ type }
                    name={ name }
                    classes={ {
                        input: 'text-sm text-gray-700'
                    } }
                    endAdornment={ endAdornment }
                    error={ !! error }
                    onChange={ onChange }
                    size="small"
                />
                { error && (
                    <Zoom in>
                        <span className="flex items-center">
                            <ErrorOutlineIcon fontSize="small" className="!text-red-600 mr-1"/>
                            <p className="font-medium text-red-600 text-[12px]">
                                { error.msg }
                            </p>
                        </span>
                    </Zoom>
                ) }
            </FormControl>
        </div>
    )
}

export default InputGroup