import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react"
import IconButton from "@components/global/IconButton"
import { IoNotificationsOutline as NotificationIcon } from "react-icons/io5"
import NotificationList from "@components/notifications/NotificationList"
import { useGetUnreadNotificationsCountQuery } from "@services/notificationsApi"
import { useModal } from "react-minimal-modal"

export default function NotificationsNavLink(){
    const { data: unreadNotificationsData } = useGetUnreadNotificationsCountQuery()
    const { isVisible, toggle }             = useModal()

    const { count: unreadNotificationsCount = 0 } = unreadNotificationsData || {}

    return (
        <Popover open={ isVisible }>
            <PopoverHandler>
                <div>
                    <IconButton className="p-5 block relative" onClick={ toggle }>
                        { unreadNotificationsCount ? (
                            <div
                                className="absolute top-[-5px] right-0 bg-red-500 text-white rounded-full font-bold p-[2px] h-[18px] w-[18px]">
                                { unreadNotificationsCount }
                            </div>
                        ) : null }
                        <NotificationIcon size={ 25 } className="text-gray-700"/>
                    </IconButton>
                </div>
            </PopoverHandler>
            <PopoverContent className="w-full font-[inherit] max-w-[350px] z-50 p-2"
                            onBlur={ () => setTimeout( toggle, 200 ) }>
                <div className="max-h-[500px] overflow-y-auto">
                    <NotificationList/>
                </div>
            </PopoverContent>
        </Popover>
    )
}