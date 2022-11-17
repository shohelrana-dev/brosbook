import Button from "@components/common/Button"
import ButtonOutline from "@components/common/ButtonOutline"
import {motion} from "framer-motion"

interface ConfirmAlertProps {
    title: string
    message?: string
    okButtonLabel?: string
    cancelButtonLabel?: string
    isOpen: boolean
    onConfirm: () => void
    onClose: () => void
}

export default function ConfirmAlert(props: ConfirmAlertProps) {
    const {title, message, okButtonLabel = 'Ok', cancelButtonLabel = 'Cancel', isOpen, onConfirm, onClose} = props

    if(isOpen) return (
        <motion.div
            className="fixed flex items-center justify-center w-full h-full top-0 left-0 bg-[#00000066] z-50"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <motion.div
                className="box rounded-3xl max-w-[320px] py-8 px-6 border border-solid border-gray-300"
                initial={{scale: 0.9}}
                animate={{scale: 1}}
                exit={{scale: 0}}
            >
                <h3 className="text-xl text-bold mb-2">{title}</h3>
                {message ? <p className="text-gray-700">{message}</p> : null}
                <div className="mt-5">
                    <Button fullWidth className="mb-3" onClick={() => {onClose(); onConfirm();}}>{okButtonLabel}</Button>
                    <ButtonOutline fullWidth onClick={onClose}>{cancelButtonLabel}</ButtonOutline>
                </div>
            </motion.div>
        </motion.div>
    )

    return null
}