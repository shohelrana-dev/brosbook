import React                from "react"
import useInfiniteScroll    from "react-infinite-scroll-hook"
import { CircularProgress } from "@mui/material"
import { useRouter }        from "next/router"

import ProfileLayout                                       from "@components/layouts/ProfileLayout"
import PostCard                                            from "@components/home/PostCard"
import { User }                                            from "@interfaces/user.interfaces"
import { PaginateMeta }                                    from "@interfaces/index.interfaces"
import { useGetUserPostsQuery, useGetUserQuery, usersApi } from "@services/usersApi"
import { wrapper }                                         from "@store/store"

export default function UserProfilePage(){
    //hooks
    const router              = useRouter()
    const { isLoading, data } = useGetUserPostsQuery( { username: router.query.username as string } )
    const { data: userData }  = useGetUserQuery( router.query.username as string )

    const posts     = data?.posts || []
    const postsMeta = data?.meta || {} as PaginateMeta
    const user      = userData?.user || {} as User

    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! postsMeta?.nextPage,
        onLoadMore: async() => {},
    } )

    return (
        <ProfileLayout user={ user }>
            <>
                { posts.length > 0 && posts.map( post => (
                    <PostCard post={ post } key={ post.id }/>
                ) ) }

                { !! postsMeta?.nextPage ? (
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
    store.dispatch( usersApi.endpoints.getUserPosts.initiate( { username: ctx.params?.username as string } ) )
    store.dispatch( usersApi.endpoints.getUser.initiate( ctx.params?.username as string ) )
    await Promise.all( usersApi.util.getRunningOperationPromises() )

    return { props: {} }
} )
