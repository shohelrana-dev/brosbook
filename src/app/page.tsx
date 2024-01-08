import FeedPosts from './FeedPosts'
import SidebarLayout from '@/components/global/SidebarLayout'
import { Metadata } from 'next'
import CreatePostForm from '@/components/post/CreatePostForm'
import SlidesSuggestions from '@/components/global/SlidesSuggestions'
import { getFeedPosts } from '@/services/index'
import { cookies } from 'next/headers'
import siteMetadata from '@/utils/siteMetadata'

export const metadata: Metadata = {
	title: `Home | ${siteMetadata.appName}`,
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
