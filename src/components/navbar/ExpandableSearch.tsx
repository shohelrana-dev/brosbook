import React, { useEffect, useRef, useState } from 'react'
import { BiSearch as SearchIcon } from 'react-icons/bi'
import { IconButton, Popover, Tooltip } from '@mui/material'
import BasicInput from '@components/form/BasicInput'
import { User } from '@interfaces/user.interfaces'
import { useRouter } from 'next/navigation'
import SearchUserList from '@components/global/SearchUserList'
import { useDebounce } from 'use-debounce'
import delay from 'delay'
import { twJoin } from 'tailwind-merge'
import PopupState, { bindPopover, bindTrigger } from 'material-ui-popup-state'
import useInputValue from '@hooks/useInputValue'

export default function ExpandableSearch() {
    const [expanded, setExpanded] = useState<boolean>(false)
    const [searchText, handleInputChange, resetInputValue] = useInputValue('')
    const [dSearchText] = useDebounce<string>(searchText, 1000)
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>()

    async function toggleExpand() {
        if (expanded) {
            await delay(200)
        }
        setExpanded(!expanded)
    }

    async function handleUserClick(user: User) {
        try {
            router.push(`/${user.username}`)
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <PopupState
            variant='popover'
            disableAutoFocus
        >
            {popupState => {
                useEffect(() => {
                    popupState.isOpen && inputRef.current?.focus()

                    !popupState.isOpen && resetInputValue()
                }, [popupState.isOpen, inputRef.current])

                return (
                    <>
                        <div
                            className='relative w-[200px] flex justify-end'
                            {...bindTrigger(popupState)}
                        >
                            <Tooltip title='Search'>
                                <IconButton
                                    disabled={popupState.isOpen}
                                    className='mt-1'
                                >
                                    <SearchIcon
                                        size={18}
                                        className='text-gray-700 '
                                    />
                                </IconButton>
                            </Tooltip>

                            <BasicInput
                                onChange={handleInputChange}
                                value={searchText}
                                inputRef={inputRef}
                                className='rounded-3xl z-10 bg-transparent mt-1 py-2'
                                wrapperClassname={twJoin(
                                    'absolute top-[50%] translate-y-[-50%] right-0 w-0 duration-300 transition-all opacity-0',
                                    popupState.isOpen && 'w-full opacity-100'
                                )}
                                type='text'
                                label='Search'
                                labelHide
                                autoComplete='off'
                                autoFocus
                            />
                        </div>

                        <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            sx={{ marginTop: '5px' }}
                        >
                            <SearchUserList searchText={dSearchText} />
                        </Popover>
                    </>
                )
            }}
        </PopupState>
    )
}
