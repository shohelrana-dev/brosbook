import { Metadata } from 'next'
import SidebarLayout from '~/components/global/SidebarLayout'
import SlidesSuggestions from '~/components/global/SlidesSuggestions'
import CreatePostForm from '~/components/post/CreatePostForm'
import { getFeedPosts } from '~/services'
import FeedPosts from './FeedPosts'

export const metadata: Metadata = {
    title: 'Home',
}

export default async function HomePage() {
    const postsData = await getFeedPosts()

    return (
        <SidebarLayout>
            <div className='mx-2 pb-4 pt-5 lg:mx-0'>
                <CreatePostForm />

                <SlidesSuggestions />

                <FeedPosts initialPostsData={postsData} />
            </div>
        </SidebarLayout>
    )
}
