import { Metadata } from 'next'
import { cookies } from 'next/headers'
import CreatePostForm from '~/components/post/CreatePostForm'
import SidebarLayout from '~/components/ui/SidebarLayout'
import SlidesSuggestions from '~/components/ui/SlidesSuggestions'
import { getFeedPosts } from '~/services/index'
import FeedPosts from './FeedPosts'

export const metadata: Metadata = {
   title: 'Home',
}

export default async function HomePage() {
   const postsData = await getFeedPosts(cookies())

   return (
      <SidebarLayout>
         <div className='mx-2 lg:mx-0 pt-5 pb-4'>
            <CreatePostForm />

            <SlidesSuggestions />

            <FeedPosts initialPostsData={postsData} />
         </div>
      </SidebarLayout>
   )
}
