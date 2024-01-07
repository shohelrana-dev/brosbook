import { twMerge } from 'tailwind-merge'

interface Props {
    isViewerLiked: boolean
    likesCount: number
}

export default function LikesCount({ isViewerLiked, likesCount }: Props) {
    return (
        <div className='text-pink-700 relative h-full'>
            <p
                className={twMerge(
                    'absolute left-0 top-1/2 translate-y-[-150%] opacity-0 duration-300',
                    !isViewerLiked && 'opacity-100 -translate-y-1/2'
                )}
            >
                {likesCount}
            </p>
            <p
                className={twMerge(
                    'absolute left-0 top-1/2 translate-y-1/2 opacity-0 duration-300',
                    isViewerLiked && 'opacity-100 -translate-y-1/2'
                )}
            >
                {likesCount}
            </p>
        </div>
    )
}
