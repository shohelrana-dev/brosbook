'use client'
import { IconButton, Tooltip } from '@mui/material'
import { BsThreeDots as ThreeDotsIcon } from 'react-icons/bs'
import toast from 'react-hot-toast'
import { RiLink as LinkIcon } from 'react-icons/ri'
import { User } from '@/interfaces/user.interfaces'
import OptionButton from '@/components/global/OptionButton'
import { Popover } from '@mui/material'
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state'

export default function ExtraOptions({ user }: { user: User }) {
    function copyProfileLinkToClipboard() {
        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/${user.username}`).then(() => {
            toast.success('Profile link copied.')
        })
    }

    return (
        <PopupState variant='popover'>
            {popupState => (
                <>
                    <Tooltip title='Options'>
                        <IconButton {...bindTrigger(popupState)}>
                            <ThreeDotsIcon size='18' />
                        </IconButton>
                    </Tooltip>
                    <Popover
                        {...bindPopover(popupState)}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <div>
                            <OptionButton
                                className='z-50'
                                onClick={() => {
                                    copyProfileLinkToClipboard()
                                    popupState.setOpen(false)
                                }}
                            >
                                <LinkIcon
                                    size='18'
                                    className='mr-2'
                                />
                                Copy link to profile
                            </OptionButton>
                        </div>
                    </Popover>
                </>
            )}
        </PopupState>
    )
}
