import { IconButton, InputAdornment } from '@mui/material'
import { useState } from 'react'
import {
	AiOutlineEyeInvisible as InvisibleEyeIcon,
	AiOutlineEye as VisibleEyeIcon,
} from 'react-icons/ai'
import AnimatedInput, { AnimatedInputProps } from '~/components/form/AnimatedInput'

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
		<InputAdornment position='end'>
			<IconButton
				aria-label='toggle password visibility'
				onClick={handleClickShowPassword}
				edge='end'
			>
				{showPassword ? <InvisibleEyeIcon size={20} /> : <VisibleEyeIcon size={20} />}
			</IconButton>
		</InputAdornment>
	)

	return (
		<AnimatedInput
			{...props}
			type={showPassword ? 'text' : 'password'}
			endAdornment={passwordEyeIcon}
		/>
	)
}
