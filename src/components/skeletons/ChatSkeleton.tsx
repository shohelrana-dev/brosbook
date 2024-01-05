import React from 'react'
import Skeleton from 'react-loading-skeleton'

export default function ChatSkeleton({ count = 3 }) {
    return (
        <>
            <p className='text-center my-2 text-gray-500'>Loading...</p>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i}>
                    <div className='flex flex-wrap gap-2 items-center mb-7'>
                        <div className='self-end'>
                            <Skeleton
                                circle
                                height={40}
                                width={40}
                            />
                        </div>
                        <div>
                            <div className='flex flex-wrap items-center gap-2 mb-1'>
                                <Skeleton
                                    width={120}
                                    height={35}
                                />
                                <Skeleton
                                    width={15}
                                    height={15}
                                    circle
                                />
                            </div>
                            <div className='flex flex-wrap items-center gap-2'>
                                <Skeleton
                                    width={220}
                                    height={35}
                                />
                                <Skeleton
                                    width={15}
                                    height={15}
                                    circle
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-2 items-center float-right mb-7 mr-3'>
                        <div>
                            <div className='flex flex-wrap items-center gap-2 mb-1 justify-end'>
                                <Skeleton
                                    width={15}
                                    height={15}
                                    circle
                                />
                                <Skeleton
                                    width={120}
                                    height={35}
                                />
                            </div>
                            <div className='flex flex-wrap items-center gap-2'>
                                <Skeleton
                                    width={15}
                                    height={15}
                                    circle
                                />
                                <Skeleton
                                    width={220}
                                    height={35}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}
