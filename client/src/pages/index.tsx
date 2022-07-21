import useInfiniteScroll      from 'react-infinite-scroll-hook'
import { CircularProgress }   from "@mui/material"
import { GetServerSideProps } from "next"
import { useState }           from "react"

import MainLayout             from "@components/layouts/MainLayout"
import CreatePostForm         from "@components/home/CreatePostForm"
import PostCard               from "@components/home/PostCard"
import { withAuthServerSide } from "@utils/withAuth"
import { useGetPostsQuery }   from "@services/postsApi"

function Home(){
    //hooks
    const [page, setPage]     = useState( 1 )
    const { isLoading, data } = useGetPostsQuery( { page } )


    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! data?.postsMeta?.nextPage,
        onLoadMore: () => setPage( data?.postsMeta?.nextPage ),
    } )

    return (
        <MainLayout>
            <div className="container pt-6 mb-6">
                <div className="box p-6">
                    <CreatePostForm/>
                </div>

                { data?.posts && data?.posts?.length > 0 && data?.posts?.map( post => (
                    <PostCard post={ post } key={ post.id }/>
                ) ) }

                { !! data?.postsMeta?.nextPage ? (
                    <div className="flex justify-center min-h-[300px] items-center" ref={ scrollBottomRef }>
                        <CircularProgress/>
                    </div>
                ) : (
                    <p className="box text-center mt-5 py-10">No more posts</p>
                ) }

            </div>
        </MainLayout>
    )
}

// @ts-ignore
export const getServerSideProps: GetServerSideProps = withAuthServerSide( async() => {
    return {
        props: {
            posts: []
        }
    }
} )

export default Home
