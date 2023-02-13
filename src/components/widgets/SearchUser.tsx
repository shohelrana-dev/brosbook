"use client"
import React, { useState } from 'react'
import BasicInput from "@components/global/BasicInput"
import { useDebouncedCallback } from "use-debounce"
import SearchUserList from "@components/global/SearchUserList"
import { useRouter } from "next/navigation"
import { User } from "@interfaces/user.interfaces"
import { useSearchUsersQuery } from "@services/usersApi"

function SearchUser(){
    const router                          = useRouter()
    const [searchKey, setSearchKey]       = useState<string>( '' )
    const [isBlur, setIsBlur]             = useState<boolean>( false )
    const { data, isLoading, isFetching } = useSearchUsersQuery( { key: searchKey, page: 1 }, { skip: ! searchKey } )

    const users = data?.items || []

    const onChange = useDebouncedCallback(
        ( value ) => {
            setSearchKey( value )
        },
        500,
    )

    const onBlur = useDebouncedCallback(
        () => {
            setIsBlur( false )
        },
        200,
    )

    function onUserClick( user: User ){
        router.push( `/${ user.username }` )
    }

    return (
        <div className="mb-3">
            <BasicInput
                label="Search user"
                labelHide={ true }
                onBlur={ onBlur }
                onFocus={ () => setIsBlur( true ) }
                onChange={ ( e ) => {onChange( e.target.value )} }
            />
            { isBlur ? (
                <SearchUserList onUserClick={ onUserClick } users={ users } isLoading={ isLoading || isFetching }/>
            ) : null }
        </div>
    )
}

export default SearchUser