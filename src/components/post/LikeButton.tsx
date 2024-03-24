import { MouseEvent } from 'react'
import IconButton from '~/components/global/IconButton'
import Tooltip from '~/components/global/Tooltip'
import cn from '~/utils/cn'

interface Props {
    isViewerLiked: boolean
    handleLike: (event: MouseEvent<HTMLButtonElement>) => void
    handleUnlike: (event: MouseEvent<HTMLButtonElement>) => void
    size?: 'small' | 'medium'
}

export default function LikeButton({ isViewerLiked, handleLike, handleUnlike, size }: Props) {
    return (
        <Tooltip content={isViewerLiked ? 'Unlike' : 'Like'}>
            <IconButton
                onClick={isViewerLiked ? handleUnlike : handleLike}
                className='relative siz-8 min-w-4 mt-1'
            >
                <div
                    className={cn(
                        'size-14 bg-[url("/heart.png")] bg-cover absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2',
                        { 'animate-like': isViewerLiked, 'size-12': size === 'small' }
                    )}
                />
            </IconButton>
        </Tooltip>
    )
}
