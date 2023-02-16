import React, { useState } from 'react'
import { BiSearch as SearchIcon } from "react-icons/bi"
import IconButton from "@components/global/IconButton"
import BasicInput from "@components/global/BasicInput"
import classNames from "classnames"
import { User } from "@interfaces/user.interfaces"
import { useRouter } from "next/navigation"
import SearchUserList from "@components/global/SearchUserList"
import { useDebouncedCallback } from "use-debounce"

export default function ExpandableSearch(){
    const [expanded, setExpanded]   = useState<boolean>( false )
    const [searchKey, setSearchKey] = useState<string>( '' )
    const router                    = useRouter()

    function onMouseEnter(){
        setExpanded( true )
        document?.getElementById( 'search-input' )?.focus()
    }

    function onBlur(){
        setTimeout( () => {
            setExpanded( false )
            setSearchKey( '' )
        }, 200 )
    }

    async function onUserClick( user: User ){
        try {
            router.push( `/${ user.username }` )
        } catch ( e ) {
            console.log( e )
        }
    }

    const onChange = useDebouncedCallback(
        ( value ) => {
            setSearchKey( value )
        },
        500,
    )

    const inputWrapperClassname = classNames( '!mb-0 w-[50px] duration-300 transition-all opacity-0 float-right', { "w-full opacity-100": expanded } )

    return (
        <div className="relative rounded-3xl flex-none" onMouseEnter={ onMouseEnter }>
            <BasicInput
                onChange={ ( e ) => onChange( e.target.value ) }
                value={ searchKey }
                id="search-input"
                onBlur={ onBlur }
                className="!rounded-3xl z-10 !bg-transparent"
                wrapperClassname={ inputWrapperClassname } type="text" label="Search"
                labelHide/>

            <div className="absolute right-1 top-1 -z-10">
                <IconButton>
                    <SearchIcon size={ 18 } className="text-gray-700"/>
                </IconButton>
            </div>

            { expanded ? <SearchUserList onUserClick={ onUserClick } searchKey={ searchKey }/> : null }
        </div>
    )
}