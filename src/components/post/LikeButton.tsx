import { IconButton, Tooltip } from '@mui/material'
import { MouseEvent } from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
	isViewerLiked: boolean
	handleLike: (e: MouseEvent<HTMLButtonElement>) => void
	handleUnlike: (e: MouseEvent<HTMLButtonElement>) => void
	size?: 'small' | 'medium'
}

export default function LikeButton({ isViewerLiked, handleLike, handleUnlike, size }: Props) {
	return (
		<Tooltip title={isViewerLiked ? 'Unlike' : 'Like'}>
			<IconButton onClick={isViewerLiked ? handleUnlike : handleLike} className='relative w-8 h-8'>
				<div
					className={twMerge(
						'h-14 w-14 bg-[url("/heart.png")] bg-cover absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2',
						isViewerLiked && 'animate-like',
						size === 'small' && 'h-12 w-12'
					)}
				/>
			</IconButton>
		</Tooltip>
	)
}