'use client'
import { ButtonProps, Button as NextUIButton, extendVariants } from '@nextui-org/react'
import { ReactRef } from '@nextui-org/react-utils'
import { forwardRef } from 'react'

interface IconButtonProps extends Omit<ButtonProps, 'color'> {
	color?: 'black' | 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | undefined
}

const BaseButton = extendVariants(NextUIButton, {
	variants: {
		size: {
			sm: 'min-w-7 h-7 w-7',
			md: 'min-w-8 h-8 w-8',
			lg: 'min-w-10 h-10 w-10',
		},
		color: {
			default: 'text-gray-700',
			black: 'bg-black text-white border border-gray-400 hover:!bg-black/70',
		},
	},
})

const IconButton = forwardRef((props: IconButtonProps, ref?: ReactRef<HTMLButtonElement | null>) => {
	const { ...rest } = props

	return (
		<BaseButton
			color='default'
			radius='full'
			variant='light'
			size='md'
			isIconOnly
			{...rest}
			ref={ref}
		/>
	)
})

IconButton.displayName = 'IconButton'
export default IconButton
