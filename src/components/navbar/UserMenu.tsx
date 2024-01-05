import Avatar from "@components/global/Avatar"
import Link from "next/link"
import { RiUserSettingsFill as SettingIcon } from "react-icons/ri"
import { FaSignOutAlt as LogoutIcon } from "react-icons/fa"
import useAuthState from "@hooks/useAuthState"
import { useRouter } from "next/navigation"
import { useConfirmAlert } from "react-use-confirm-alert"
import { Popover, Divider, Tooltip } from "@mui/material"
import OptionButton from "@components/global/OptionButton"
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state"

export default function UserMenu() {
    const { user }     = useAuthState()
    const router       = useRouter()
    const confirmAlert = useConfirmAlert()

    async function handleLogout() {
        const confirmed = await confirmAlert({
            title: `Log out of ${ process.env.NEXT_PUBLIC_APP_NAME }?`,
            message: 'You can always log back in at any time. And you can switch another account.',
            confirmButtonLabel: 'Log out'
        })

        if ( confirmed ) {
            router.push('/auth/logout')
        }
    }

    return (
        <PopupState variant="popover">
            { ( popupState ) => (
                <>
                    <Tooltip title="Profile">
                        <div className="rounded-full ml-2 cursor-pointer"  { ...bindTrigger(popupState) }>
                            <Avatar src={ user?.avatar?.url } size="small" className="border-solid border-2 border-primary"/>
                        </div>
                    </Tooltip>
                    <Popover
                        { ...bindPopover(popupState) }
                        anchorOrigin={ {
                            vertical: 'bottom',
                            horizontal: 'center',
                        } }
                        transformOrigin={ {
                            vertical: 'top',
                            horizontal: 'right',
                        } }
                    >
                        <div className="mb-2">
                            <Link href={ `/${ user?.username }` } onClick={ () => popupState.setOpen(false) }>
                                <OptionButton>
                                    <div className="py-1 flex flex-wrap gap-[12px] items-center">
                                        <Avatar src={ user?.avatar?.url } size="medium"/>
                                        <div>
                                            <p>{ user?.fullName }</p>
                                            <p className="text-xs text-left text-gray-800">Your profile</p>
                                        </div>
                                    </div>
                                </OptionButton>
                            </Link>
                        </div>

                        <Divider className="mb-1"/>

                        <Link href="/account" onClick={ () => popupState.setOpen(false) }>
                            <OptionButton>
                                <SettingIcon className="inline-block mr-2" size={ 20 }/>
                                Settings
                            </OptionButton>
                        </Link>
                        <OptionButton onClick={ () => {
                            handleLogout()
                            popupState.setOpen(false)
                        } }>
                            <LogoutIcon className="inline-block mr-2" size={ 20 }/>
                            Logout
                        </OptionButton>
                    </Popover>
                </>
            ) }
        </PopupState>
    )
}