import { useDispatch, useSelector } from "react-redux"
import { useEffect }                from "react"
import useInfiniteScroll            from 'react-infinite-scroll-hook'
import { CircularProgress }         from "@mui/material"

import MainLayout           from "@components/layouts/MainLayout"
import { RootState }        from "@store/index"
import CreatePostForm       from "@components/home/CreatePostForm"
import { fetchPostsAction } from "@actions/postsActions"
import PostCard             from "@components/home/PostCard"
import { withAuth }         from "@utils/withAuth"

function Home() {
    //hooks
    const { posts, isLoadingPosts, postsMeta } = useSelector( ( state: RootState ) => state.posts )
    const dispatch                             = useDispatch()

    useEffect( () => {
        dispatch( fetchPostsAction( 1 ) )
    }, [ dispatch ] )


    const [ scrollBottomRef ] = useInfiniteScroll( {
        loading: isLoadingPosts,
        hasNextPage: !!postsMeta?.nextPage,
        onLoadMore: () => dispatch( fetchPostsAction( postsMeta?.nextPage ) ),
    } )

    return (
        <MainLayout>
            <div className="container pt-6 mb-6">
                <div className="box p-6">
                    <CreatePostForm/>
                </div>

                { posts.length > 0 && posts.map( post => (
                    <PostCard post={ post } key={ post.id }/>
                ) ) }

                { !!postsMeta?.nextPage ? (
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

export default withAuth( Home )
