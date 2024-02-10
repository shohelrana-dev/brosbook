'use client'
import { ButtonProps, Button as NextUIButton } from '@nextui-org/react'
import { forwardRef } from 'react'
import Loader from '~/components/ui/Loader'
import cn from '~/utils/cn'

const Button = forwardRef((props: ButtonProps, ref?: any) => {
	const { className, ...rest } = props

	return (
		<NextUIButton
			color='primary'
			radius='full'
			onPressStart={e => e.continuePropagation()}
			className={cn('font-medium', className)}
			spinner={
				<Loader size={props.size === 'sm' ? 'xs' : 'sm'} disableText className='border-t-gray-900' />
			}
			{...rest}
			ref={ref}
		/>
	)
})

Button.displayName = 'Button'
export default Button
