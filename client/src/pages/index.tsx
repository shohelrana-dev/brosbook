import useInfiniteScroll    from 'react-infinite-scroll-hook'
import { CircularProgress } from "@mui/material"
import { useState }         from "react"

import MainLayout           from "@components/layouts/MainLayout"
import CreatePostForm       from "@components/home/CreatePostForm"
import PostCard             from "@components/home/PostCard"
import { useGetPostsQuery } from "@services/postsApi"
import { wrapper }          from "@store/store"

export default function Home(){
    //hooks
    const [page, setPage]     = useState( 1 )
    const { isLoading, data } = useGetPostsQuery( { page } )

    const [scrollBottomRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! data?.meta?.nextPage,
        onLoadMore: () => setPage( data?.meta?.nextPage! )
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

                { !! data?.meta?.nextPage ? (
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

export const getServerSideProps = wrapper.getServerSideProps( ( store ) => async( ctx ) => {
    return { props: {} }
} )
