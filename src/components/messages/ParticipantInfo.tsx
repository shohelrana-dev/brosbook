import Avatar from "@components/global/Avatar"
import { useGetConversationByIdQuery, useGetConversationMediaListQuery } from "@services/conversationApi"
import Loading from "@components/global/Loading"
import { useGetInfiniteListQuery } from "@hooks/useGetInfiniteListQuery"
import InfiniteScroll from "react-infinite-scroller"
import { Media } from "@interfaces/index.interfaces"
import ImageLightbox from "@components/global/ImageLightbox"
import { useEffect, useRef } from "react"

interface Props {
    conversationId: string
}

function ParticipantInfo( { conversationId }: Props ){
    const { data: conversation, isLoading }                                          = useGetConversationByIdQuery( conversationId )
    const { items: mediaList, isLoading: isMediaLoading, loadMore, hasMore } = useGetInfiniteListQuery<Media>(
        useGetConversationMediaListQuery, { conversationId }
    )
    const containerRef                                                               = useRef<HTMLDivElement>( null )

    useEffect( () => {
        if( containerRef.current && containerRef.current.parentElement ){
            containerRef.current.style.height = `${ containerRef?.current?.parentElement?.offsetHeight }px`
        }
    }, [] )

    const participant = conversation?.participant

    if( isLoading ) return <Loading/>

    if( ! participant ) return null

    return (
        <div className="h-full overflow-y-auto scrollbar-hide" ref={ containerRef }>
            <div className="box p-6 text-center">
                <div className="flex justify-center mb-3">
                    <Avatar
                        online={ !! participant?.active }
                        src={ participant.avatar.url }
                        size="large"
                        alt={ participant.fullName }
                    />
                </div>
                <h5 className="font-medium text-lg text-gray-800">
                    { participant.fullName }
                </h5>
                <p className="text-gray-600">
                    { participant.profile?.bio }
                </p>
            </div>

            <div className="box p-4 mt-3">
                <div className="text-base font-medium">Personal Information</div>
                <div className="mt-4">
                    <div className="border-gray-200 flex items-center border-b pb-3">
                        <div className="">
                            <div className="text-gray-600">Address</div>
                            <div className="mt-0.5">
                                { participant.profile?.location }
                            </div>
                        </div>
                    </div>
                    <div className="border-gray-200 flex items-center border-b py-3">
                        <div className="">
                            <div className="text-gray-600">Phone</div>
                            <div className="mt-0.5">
                                { participant.profile?.phone }
                            </div>
                        </div>
                    </div>
                    <div className="border-gray-200 flex items-center py-3">
                        <div className="">
                            <div className="text-gray-600">Email</div>
                            <div className="mt-0.5">
                                { participant.email }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="box p-4 mt-3">
                <h5 className="text-base font-medium mb-3">Shared Media</h5>
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
            </div>

        </div>
    )
}

export default ParticipantInfo