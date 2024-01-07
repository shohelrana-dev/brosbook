import ChatSkeleton from '@components/skeletons/ChatSkeleton'
import Skeleton from 'react-loading-skeleton'

export default function MessageBoxSkeleton() {
    return (
        <div className='m-3 h-screen-content flex flex-col'>
            <div className='box bg-white px-3 py-2 flex flex-wrap justify-between gap-3 items-center'>
                <div className='flex flex-wrap gap-3 '>
                    <Skeleton width={48} height={48} circle />
                    <div>
                        <div className='flex flex-wrap gap-2 mb-1 items-center'>
                            <Skeleton width={200} height={14} />
                        </div>
                        <Skeleton width={80} height={8} />
                    </div>
                </div>

                <Skeleton width={30} height={30} circle />
            </div>

            <div className='flex-grow flex flex-col-reverse overflow-y-auto'>
                <ChatSkeleton />
            </div>

            <Skeleton width={'100%'} height={44} className='!rounded-xl mb-8' />
        </div>
    )
}
