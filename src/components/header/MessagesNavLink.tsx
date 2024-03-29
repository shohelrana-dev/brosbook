import Link from 'next/link'
import { IoMailOutline as MessageIcon } from 'react-icons/io5'
import IconButton from '~/components/global/IconButton'
import Tooltip from '~/components/global/Tooltip'
import { Badge } from '~/lib/nextui'
import { useGetUnreadConversationsCountQuery } from '~/services/conversationsApi'

export default function MessagesNavLink() {
    const { data: { count } = {} } = useGetUnreadConversationsCountQuery()

    return (
        <Tooltip content='Messages'>
            <Badge content={count} color='danger' isInvisible={!count} className='top-2 right-2'>
                <IconButton as={Link} href='/messages' size='lg'>
                    <MessageIcon size={25} />
                </IconButton>
            </Badge>
        </Tooltip>
    )
}
