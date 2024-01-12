import InfiniteScroll from 'react-infinite-scroll-component'
import PostCard from '~/components/post/PostCard'
import PostsSkeleton from '~/components/skeletons/PostsSkeleton'
import { Post } from '~/interfaces/posts.interfaces'

interface Props {
	posts: Post[]
	loadMore: () => void
	hasMore: boolean
}

export default function PostList({ posts, loadMore, hasMore }: Props) {
	return (
		<InfiniteScroll
			dataLength={posts.length}
			next={loadMore}
			hasMore={hasMore}
			loader={<PostsSkeleton />}
			className='scrollbar-hide'
		>
			{posts.map((post: Post) => (
				<PostCard post={post} key={post.id} />
			))}
		</InfiniteScroll>
	)
}
