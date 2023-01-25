import React from 'react'
import ButtonGray, { ButtonGrayProps } from "@components/common/ButtonGray"
import classNames from "classnames"

export default function OptionButton( { children, className = '', size = "md", ...rest }: ButtonGrayProps ){
    className = classNames( 'rounded-none w-full flex gap-2 items-center bg-transparent mt-0 px-4', className )
    return (
        <ButtonGray size={ size } className={ className } { ...rest }>
            { children }
        </ButtonGray>
    )
}