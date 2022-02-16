import React, { useState }  from 'react'
import { SRLWrapper }       from "simple-react-lightbox"
import OutlinedFavoriteIcon from "@mui/icons-material/FavoriteBorderOutlined"
import FavoriteIcon         from '@mui/icons-material/Favorite'
import CommentIcon          from "@mui/icons-material/ModeCommentOutlined"
import IosShareIcon         from "@mui/icons-material/IosShare"
import moment               from "moment"
import Link                 from "next/link"
import { Zoom }             from "@mui/material"

import Avatar      from "@components/common/Avatar"
import api         from "@api/index"
import { Post }    from "@interfaces/posts.interfaces"
import CommentList from "@components/home/PostCard/CommentList"

interface PostCardProps {
    post: Post
}

const PostCard = ( { post }: PostCardProps ) => {
    //hooks
    const [ hasCurrentUserLike, setHasCurrentUserLike ] = useState<boolean>( post.hasCurrentUserLike )
    const [ likeCount, setLikeCount ]                   = useState<number>( post.likeCount )
    const [ clickComment, setClickComment ]             = useState<boolean>( false )

    async function savePostLike() {
        try {
            await api.posts.savePostLike( post.id )
            setHasCurrentUserLike( true )
            setLikeCount( likeCount + 1 )
        } catch ( err: any ) {
            //console error message
            const message = err?.response?.data.message || ''
            console.error( message )
        }
    }

    async function removePostLike() {
        try {
            await api.posts.removePostLike( post.id )
            setHasCurrentUserLike( false )
            setLikeCount( likeCount - 1 )
        } catch ( err: any ) {
            //console error message
            const message = err?.response?.data.message || ''
            console.error( message )
        }
    }

    return (
        <div className="box p-6 mt-6" id={ `post-${ post.id }` }>
            <div className="flex">
                <Link href={ `/${ post.username }` }>
                    <a>
                        <Avatar src={ post.user.photo }/>
                    </a>
                </Link>
                <div className="ml-4">
                    <Link href={ `/${ post.username }` }>
                        <a>
                            <h3 className="text-md font-medium">
                                { post.user.fullName }
                            </h3>
                        </a>
                    </Link>
                    <p className="text-gray-500 font-medium text-xs">
                        { moment( post.createdAt ).fromNow( true ) }
                    </p>
                </div>
            </div>
            <div>
                { post.content && (
                    <div className="my-1">
                        { post.content }
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
                            <button onClick={ removePostLike }
                                    className="mr-2 hover:bg-pink-100 rounded-full p-2 duration-300 absolute">
                                <FavoriteIcon/>
                            </button>
                        </Zoom>
                        <Zoom in={ !hasCurrentUserLike }>
                            <button onClick={ savePostLike }
                                    className="mr-2 hover:bg-pink-100 rounded-full p-2 duration-300">
                                <OutlinedFavoriteIcon/>
                            </button>
                        </Zoom>
                        <p>{ likeCount }</p>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <button className="mr-2" onClick={ () => setClickComment( true ) }>
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

                <CommentList postId={ post.id } clickComment={ clickComment }/>

            </div>
        </div>
    )
}

export default PostCard
