import React, {ReactNode} from "react"
import {motion, AnimatePresence} from "framer-motion"
import {RxCross2 as CancelIcon} from "react-icons/rx"
import IconButton from "@components/common/IconButton"
import classNames from "classnames"

export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: ReactNode
    className?: string
}

export default function Modal(props: ModalProps) {
    const {isOpen, onClose, children, className} = props

    const boxClassName = classNames('box relative rounded-xl max-w-[600px] w-[90%] p-7 lg:p-8 border border-solid border-gray-300', className)

    return (
        <AnimatePresence>
            {isOpen ? (
                <motion.div
                    className="fixed flex items-center justify-center w-full h-full top-0 left-0 bg-[rgba(0,0,0,.33)] z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{duration: 0.2}}
                >
                    <motion.div
                        className={boxClassName}
                        initial={{opacity: 0, y: -10}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 10}}
                        transition={{duration: 0.3}}
                    >
                        <div className="!absolute right-2 top-2">
                            <IconButton onClick={onClose} className="p-3">
                                <CancelIcon size="18"/>
                            </IconButton>
                        </div>
                        {children}
                    </motion.div>
                </motion.div>
            ) : null }
        </AnimatePresence>
    )
}