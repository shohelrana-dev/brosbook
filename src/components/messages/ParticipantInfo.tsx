import Avatar from "@components/global/Avatar"
import { useGetConversationByIdQuery, useGetConversationMediaListQuery } from "@services/conversationApi"
import Loading from "@components/global/Loading"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import InfiniteScroll from "react-infinite-scroller"
import { Media } from "@interfaces/index.interfaces"
import ImageLightbox from "@components/global/ImageLightbox"
import { useEffect, useRef } from "react"
import tw, { styled } from "twin.macro"
import { Box as BaseBox } from "@components/styles/Global.styles"

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
] );

interface Props {
    conversationId: string
}

function ParticipantInfo( { conversationId }: Props ){
    const { data: conversation, isLoading }                                  = useGetConversationByIdQuery( conversationId )
    const { items: mediaList, isLoading: isMediaLoading, loadMore, hasMore } = useGetInfiniteListQuery<Media>(
        useGetConversationMediaListQuery, { conversationId }
    )
    const containerRef                                                       = useRef<HTMLDivElement>( null )

    useEffect( () => {
        if( containerRef.current && containerRef.current.parentElement ){
            containerRef.current.style.height = `${ containerRef?.current?.parentElement?.offsetHeight }px`
        }
    }, [] )

    const participant = conversation?.participant

    if( isLoading ) return <Loading/>

    if( ! participant ) return null

    const { fullName, avatar, email, active } = participant
    const { bio, phone, location }            = participant.profile || {}

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
                { ( ! mediaList && isMediaLoading ) ? <Loading size={ 40 }/> : null }
                <div>
                    <InfiniteScroll
                        loadMore={ loadMore }
                        hasMore={ hasMore }
                        loader={ <Loading size={ 40 }/> }
                    >
                        <ImageLightbox imageList={ mediaList } alt="Chat photo"/>
                    </InfiniteScroll>
                    { ( ! isLoading && mediaList?.length < 1 ) ? (
                        <p className="text-center py-6">No media files.</p>
                    ) : null }
                </div>
            </Box>

        </Wrapper>
    )
}

export default ParticipantInfo