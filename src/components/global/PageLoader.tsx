import { LinearProgress } from '@mui/material'

export default function PageLoader() {
    return (
        <div className='fixed w-full left-0 top-navbar'>
            <LinearProgress color='primary' />
        </div>
    )
}
