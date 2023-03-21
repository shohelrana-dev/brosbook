import React from 'react'
import { Input, InputProps } from "@material-tailwind/react"
import classNames from "classnames"

export interface AnimatedInputProps extends Omit<InputProps, 'error'> {
    error?: string
    wrapperClassname?: string
}

function AnimatedInput( props: AnimatedInputProps ){

    let { label, name, size = 'lg', error, wrapperClassname = '', className = '', ...rest } = props

    name      = name ? name : ( label as string ).toLowerCase().replace( ' ', '' )
    className = classNames( className, 'bg-gray-50 focus:bg-white' )

    return (
        <div className={ wrapperClassname }>
            {/*@ts-ignore*/ }
            <Input
                labelProps={ { className: `duration-500` } }
                className={ className } name={ name }
                label={ label }
                size={ size }
                error={ !! error }
                { ...rest }
            />
            { error ? (
                <span className="flex items-center">
                    <p className="font-medium text-red-600 text-[12px]">
                        { error }
                    </p>
                </span>
            ) : null }
        </div>
    )
}

export default AnimatedInput