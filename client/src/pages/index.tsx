import useInfiniteScroll       from 'react-infinite-scroll-hook'
import { useEffect, useState } from "react"
import { Facebook }            from "react-content-loader"

import MainLayout               from "@components/layouts/MainLayout"
import CreatePostForm           from "@components/home/CreatePostForm"
import PostCard                 from "@components/home/PostCard"
import { useGetFeedPostsQuery } from "@services/postsApi"
import ensureServerSideAuth     from "@utils/ensureServerSideAuth"
import { Post }                 from "@interfaces/posts.interfaces"

function Home(){
    //hooks
    const [page, setPage]            = useState<number>( 1 )
    const { isLoading, data: posts } = useGetFeedPostsQuery( { page } )
    const [postItems, setPostItems]  = useState<Post[]>( posts?.items! || [] )

    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! posts?.nextPage,
        onLoadMore: async() => setPage( posts?.nextPage! ),
    } )

    useEffect( () => setPostItems( [...postItems, ...posts?.items! || []] ), [posts] )

    return (
        <MainLayout>
            <div className=" pt-6 mb-6">
                <div className="box p-6">
                    <CreatePostForm/>
                </div>
                { ! isLoading && ( postItems.length > 0 ? postItems.map( post => (
                    <PostCard post={ post } key={ post.id }/>
                ) ) : (
                    <p className="box text-center mt-5 py-10">Your feed is empty.</p>
                ) ) }

                { posts?.nextPage && (
                    <div className="box mt-5 p-5" ref={ scrollBottomRef }>
                        <Facebook/>
                    </div>
                ) }
                {
                    postItems.length > 0 && ! posts?.nextPage && ! isLoading && (
                        <p className="box text-center mt-5 py-10">No more posts</p>
                    )
                }

            </div>
        </MainLayout>
    )
}

export default Home

export const getServerSideProps = ensureServerSideAuth
