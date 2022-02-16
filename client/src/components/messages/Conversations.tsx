import React, { ChangeEvent, FocusEvent, Fragment, useEffect, useState } from 'react'
import { Fade }                                                          from "@mui/material"
import { useDispatch, useSelector }                                      from "react-redux"

import { fetchConversationsAction } from "@actions/chatActions"
import { RootState }                from "@store/index"
import api                          from "@api/index"
import { User }                     from "@interfaces/user.interfaces"
import ConversationItem             from "@components/messages/Conversations/ConversationItem"
import SearchUserItem               from "@components/messages/Conversations/SearchUserItem"
import ConversationsSkeleton        from "@components/messages/Conversations/Skeletons/ConversationsSkeleton"
import UsersSkeleton                from "@components/messages/Conversations/Skeletons/UsersSkeleton"

function Conversations() {
    //hooks
    const dispatch                                  = useDispatch()
    const { conversations, isLoadingConversations } = useSelector( ( state: RootState ) => state.chat )
    const [ timer, setTimer ]                       = useState( null )
    const [ users, setUsers ]                       = useState<User[]>( [] )
    const [ isSearching, setSearching ]             = useState<boolean>( false )
    const [ isSearchLoading, setSearchLoading ]     = useState<boolean>( true )

    useEffect( () => {
        dispatch( fetchConversationsAction() )
    }, [ dispatch ] )

    function SearchUserHandle( event: ChangeEvent<HTMLInputElement> ) {
        setSearchLoading( true )
        clearTimeout( timer! )
        const timeout: any = setTimeout( async () => {
            try {
                const { data } = await api.users.searchUser( event.target.value )
                setUsers( data.users )
            } catch ( err ) {
                console.error( err )
            } finally {
                setSearchLoading( false )
            }
        }, 500 )

        setTimer( timeout )
    }

    function inputOnBlurHandle( event: FocusEvent<HTMLInputElement> ) {
        setSearching( false )
        event.target.value = ''
    }

    return (
        <Fragment>
            <h2 className="text-2xl font-medium mb-2">Chats</h2>

            {/*Search user*/ }
            <div className="mb-3">
                <input
                    onBlur={ inputOnBlurHandle }
                    onFocus={ () => setSearching( true ) }
                    onChange={ SearchUserHandle }
                    className="input-basic"
                    placeholder="Search user for messages"
                />
                <Fade in={ isSearching }>
                    <div className="relative">
                        <div
                            className="box max-w-5xl p-3 absolute top-full left-0 w-full mt-3 bg-gray-200 drop-shadow-2xl">
                            { isSearchLoading && <UsersSkeleton/> }

                            { !isSearchLoading && users && users.map( user => (
                                <SearchUserItem user={ user } key={ user.id }/>
                            ) ) }

                            { !isSearchLoading && users.length < 1 && (
                                < h2 className="text-xl text-gray-700">No result found</h2>
                            ) }
                        </div>
                    </div>
                </Fade>
            </div>

            {/*Conversations*/ }
            { !isSearching && (
                <div>
                    <h2 className="text-lg font-medium mb-3">Recent chats</h2>
                    { isLoadingConversations && <ConversationsSkeleton/> }

                    { conversations && conversations.map( cv => (
                        <ConversationItem conversation={ cv } key={ cv.id }/>
                    ) ) }

                    { !isLoadingConversations && conversations.length < 1 && (
                        <p className="text-gray-700">You have no conversation</p>
                    ) }
                </div>
            ) }
        </Fragment>
    )
}

export default Conversations