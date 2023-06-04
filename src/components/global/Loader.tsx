import CircularProgress, {
    circularProgressClasses,
    CircularProgressProps,
} from '@mui/material/CircularProgress'
import classNames from "classnames"

interface LoaderProps extends CircularProgressProps {
    loading?: boolean,
    wrapperClassName?: string
}

export default function Loader( { wrapperClassName, loading = true, ...rest }: LoaderProps ) {

    if ( typeof loading === 'boolean' && !loading ) return null

    return (
        <div className={ classNames('flex flex-wrap justify-center my-4', wrapperClassName) }>
            <CircularProgress
                variant="indeterminate"
                disableShrink
                sx={ {
                    color: ( theme ) => theme.palette.themeLightGreen,
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