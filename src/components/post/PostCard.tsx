'use client'
import Linkify from 'linkify-react'
import Image from 'next/image'
import Link from 'next/link'
import { TbDiscountCheckFilled as BlueBadgeIcon } from 'react-icons/tb'
import ShowMoreText from 'react-show-more-text'
import Avatar from '~/components/global/Avatar'
import Lightbox from '~/components/global/Lightbox'
import PostBar from '~/components/post/PostBar'
import PostOptions from '~/components/post/PostOptions'
import CommentList from '~/components/post/comment/CommentList'
import useCommentsVisibilty from '~/hooks/useCommentsVisibilty'
import { Post } from '~/interfaces/posts.interfaces'
import { nl2br } from '~/utils/nl2br'
import timeAgo from '~/utils/timeAgo'

interface Props {
    post: Post
    initialCommentsVisible?: boolean
}

export default function PostCard({ post, initialCommentsVisible }: Props) {
    const { id, author, body, createdAt, image } = post || {}

    //hooks
    const { isCommentsVisible } = useCommentsVisibilty(id, initialCommentsVisible)

    return (
        <div className='card rounded-lg p-5 mb-4'>
            <div className='flex'>
                <Link href={`/${author.username}`}>
                    <Avatar src={author.avatar.url} />
                </Link>
                <div className='ml-4 w-full'>
                    <div className='flex justify-between'>
                        <Link href={`/${author.username}`}>
                            <div className='text-base font-medium flex mb-3 items-center'>
                                <h3 className='mr-[2px]'>{author.fullName}</h3>

                                <BlueBadgeIcon color='rgb(58,141,245)' size={18} className='mt-[3px]' />

                                <p className='ml-2 text-gray-600 text-xs lg:text-sm font-normal'>
                                    @{author.username}
                                </p>
                            </div>
                        </Link>

                        <PostOptions post={post} />
                    </div>

                    <p className='text-gray-500 font-medium text-xs mt-[-8px]'>{timeAgo(createdAt)}</p>
                </div>
            </div>
            <div>
                {!!body && (
                    <div className='mb-1 mt-2 [&_a]:text-blue-500 [&_a]:underline'>
                        <ShowMoreText
                            lines={5}
                            more={<span className='text-blue-600 cursor-pointer'>See more</span>}
                            less={<span className='text-blue-600 cursor-pointer'>See less</span>}
                            expanded={false}
                            truncatedEndingComponent={'... '}
                            width={1000}
                        >
                            <Linkify>
                                <div dangerouslySetInnerHTML={{ __html: nl2br(body) }} />
                            </Linkify>
                        </ShowMoreText>
                    </div>
                )}

                {image && 'url' in image && (
                    <div className='my-3'>
                        <Lightbox>
                            <a href={image.url}>
                                <Image src={image.url} alt='Post photo' width='550' height='400' />
                            </a>
                        </Lightbox>
                    </div>
                )}

                <PostBar post={post} />

                {isCommentsVisible && <CommentList post={post} />}
            </div>
        </div>
    )
}
