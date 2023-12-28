"use client"
import Avatar from "@components/global/Avatar"
import { useGetConversationByIdQuery, useGetConversationMediaListQuery } from "@services/conversationsApi"
import Loader from "@components/global/Loader"
import { ErrorResponse } from "@interfaces/index.interfaces"
import ImageLightbox from "@components/global/ImageLightbox"
import React, { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import Error from "@components/global/Error"
import useInfiniteScroll from "react-infinite-scroll-hook"
import useNavbarHeight from "@hooks/useNavbarHeight"

const classes = {
    box      : `box p-5 mb-3`,
    header   : `flex flex-col justify-center items-center`,
    name     : `font-medium text-lg text-gray-800 mt-3`,
    bio      : `text-gray-600`,
    label    : `text-gray-900 font-medium mb-0.5`,
    heading  : `text-lg font-medium mb-3`,
    infoItem : ( last?: boolean ) => `pb-2 mb-2 ${!last && 'border-0 border-b-[1px] border-solid border-gray-200'}`
}

export default function ParticipantInfo() {
    //hooks
    const { conversationId }                                = useParams()
    const { data: conversation }                            = useGetConversationByIdQuery(conversationId as string)
    const [ page, setPage ]                                 = useState<number>(1)
    const conversationMediaListQuery                        = useGetConversationMediaListQuery({ conversationId: String(conversationId), page })
    const { isLoading, isSuccess, isError, data: listData } = conversationMediaListQuery || {}
    const containerRef                                      = useRef<HTMLDivElement>(null)
    const navbarHeight                                      = useNavbarHeight()

    const { items: mediaList = [], nextPage } = listData || {}
    const error                               = conversationMediaListQuery.error as ErrorResponse || {}

    useEffect(() => {
        if ( containerRef.current && containerRef.current.parentElement ) {
            containerRef.current.style.height = `${ containerRef?.current?.parentElement?.offsetHeight }px`
        }
    }, [])

    const [ moreLoadRef ] = useInfiniteScroll({
        loading: isLoading,
        hasNextPage: !!nextPage,
        onLoadMore: () => setPage(nextPage!)
    })

    const participant = conversation?.participant

    if ( !participant ) return null

    const { fullName, avatar, email, active } = participant
    const { bio, phone, location }            = participant.profile || {}

    //decide listContent
    let listContent = null
    if ( isLoading ) {
        listContent = <Loader/>
    } else if ( isSuccess && mediaList.length === 0 ) {
        listContent = <p className="text-center py-4">No media files.</p>
    } else if ( isError ) {
        listContent = <Error message={ error.data?.message }/>
    } else if ( isSuccess && mediaList.length > 0 ) {
        listContent = <ImageLightbox imageList={ mediaList } alt="Chat photo"/>
    }

    return (
        <div ref={ containerRef } style={{height: `calc(100vh - ${navbarHeight})`}} className="overflow-y-auto">
            <div className={`mt-2 ${classes.box}`}>
                <header className={classes.header}>
                    <Avatar
                        online={ !!active }
                        src={ avatar.url }
                        size="large"
                        alt={ fullName }
                    />
                    <h3 className={classes.name}>
                        { fullName }
                    </h3>
                    <p className={classes.bio}>
                        { bio }
                    </p>
                </header>
            </div>

            <div className={classes.box}>
                <h3 className={classes.heading}>
                    Personal Information
                </h3>
                { location ? (
                    <div className={classes.infoItem()}>
                        <p className={classes.label}>
                            Address
                        </p>
                        <div>{ location }</div>
                    </div> 
                ) : null }

                { phone ? (
                    <div className={classes.infoItem()}>
                        <p className={classes.label}>
                            Phone
                        </p>
                        <div>{ phone }</div>
                    </div>
                ) : null }

                { email ? (
                    <div className={classes.infoItem(true)}>
                        <p className={classes.label}>
                            Email
                        </p>
                        <div>{ email }</div>
                    </div>
                ) : null }
            </div>

            <div className={classes.box}>
                <h3 className={classes.heading}>Shared Media</h3>

                <div>{ listContent }</div>

                { nextPage ? (
                    <div className="my-4" ref={ moreLoadRef }>
                        <Loader/>
                    </div>
                ) : null }
            </div>
        </div>
    )
}