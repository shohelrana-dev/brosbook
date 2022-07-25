import React                  from "react"
import useInfiniteScroll      from "react-infinite-scroll-hook"
import { CircularProgress }   from "@mui/material"
import { useRouter }          from "next/router"
import { GetServerSideProps } from "next"

import ProfileLayout                                       from "@components/layouts/ProfileLayout"
import PostCard                                            from "@components/home/PostCard"
import { User }                                            from "@interfaces/user.interfaces"
import { PaginateMeta }                                    from "@interfaces/index.interfaces"
import { wrapper }                                         from "@store/store"
import { useGetUserPostsQuery, useGetUserQuery, usersApi } from "@services/usersApi"

function Index(  ){
    //hooks
    const router                     = useRouter()
    const { isLoading, data, error } = useGetUserPostsQuery( { username: router.query.username as string } )
    const { data: userData }         = useGetUserQuery( router.query.username as string )

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

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps( store => async( context ) => {
    await store.dispatch<any>( usersApi.endpoints.getUser.initiate( context.params?.username as string ) )
    await store.dispatch<any>( usersApi.endpoints.getUserPosts.initiate( { username: context.params?.username as string } ) )

    return { props: {} }
} )

export default Index
