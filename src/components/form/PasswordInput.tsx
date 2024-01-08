import React, { useState } from 'react'
import {AiOutlineEye as VisibleEyeIcon} from "react-icons/ai"
import {AiOutlineEyeInvisible as InvisibleEyeIcon} from "react-icons/ai"
import AnimatedInput, { AnimatedInputProps } from "@/components/form/AnimatedInput"
import { InputAdornment, IconButton } from "@mui/material"

export default function PasswordInput(props: AnimatedInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => {
        if (showPassword) {
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }

    const passwordEyeIcon = (
        <InputAdornment position="end">
            <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
            >
                {showPassword ? <InvisibleEyeIcon size={20} /> : <VisibleEyeIcon size={20} />}
            </IconButton>
        </InputAdornment>
    )

    return (
        <AnimatedInput {...props} type={showPassword ? 'text' : 'password'} endAdornment={passwordEyeIcon}/>
    )
}