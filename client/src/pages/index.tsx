import useInfiniteScroll from 'react-infinite-scroll-hook'
import { useState }      from "react"
import { Facebook }      from "react-content-loader"

import MainLayout           from "@components/layouts/MainLayout"
import CreatePostForm       from "@components/home/CreatePostForm"
import PostCard             from "@components/home/PostCard"
import { useGetPostsQuery } from "@services/postsApi"
import ensureServerSideAuth from "@utils/ensureServerSideAuth"

function Home(){
    //hooks
    const [page, setPage]            = useState( 1 )
    const { isLoading, data: posts } = useGetPostsQuery( { page } )

    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! posts?.nextPage,
        onLoadMore: () => setPage( posts?.nextPage! )
    } )

    return (
        <MainLayout>
            <div className="container pt-6 mb-6">
                <div className="box p-6">
                    <CreatePostForm/>
                </div>
                { posts?.items && posts?.items.length > 0 && posts?.items?.map( post => (
                    <PostCard post={ post } key={ post.id }/>
                ) ) }

                { !! posts?.nextPage ? (
                    <div className="box mt-5 p-5" ref={ scrollBottomRef }>
                        <Facebook/>
                    </div>
                ) : (
                    <p className="box text-center mt-5 py-10">No more posts</p>
                ) }

            </div>
        </MainLayout>
    )
}

export default Home

export const getServerSideProps = ensureServerSideAuth
