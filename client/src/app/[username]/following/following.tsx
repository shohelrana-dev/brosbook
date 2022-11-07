import React, { useEffect, useState } from 'react'
import { useRouter }                  from "next/navigation"
import { CircularProgress }           from "@mui/material"
import useInfiniteScroll              from "react-infinite-scroll-hook"

import ProfileLayout                                          from "@components/layouts/ProfileLayout"
import FollowUser                                             from "@components/common/FollowUser"
import { useGetFollowingQuery, useGetUserByUsernameQuery, usersApi } from "@services/usersApi"
import { User }                                               from "@interfaces/user.interfaces"
import { wrapper }                                            from "@store/store"

export default function Following(){
    //hooks
    const router                              = useRouter()
    const [page, setPage]                     = useState<number>( 1 )
    const { data: user }                      = useGetUserByUsernameQuery( router.query.username as string )
    const { isLoading, data: following }      = useGetFollowingQuery( { userId: user?.id!, page } )
    const [followingItems, setFollowingItems] = useState<User[]>( following?.items! )


    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! following?.nextPage,
        onLoadMore: () => setPage( following?.nextPage! ),
    } )

    useEffect( () => setFollowingItems( [...followingItems, ...following?.items || []] ), [following] )

    return (
        <ProfileLayout>
            <>
                { followingItems.length > 0 && followingItems.map( user => (
                    <FollowUser user={ user } key={ user.id } isFollowing={ false }/>
                ) ) }

                { following?.nextPage && (
                    <div className="flex justify-center min-h-[300px] items-center" ref={ scrollBottomRef }>
                        <CircularProgress/>
                    </div>
                ) }

                { ! isLoading && followingItems.length < 1 && (
                    <p className="box text-center py-10">You haven't followed anyone yet</p>
                ) }

                { ! isLoading && followingItems.length > 0 && ! following?.nextPage && (
                    <p className="box text-center py-10">No more following</p>
                ) }
            </>
        </ProfileLayout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps( ( store ) => async( ctx ) => {
    const { data: user } = await store.dispatch( usersApi.endpoints.getUser.initiate( ctx.params?.username as string ) )
    await store.dispatch( usersApi.endpoints.getFollowing.initiate( { userId: user?.id!, page: 1 } ) )

    return { props: {} }
} )