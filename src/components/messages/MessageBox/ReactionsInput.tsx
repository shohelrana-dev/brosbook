import Image from 'next/image'
import { useState } from 'react'
import { HiOutlineEmojiHappy as EmojiIcon } from 'react-icons/hi'
import IconButton from '~/components/ui/IconButton'
import { Message } from '~/interfaces/conversation.interfaces'
import { Popover, PopoverContent, PopoverTrigger } from '~/lib/nextui'
import { useSendReactionMutation } from '~/services/messagesApi'

type Props = { message: Message }

export default function ReactionsInput({ message }: Props) {
    const { id, conversation } = message
    //hooks
    const [sendReaction] = useSendReactionMutation()
    const [isOpen, setIsOpen] = useState(false)

    //default message reactions
    const defaultReactions = ['love', 'smile', 'wow', 'sad', 'angry', 'like']

    async function handleSubmitReaction(name: string) {
        sendReaction({ name, conversationId: conversation?.id!, messageId: id })
    }

    return (
        <Popover isOpen={isOpen} onOpenChange={setIsOpen} placement='bottom'>
            <PopoverTrigger>
                <IconButton className='mt-1'>
                    <EmojiIcon className='text-gray-400' fontSize={20} />
                </IconButton>
            </PopoverTrigger>

            <PopoverContent className='rounded-full pb-1 pt-2'>
                <div>
                    {defaultReactions.map((reaction) => (
                        <button
                            onClick={() => {
                                handleSubmitReaction(reaction)
                                setIsOpen(false)
                            }}
                            key={reaction}
                            className='mr-1'
                        >
                            <Image
                                className='w-7'
                                width={28}
                                height={28}
                                src={`${process.env
                                    .NEXT_PUBLIC_SERVER_BASE_URL!}/reactions/${reaction}.png`}
                                alt='Reaction'
                            />
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}
