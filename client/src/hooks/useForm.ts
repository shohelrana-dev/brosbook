import { ChangeEvent } from "react"

export function useForm<TContent>( defaultValues: TContent ){
    function onSubmit( event: ChangeEvent<HTMLFormElement> ){
        event.preventDefault()
        event.persist()

        const form     = event.target as HTMLFormElement
        const elements = Array.from( form.elements ) as HTMLInputElement[]
        const formData = elements
            .filter( ( element ) => element.hasAttribute( 'name' ) )
            .reduce(
                ( object, element ) => ( {
                    ...object,
                    [`${ element.getAttribute( 'name' ) }`]: element.value,
                } ),
                defaultValues
            )

        return formData
    }
}