import ButtonOutline from "@components/global/ButtonOutline"
import Button from "@components/global/Button"
import { createContext, PropsWithChildren, useContext, useState } from "react"
import Modal from "@components/global/Modal"
import toast from "react-hot-toast"

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
    const [options, setOptions]   = useState<Options>( {
        title: '', confirmButtonLabel: 'Yes', cancelButtonLabel: 'Cancel'
    } )
    const [isOpen, setIsOpen]     = useState<boolean>( false )
    // @ts-ignore
    const [resolver, setResolver] = useState<{ resolve: ( value: boolean ) => void }>( { resolve: null } )

    function confirmAlert( options: Options ): Promise<boolean>{
        setOptions( ( prevState ) => ( { ...prevState, ...options } ) )
        setIsOpen( true )
        return new Promise<boolean>( ( resolve, reject ) => {
            setResolver( { resolve } )
        } )
    }

    async function onConfirm(){
        if( typeof options.onConfirm === 'function' ){
            try {
                options.onConfirm()
                resolver.resolve( true )
                setIsOpen( false )
            } catch ( err: any ) {
                toast.error( err?.message )
            }
        } else{
            resolver.resolve( true )
            setIsOpen( false )
        }
    }

    function onCancel(){
        setIsOpen( false )
        resolver.resolve( false )
    }

    return (
        <ConfirmAlertContext.Provider value={ confirmAlert }>
            { children }
            <Modal
                isOpen={ isOpen }
                style={ { maxWidth: 330, padding: "16px 28px" } }
                isShowCancelIcon={ false }
            >
                <div className="mb-4 block">
                    <h3 className="text-xl font-bold mb-2">{ options.title }</h3>
                    <p className="text-gray-800">{ options.message }</p>
                </div>
                <div className="basis-full flex justify-end gap-2">
                    <ButtonOutline size="sm" onClick={ onCancel }>
                        { options.cancelButtonLabel }
                    </ButtonOutline>
                    <Button size="sm" className="mb-3" onClick={ onConfirm }>
                        { options.confirmButtonLabel }
                    </Button>
                </div>
            </Modal>
        </ConfirmAlertContext.Provider>
    )
}

export default function useConfirmAlert(){
    return useContext( ConfirmAlertContext )
}
