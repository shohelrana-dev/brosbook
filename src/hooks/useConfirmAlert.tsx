import ButtonOutline from "@components/common/ButtonOutline"
import Button from "@components/common/Button"
import { createContext, PropsWithChildren, useContext, useState } from "react"
import Modal from "@components/common/Modal"

export interface Options {
    title: string
    message?: string
    confirmButtonLabel?: string
    cancelButtonLabel?: string
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

    function onConfirm(){
        resolver.resolve( true )
        setIsOpen( false )
    }

    function onCancel(){
        resolver.resolve( false )
        setIsOpen( false )
    }

    return (
        <ConfirmAlertContext.Provider value={ confirmAlert }>
            { children }
            <Modal
                isOpen={ isOpen }
                onClose={ onCancel }
                style={ { maxWidth: 330, padding: 30 } }
                isShowCancelIcon={false}
            >
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-2">{ options.title }</h3>
                    <p className="text-gray-800">{ options.message }</p>
                </div>
                <div className="basis-full">
                    <Button fullWidth size="sm" className="mb-3" onClick={ onConfirm }>
                        { options.confirmButtonLabel }
                    </Button>
                    <ButtonOutline size="sm" fullWidth onClick={ onCancel }>
                        { options.cancelButtonLabel }
                    </ButtonOutline>
                </div>
            </Modal>
        </ConfirmAlertContext.Provider>
    )
}

export default function useConfirmAlert(){
    return useContext( ConfirmAlertContext )
}
