import React, { useEffect, useRef, useState } from 'react'
import { BiSearch as SearchIcon } from "react-icons/bi"
import { IconButton, Tooltip } from '@mui/material'
import BasicInput from "@components/form/BasicInput"
import classNames from "classnames"
import { User } from "@interfaces/user.interfaces"
import { useRouter } from "next/navigation"
import SearchUserList from "@components/global/SearchUserList"
import { useDebounce } from "use-debounce"
import delay from "delay"

export default function ExpandableSearch() {
    const [ expanded, setExpanded ]     = useState<boolean>(false)
    const [ searchText, setSearchText ] = useState<string>('')
    const [ dSearchText ]               = useDebounce<string>(searchText, 1000)
    const router                        = useRouter()
    const inputRef                      = useRef<HTMLInputElement>()

    useEffect(() => {
        if ( expanded ) {
            inputRef.current?.focus()
        } else {
            setSearchText('')
            inputRef.current?.blur()
        }
    }, [ expanded ])

    async function toggleExpand() {
        if ( expanded ) {
            await delay(200)
        }
        setExpanded(!expanded)
    }

    async function onUserClick( user: User ) {
        try {
            router.push(`/${ user.username }`)
        } catch ( e ) {
            console.log(e)
        }
    }

    const inputWrapperClassname = classNames('!mb-0 w-[50px] duration-300 transition-all opacity-0 float-right', { "w-full opacity-100": expanded })

    return (
        <div className="relative rounded-3xl flex-none">
            <BasicInput
                onChange={ ( e ) => setSearchText(e.target.value) }
                value={ searchText }
                inputRef={ inputRef }
                onBlur={ toggleExpand }
                className="!rounded-3xl z-10 !bg-transparent mt-1 !py-2"
                wrapperClassname={ inputWrapperClassname }
                type="text"
                label="Search"
                labelHide
                autoComplete="off"
            />

            <div className="absolute right-1 top-[50%] translate-y-[-50%]">
                <Tooltip title="Search">
                    <IconButton onClick={ toggleExpand } disabled={ expanded } className="mt-1">
                        <SearchIcon size={ 18 } className="text-gray-700 "/>
                    </IconButton>
                </Tooltip>
            </div>

            { expanded ? <SearchUserList onUserClick={ onUserClick } searchText={ dSearchText }/> : null }
        </div>
    )
}