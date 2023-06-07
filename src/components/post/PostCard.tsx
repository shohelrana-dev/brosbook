"use client"
import React, { useState } from 'react'
import Link from "next/link"
import ShowMoreText from "react-show-more-text"
import Avatar from "@components/global/Avatar"
import { Post } from "@interfaces/posts.interfaces"
import CommentList from "@components/post/comment/CommentList"
import timeAgo from "@utils/timeAgo"
import ImageLightbox from '@components/global/ImageLightbox'
import PostBar from "@components/post/PostBar"
import PostOptions from "@components/post/PostOptions"
import nl2br from 'react-nl2br'
import { TbDiscountCheckFilled as BlueBadgeIcon } from 'react-icons/tb'
import Linkify from "linkify-react"
import tw from "twin.macro"


const Body = tw.div`mb-1 mt-2 [a]:(text-blue-500 underline)`

interface PostCardProps {
    post: Post
    isCommentsShow?: boolean
}

export default function PostCard ( props: PostCardProps ) {
    //hooks
    const [ isCommentsShow, setIsCommentsShow ] = useState<boolean>(Boolean(props.isCommentsShow))

    const { post }                           = props
    const { author, body, createdAt, image } = post || {}

    return (
        <div className="box p-5 mb-4">
            <div className="flex">
                <Link href={ `/${ author.username }` }>
                    <Avatar src={ author.avatar.url }/>
                </Link>
                <div className="ml-4 w-full">
                    <div className="flex justify-between">
                        <Link href={ `/${ author.username }` }>
                            <div className="text-base font-medium flex mb-3 items-center">
                                <h3 className="mr-[2px]">{ author.fullName }</h3>
                                <BlueBadgeIcon color="rgb(58,141,245)" size={ 18 } className="mt-[3px]"/>
                                <p className="ml-2 text-gray-600 text-xs lg:text-sm font-normal">@{ author.username }</p>
                            </div>
                        </Link>
                        <PostOptions post={ post }/>
                    </div>

                    <p className="text-gray-500 font-medium text-xs mt-[-8px]">
                        { timeAgo(createdAt) }
                    </p>

                </div>
            </div>
            <div>
                { body ? (
                    <Body>
                        <ShowMoreText
                            lines={ 5 }
                            more={ <span className="text-blue-600">See more</span> }
                            less={ <span className="text-blue-600">See less</span> }
                            expanded={ false }
                            truncatedEndingComponent={ "... " }
                        >
                            <Linkify>
                                { nl2br(body) }
                            </Linkify>
                        </ShowMoreText>
                    </Body>
                ) : null }
                { image ? (
                    <div className="my-3">
                        <ImageLightbox
                            image={ image }
                            alt="Post image"
                            width="550"
                            height="400"
                        />
                    </div>
                ) : null }

                <PostBar post={ post } isCommentsShow={ isCommentsShow } setIsCommentsShow={ setIsCommentsShow }/>

                { isCommentsShow && <CommentList post={ post }/> }

            </div>
        </div>
    )
}
