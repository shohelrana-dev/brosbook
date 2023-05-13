"use client"
import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation } from "swiper"
import "swiper/css"
import "swiper/css/pagination"
import useAuthState from "@hooks/useAuthState"
import { useGetSuggestedUsersQuery } from "@services/usersApi"
import { ErrorResponse } from "@interfaces/index.interfaces"
import Error from "@components/global/Error"
import { User } from "@interfaces/user.interfaces"
import Avatar from "@components/global/Avatar"
import FollowButton from "@components/global/FollowButton"
import TextOverflow from "react-text-overflow"
import Loading from "@components/global/Loading"
import useMediaQuery from "@hooks/useMediaQuery"

export default function SlidesSuggestions() {
    const { isAuthenticated } = useAuthState()
    const suggestedUsersQuery = useGetSuggestedUsersQuery( { page: 1, limit: 6 } )
    const isMobileDevice      = useMediaQuery( '(max-width: 768px)' )

    const { isError, isLoading, isSuccess } = suggestedUsersQuery
    const { items: users = [] }             = suggestedUsersQuery?.data || {}
    const error                             = ( suggestedUsersQuery.error || {} ) as ErrorResponse

    if ( !isAuthenticated || !isMobileDevice ) return null

    //decide render content
    let content = null
    if ( isLoading ) {
        content = <Loading/>
    } else if ( isSuccess && users.length === 0 ) {
        content = <p>No suggestions</p>
    } else if ( isError ) {
        content = <Error message={ error?.data?.message }/>
    } else if ( isSuccess && users.length > 0 ) {
        content = users.map( ( user: User ) => (
            <SwiperSlide key={ user.id }>
                <div className="flex items-center justify-center flex-col box p-3">
                    <Avatar src={ user.avatar.url } className="mb-2"/>
                    <h4 className="font-bold text-gray-900 text-base">
                        <TextOverflow text={ user.fullName }/>
                    </h4>
                    <p className="text-gray-700 mb-3">@{ user.username }</p>
                    <FollowButton user={ user }/>
                </div>
            </SwiperSlide>
        ) )
    }

    return (
        <div className="mt-1 mb-2 p-2">
            <h3 className="text-gray-900 text-lg font-bold mb-2">Who to follow</h3>
            <Swiper
                slidesPerView={ 3 }
                spaceBetween={ 10 }
                navigation={ true }
                modules={ [Pagination, Navigation] }
            >
                { content }
            </Swiper>
        </div>
    )
}