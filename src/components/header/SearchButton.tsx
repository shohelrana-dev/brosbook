import { BiSearch as SearchIcon } from 'react-icons/bi'
import BasicInput from '~/components/form/BasicInput'
import IconButton from '~/components/ui/IconButton'
import SearchUserList from '~/components/ui/SearchUserList'
import Tooltip from '~/components/ui/Tooltip'
import useInputValue from '~/hooks/useInputValue'
import { Popover, PopoverContent, PopoverTrigger } from '~/lib/nextui'

export default function SearchButton() {
    const [searchText, handleInputChange, resetInputValue] = useInputValue('')

    return (
        <Popover placement='bottom' showArrow onClose={() => searchText && resetInputValue()}>
            <Tooltip content='Search'>
                <PopoverTrigger>
                    <IconButton size='lg'>
                        <SearchIcon size={20} />
                    </IconButton>
                </PopoverTrigger>
            </Tooltip>

            <PopoverContent>
                <div className='w-full flex gap-1 items-center py-2'>
                    <BasicInput
                        onChange={handleInputChange}
                        value={searchText}
                        wrapperClassname='mb:0 md:mb-0 flex-grow'
                        type='text'
                        placeholder='Search'
                        autoComplete='off'
                        autoFocus
                        startContent={<SearchIcon className='text-default-400 mr-1' size={18} />}
                        isClearable
                        onClear={resetInputValue}
                        radius='full'
                        classNames={{ inputWrapper: 'border' }}
                    />
                </div>

                <SearchUserList searchText={searchText} hideFollowButton />
            </PopoverContent>
        </Popover>
    )
}
