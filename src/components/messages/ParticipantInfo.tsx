import Avatar from "@components/global/Avatar"
import { useGetConversationByIdQuery, useGetConversationMediaListQuery } from "@services/conversationsApi"
import Loader from "@components/global/Loader"
import {ErrorResponse} from "@interfaces/index.interfaces"
import ImageLightbox from "@components/global/ImageLightbox"
import React, {useEffect, useRef, useState} from "react"
import tw, { styled } from "twin.macro"
import { Box as BaseBox } from "@components/styles/Global.styles"
import {useParams} from "next/navigation"
import Error from "@components/global/Error"
import useInfiniteScroll from "react-infinite-scroll-hook"

const Wrapper  = tw.div`h-full overflow-y-auto scrollbar-hide`
const Box      = tw( BaseBox )`p-5 mb-3`
const Header   = tw.header`flex flex-col justify-center items-center`
const Name     = tw.h3`font-medium text-lg text-gray-800 mt-3`
const Bio      = tw.p`text-gray-600`
const Label    = tw.p`text-gray-600 mb-0.5`
const Heading  = tw.h3`text-base font-medium mb-3`
const InfoItem = styled.div( ( { last }: { last?: boolean } ) => [
    tw`pb-2 mb-2`,
    ! last && tw`border-b border-gray-200`
] )

export default function ParticipantInfo(  ){
    //hooks
    const {conversationId} = useParams()
    const { data: conversation } = useGetConversationByIdQuery( conversationId )
    const [page, setPage] = useState<number>( 1 )
    const conversationMediaListQuery  = useGetConversationMediaListQuery({conversationId, page} )
    const { isLoading, isSuccess, isError, data: listData } = conversationMediaListQuery || {}
    const containerRef                                                       = useRef<HTMLDivElement>( null )

    const { items: mediaList = [], nextPage }                    = listData || {}
    const error                                              = conversationMediaListQuery.error as ErrorResponse || {}

    useEffect( () => {
        if( containerRef.current && containerRef.current.parentElement ){
            containerRef.current.style.height = `${ containerRef?.current?.parentElement?.offsetHeight }px`
        }
    }, [] )

    const [moreLoadRef] = useInfiniteScroll( {
        loading: isLoading,
        hasNextPage: !! nextPage,
        onLoadMore: () => setPage( nextPage! )
    } )

    const participant = conversation?.participant

    if( ! participant ) return null

    const { fullName, avatar, email, active } = participant
    const { bio, phone, location }            = participant.profile || {}

    //decide listContent
    let listContent = null
    if( isLoading ){
        listContent = <Loader size={ 40 }/>
    } else if( isSuccess && mediaList.length === 0 ){
        listContent = <p className="text-center py-4">No media files.</p>
    } else if( isError ){
        listContent = <Error message={ error.data?.message }/>
    } else if( isSuccess && mediaList.length > 0 ){
        listContent = <ImageLightbox imageList={ mediaList } alt="Chat photo"/>
    }

    return (
        <Wrapper ref={ containerRef }>
            <Box>
                <Header>
                    <Avatar
                        online={ !! active }
                        src={ avatar.url }
                        size="large"
                        alt={ fullName }
                    />
                    <Name>{ fullName }</Name>
                    <Bio>{ bio }</Bio>
                </Header>
            </Box>

            <Box>
                <Heading>Personal Information</Heading>
                <InfoItem>
                    <Label>Address</Label>
                    <div>{ location }</div>
                </InfoItem>
                <InfoItem>
                    <Label>Phone</Label>
                    <div>{ phone }</div>
                </InfoItem>
                <InfoItem last>
                    <Label>Email</Label>
                    <div>{ email }</div>
                </InfoItem>
            </Box>

            <Box>
                <Heading>Shared Media</Heading>

                <div>{ listContent }</div>

                { nextPage ? (
                    <div className="py-4" ref={ moreLoadRef }>
                        <Loader size={ 40 }/>
                    </div>
                ) : null }
            </Box>

        </Wrapper>
    )
}