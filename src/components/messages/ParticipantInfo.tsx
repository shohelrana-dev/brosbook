'use client'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import Masonry from 'react-responsive-masonry'
import Avatar from '~/components/global/Avatar'
import Error from '~/components/global/Error'
import Lightbox from '~/components/global/Lightbox'
import Loader from '~/components/global/Loader'
import Transition from '~/components/global/Transition'
import { extractErrorMessage } from '~/lib/error'
import { cn } from '~/lib/utils'
import {
    useGetConversationByIdQuery,
    useGetConversationMediaListQuery,
} from '~/services/conversationsApi'

const classes = {
    card: `card p-5 mb-3`,
    header: `flex flex-col justify-center items-center`,
    name: `font-medium text-lg text-gray-800 mt-3`,
    bio: `text-gray-600`,
    label: `text-gray-900 font-medium mb-0.5`,
    heading: `text-lg font-medium mb-3`,
    infoItem: (last?: boolean) => cn('pb-2 mb-2', { 'border-b border-gray-200': !last }),
    mediaWrapper: 'flex-grow overflow-y-auto mb-0',
}

export default function ParticipantInfo() {
    //hooks
    const { conversationId } = useParams()
    const { data: conversation } = useGetConversationByIdQuery(conversationId as string)
    const [page, setPage] = useState<number>(1)
    const conversationMediaListQuery = useGetConversationMediaListQuery({
        conversationId: String(conversationId),
        page,
    })
    const containerRef = useRef<HTMLDivElement>(null)

    const { isLoading, isSuccess, isError, data: listData, error } = conversationMediaListQuery
    const { items: mediaList, nextPage } = listData || {}

    useEffect(() => {
        const containerEl = containerRef.current

        if (containerEl?.parentElement) {
            containerEl.style.height = `${containerEl.parentElement.offsetHeight}px`
        }
    }, [])

    const [moreLoadRef] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: !!nextPage,
        onLoadMore: () => setPage(nextPage!),
    })

    const participant = conversation?.participant

    if (!participant) return null

    const { fullName, avatar, email, active } = participant
    const { bio, phone, location } = participant.profile || {}

    //decide listContent
    let listContent = null
    if (isLoading) {
        listContent = <Loader />
    } else if (isError) {
        listContent = <Error message={extractErrorMessage(error)} />
    } else if (isSuccess && mediaList && mediaList.length === 0) {
        listContent = <p className='text-center py-4'>No media files.</p>
    } else if (isSuccess && mediaList && mediaList.length > 0) {
        listContent = (
            <Transition>
                <Lightbox>
                    <Masonry gutter='6px'>
                        {mediaList.map(({ id, url }) => (
                            <a key={id} href={url}>
                                <Image src={url} width={200} height={150} alt='Chat photo' />
                            </a>
                        ))}
                    </Masonry>
                </Lightbox>
            </Transition>
        )
    }

    return (
        <div ref={containerRef} className='h-full flex flex-col'>
            <div className={classes.card}>
                <header className={classes.header}>
                    <Avatar online={!!active} src={avatar.url} size='large' alt={fullName} />
                    <h3 className={classes.name}>{fullName}</h3>
                    <p className={classes.bio}>{bio}</p>
                </header>
            </div>

            <div className={classes.card}>
                <h3 className={classes.heading}>Personal Information</h3>
                {!!location && (
                    <div className={classes.infoItem()}>
                        <p className={classes.label}>Address</p>
                        <div>{location}</div>
                    </div>
                )}

                {!!phone && (
                    <div className={classes.infoItem()}>
                        <p className={classes.label}>Phone</p>
                        <div>{phone}</div>
                    </div>
                )}

                {!!email && (
                    <div className={classes.infoItem(true)}>
                        <p className={classes.label}>Email</p>
                        <div>{email}</div>
                    </div>
                )}
            </div>

            <div className={cn(classes.card, classes.mediaWrapper)}>
                <h3 className={classes.heading}>Shared Media</h3>

                {listContent}

                {!!nextPage && (
                    <div className='my-4' ref={moreLoadRef}>
                        <Loader />
                    </div>
                )}
            </div>
        </div>
    )
}
