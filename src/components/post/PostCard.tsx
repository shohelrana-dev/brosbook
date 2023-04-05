"use client"
import React, { useState } from 'react'
import Link from "next/link"
import ShowMoreText from "react-show-more-text"
import Avatar from "@components/global/Avatar"
import { Post } from "@interfaces/posts.interfaces"
import CommentList from "@components/post/CommentList"
import timeAgo from "@utils/timeAgo"
import ImageLightbox from '@components/global/ImageLightbox'
import PostBar from "@components/post/PostBar"
import PostOptions from "@components/post/PostOptions"
import nl2br from 'react-nl2br'


interface PostCardProps {
    post: Post
    isCommentsShow?: boolean
}

const PostCard = ( props: PostCardProps ) => {
    //hooks
    const [isCommentsShow, setIsCommentsShow] = useState<boolean>( Boolean( props.isCommentsShow ) )

    const { post }                               = props
    const { id, author, body, createdAt, image } = post || {}

    return (
        <div className="box p-6 mb-4">
            <div className="flex">
                <Link href={ `/${ author.username }` }>
                    <Avatar src={ author.avatar.url }/>
                </Link>
                <div className="ml-4 w-full">
                    <div className="flex justify-between">
                        <Link href={ `/${ author.username }` }>
                            <h3 className="text-base font-medium flex flex-wrap mb-3 items-center">
                                <p>{ author.fullName }</p>
                                <p className="ml-2 text-gray-600 text-xs lg:text-sm font-normal">@{ author.username }</p>
                            </h3>
                        </Link>
                        <PostOptions post={ post }/>
                    </div>

                    <p className="text-gray-500 font-medium text-xs mt-[-8px]">
                        { timeAgo( createdAt ) }
                    </p>

                </div>
            </div>
            <div>
                { body ? (
                    <div className="mb-1 mt-2">
                        <ShowMoreText
                            lines={ 5 }
                            more={ <span className="text-blue-600">See more</span> }
                            less={ <span className="text-blue-600">See less</span> }
                            expanded={ false }
                            truncatedEndingComponent={ "... " }
                        >
                            { nl2br( body ) }
                        </ShowMoreText>
                    </div>
                ) : null }
                { image ? (
                    <div className="my-3">
                        <ImageLightbox image={ image } width={ 550 } height={ 340 } alt="Post image"/>
                    </div>
                ) : null }

                <PostBar post={ post } isCommentsShow={ isCommentsShow } setIsCommentsShow={ setIsCommentsShow }/>

                { isCommentsShow ? <CommentList postId={ id }/> : null }

            </div>
        </div>
    )
}

export default PostCard
