'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { BiInfoCircle as InfoIcon } from 'react-icons/bi'
import { RxCross1 as CrossIcon } from 'react-icons/rx'
import Modal, { useToggle } from 'react-minimal-modal'
import Avatar from '~/components/global/Avatar'
import IconButton from '~/components/global/IconButton'
import Loader from '~/components/global/Loader'
import MessageList from '~/components/messages/MessageBox/MessageList'
import CreateMessageForm from '~/components/messages/MessageBox/form/CreateMessageForm'
import ParticipantInfo from '~/components/messages/ParticipantInfo'
import { useGetConversationByIdQuery } from '~/services/conversationsApi'
import timeAgo from '~/utils/timeAgo'

const classes = {
    wrapper: `h-screen-content overflow-hidden px-2 grid grid-rows-[auto_1fr_auto]`,
    modal: `max-h-[85vh] !bg-light-gray flex flex-col !p-[1px] !rounded-xl`,
    header: `card mt-2 py-3 px-4 lg:px-6 flex flex-wrap justify-between`,
    name: `font-medium text-gray-800`,
    active: `text-gray-500 text-sm`,
}

export default function MessageBox() {
    //hooks
    const { conversationId } = useParams()
    const { data: conversation, isLoading } = useGetConversationByIdQuery(conversationId as string)
    const [isOpen, toggle] = useToggle()

    if (isLoading) return <Loader />

    const { fullName, active, avatar, username, updatedAt } = conversation?.participant || {}

    return (
        <div className={classes.wrapper}>
            <Modal className={classes.modal} open={isOpen} toggle={toggle} hideIcon>
                <IconButton className='absolute top-2 right-2' onClick={toggle}>
                    <CrossIcon size={18} />
                </IconButton>

                <ParticipantInfo />
            </Modal>

            {/*User top bar*/}
            <header className={classes.header}>
                <div className='flex flex-wrap'>
                    <div className='mr-4'>
                        <Avatar src={avatar?.url} online={active} alt={fullName} />
                    </div>
                    <div className='mr-3'>
                        <h3 className={classes.name}>
                            <Link href={`/${username}`}>{fullName}</Link>
                        </h3>
                        <p className={classes.active}>
                            {active ? 'Active now' : 'Active ' + timeAgo(updatedAt!)}
                        </p>
                    </div>
                </div>
                <div className='self-center' onClick={toggle}>
                    <IconButton>
                        <InfoIcon size={25} />
                    </IconButton>
                </div>
            </header>

            {/*Messages*/}
            <MessageList />

            {/*message form*/}
            <CreateMessageForm />
        </div>
    )
}
