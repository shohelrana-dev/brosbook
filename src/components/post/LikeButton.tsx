'use client'
import { MouseEvent } from 'react'
import IconButton from '~/components/ui/IconButton'
import Tooltip from '~/components/ui/Tooltip'
import cn from '~/utils/cn'

interface Props {
	isViewerLiked: boolean
	handleLike: (e: MouseEvent<HTMLButtonElement>) => void
	handleUnlike: (e: MouseEvent<HTMLButtonElement>) => void
	size?: 'small' | 'medium'
}

export default function LikeButton({ isViewerLiked, handleLike, handleUnlike, size }: Props) {
	return (
		<Tooltip content={isViewerLiked ? 'Unlike' : 'Like'}>
			<IconButton
				onClick={isViewerLiked ? handleUnlike : handleLike}
				className='relative w-8 h-8 min-w-4 mt-1'
			>
				<div
					className={cn(
						'h-14 w-14 bg-[url("/heart.png")] bg-cover absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2',
						{ 'animate-like': isViewerLiked, 'h-12 w-12': size === 'small' }
					)}
				/>
			</IconButton>
		</Tooltip>
	)
}
