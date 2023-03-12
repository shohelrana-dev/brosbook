"use client"
import React from 'react'
import { useGetMediaListQuery, useGetUserByUsernameQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/global/Loading"
import ImageLightbox from "@components/global/ImageLightbox"
import InfiniteScroll from "react-infinite-scroller"
import Error from "@components/global/Error"

interface Props {
    params: { username: string }
}

export default function MediaPage( { params }: Props ){
    const { data: user }                                                                = useGetUserByUsernameQuery( params.username )
    const { isLoading, isSuccess, isError, items: mediaList, error, loadMore, hasMore } = useGetInfiniteListQuery(
        useGetMediaListQuery, { userId: user?.id }
    )

    //decide content
    let content = null
    if( isLoading ){
        content = <div className="py-3"><Loading size={ 50 }/></div>
    } else if( isSuccess && mediaList.length === 0 ){
        content = <p className="text-center py-3">{ user?.fullName } haven't media.</p>
    } else if( isError ){
        content = <Error message={ error?.data?.message }/>
    } else if( isSuccess && mediaList.length > 0 ){
        content = (
            <InfiniteScroll
                loadMore={ loadMore }
                hasMore={ hasMore }
                loader={ <Loading size={ 40 }/> }
            >
                <ImageLightbox imageList={ mediaList } width={ 200 } height={ 200 } alt="Media"/>
            </InfiniteScroll>
        )
    }

    return (
        <div className="box">
            { content }
        </div>
    )
}
