import { Metadata } from 'next'
import CreatePostForm from '~/components/post/CreatePostForm'
import SidebarLayout from '~/components/ui/SidebarLayout'
import SlidesSuggestions from '~/components/ui/SlidesSuggestions'
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
