import React, { useState }             from 'react'
import { IconButton, InputAdornment }  from "@mui/material"
import VisibilityOff                   from "@mui/icons-material/VisibilityOff"
import Visibility                         from "@mui/icons-material/Visibility"
import AnimatedInput, { InputGroupProps } from "@components/common/AnimatedInput"

function PasswordInput( props: InputGroupProps ){
    const [showPassword, setShowPassword] = useState( false )

    const handleClickShowPassword = () => {
        if( showPassword ){
            setShowPassword( false )
        } else{
            setShowPassword( true )
        }
    }

    const passwordEyeIcon = (
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

    return (
        <AnimatedInput type={ showPassword ? 'text' : 'password' } endAdornment={ passwordEyeIcon } { ...props }/>
    )
}

export default PasswordInput