import React, { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RxCross2 as CancelIcon } from "react-icons/rx"
import IconButton from "@components/global/IconButton"
import classNames from "classnames"

export interface ModalProps {
    isVisible: boolean,
    toggle: () => void
    title?: string
    className?: string
    hideIcon?: boolean
    children: ReactNode
}

export default function Modal( props: ModalProps ){
    const { isVisible, toggle, title, children, className, hideIcon } = props

    const canteredClassName = classNames( 'z-[999] box rounded-xl max-w-[530px] w-[90%] py-4 px-6 border border-solid border-gray-300', className )

    const headerMarkup = ! hideIcon || title ? (
        <div className="flex justify-between items-center pb-1">
            <h3 className="text-xl font-bold text-gray-800">{ title }</h3>
            { ! hideIcon ? (
                <div>
                    <IconButton onClick={ toggle } className="p-3">
                        <CancelIcon size="20"/>
                    </IconButton>
                </div>
            ) : null }
        </div>
    ) : null

    return (
        <AnimatePresence>
            { isVisible ? (
                <div className="fixed w-[100vw] h-[100vh] left-0 top-0 flex items-center justify-center z-[99]">
                    <motion.div
                        className="absolute w-full h-full left-0 top-0"
                        style={ { background: "rgba(194, 202, 214, 0.3)" } }
                        initial={ { opacity: 0 } }
                        animate={ { opacity: 1 } }
                        exit={ { opacity: 0 } }
                        transition={ { duration: 0.2 } }
                        onClick={ toggle }
                    />
                    <motion.div
                        className={ canteredClassName }
                        initial={ { opacity: 0, y: -10 } }
                        animate={ { opacity: 1, y: 0 } }
                        exit={ { opacity: 0, y: 10 } }
                        transition={ { duration: 0.3 } }
                    >
                        { headerMarkup }

                        { children }
                    </motion.div>
                </div>
            ) : null }
        </AnimatePresence>
    )
}