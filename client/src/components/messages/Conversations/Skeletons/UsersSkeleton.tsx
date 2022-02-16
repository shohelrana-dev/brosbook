import React, { Fragment } from 'react'
import { Skeleton }        from "@mui/material"

function UsersSkeleton() {
    return (
        <Fragment>
            { Array( 5 ).fill( null ).map( ( _, i ) => (
                <div className="flex box mb-2 p-2 items-center" key={ i }>
                    <Skeleton className="mr-3" variant="circular" width={ 50 } height={ 50 }/>
                    <Skeleton variant="text" width="60%" height={ 30 }/>
                </div>
            ) ) }
        </Fragment>
    )
}

export default UsersSkeleton