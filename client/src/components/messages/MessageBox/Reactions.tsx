import React, { Fragment, useState } from 'react'
import { Popover }                   from "@mui/material"
import InsertEmoticonIcon            from "@mui/icons-material/InsertEmoticon"
import classNames                    from "classnames"
import { useSelector }               from "react-redux"
import { useRouter }                 from "next/router"
import Image                         from "next/image"

import { RootState } from "@store/store"
import { Reaction }  from "@interfaces/chat.interfaces"
import { socket }   from "@components/common/AuthCheck"

type ReactionsProps = {
    isOwnMessage: boolean,
    messageId: number,
    reactions: Reaction[]
}

function Reactions( { isOwnMessage, messageId, reactions }: ReactionsProps ) {
    //hooks
    const [ anchorEl, setAnchorEl ] = useState<HTMLButtonElement | null>()
    const user                      = useSelector( ( state: RootState ) => state.auth.user )
    const currentConversation       = useSelector( ( state: RootState ) => state.chat.currentConversation )

    //default message reactions
    const defaultReactions = [ 'love', 'smile', 'wow', 'sad', 'angry', 'like' ]

    function handleSubmitReaction( name: string ) {
        //send_reaction event fire
        socket.emit( 'send_reaction', {
            senderId: user.id,
            participantId: currentConversation.participantId,
            name,
            messageId
        } )
    }

    const handlePopoverClose = () => {
        setAnchorEl( null )
    }

    const isOpen = Boolean( anchorEl )

    const anchorClassName = classNames( 'absolute top-[50%] translate-y-[-50%]', {
        "-right-8": !isOwnMessage,
        "-left-8": isOwnMessage,
    } )

    return (
        <Fragment>
            <button
                className={ anchorClassName }
                onClick={ ( e ) => setAnchorEl( e.currentTarget ) }
            >
                <InsertEmoticonIcon className="text-gray-400" fontSize="small"/>
            </button>

            <Popover
                open={ isOpen }
                anchorEl={ anchorEl }
                onClose={ handlePopoverClose }
                classes={ { paper: '!rounded-full' } }
                anchorOrigin={ {
                    vertical: 'top',
                    horizontal: isOwnMessage ? 'right' : 'left',
                } }
                transformOrigin={ {
                    vertical: 'bottom',
                    horizontal: isOwnMessage ? 'right' : 'left'
                } }
                onClick={ () => setAnchorEl( null ) }
            >
                <div className="py-1 px-3">
                    { defaultReactions.map( reaction => (
                        <button className="m-1" onClick={ () => handleSubmitReaction( reaction ) } key={ reaction }>
                            <img
                                className="w-7"
                                src={ `${ process.env.NEXT_PUBLIC_SERVER_BASE_URL! }/reactions/${ reaction }.png` }
                                alt="reaction"
                            />
                        </button>
                    ) ) }
                </div>
            </Popover>

            { reactions.length > 0 && (
                <div
                    className={ classNames( 'absolute -bottom-4 flex justify-center py-1 bg-white rounded-full px-1 z-10', {
                        "left-2": isOwnMessage,
                        "right-2": !isOwnMessage
                    } ) }>
                    { reactions.map( reaction => (
                            <Image width={ 18 } height={ 18 } src={ reaction.url } alt="Reaction"
                               key={ reaction.id }/>
                    ) ) }
                </div>
            ) }
        </Fragment>
    )
}

export default Reactions