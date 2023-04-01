import React, { useEffect, useRef, useState } from 'react'
import { BiSearch as SearchIcon } from "react-icons/bi"
import IconButton from "@components/global/IconButton"
import BasicInput from "@components/global/BasicInput"
import classNames from "classnames"
import { User } from "@interfaces/user.interfaces"
import { useRouter } from "next/navigation"
import SearchUserList from "@components/global/SearchUserList"
import { useDebouncedCallback } from "use-debounce"
import delay from "delay";

export default function ExpandableSearch(){
    const [expanded, setExpanded]   = useState<boolean>( false )
    const [searchKey, setSearchKey] = useState<string>( '' )
    const router                    = useRouter()
    const inputRef                  = useRef<HTMLInputElement>()

    useEffect( () => {
        if( expanded ){
            inputRef.current?.focus()
        } else{
            setSearchKey( '' )
            inputRef.current?.blur()
        }
    }, [expanded] )

    const handleInputChange = useDebouncedCallback(
        ( value ) => {
            setSearchKey( value )
        },
        500,
    )

    async function toggleExpand(){
        if( expanded ){
            await delay( 300 )
        }
        setExpanded( ! expanded )
    }

    async function onUserClick( user: User ){
        try {
            router.push( `/${ user.username }` )
        } catch ( e ) {
            console.log( e )
        }
    }

    const inputWrapperClassname = classNames( '!mb-0 w-[50px] duration-300 transition-all opacity-0 float-right', { "w-full opacity-100": expanded } )

    return (
        <div className="relative rounded-3xl flex-none">
            <BasicInput
                onChange={ ( e ) => handleInputChange( e.target.value ) }
                value={ searchKey }
                inputRef={ inputRef }
                onBlur={ toggleExpand }
                className="!rounded-3xl z-10 !bg-transparent"
                wrapperClassname={ inputWrapperClassname }
                type="text"
                label="Search"
                labelHide
                autoComplete="off"
            />

            <div className="absolute right-1 top-1">
                <IconButton onClick={ toggleExpand } disabled={ expanded }>
                    <SearchIcon size={ 18 } className="text-gray-700"/>
                </IconButton>
            </div>

            { expanded ? <SearchUserList onUserClick={ onUserClick } searchKey={ searchKey }/> : null }
        </div>
    )
}