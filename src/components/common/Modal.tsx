import React, {ReactNode} from "react"
import {motion, AnimatePresence} from "framer-motion"
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

    const boxClassName = classNames('box relative rounded-xl max-w-[520px] w-[80%] p-4 lg:p-6 border border-solid border-gray-300', className)
    const iconClassName = classNames('!absolute right-1 top-1', iconAlignment === 'right' ? 'right-1' : 'left-1')

    return (
        <AnimatePresence>
            {isOpen ? (
                <motion.div
                    className="fixed flex items-center justify-center w-full h-full top-0 left-0 bg-[#00000066] z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{duration: 0.3}}
                >
                    <motion.div
                        className={boxClassName}
                        initial={{opacity: 0, scale: 0.8}}
                        animate={{scale: 1, opacity: 1}}
                        exit={{scale: 0.6, opacity: 0}}
                        transition={{duration: 0.3}}
                    >
                        <div className={iconClassName}>
                            <IconButton onClick={onClose} className="p-4">
                                <CancelIcon size="25"/>
                            </IconButton>
                        </div>
                        {children}
                    </motion.div>
                </motion.div>
            ) : null }
        </AnimatePresence>
    )
}