import React, { Fragment } from 'react'
import { Skeleton }        from "@mui/material"

export default function ConversationsSkeleton() {
    return (
        <Fragment>
            { Array( 8 ).fill( null ).map( ( _, i ) => (
                <div className="flex box mb-2 p-2" key={ i }>
                    <Skeleton className="mr-3" variant="circular" width={ 50 } height={ 50 }/>
                    <div className="w-full">
                        <div className="flex items-center">
                            <Skeleton className="mr-4" variant="text" width="40%" height={ 30 }/>
                            <Skeleton variant="text" width="15%" height={ 20 }/>
                        </div>
                        <Skeleton variant="text" width="80%" height={ 20 }/>
                    </div>
                </div>
            ) ) }
        </Fragment>
    )
}