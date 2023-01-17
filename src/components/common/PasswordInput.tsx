import React, { useState } from 'react'
import {AiOutlineEye as VisibleEyeIcon} from "react-icons/ai"
import {AiOutlineEyeInvisible as InvisibleEyeIcon} from "react-icons/ai"
import AnimatedInput, { AnimatedInputProps } from "@components/common/AnimatedInput"

function PasswordInput(props: AnimatedInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    const handleClickShowPassword = () => {
        if (showPassword) {
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }

    const passwordEyeIcon = (
        <button type="button" className="icon p-1 mt-[-4px]" onClick={handleClickShowPassword}>
            {showPassword ? <InvisibleEyeIcon size={20} /> : <VisibleEyeIcon size={20} />}
        </button>
    )

    return (
        <AnimatedInput {...props} type={showPassword ? 'text' : 'password'} icon={passwordEyeIcon}/>
    )
}

export default PasswordInput