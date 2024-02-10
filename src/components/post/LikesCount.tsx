import cn from '~/utils/cn'

interface Props {
   isViewerLiked: boolean
   likesCount: number
}

export default function LikesCount({ isViewerLiked, likesCount }: Props) {
   return (
      <div className="text-pink-700 relative h-full">
         <p
            className={cn(
               'absolute left-0 top-1/2 translate-y-[-150%] opacity-0 duration-700 ease-in-out',
               !isViewerLiked && 'opacity-100 -translate-y-1/2'
            )}
         >
            {isViewerLiked ? likesCount - 1 : likesCount}
         </p>
         <p
            className={cn(
               'absolute left-0 top-1/2 translate-y-1/2 opacity-0 duration-700 ease-in-out',
               isViewerLiked && 'opacity-100 -translate-y-1/2'
            )}
         >
            {!isViewerLiked ? likesCount + 1 : likesCount}
         </p>
      </div>
   )
}
