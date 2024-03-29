import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react'
import { HiOutlineEmojiHappy as EmojiIcon } from 'react-icons/hi'
import IconButton from '~/components/global/IconButton'
import { Popover, PopoverContent, PopoverTrigger } from '~/lib/nextui'

interface Props {
    onEmojiClick: (emoji: EmojiClickData, event: MouseEvent) => void
    isDisabled: boolean
}

export default function EmojiPickerInputIcon({ onEmojiClick, isDisabled }: Props) {
    return (
        <Popover>
            <PopoverTrigger>
                <IconButton className='text-primary mr-1' isDisabled={isDisabled}>
                    <EmojiIcon fontSize={20} />
                </IconButton>
            </PopoverTrigger>

            <PopoverContent>
                <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    autoFocusSearch={false}
                    skinTonesDisabled
                    emojiStyle={EmojiStyle.FACEBOOK}
                />
            </PopoverContent>
        </Popover>
    )
}
