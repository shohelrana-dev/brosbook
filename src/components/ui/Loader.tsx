'use client'
import cn from '~/utils/cn'

interface Props {
	loading?: boolean
	wrapperClassName?: string
	size?: 'xs' | 'sm' | 'md' | 'lg'
	disableText?: boolean
	className?: string
}

export default function Loader(props: Props) {
	const { wrapperClassName, size = 'md', loading = true, disableText, className } = props
	const sizeClasses = {
		xs: 'size-4',
		sm: 'size-5',
		md: 'size-8',
		lg: 'size-10',
	}

	if (!loading) return null

	return (
		<div
			role='spinner'
			className={cn('flex flex-col items-center justify-center min-h-24', wrapperClassName)}
		>
			<span
				className={cn(
					'animate-spin duration-500 border-4 border-gray-200 border-t-primary rounded-full',
					{ 'border-2': size === 'xs' || size === 'sm' },
					sizeClasses[size],
					className
				)}
			/>

			{!disableText && <span className='text-gray-500 text-sm mt-2'>Loading...</span>}
		</div>
	)
}
