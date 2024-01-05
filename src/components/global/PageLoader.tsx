import { LinearProgress } from '@mui/material'

export default function PageLoader() {
    return (
        <div className='fixed w-full left-0 top-[65px]'>
            <LinearProgress color='primary' />
        </div>
    )
}
