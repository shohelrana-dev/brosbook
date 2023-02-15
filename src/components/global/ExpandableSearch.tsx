import React, { useRef, useState } from 'react'
import { BiSearch as SearchIcon } from "react-icons/bi"
import IconButton from "@components/global/IconButton"
import BasicInput from "@components/global/BasicInput"
import "@styles/expandable-search-bar.css"
import classNames from "classnames";

export default function ExpandableSearch(){
    const [expanded, setExpanded] = useState<boolean>( false )

    const inputWrapperClassname = classNames( '!mb-0 w-[50px] duration-300 transition-all opacity-0 float-right', { "w-full opacity-100": expanded } )

    return (
        <div
            className="relative rounded-3xl flex-auto"
            onMouseLeave={ () => setExpanded( false ) }
            onMouseEnter={ () => setExpanded( true ) }
        >
            <BasicInput className="!rounded-3xl" wrapperClassname={ inputWrapperClassname } type="text" label="Search"
                        labelHide/>
            <div className="absolute right-1 top-1">
                <IconButton className={ classNames( { "!cursor-auto !bg-transparent": expanded } ) }>
                    <SearchIcon size={ 17 }/>
                </IconButton>
            </div>
        </div>
    )
}