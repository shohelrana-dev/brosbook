"use client"
import React from 'react'
import classNames from "classnames"
import {Button, ButtonProps} from "@material-tailwind/react"

interface ButtonOutlineProps extends ButtonProps {

}

function ButtonOutline(props: ButtonOutlineProps) {
    let { title, children, className = '', size='sm', ...rest } = props

    className = classNames(className, 'rounded-full flex items-center max-h-[35px] capitalize hover:bg-gray-50')

    return (
        /*@ts-ignore*/
        <Button variant="outlined" className={className} size={size} {...rest}>
            {children}
        </Button>
    )
}

export default ButtonOutline
