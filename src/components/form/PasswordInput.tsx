'use client'
import { useState } from 'react'
import {
    AiOutlineEyeInvisible as InvisibleEyeIcon,
    AiOutlineEye as VisibleEyeIcon,
} from 'react-icons/ai'
import AnimatedInput, { AnimatedInputProps } from '~/components/form/AnimatedInput'
import IconButton from '~/components/global/IconButton'

export default function PasswordInput(props: AnimatedInputProps) {
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => setIsVisible(!isVisible)

    const passwordEyeIcon = (
        <IconButton aria-label='toggle password visibility' onClick={toggleVisibility}>
            {isVisible ? <InvisibleEyeIcon size={20} /> : <VisibleEyeIcon size={20} />}
        </IconButton>
    )

    return (
        <AnimatedInput type={isVisible ? 'text' : 'password'} endContent={passwordEyeIcon} {...props} />
    )
}
