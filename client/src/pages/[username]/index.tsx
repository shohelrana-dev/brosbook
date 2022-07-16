import React, { useState }                               from "react"
import useInfiniteScroll                                 from "react-infinite-scroll-hook"
import { CircularProgress }                              from "@mui/material"
import { useRouter }                                     from "next/router"
import { GetServerSideProps, GetServerSidePropsContext } from "next"

import ProfileLayout    from "@components/layouts/ProfileLayout"
import PostCard         from "@components/home/PostCard"
import { Post }         from "@interfaces/posts.interfaces"
import { User }         from "@interfaces/user.interfaces"
import { PaginateMeta } from "@interfaces/index.interfaces"
import profileApi       from "@api/profile"

interface ProfileProps {
    posts: Post[],
    user: User,
    postsMeta: PaginateMeta
}

function Index( props: ProfileProps ){
    //hooks
    const [isLoadingPosts, setIsLoadingPosts] = useState<boolean>( false )
    const [posts, setPosts]                   = useState<Post[]>( props.posts )
    const [postsMeta, setPostsMeta]           = useState<PaginateMeta>( props.postsMeta )
    const router                              = useRouter()

    const username = router.query.username as string

    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoadingPosts,
        hasNextPage: !! postsMeta?.nextPage,
        onLoadMore: async() => {
            setIsLoadingPosts( true )
            try {
                const { data } = await profileApi.fetchPosts( username, postsMeta.nextPage )
                setPosts( [...posts, ...data.posts] )
                setPostsMeta( data.meta )
            } finally {
                setIsLoadingPosts( false )
            }
        },
    } )

    return (
        <ProfileLayout user={ props.user }>
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

export const getServerSideProps: GetServerSideProps = async( context: GetServerSidePropsContext ) => {
    const username = context.params?.username as string

    try {
        const { data: postsData } = await profileApi.fetchPosts( username, 1 )
        const { data: userData }  = await profileApi.fetchUser( username )
        return {
            props: {
                user: userData.user || {},
                posts: postsData.posts || [],
                postsMeta: postsData?.meta || {}
            }
        }
    } catch ( e ) {

    }

    return {
        props: {
            user: {},
            posts: [],
            postsMeta: {}
        }
    }
}

export default Index
