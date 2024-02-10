'use client'

import { Button, ButtonProps } from '@nextui-org/react'
import cn from '~/utils/cn'

export default function OptionButton({ className, ...rest }: ButtonProps) {
	return (
		<Button
			fullWidth
			className={cn('text-gray-900 hover:bg-[#F7F7F7] rounded-lg justify-start px-2', className)}
			variant='light'
			{...rest}
		/>
	)
}
