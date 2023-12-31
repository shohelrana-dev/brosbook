'use client'
import { LinearProgress } from '@mui/material'
import { selectNavbarHeight } from '@slices/navbarHeightSlice'
import { useSelector } from 'react-redux'

export default function PageLoader() {
    const navbarHeight = useSelector(selectNavbarHeight)

    return (
        <div className='fixed w-full left-0' style={{ top: navbarHeight }}>
            {/* for reflact change after hydration */}
            <div className='hidden'>{navbarHeight}</div>
            
            <LinearProgress color='success' />
        </div>
    )
}
