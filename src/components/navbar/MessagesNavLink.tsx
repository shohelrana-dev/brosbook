import IconButton from "@components/global/IconButton"
import { IoMailOutline as MessageIcon } from "react-icons/io5"
import Link from "next/link"
import { useGetUnreadConversationsCountQuery } from "@services/conversationsApi"

export default function MessagesNavLink(){
    const { data: unreadConversationsData } = useGetUnreadConversationsCountQuery()

    const { count: unreadConversationsCount = 0 } = unreadConversationsData || {}

    return (
        <Link href="/messages" className="block">
            <IconButton className="p-5">
                { unreadConversationsCount ? (
                    <div
                        className="absolute top-[-5px] right-[-5px] bg-red-500 text-white rounded-full font-bold p-[2px] h-[18px] w-[18px]">
                        { unreadConversationsCount }
                    </div>
                ) : null }
                <MessageIcon size={ 25 } className="text-gray-700"/>
            </IconButton>
        </Link>
    )
}