"use client"
import React, {PropsWithChildren} from 'react'
import { motion, AnimatePresence } from "framer-motion"

function AnimatedComponent( {children}:PropsWithChildren) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ delay: 0.25 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

export default AnimatedComponent