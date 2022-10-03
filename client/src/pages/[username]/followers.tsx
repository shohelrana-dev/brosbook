import React, { useEffect, useState } from 'react'
import { useRouter }                  from "next/router"
import { CircularProgress }           from "@mui/material"
import useInfiniteScroll              from "react-infinite-scroll-hook"

import ProfileLayout                                          from "@components/layouts/ProfileLayout"
import FollowUser                                             from "@components/common/FollowUser"
import { useGetFollowersQuery, useGetOneUserQuery, usersApi } from "@services/usersApi"
import { wrapper }                                            from "@store/store"
import { User }                                               from "@interfaces/user.interfaces"

export default function Followers(){
    //hooks
    const router                            = useRouter()
    const [page, setPage]                   = useState<number>( 1 )
    const { data: user }                    = useGetOneUserQuery( router.query.username as string )
    const { isLoading, data: followers }    = useGetFollowersQuery( { userId: user?.id!, page } )
    const [followerItems, setFollowerItems] = useState<User[]>( followers?.items! )

    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! followers?.nextPage,
        onLoadMore: () => setPage( followers?.nextPage! )
    } )

    useEffect( () => setFollowerItems( [...followerItems, ...followers?.items || []] ), [followers] )

    return (
        <ProfileLayout>
            <>
                { followerItems.length > 0 && followerItems.map( user => (
                    <FollowUser user={ user } key={ user.id } isFollowing={ false }/>
                ) ) }

                { followers?.nextPage && (
                    <div className="flex justify-center min-h-[300px] items-center" ref={ scrollBottomRef }>
                        <CircularProgress/>
                    </div>
                ) }

                { ! isLoading && followerItems.length < 1 && (
                    <p className="box text-center py-10">You have no follower</p>
                ) }

                { ! isLoading && followerItems.length > 1 && ! followers?.nextPage && (
                    <p className="box text-center py-10">No more followers</p>
                ) }
            </>
        </ProfileLayout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps( ( store ) => async( ctx ) => {
    const { data: user } = await store.dispatch( usersApi.endpoints.getOneUser.initiate( ctx.params?.username as string ) )
    await store.dispatch( usersApi.endpoints.getFollowers.initiate( { userId: user?.id!, page: 1 } ) )

    return { props: {} }
} )