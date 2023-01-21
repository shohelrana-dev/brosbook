import ButtonOutline from "@components/common/ButtonOutline"
import Button from "@components/common/Button"
import {createContext, PropsWithChildren, useContext, useState} from "react"
import {motion, AnimatePresence} from "framer-motion"

export interface Options {
    title: string
    message?: string
    confirmButtonLabel?: string
    cancelButtonLabel?: string
}

// @ts-ignore
const ConfirmContext = createContext<(options: Options) => Promise<boolean>>(null)

export function ConfirmProvider({children}: PropsWithChildren) {
    const [options, setOptions] = useState<Options>({
        title: '', confirmButtonLabel: 'Yes', cancelButtonLabel: 'Cancel'
    })
    const [isOpen, setIsOpen] = useState<boolean>(false)
    // @ts-ignore
    const [resolver, setResolver ] = useState<{resolve: (value: boolean) => void}>({resolve: null})

    function confirm(options: Options): Promise<boolean> {
        setOptions((prevState) => ({...prevState, ...options}))
        setIsOpen(true)
        return new Promise<boolean>((resolve, reject) => {
            setResolver({resolve})
        })
    }

    function onConfirm() {
        resolver.resolve(true)
        setIsOpen(false)
    }

    function onCancel() {
        resolver.resolve(false)
        setIsOpen(false)
    }

    return (
        <ConfirmContext.Provider value={confirm}>
            {children}
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{duration: 0.2}}
                        style={{zIndex: 2000}}
                        className="fixed flex items-center justify-center w-full h-full top-0 left-0 bg-[#00000066]"
                    >
                        <motion.div
                            initial={{scale: 0.9}}
                            animate={{scale: 1}}
                            exit={{ opacity: 0, scale: 0.6 }}
                            style={{maxWidth: '300px'}}
                            transition={{duration: 0.2}}
                            className="box w-[80%] rounded-2xl p-6"
                        >
                            <div className="mb-6">
                                <h3 className="text-lg font-bold mb-2">{options.title}</h3>
                                <p className="text-gray-800">{options.message}</p>
                            </div>
                            <div className="basis-full">
                                <Button fullWidth size="sm" className="mb-3" onClick={onConfirm}>
                                    {options.confirmButtonLabel}
                                </Button>
                                <ButtonOutline size="sm" fullWidth onClick={onCancel}>
                                    {options.cancelButtonLabel}
                                </ButtonOutline>
                            </div>
                        </motion.div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </ConfirmContext.Provider>
    )
}

export default function useConfirm() {
    return useContext(ConfirmContext)
}
