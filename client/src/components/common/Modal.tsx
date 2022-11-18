import React, {ReactNode} from "react"
import {motion} from "framer-motion"
import {MdOutlineCancel as CancelIcon} from "react-icons/md"
import IconButton from "@components/common/IconButton"
import classNames from "classnames"

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    iconAlignment?: 'left' | 'right'
    className?: string
}

export default function Modal(props: ModalProps) {
    const {isOpen, onClose, children, iconAlignment='right', className} = props

    const boxClassName = classNames('box relative rounded-xl max-w-[520px] w-[80%] p-4 border border-solid border-gray-300', className)
    const iconClassName = classNames('!absolute top-1', iconAlignment === 'right' ? 'right-1' : 'left-1')

    if(isOpen) return (
        <motion.div
            className="fixed flex items-center justify-center w-full h-full top-0 left-0 bg-[#00000066] z-50"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <motion.div
                className={boxClassName}
                initial={{scale: 0.9}}
                animate={{scale: 1}}
                exit={{scale: 0}}
            >
                <div className={iconClassName}>
                    <IconButton onClick={onClose} className="p-5">
                        <CancelIcon size="30"/>
                    </IconButton>
                </div>
                {children}
            </motion.div>
        </motion.div>
    )

    return null
}