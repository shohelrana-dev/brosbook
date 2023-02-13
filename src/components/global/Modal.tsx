import React, { CSSProperties, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RxCross2 as CancelIcon } from "react-icons/rx"
import IconButton from "@components/global/IconButton"
import classNames from "classnames"

export interface ModalProps {
    isOpen: boolean
    title?: string
    onClose?: () => void
    children: ReactNode
    className?: string
    style?: CSSProperties
    isShowCancelIcon?: boolean
}

export default function Modal( props: ModalProps ){
    const { isOpen, title, onClose, children, className, style, isShowCancelIcon = true } = props

    const boxClassName = classNames( 'box relative rounded-xl max-w-[530px] w-[90%] py-4 px-6 border border-solid border-gray-300', className )

    return (
        <AnimatePresence>
            { isOpen ? (
                <motion.div
                    className="fixed flex items-center justify-center w-full h-full top-0 left-0 bg-[rgba(0,0,0,.33)] z-50"
                    initial={ { opacity: 0 } }
                    animate={ { opacity: 1 } }
                    exit={ { opacity: 0 } }
                    transition={ { duration: 0.2 } }
                >
                    <motion.div
                        className={ boxClassName }
                        initial={ { opacity: 0, y: -10 } }
                        animate={ { opacity: 1, y: 0 } }
                        exit={ { opacity: 0, y: 10 } }
                        transition={ { duration: 0.3 } }
                        style={ style }
                    >
                        { title && isShowCancelIcon ? (
                            <div className="flex justify-between items-center mb-5 pb-1 border-gray-50 border-b-[1px]">
                                <h3 className="text-xl font-bold text-gray-900">{ title }</h3>
                                { isShowCancelIcon ? (
                                    <div>
                                        <IconButton onClick={ onClose } className="p-3">
                                            <CancelIcon size="20"/>
                                        </IconButton>
                                    </div>
                                ) : null }
                            </div>
                        ) : isShowCancelIcon ? (
                            <div className="absolute right-2 top-2">
                                <IconButton onClick={ onClose } className="p-3">
                                    <CancelIcon size="20"/>
                                </IconButton>
                            </div>
                        ) : null }

                        { children }
                    </motion.div>
                </motion.div>
            ) : null }
        </AnimatePresence>
    )
}