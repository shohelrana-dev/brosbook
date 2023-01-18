"use client"
import React, { useState } from 'react'
import Link from "next/link"
import ShowMoreText from "react-show-more-text"
import Avatar from "@components/common/Avatar"
import { Post } from "@interfaces/posts.interfaces"
import CommentList from "@components/post/CommentList"
import timeAgo from "@utils/timeAgo"
import ImageLightbox from '@components/common/ImageLightbox'
import PostBar from "@components/post/PostBar"
import MoreOptions from "@components/post/MoreOptions"


interface PostCardProps {
    post: Post
}

const PostCard = ( props: PostCardProps ) => {
    //hooks
    const [post, setPost]                         = useState<Post | null>( props.post )
    const [isCommentsHidden, setIsCommentsHidden] = useState<boolean>( true )

    if( ! post ) return null

    return (
        <div className="box p-6 mt-6">
            <div className="flex">
                <Link href={ `/${ post.author.username }` }>
                    <Avatar src={ post.author.avatar.url }/>
                </Link>
                <div className="ml-4 w-full">
                    <div className="flex justify-between">
                        <Link href={ `/${ post.author.username }` }>
                            <h3 className="text-base font-medium flex flex-wrap mb-3">
                                <p>{ post.author.fullName }</p>
                                <p className="ml-2 text-gray-600 text-xs lg:text-sm font-normal">@{ post.author.username }</p>
                            </h3>
                        </Link>
                        <MoreOptions post={ post } setPost={ setPost }/>
                    </div>

                    <p className="text-gray-500 font-medium text-xs mt-[-8px]">
                        { timeAgo( post.createdAt ) }
                    </p>

                </div>
            </div>
            <div>
                { post.body ? (
                    <div className="mb-1 mt-2">
                        <ShowMoreText
                            lines={ 3 }
                            more={ <span className="text-blue-600">See more</span> }
                            less={ <span className="text-blue-600">See less</span> }
                            expanded={ false }
                            truncatedEndingComponent={ "... " }
                        >
                            { post.body }
                        </ShowMoreText>
                    </div>
                ) : null }
                { post.image ? (
                    <div className="my-3">
                        <ImageLightbox src={ post.image.url } width={ 520 } height={ 340 } alt="Post image"/>
                    </div>
                ) : null }

                <PostBar post={ post } setPost={ setPost } isCommentsHidden={ isCommentsHidden }
                         setIsCommentsHidden={ setIsCommentsHidden }/>

                { ! isCommentsHidden ? <CommentList postId={ post.id }/> : null }

            </div>
        </div>
    )
}

export default PostCard
