import cn from '@/utils/cn'
import { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
	isVisible: boolean
}

export default function DarkOverlay({ isVisible, className, ...rest }: Props) {
	return (
		<div
			className={cn(
				'fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.3)] z-10 opacity-0 duration-200 invisible',
				isVisible && 'opacity-100 visible',
				className
			)}
			{...rest}
		/>
	)
}
