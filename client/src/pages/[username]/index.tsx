import React, { useEffect }         from "react"
import { withAuth }                 from '@utils/withAuth'
import ProfileLayout                from "@components/layouts/ProfileLayout"
import { useDispatch, useSelector } from "react-redux"
import { RootState }                from "@store/index"
import { fetchPostsAction }         from "@actions/profileActions"
import useInfiniteScroll            from "react-infinite-scroll-hook"
import PostCard                     from "@components/home/PostCard"
import { CircularProgress }         from "@mui/material"
import { useRouter }                from "next/router"
import { clearData }                from "@slices/profileSlice"

function Index() {
    //hooks
    const { posts, isLoadingPosts, postsMeta } = useSelector( ( state: RootState ) => state.profile )
    const dispatch                             = useDispatch()
    const router                               = useRouter()

    const username = router.query.username as string

    useEffect( () => {
        dispatch( clearData() )
        if ( username ) {
            dispatch( fetchPostsAction( username, 1 ) )
        }
    }, [ dispatch, username ] )


    const [ scrollBottomRef ] = useInfiniteScroll( {
        loading: isLoadingPosts,
        hasNextPage: !!postsMeta?.nextPage,
        onLoadMore: () => dispatch( fetchPostsAction( username, postsMeta?.nextPage ) ),
    } )

    return (
        <ProfileLayout>
            <>
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
            </>
        </ProfileLayout>
    )
}

export default withAuth( Index )
