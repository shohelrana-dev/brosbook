import ButtonOutline from "@components/global/ButtonOutline"
import Button from "@components/global/Button"
import { createContext, PropsWithChildren, useContext, useState } from "react"
import Modal from "@components/global/Modal"
import toast from "react-hot-toast"
import useModal from "@hooks/useModal"

export interface Options {
    title: string
    message?: string
    confirmButtonLabel?: string
    cancelButtonLabel?: string
    onConfirm?: () => void
}

// @ts-ignore
const ConfirmAlertContext = createContext<( options: Options ) => Promise<boolean>>( null )

export function ConfirmAlertProvider( { children }: PropsWithChildren ){
    const [options, setOptions] = useState<Options>( {
        title: '', confirmButtonLabel: 'Yes', cancelButtonLabel: 'Cancel'
    } )
    const { isVisible, toggle } = useModal()
    const [resolve, setResolve] = useState<( value: boolean ) => void>( () => {} )

    const { onConfirm: onConfirmFn, confirmButtonLabel, cancelButtonLabel, title, message } = options

    function confirmAlert( options: Options ): Promise<boolean>{
        setOptions( ( prevState ) => ( { ...prevState, ...options } ) )
        toggle()
        return new Promise<boolean>( ( resolve, reject ) => {
            setResolve( resolve )
        } )
    }

    async function onConfirm(){
        if( typeof onConfirmFn === 'function' ){
            try {
                onConfirmFn()
                resolve( true )
                toggle()
            } catch ( err: any ) {
                toast.error( err?.message )
            }
        } else{
            resolve( true )
            toggle()
        }
    }

    function onCancel(){
        toggle()
        resolve( false )
    }

    return (
        <ConfirmAlertContext.Provider value={ confirmAlert }>
            { children }
            <Modal
                isVisible={ isVisible }
                toggle={ toggle }
                title={ title }
                hideIcon
                className="!max-w-[385px]"
            >
                <p className="text-gray-800 mb-4">{ message }</p>
                <div>
                    <Button size="sm" className="mb-2 py-[11px] text-[13px]" onClick={ onConfirm } fullWidth>
                        { confirmButtonLabel }
                    </Button>
                    <ButtonOutline size="sm" className="py-[11px] text-[13px]" onClick={ onCancel } fullWidth>
                        { cancelButtonLabel }
                    </ButtonOutline>
                </div>
            </Modal>
        </ConfirmAlertContext.Provider>
    )
}

export default function useConfirmAlert(){
    return useContext( ConfirmAlertContext )
}
