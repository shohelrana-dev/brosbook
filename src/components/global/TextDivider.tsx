import { ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export default function TextDivider({ children, className, ...rest }: ComponentProps<'div'>) {
    return (
        <div className={cn('flex gap-3 items-center', className)} {...rest}>
            <span className='h-[1px] w-full bg-gray-300 flex-grow' />
            <p>{children}</p>
            <span className='h-[1px] w-full bg-gray-300 flex-grow' />
            <span />
        </div>
    )
}
