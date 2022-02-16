import { Dispatch } from "redux"

import { setLoading, setErrors }  from "@slices/settingsSlice"
import api                        from "@api/index"
import { ChangePasswordFormData } from "@interfaces/user.interfaces"
import { toast }                  from "react-toastify"

export const updateProfile = ( formData: FormData ) => async ( dispatch: Dispatch ) => {
    dispatch( setLoading( true ) )

    try {
        //api call
        const { data } = await api.settings.updateProfile( formData )

        //show success message
        toast.success( data.message )
    } catch ( err: any ) {
        //set errors and display error message
        dispatch( setErrors( err.response?.data?.errors || {} ) )
        toast.error( err.response?.data?.message )
    }
}

export const changePassword = ( formData: ChangePasswordFormData ) => async ( dispatch: Dispatch ) => {
    dispatch( setLoading( true ) )

    try {
        //api call
        const { data } = await api.settings.changePassword( formData )

        //show success message and remove existing errors
        toast.success( data.message )
        dispatch( setErrors( {} ) )
    } catch ( err: any ) {
        //set errors and display error message
        dispatch( setErrors( err.response?.data?.errors || {} ) )
        toast.error( err.response?.data.message )
    }
}