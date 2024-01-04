import { IconButton, Badge, Popover, Tooltip } from '@mui/material'
import { IoNotificationsOutline as NotificationIcon } from "react-icons/io5"
import NotificationList from "@components/notifications/NotificationList"
import { useGetUnreadNotificationsCountQuery } from "@services/notificationsApi"
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state"

export default function NotificationsNavLink() {
    const { data: unreadNotificationsData } = useGetUnreadNotificationsCountQuery()

    const { count: unreadNotificationsCount = 0 } = unreadNotificationsData || {}

    return (
        <PopupState variant="popover">
            { ( popupState ) => (
                <>
                    <div>
                        <Tooltip title="Notifications">
                            <IconButton { ...bindTrigger(popupState) }>
                                <Badge badgeContent={ unreadNotificationsCount } color="error">
                                    <NotificationIcon size={ 25 } className="text-gray-700"/>
                                </Badge>
                            </IconButton>
                        </Tooltip>
                    </div>
                    <Popover
                        { ...bindPopover(popupState) }
                        anchorOrigin={ {
                            vertical: 'bottom',
                            horizontal: 'center',
                        } }
                        transformOrigin={ {
                            vertical: 'top',
                            horizontal: 'center',
                        } }
                    >
                        <NotificationList/>
                    </Popover>
                </>
            ) }
        </PopupState>
    )
}