import React, { useEffect }    from 'react'
import { useGetAuthUserQuery } from "@services/authApi"
import { setAuth }             from "@features/authSlice"
import { useDispatch }         from "react-redux"

function CheckAuth(){
    const dispatch            = useDispatch()
    const { data, isSuccess } = useGetAuthUserQuery()

    useEffect( () => {
        isSuccess && dispatch( setAuth( data.user ) )
    }, [isSuccess] )

    return null
}

export default CheckAuth