import React, { Fragment } from 'react'
import classNames from "classnames"
import Image from "next/image"
import { HiOutlineEmojiHappy as EmojiIcon } from "react-icons/hi"
import { Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react"
import IconButton from "@components/common/IconButton"
import { useSendReactionMutation } from "@services/conversationApi"
import { Message } from "@interfaces/conversation.interfaces"

type ReactionsProps = {
    message: Message,
}

function Reactions( { message }: ReactionsProps ){
    //hooks
    const [sendReaction] = useSendReactionMutation()

    //default message reactions
    const defaultReactions = ['love', 'smile', 'wow', 'sad', 'angry', 'like']

    async function handleSubmitReaction( name: string ){
        try {
            await sendReaction( { name, conversationId: message.conversationId, messageId: message.id } ).unwrap()
        } catch ( err ) {
            console.log( err )
        }
    }

    return (
        <Fragment>
            <Popover>
                <PopoverHandler>
                    <div className={ classNames( 'absolute top-[50%] translate-y-[-50%]', {
                        "-right-9": ! message.isMeSender,
                        "-left-9": message.isMeSender,
                    } ) }>
                        <IconButton type="button">
                            <EmojiIcon className="text-gray-400" fontSize={ 20 }/>
                        </IconButton>
                    </div>
                </PopoverHandler>
                <PopoverContent className="p-0 rounded-full z-20">
                    <div className="py-1 px-3">
                        { defaultReactions.map( reaction => (
                            <button className="m-1" onClick={ () => handleSubmitReaction( reaction ) } key={ reaction }>
                                <img
                                    className="w-7"
                                    src={ `${ process.env.NEXT_PUBLIC_API_URL! }/reactions/${ reaction }.png` }
                                    alt="reaction"
                                />
                            </button>
                        ) ) }
                    </div>
                </PopoverContent>
            </Popover>

            { message.reactions?.length > 0 ? (
                <div
                    className={ classNames( 'absolute w-max bottom-[-16px] flex justify-center p-[2px] bg-white rounded-full px-1', {
                        "left-2": message.isMeSender,
                        "right-2": ! message.isMeSender
                    } ) }>
                    { message.reactions.map( reaction => (
                        <Image width={ 18 } height={ 18 } src={ reaction.url } alt="Reaction" key={ reaction.id }
                               className=""/>
                    ) ) }
                </div>
            ) : null }
        </Fragment>
    )
}

export default Reactions