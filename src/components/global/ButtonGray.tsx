import React from 'react'
import { Button as BaseButton, ButtonProps as BaseButtonProps } from '@material-tailwind/react'
import { PuffLoader } from "react-spinners"
import classNames from "classnames"

export interface ButtonGrayProps extends BaseButtonProps {
    isLoading?: boolean
}

export default function ButtonGray( props: ButtonGrayProps ){
    let { children, isLoading = false, className, disabled, size = 'sm', ...rest } = props
    className                                                                      = classNames( 'mt-3 rounded-full capitalize min-w-[90px] bg-[#dddddd14] hover:bg-[#dddddd38]', className )

    if( isLoading ) return (
        <div className="ml-6 py-4">
            <PuffLoader size={ 25 } color="#7393B3"/>
        </div>
    )
    else return (
        /*@ts-ignore*/
        <BaseButton variant="text" className={ className } size={ size }
                    disabled={ disabled ? disabled : isLoading } { ...rest }>
            { children }
        </BaseButton>
    )
}