import React from 'react'
import { Button as BaseButton, ButtonProps as BaseButtonProps } from '@material-tailwind/react'
import { PuffLoader } from "react-spinners"
import classNames from "classnames"

interface ButtonProps extends BaseButtonProps {
    isLoading?: boolean
}

export default function Button( props: ButtonProps ){
    let { children, isLoading = false, variant, className, disabled, size = 'md', ...rest } = props
    className                                                                               = classNames( 'mt-3 rounded-full capitalize', size === 'sm' ? 'min-w-[90px]' : 'min-w-[130px]', className )

    return (
        //@ts-ignore
        <BaseButton variant="filled" className={ className } size={ size }
                    disabled={ props.disabled ? props.disabled : isLoading } { ...rest }>
            { isLoading ? (
                <div className="relative inline-block">
                    &nbsp;
                    <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <PuffLoader size={ size === 'md' || size === 'lg' ? 30 : 25 } color="#fff"/>
                    </div>
                    &nbsp;
                </div>
            ) : children
            }
        </BaseButton>
    )
}
