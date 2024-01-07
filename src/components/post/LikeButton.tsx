import { IconButton, Tooltip } from '@mui/material'
import { MouseEvent } from 'react'
import { twJoin } from 'tailwind-merge'

interface Props {
    isViewerLiked: boolean
    handleLike: (e: MouseEvent<HTMLButtonElement>) => void
    handleUnlike: (e: MouseEvent<HTMLButtonElement>) => void
}

export default function LikeButton({ isViewerLiked, handleLike, handleUnlike }: Props) {
    return (
        <Tooltip title={isViewerLiked ? 'Unlike' : 'Like'}>
            <IconButton
                onClick={isViewerLiked ? handleUnlike : handleLike}
                className='relative w-8 h-8'
            >
                <div
                    className={twJoin(
                        'h-14 w-14 bg-[url("/heart.png")] bg-cover absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2',
                        isViewerLiked && 'animate-like'
                    )}
                />
            </IconButton>
        </Tooltip>
    )
}
