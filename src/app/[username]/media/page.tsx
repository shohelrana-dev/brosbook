'use client'
import Image from 'next/image'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry from 'react-responsive-masonry'
import Error from '~/components/global/Error'
import Lightbox from '~/components/global/Lightbox'
import Loader from '~/components/global/Loader'
import Transition from '~/components/global/Transition'
import { extractErrorMessage } from '~/lib/error'
import { useGetMediaListQuery, useGetUserByUsernameQuery } from '~/services/usersApi'

interface Props {
    params: { username: string }
}

export default function MediaPage({ params }: Props) {
    const [page, setPage] = useState(1)
    const { data: user } = useGetUserByUsernameQuery(params.username)
    const mediaListQuery = useGetMediaListQuery({ userId: user?.id!, page }, { skip: !user?.id })

    const { data: mediaListData, isLoading, isSuccess, isError, error, isUninitialized } = mediaListQuery
    const { items: mediaList, nextPage } = mediaListData || {}

    //decide content
    let content = null
    if (isLoading || isUninitialized) {
        content = <Loader />
    } else if (isError) {
        content = <Error message={extractErrorMessage(error)} />
    } else if (isSuccess && mediaList && mediaList.length === 0) {
        content = <p className='text-center py-3'>{user?.fullName} haven&apos;t media.</p>
    } else if (isSuccess && mediaList && mediaList.length > 0) {
        content = (
            <Transition>
                <InfiniteScroll
                    dataLength={mediaList.length}
                    next={() => setPage(nextPage!)}
                    hasMore={!!nextPage}
                    loader={<Loader />}
                >
                    <Lightbox>
                        <Masonry gutter='10px'>
                            {mediaList.map(({ id, url }) => (
                                <a key={id} href={url}>
                                    <Image
                                        src={url}
                                        width={200}
                                        height={150}
                                        alt={`${user?.fullName}'s photos`}
                                    />
                                </a>
                            ))}
                        </Masonry>
                    </Lightbox>
                </InfiniteScroll>
            </Transition>
        )
    }

    return <div className='card'>{content}</div>
}
