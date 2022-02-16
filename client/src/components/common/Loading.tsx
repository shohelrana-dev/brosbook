import React                from 'react'
import { CircularProgress } from "@mui/material";

function Loading(  ) {
    return (
        <div className="flex justify-center">
            <CircularProgress size={ 30 }/>
        </div>
    )
}

export default Loading