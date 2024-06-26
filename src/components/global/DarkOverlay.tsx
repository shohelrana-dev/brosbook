import { ComponentProps } from 'react'
import { cn } from '~/lib/utils'

interface Props extends ComponentProps<'div'> {
    isOpen: boolean
}

export default function DarkOverlay({ isOpen, className, ...rest }: Props) {
    return (
        <div
            className={cn(
                'fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.3)] z-10 opacity-0 duration-200 invisible',
                isOpen && 'opacity-100 visible',
                className
            )}
            {...rest}
        />
    )
}
