'use client'
import { createPortal } from 'react-dom'
import { BarLoader } from 'react-spinners'
import { isServer } from '~/lib/utils'

export default function PageLoader() {
    if (isServer) return null

    return createPortal(
        <div className='absolute w-full left-0 top-navbar'>
            <BarLoader color='#ff971c' width='100%' height='5px' />
        </div>,
        document.body
    )
}
