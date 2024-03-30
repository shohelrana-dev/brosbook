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
import IconButton from '~/components/global/IconButton'
import Tooltip from '~/components/global/Tooltip'
import siteMetadata from '~/config/siteMetadata'
import { Post } from '~/interfaces/posts.interfaces'
import { Popover, PopoverContent, PopoverTrigger } from '~/lib/nextui'

export default function PostShare({ post }: { post: Post }) {
    return (
        <Popover placement='bottom'>
            <Tooltip content='Share'>
                <PopoverTrigger>
                    <IconButton>
                        <ShareIcon size='18' />
                    </IconButton>
                </PopoverTrigger>
            </Tooltip>

            <PopoverContent>
                <div className='p-1 flex flex-wrap gap-2'>
                    <FacebookShareButton url={`${siteMetadata.siteUrl}/posts/${post.id}`}>
                        <FacebookIcon round={true} size={30} />
                    </FacebookShareButton>
                    <TwitterShareButton url={`${siteMetadata.siteUrl}/posts/${post.id}`}>
                        <TwitterIcon round={true} size={30} />
                    </TwitterShareButton>
                    <WhatsappShareButton url={`${siteMetadata.siteUrl}/posts/${post.id}`}>
                        <WhatsappIcon round={true} size={30} />
                    </WhatsappShareButton>
                    <EmailShareButton url={`${siteMetadata.siteUrl}/posts/${post.id}`}>
                        <EmailIcon round={true} size={30} />
                    </EmailShareButton>
                </div>
            </PopoverContent>
        </Popover>
    )
}
