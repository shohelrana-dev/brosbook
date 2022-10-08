import React, { useState }  from 'react'
import { SRLWrapper }       from "simple-react-lightbox"
import OutlinedFavoriteIcon from "@mui/icons-material/FavoriteBorderOutlined"
import FavoriteIcon         from '@mui/icons-material/Favorite'
import CommentIcon          from "@mui/icons-material/ModeCommentOutlined"
import IosShareIcon         from "@mui/icons-material/IosShare"
import Link                 from "next/link"
import { Zoom }             from "@mui/material"

import Avatar                                         from "@components/common/Avatar"
import { Post }                                       from "@interfaces/posts.interfaces"
import CommentList                                    from "@components/home/PostCard/CommentList"
import { usePostLikeMutation, usePostUnlikeMutation } from "@services/postsApi"
import timeAgo                                        from "@utils/timeAgo"

interface PostCardProps {
    post: Post
}

const PostCard = ( { post }: PostCardProps ) => {
    //hooks
    const [postLike]   = usePostLikeMutation()
    const [postUnlike] = usePostUnlikeMutation()

    const [hasCurrentUserLike, setHasCurrentUserLike] = useState<boolean>( post.hasCurrentUserLike )
    const [likeCount, setLikeCount]                   = useState<number>( post.likeCount )
    const [isShowComment, setIsShowComment]           = useState<boolean>( false )

    async function handlePostLike(){
        try {
            await postLike( post.id ).unwrap()
            setHasCurrentUserLike( true )
            setLikeCount( likeCount + 1 )
        } catch ( err ) {
            console.error( err )
        }
    }

    async function handlePostUnlike(){
        try {
            await postUnlike( post.id ).unwrap()
            setHasCurrentUserLike( false )
            setLikeCount( likeCount - 1 )
        } catch ( err ) {
            console.error( err )
        }
    }

    return (
        <div className="box p-6 mt-6" id={ `post-${ post.id }` }>
            <div className="flex">
                <Link href={ `/${ post.user.username }` }>
                    <a>
                        <Avatar src={ post.user.photo }/>
                    </a>
                </Link>
                <div className="ml-4">
                    <Link href={ `/${ post.user.username }` }>
                        <a>
                            <h3 className="text-md font-medium">
                                { post.user.fullName }
                            </h3>
                        </a>
                    </Link>
                    <p className="text-gray-500 font-medium text-xs">
                        { timeAgo( post.createdAt ) }
                    </p>
                </div>
            </div>
            <div>
                { post.body && (
                    <div className="my-1">
                        { post.body }
                    </div>
                ) }
                { post.photo && (
                    <div className="my-3">
                        <SRLWrapper>
                            <a href={ post.photo }>
                                <img src={ post.photo }/>
                            </a>
                        </SRLWrapper>
                    </div>
                ) }
                <div
                    className="flex mt-2 border-t-2 border-b-2 border-gray-100 py-1 border-solid justify-around">
                    <div className="flex items-center text-pink-500 relative">
                        <Zoom in={ hasCurrentUserLike }>
                            <button
                                onClick={ handlePostUnlike }
                                className="mr-2 hover:bg-pink-100 rounded-full p-2 duration-300 absolute"
                            >
                                <FavoriteIcon/>
                            </button>
                        </Zoom>
                        <Zoom in={ ! hasCurrentUserLike }>
                            <button
                                onClick={ handlePostLike }
                                className="mr-2 hover:bg-pink-100 rounded-full p-2 duration-300"
                            >
                                <OutlinedFavoriteIcon/>
                            </button>
                        </Zoom>
                        <p>{ likeCount }</p>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <button className="mr-2" onClick={ () => setIsShowComment( ! isShowComment ) }>
                            <CommentIcon/>
                        </button>
                        <p>{ post.commentCount }</p>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <button className="mr-2">
                            <IosShareIcon/>
                        </button>
                    </div>
                </div>

                <CommentList postId={ post.id } isShowComment={ isShowComment }/>

            </div>
        </div>
    )
}

export default PostCard
