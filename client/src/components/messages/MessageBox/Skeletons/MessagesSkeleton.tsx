import React, { Fragment } from 'react'
import { Skeleton }        from "@mui/material"

function MessagesSkeleton() {
    return (
        <Fragment>
            { Array( 3 ).fill( null ).map( ( _, i ) => (
                <Fragment key={ i }>
                    <div className="flex mb-5 items-end float-left">
                        <Skeleton className="mr-3" variant="circular" width={ 50 } height={ 50 }/>
                        <div className="w-full">
                            <Skeleton variant="text" width="40%" height={ 50 }/>
                            <Skeleton variant="text" width="40%" height={ 50 }/>
                        </div>
                    </div>
                    <div className="clear-both"></div>
                    <div className="flex mb-5 items-end float-right">
                        <div className="relative w-full float-right text-right justify-center">
                            <Skeleton className="float-right" variant="text" width="40%" height={ 50 }/>
                            <div className="clear-both"></div>
                            <Skeleton className="float-right" variant="text" width="40%" height={ 50 }/>
                        </div>
                        <Skeleton className="ml-3" variant="circular" width={ 50 } height={ 50 }/>
                    </div>
                </Fragment>
            ) ) }
        </Fragment>
    )
}

export default MessagesSkeleton