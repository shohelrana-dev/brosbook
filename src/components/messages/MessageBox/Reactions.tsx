import classNames from "classnames"
import Image from "next/image"
import { HiOutlineEmojiHappy as EmojiIcon } from "react-icons/hi"
import { Popover } from "@mui/material"
import { IconButton } from '@mui/material'
import { useSendReactionMutation } from "@services/messagesApi"
import { Message } from "@interfaces/conversation.interfaces"
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state"

function Reactions( { message }: { message: Message } ) {
    //hooks
    const [ sendReaction ]         = useSendReactionMutation()

    //default message reactions
    const defaultReactions = [ 'love', 'smile', 'wow', 'sad', 'angry', 'like' ]

    async function handleSubmitReaction( name: string ) {
        sendReaction({ name, conversationId: message.conversation?.id!, messageId: message.id })
    }

    return (
        <>
            <PopupState variant="popover">
                { ( popupState ) => (
                    <div>
                        <div className={ classNames('absolute top-[50%] translate-y-[-50%]', {
                            "-right-9": !message.isMeSender,
                            "-left-9": message.isMeSender,
                        }) }>
                            <IconButton { ...bindTrigger(popupState) }>
                                <EmojiIcon className="text-gray-400" fontSize={ 20 }/>
                            </IconButton>
                        </div>
                        <Popover
                            classes={ {
                                paper: '!rounded-full pb-[3px] pt-[5px] px-2'
                            } }
                            style={ {
                                borderRadius: '25px'
                            } }
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            { ...bindPopover(popupState) }
                        >
                            <div>
                                { defaultReactions.map(reaction => (
                                    <button onClick={ () => {
                                        handleSubmitReaction(reaction)
                                        popupState.setOpen(false)
                                    } } key={ reaction }>
                                        <img
                                            className="w-7"
                                            src={ `${ process.env.NEXT_PUBLIC_SERVER_BASE_URL! }/reactions/${ reaction }.png` }
                                            alt="reaction"
                                        />
                                    </button>
                                )) }
                            </div>
                        </Popover>
                    </div>
                ) }
            </PopupState>


            { message.reactions?.length > 0 ? (
                <div
                    className={ classNames('absolute w-max bottom-[-16px] flex gap-x-1 justify-center p-[2px] bg-white rounded-full px-1', {
                        "left-2": message.isMeSender,
                        "right-2": !message.isMeSender
                    }) }>
                    { message.reactions.map(reaction => (
                        <Image width={ 18 } height={ 18 } src={ reaction.url } alt="Reaction" key={ reaction.id }
                               className=""/>
                    )) }
                </div>
            ) : null }
        </>
    )
}

export default Reactions