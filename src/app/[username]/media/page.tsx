"use client"
import React from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { useGetMediaListQuery, useGetUserByUsernameQuery } from "@services/usersApi"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import Loading from "@components/global/Loading"
import ImageLightbox from "@components/global/ImageLightbox"
import InfiniteScroll from "react-infinite-scroller"

interface Props {
    params: { username: string }
}

export default function MediaPage( { params }: Props ){
    const { data: user } = useGetUserByUsernameQuery( params.username )
    const {
              isLoading,
              items: mediaList,
              loadMoreItem,
              hasMoreItem
          }              = useGetInfiniteListQuery( useGetMediaListQuery, { userId: user?.id } )

    if( isLoading && mediaList?.length < 1 ){
        return (
            <div className="box py-3 text-center">
                <Loading size={ 45 }/>
            </div>
        )
    }

    if( ! isLoading && mediaList?.length < 1 ){
        return (
            <div className="box text-center py-3">
                { user?.fullName } haven't media.
            </div>
        )
    }

    return (
        <div className="box">
            <InfiniteScroll
                loadMore={ loadMoreItem }
                hasMore={ hasMoreItem }
                loader={ <Loading size={ 40 }/> }
            >
                <ImageLightbox imageList={ mediaList } width={ 200 } height={ 200 } alt="Media"/>
            </InfiniteScroll>
        </div>
    )
}
