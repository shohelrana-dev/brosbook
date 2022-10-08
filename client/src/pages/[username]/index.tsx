import React, { useEffect, useState } from "react"
import useInfiniteScroll              from "react-infinite-scroll-hook"
import { useRouter }                  from "next/router"

import ProfileLayout                                       from "@components/layouts/ProfileLayout"
import PostCard                                            from "@components/home/PostCard"
import { useGetUserPostsQuery, useGetUserQuery, usersApi } from "@services/usersApi"
import { wrapper }                                         from "@store/store"
import { Post }                                            from "@interfaces/posts.interfaces"
import { Facebook }                                        from "react-content-loader"

export default function UserProfilePage(){
    //hooks
    const router                     = useRouter()
    const [page, setPage]            = useState<number>( 1 )
    const { data: user }             = useGetUserQuery( router.query.username as string )
    const { isLoading, data: posts } = useGetUserPostsQuery( { userId: user?.id!, page } )
    const [postItems, setPostItems]  = useState<Post[]>( posts?.items! || [] )

    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! posts?.nextPage,
        onLoadMore: async() => setPage( posts?.nextPage! ),
    } )

    useEffect( () => {
        if( posts?.currentPage !== 1 ){
            setPostItems( ( prevState ) => [...prevState, ...posts?.items! || []] )
        }
    }, [posts] )

    return (
        <ProfileLayout>
            <>
                { postItems && postItems.length > 0 ? postItems.map( post => (
                    <PostCard post={ post } key={ post.id }/>
                ) ) : (
                    <p className="box text-center mt-5 py-10">User haven&apos;t any post.</p>
                ) }

                { posts?.nextPage && (
                    <div className="box mt-5 p-5" ref={ scrollBottomRef }>
                        <Facebook/>
                        <Facebook/>
                    </div>
                ) }
                {
                    postItems.length > 0 && ! posts?.nextPage && ! isLoading && (
                        <p className="box text-center mt-5 py-10">No more posts</p>
                    )
                }
            </>
        </ProfileLayout>
    )
}

export const getServerSideProps = wrapper.getServerSideProps( ( store ) => async( ctx ) => {
    const { data: user } = await store.dispatch( usersApi.endpoints.getUser.initiate( ctx.params?.username as string ) )
    await store.dispatch( usersApi.endpoints.getUserPosts.initiate( { userId: user?.id!, page: 1 } ) )

    return { props: {} }
} )
