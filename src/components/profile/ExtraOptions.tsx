'use client'
import { BsThreeDots as ThreeDotsIcon } from 'react-icons/bs'
import { RiLink as LinkIcon } from 'react-icons/ri'
import { toast } from 'sonner'
import IconButton from '~/components/global/IconButton'
import Tooltip from '~/components/global/Tooltip'
import siteMetadata from '~/config/siteMetadata'
import { User } from '~/interfaces/user.interfaces'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '~/lib/nextui'

export default function ExtraOptions({ user }: { user: User }) {
    function handleCopyLink() {
        navigator.clipboard.writeText(`${siteMetadata.siteUrl}/${user.username}`).then(() => {
            toast.success('Profile link copied.')
        })
    }

    return (
        <Dropdown placement='bottom'>
            <Tooltip content='Options'>
                <DropdownTrigger>
                    <IconButton>
                        <ThreeDotsIcon size='18' />
                    </IconButton>
                </DropdownTrigger>
            </Tooltip>

            <DropdownMenu variant='faded' aria-label='Profile Options'>
                <DropdownItem
                    onClick={handleCopyLink}
                    startContent={<LinkIcon size='18' />}
                    title='Copy link to profile'
                />
            </DropdownMenu>
        </Dropdown>
    )
}
