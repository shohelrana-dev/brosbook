import { ChangeEvent, FormEvent, useState } from "react"
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks"
import { MutationDefinition } from "@reduxjs/toolkit/query"
import { toast } from "react-toastify"

export type Errors<TPayload> = {
    [Key in keyof TPayload]: string
}

type Options<TPayload> = {
    initialFormData?: TPayload
    successMessage?: string
    errorMessage?: string
}

export function useForm<TPayload>( mutationFN: MutationTrigger<MutationDefinition<TPayload, any, any, any>>, initialFormData?: TPayload ){
    const [formData, setFormData] = useState<TPayload>( initialFormData || {} as TPayload )
    const [errors, setErrors]     = useState<Errors<TPayload>>( {} as Errors<TPayload> )

    function onChange( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ){
        if( ! e.target.name ){
            throw new Error( `name attribute missing in ${ e.target }` )
        }
        setFormData( { ...formData, [e.target.name]: e.target.value } )
    }

    async function onSubmit( e: FormEvent ){
        e.preventDefault()

        try {
            await mutationFN( formData ).unwrap()
        } catch ( err: any ) {
            console.error( err )
            setErrors( err?.data?.errors || {} )
            toast.error( err?.data?.message || 'Request was failed.' )
        }
    }

    function setErrorsEmpty(){
        setErrors( {} as Errors<TPayload> )
    }

    return { formData, onChange, onSubmit, errors, setFormData, setErrorsEmpty }
}