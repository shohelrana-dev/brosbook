import FeedPosts from './FeedPosts'
import SidebarLayout from '@components/global/SidebarLayout'
import { Metadata } from 'next'
import CreatePostForm from '@components/post/CreatePostForm'
import SlidesSuggestions from '@components/global/SlidesSuggestions'
import { getFeedPosts } from '@services/index'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
	title: `Home | ${process.env.NEXT_PUBLIC_APP_NAME}`,
}

export default async function HomePage() {
	const posts = await getFeedPosts(cookies())
    
	return (
		<SidebarLayout>
			<div className='mt-5 mb-4'>
				<CreatePostForm />

				<SlidesSuggestions />

				<FeedPosts initialPosts={posts} />
			</div>
		</SidebarLayout>
	)
}
