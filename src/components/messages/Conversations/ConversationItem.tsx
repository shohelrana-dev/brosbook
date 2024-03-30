import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { IoCheckmarkCircleOutline as TickIcon } from 'react-icons/io5'
import TextOverflow from 'react-text-overflow'
import Avatar from '~/components/global/Avatar'
import useSession from '~/hooks/useSession'
import { Conversation } from '~/interfaces/conversation.interfaces'
import timeAgo from '~/lib/timeAgo'
import { cn } from '~/lib/utils'

const classes = {
    card: ({ isActiveConversation }: { isActiveConversation: boolean }) =>
        cn(
            `card block cursor-pointer py-2 px-3 flex mb-2 w-full gap-3`,
            isActiveConversation && `bg-primary [&_*]:text-white`
        ),
    name: `font-medium text-gray-900`,
    nameWrapper: `flex items-center gap-3`,
    date: `text-gray-800 text-xs`,
    messageWrapper: `flex justify-between mt-1`,
    messageText: (isBold: boolean) => cn('text-sm text-gray-700', isBold && 'font-bold text-gray-900'),
    image: `rounded-full h-[15px] w-[15px]`,
}

interface Props {
    conversation: Conversation
}

export default function ConversationItem({ conversation }: Props) {
    const { user: currentUser } = useSession()
    const { conversationId } = useParams<{ conversationId: string }>()

    const { lastMessage, unreadMessagesCount, participant } = conversation || {}
    const { fullName, active, avatar } = participant || {}
    const isLastMessageSenderMe = lastMessage && lastMessage.sender.id === currentUser?.id
    const isActiveConversation = conversationId === conversation.id
    let messageBody

    if (lastMessage?.body) {
        messageBody = lastMessage.body
    } else if (lastMessage?.image) {
        messageBody = 'Sent photo'
    }
    if (messageBody) {
        messageBody = isLastMessageSenderMe ? `You: ${messageBody}` : messageBody
    }

    return (
        <Link href={`/messages/${conversation.id}`} className={classes.card({ isActiveConversation })}>
            <Avatar online={active} alt={fullName} src={avatar?.url} />
            <div className='w-full'>
                <div className={classes.nameWrapper}>
                    <h3 className={classes.name}>{fullName}</h3>
                    <p className={classes.date}>{timeAgo(lastMessage?.createdAt!)}</p>
                </div>
                <div className={classes.messageWrapper}>
                    <p className={classes.messageText(!isLastMessageSenderMe && !lastMessage?.seenAt)}>
                        {messageBody ? <TextOverflow text={messageBody} /> : null}
                    </p>
                    {isLastMessageSenderMe ? (
                        lastMessage?.seenAt ? (
                            <Image
                                src={avatar.url}
                                alt={fullName}
                                width={15}
                                height={15}
                                className={classes.image}
                            />
                        ) : (
                            <TickIcon size={17} />
                        )
                    ) : unreadMessagesCount ? (
                        <p className='bg-primary text-white rounded-full w-[18px] h-[18px] flex flex-wrap justify-center items-center text-xs font-bold'>
                            {unreadMessagesCount}
                        </p>
                    ) : null}
                </div>
            </div>
        </Link>
    )
}
