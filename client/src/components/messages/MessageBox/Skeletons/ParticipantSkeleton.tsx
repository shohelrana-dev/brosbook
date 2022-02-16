import React, { Fragment } from 'react'
import { Skeleton }        from "@mui/material"

function ParticipantSkeleton() {
    return (
        <Fragment>
            <Skeleton className="mr-3" variant="circular" width={ 50 } height={ 50 }/>
            <div className="w-full">
                <Skeleton variant="text" width="30%" height={ 30 }/>
                <Skeleton variant="text" width="15%" height={ 20 }/>
            </div>
        </Fragment>
    )
}

export default ParticipantSkeleton