import React from 'react'
import { FiAlertCircle as ErrorIcon } from "react-icons/fi"
import tw from "twin.macro"

const Wrapper = tw.div`bg-[rgb(253, 237, 237)] flex gap-3 items-center p-3 rounded-md text-gray-900`

export default function Error( { isError, message }: { message?: string, isError?: boolean } ){
    if( ! message && typeof isError === "undefined" ){
        return null
    }

    return (
        <Wrapper>
            <div>
                <ErrorIcon size={ 20 } color={ "red" }/>
            </div>
            <p>{ message ? message : "An error has occured!" }</p>
        </Wrapper>
    )
}