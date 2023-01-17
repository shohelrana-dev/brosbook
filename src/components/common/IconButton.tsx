import React from 'react'
import {IconButton as BaseIconButton, IconButtonProps} from "@material-tailwind/react"
import classNames from "classnames"

function IconButton(props: IconButtonProps) {
    let {children, className, variant, size='sm', ...rest} = props

    className = classNames('rounded-full', className)

    return (
        /*@ts-ignore*/
        <BaseIconButton variant="text" className={className} size={size} {...rest}>
            {children}
        </BaseIconButton>
    )
}

export default IconButton