import React        from 'react'
import { Skeleton } from "@mui/material"

function CommentsSkeleton() {
    return (
        <>
            { Array( 3 ).fill( null ).map( ( _, i ) => (
                <div className="flex mb-5" key={ i }>
                    <Skeleton className="mr-3" variant="circular" width={ 40 } height={ 40 }/>
                    <div className="w-full">
                        <Skeleton height="30" className="max-w-[120px]"/>
                        <Skeleton width="70" height="20"/>
                    </div>
                </div>
            ) ) }
        </>
    );
}

export default CommentsSkeleton