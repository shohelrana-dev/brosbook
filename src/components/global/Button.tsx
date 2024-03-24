'use client'
import { forwardRef } from 'react'
import { useFormStatus } from 'react-dom'
import Loader from '~/components/global/Loader'
import { ButtonProps, Button as NextUIButton, extendVariants } from '~/lib/nextui'
import cn from '~/utils/cn'

const BaseButton = extendVariants(NextUIButton, {
    variants: {
        size: {
            sm: 'font-semibold text-sm',
            md: 'text-base',
        },
    },
})

const Button = forwardRef((props: ButtonProps, ref?: any) => {
    const { pending } = useFormStatus()
    const { className, ...rest } = props

    return (
        <BaseButton
            color='primary'
            size='md'
            radius='full'
            className={cn('font-medium', className)}
            spinner={
                <Loader
                    size={props.size === 'sm' ? 'xs' : 'sm'}
                    disableText
                    className='border-t-gray-900'
                />
            }
            isLoading={pending}
            {...rest}
            ref={ref}
        />
    )
})

Button.displayName = 'Button'
export default Button
