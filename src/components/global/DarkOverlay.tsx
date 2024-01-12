import { HTMLAttributes } from 'react'
import cn from '~/utils/cn'

interface Props extends HTMLAttributes<HTMLDivElement> {
	isOpen: boolean
}

export default function DarkOverlay({ isOpen, className, ...rest }: Props) {
	return (
		<div
			className={cn(
				'fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.3)] z-10 opacity-0 duration-200 invisible',
				isOpen && 'opacity-100 visible',
				className
			)}
			{...rest}
		/>
	)
}
