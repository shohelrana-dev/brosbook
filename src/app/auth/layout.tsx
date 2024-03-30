'use client'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { cn } from '~/lib/utils'

interface Props {
    children: ReactNode
}

export default function Layout({ children }: Props) {
    const pathname = usePathname()

    return (
        <main
            className={cn(`w-100 max-w-full mx-auto mt-12 lg:mt-28 px-2 lg:px-0 relative z-50`, {
                'mt-6 lg:mt-6': pathname === '/auth/signup',
            })}
        >
            {children}
        </main>
    )
}
