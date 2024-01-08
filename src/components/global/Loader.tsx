"use client"
import CircularProgress, { circularProgressClasses, CircularProgressProps } from '@mui/material/CircularProgress'
import cn from '@/utils/cn'

interface LoaderProps extends CircularProgressProps {
    loading?: boolean,
    wrapperClassName?: string
}

export default function Loader( { wrapperClassName, loading = true, ...rest }: LoaderProps ) {

    if ( typeof loading === 'boolean' && !loading ) return null

    return (
        <div className={ cn('flex flex-wrap justify-center my-4', wrapperClassName) }>
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={ {
                    color: ( theme ) => theme.palette.primary.main,
                    animationDuration: '550ms',
                    [`& .${ circularProgressClasses.circle }`]: {
                        strokeLinecap: 'round',
                    },
                } }
                { ...rest }
            />
        </div>
    )
}