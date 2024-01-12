import { Metadata } from 'next'
import { cookies } from 'next/headers'
import SidebarLayout from '~/components/global/SidebarLayout'
import SlidesSuggestions from '~/components/global/SlidesSuggestions'
import CreatePostForm from '~/components/post/CreatePostForm'
import { getFeedPosts } from '~/services/index'
import FeedPosts from './FeedPosts'

export const metadata: Metadata = {
	title: 'Home',
}

export default async function HomePage() {
	const postsData = await getFeedPosts(cookies())

	return (
		<SidebarLayout>
			<div className='pt-5 pb-4 h-screen-content overflow-y-auto scrollbar-hide'>
				<CreatePostForm />

				<SlidesSuggestions />

				<FeedPosts initialPostsData={postsData} />
			</div>
		</SidebarLayout>
	)
}
