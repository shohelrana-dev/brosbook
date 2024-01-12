import { Badge, IconButton, Tooltip } from '@mui/material'
import Link from 'next/link'
import { IoMailOutline as MessageIcon } from 'react-icons/io5'
import { useGetUnreadConversationsCountQuery } from '~/services/conversationsApi'

export default function MessagesNavLink() {
	const { data: unreadConversationsData } = useGetUnreadConversationsCountQuery()

	const { count: unreadConversationsCount = 0 } = unreadConversationsData || {}

	return (
		<Link href='/messages' className='block'>
			<Tooltip title='Messages'>
				<IconButton>
					<Badge badgeContent={unreadConversationsCount} color='error'>
						<MessageIcon size={25} className='text-gray-700' />
					</Badge>
				</IconButton>
			</Tooltip>
		</Link>
	)
}
