"use client"
import React from 'react'
import classNames from "classnames"
import { Button, ButtonProps } from "@material-tailwind/react"

interface ButtonOutlineProps extends ButtonProps {

}

function ButtonOutline( props: ButtonOutlineProps ){
    let { title, children, className = '', ...rest } = props

    className = classNames( 'rounded-full capitalize hover:bg-gray-50 h-auto', { "text-sm": rest.size === 'md' }, className )

    return (
        <div className="flex items-center">
            {/*@ts-ignore*/ }
            <Button variant="outlined" className={ className } { ...rest }>
                { children }
            </Button>
        </div>
    )
}

export default ButtonOutline
