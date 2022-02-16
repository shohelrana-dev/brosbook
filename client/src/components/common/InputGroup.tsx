import React, { Fragment, InputHTMLAttributes, useState } from 'react'
import {
    IconButton,
    InputAdornment,
    OutlinedInput,
    InputLabel,
    FormControl,
    Zoom
}                                                         from '@mui/material'
import Visibility                                         from '@mui/icons-material/Visibility'
import VisibilityOff                                      from '@mui/icons-material/VisibilityOff'
import ErrorOutlineIcon                                   from '@mui/icons-material/ErrorOutline'

interface InputGroupProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string,
    error?: { msg?: string }
}

function InputGroup( props: InputGroupProps ) {

    let { label, className, type, name, error, onChange } = props

    const [ showPassword, setShowPassword ] = useState( false )

    const handleClickShowPassword = () => {
        if ( showPassword ) {
            setShowPassword( false )
        } else {
            setShowPassword( true )
        }
    }

    const passwordEyeIcon = () => {
        let isPasswordField = false
        switch ( name ) {
            case 'password':
                isPasswordField = true
                break

            case 'confirmPassword':
                isPasswordField = true
        }

        if ( !isPasswordField ) {
            if ( error ) {
                return <ErrorOutlineIcon className="text-red-600"/>
            }
            return null
        }

        return (
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                    onClick={ handleClickShowPassword }
                >
                    { showPassword ? <VisibilityOff/> : <Visibility/> }
                </IconButton>
            </InputAdornment>
        )
    }

    if ( name === 'password' || name === 'confirmPassword' ) {
        type = showPassword ? 'text' : 'password'
    }

    return (
        <div className={ className }>
            <FormControl variant="outlined" fullWidth size="small">
                <InputLabel htmlFor={ name } className="!text-sm !text-gray-500" error={ !!error }>
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
                    endAdornment={ passwordEyeIcon() }
                    error={ !!error }
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