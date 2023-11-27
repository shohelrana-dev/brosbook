"use client"
import React from 'react'
import Link from "next/link"
import Avatar from "@components/global/Avatar"
import MessageList from "@components/messages/MessageBox/MessageList"
import CreateMessageForm from "@components/messages/MessageBox/CreateMessageForm"
import timeAgo from "@utils/timeAgo"
import Loader from "@components/global/Loader"
import { useGetConversationByIdQuery } from "@services/conversationsApi"
import { IconButton } from '@mui/material'
import { BiInfoCircle as InfoIcon } from "react-icons/bi"
import Modal, { useModal } from "react-minimal-modal"
import ParticipantInfo from "@components/messages/ParticipantInfo"
import tw from "twin.macro"
import { Box as BaseBox } from "@components/styles/Global.styles"
import { useParams } from "next/navigation"
import { RxCross1 as CrossIcon } from "react-icons/rx"
import { useSelector } from 'react-redux'
import { selectNavbarHeight } from '@slices/navbarHeightSlice'

const Wrapper     = tw.div`relative overflow-y-auto grid grid-rows-[auto 1fr auto]`
const StyledModal = tw(Modal)`max-h-[85vh] bg-theme-gray overflow-hidden !p-0`
const Header      = tw(BaseBox)`mt-2 py-3 px-4 lg:px-6 flex flex-wrap justify-between`
const Name        = tw.h3`font-medium text-gray-800`
const Active      = tw.p`text-gray-500 text-sm`

export default function MessageBox() {
    //hooks
    const { conversationId }                = useParams()
    const { data: conversation, isLoading } = useGetConversationByIdQuery(conversationId as string)
    const { isVisible, toggle }             = useModal()
    const navbarHeight = useSelector(selectNavbarHeight)

    if ( isLoading ) return <Loader/>

    const { fullName, active, avatar, username, updatedAt } = conversation?.participant || {}
    
    return (
        <Wrapper style={{height: `calc(100dvh - ${navbarHeight})`}}>
            <StyledModal visible={ isVisible } toggle={ toggle } hideIcon>
                <div className="relative">
                    <IconButton
                        sx={ {
                            position: 'absolute',
                            top: '8px',
                            right: '8px'
                        } }
                        onClick={ toggle }
                    >
                        <CrossIcon size={ 18 }/>
                    </IconButton>
                </div>
                <ParticipantInfo/>
            </StyledModal>

            {/*User top bar*/ }
            <Header>
                <div className="flex flex-wrap">
                    <div className="mr-4">
                        <Avatar
                            src={ avatar?.url }
                            online={ active }
                            alt={ fullName }
                        />
                    </div>
                    <div className="mr-3">
                        <Name>
                            <Link href={ `/${ username }` }>
                                { fullName }
                            </Link>
                        </Name>
                        <Active>
                            { active ? 'Active now' : 'Active ' + timeAgo(updatedAt!) }
                        </Active>
                    </div>
                </div>
                <div className="self-center" onClick={ toggle }>
                    <IconButton>
                        <InfoIcon size={ 25 }/>
                    </IconButton>
                </div>
            </Header>

            {/*Messages*/ }
            <MessageList/>

            {/*message form*/ }
            <CreateMessageForm/>
        </Wrapper>
    )
}