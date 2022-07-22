import React, { useEffect } from 'react'
import { useAuthUserQuery } from "@services/authApi"
import { useAppDispatch }   from "@store/store"
import { setAuth }          from "@features/authSlice"

function CheckAuth(){
    const dispatch            = useAppDispatch()
    const { data, isSuccess } = useAuthUserQuery()

    useEffect( () => {
        isSuccess && dispatch( setAuth( data.user ) )
    }, [isSuccess] )

    return null
}

export default CheckAuth