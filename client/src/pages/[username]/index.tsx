import React, { useEffect, useState } from "react"
import useInfiniteScroll              from "react-infinite-scroll-hook"
import { CircularProgress }           from "@mui/material"
import { useRouter }                  from "next/router"

import ProfileLayout                                             from "@components/layouts/ProfileLayout"
import PostCard                                                  from "@components/home/PostCard"
import { useGetUserManyPostQuery, useGetOneUserQuery, usersApi } from "@services/usersApi"
import { wrapper }                                               from "@store/store"
import { Post }                                                  from "@interfaces/posts.interfaces"

export default function UserProfilePage(){
    //hooks
    const router                     = useRouter()
    const [page, setPage]            = useState<number>( 1 )
    const { data: user }             = useGetOneUserQuery( router.query.username as string )
    const { isLoading, data: posts } = useGetUserManyPostQuery( { userId: user?.id!, page } )
    const [postItems, setPostItems]  = useState<Post[]>( posts?.items! || [] )

    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! posts?.nextPage,
        onLoadMore: async() => setPage( posts?.nextPage! ),
    } )

    useEffect( () => setPostItems( [...postItems, ...posts?.items! || []] ), [posts] )

    return (
        <ProfileLayout>
            <>
                { postItems && postItems.length > 0 && postItems.map( post => (
                    <PostCard post={ post } key={ post.id }/>
                ) ) }

                { posts?.nextPage ? (
                    <div className="flex justify-center min-h-[300px] items-center" ref={ scrollBottomRef }>
                        <CircularProgress/>
                    </div>
                ) : (
                    <p className="box text-center mt-5 py-10">No more posts</p>
                ) }
            </>
        </ProfileLayout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps( ( store ) => async( ctx ) => {
    const { data: user } = await store.dispatch( usersApi.endpoints.getOneUser.initiate( ctx.params?.username as string ) )
    await store.dispatch( usersApi.endpoints.getUserManyPost.initiate( { userId: user?.id!, page: 1 } ) )

    return { props: {} }
} )
