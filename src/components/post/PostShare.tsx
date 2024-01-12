import { IconButton, Popover, Tooltip } from '@mui/material'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import { FaShareSquare as ShareIcon } from 'react-icons/fa'
import {
	EmailIcon,
	EmailShareButton,
	FacebookIcon,
	FacebookShareButton,
	TwitterIcon,
	TwitterShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from 'react-share'
import { Post } from '~/interfaces/posts.interfaces'

export default function PostShare({ post }: { post: Post }) {
	return (
		<PopupState variant='popover'>
			{popupState => (
				<div>
					<div className='flex flex-wrap items-center text-gray-600'>
						<Tooltip title='Share'>
							<IconButton {...bindTrigger(popupState)}>
								<ShareIcon size='18' />
							</IconButton>
						</Tooltip>
					</div>

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
						<div className='p-2 flex flex-wrap gap-2'>
							<FacebookShareButton
								url={`${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.id}`}
							>
								<FacebookIcon round={true} size={30} />
							</FacebookShareButton>
							<TwitterShareButton
								url={`${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.id}`}
							>
								<TwitterIcon round={true} size={30} />
							</TwitterShareButton>
							<WhatsappShareButton
								url={`${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.id}`}
							>
								<WhatsappIcon round={true} size={30} />
							</WhatsappShareButton>
							<EmailShareButton
								url={`${process.env.NEXT_PUBLIC_APP_URL}/posts/${post.id}`}
							>
								<EmailIcon round={true} size={30} />
							</EmailShareButton>
						</div>
					</Popover>
				</div>
			)}
		</PopupState>
	)
}
